import { useState, useEffect, useRef } from 'react';
import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';
import { CURSOR_ATTRIBUTES } from '../types/cursor';
import CursorDialog from './CursorDialog';

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
  const [isCursorEnabled, setIsCursorEnabled] = useState<boolean | null>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const isInitialized = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  // Cleanup timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  // Listen for cursor preference changes from other components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cursorPreference') {
        const newPreference = e.newValue;
        if (newPreference === 'enabled') {
          setIsCursorEnabled(true);
        } else if (newPreference === 'disabled') {
          setIsCursorEnabled(false);
          // Ensure cursor is visible immediately
          if (typeof document !== 'undefined') {
            document.body.style.cursor = 'auto';
          }
        }
      }
    };
    
    // Also listen for the custom event from NavbarCursorControl
    const handleCursorDisabled = () => {
      setIsCursorEnabled(false);
      if (typeof document !== 'undefined') {
        document.body.style.cursor = 'auto';
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cursorDisabled', handleCursorDisabled);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cursorDisabled', handleCursorDisabled);
    };
  }, []);

  // Initialize cursor state on component mount
  useEffect(() => {
    // Check localStorage preference on mount
    const cursorPreference = localStorage.getItem('cursorPreference');
    if (cursorPreference === 'enabled') {
      setIsCursorEnabled(true);
    } else {
      // Default to disabled or explicitly disabled
      setIsCursorEnabled(false);
      // Ensure normal cursor is visible immediately
      if (typeof document !== 'undefined') {
        document.body.style.cursor = 'auto';
      }
    }
  }, []);

  // Handle cursor dialog responses
  const handleEnableCursor = () => {
    setIsCursorEnabled(true);
    localStorage.setItem('cursorPreference', 'enabled');
  };

  const handleDisableCursor = () => {
    setIsCursorEnabled(false);
    // Make sure normal cursor is visible immediately when disabled
    if (typeof document !== 'undefined') {
      document.body.style.cursor = 'auto';
      document.documentElement.style.cursor = 'auto';
      
      // Force normal cursor on all elements
      const styleElement = document.createElement('style');
      styleElement.innerHTML = `
        * {
          cursor: auto !important;
        }
      `;
      document.head.appendChild(styleElement);
      
      // Clear any existing timeout to prevent memory leaks
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      
      // Remove any custom cursor styles after a short delay
      timeoutRef.current = window.setTimeout(() => {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
          if ((el as HTMLElement).style) {
            (el as HTMLElement).style.cursor = '';
          }
        });
        // Clear the timeout reference after it's done
        timeoutRef.current = null;
      }, 50);
    }
    localStorage.setItem('cursorPreference', 'disabled');
  };

  // Ensure normal cursor is visible when custom cursor is disabled
  useEffect(() => {
    if (isCursorEnabled === false && typeof document !== 'undefined') {
      // Apply cursor style to document body
      document.body.style.cursor = 'auto';
      
      // Apply cursor style to html element
      document.documentElement.style.cursor = 'auto';
      
      // Force cursor style on all elements
      const styleElement = document.createElement('style');
      styleElement.innerHTML = `
        * {
          cursor: auto !important;
        }
      `;
      document.head.appendChild(styleElement);
      
      return () => {
        // Clean up the style element when effect is cleaned up
        if (styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement);
        }
      };
    }
  }, [isCursorEnabled]);

  // Check if we're in a browser environment and for touch devices
  useEffect(() => {
    // Skip if not in browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    // Always ensure normal cursor is visible when disabled
    if (isCursorEnabled === false) {
      document.body.style.cursor = 'auto';
      setIsVisible(false);
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
      } else if (isCursorEnabled) {
        document.body.style.cursor = 'none';
        setIsVisible(true);
      } else {
        document.body.style.cursor = 'auto';
        setIsVisible(false);
      }
    };
    
    checkTouchDevice();
    
    // Only adding this event if we're on desktop to avoid unnecessary work
    if (!isTouchDevice) {
      window.addEventListener('orientationchange', checkTouchDevice, { passive: true });
      return () => {
        window.removeEventListener('orientationchange', checkTouchDevice);
      };
    }
    
    return () => {
      // Always reset cursor on unmount
      document.body.style.cursor = 'auto';
    };
  }, [isCursorEnabled, isTouchDevice]);

  // Preload the cursor image - only once on initial mount
  useEffect(() => {
    if (typeof window === 'undefined' || isTouchDevice || isInitialized.current || isCursorEnabled === false) return;
    isInitialized.current = true;
    
    // Preload primary cursor image in an optimized way
    const img = new Image();
    const handleError = () => {
      console.warn('Failed to load primary cursor image, using fallback');
      setCursorImageError(true);
    };
    
    img.onload = () => {
      // Image loaded successfully
      setCursorImageError(false);
    };
    img.onerror = handleError;
    img.src = '/cursor.svg';
    
    // Set a timeout to use fallback if loading takes too long
    const timeoutId = setTimeout(handleError, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isTouchDevice, isCursorEnabled]);

  // Option to disable custom cursor with media query
  useEffect(() => {
    // Skip if not in browser environment or on touch devices or if cursor is disabled
    if (typeof window === 'undefined' || isTouchDevice || isCursorEnabled === false) {
      // Ensure normal cursor is visible when this effect is skipped
      if (typeof document !== 'undefined' && isCursorEnabled === false) {
        document.body.style.cursor = 'auto';
        setIsVisible(false);
      }
      return;
    }
    
    const checkMedia = () => {
      const preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (preferReducedMotion) {
        document.body.style.cursor = 'auto';
        setIsVisible(false);
        setCursorType('hidden');
      } else if (isCursorEnabled) {
        document.body.style.cursor = 'none';
        setIsVisible(true);
      } else {
        document.body.style.cursor = 'auto';
        setIsVisible(false);
      }
    };
    
    // Check on mount
    checkMedia();
    
    // Setup media query listeners - but only when needed
    const reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionMedia.addEventListener('change', checkMedia);
    
    return () => {
      reducedMotionMedia.removeEventListener('change', checkMedia);
      // Reset cursor on cleanup
      document.body.style.cursor = 'auto';
    };
  }, [isTouchDevice, isCursorEnabled]);

  // Main cursor effect - optimized to prevent too many updates
  useEffect(() => {
    // Skip on touch devices or if not in browser or if cursor is disabled
    if (isTouchDevice || typeof window === 'undefined' || !isVisible || isCursorEnabled === false) {
      // Always ensure normal system cursor is visible when this effect doesn't run
      if (typeof document !== 'undefined') {
        document.body.style.cursor = 'auto';
      }
      return;
    }
    
    // Only hide default cursor when custom cursor is enabled
    if (isCursorEnabled) {
      document.body.style.cursor = 'none';
    } else {
      document.body.style.cursor = 'auto';
    }
    
    // Use a throttled version of mousemove to improve performance
    let lastUpdateTime = 0;
    const updateThreshold = 16; // Only update every ~16ms (60fps)
    
    // Function to update cursor position - throttled
    const updatePosition = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdateTime < updateThreshold) return;
      
      lastUpdateTime = now;
      setPosition({ x: e.clientX, y: e.clientY });
      
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
          
        // Always maintain cursor visibility even on hover elements
        setCursorType(isPointer ? 'hover' : 'default');
        
        // Ensure cursor remains visible on all elements
        if (isVisible && isCursorEnabled) {
          setIsVisible(true);
        }
      }
    };

    // Tracking mouse movement - options for better performance
    window.addEventListener('mousemove', updatePosition, { passive: true });
    
    // Track mouse leave
    const handleMouseLeave = () => {
      setIsVisible(false);
    };
    window.addEventListener('mouseleave', handleMouseLeave);
    
    // Track mouse enter
    const handleMouseEnter = () => setIsVisible(true);
    window.addEventListener('mouseenter', handleMouseEnter);
    
    // Track mouse clicks with glass break effect - optimized
    let breakEffectActive = false;
    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      
      // Show glass break effect on left click, and only if not already active
      if (e.button === 0 && !breakEffectActive) { // Left mouse button
        breakEffectActive = true;
        setClickPosition({ x: e.clientX, y: e.clientY });
        setShowGlassBreak(true);
        
        // Reset glass break after animation completes
        setTimeout(() => {
          setShowGlassBreak(false);
          breakEffectActive = false;
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
  }, [isTouchDevice, isVisible, isCursorEnabled]);

  // Update animation controls when cursor state changes
  useEffect(() => {
    if (!isVisible || isCursorEnabled === false) return;
    
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
  }, [isClicking, cursorType, isVisible, controls, isCursorEnabled]);

  // Don't render on touch devices or when not visible or when cursor is disabled
  if (isCursorEnabled === false) {
    // Always restore default cursor before returning null
    if (typeof document !== 'undefined') {
      document.body.style.cursor = 'auto';
    }
    return null;
  }

  if (isTouchDevice || !isVisible) {
    if (isCursorEnabled === null) {
      return <CursorDialog onEnable={handleEnableCursor} onDisable={handleDisableCursor} />;
    }
    return null;
  }

  const generateGlassCracks = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const angle = (i * 72 + Math.random() * 20) % 360;
      const length = 10 + Math.random() * 15;
      const thickness = 0.5 + Math.random() * 1;

      return (
        <motion.div key={i} className="absolute" style={{ left: '50%', top: '50%' }}>
          <motion.div
            className="absolute bg-white/80"
            initial={{
              width: 0,
              height: thickness,
              x: 0,
              y: 0,
              opacity: 0,
              rotate: angle,
              transformOrigin: 'left center',
            }}
            animate={{
              width: length,
              opacity: 0.8,
              x: -thickness / 2,
              y: -thickness / 2,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.15,
              delay: 0.05,
              ease: 'easeOut',
            }}
          />
        </motion.div>
      );
    });
  };

  const cursorImageUrl = cursorImageError ? FALLBACK_CURSOR_URL : '/cursor.svg';

  return (
    <>
      {!isCursorEnabled && (
        <>
          <style>
            {`
              html, body, * {
                cursor: auto !important;
              }
            `}
          </style>
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              pointerEvents: 'none', 
              zIndex: 9999 
            }} 
            className="normal-cursor-enforcer"
          />
        </>
      )}
      {isCursorEnabled && (
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
            transformOrigin: 'left top',
            willChange: 'transform' // Optimization for smoother transitions
          }}
        >
          <img 
            src={cursorImageUrl}
            alt="" 
            className="w-full h-full"
            onError={() => {
              setCursorImageError(true);
            }}
            style={{ 
              filter: cursorType === 'hover' || cursorType === 'click' 
                ? 'drop-shadow(0 0 2px rgba(251, 191, 36, 0.7))' 
                : 'none',
              willChange: 'filter' // Optimization for smoother filter transitions
            }}
            loading="eager"
            width={24}
            height={24}
          />
        </motion.div>
      )}

      {/* Glass crack effect - only rendered when needed */}
      {showGlassBreak && isCursorEnabled && (
        <AnimatePresence>
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
              willChange: 'transform'
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
        </AnimatePresence>
        )}
    </>
  );
};

export default CustomCursor;