import { useState, useEffect, useRef } from 'react';
import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';
import { CURSOR_ATTRIBUTES } from '../types/cursor';

// Cursor interaction types
type CursorType = 'default' | 'hover' | 'click' | 'hidden';

// Fallback cursor image URL
const FALLBACK_CURSOR_URL = 'https://i.postimg.cc/3rqFCsgp/cursor.png';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showGlassBreak, setShowGlassBreak] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [cursorImageError, setCursorImageError] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const glassBreakControls = useAnimationControls();

  // Check if we're in a browser environment and for touch devices
  useEffect(() => {
    // Skip if not in browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    // Check if it's a touch device
    const checkTouchDevice = () => {
      const isTouchable = 
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 || 
        (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
        
      setIsTouchDevice(isTouchable);
      
      if (isTouchable) {
        document.body.style.cursor = 'auto';
        setIsVisible(false);
      } else {
        document.body.style.cursor = 'none';
        setIsVisible(true);
      }
    };
    
    checkTouchDevice();
    
    // Also check when device orientation changes (might indicate tablet mode switch)
    window.addEventListener('orientationchange', checkTouchDevice);
    
    return () => {
      window.removeEventListener('orientationchange', checkTouchDevice);
    };
  }, []);

  // Preload the cursor image
  useEffect(() => {
    if (typeof window === 'undefined' || isTouchDevice) return;
    
    // Preload primary cursor image
    const preloadImage = new Image();
    preloadImage.src = '/cursor.svg';
    preloadImage.onerror = () => {
      console.warn('Failed to load primary cursor image, using fallback');
      setCursorImageError(true);
      
      // Try to preload the fallback image
      const fallbackImage = new Image();
      fallbackImage.src = FALLBACK_CURSOR_URL;
    };
    
    // Also preload fallback image just in case
    const fallbackImage = new Image();
    fallbackImage.src = FALLBACK_CURSOR_URL;
  }, [isTouchDevice]);

  // Option to disable custom cursor with media query
  useEffect(() => {
    // Skip if not in browser environment
    if (typeof window === 'undefined' || isTouchDevice) {
      return;
    }
    
    const checkMedia = () => {
      const preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (preferReducedMotion) {
        document.body.style.cursor = 'auto';
        setIsVisible(false);
        setCursorType('hidden');
      } else {
        document.body.style.cursor = 'none';
        setIsVisible(true);
      }
    };
    
    // Check on mount
    checkMedia();
    
    // Setup media query listeners
    const reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionMedia.addEventListener('change', checkMedia);
    
    return () => {
      reducedMotionMedia.removeEventListener('change', checkMedia);
    };
  }, [isTouchDevice]);

  // Main cursor effect
  useEffect(() => {
    // Skip on touch devices or if not in browser
    if (isTouchDevice || typeof window === 'undefined') {
      return;
    }
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Function to update cursor position
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      
      // Check cursor interaction type based on element attributes
      const target = e.target as HTMLElement;
      
      // First check for custom attributes
      if (target.hasAttribute(CURSOR_ATTRIBUTES.HIDDEN) || target.closest(`[${CURSOR_ATTRIBUTES.HIDDEN}]`)) {
        setCursorType('hidden');
      } else if (target.hasAttribute(CURSOR_ATTRIBUTES.CLICK) || target.closest(`[${CURSOR_ATTRIBUTES.CLICK}]`)) {
        setCursorType('click');
      } else if (target.hasAttribute(CURSOR_ATTRIBUTES.HOVER) || target.closest(`[${CURSOR_ATTRIBUTES.HOVER}]`)) {
        setCursorType('hover');
      } else {
        // Fallback to CSS cursor property detection
        const isPointer = 
          target.tagName === 'BUTTON' || 
          target.tagName === 'A' || 
          target.closest('button') || 
          target.closest('a') ||
          window.getComputedStyle(target).cursor === 'pointer';
          
        setCursorType(isPointer ? 'hover' : 'default');
      }
    };

    // Tracking mouse movement
    window.addEventListener('mousemove', updatePosition);
    
    // Track mouse leave
    const handleMouseLeave = () => {
      setIsVisible(false);
      setCursorType('hidden');
    };
    window.addEventListener('mouseleave', handleMouseLeave);
    
    // Track mouse enter
    const handleMouseEnter = () => setIsVisible(true);
    window.addEventListener('mouseenter', handleMouseEnter);
    
    // Track mouse clicks with glass break effect
    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      
      // Show glass break effect on left click
      if (e.button === 0) { // Left mouse button
        setClickPosition({ x: e.clientX, y: e.clientY });
        setShowGlassBreak(true);
        
        // Reset glass break after animation completes
        setTimeout(() => {
          setShowGlassBreak(false);
        }, 500); // Duration of animation
      }
    };
    
    const handleMouseUp = () => setIsClicking(false);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Cleanup
    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isTouchDevice]);

  // Update animation controls when cursor state changes
  useEffect(() => {
    if (!isVisible) return;
    
    const scale = isClicking ? 0.85 : 
      cursorType === 'hover' ? 1.1 : 
      cursorType === 'click' ? 1.2 : 1;
    
    const rotate = isClicking ? -10 : 0;
    
    controls.start({
      scale,
      rotate,
      opacity: cursorType === 'hidden' ? 0 : 1,
      transition: {
        type: "spring",
        stiffness: 1000,
        damping: 45,
        mass: 0.2
      }
    });
  }, [isClicking, cursorType, isVisible, controls]);

  // Don't render on touch devices or when not visible
  if (isTouchDevice || !isVisible) return null;

  // Generate glass crack pattern for a more realistic effect
  const generateGlassCracks = () => {
    // Create multiple crack lines radiating from center
    return Array.from({ length: 8 }, (_, i) => {
      const angle = (i * 45 + Math.random() * 30) % 360; // Distribute evenly with some randomness
      const length = 10 + Math.random() * 20; // Random length
      const thickness = 0.5 + Math.random() * 1.5; // Random thickness
      
      // Calculate end points using trig
      const endX = Math.cos(angle * Math.PI / 180) * length;
      const endY = Math.sin(angle * Math.PI / 180) * length;
      
      // Create a line with small connecting branches
      return (
        <motion.div key={i} className="absolute" style={{ left: '50%', top: '50%' }}>
          {/* Main crack line */}
          <motion.div
            className="absolute bg-white/90"
            initial={{ 
              width: 0,
              height: thickness,
              x: 0,
              y: 0,
              opacity: 0,
              rotate: angle,
              transformOrigin: 'left center'
            }}
            animate={{ 
              width: length,
              opacity: 0.8,
              x: -thickness/2,
              y: -thickness/2,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.15, 
              ease: "easeOut"
            }}
            style={{
              boxShadow: '0 0 2px rgba(255, 255, 255, 0.7)'
            }}
          />
          
          {/* Branch cracks - only for longer cracks */}
          {length > 15 && (
            <>
              <motion.div
                className="absolute bg-white/80"
                initial={{ 
                  width: 0,
                  height: thickness * 0.8,
                  x: 0,
                  y: 0,
                  opacity: 0,
                  rotate: angle + 25 + Math.random() * 15,
                  transformOrigin: 'left center'
                }}
                animate={{ 
                  width: length * 0.4,
                  opacity: 0.7,
                  x: length * 0.6 - thickness/2,
                  y: -thickness/2,
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.15, 
                  delay: 0.05,
                  ease: "easeOut"
                }}
                style={{
                  boxShadow: '0 0 1px rgba(255, 255, 255, 0.5)'
                }}
              />
              
              {/* Additional smaller branch for more complexity */}
              <motion.div
                className="absolute bg-white/70"
                initial={{ 
                  width: 0,
                  height: thickness * 0.6,
                  x: 0,
                  y: 0,
                  opacity: 0,
                  rotate: angle - 30 - Math.random() * 15,
                  transformOrigin: 'left center'
                }}
                animate={{ 
                  width: length * 0.3,
                  opacity: 0.6,
                  x: length * 0.4 - thickness/2,
                  y: -thickness/2,
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.12, 
                  delay: 0.08,
                  ease: "easeOut"
                }}
                style={{
                  boxShadow: '0 0 1px rgba(255, 255, 255, 0.5)'
                }}
              />
            </>
          )}
        </motion.div>
      );
    });
  };

  // Determine which cursor image URL to use
  const cursorImageUrl = cursorImageError ? FALLBACK_CURSOR_URL : '/cursor.svg';

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999]"
        animate={controls}
        initial={{ opacity: 0, scale: 0 }}
        style={{
          left: position.x,
          top: position.y,
          width: 24,
          height: 24,
          x: -8,
          y: -5,
          transformOrigin: 'left top'
        }}
      >
        <img 
          src={cursorImageUrl}
          alt="" 
          className="w-full h-full"
          onError={() => {
            console.warn('Error loading cursor image, using fallback');
            setCursorImageError(true);
          }}
          style={{ 
            filter: cursorType === 'hover' || cursorType === 'click' 
              ? 'drop-shadow(0 0 2px rgba(251, 191, 36, 0.7))' 
              : 'none'
          }}
        />
      </motion.div>

      {/* Glass crack effect */}
      <AnimatePresence>
        {showGlassBreak && (
          <motion.div
            className="fixed pointer-events-none z-[9998]" 
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              left: clickPosition.x,
              top: clickPosition.y,
              width: 40,
              height: 40,
              x: -20,
              y: -20,
            }}
          >
            {/* Center impact point */}
            <motion.div
              className="absolute rounded-full bg-white/95"
              initial={{ width: 0, height: 0, x: '50%', y: '50%', translateX: '-50%', translateY: '-50%' }}
              animate={{ 
                width: 3,
                height: 3,
                opacity: [0, 1, 0.7],
              }}
              transition={{ duration: 0.2 }}
              style={{
                boxShadow: '0 0 4px rgba(255, 255, 255, 0.9)',
              }}
            />
            
            {/* Circular impact wave */}
            <motion.div 
              className="absolute rounded-full border border-white/30 backdrop-blur-[1px]"
              initial={{ 
                width: 0, 
                height: 0, 
                x: '50%', 
                y: '50%', 
                translateX: '-50%', 
                translateY: '-50%',
                opacity: 0.6 
              }}
              animate={{ 
                width: [0, 40],
                height: [0, 40],
                opacity: [0.6, 0],
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            
            {/* Glass crack pattern */}
            {generateGlassCracks()}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomCursor; 