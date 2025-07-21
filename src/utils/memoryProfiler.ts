/**
 * Memory Profiler Utility
 * 
 * This utility helps monitor memory usage in the application.
 * It provides functions to track memory usage and identify potential memory leaks.
 * 
 * DISABLED to prevent memory leaks
 */

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

// Interface for memory usage data
interface MemoryUsage {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
  timestamp: number;
}

// Memory usage history
let memoryUsageHistory: MemoryUsage[] = [];
let isMonitoring = false;
let monitoringInterval: number | null = null;
let memoryWarningThreshold = 0.8; // 80% of heap size limit

/**
 * Start monitoring memory usage
 * @param intervalMs Interval in milliseconds between memory checks
 * @param historyLimit Maximum number of history entries to keep
 * @param warningThreshold Percentage threshold for memory warnings (0.0 to 1.0)
 */
export function startMemoryMonitoring(
  intervalMs = 5000,
  historyLimit = 100,
  warningThreshold = 0.8
): void {
  // DISABLED to prevent memory leaks
  return;
}

/**
 * Stop memory monitoring
 */
export function stopMemoryMonitoring(): void {
  // DISABLED to prevent memory leaks
  return;
}

/**
 * Take a memory measurement
 */
function takeMemoryMeasurement(): void {
  try {
    const memory = (performance as any).memory;
    
    const measurement: MemoryUsage = {
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      totalJSHeapSize: memory.totalJSHeapSize,
      usedJSHeapSize: memory.usedJSHeapSize,
      timestamp: Date.now()
    };
    
    memoryUsageHistory.push(measurement);
  } catch (error) {
    // console.error('Error taking memory measurement:', error);
  }
}

/**
 * Check memory usage for potential issues
 */
function checkMemoryUsage(): void {
  if (memoryUsageHistory.length < 2) return;
  
  const latest = memoryUsageHistory[memoryUsageHistory.length - 1];
  const previous = memoryUsageHistory[memoryUsageHistory.length - 2];
  
  // Check if memory usage is approaching limit
  const usagePercentage = latest.usedJSHeapSize / latest.jsHeapSizeLimit;
  if (usagePercentage > memoryWarningThreshold) {
    // console.warn(
    //   `Memory usage warning: ${(usagePercentage * 100).toFixed(1)}% of heap limit used`,
    //   formatBytes(latest.usedJSHeapSize),
    //   'of',
    //   formatBytes(latest.jsHeapSizeLimit)
    // );
  }
  
  // Check for rapid memory growth
  const memoryGrowth = latest.usedJSHeapSize - previous.usedJSHeapSize;
  const timeDiff = latest.timestamp - previous.timestamp;
  const growthRate = memoryGrowth / timeDiff; // bytes per ms
  
  if (growthRate > 1000) { // More than 1MB per second
    // console.warn(
    //   `Rapid memory growth detected: ${formatBytes(memoryGrowth)} in ${(timeDiff / 1000).toFixed(1)}s`,
    //   `(${formatBytes(growthRate * 1000)}/s)`
    // );
  }
}

/**
 * Get current memory usage
 */
export function getCurrentMemoryUsage(): MemoryUsage | null {
  if (!('performance' in window) || !('memory' in (performance as any))) {
    return null;
  }
  
  try {
    const memory = (performance as any).memory;
    
    return {
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      totalJSHeapSize: memory.totalJSHeapSize,
      usedJSHeapSize: memory.usedJSHeapSize,
      timestamp: Date.now()
    };
  } catch (error) {
    // console.error('Error getting memory usage:', error);
    return null;
  }
}

/**
 * Get memory usage history
 */
export function getMemoryUsageHistory(): MemoryUsage[] {
  return [...memoryUsageHistory];
}

/**
 * Clear memory usage history
 */
