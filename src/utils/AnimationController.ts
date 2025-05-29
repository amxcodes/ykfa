// Animation controller to replace GSAP with CSS animations
export class AnimationController {
  private static activeAnimations = new WeakMap<HTMLElement, Set<number>>();
  
  private static cleanupElement(element: HTMLElement) {
    const timeouts = this.activeAnimations.get(element);
    if (timeouts) {
      timeouts.forEach(id => {
        clearTimeout(id);
        clearInterval(id);
      });
      timeouts.clear();
      this.activeAnimations.delete(element);
    }
  }

  private static trackTimeout(element: HTMLElement, id: number) {
    if (!this.activeAnimations.has(element)) {
      this.activeAnimations.set(element, new Set());
    }
    this.activeAnimations.get(element)?.add(id);
  }

  private static untrackTimeout(element: HTMLElement, id: number) {
    this.activeAnimations.get(element)?.delete(id);
  }

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
    
    Array.from(elements).forEach(el => {
      const element = el as HTMLElement;
      
      // Clean up any existing animations on this element
      this.cleanupElement(element);
      
      // Save original styles
      const originalStyles = {
        transition: element.style.transition,
        transform: element.style.transform,
        opacity: element.style.opacity,
        // Add other properties as needed
      };
      
      // Set transition property
      element.style.transition = `all ${duration}s ${ease} ${delay}s`;
      
      // Apply properties after a small delay
      const applyTimeout = setTimeout(() => {
        Object.entries(properties).forEach(([prop, value]) => {
          if (prop === 'scale') {
            element.style.transform = `scale(${value})`;
          } else if (prop === 'opacity') {
            element.style.opacity = String(value);
          } else {
            (element.style as any)[prop] = value;
          }
        });
      }, 10);
      
      this.trackTimeout(element, applyTimeout);
      
      // Handle cleanup and completion
      const cleanupTimeout = setTimeout(() => {
        // Restore original transition
        element.style.transition = originalStyles.transition;
        
        if (onComplete) onComplete();
        
        this.untrackTimeout(element, applyTimeout);
        this.untrackTimeout(element, cleanupTimeout);
      }, (duration + delay) * 1000 + 50);
      
      this.trackTimeout(element, cleanupTimeout);
      
      // Handle repeat and yoyo if needed
      if (repeat > 0 || repeat === -1) {
        let currentRepeat = 0;
        const totalTime = duration * 1000;
        
        const intervalId = setInterval(() => {
          if (repeat !== -1 && currentRepeat >= repeat) {
            clearInterval(intervalId);
            this.untrackTimeout(element, intervalId);
            return;
          }
          
          currentRepeat++;
          
          if (yoyo) {
            Object.entries(properties).forEach(([prop, value]) => {
              if (prop === 'scale') {
                element.style.transform = `scale(${currentRepeat % 2 === 0 ? 1 : value})`;
              } else if (prop === 'opacity') {
                element.style.opacity = currentRepeat % 2 === 0 ? '1' : String(value);
              }
            });
          }
        }, totalTime);
        
        this.trackTimeout(element, intervalId);
      }
    });
    
    return {
      cancel: () => {
        elements.forEach(el => {
          this.cleanupElement(el as HTMLElement);
        });
      }
    };
  }

  // Apply CSS transition with from and to values
  static fromTo(selector: string | HTMLElement, fromProps: Record<string, any>, toProps: Record<string, any>, options: {
    duration?: number;
    ease?: string;
    delay?: number;
    onComplete?: () => void;
  } = {}) {
    const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];
    
    if (elements.length === 0) return null;
    
    Array.from(elements).forEach(el => {
      const element = el as HTMLElement;
      
      // Clean up any existing animations
      this.cleanupElement(element);
      
      // Save original styles
      const originalStyles = {
        transition: element.style.transition,
        transform: element.style.transform,
        opacity: element.style.opacity,
      };
      
      // Apply from properties immediately
      element.style.transition = 'none';
      Object.entries(fromProps).forEach(([prop, value]) => {
        if (prop === 'scale') {
          element.style.transform = `scale(${value})`;
        } else if (prop === 'opacity') {
          element.style.opacity = String(value);
        } else {
          (element.style as any)[prop] = value;
        }
      });
      
      // Force reflow
      void element.offsetWidth;
      
      // Animate to target properties
      this.animate(element, toProps, options);
    });
    
    return {
      cancel: () => {
        elements.forEach(el => {
          this.cleanupElement(el as HTMLElement);
        });
      }
    };
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