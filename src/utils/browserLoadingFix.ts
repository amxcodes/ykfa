/**
 * This utility helps solve the problem of browser loading indicators that
 * never finish despite the content being fully loaded.
 * 
 * The issue is usually caused by:
 * 1. Pending network requests that don't resolve/reject properly
 * 2. Service workers with hanging fetch events
 * 3. JavaScript code that registers but never resolves a fetch request
 */

// Track if we've already tried to fix the loading indicator
let fixAttempted = false;
let activeXHRRequests: XMLHttpRequest[] = [];

/**
 * Force the browser to stop showing the loading indicator and clean up resources
 */
export function forceFinishLoading() {
  if (fixAttempted) return;
  fixAttempted = true;
  
  console.log('[BrowserLoadingFix] Attempting to force-finish browser loading indicator');
  
  // 1. Check for any hanging network requests
  if (window.performance && window.performance.getEntriesByType) {
    try {
      const pendingResources = window.performance.getEntriesByType('resource')
        .filter((resource: any) => !resource.responseEnd);
      
      if (pendingResources.length > 0) {
        console.warn('[BrowserLoadingFix] Found pending resources:', pendingResources.length);
      }
    } catch (err) {
      console.error('[BrowserLoadingFix] Error checking pending resources:', err);
    }
  }
  
  // 2. Force a complete signal to the browser
  setTimeout(() => {
    // Use a fake image load to trigger load completion signal
    const img = new Image();
    img.onload = img.onerror = () => {
      console.log('[BrowserLoadingFix] Triggered browser load completion signal');
      
      // Dispatch readystate events
      if (document.readyState !== 'complete') {
        try {
          // Create and dispatch a synthetic readystatechange event
          const event = document.createEvent('Event');
          event.initEvent('readystatechange', false, false);
          document.dispatchEvent(event);
          
          // This is not standard but can help in some browsers
          if ('readyState' in document) {
            // @ts-ignore - We're intentionally setting a read-only property
            document.readyState = 'complete';
          }
          
          // Dispatch a window load event if not already fired
          if (!window.hasOwnProperty('_loadFired')) {
            window.dispatchEvent(new Event('load'));
            (window as any)._loadFired = true;
          }
        } catch (err) {
          console.error('[BrowserLoadingFix] Error dispatching completion events:', err);
        }
      }
      
      // Cleanup the image to prevent memory leaks
      img.onload = img.onerror = null;
    };
    
    // 1x1 transparent GIF
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }, 100);
  
  // 3. Notify the service worker to abort pending requests
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    try {
      navigator.serviceWorker.controller.postMessage({
        type: 'ABORT_PENDING_REQUESTS'
      });
      console.log('[BrowserLoadingFix] Sent abort request to service worker');
      
      // Also request memory cleanup
      setTimeout(() => {
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'CLEANUP_MEMORY'
          });
          console.log('[BrowserLoadingFix] Sent memory cleanup request to service worker');
        }
      }, 1000);
    } catch (err) {
      console.error('[BrowserLoadingFix] Error communicating with service worker:', err);
    }
  }
  
  // 4. Cancel any outstanding XHR requests
  if ('XMLHttpRequest' in window) {
    try {
      // Abort any active requests we're tracking
      for (const req of activeXHRRequests) {
        if (req && req.readyState !== 4) { // 4 = DONE
          try {
            console.warn('[BrowserLoadingFix] Aborting hung XHR request');
            req.abort();
          } catch (err) {
            console.error('[BrowserLoadingFix] Error aborting XHR:', err);
          }
        }
      }
      
      // Clear the tracking array
      activeXHRRequests = [];
      
      // Patch XMLHttpRequest to track requests
      if (!window.hasOwnProperty('_xhrPatched')) {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;
        
        // Override open to track requests
        XMLHttpRequest.prototype.open = function(method: string, url: string | URL, async: boolean = true, username?: string | null, password?: string | null) {
          return originalOpen.call(this, method, url, async, username, password);
        };
        
        // Override send to track requests
        XMLHttpRequest.prototype.send = function(body?: Document | XMLHttpRequestBodyInit | null) {
          // Add to tracking array
          if (activeXHRRequests.length < 50) { // Limit array size to prevent memory issues
            activeXHRRequests.push(this);
          }
          
          // Add event listeners to clean up
          this.addEventListener('load', function() {
            const index = activeXHRRequests.indexOf(this);
            if (index !== -1) activeXHRRequests.splice(index, 1);
          });
          
          this.addEventListener('error', function() {
            const index = activeXHRRequests.indexOf(this);
            if (index !== -1) activeXHRRequests.splice(index, 1);
          });
          
          this.addEventListener('abort', function() {
            const index = activeXHRRequests.indexOf(this);
            if (index !== -1) activeXHRRequests.splice(index, 1);
          });
          
          // Set a timeout that will abort extremely long requests (30 seconds)
          const xhrTimeout = setTimeout(() => {
            if (this.readyState !== 4) {
              console.warn('[BrowserLoadingFix] Aborting long-running XHR request');
              this.abort();
            }
          }, 30000);
          
          this.addEventListener('loadend', function() {
            clearTimeout(xhrTimeout);
          });
          
          return originalSend.call(this, body);
        };
        
        (window as any)._xhrPatched = true;
      }
    } catch (err) {
      console.error('[BrowserLoadingFix] Error patching XHR:', err);
    }
  }
  
  // 5. Free memory by cleaning up event listeners after some time
  setTimeout(() => {
    fixAttempted = false; // Allow running again if needed
  }, 60000); // Reset after 1 minute
}

// Apply the fix automatically after a delay - reduced from 5000ms to 3000ms
setTimeout(forceFinishLoading, 3000);

// Also apply when page appears to be loaded
window.addEventListener('load', () => {
  setTimeout(forceFinishLoading, 1000);
});

// Apply when user interacts with the page (assuming it's loaded by then)
document.addEventListener('click', () => {
  setTimeout(forceFinishLoading, 500);
}, { once: true, passive: true });

// Periodically cleanup memory if page is open for a long time
setInterval(() => {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    try {
      navigator.serviceWorker.controller.postMessage({
        type: 'CLEANUP_MEMORY'
      });
    } catch (err) {
      // Silent fail
    }
  }
}, 5 * 60 * 1000); // Every 5 minutes

export default forceFinishLoading; 