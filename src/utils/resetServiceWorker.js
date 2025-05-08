/**
 * Utility function to reset service workers in case of loading issues
 * 
 * This provides a safer way to handle service worker resets
 * without exposing functions directly in the global scope
 */

// The core reset function (not exposed globally)
const resetServiceWorkerImplementation = function() {
  console.log('Attempting to reset service worker...');
  
  // Return a promise to allow chaining
  return new Promise((resolve, reject) => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations()
        .then(registrations => {
          // Create an array of promises for unregistering each service worker
          const unregisterPromises = registrations.map(registration => {
            console.log('Unregistering service worker:', registration.scope);
            return registration.unregister();
          });
          
          // Wait for all unregistrations to complete
          Promise.all(unregisterPromises)
            .then(results => {
              const successCount = results.filter(Boolean).length;
              console.log(`Successfully unregistered ${successCount} of ${results.length} service workers`);
              
              // Clear caches
              if ('caches' in window) {
                caches.keys()
                  .then(cacheNames => {
                    console.log('Clearing caches:', cacheNames);
                    const clearPromises = cacheNames.map(cacheName => caches.delete(cacheName));
                    return Promise.all(clearPromises);
                  })
                  .then(clearResults => {
                    console.log(`Cleared ${clearResults.filter(Boolean).length} caches`);
                    console.log('Reset complete. Reloading page...');
                    
                    // Small delay before reload to allow console messages to be seen
                    setTimeout(() => {
                      localStorage.setItem('sw_reset', Date.now().toString());
                      window.location.reload(true);
                      resolve(true);
                    }, 1000);
                  })
                  .catch(error => {
                    console.error('Error clearing caches:', error);
                    reject(error);
                  });
              } else {
                console.log('Cache API not available');
                console.log('Reset complete. Reloading page...');
                
                // Still reload even if caches can't be cleared
                setTimeout(() => {
                  localStorage.setItem('sw_reset', Date.now().toString());
                  window.location.reload(true);
                  resolve(true);
                }, 1000);
              }
            })
            .catch(error => {
              console.error('Error unregistering service workers:', error);
              reject(error);
            });
        })
        .catch(error => {
          console.error('Error getting service worker registrations:', error);
          reject(error);
        });
    } else {
      console.log('Service workers not supported in this browser');
      resolve(false);
    }
  });
};

// Only expose the function globally in development mode
if (import.meta.env && import.meta.env.DEV) {
  // In development mode, expose the function globally for easier debugging
  window.resetServiceWorker = resetServiceWorkerImplementation;
  console.log('Service worker reset utility available in console (development mode only)');
}

// Always listen for the custom reset event (works in both dev and prod)
document.addEventListener('app:reset-service-worker', () => {
  console.log('Service worker reset triggered by event');
  resetServiceWorkerImplementation();
});

// This function can be used by components to trigger a reset
export const resetServiceWorker = () => {
  // First try using the event approach
  const resetEvent = new CustomEvent('app:reset-service-worker');
  document.dispatchEvent(resetEvent);
};

// Add a hidden recovery element to the DOM that persists between reloads
document.addEventListener('DOMContentLoaded', () => {
  // Check if we've had repeated resets recently (potential loading issue)
  const resetCount = parseInt(localStorage.getItem('sw_reset_count') || '0', 10);
  const lastResetTime = parseInt(localStorage.getItem('sw_reset_last') || '0', 10);
  const now = Date.now();
  
  // If we've had multiple resets in the last 5 minutes, show recovery UI
  if (resetCount > 2 && (now - lastResetTime < 5 * 60 * 1000)) {
    const recoveryUI = document.createElement('div');
    recoveryUI.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: sans-serif;
      font-size: 14px;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      gap: 8px;
    `;
    
    recoveryUI.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>Having trouble loading?</span>
      </div>
      <button id="recovery-button" style="background: #f59e0b; color: black; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">Reset App</button>
    `;
    
    document.body.appendChild(recoveryUI);
    
    document.getElementById('recovery-button')?.addEventListener('click', () => {
      resetServiceWorkerImplementation();
    });
    
    // Reset the counter after showing recovery UI
    localStorage.setItem('sw_reset_count', '0');
  }
  
  // Increment reset counter if we're reloading after a reset
  if (localStorage.getItem('sw_reset')) {
    localStorage.setItem('sw_reset_count', (resetCount + 1).toString());
    localStorage.setItem('sw_reset_last', now.toString());
  }
}); 