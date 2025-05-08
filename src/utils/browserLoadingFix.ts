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

/**
 * Force the browser to stop showing the loading indicator
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
    } catch (err) {
      console.error('[BrowserLoadingFix] Error communicating with service worker:', err);
    }
  }
  
  // 4. Cancel any outstanding XHR requests
  if ('XMLHttpRequest' in window) {
    try {
      const originalOpen = XMLHttpRequest.prototype.open;
      const activeRequests: XMLHttpRequest[] = [];
      
      // Override open to track requests
      XMLHttpRequest.prototype.open = function(...args: any[]) {
        activeRequests.push(this);
        return originalOpen.apply(this, args);
      };
      
      // Attempt to abort any requests that appear to be hanging (over 5 seconds)
      setTimeout(() => {
        for (const req of activeRequests) {
          if (req.readyState !== 4) { // 4 = DONE
            try {
              console.warn('[BrowserLoadingFix] Aborting hung XHR request');
              req.abort();
            } catch (err) {
              console.error('[BrowserLoadingFix] Error aborting XHR:', err);
            }
          }
        }
      }, 5000);
    } catch (err) {
      console.error('[BrowserLoadingFix] Error patching XHR:', err);
    }
  }
}

// Apply the fix automatically after a delay
setTimeout(forceFinishLoading, 5000);

// Also apply when page appears to be loaded
window.addEventListener('load', () => {
  setTimeout(forceFinishLoading, 1000);
});

// Apply when user interacts with the page (assuming it's loaded by then)
document.addEventListener('click', () => {
  setTimeout(forceFinishLoading, 500);
}, { once: true, passive: true });

export default forceFinishLoading; 