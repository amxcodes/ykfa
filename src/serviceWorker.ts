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

// Performance configuration
const ENABLE_LOGGING = false; // Disable most logging to improve performance
const ULTRA_LIGHT_MODE = true; // Enable ultra-light mode for maximum performance

// Cache names with versions - update these when making significant changes
const CACHE_NAMES = {
  STATIC: 'ykfa-static-v5', // Incremented version
  IMAGES: 'ykfa-images-v5', // Incremented version
  DYNAMIC: 'ykfa-dynamic-v5', // Incremented version
  FONTS: 'ykfa-fonts-v5' // Incremented version
};

// Maximum number of items to store in each cache
const CACHE_LIMITS = {
  STATIC: 20,  // Further reduced from 30
  IMAGES: 15,  // Further reduced from 30
  DYNAMIC: 10, // Further reduced from 20
  FONTS: 5     // Further reduced from 10
};

// Critical path resources that must be cached for fast loading
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
];

// Maximum timeout for network requests
const FETCH_TIMEOUT = 2500; // Further reduced from 3000ms to 2500ms

// Track active fetch operations
let activeFetchCount = 0;
const MAX_CONCURRENT_FETCHES = 3; // Further reduced from 4 to 3
const pendingFetches = new Set();

// Last time memory cleanup was performed (to avoid frequent checks)
let lastMemoryCleanupTime = 0;
const MEMORY_CLEANUP_INTERVAL = 60 * 60 * 1000; // 60 minutes (increased from 15 minutes)

// Helper function to conditionally log messages
function logDebug(message: string, ...args: any[]) {
  if (ENABLE_LOGGING) {
    console.log(message, ...args);
  }
}

function logWarning(message: string, ...args: any[]) {
  if (ENABLE_LOGGING) {
    console.warn(message, ...args);
  }
}

function logError(message: string, ...args: any[]) {
  // Always log errors
  console.error(message, ...args);
}

// Add timing functionality for fetch requests - optimized
const fetchWithTimeout = (request: Request, timeoutMs = FETCH_TIMEOUT) => {
  // Check if we're in ultra-light mode and this is a non-essential request
  if (ULTRA_LIGHT_MODE) {
    const url = request.url;
    // Skip all image requests except favicon
    if (
      request.destination === 'image' && 
      !url.includes('favicon')
    ) {
      // In ultra-light mode, check if we have the image cached first
      return caches.match(request).then(cached => {
        if (cached) {
          // Use cached version
          return cached;
        }
        // Otherwise fetch only essential images
        if (url.includes('logo') || url.includes('icon')) {
          // Continue with fetch for essential images
        } else {
          // Skip non-essential images in ultra-light mode
          return Promise.reject(new Error('Non-essential resource skipped in ultra-light mode'));
        }
      });
    }
  }

  // Skip fetching for non-critical resources when we have too many active fetches
  if (activeFetchCount >= MAX_CONCURRENT_FETCHES) {
    const url = request.url;
    const isImportant = 
      url.includes('index.html') || 
      url.includes('/api/') || 
      request.mode === 'navigate';
    
    if (!isImportant) {
      return Promise.reject(new Error('Too many concurrent requests'));
    }
  }
  
  activeFetchCount++;
  const requestId = Date.now().toString(36).slice(-4) + Math.random().toString(36).slice(-4);
  pendingFetches.add(requestId);
  
  return new Promise<Response>((resolve, reject) => {
    // Create abort controller for timeout
    const controller = new AbortController();
    const { signal } = controller;
    
    // Set timeout to abort fetch
    const timeout = setTimeout(() => {
      controller.abort();
      reject(new Error('Request timed out'));
      cleanup();
    }, timeoutMs);
    
    // Cleanup function to prevent memory leaks
    const cleanup = () => {
      clearTimeout(timeout);
      activeFetchCount--;
      pendingFetches.delete(requestId);
    };
    
    // Check global abort flag
    if ((self as any)._abortPendingRequests) {
      cleanup();
      reject(new Error('Request aborted by system'));
      return;
    }
    
    // Start fetch with abort signal and minimal headers
    const fetchOptions: RequestInit = { 
      signal,
      // Skip integrity and credentials checks for better performance 
      mode: 'cors',
      credentials: 'omit',
      redirect: 'follow'
    };
    
    fetch(request, fetchOptions)
      .then(response => {
        cleanup();
        resolve(response);
      })
      .catch(error => {
        cleanup();
        reject(error);
      });
  });
};