export function clearMemoryUsageHistory(): void {
  memoryUsageHistory = [];
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Force garbage collection if available (for debugging only)
 * Note: This only works in some browsers with special flags enabled
 */
export function forceGarbageCollection(): void {
  if ('gc' in window) {
    try {
      (window as any).gc();
      // console.log('Garbage collection requested');
    } catch (error) {
      // console.warn('Could not force garbage collection:', error);
    }
  } else {
    // console.warn('Garbage collection API not available');
  }
}

/**
 * Comprehensive memory cleanup function
 * Call this when memory usage is high to free up resources
 */
export function performMemoryCleanup(): void {
  if (!isDev || typeof window === 'undefined') {
    return;
  }

  // console.warn('🧹 Performing comprehensive memory cleanup');

  try {
    // 1. Clear all non-critical image sources
    const images = document.querySelectorAll('img:not(.critical):not(.current-image):not(.prev-image):not(.next-image)');
    let purgedImages = 0;
    
    images.forEach(img => {
      const imgElement = img as HTMLImageElement;
      const rect = img.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 2 && rect.bottom > -window.innerHeight;
      
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
    
    // console.log(`Purged ${purgedImages} off-screen images`);

    // 2. Reset will-change properties to free GPU memory
    const elementsWithWillChange = document.querySelectorAll('[style*="will-change"]');
    elementsWithWillChange.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.willChange = 'auto';
      }
    });
    
    // console.log(`Reset will-change on ${elementsWithWillChange.length} elements`);

    // 3. Clear any cached data in localStorage that might be large
    const keysToCheck = ['imageCache', 'audioCache', 'animationCache'];
    keysToCheck.forEach(key => {
      try {
        const item = localStorage.getItem(key);
        if (item && item.length > 10000) { // If larger than 10KB
          localStorage.removeItem(key);
          // console.log(`Cleared large localStorage item: ${key}`);
        }
      } catch (e) {
        // Ignore errors
      }
    });

    // 4. Force garbage collection if available
    if ('gc' in window) {
      try {
        (window as any).gc();
        // console.log('Forced garbage collection');
      } catch (error) {
        // console.warn('Could not force garbage collection:', error);
      }
    }

    // 5. Clear any animation frames that might be running
    // Note: We can't directly access all animation frames, but we can suggest
    // components to clean up their own animation frames

    // 6. Clear any intervals that might be running unnecessarily
    // This is handled by individual components, but we can log a warning
    // console.warn('Memory cleanup completed. Consider refreshing if issues persist.');

  } catch (error) {
    // console.error('Error during memory cleanup:', error);
  }
}

/**
 * Aggressive memory cleanup function for emergency situations
 * This function clears all possible memory-consuming resources
 */
export function performAggressiveMemoryCleanup(): void {
  if (!isDev || typeof window === 'undefined') {
    return;
  }

  // console.warn('🚨 Performing aggressive memory cleanup');

  try {
    // 1. Clear all non-critical image sources immediately
    const images = document.querySelectorAll('img:not(.critical)');
    let purgedImages = 0;
    
    images.forEach(img => {
      const imgElement = img as HTMLImageElement;
      if (imgElement.src && !imgElement.src.includes('data:image/gif')) {
        // Store original source for later restoration
        if (imgElement.src) {
          imgElement.dataset.originalSrc = imgElement.src;
        }
        imgElement.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        purgedImages++;
      }
    });
    
    // console.log(`Aggressively purged ${purgedImages} images`);

    // 2. Reset ALL will-change properties to free GPU memory
    const elementsWithWillChange = document.querySelectorAll('[style*="will-change"]');
    elementsWithWillChange.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.willChange = 'auto';
      }
    });
    
    // console.log(`Reset will-change on ${elementsWithWillChange.length} elements`);

    // 3. Clear all possible intervals and timeouts
    // Note: We can't directly access all intervals/timeouts, but we can clear known ones
    const maxTimeoutId = 1000000; // Reasonable upper limit
    for (let i = 1; i < maxTimeoutId; i++) {
      try {
        clearTimeout(i);
        clearInterval(i);
      } catch (e) {
        // Ignore errors for invalid IDs
      }
    }

    // 4. Clear localStorage completely
    try {
      localStorage.clear();
      // console.log('Cleared all localStorage data');
    } catch (e) {
      // console.warn('Could not clear localStorage:', e);
    }

    // 5. Clear sessionStorage
    try {
      sessionStorage.clear();
      // console.log('Cleared all sessionStorage data');
    } catch (e) {
      // console.warn('Could not clear sessionStorage:', e);
    }

    // 6. Force garbage collection if available
    if ('gc' in window) {
      try {
        (window as any).gc();
        // console.log('Forced garbage collection');
      } catch (error) {
        // console.warn('Could not force garbage collection:', error);
      }
    }

    // 7. Clear any cached data in memory
    if ((window as any).__webpack_modules__) {
      const moduleCache = (window as any).__webpack_modules__;
      const moduleIds = Object.keys(moduleCache);
      
      moduleIds.forEach(id => {
        const mod = moduleCache[id];
        if (mod && typeof mod === 'function') {
          const source = mod.toString();
          // Clear heavy modules
          if (
            source.includes('animation') || 
            source.includes('useGsapTimeline') ||
            source.includes('createAnimation') ||
            source.includes('requestAnimationFrame') ||
            source.length > 10000 // Large modules
          ) {
            delete moduleCache[id];
          }
        }
      });
      // console.log('Cleared heavy webpack modules');
    }

    // 8. Clear any event listeners by cloning elements
    const heavyElements = document.querySelectorAll('.animate-hover, .hover-effect, [data-heavy=true]');
    heavyElements.forEach(el => {
      if (el.parentNode) {
        const clone = el.cloneNode(true);
        el.parentNode.replaceChild(clone, el);
      }
    });

    // console.warn('🚨 Aggressive memory cleanup completed. Consider refreshing if issues persist.');

  } catch (error) {
    // console.error('Error during aggressive memory cleanup:', error);
  }
}

