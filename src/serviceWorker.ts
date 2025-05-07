// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// Cache name with version
const CACHE_NAME = 'ykfa-cache-v1';

// Assets to cache for offline use
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  '/icons/dumbbell-small.svg',
  '/offline.html',
  'https://i.postimg.cc/g0mqFF16/favicon.png',  // Fallback favicon
];

// Install service worker and cache static assets
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch(error => console.error('Service worker installation failed:', error))
  );
});

// Listen for fetch events
self.addEventListener('fetch', (event: FetchEvent) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.includes('i.postimg.cc')) {
    return;
  }

  // Network first strategy for dynamic content
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If network fails, serve offline page
          return caches.match('/offline.html') || caches.match('/');
        })
    );
    return;
  }

  // For images, try cache first, then network, then fallback
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request)
            .then(response => {
              // Cache successful responses
              if (response && response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, responseClone);
                });
              }
              return response;
            })
            .catch(() => {
              // If both cache and network fail, return fallback image
              if (event.request.url.includes('dumbbell-small.svg')) {
                return caches.match('https://i.postimg.cc/g0mqFF16/favicon.png');
              }
              return new Response('Image not available offline', { status: 404 });
            });
        })
    );
    return;
  }
  
  // Cache first strategy for static assets
  if (event.request.destination === 'script' || 
      event.request.destination === 'style' || 
      event.request.destination === 'font') {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If not in cache, try network
          return fetch(event.request)
            .then(response => {
              // Cache successful responses
              if (response && response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, responseClone);
                });
              }
              return response;
            });
        })
    );
    return;
  }

  // For everything else, use network with cache fallback
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses for future offline use
        if (response && response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Clean up old caches when new service worker activates
self.addEventListener('activate', (event: ExtendableEvent) => {
  const currentCaches = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!currentCaches.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated and controlling the page');
      return (self as any).clients.claim();
    })
  );
});

// Handle service worker messages from the application
self.addEventListener('message', (event: MessageEvent) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    (self as any).skipWaiting();
  }
});

// Register the service worker
export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/serviceWorker.js';
      navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
          console.log('ServiceWorker registration successful');
          
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('New content is available; please refresh.');
                } else {
                  console.log('Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch(error => {
          console.error('Error during service worker registration:', error);
        });
    });
  }
}

// Unregister service worker
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
} 