// Cache management - trim caches to prevent them from growing too large
const trimCache = async (cacheName: string, maxItems: number) => {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length <= maxItems) return;
    
    // Delete older items very aggressively - keep only what's needed
    const itemsToKeep = Math.floor(maxItems * 0.7); // Keep only 70% of max
    const itemsToDelete = keys.slice(0, keys.length - itemsToKeep);
    
    logDebug(`[ServiceWorker] Aggressively trimming cache ${cacheName}: ${keys.length} items to ${itemsToKeep}`);
    
    await Promise.all(itemsToDelete.map(key => cache.delete(key)));
  } catch (error) {
    logError('[ServiceWorker] Error trimming cache:', error);
  }
};

// Memory cleanup function - optimized to minimize processing time
const performMemoryCleanup = async () => {
  const now = Date.now();
  
  // Only perform cleanup if enough time has passed since last cleanup
  if (now - lastMemoryCleanupTime < MEMORY_CLEANUP_INTERVAL) {
    return;
  }
  
  logDebug('[ServiceWorker] Performing scheduled memory cleanup');
  lastMemoryCleanupTime = now;
  
  // Reset counters
  activeFetchCount = 0;
  pendingFetches.clear();
  
  // Immediately abort any pending requests
  (self as any)._abortPendingRequests = true;
  setTimeout(() => {
    (self as any)._abortPendingRequests = false;
  }, 1000);
  
  // Trim all caches aggressively - execute in sequence to reduce peak memory
  try {
    for (const [type, name] of Object.entries(CACHE_NAMES)) {
      const limit = CACHE_LIMITS[type as keyof typeof CACHE_LIMITS] || 10;
      await trimCache(name, limit);
    }
    
    // Attempt to free up additional memory
    if ('gc' in self && typeof (self as any).gc === 'function') {
      (self as any).gc();
    }
  } catch (error) {
    logError('[ServiceWorker] Memory cleanup error:', error);
  }
};

// Cache static assets on install - minimal approach
self.addEventListener('install', ((event: Event) => {
  const extEvent = event as ExtendableEvent;
  logDebug('[ServiceWorker] Installing...');
  
  // Skip waiting to activate new SW immediately
  (self as any).skipWaiting();
  
  // Only cache absolutely critical assets during install
  extEvent.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAMES.STATIC);
        
        // Only cache the homepage and offline page
        for (const url of CRITICAL_ASSETS) {
          try {
            const response = await fetch(new Request(url), {
              cache: 'reload', // Bypass browser cache for fresh content
              credentials: 'omit' // Skip credentials for performance
            });
            
            if (response.ok) {
              await cache.put(url, response);
            }
          } catch (err) {
            // Silently continue if an asset fails
          }
        }
        
        logDebug('[ServiceWorker] Critical assets cached');
      } catch (error) {
        logError('[ServiceWorker] Installation failed:', error);
      }
    })()
  );
}) as EventListener);