/**
 * Monitor memory usage and automatically trigger cleanup when threshold is reached
 */
export function startAutoMemoryCleanup(thresholdMB: number = 500): void {
  if (!isDev || typeof window === 'undefined') {
    return;
  }

  // console.log(`🧹 Starting auto memory cleanup with ${thresholdMB}MB threshold`);

  const checkMemory = () => {
    try {
      if ('memory' in performance) {
        const memoryInfo = (performance as any).memory;
        const usedMB = Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024);
        const totalMB = Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024);
        
        // console.log(`📊 Memory usage: ${usedMB}MB / ${totalMB}MB`);
        
        if (usedMB > thresholdMB) {
          // console.warn(`⚠️ Memory usage (${usedMB}MB) exceeded threshold (${thresholdMB}MB)`);
          
          // Use aggressive cleanup if memory exceeds 300MB (reduced from 500MB)
          if (usedMB > 300) {
            // console.warn('🚨 Using aggressive memory cleanup');
            performAggressiveMemoryCleanup();
          } else {
            performMemoryCleanup();
          }
        }
      }
    } catch (error) {
      // console.error('Error checking memory usage:', error);
    }
  };

  // Check memory every 10 seconds (reduced from 30 seconds)
  const intervalId = setInterval(checkMemory, 10000);
  
  // Also check immediately
  setTimeout(checkMemory, 1000);
  
  // Store interval ID for cleanup
  (window as any).__memoryCleanupInterval = intervalId;
  
  // console.log('✅ Auto memory cleanup started');
}

// Stop auto memory cleanup
export function stopAutoMemoryCleanup(): void {
  if (!isDev || typeof window === 'undefined') {
    return;
  }

  const intervalId = (window as any).__memoryCleanupInterval;
  if (intervalId) {
    clearInterval(intervalId);
    (window as any).__memoryCleanupInterval = null;
    // console.log('🛑 Auto memory cleanup stopped');
  }
}

// Emergency memory cleanup function
export const emergencyMemoryCleanup = () => {
  if (!isDev || typeof window === 'undefined') {
    return;
  }

  // console.warn('🧹 Emergency memory cleanup triggered');

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
    
    // 3. Clear any cached data
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    // 4. Force garbage collection if available
    if ((window as any).gc) {
      (window as any).gc();
    }
    
    // console.log(`🧹 Emergency cleanup completed: ${purgedImages} images purged`);
  } catch (error) {
    // console.error('Error during emergency cleanup:', error);
  }
};

