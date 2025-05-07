/**
 * Network utility functions for detecting connection issues
 * and monitoring site loading status
 */

/**
 * Check if the browser is currently online
 * @returns boolean indicating online status
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

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
  window.addEventListener('offline', onOffline);
  window.addEventListener('online', onOnline);
  
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
    setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms);
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
  timeoutMs: number = 10000
): Promise<Response> => {
  return Promise.race([
    fetch(url, options),
    timeout(timeoutMs)
  ]);
};

/**
 * Test if critical resources are available by trying to fetch them
 * @param urls array of critical resource URLs to test
 * @param timeoutMs timeout for each fetch attempt
 * @returns Promise resolving to object with success flag and error info
 */
export const testCriticalResources = async (
  urls: string[] = ['/'],
  timeoutMs: number = 5000
): Promise<{ success: boolean, failedUrl?: string, error?: Error }> => {
  try {
    // Try HEAD requests to each URL to check availability
    for (const url of urls) {
      try {
        await fetchWithTimeout(url, { method: 'HEAD' }, timeoutMs);
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
  intervalMs: number = 30000,
  onError: (error: Error) => void,
  onSuccess: () => void
): () => void => {
  const check = async () => {
    try {
      await fetchWithTimeout(url, { method: 'HEAD' }, 3000);
      onSuccess();
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Health check failed'));
    }
  };
  
  // Run initial check
  check();
  
  // Set up interval for subsequent checks
  const intervalId = setInterval(check, intervalMs);
  
  // Return cleanup function
  return () => clearInterval(intervalId);
}; 