import { useEffect, useRef, DependencyList, useCallback } from 'react';

// Store component cleanup functions globally to force cleanup on idle
const cleanupRegistry = new Map<string, () => void>();
let cleanupCount = 0;

// Register a cleanup function and return an unregister function
const registerCleanup = (cleanupFn: () => void): () => void => {
  const id = `cleanup_${cleanupCount++}`;
  cleanupRegistry.set(id, cleanupFn);
  
  return () => {
    cleanupRegistry.delete(id);
  };
};

// Force cleanup of all registered functions
export const forceGlobalCleanup = () => {
  cleanupRegistry.forEach(cleanup => {
    try {
      cleanup();
    } catch (e) {
      console.error('Error in cleanup function:', e);
    }
  });
  
  // Clear the registry after cleanup
  cleanupRegistry.clear();
};

// Setup idle cleanup
if (typeof window !== 'undefined') {
  // Run cleanup when page becomes hidden (user switched tabs, etc.)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      forceGlobalCleanup();
    }
  });
  
  // Also run cleanup on low memory warning
  if ('onmemorywarning' in window) {
    (window as any).addEventListener('memorywarning', forceGlobalCleanup);
  }
}

/**
 * Register a cleanup function to be called during the next garbage collection opportunity
 * @param cleanupFn Function that releases resources
 * @returns Function to manually trigger cleanup early
 */
const registerCleanupOld = (cleanupFn: () => void): (() => void) => {
  cleanupRegistry.add(cleanupFn);
  
  return () => {
    cleanupRegistry.delete(cleanupFn);
    cleanupFn();
  };
};

/**
 * Clear references to large objects to help garbage collection
 * @param objectsToNull Object containing properties to null out
 */
const clearReferences = (objectsToNull: Record<string, any>): void => {
  Object.keys(objectsToNull).forEach(key => {
    objectsToNull[key] = null;
  });
};

/**
 * Hook to optimize component memory usage
 * 
 * This hook helps components clean up resources when they unmount
 * or when their dependencies change, reducing memory leaks.
 * 
 * @param cleanupFn Function to run for cleanup
 * @param deps Optional dependency array that triggers cleanup when changed
 */
