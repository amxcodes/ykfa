// Animation controller to replace GSAP with CSS animations
export class AnimationController {
  // Apply CSS transition to an element
  static animate(selector: string | HTMLElement, properties: Record<string, any>, options: {
    duration?: number;
    ease?: string;
    delay?: number;
    onComplete?: () => void;
    repeat?: number;
    yoyo?: boolean;
  } = {}) {
    const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];
    const { duration = 0.3, ease = 'ease', delay = 0, onComplete, repeat = 0, yoyo = false } = options;
    
    if (elements.length === 0) return null;
    
    // Convert duration to milliseconds for setTimeout
    const durationMs = duration * 1000;
    
    Array.from(elements).forEach(el => {
      const element = el as HTMLElement;
      
      // Save original transition to restore later
      const originalTransition = element.style.transition;
      
      // Set transition property
      element.style.transition = `all ${duration}s ${ease} ${delay}s`;
      
      // Apply properties after a small delay to ensure the transition property is applied
      setTimeout(() => {
        Object.entries(properties).forEach(([prop, value]) => {
          // Handle special properties
          if (prop === 'scale') {
            element.style.transform = `scale(${value})`;
          } else if (prop === 'y') {
            element.style.transform = element.style.transform 
              ? `${element.style.transform} translateY(${typeof value === 'number' ? `${value}px` : value})`
              : `translateY(${typeof value === 'number' ? `${value}px` : value})`;
          } else if (prop === 'x') {
            element.style.transform = element.style.transform 
              ? `${element.style.transform} translateX(${typeof value === 'number' ? `${value}px` : value})`
              : `translateX(${typeof value === 'number' ? `${value}px` : value})`;
          } else if (prop === 'rotation' || prop === 'rotate') {
            element.style.transform = element.style.transform 
              ? `${element.style.transform} rotate(${value}deg)`
              : `rotate(${value}deg)`;
          } else if (prop === 'background') {
            element.style.background = value;
          } else if (prop === 'backgroundColor') {
            element.style.backgroundColor = value;
          } else if (prop === 'stroke') {
            element.setAttribute('stroke', value);
          } else if (prop === 'strokeDashoffset') {
            element.setAttribute('stroke-dashoffset', value);
          } else {
            // For standard CSS properties
            (element.style as any)[prop] = value;
          }
        });
      }, 10);
      
      // Call onComplete if provided
      if (onComplete) {
        setTimeout(() => {
          // Restore original transition
          element.style.transition = originalTransition;
          onComplete();
        }, durationMs + (delay * 1000) + 50); // Add 50ms buffer
      } else {
        // Just restore original transition
        setTimeout(() => {
          element.style.transition = originalTransition;
        }, durationMs + (delay * 1000) + 50);
      }

      // Handle repeat and yoyo if needed
      if (repeat > 0 || yoyo) {
        let currentRepeat = 0;
        const totalTime = durationMs + (delay * 1000);
        
        const intervalId = setInterval(() => {
          currentRepeat++;
          
          if (yoyo) {
            // Toggle between initial and target properties
            const isEven = currentRepeat % 2 === 0;
            
            // Apply either the initial or target properties
            setTimeout(() => {
              Object.entries(properties).forEach(([prop, value]) => {
                if (prop === 'scale') {
                  element.style.transform = `scale(${isEven ? 1 : value})`;
                } else if (prop === 'opacity') {
                  element.style.opacity = isEven ? '1' : String(value);
                }
                // Add other properties as needed
              });
            }, 10);
          }
          
          if (currentRepeat >= repeat) {
            clearInterval(intervalId);
          }
        }, totalTime);
      }
    });
    
    return {
      // Chain animations
      to: (selector: string | HTMLElement, props: Record<string, any>, opts: any = {}) => {
        const newDelay = (delay + duration);
        setTimeout(() => {
          AnimationController.animate(selector, props, opts);
        }, newDelay * 1000);
        return { to: () => ({}) }; // For chaining
      }
    };
  }
  
  // Apply CSS transition with from and to values
  static fromTo(selector: string | HTMLElement, fromProps: Record<string, any>, toProps: Record<string, any>, options: {
    duration?: number;
    ease?: string;
    delay?: number;
    onComplete?: () => void;
    repeat?: number;
    yoyo?: boolean;
  } = {}) {
    const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];
    
    if (elements.length === 0) return null;
    
    // Apply from properties immediately (no transition)
    Array.from(elements).forEach(el => {
      const element = el as HTMLElement;
      // Save original transition to disable during immediate "from" property application
      const originalTransition = element.style.transition;
      element.style.transition = 'none';
      
      Object.entries(fromProps).forEach(([prop, value]) => {
        // Handle special properties
        if (prop === 'scale') {
          element.style.transform = `scale(${value})`;
        } else if (prop === 'y') {
          element.style.transform = element.style.transform 
            ? `${element.style.transform} translateY(${typeof value === 'number' ? `${value}px` : value})`
            : `translateY(${typeof value === 'number' ? `${value}px` : value})`;
        } else if (prop === 'x') {
          element.style.transform = element.style.transform 
            ? `${element.style.transform} translateX(${typeof value === 'number' ? `${value}px` : value})`
            : `translateX(${typeof value === 'number' ? `${value}px` : value})`;
        } else if (prop === 'background') {
          element.style.background = value;
        } else if (prop === 'backgroundColor') {
          element.style.backgroundColor = value;
        } else if (prop === 'stroke') {
          element.setAttribute('stroke', value);
        } else if (prop === 'strokeDashoffset') {
          element.setAttribute('stroke-dashoffset', value);
        } else {
          // For standard CSS properties
          (element.style as any)[prop] = value;
        }
      });
      
      // Force reflow to ensure changes are applied before transition
      void element.offsetWidth;
      
      // Restore transition for the animation
      element.style.transition = originalTransition;
    });
    
    // Then animate to target properties
    return AnimationController.animate(selector, toProps, options);
  }

  // Create a timeline-like object
  static timeline(options: any = {}) {
    const animations: Array<() => void> = [];
    let currentDelay = 0;
    
    return {
      to: (selector: string | HTMLElement, properties: Record<string, any>, options: any = {}) => {
        const delay = options.delay || 0;
        const duration = options.duration || 0.3;
        
        // Store the animation function with its delay
        animations.push(() => {
          AnimationController.animate(
            selector, 
            properties, 
            { ...options, delay: currentDelay + delay }
          );
        });
        
        // Update total duration for chaining
        currentDelay += delay + duration;
        
        return this;
      },
      fromTo: (selector: string | HTMLElement, fromProps: Record<string, any>, toProps: Record<string, any>, options: any = {}) => {
        const delay = options.delay || 0;
        const duration = options.duration || 0.3;
        
        // Store the animation function with its delay
        animations.push(() => {
          AnimationController.fromTo(
            selector, 
            fromProps, 
            toProps, 
            { ...options, delay: currentDelay + delay }
          );
        });
        
        // Update total duration for chaining
        currentDelay += delay + duration;
        
        return this;
      },
      play: () => {
        // Execute all animations
        animations.forEach(animationFn => animationFn());
      },
      pause: () => {
        // Not implemented - for API compatibility
      },
      kill: () => {
        // Clear all animations (not fully possible with CSS, but we can at least clear the queue)
        animations.length = 0;
      }
    };
  }
} 