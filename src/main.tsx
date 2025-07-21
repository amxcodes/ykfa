import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { memoryOptimizer } from './utils/memoryOptimizer';

// Create root and render app
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);

// Enable memory optimization
memoryOptimizer.enable();

// Properly signal page load completion
const signalPageLoadComplete = () => {
  // Signal to browser that the page has loaded
  if (document.readyState === 'complete') {
    window.dispatchEvent(new Event('load'));
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      window.dispatchEvent(new Event('load'));
    });
  }
  
  // Set a flag to indicate page is fully loaded
  (window as any).__YKFA_LOADED__ = true;
  
  // Remove loading indicator from browser tab
  document.title = document.title.replace(' - Loading...', '');
  
  // Optimize images and reduce effects for better performance
  memoryOptimizer.optimizeImages();
  memoryOptimizer.reduceEffects();
};

// Signal page load completion after a short delay
setTimeout(signalPageLoadComplete, 1000);

// Render the app
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);