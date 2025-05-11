/**
 * Memory Profiler Utility
 * 
 * This utility helps monitor memory usage in the application.
 * It provides functions to track memory usage and identify potential memory leaks.
 */

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
  if (isMonitoring) return;
  
  // Check if memory API is available
  if (!('performance' in window) || !('memory' in (performance as any))) {
    console.warn('Memory API is not available in this browser. Memory monitoring disabled.');
    return;
  }
  
  memoryWarningThreshold = warningThreshold;
  isMonitoring = true;
  
  // Take initial measurement
  takeMemoryMeasurement();
  
  // Set up interval for regular measurements
  monitoringInterval = window.setInterval(() => {
    takeMemoryMeasurement();
    
    // Limit history size
    if (memoryUsageHistory.length > historyLimit) {
      memoryUsageHistory = memoryUsageHistory.slice(-historyLimit);
    }
    
    // Check for memory issues
    checkMemoryUsage();
  }, intervalMs);
  
  console.log('Memory monitoring started');
}

/**
 * Stop memory monitoring
 */
export function stopMemoryMonitoring(): void {
  if (!isMonitoring || monitoringInterval === null) return;
  
  window.clearInterval(monitoringInterval);
  monitoringInterval = null;
  isMonitoring = false;
  
  console.log('Memory monitoring stopped');
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
    console.error('Error taking memory measurement:', error);
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
    console.warn(
      `Memory usage warning: ${(usagePercentage * 100).toFixed(1)}% of heap limit used`,
      formatBytes(latest.usedJSHeapSize),
      'of',
      formatBytes(latest.jsHeapSizeLimit)
    );
  }
  
  // Check for rapid memory growth
  const memoryGrowth = latest.usedJSHeapSize - previous.usedJSHeapSize;
  const timeDiff = latest.timestamp - previous.timestamp;
  const growthRate = memoryGrowth / timeDiff; // bytes per ms
  
  if (growthRate > 1000) { // More than 1MB per second
    console.warn(
      `Rapid memory growth detected: ${formatBytes(memoryGrowth)} in ${(timeDiff / 1000).toFixed(1)}s`,
      `(${formatBytes(growthRate * 1000)}/s)`
    );
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
    console.error('Error getting memory usage:', error);
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
      console.log('Garbage collection requested');
    } catch (error) {
      console.warn('Could not force garbage collection:', error);
    }
  } else {
    console.warn('Garbage collection API not available');
  }
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