// Immediate page load cleanup to prevent initial memory spike
export const immediatePageLoadCleanup = () => {
  if (!isDev || typeof window === 'undefined') {
    return;
  }

  // console.log('🚀 Performing immediate page load cleanup');

  try {
    // Only clear images that are not currently visible and not critical
    const images = document.querySelectorAll('img:not(.critical):not(.current-image):not(.prev-image):not(.next-image)');
    let clearedImages = 0;
    
    images.forEach(img => {
      const imgElement = img as HTMLImageElement;
      const rect = img.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 2 && rect.bottom > -window.innerHeight;
      
      // Only clear images that are off-screen and not critical
      if (!isVisible && imgElement.src && !imgElement.src.includes('data:image/gif')) {
        // Store original source for later restoration
        if (imgElement.src) {
          imgElement.dataset.originalSrc = imgElement.src;
        }
        imgElement.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        clearedImages++;
      }
    });
    
    // Reset all will-change properties
    const elementsWithWillChange = document.querySelectorAll('[style*="will-change"]');
    elementsWithWillChange.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.willChange = 'auto';
      }
    });
    
    // console.log(`🚀 Immediate cleanup completed: ${clearedImages} off-screen images cleared, ${elementsWithWillChange.length} will-change properties reset`);
  } catch (error) {
    // console.error('Error during immediate cleanup:', error);
  }
};

// Expose manual cleanup functions to window for debugging
if (isDev && typeof window !== 'undefined') {
  (window as any).YKFA = {
    ...(window as any).YKFA,
    cleanup: performMemoryCleanup,
    aggressiveCleanup: performAggressiveMemoryCleanup,
    emergencyCleanup: emergencyMemoryCleanup,
    immediateCleanup: immediatePageLoadCleanup,
    startAutoCleanup: startAutoMemoryCleanup,
    stopAutoCleanup: stopAutoMemoryCleanup,
    getMemoryUsage: () => {
      if ('memory' in performance) {
        const memoryInfo = (performance as any).memory;
        return {
          used: Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024) + 'MB',
          total: Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024) + 'MB',
          limit: Math.round(memoryInfo.jsHeapSizeLimit / 1024 / 1024) + 'MB'
        };
      }
      return 'Memory info not available';
    }
  };
  
  // console.log('🧹 YKFA memory management functions available:');
  // console.log('- YKFA.cleanup() - Normal memory cleanup');
  // console.log('- YKFA.aggressiveCleanup() - Aggressive memory cleanup');
  // console.log('- YKFA.emergencyCleanup() - Emergency memory cleanup');
  // console.log('- YKFA.immediateCleanup() - Immediate page load cleanup');
  // console.log('- YKFA.startAutoCleanup(threshold) - Start auto cleanup');
  // console.log('- YKFA.stopAutoCleanup() - Stop auto cleanup');
  // console.log('- YKFA.getMemoryUsage() - Get current memory usage');
}

/**
 * Memory-optimized event handler creation
 * Creates an event handler that won't cause memory leaks
 */
export function createMemorySafeEventHandler<T extends Event>(
  element: HTMLElement | Window | Document | null,
  eventType: string,
  handler: (event: T) => void,
  options?: AddEventListenerOptions
): () => void {
  if (!element) return () => {};
  
  // Use a weak reference to the handler to avoid memory leaks
  const handlerRef = new WeakRef(handler);
  
  // Create a wrapper function that uses the weak reference
  const wrappedHandler = (event: Event) => {
    const currentHandler = handlerRef.deref();
    if (currentHandler) {
      currentHandler(event as T);
    } else {
      // If handler is garbage collected, remove the event listener
      element.removeEventListener(eventType, wrappedHandler, options);
    }
  };
  
  // Add the event listener with the wrapped handler
  element.addEventListener(eventType, wrappedHandler, options);
  
  // Return a cleanup function
  return () => {
    element.removeEventListener(eventType, wrappedHandler, options);
  };
} 

// Add global memory cleanup functions for console access
if (typeof window !== 'undefined') {
  (window as any).__memoryCleanup = {
    normal: performMemoryCleanup,
    aggressive: performAggressiveMemoryCleanup,
    getUsage: getCurrentMemoryUsage,
    startMonitoring: startAutoMemoryCleanup,
    stopMonitoring: stopMemoryMonitoring
  };
  
  // console.log('🧹 Memory cleanup functions available:');
  // console.log('  window.__memoryCleanup.normal() - Normal cleanup');
  // console.log('  window.__memoryCleanup.aggressive() - Aggressive cleanup');
  // console.log('  window.__memoryCleanup.getUsage() - Get current memory usage');
  // console.log('  window.__memoryCleanup.startMonitoring() - Start auto monitoring');
  // console.log('  window.__memoryCleanup.stopMonitoring() - Stop auto monitoring');
} 