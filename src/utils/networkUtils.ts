/**
 * Network utility functions for detecting connection issues
 * and monitoring site loading status
 */

// Default timeout values in milliseconds
const DEFAULT_TIMEOUTS = {
  FETCH: 10000,  // 10 seconds
  RESOURCE_TEST: 5000,  // 5 seconds
  HEALTH_CHECK: 3000,   // 3 seconds
  HEALTH_INTERVAL: 30000 // 30 seconds
};

/**
 * Check if the browser is currently online
 * @returns boolean indicating online status
 */
export const isOnline = (): boolean => navigator.onLine;

/**
 * Monitor network status and call provided callbacks when status changes
 * @param onOffline callback function to execute when connection is lost
 * @param onOnline callback function to execute when connection is restored
 * @returns cleanup function to remove event listeners
 */
export const monitorNetworkStatus = (
  onOffline: () => void, 
  onOnline: () => void
): () => void => {
  // Initial check
  if (!isOnline()) {
    // Run on next tick to avoid immediate execution during setup
    setTimeout(onOffline, 0);
  }
  
  // Set up event listeners
  window.addEventListener('offline', onOffline);
  window.addEventListener('online', onOnline);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('offline', onOffline);
    window.removeEventListener('online', onOnline);
  };
};

/**
 * Create a timeout promise that rejects after specified time
 * @param ms number of milliseconds before timeout
 * @returns a Promise that rejects after the timeout
 */
export const timeout = (ms: number): Promise<never> => {
  return new Promise((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error(`Request timed out after ${ms}ms`));
    }, ms);
  });
};

/**
 * Fetch with timeout - will reject if request takes longer than timeout
 * @param url URL to fetch
 * @param options fetch options
 * @param timeoutMs timeout in milliseconds
 * @returns Promise with fetch result or rejection
 */
export const fetchWithTimeout = async (
  url: string, 
  options: RequestInit = {}, 
  timeoutMs: number = DEFAULT_TIMEOUTS.FETCH
): Promise<Response> => {
  // Use AbortController for cleaner timeout handling
  const controller = new AbortController();
  const { signal } = controller;
  
  // Set up timeout
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);
  
  try {
    // Merge provided options with signal
    const fetchOptions = {
      ...options,
      signal
    };
    
    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    // Check if error is due to timeout/abort or something else
    if ((error as Error).name === 'AbortError') {
      throw new Error(`Request to ${url} timed out after ${timeoutMs}ms`);
    }
    throw error;
  }
};

/**
 * Result interface for resource testing
 */
export interface ResourceTestResult {
  success: boolean;
  failedUrl?: string;
  error?: Error;
}

/**
 * Test if critical resources are available by trying to fetch them
 * @param urls array of critical resource URLs to test
 * @param timeoutMs timeout for each fetch attempt
 * @returns Promise resolving to object with success flag and error info
 */
export const testCriticalResources = async (
  urls: string[] = ['/'],
  timeoutMs: number = DEFAULT_TIMEOUTS.RESOURCE_TEST
): Promise<ResourceTestResult> => {
  try {
    // If offline, fail immediately
    if (!isOnline()) {
      return {
        success: false,
        error: new Error('Device is offline')
      };
    }
    
    // Try HEAD requests to each URL to check availability
    for (const url of urls) {
      try {
        const response = await fetchWithTimeout(
          url, 
          { 
            method: 'HEAD',
            // Disable cache for accurate checks
            headers: { 'Cache-Control': 'no-cache' }
          }, 
          timeoutMs
        );
        
        // Check response status
        if (!response.ok) {
          return { 
            success: false, 
            failedUrl: url,
            error: new Error(`Resource ${url} returned status ${response.status}`)
          };
        }
      } catch (error) {
        return { 
          success: false, 
          failedUrl: url,
          error: error instanceof Error ? error : new Error(`Failed to fetch ${url}`)
        };
      }
    }
    
    return { success: true };
  } catch (error) {
    return { 
      success: false,
      error: error instanceof Error ? error : new Error('Unknown network error')
    };
  }
};

/**
 * Creates a health check that periodically pings the server
 * @param url URL to ping
 * @param intervalMs frequency of checks in milliseconds
 * @param onError callback when check fails
 * @param onSuccess callback when check succeeds
 * @returns cleanup function to stop health checks
 */
export const createHealthCheck = (
  url: string = '/',
  intervalMs: number = DEFAULT_TIMEOUTS.HEALTH_INTERVAL,
  onError: (error: Error) => void,
  onSuccess: () => void
): () => void => {
  let isRunning = true;
  let timeoutId: number;
  
  // Check function
  const check = async () => {
    // Skip checks if offline
    if (!isOnline()) {
      if (isRunning) {
        timeoutId = window.setTimeout(check, intervalMs);
      }
      return;
    }
    
    try {
      const response = await fetchWithTimeout(
        url, 
        { 
          method: 'HEAD',
          // Add cache-busting parameter
          headers: { 'Cache-Control': 'no-cache, no-store' }
        }, 
        DEFAULT_TIMEOUTS.HEALTH_CHECK
      );
      
      if (response.ok) {
        onSuccess();
      } else {
        onError(new Error(`Health check returned status ${response.status}`));
      }
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Health check failed'));
    }
    
    // Schedule next check if still running
    if (isRunning) {
      timeoutId = window.setTimeout(check, intervalMs);
    }
  };
  
  // Run initial check
  check();
  
  // Return cleanup function
  return () => {
    isRunning = false;
    clearTimeout(timeoutId);
  };
}; 