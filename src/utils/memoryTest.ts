/**
 * Memory Test Utility
 * 
 * This utility provides functions to test and monitor memory usage.
 * DISABLED to prevent memory leaks
 */

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

/**
 * Get current memory usage
 */
export function getMemoryUsage() {
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
 * Test memory usage and provide recommendations
 */
export function testMemoryUsage() {
  const memoryInfo = getMemoryUsage();
  if (!memoryInfo) {
    return;
  }
  
  const { used, total, limit } = memoryInfo;
  const difference = used - (window as any).__lastMemoryUsage || 0;
  
  if (used > 1000) {
    // High memory usage detected
  } else if (used > 500) {
    // Moderate memory usage detected
  } else {
    // Memory usage looks good
  }
  
  // Store current usage for next comparison
  (window as any).__lastMemoryUsage = used;
}

/**
 * Start simple memory monitoring
 */
export function startSimpleMemoryMonitoring() {
  // DISABLED to prevent memory leaks
  return;
}

/**
 * Emergency cleanup function
 */
export function emergencyCleanup() {
  // DISABLED to prevent memory leaks
  return;
} 