export function useMemoryOptimized(
  cleanupFn: () => void,
  deps: DependencyList = []
): void {
  // Store cleanup function in a ref to avoid re-creating it
  const cleanupRef = useRef(cleanupFn);
  cleanupRef.current = cleanupFn;
  
  useEffect(() => {
    // Register cleanup with global registry
    const unregister = registerCleanup(cleanupRef.current);
    
    // Return cleanup function for React to call on unmount
    return () => {
      // Call cleanup directly
      cleanupRef.current();
      
      // Unregister from global registry
      unregister();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Hook for managing animation frames with automatic cleanup
 */
export function useAnimationFrames() {
  const framesRef = useRef<number[]>([]);
  
  const requestFrame = useCallback((callback: FrameRequestCallback): number => {
    const id = requestAnimationFrame(callback);
    framesRef.current.push(id);
    return id;
  }, []);
  
  const cancelFrame = useCallback((id: number) => {
    const index = framesRef.current.indexOf(id);
    if (index >= 0) {
      framesRef.current.splice(index, 1);
    }
    cancelAnimationFrame(id);
  }, []);
  
  const cancelAllFrames = useCallback(() => {
    framesRef.current.forEach(cancelAnimationFrame);
    framesRef.current = [];
  }, []);
  
  // Clean up all frames on unmount
  useEffect(() => {
    return cancelAllFrames;
  }, [cancelAllFrames]);
  
  return { requestFrame, cancelFrame, cancelAllFrames };
}

/**
 * Hook for managing timeouts with automatic cleanup
 */
export function useTimeouts() {
  const timeoutsRef = useRef<number[]>([]);
  
  const setTimeout = useCallback((callback: () => void, delay: number): number => {
    const id = window.setTimeout(callback, delay);
    timeoutsRef.current.push(id);
    return id;
  }, []);
  
  const clearTimeout = useCallback((id: number) => {
    const index = timeoutsRef.current.indexOf(id);
    if (index >= 0) {
      timeoutsRef.current.splice(index, 1);
    }
    window.clearTimeout(id);
  }, []);
  
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(window.clearTimeout);
    timeoutsRef.current = [];
  }, []);
  
  // Clean up all timeouts on unmount
  useEffect(() => {
    return clearAllTimeouts;
  }, [clearAllTimeouts]);
  
  return { setTimeout, clearTimeout, clearAllTimeouts };
}

/**
 * Hook for managing intervals with automatic cleanup
 */
export function useIntervals() {
  const intervalsRef = useRef<number[]>([]);
  
  const setInterval = useCallback((callback: () => void, delay: number): number => {
    const id = window.setInterval(callback, delay);
    intervalsRef.current.push(id);
    return id;
  }, []);
  
  const clearInterval = useCallback((id: number) => {
    const index = intervalsRef.current.indexOf(id);
    if (index >= 0) {
      intervalsRef.current.splice(index, 1);
    }
    window.clearInterval(id);
  }, []);
  
  const clearAllIntervals = useCallback(() => {
    intervalsRef.current.forEach(window.clearInterval);
    intervalsRef.current = [];
  }, []);
  
  // Clean up all intervals on unmount
  useEffect(() => {
    return clearAllIntervals;
  }, [clearAllIntervals]);
  
  return { setInterval, clearInterval, clearAllIntervals };
}

/**
 * Hook to optimize event listeners by removing them on unmount
 * 
 * @param element DOM element or window/document to attach listeners to
 * @param eventType Event type (e.g., 'click', 'scroll')
 * @param handler Event handler function
 * @param options AddEventListener options
 */
export function useOptimizedEvent(
  element: HTMLElement | Window | Document | null,
  eventType: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;
  
  useEffect(() => {
    if (!element) return;
    
    // Create stable reference to handler
    const eventListener = (event: Event) => {
      handlerRef.current.call(element, event);
    };
    
    // Add event listener
    element.addEventListener(eventType, eventListener, options);
    
    // Remove event listener on cleanup
    return () => {
      element.removeEventListener(eventType, eventListener, options);
    };
  }, [element, eventType, options]);
}

// Helper to optimize observers
export function useOptimizedObserver<T extends IntersectionObserver | ResizeObserver | MutationObserver>(
  createObserver: () => T | null,
  deps: DependencyList = []
) {
  const observerRef = useRef<T | null>(null);
  
  useEffect(() => {
    // Create observer
    observerRef.current = createObserver();
    
    // Cleanup function
    return () => {
      if (observerRef.current) {
        // Type guard for disconnect method
        if ('disconnect' in observerRef.current && typeof observerRef.current.disconnect === 'function') {
          observerRef.current.disconnect();
        }
        observerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  
  return observerRef;
}

// Helper to optimize image loading with memory management
export function useOptimizedImageLoading() {
  const imageCache = useRef(new Set<string>());
  
  const preloadImage = useCallback((src: string): Promise<void> => {
    // Skip if already cached
    if (imageCache.current.has(src)) {
      return Promise.resolve();
    }
    
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      
      const cleanup = () => {
        img.onload = null;
        img.onerror = null;
      };
      
      img.onload = () => {
        imageCache.current.add(src);
        cleanup();
        resolve();
      };
      
      img.onerror = () => {
        cleanup();
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      // Start loading
      img.src = src;
      
      // Set a timeout to avoid hanging promises
      setTimeout(() => {
        if (img.onload) {
          cleanup();
          resolve(); // Resolve anyway after timeout
        }
      }, 5000);
    });
  }, []);
  
  const clearCache = useCallback(() => {
    imageCache.current.clear();
  }, []);
  
  // Clean up cache on unmount
  useEffect(() => {
    return clearCache;
  }, [clearCache]);
  
  return { preloadImage, hasImage: (src: string) => imageCache.current.has(src), clearCache };
}

/**
 * Hook to optimize expensive objects in components
 * 
 * Use this for components that create large objects like canvases,
 * WebGL contexts, or other memory-intensive resources.
 * 
 * @param objectFactory Function that creates the object(s) to optimize
 * @param deps Optional dependency array that recreates object when changed
 * @returns The created object
 */
export function useOptimizedObject<T>(
  objectFactory: () => T,
  deps: DependencyList = []
): T {
  const objectRef = useRef<T | null>(null);
  
  useEffect(() => {
    // Create the object
    objectRef.current = objectFactory();
    
    return () => {
      // Clear references to help garbage collection
      if (objectRef.current) {
        // If the object has a dispose or cleanup method, call it
        const obj = objectRef.current as any;
        if (obj && typeof obj.dispose === 'function') {
          obj.dispose();
        }
        if (obj && typeof obj.destroy === 'function') {
          obj.destroy();
        }
        
        // Clear the object reference
        clearReferences({ object: objectRef.current });
        objectRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  
  // Initialize object on first render if needed
  if (objectRef.current === null) {
    objectRef.current = objectFactory();
  }
  
  return objectRef.current;
} 