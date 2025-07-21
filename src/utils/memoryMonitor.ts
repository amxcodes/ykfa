/**
 * Memory Monitor Utility
 * 
 * This utility provides functions to monitor memory usage.
 * DISABLED to prevent memory leaks
 */

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

// Component mount tracking
const mountedComponents = new Set<string>();

/**
 * Track component mount
 */
export function trackComponentMount(componentName: string) {
  mountedComponents.add(componentName);
}

/**
 * Track component unmount
 */
export function trackComponentUnmount(componentName: string) {
  mountedComponents.delete(componentName);
}

/**
 * Get current memory usage
 */
export function getCurrentMemoryUsage() {
  if (!('performance' in window) || !('memory' in (performance as any))) {
    return null;
  }
  
  try {
    const memory = (performance as any).memory;
    const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
    const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
    const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
    
    return { used: usedMB, total: totalMB, limit: limitMB };
  } catch (error) {
    return null;
  }
}

/**
 * Manual garbage collection
 */
export function manualGarbageCollection() {
  if ('gc' in window) {
    try {
      (window as any).gc();
    } catch (error) {
      // Handle garbage collection errors silently
    }
  }
}

/**
 * Emergency memory cleanup
 */
export function emergencyMemoryCleanup() {
  // DISABLED to prevent memory leaks
  return;
}

/**
 * Start memory monitoring
 */
export function startMemoryMonitoring(thresholdMB: number = 500) {
  // DISABLED to prevent memory leaks
  return;
}

/**
 * Stop memory monitoring
 */
export function stopMemoryMonitoring() {
  // DISABLED to prevent memory leaks
  return;
} 