// Activate new service worker and clean up old caches
self.addEventListener('activate', ((event: Event) => {
  const extEvent = event as ExtendableEvent;
  logDebug('[ServiceWorker] Activating...');
  
  const currentCaches = Object.values(CACHE_NAMES);
  
  extEvent.waitUntil(
    (async () => {
      try {
        // Clean up old caches
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter(cacheName => !currentCaches.includes(cacheName))
            .map(cacheName => {
              logDebug('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
        
        // Initialize lastMemoryCleanupTime
        lastMemoryCleanupTime = Date.now();
        
        logDebug('[ServiceWorker] Activated and controlling the page');
        return (self as any).clients.claim();
      } catch (error) {
        logError('[ServiceWorker] Activation error:', error);
      }
    })()
  );
}) as EventListener);

// Ultra simplified stale-while-revalidate for images - bare minimum for images
const imageStrategy = async (event: FetchEvent, cacheName: string): Promise<Response> => {
  try {
    // Check cache first
    const cachedResponse = await caches.match(event.request);
    
    // Always return cached version if available in ultra-light mode
    if (cachedResponse) {
      // Only update rarely (once per week) to minimize network usage
      const headers = cachedResponse.headers;
      const cachedTime = headers.get('sw-cache-timestamp');
      const now = Date.now();
      
      // Only update if no timestamp or older than 7 days
      if (!cachedTime || (now - parseInt(cachedTime, 10) > 7 * 24 * 60 * 60 * 1000)) {
        fetch(event.request.clone()).then(response => {
          if (response && response.status === 200) {
            caches.open(cacheName).then(cache => {
              const headers = new Headers(response.headers);
              headers.set('sw-cache-timestamp', now.toString());
              const newResponse = new Response(response.clone().body, {
                status: response.status,
                headers
              });
              cache.put(event.request, newResponse);
            }).catch(() => {});
          }
        }).catch(() => {});
      }
      
      return cachedResponse;
    }
    
    // For non-cached in ultra-light mode, only fetch essential images
    if (ULTRA_LIGHT_MODE) {
      const url = event.request.url;
      if (!url.includes('logo') && !url.includes('icon') && !url.includes('favicon')) {
        return new Response('Image skipped in ultra-light mode', { 
          status: 204
        });
      }
    }
    
    // If not in cache, fetch from network (only for essential images)
    try {
      const networkResponse = await fetchWithTimeout(event.request.clone());
      
      if (networkResponse && networkResponse.status === 200) {
        // Store response in cache for future use
        caches.open(cacheName).then(cache => {
          const headers = new Headers(networkResponse.headers);
          headers.set('sw-cache-timestamp', Date.now().toString());
          
          const timestampedResponse = new Response(networkResponse.clone().body, {
            status: networkResponse.status,
            statusText: networkResponse.statusText,
            headers
          });
          
          cache.put(event.request, timestampedResponse);
        }).catch(() => {});
      }
      
      // Ensure we never return undefined
      return networkResponse || new Response(
        'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        { 
          status: 200, 
          headers: { 'Content-Type': 'image/gif;base64' }
        }
      );
    } catch (error) {
      // For images, return a tiny transparent image instead
      return new Response(
        'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        { 
          status: 200, 
          headers: { 'Content-Type': 'image/gif;base64' }
        }
      );
    }
  } catch (error) {
    // Return transparent gif for any image error
    return new Response(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      { 
        status: 200, 
        headers: { 'Content-Type': 'image/gif;base64' }
      }
    );
  }
};

// Helper function to create an error response HTML that auto-redirects to homepage
function createRedirectErrorPage(title: string, message: string, redirectDelay: number = 5): Response {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      padding: 20px;
      text-align: center;
      color: #333;
      background-color: #f7f7f7;
    }
    .container {
      max-width: 500px;
      padding: 30px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    h1 {
      margin-top: 0;
      color: #e53935;
    }
    p {
      margin-bottom: 25px;
      line-height: 1.5;
    }
    .countdown {
      font-weight: bold;
      font-size: 18px;
      color: #2196F3;
    }
    .back-button {
      display: inline-block;
      background: #2196F3;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
    }
    .back-button:hover {
      background: #1976D2;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${title}</h1>
    <p>${message}</p>
    <p class="countdown">Redirecting to homepage in <span id="seconds">${redirectDelay}</span> seconds</p>
    <a href="/" class="back-button">Go to Homepage Now</a>
  </div>
  <script>
    let seconds = ${redirectDelay};
    const countdown = document.getElementById('seconds');
    
    // Update countdown timer
    const timer = setInterval(() => {
      seconds--;
      if (countdown) countdown.textContent = seconds.toString();
      if (seconds <= 0) {
        clearInterval(timer);
        window.location.href = '/';
      }
    }, 1000);
    
    // Add event listener to handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && seconds <= 1) {
        window.location.href = '/';
      }
    });
  </script>
