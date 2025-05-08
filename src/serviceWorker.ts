// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// This service worker configuration provides offline capabilities, 
// faster loading of cached resources, and background updates.

// Cache names with versions - update these when making significant changes
const CACHE_NAMES = {
  STATIC: 'ykfa-static-v2',
  IMAGES: 'ykfa-images-v2',
  DYNAMIC: 'ykfa-dynamic-v2',
  FONTS: 'ykfa-fonts-v2'
};

// Assets to cache for offline use - critical resources
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  '/offline.html',
];

// Extended cache list - non-critical resources that improve offline experience
const EXTENDED_CACHE = [
  // Extend with app assets like CSS, JS, etc.
];

// Maximum timeout for network requests
const FETCH_TIMEOUT = 8000; // 8 seconds

// Add timing functionality for fetch requests
const fetchWithTimeout = (request: Request, timeoutMs = FETCH_TIMEOUT) => {
  return new Promise<Response>((resolve, reject) => {
    // Create abort controller for timeout
    const controller = new AbortController();
    const { signal } = controller;
    
    // Set timeout to abort fetch
    const timeout = setTimeout(() => {
      controller.abort();
      reject(new Error('Request timed out'));
    }, timeoutMs);
    
    // Start fetch with abort signal
    fetch(request, { signal })
      .then(response => {
        clearTimeout(timeout);
        resolve(response);
      })
      .catch(error => {
        clearTimeout(timeout);
        reject(error);
      });
  });
};

// Cache static assets on install
self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('[ServiceWorker] Installing...');
  
  // Skip waiting to activate new SW immediately
  (self as any).skipWaiting();
  
  event.waitUntil(
    Promise.all([
      // Cache critical assets with timeout
      caches.open(CACHE_NAMES.STATIC).then(cache => {
        console.log('[ServiceWorker] Caching critical assets');
        
        // Use Promise.allSettled to continue even if some assets fail
        return Promise.allSettled(
          CRITICAL_ASSETS.map(url => 
            fetchWithTimeout(new Request(url))
              .then(response => {
                if (response.ok) {
                  return cache.put(url, response);
                }
                console.warn(`[ServiceWorker] Failed to cache: ${url} (${response.status})`);
                return Promise.resolve();
              })
              .catch(error => {
                console.warn(`[ServiceWorker] Failed to fetch: ${url}`, error);
                return Promise.resolve();
              })
          )
        );
      }),
    ])
    .catch(error => console.error('[ServiceWorker] Installation failed:', error))
    .finally(() => {
      console.log('[ServiceWorker] Installation complete');
    })
  );
});

// Activate new service worker and clean up old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('[ServiceWorker] Activating...');
  
  const currentCaches = Object.values(CACHE_NAMES);
  
  event.waitUntil(
    // Clean up old caches
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!currentCaches.includes(cacheName)) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        }).filter(Boolean) // Remove undefined values
      );
    })
    .then(() => {
      console.log('[ServiceWorker] Activated and controlling the page');
      return (self as any).clients.claim();
    })
    .catch(error => {
      console.error('[ServiceWorker] Activation error:', error);
    })
  );
});

// Cache-first strategy with timeout for static assets
const cacheFirstStrategy = async (event: FetchEvent, cacheName: string) => {
  try {
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Not in cache, get from network with timeout
    try {
      const networkResponse = await fetchWithTimeout(event.request.clone());
      
      // Only cache valid responses
      if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
        const cache = await caches.open(cacheName);
        cache.put(event.request, networkResponse.clone());
      }
      
      return networkResponse;
    } catch (error) {
      console.error('[ServiceWorker] Fetch failed for:', event.request.url, error);
      throw error;
    }
  } catch (error) {
    console.error('[ServiceWorker] Cache first strategy failed:', error);
    // Return an empty response rather than failing completely
    return new Response('', { status: 408, statusText: 'Request Timeout' });
  }
};

