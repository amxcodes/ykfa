/**
 * Memory monitoring utility for development mode
 * This file provides tools to help track memory usage and identify leaks
 */

// Only include monitoring in development mode
const isDev = process.env.NODE_ENV !== 'production';

// Track component mount/unmount to help identify leaks
export const trackComponent = (componentName: string): (() => void) => {
  if (!isDev) return () => {}; // No-op in production
  
  console.log(`🧩 Mounted: ${componentName}`);
  
  // Return cleanup function
  return () => {
    console.log(`🗑️ Unmounted: ${componentName}`);
  };
};

// Track memory usage periodically
let memoryInterval: number | null = null;
export const startMemoryMonitoring = (intervalMs = 10000) => {
  if (!isDev || typeof window === 'undefined' || !('performance' in window)) {
    return;
  }
  
  if (memoryInterval) {
    clearInterval(memoryInterval);
  }
  
  // Log initial memory usage
  logMemoryUsage();
  
  // Setup interval for logging
  memoryInterval = window.setInterval(() => {
    logMemoryUsage();
  }, intervalMs);
  
  return () => {
    if (memoryInterval) {
      clearInterval(memoryInterval);
      memoryInterval = null;
    }
  };
};

// Stop memory monitoring
export const stopMemoryMonitoring = () => {
  if (memoryInterval) {
    clearInterval(memoryInterval);
    memoryInterval = null;
  }
};

// Log current memory usage
export const logMemoryUsage = () => {
  if (!isDev || typeof window === 'undefined' || !('performance' in window)) {
    return;
  }
  
  try {
    const memory = (performance as any).memory;
    if (memory) {
      const used = Math.round(memory.usedJSHeapSize / (1024 * 1024));
      const total = Math.round(memory.totalJSHeapSize / (1024 * 1024));
      const limit = Math.round(memory.jsHeapSizeLimit / (1024 * 1024));
      
      console.log(
        `%cMemory Usage: ${used}MB / ${total}MB (Limit: ${limit}MB)`,
        `color: ${used > total * 0.9 ? 'red' : used > total * 0.7 ? 'orange' : 'green'}; font-weight: bold`
      );
      
      if (used > total * 0.9) {
        console.warn('Memory usage is very high! Consider checking for memory leaks.');
      }
      
      return { used, total, limit };
    }
  } catch (e) {
    console.log('Memory measurement not available in this browser');
  }
  
  return null;
};

// Force garbage collection (only works in Chrome DevTools with flag enabled)
export const forceGarbageCollection = () => {
  if (!isDev) return;
  
  try {
    // This only works in Chrome DevTools when "Collect garbage" button is available
    if (window.gc) {
      window.gc();
      console.log('Manual garbage collection triggered');
    } else {
      console.log(
        'Manual garbage collection not available. ' +
        'In Chrome, open DevTools and enable "Settings > Console > Enable custom formatters"'
      );
    }
  } catch (e) {
    console.log('Failed to trigger garbage collection');
  }
};

// Add window unload handler to check for leaks
if (isDev && typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    console.log('Page unloading - final memory status:');
    logMemoryUsage();
  });
}