</body>
</html>
  `;
  
  return new Response(htmlContent, {
    status: 200,
    headers: { 'Content-Type': 'text/html' }
  });
}

// Cache-first strategy for static assets - optimized for speed
const cacheFirstStrategy = async (event: FetchEvent, cacheName: string): Promise<Response> => {
  try {
    // Check cache first for maximum speed
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Not in cache, get from network with timeout
    try {
      const networkResponse = await fetchWithTimeout(event.request.clone());
      
      // Only cache valid responses that are not too large
      if (
        networkResponse && 
        networkResponse.status === 200 && 
        networkResponse.type === 'basic'
      ) {
        // Don't await cache operations to speed up response
        caches.open(cacheName).then(cache => {
          cache.put(event.request, networkResponse.clone());
          
          // Extremely low probability trim to minimize processing
          if (Math.random() < 0.01) { // Only 1% chance
            trimCache(cacheName, CACHE_LIMITS[cacheName as keyof typeof CACHE_LIMITS] || 20);
          }
        }).catch(() => {
          // Silently ignore cache errors
        });
      }
      
      // Ensure we never return undefined
      return networkResponse || new Response('', { status: 408, statusText: 'Request Timeout' });
    } catch (error) {
      logWarning('[ServiceWorker] Fetch failed for:', event.request.url);
      throw error;
    }
  } catch (error) {
    // Return an empty response rather than failing completely
    return new Response('', { status: 408, statusText: 'Request Timeout' });
  }
};

// Helper function to ensure we never return undefined from cache.match
async function safeMatch(request: Request, cacheName: string): Promise<Response | null> {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    return cachedResponse || null;
  } catch (error) {
    return null;
  }
}

// Network-first strategy with fallback to cache - optimized for speed
const networkFirstStrategy = async (event: FetchEvent, cacheName: string): Promise<Response> => {
  try {
    // For navigation, always try cache first for better speed
    if (event.request.mode === 'navigate') {
      try {
        const cachedResponse = await safeMatch(event.request, cacheName);
        if (cachedResponse) {
          // Try to update cache in the background
          fetchWithTimeout(event.request.clone(), 5000)
            .then(response => {
              if (response && response.status === 200) {
                caches.open(cacheName).then(cache => {
                  cache.put(event.request, response);
                }).catch(() => {
                  // Silently ignore errors
                });
              }
            })
            .catch(() => {
              // Silently ignore errors
            });
          return cachedResponse;
        }
      } catch (err) {
        // Silently continue to network request
      }
    }
    
    // Try network with short timeout
    try {
      const networkResponse = await fetchWithTimeout(event.request.clone());
      
      // Cache valid responses, but don't block returning the response
      if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
        caches.open(cacheName).then(cache => {
          cache.put(event.request, networkResponse.clone());
        }).catch(() => {
          // Silently ignore cache errors
        });
      }
      
      // Ensure we never return undefined
      return networkResponse || createRedirectErrorPage(
        'Network Error',
        'The server is taking too long to respond. We\'ll take you back to the homepage automatically.',
        5
      );
    } catch (error) {
      // Fall back to cache
      const cachedResponse = await safeMatch(event.request, cacheName);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // If it's a navigation request, return offline page
      if (event.request.mode === 'navigate') {
        const offlineResponse = await safeMatch(new Request('/offline.html'), CACHE_NAMES.STATIC);
        if (offlineResponse) {
          return offlineResponse;
        }
        const rootResponse = await safeMatch(new Request('/'), CACHE_NAMES.STATIC);
        if (rootResponse) {
          return rootResponse;
        }
        // If no offline page is available, return a basic response with auto-redirect
        return createRedirectErrorPage(
          'Offline Mode',
          'You are currently offline. We\'ll redirect you to the homepage automatically when you regain connectivity.',
          8
        );
      }
      
      // Return a default response for non-navigation requests
      return new Response('Resource unavailable offline', { 
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  } catch (error) {
    // For navigation requests, return an auto-redirect error page
    if (event.request.mode === 'navigate') {
      return createRedirectErrorPage(
        'Something Went Wrong',
        'We encountered an unexpected error. We\'ll take you back to the homepage in a few seconds.',
        5
      );
    }
    
    // For other resources, return a minimal response
    return new Response('Network error', { 
      status: 503, 
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};

// Listen for fetch events - high-performance minimal implementation
self.addEventListener('fetch', ((event: Event) => {
  const fetchEvent = event as FetchEvent;
  try {
    const request = fetchEvent.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
      return;
    }
    
    // Skip cross-origin requests except for whitelisted domains
    if (!url.origin.includes(self.location.origin)) {
      const allowedDomains = ['i.postimg.cc', 'fonts.googleapis.com'];
      let allowed = false;
      
      for (const domain of allowedDomains) {
        if (url.hostname.includes(domain)) {
          allowed = true;
          break;
        }
      }
      
      if (!allowed) {
        return;
      }
    }
    
    // Skip all analytics, tracking, non-critical requests
    const skipPatterns = [
      'analytics', 'tracker', 'stats', 'pixel', 'collect',
      'tracking', 'telemetry', 'log', 'metrics', 'monitor', 'beacon'
    ];
    
    for (const pattern of skipPatterns) {
      if (url.hostname.includes(pattern) || url.pathname.includes(pattern)) {
        return;
      }
    }

    // Choose strategy based on request type
    
    // HTML navigation
    if (request.mode === 'navigate') {
      fetchEvent.respondWith(networkFirstStrategy(fetchEvent, CACHE_NAMES.DYNAMIC));
      return;
    }
    
    // Images - use ultra-simplified strategy
    if (request.destination === 'image') {
      fetchEvent.respondWith(imageStrategy(fetchEvent, CACHE_NAMES.IMAGES));
      return;
    }
    
    // Fonts - cache first for performance
    if (
      request.destination === 'font' ||
      url.pathname.endsWith('.woff') ||
      url.pathname.endsWith('.woff2') ||
      url.pathname.endsWith('.ttf')
    ) {
      fetchEvent.respondWith(cacheFirstStrategy(fetchEvent, CACHE_NAMES.FONTS));
      return;
    }
    
    // Scripts and styles - cache first for performance
    if (request.destination === 'script' || request.destination === 'style') {
      fetchEvent.respondWith(cacheFirstStrategy(fetchEvent, CACHE_NAMES.STATIC));
      return;
    }
    
    // Everything else - network first with cache fallback
    fetchEvent.respondWith(networkFirstStrategy(fetchEvent, CACHE_NAMES.DYNAMIC));
  } catch (error) {
    logError('[ServiceWorker] Error in fetch handler:', error);
    // Provide a fallback response if we can't handle the request
    try {
      fetchEvent.respondWith(
        new Response('Service worker error', { 
          status: 500,
          headers: { 'Content-Type': 'text/plain' }
        })
      );
    } catch (e) {
      // Last resort fallback
    }
  }
}) as EventListener);

// Cleanup at extremely long intervals
setInterval(() => {
  // Reset active fetch count if it gets stuck somehow
  if (activeFetchCount > 3 && pendingFetches.size === 0) {
    activeFetchCount = 0;
  }
  
  // Perform memory cleanup
  performMemoryCleanup();
}, 3 * 60 * 60 * 1000); // 3 hours (increased from 30 minutes)

// Handle service worker messages - minimal implementation to reduce overhead
self.addEventListener('message', ((event: Event) => {
  const msgEvent = event as MessageEvent;
  if (msgEvent.data && msgEvent.data.type === 'SKIP_WAITING') {
    (self as any).skipWaiting();
    return;
  }
  
  // Handle abort requests
  if (msgEvent.data && msgEvent.data.type === 'ABORT_PENDING_REQUESTS') {
    (self as any)._abortPendingRequests = true;
    activeFetchCount = 0;
    pendingFetches.clear();
    
    setTimeout(() => {
      (self as any)._abortPendingRequests = false;
    }, 3000);
    return;
  }
  
  // Handle cache invalidation
  if (msgEvent.data && msgEvent.data.type === 'INVALIDATE_CACHE') {
    const cacheToInvalidate = msgEvent.data.cacheName || CACHE_NAMES.DYNAMIC;
    const urlToInvalidate = msgEvent.data.url;
    
    if (urlToInvalidate) {
      caches.open(cacheToInvalidate).then(cache => {
        cache.delete(urlToInvalidate);
      });
    } else {
      caches.delete(cacheToInvalidate);
    }
    return;
  }
  
  // Handle memory cleanup request
  if (msgEvent.data && msgEvent.data.type === 'CLEANUP_MEMORY') {
    activeFetchCount = 0;
    pendingFetches.clear();
    (self as any)._abortPendingRequests = true;
    
    setTimeout(() => {
      (self as any)._abortPendingRequests = false;
    }, 1000);
    
    // Perform full memory cleanup
    performMemoryCleanup();
    // Force immediate cleanup
    lastMemoryCleanupTime = Date.now();
  }
}) as EventListener);

// Register the service worker - optimized for minimal overhead
export function register() {
  if ('serviceWorker' in navigator) {
    // Delay registration until after page is loaded and idle
    const registerSW = () => {
      const swUrl = '/serviceWorker.js';
      navigator.serviceWorker.register(swUrl, {
        // Use updateViaCache: 'none' to ensure fresh content
        updateViaCache: 'none',
        // Only control same-scope pages
        scope: '/'
      })
      .then(registration => {
        logDebug('[ServiceWorker] Registration successful');
        
        // Set up update handling
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                dispatchUpdateEvent();
              }
            };
          }
        };
      })
      .catch(error => {
        logError('[ServiceWorker] Registration error:', error);
      });
    };
    
    // Only register the service worker after page is fully loaded and idle
    if (document.readyState === 'complete') {
      // Use requestIdleCallback if available, or setTimeout as fallback
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(registerSW, { timeout: 2000 });
      } else {
        setTimeout(registerSW, 2000); // Delay by 2 seconds
      }
    } else {
      window.addEventListener('load', () => {
        setTimeout(registerSW, 2000); // Delay by 2 seconds after load
      });
    }
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
        window.location.reload();
      })
      .catch(error => {
        logError('[ServiceWorker] Error unregistering:', error);
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

// Utility function to request memory cleanup
export function cleanupServiceWorkerMemory() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CLEANUP_MEMORY'
    });
  }
} 