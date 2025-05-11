import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Force page load completion
const forceCompletePageLoad = () => {
  // Method 1: Create an image that auto-loads to trigger load event
  const img = new Image();
  img.onload = img.onerror = () => {
    console.log('Force triggering page load completion');
    
    // Method 2: Explicitly dispatch load events
    window.dispatchEvent(new Event('load'));
    window.dispatchEvent(new Event('DOMContentLoaded'));
    document.dispatchEvent(new Event('readystatechange'));
    
    // Method 3: Use window.stop() to force browser to stop loading
    setTimeout(() => {
      if (window.stop) {
        // This stops any pending resource requests
        window.stop();
      }
      
      console.log('Page loading forced to complete');
    }, 1000); // Give a second for critical resources to load
  };
  
  // Starting the image load process
  img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
};

// Ultra-simplified entry point - just render the React app
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Could not find root element');
    document.body.innerHTML = '<div style="padding: 20px; font-family: sans-serif;"><h1>Error</h1><p>Could not find root element to mount React app.</p></div>';
  } else {
    // Create root with error handler
    const root = createRoot(rootElement);
    
    // Render app
    root.render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    );
    
    // Force the page to finish loading after a reasonable timeout
    setTimeout(forceCompletePageLoad, 2000);
    
    // Clean up service workers that might interfere with page loading
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister().catch(e => 
            console.warn('Error unregistering service worker:', e)
          );
      });
      }).catch(e => console.warn('Error with service workers:', e));
    }
  }
} catch (error) {
  console.error('Failed to render React app:', error);
  document.body.innerHTML = '<div style="padding: 20px; font-family: sans-serif;"><h1>Error</h1><p>Failed to load the application.</p></div>';
}

/*
// Unregister any service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
    });
  }).catch(e => console.error('Error unregistering service workers:', e));
}
*/