// Emergency memory cleanup function
export const emergencyMemoryCleanup = () => {
  if (!isDev || typeof window === 'undefined') {
    return;
  }

  console.warn('🧹 Emergency memory cleanup triggered');

  try {
    // 1. Clear all DOM caches
    // Purge image sources that aren't currently visible
    const images = document.querySelectorAll('img:not(.critical)');
    let purgedImages = 0;
    
    images.forEach(img => {
      const imgElement = img as HTMLImageElement;
      const rect = img.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 1.5 && rect.bottom > -window.innerHeight * 0.5;
      
      // Keep visible images, purge those offscreen
      if (!isVisible && imgElement.src && !imgElement.src.includes('data:image/gif')) {
        // Store original source for later restoration
        if (imgElement.src) {
          imgElement.dataset.originalSrc = imgElement.src;
        }
        imgElement.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        purgedImages++;
      }
    });
    
    // 2. Remove unused event listeners where possible
    // This isn't perfect but helps with some cases
    const heavyElements = document.querySelectorAll('[data-heavy=true], .hover-effect, .animate-hover');
    heavyElements.forEach(el => {
      // Clone element without event listeners
      if (el.parentNode) {
        const clone = el.cloneNode(true);
        el.parentNode.replaceChild(clone, el);
      }
    });

    // 3. Clear browser caches where possible
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('image-cache') || name.includes('temp-cache')) {
            caches.delete(name).catch(() => {});
          }
        });
      }).catch(() => {});
    }
    
    // 4. Attempt to clear module cache in webpack
    if ((window as any).__webpack_modules__) {
      // Identify modules that might be heavy but unnecessary after initial load
      const moduleCache = (window as any).__webpack_modules__;
      const moduleIds = Object.keys(moduleCache);
      
      moduleIds.forEach(id => {
        // Try to identify heavy modules by their source code
        const mod = moduleCache[id];
        if (mod && typeof mod === 'function') {
          const source = mod.toString();
          // Look for animation modules, large dependencies, etc.
          if (
            source.includes('animation') || 
            source.includes('useGsapTimeline') ||
            source.includes('createAnimation')
          ) {
            delete moduleCache[id];
          }
        }
      });
    }
    
    console.log(`🧹 Memory cleanup: Purged ${purgedImages} images`);
    
    // 5. Force garbage collection if available
    forceGarbageCollection();
    
    return true;
  } catch (e) {
    console.error('Error during emergency memory cleanup:', e);
    return false;
  }
};

// Add memory threshold monitoring
let highMemoryDetected = false;
export const checkMemoryThreshold = (thresholdMB = 500) => {
  const memoryInfo = logMemoryUsage();
  
  if (!memoryInfo) return false;
  
  if (memoryInfo.used > thresholdMB && !highMemoryDetected) {
    console.warn(`🚨 High memory usage detected: ${memoryInfo.used}MB exceeds threshold of ${thresholdMB}MB`);
    highMemoryDetected = true;
    emergencyMemoryCleanup();
    
    // Reset flag after some time to allow checking again
    setTimeout(() => {
      highMemoryDetected = false;
    }, 30000); // Wait 30 seconds before allowing another cleanup
    
    return true;
  }
  
  return false;
};

// Enhanced memory monitoring that includes threshold checks
export const startEnhancedMemoryMonitoring = (intervalMs = 10000, thresholdMB = 500) => {
  if (!isDev || typeof window === 'undefined') {
    return;
  }
  
  // Clear any existing interval
  if (memoryInterval) {
    clearInterval(memoryInterval);
  }
  
  // Log initial memory usage
  logMemoryUsage();
  
  // Setup interval for logging and threshold checking
  memoryInterval = window.setInterval(() => {
    const memoryInfo = logMemoryUsage();
    if (memoryInfo && memoryInfo.used > thresholdMB) {
      checkMemoryThreshold(thresholdMB);
    }
  }, intervalMs);
  
  // Start checking for memory leaks
  setTimeout(() => {
    const initialMemory = logMemoryUsage();
    if (initialMemory) {
      const initialUsed = initialMemory.used;
      
      // Check for continuously growing memory after 30 seconds
      setTimeout(() => {
        const currentMemory = logMemoryUsage();
        if (currentMemory && currentMemory.used > initialUsed * 1.5) {
          console.warn(`🚨 Possible memory leak detected: Memory grew from ${initialUsed}MB to ${currentMemory.used}MB`);
        }
      }, 30000);
    }
  }, 5000);
  
  return () => {
    if (memoryInterval) {
      clearInterval(memoryInterval);
      memoryInterval = null;
    }
  };
};

// Expose memory monitoring to console in development
if (isDev && typeof window !== 'undefined') {
  (window as any).__memoryMonitor = {
    start: startMemoryMonitoring,
    stop: stopMemoryMonitoring,
    check: logMemoryUsage,
    forceGC: forceGarbageCollection,
    cleanup: emergencyMemoryCleanup,
    startEnhanced: startEnhancedMemoryMonitoring
  };
  
  console.log(
    '%cMemory monitoring available! Use window.__memoryMonitor in console',
    'color: #8f43ee; font-weight: bold; font-size: 12px'
  );
} 