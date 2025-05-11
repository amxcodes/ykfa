import React, { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
// Removed import: import { optimizeImage } from '../utils/memoryOptimizer';
import { useMemoryOptimized } from '../hooks/useMemoryOptimized';

// Inline implementation of the optimizeImage function
/**
 * Optimize an image by reducing its quality and dimensions when appropriate
 * @param imgElement Image element to optimize
 * @param maxWidth Maximum width to scale to (default: 1200px)
 */
const optimizeImage = (imgElement: HTMLImageElement, maxWidth = 1200): void => {
  // Only optimize if image is larger than maxWidth
  if (imgElement.naturalWidth > maxWidth) {
    try {
      // Create a new optimized version
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate aspect ratio
      const ratio = maxWidth / imgElement.naturalWidth;
      canvas.width = maxWidth;
      canvas.height = imgElement.naturalHeight * ratio;
      
      // Draw scaled image
      if (ctx) {
        ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
        
        // Replace src with optimized version
        const optimizedSrc = canvas.toDataURL('image/jpeg', 0.7);
        imgElement.src = optimizedSrc;
      }
      
      // Clean up
      setTimeout(() => {
        canvas.width = 0;
        canvas.height = 0;
      }, 100);
    } catch (e) {
      // Silently fail if optimization fails
      console.warn('Image optimization failed:', e);
    }
  }
};

// Interface extending the standard HTML image attributes
interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  lowResSrc?: string;  // Optional low-resolution placeholder
  lazyLoad?: boolean;  // Whether to lazy load the image
  threshold?: number;  // Intersection threshold for lazy loading
  optimizeWidth?: number; // Width to optimize the image to
  blurUp?: boolean;    // Whether to use blur-up technique
}

/**
 * Memory-optimized image component
 * 
 * Displays images with memory and performance optimizations:
 * - Automatically downscales oversized images
 * - Optional lazy loading
 * - Optional blur-up effect
 * - Proper cleanup on unmount
 * - Memory-efficient loading
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  lowResSrc,
  lazyLoad = true,
  threshold = 0.1,
  optimizeWidth = 1200,
  blurUp = false,
  alt = '',
  className = '',
  style = {},
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(lowResSrc || '');
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Clean up any resources when component unmounts
  useMemoryOptimized(() => {
    if (observerRef.current && imgRef.current) {
      observerRef.current.unobserve(imgRef.current);
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    
    // Clear image src to help browser release memory
    if (imgRef.current) {
      imgRef.current.src = '';
    }
  });

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (!lazyLoad || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          loadImage();
          
          // Stop observing once loaded
          if (imgRef.current) {
            observer.unobserve(imgRef.current);
          }
        }
      },
      { threshold, rootMargin: '200px' }
    );

    observer.observe(imgRef.current);
    observerRef.current = observer;

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
      observer.disconnect();
    };
  }, [lazyLoad, threshold]);

  // Load the image without lazy loading
  useEffect(() => {
    if (!lazyLoad) {
      loadImage();
    }
  }, [lazyLoad, src]);

  // Optimize the image after it loads
  useEffect(() => {
    if (loaded && imgRef.current) {
      optimizeImage(imgRef.current, optimizeWidth);
    }
  }, [loaded, optimizeWidth]);

  // Load the full image
  const loadImage = () => {
    if (!src || currentSrc === src) return;
    
    const img = new Image();
    
    img.onload = () => {
      setCurrentSrc(src);
      setLoaded(true);
      
      // Clean up the temp image
      img.onload = null;
      img.onerror = null;
    };
    
    img.onerror = () => {
      console.error('Failed to load image:', src);
      // Keep low-res version if available
      setLoaded(true);
      
      // Clean up the temp image
      img.onload = null;
      img.onerror = null;
    };
    
    img.src = src;
  };

  // Apply blur-up effect CSS
  const imageStyle: React.CSSProperties = {
    ...style,
    transition: 'filter 0.5s ease-out',
    filter: loaded ? 'blur(0)' : blurUp ? 'blur(10px)' : 'none',
  };

  return (
    <img
      ref={imgRef}
      src={currentSrc || src}
      alt={alt}
      className={className}
      style={imageStyle}
      loading={lazyLoad ? 'lazy' : undefined}
      decoding="async"
      {...props}
      onLoad={() => {
        if (imgRef.current) {
          optimizeImage(imgRef.current, optimizeWidth);
        }
        setLoaded(true);
        props.onLoad?.call(null);
      }}
    />
  );
};

export default OptimizedImage; 