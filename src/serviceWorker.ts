// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// This service worker configuration provides offline capabilities, 
// faster loading of cached resources, and background updates.

// Type definitions for service worker
interface WorkerGlobalScope {
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  location: Location;
}

interface Clients {
  claim(): Promise<void>;
}

interface ServiceWorkerGlobalScope extends WorkerGlobalScope {
  skipWaiting(): Promise<void>;
  clients: Clients;
  registration: ServiceWorkerRegistration;
  caches: CacheStorage;
}

declare const self: ServiceWorkerGlobalScope;

// Custom type definitions
interface ExtendableEvent extends Event {
  waitUntil(promise: Promise<any>): void;
}

interface FetchEvent extends Event {
  request: Request;
  respondWith(response: Promise<Response> | Response): void;
}

// Performance configuration - minimalist mode
const ENABLE_LOGGING = false;
const ULTRA_LIGHT_MODE = true;

// Very limited cache configuration
const CACHE_NAMES = {
  STATIC: 'ykfa-static-v6',
  IMAGES: 'ykfa-images-v6'
};

// Extremely small cache limits to prevent memory growth
const CACHE_LIMITS = {
  STATIC: 5,  // Only essential files
  IMAGES: 5   // Only essential images
};

// Only the absolute essentials
const CRITICAL_ASSETS = [
  '/',
  '/index.html'
];

// Minimal network timeout
const FETCH_TIMEOUT = 2000;

// Track active fetch operations
let activeFetchCount = 0;
const MAX_CONCURRENT_FETCHES = 2; // Strictly limit concurrent fetches

// Very simplified logging - errors only
function logError(message: string, ...args: any[]) {
  console.error(message, ...args);
}

// Minimal fetch with timeout
const fetchWithTimeout = (request: Request, timeoutMs = FETCH_TIMEOUT) => {
  // Skip all image requests except favicon and logo
  if (request.destination === 'image') {
    const url = request.url;
    if (!url.includes('favicon') && !url.includes('logo')) {
      // Return empty transparent GIF for all non-essential images
      return Promise.resolve(new Response(
        'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        { 
          status: 200, 
          headers: { 'Content-Type': 'image/gif;base64' }
        }
      ));
    }
  }

  // Strictly limit concurrent requests
  if (activeFetchCount >= MAX_CONCURRENT_FETCHES) {
    // Skip non-essential requests when at limit
    if (request.destination !== 'document' && !request.url.includes('index.html')) {
      return Promise.resolve(new Response('Too many requests', { status: 429 }));
    }
  }
  
  activeFetchCount++;
  
  return new Promise<Response>((resolve, reject) => {
    const controller = new AbortController();
    const { signal } = controller;
    
    const timeout = setTimeout(() => {
      controller.abort();
      activeFetchCount--;
      reject(new Error('Timeout'));
    }, timeoutMs);
    
    fetch(request, { 
      signal,
      credentials: 'omit', // Skip credentials for better performance
      mode: 'cors',
      cache: 'force-cache' // Prefer browser cache when available
    })
    .then(response => {
      clearTimeout(timeout);
      activeFetchCount--;
      resolve(response);
    })
    .catch(error => {
      clearTimeout(timeout);
      activeFetchCount--;
      reject(error);
    });
  });
};

// Extremely minimal cache trimming
const trimCache = async (cacheName: string, maxItems: number) => {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length <= maxItems) return;
    
    // Delete all but the most recent items
    const itemsToDelete = keys.slice(0, keys.length - maxItems);
    await Promise.all(itemsToDelete.map(key => cache.delete(key)));
  } catch (error) {
    // Ignore errors
  }
};

// Minimalist configuration - focus on static content only
const CACHE_NAME = 'ykfa-static-v7';
const HOMEPAGE_URL = '/';

// Install handler - only cache homepage
self.addEventListener('install', (event => {
  const extEvent = event as ExtendableEvent;
  self.skipWaiting();
  
  // Only cache the homepage
  extEvent.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.add(HOMEPAGE_URL))
      .catch(() => {})
  );
}) as EventListener);

// Activate handler - clean up old caches
self.addEventListener('activate', (event => {
  const extEvent = event as ExtendableEvent;
  
  extEvent.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
      .catch(() => {})
  );
}) as EventListener);

// Transparent 1x1 GIF (much smaller than base64)
const TRANSPARENT_GIF_URL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

// Fetch handler - ultra minimal
self.addEventListener('fetch', (event => {
  const fetchEvent = event as FetchEvent;
  const request = fetchEvent.request;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Handle different types of requests
  if (request.mode === 'navigate') {
    // For navigation requests, use cache with network fallback
    fetchEvent.respondWith(
      caches.match(request)
        .then(response => {
          // Explicitly handle undefined case
          return response || fetch(request)
            .catch(() => {
              // If fetch fails, fallback to homepage
              return caches.match(HOMEPAGE_URL)
                .then(homeResponse => {
                  // Handle possible undefined
                  return homeResponse || new Response('', { 
                    status: 200, 
                    headers: { 'Content-Type': 'text/html' }
                  });
                });
            });
        })
    );
    return;
  }
  
  // For images, return transparent GIF for most requests to save memory/bandwidth
  if (request.destination === 'image') {
    const url = request.url;
    // Only fetch critical images
    if (!url.includes('favicon') && !url.includes('logo') && !url.includes('icon')) {
      fetchEvent.respondWith(
        new Response(
          // Use smallest possible transparent GIF
          TRANSPARENT_GIF_URL.substr(TRANSPARENT_GIF_URL.indexOf(',') + 1),
          { 
            status: 200, 
            headers: { 'Content-Type': 'image/gif' }
          }
        )
      );
      return;
    }
  }
  
  // For all other requests, use cache-first approach
  fetchEvent.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Return cached response if available
        if (cachedResponse) return cachedResponse;
        
        // Otherwise fetch from network but don't cache the result
        return fetch(request)
          .catch(() => new Response('', { status: 408 }));
      })
  );
}) as EventListener);

// Delayed registration
export function register() {
  if ('serviceWorker' in navigator) {
    // Register after a long delay
    window.addEventListener('load', () => {
      setTimeout(() => {
        navigator.serviceWorker.register('/serviceWorker.js')
          .catch(() => {});
      }, 10000);
    });
  }
}

// Only unregister is needed - other functions are removed to reduce code size
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(() => {});
  }
} 