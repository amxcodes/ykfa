import React, { useState, useEffect, useRef, ImgHTMLAttributes, useContext } from 'react';
import { WidgetContext } from '../App';

// Interface extending the standard HTML image attributes
interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  lowResSrc?: string;  // Optional low-resolution placeholder
  lazyLoad?: boolean;  // Whether to lazy load the image
  optimizeWidth?: number; // Width to optimize the image to
  blurUp?: boolean;    // Whether to use blur-up technique
  forceLowQuality?: boolean; // Force low quality regardless of performance mode
  isCritical?: boolean; // NEW: mark above-the-fold images
  threshold?: number;
}

/**
 * Memory-optimized image component (Refactored for Performance)
 * 
 * Uses createImageBitmap and offscreen canvas to resize images ASYNCHRONOUSLY.
 * This prevents the main thread from freezing during scrolling.
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
  isCritical = false,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [displayedSrc, setDisplayedSrc] = useState<string>(lowResSrc || src || '');
  const [isOptimized, setIsOptimized] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const mountedRef = useRef(true);

  // Get performance mode from context
  const { performanceMode } = useContext(WidgetContext);

  // Adjust optimization settings based on performance mode
  const effectiveOptimizeWidth = performanceMode ? Math.min(optimizeWidth, 500) : optimizeWidth; // Aggressive downscaling for mobile
  const effectiveBlurUp = performanceMode ? false : blurUp;
  const imageQuality = (performanceMode || forceLowQuality) ? 0.6 : 0.8;

  // Cleanup effect
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // Disconnect observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      // Revoke any object URLs we created to free memory
      if (displayedSrc && displayedSrc.startsWith('blob:')) {
        URL.revokeObjectURL(displayedSrc);
      }
    };
  }, [displayedSrc]);

  // Async Image Processor
  const processImage = async (originalSrc: string) => {
    if (!originalSrc) return;

    try {
      // 1. Fetch the image data (Async)
      const response = await fetch(originalSrc);
      const blob = await response.blob();

      if (!mountedRef.current) return;

      // 2. Create ImageBitmap with resizing (Async, GPU accelerated on supported browsers)
      // This is the key performance fix: resizing happens off the main thread
      let bitmap: ImageBitmap;
      try {
        bitmap = await createImageBitmap(blob, {
          resizeWidth: effectiveOptimizeWidth,
          resizeQuality: 'high'
        });
      } catch (e) {
        // Fallback for browsers that don't support resize options in createImageBitmap
        bitmap = await createImageBitmap(blob);
      }

      if (!mountedRef.current) {
        bitmap.close();
        return;
      }

      // 3. Draw to offscreen canvas to get optimized Blob (Async-ish)
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('bitmaprenderer');

      if (ctx) {
        // Ultra-fast transfer
        ctx.transferFromImageBitmap(bitmap);
      } else {
        // Fallback context
        const ctx2d = canvas.getContext('2d');
        if (ctx2d) {
          ctx2d.drawImage(bitmap, 0, 0);
        }
        bitmap.close();
      }

      // 4. Convert to compressed Blob (Async)
      canvas.toBlob(
        (optimizedBlob) => {
          if (!mountedRef.current || !optimizedBlob) return;

          const optimizedUrl = URL.createObjectURL(optimizedBlob);
          setDisplayedSrc(optimizedUrl);
          setLoaded(true);
          setIsOptimized(true);

          // Cleanup canvas
          canvas.width = 0;
          canvas.height = 0;
        },
        'image/jpeg',
        imageQuality
      );

    } catch (error) {
      // Fallback to original src if anything fails
      if (mountedRef.current) {
        console.warn('Image optimization failed, falling back to original', error);
        setDisplayedSrc(originalSrc);
        setLoaded(true);
      }
    }
  };

  // Visibility Observer
  useEffect(() => {
    if (isCritical) {
      processImage(src || '');
      return;
    }

    if (!lazyLoad) {
      processImage(src || '');
      return;
    }

    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          processImage(src || '');
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '200px' }
    );

    observer.observe(imgRef.current);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [src, lazyLoad, isCritical, effectiveOptimizeWidth]);


  // Apply blur-up effect CSS
  const imageStyle: React.CSSProperties = {
    ...style,
    transition: 'filter 0.3s ease-out, opacity 0.3s ease-out',
    filter: loaded && isOptimized ? 'blur(0)' : effectiveBlurUp ? 'blur(10px)' : 'none',
    opacity: loaded ? 1 : (lowResSrc ? 1 : 0),
  };

  return (
    <img
      ref={imgRef}
      src={displayedSrc}
      alt={alt}
      className={className}
      style={imageStyle}
      loading={isCritical ? 'eager' : (lazyLoad ? 'lazy' : undefined)}
      decoding="async"
      {...props}
    />
  );
};

export default OptimizedImage;