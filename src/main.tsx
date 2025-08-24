import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Create root and render app
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);

// Clean page load completion strategy
const completePageLoad = () => {
  // Remove any loading text from title
  document.title = document.title.replace(/\s*-?\s*Loading\.*/g, '').trim();
  
  // Set completion flag
  (window as any).__YKFA_LOADED__ = true;
  
  // Dispatch load event to signal completion
  window.dispatchEvent(new Event('load'));
  
  // Log performance improvement
  console.log('✅ YKFA loaded with optimized memory management');
};

// Render the app without StrictMode to prevent double rendering and timer amplification
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Complete page load immediately - no delays
requestAnimationFrame(() => {
  // Immediate completion to stop browser loading indicator
  completePageLoad();
});