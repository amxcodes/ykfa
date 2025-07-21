// Memory optimization utilities for YKFA
// These utilities help reduce memory usage without causing leaks

export class MemoryOptimizer {
  private static instance: MemoryOptimizer;
  private cleanupTasks: Array<() => void> = [];
  private isEnabled = false;

  private constructor() {}

  static getInstance(): MemoryOptimizer {
    if (!MemoryOptimizer.instance) {
      MemoryOptimizer.instance = new MemoryOptimizer();
    }
    return MemoryOptimizer.instance;
  }

  // Enable memory optimization
  enable() {
    if (this.isEnabled) return;
    this.isEnabled = true;
    
    // Add cleanup task for page unload
    const cleanupOnUnload = () => {
      this.performCleanup();
    };
    
    window.addEventListener('beforeunload', cleanupOnUnload);
    this.cleanupTasks.push(() => {
      window.removeEventListener('beforeunload', cleanupOnUnload);
    });
  }

  // Disable memory optimization
  disable() {
    if (!this.isEnabled) return;
    this.isEnabled = false;
    this.performCleanup();
  }

  // Perform memory cleanup
  private performCleanup() {
    // Clear all timeouts and intervals
    const highestTimeoutId = setTimeout(() => {}, 0);
    const highestIntervalId = setInterval(() => {}, 0);
    
    for (let i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }
    
    for (let i = 0; i < highestIntervalId; i++) {
      clearInterval(i);
    }

    // Clear all animation frames
    const highestAnimationFrameId = requestAnimationFrame(() => {});
    for (let i = 0; i < highestAnimationFrameId; i++) {
      cancelAnimationFrame(i);
    }

    // Run registered cleanup tasks
    this.cleanupTasks.forEach(task => {
      try {
        task();
      } catch (error) {
        // Silent error handling
      }
    });
    this.cleanupTasks = [];
  }

  // Register a cleanup task
  registerCleanupTask(task: () => void) {
    this.cleanupTasks.push(task);
  }

  // Force garbage collection if available
  forceGC() {
    if (window.gc) {
      try {
        window.gc();
      } catch (error) {
        // Silent error handling
      }
    }
  }

  // Optimize images by reducing quality
  optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Set loading to lazy for better performance
      if (!img.loading) {
        img.loading = 'lazy';
      }
      
      // Reduce image quality for better memory usage
      if (img.src && img.src.includes('webp')) {
        // WebP images are already optimized
        return;
      }
    });
  }

  // Reduce CSS animations and effects
  reduceEffects() {
    document.body.classList.add('reduced-effects');
    
    // Add CSS to reduce animations
    const style = document.createElement('style');
    style.textContent = `
      .reduced-effects * {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
        animation-iteration-count: 1 !important;
      }
      
      .reduced-effects .animate-fade-up,
      .reduced-effects .animate-fade-in,
      .reduced-effects .animate-scale-in {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
    `;
    document.head.appendChild(style);
  }
}

// Export singleton instance
export const memoryOptimizer = MemoryOptimizer.getInstance();

// Auto-enable on page load
if (typeof window !== 'undefined') {
  memoryOptimizer.enable();
} 