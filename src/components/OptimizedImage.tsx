import React, { useState, useEffect, useRef, ImgHTMLAttributes, useContext } from 'react';
// Removed import: import { optimizeImage } from '../utils/memoryOptimizer';
import { useMemoryOptimized } from '../hooks/useMemoryOptimized';
import { WidgetContext } from '../App';

// Inline implementation of the optimizeImage function
/**
 * Optimize an image by reducing its quality and dimensions when appropriate
 * @param imgElement Image element to optimize
 * @param maxWidth Maximum width to scale to (default: 1200px)
 * @param quality JPEG quality (0-1), lower in performance mode
 */
const optimizeImage = (imgElement: HTMLImageElement, maxWidth = 1200, quality = 0.7): void => {
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
        const optimizedSrc = canvas.toDataURL('image/jpeg', quality);
        imgElement.src = optimizedSrc;
      }
      
      // Clean up
      setTimeout(() => {
        canvas.width = 0;
        canvas.height = 0;
      }, 100);
    } catch (e) {
  
    }
  }
};

// Interface extending the standard HTML image attributes
interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  lowResSrc?: string;  // Optional low-resolution placeholder
  lazyLoad?: boolean;  // Whether to lazy load the image
  optimizeWidth?: number; // Width to optimize the image to
  blurUp?: boolean;    // Whether to use blur-up technique
  forceLowQuality?: boolean; // Force low quality regardless of performance mode
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
 * - Respects performance mode settings
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
  forceLowQuality = false,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(lowResSrc || '');
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Get performance mode from context
  const { performanceMode } = useContext(WidgetContext);
  
  // Adjust optimization settings based on performance mode
  const effectiveOptimizeWidth = performanceMode ? Math.min(optimizeWidth, 800) : optimizeWidth;
  const effectiveBlurUp = performanceMode ? false : blurUp;
  const imageQuality = (performanceMode || forceLowQuality) ? 0.5 : 0.7;

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
      optimizeImage(imgRef.current, effectiveOptimizeWidth, imageQuality);
    }
  }, [loaded, effectiveOptimizeWidth, imageQuality]);

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
      // Keep low-res version if available
      setLoaded(true);
      
      // Clean up the temp image
      img.onload = null;
      img.onerror = null;
    };
    
    // In performance mode, add query params to request smaller images if supported by the server
    if (performanceMode && src.includes('?') === false && !src.startsWith('data:')) {
      img.src = `${src}?w=${effectiveOptimizeWidth}&q=50`;
    } else {
    img.src = src;
    }
  };

  // Apply blur-up effect CSS
  const imageStyle: React.CSSProperties = {
    ...style,
    transition: 'filter 0.5s ease-out',
    filter: loaded ? 'blur(0)' : effectiveBlurUp ? 'blur(10px)' : 'none',
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
          optimizeImage(imgRef.current, effectiveOptimizeWidth, imageQuality);
        }
        setLoaded(true);
        props.onLoad?.call(null);
      }}
    />
  );
};

export default OptimizedImage; 