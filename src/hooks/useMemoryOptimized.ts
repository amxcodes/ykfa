import { useEffect, useRef, DependencyList } from 'react';

// Inline implementation of the deleted memoryOptimizer functions
const cleanupRegistry = new Set<() => void>();

/**
 * Register a cleanup function to be called during the next garbage collection opportunity
 * @param cleanupFn Function that releases resources
 * @returns Function to manually trigger cleanup early
 */
const registerCleanup = (cleanupFn: () => void): (() => void) => {
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