// Network-first strategy with fallback to cache and reduced timeout
const networkFirstStrategy = async (event: FetchEvent, cacheName: string) => {
  try {
    // Try network first with timeout
    try {
      const networkResponse = await fetchWithTimeout(event.request.clone(), 5000); // shorter timeout
      
      // Cache valid responses for future offline use
      if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
        const cache = await caches.open(cacheName);
        cache.put(event.request, networkResponse.clone());
      }
      
      return networkResponse;
    } catch (error) {
      console.log('[ServiceWorker] Network fetch failed, falling back to cache:', event.request.url);
      
      // Fall back to cache
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // If it's a navigation request, return offline page
      if (event.request.mode === 'navigate') {
        const offlineResponse = await caches.match('/offline.html');
        if (offlineResponse) {
          return offlineResponse;
        }
        return caches.match('/');
      }
      
      throw error;
    }
  } catch (error) {
    console.error('[ServiceWorker] Network first strategy failed completely:', error);
    // Return a minimal response rather than breaking completely
    return new Response('Network error', { 
      status: 503, 
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};

// Simpler stale-while-revalidate strategy for images - less likely to hang
const staleWhileRevalidateStrategy = async (event: FetchEvent, cacheName: string) => {
  try {
    // Check cache first
    const cachedResponse = await caches.match(event.request);
    
    // Start network fetch but don't wait for it to complete before responding
    const fetchPromise = fetchWithTimeout(event.request.clone())
      .then(networkResponse => {
        // Only cache valid responses
        if (networkResponse && networkResponse.status === 200) {
          caches.open(cacheName).then(cache => {
            cache.put(event.request, networkResponse.clone());
          }).catch(err => console.error('[ServiceWorker] Error caching image:', err));
        }
        return networkResponse;
      })
      .catch(error => {
        console.log('[ServiceWorker] Image fetch failed:', error);
        return cachedResponse || new Response('Image not available', { 
          status: 404, 
          statusText: 'Not Found' 
        });
      });
    
    // Return cached response immediately if available, otherwise wait for network
    return cachedResponse || fetchPromise;
  } catch (error) {
    console.error('[ServiceWorker] Image strategy failed completely:', error);
    return new Response('Image error', { status: 500, statusText: 'Internal Error' });
  }
};

// Listen for fetch events with proper error handling to prevent site hanging
self.addEventListener('fetch', (event: FetchEvent) => {
  try {
    const url = new URL(event.request.url);
    
    // Skip non-GET requests and most cross-origin requests to prevent issues
    if (
      event.request.method !== 'GET' || 
      (!url.origin.includes(self.location.origin) && 
       !url.hostname.includes('i.postimg.cc') && 
       !url.hostname.includes('fonts.googleapis.com'))
    ) {
      return;
    }

    // Choose caching strategy based on request type
    
    // HTML navigation - network first with offline fallback
    if (event.request.mode === 'navigate') {
      event.respondWith(networkFirstStrategy(event, CACHE_NAMES.DYNAMIC));
      return;
    }
    
    // Images - stale-while-revalidate with fallback
    if (event.request.destination === 'image') {
      event.respondWith(staleWhileRevalidateStrategy(event, CACHE_NAMES.IMAGES));
      return;
    }
    
    // Fonts - cache first for performance
    if (
      event.request.destination === 'font' ||
      url.pathname.endsWith('.woff') ||
      url.pathname.endsWith('.woff2') ||
      url.pathname.endsWith('.ttf')
    ) {
      event.respondWith(cacheFirstStrategy(event, CACHE_NAMES.FONTS));
      return;
    }
    
    // Scripts and styles - cache first for performance
    if (event.request.destination === 'script' || event.request.destination === 'style') {
      event.respondWith(cacheFirstStrategy(event, CACHE_NAMES.STATIC));
      return;
    }
    
    // Everything else - network first with cache fallback
    event.respondWith(networkFirstStrategy(event, CACHE_NAMES.DYNAMIC));
  } catch (error) {
    console.error('[ServiceWorker] Error in fetch handler:', error);
    // Don't let the service worker crash - allow default browser fetch
  }
});

// Handle service worker messages from the application
self.addEventListener('message', (event: MessageEvent) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    (self as any).skipWaiting();
  }
  
  // Handle abort requests for pending network requests
  if (event.data && event.data.type === 'ABORT_PENDING_REQUESTS') {
    console.log('[ServiceWorker] Received abort request, cleaning up pending requests');
    // This will be picked up by the fetch timeout mechanism and cause them to abort
    (self as any)._abortPendingRequests = true;
    
    // If browser supports, remove any pending fetch operations
    // Note: This doesn't actually abort fetch requests, but it helps future code know
    // that it should abort any new requests
    setTimeout(() => {
      (self as any)._abortPendingRequests = false;
    }, 3000);
  }
  
  // Handle cache invalidation messages
  if (event.data && event.data.type === 'INVALIDATE_CACHE') {
    const cacheToInvalidate = event.data.cacheName || CACHE_NAMES.DYNAMIC;
    const urlToInvalidate = event.data.url;
    
    if (urlToInvalidate) {
      // Invalidate specific URL
      caches.open(cacheToInvalidate).then(cache => {
        cache.delete(urlToInvalidate).then(success => {
          console.log(`[ServiceWorker] Cache invalidation ${success ? 'successful' : 'failed'} for ${urlToInvalidate}`);
        });
      });
    } else {
      // Invalidate entire cache
      caches.delete(cacheToInvalidate).then(success => {
        console.log(`[ServiceWorker] Cache deletion ${success ? 'successful' : 'failed'} for ${cacheToInvalidate}`);
      });
    }
  }
});

// Register the service worker
export function register() {
  if ('serviceWorker' in navigator) {
    // Use a timeout to ensure the app loads even if SW registration has issues
    const registrationTimeout = setTimeout(() => {
      console.warn('[ServiceWorker] Registration timed out - proceeding with app startup');
    }, 5000);
    
    window.addEventListener('load', () => {
      const swUrl = '/serviceWorker.js';
      
      navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
          clearTimeout(registrationTimeout);
          console.log('[ServiceWorker] Registration successful:', registration.scope);
          
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }
            
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New content available
                  console.log('[ServiceWorker] New content is available; please refresh.');
                  
                  // Optional: Show refresh UI to user
                  dispatchUpdateEvent();
                } else {
                  // Content is cached for offline use
                  console.log('[ServiceWorker] Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch(error => {
          clearTimeout(registrationTimeout);
          console.error('[ServiceWorker] Error during registration:', error);
        });
    });
  }
}

// Dispatch an event to notify the app about service worker updates
function dispatchUpdateEvent() {
  const event = new CustomEvent('serviceWorkerUpdate', {
    detail: { type: 'NEW_CONTENT' }
  });
  window.dispatchEvent(event);
}

// Update the service worker
export function update() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.update();
    });
  }
}

// Manually skip waiting and reload page to activate new service worker
export function activateUpdate() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      if (registration.waiting) {
        // Send skip waiting message
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Refresh page to activate new service worker
        window.location.reload();
      }
    });
  }
}

// Unregister service worker - can be called to fix service worker issues
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
        console.log('[ServiceWorker] Successfully unregistered');
        // Optionally reload the page after unregistering
        // window.location.reload();
      })
      .catch(error => {
        console.error('[ServiceWorker] Error unregistering:', error.message);
      });
  }
}

// Utility function to invalidate specific cache entries
export function invalidateCache(url?: string, cacheName?: string) {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'INVALIDATE_CACHE',
      url,
      cacheName
    });
  }
} 