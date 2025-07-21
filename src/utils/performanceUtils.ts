/**
 * Utility functions for performance optimization and memory management
 */

/**
 * Debounce function to limit how often a function can be called
 * Useful for event handlers that might fire rapidly (resize, scroll, etc.)
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to ensure a function is not called more than once in a specified time period
 * Useful for scroll events, animations, etc.
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Safely removes event listeners to prevent memory leaks
 */
export function safeRemoveEventListener(
  element: EventTarget | null,
  event: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): void {
  if (element) {
    try {
      element.removeEventListener(event, handler, options);
    } catch (error) {
      // Handle event listener removal errors silently
    }
  }
}

/**
 * Safely adds event listeners with error handling
 */
export function safeAddEventListener(
  element: EventTarget | null,
  event: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): void {
  if (element) {
    try {
      element.addEventListener(event, handler, options);
    } catch (error) {
      // Handle event listener addition errors silently
    }
  }
}

/**
 * Checks if the device is a mobile device
 * Useful for conditional rendering or behavior
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Checks if the device has a touch screen
 */
export function hasTouchScreen(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Optimizes animations by using requestAnimationFrame
 * Returns a function to cancel the animation
 */
export function optimizedAnimation(callback: FrameRequestCallback): () => void {
  let animationFrameId: number | null = null;
  
  const animate = () => {
    animationFrameId = requestAnimationFrame((time) => {
      callback(time);
      animationFrameId = requestAnimationFrame(animate);
    });
  };
  
  animate();
  
  return () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}

/**
 * Creates a memory-efficient event handler that automatically removes itself
 * when the component unmounts or when manually called
 */
export function createCleanupEventListener(
  element: EventTarget | null,
  event: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): () => void {
  if (!element) return () => {};
  
  safeAddEventListener(element, event, handler, options);
  
  return () => {
    safeRemoveEventListener(element, event, handler, options);
  };
} 