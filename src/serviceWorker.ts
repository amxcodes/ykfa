// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// This service worker configuration provides offline capabilities, 
// faster loading of cached resources, and background updates.

// Ultra-minimal service worker implementation
// Only focused on current page resources with strict memory limits

// Using minimal type declarations for service worker APIs
declare const self: any;

// Single cache for current page only
const CURRENT_PAGE_CACHE = 'current-page-only-v1';

// Installation - do nothing but activate immediately
self.addEventListener('install', (event: any) => {
  self.skipWaiting();
});

// Activation - clean all caches except current
self.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CURRENT_PAGE_CACHE)
            .map(name => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
      .catch(() => {})
  );
});

// Transparent 1x1 GIF inline data (40 bytes total)
const TRANSPARENT_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

// Main fetch handler - extremely restricted
self.addEventListener('fetch', (event: any) => {
  const request = event.request;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Check if this is current page navigation
  if (request.mode === 'navigate') {
    // For navigation, use simple pass-through to network
    return;
  }
  
  // Skip all third-party requests
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // Skip all background requests
  if (request.destination === 'image' && 
     !request.url.includes('favicon') && 
     !request.url.includes('logo') && 
     !request.url.includes('icon')) {
    // Return tiny transparent GIF for all non-critical images
    event.respondWith(
      new Response(
        TRANSPARENT_GIF.substr(TRANSPARENT_GIF.indexOf(',') + 1),
        { 
          status: 200, 
          headers: { 'Content-Type': 'image/gif' }
        }
      )
    );
    return;
  }
  
  // Only cache current page HTML and critical resources
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone the response to store in cache
          const responseToCache = response.clone();
          
          // Update cache for current page only
          caches.open(CURRENT_PAGE_CACHE)
            .then(cache => {
              // Only store HTML and its essential resources
              cache.put(request, responseToCache);
              
              // Limit cache size to 5 entries
              cache.keys().then(keys => {
                if (keys.length > 5) {
                  // Delete oldest entries
                  keys.slice(0, keys.length - 5).forEach(key => {
                    cache.delete(key);
                  });
                }
              });
            })
            .catch(() => {});
          
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(request) as Promise<Response>;
        })
    );
    return;
  }
  
  // For other resources (scripts, styles), just pass through to network
  // Don't attempt to cache or intercept
});

// Minimal registration function
export function register() {
  if ('serviceWorker' in navigator) {
    // Only register after page is fully loaded
    window.addEventListener('load', () => {
      // Delay registration to prioritize page resources loading first
      setTimeout(() => {
        navigator.serviceWorker.register('/serviceWorker.js')
          .catch(() => {});
      }, 10000);
    });
  }
}

// Unregister function (only one we need)
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(() => {});
  }
} 