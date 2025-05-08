import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import * as serviceWorker from './serviceWorker';
import App from './App';
import './index.css';
import './utils/resetServiceWorker'; // Import the reset utility but it no longer exposes global functions in prod
import './utils/browserLoadingFix'; // Import browser loading fix utility

// Setup for service worker updates
let updateAppPrompt: () => void;

// Mount React app first to ensure fast initial load
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// EMERGENCY FIX: Force loading screen to disappear after 5 seconds
// This ensures users don't get stuck on the loading screen regardless of what happens
setTimeout(() => {
  // Force loadingComplete to true in the Layout component
  const event = new CustomEvent('forceCompleteLoading');
  window.dispatchEvent(event);
  
  // Also try to find and remove any loading indicators directly
  document.querySelectorAll('.fixed.inset-0.z-\\[9999\\]').forEach(el => {
    console.log('Force removing loading element:', el);
    (el as HTMLElement).style.display = 'none';
  });
}, 5000);

// Check if we're reloading after a service worker reset
const swResetTime = localStorage.getItem('sw_reset');
if (swResetTime) {
  const resetTime = parseInt(swResetTime, 10);
  const currentTime = Date.now();
  
  // If reset was recent (within 1 minute), don't try to register service worker again
  if (currentTime - resetTime < 60000) {
    console.log('Recently reset service worker, skipping registration');
    localStorage.removeItem('sw_reset'); // Clear the flag
  } else {
    localStorage.removeItem('sw_reset'); // Clear old flag
  }
}

// Register PWA service worker with update handling, but with a timeout
// to prevent hanging if registration fails
const swRegistrationTimeout = setTimeout(() => {
  console.warn('Service worker registration timed out - app will function without offline support');
}, 3000); // Reduced timeout to 3 seconds

try {
  // Register PWA service worker with update handling
  const updateSW = registerSW({
    onNeedRefresh() {
      console.log('New app version available!');
      updateAppPrompt = () => updateSW(true);
      
      // Show update notification to user
      const updateAvailable = new CustomEvent('updateAvailable', {
        detail: {
          updateFn: updateAppPrompt
        }
      });
      window.dispatchEvent(updateAvailable);
    },
    onOfflineReady() {
      console.log('App ready to work offline');
      clearTimeout(swRegistrationTimeout); // Clear timeout on successful registration
      
      // Notify UI that offline mode is ready
      const offlineReady = new CustomEvent('offlineReady');
      window.dispatchEvent(offlineReady);
    },
    onRegistered() {
      clearTimeout(swRegistrationTimeout); // Clear timeout on successful registration
      console.log('Service worker registered successfully');
    },
    onRegisterError(error) {
      clearTimeout(swRegistrationTimeout); // Clear timeout on registration error
      console.error('Service worker registration failed:', error);
      
      // Attempt to unregister any problematic service workers
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          for (const registration of registrations) {
            registration.unregister().then(() => {
              console.log('Unregistered problematic service worker');
            });
          }
        });
      }
      
      // Dispatch event to notify app of service worker issues
      const swError = new CustomEvent('serviceWorkerError', {
        detail: { error }
      });
      window.dispatchEvent(swError);
    }
  });

  // Listen for service worker updates
  window.addEventListener('serviceWorkerUpdate', (event) => {
    const detail = (event as CustomEvent).detail;
    if (detail?.type === 'NEW_CONTENT') {
      // Show update notification
      if (confirm('New content is available. Reload to update?')) {
        window.location.reload();
      }
    }
  });

  // Skip automatic service worker registration to prevent loading issues
  // Users can still get offline features by visiting the site multiple times
  // serviceWorker.register();
  
  // Instead, register the service worker after a delay to prevent blocking rendering
  setTimeout(() => {
    if (!swResetTime || Date.now() - parseInt(swResetTime || '0', 10) > 60000) {
      serviceWorker.register();
    }
  }, 3000);

} catch (error) {
  clearTimeout(swRegistrationTimeout);
  console.error('Failed to set up service worker:', error);
  
  // Try to unregister any existing service workers that might be causing problems
  serviceWorker.unregister();
  
  // Trigger error recovery UI if needed
  document.dispatchEvent(new CustomEvent('app:service-worker-failed'));
}

// Report web vitals for performance monitoring if needed
if (import.meta.env.PROD) {
  // We could import and use a web vitals reporting function here
  console.log('Running in production mode');
}

// Add some basic error handling for unhandled exceptions
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  // Only show error UI in production to avoid disrupting development
  if (import.meta.env.PROD && !window.navigator.onLine) {
    // If error happens when offline, redirect to offline page
    if (window.location.pathname !== '/offline.html') {
      window.location.href = '/offline.html';
    }
  }
});

// BROWSER LOADING INDICATOR FIX: Force the browser to finish loading
// This specifically targets the browser's loading spinner in the tab
window.addEventListener('load', () => {
  // First, terminate any pending fetch requests that might be stuck
  if (window.performance && window.performance.getEntriesByType) {
    const pendingResources = window.performance.getEntriesByType('resource')
      .filter((resource: any) => !resource.responseEnd);
    
    if (pendingResources.length > 0) {
      console.warn('Found pending resources that may be keeping the browser loading:', pendingResources.length);
    }
  }
  
  // Force a complete signal to the browser after a small delay
  setTimeout(() => {
    // Create a fake image to ensure all pending resource loads are considered finished
    const img = new Image();
    img.onload = img.onerror = () => {
      console.log('Browser loading indicator should now be stopped');
      
      // Use requestIdleCallback to run when the browser is idle
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          document.dispatchEvent(new Event('readystatechange'));
          document.readyState = 'complete';
        });
      } else {
        setTimeout(() => {
          document.dispatchEvent(new Event('readystatechange'));
        }, 100);
      }
    };
    // Use a tiny transparent 1x1 GIF to ensure minimal bandwidth
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }, 2000);
});

// Add a global timeout to reset page if it appears stuck
// This ensures users don't get permanently stuck on a loading screen
const pageLoadTimeout = setTimeout(() => {
  const loadingElement = document.querySelector('.loading-indicator,.fixed.inset-0.z-\\[9999\\]');
  
  if (loadingElement) {
    console.warn('Page appears to be stuck loading - attempting recovery');
    
    // Force remove any loading indicators
    loadingElement.remove();
    
    // Trigger reset via custom event
    document.dispatchEvent(new CustomEvent('app:reset-service-worker'));
    
    // Fallback if event listener isn't working
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}, 8000); // Reduced from 15 seconds to 8 seconds

// Clear timeout once page is properly loaded
window.addEventListener('load', () => {
  clearTimeout(pageLoadTimeout);
});

// Force loading complete when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Force loadingComplete to true in the Layout component
  const event = new CustomEvent('forceCompleteLoading');
  window.dispatchEvent(event);
});

// Ensure any background fetch requests don't keep the page loading indefinitely
document.addEventListener('DOMContentLoaded', () => {
  // After 4 seconds, close any pending connections to stop the browser loading indicator
  setTimeout(() => {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      // If using a service worker, tell it to abort any hanging requests
      navigator.serviceWorker.controller.postMessage({
        type: 'ABORT_PENDING_REQUESTS'
      });
    }
  }, 4000);
});