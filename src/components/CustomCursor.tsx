import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CURSOR_ATTRIBUTES } from '../types/cursor';

// Cursor interaction types
type CursorType = 'default' | 'hover' | 'click' | 'text' | 'hidden';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

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
    
    // Track mouse clicks
    const handleMouseDown = () => setIsClicking(true);
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

  // Don't render on touch devices or when not visible
  if (isTouchDevice || !isVisible) return null;

  // Get cursor size based on type
  const getCursorSize = () => {
    switch(cursorType) {
      case 'hover':
        return { size: '24px', offset: '-12px' };
      case 'click':
        return { size: '20px', offset: '-10px' };
      default:
        return { size: '12px', offset: '-6px' };
    }
  };

  const cursorSize = getCursorSize();

  return (
    <motion.div
      className={`fixed pointer-events-none z-[9999] rounded-full bg-amber-400 ${cursorType === 'hidden' ? 'opacity-0' : ''}`}
      animate={{
        x: position.x,
        y: position.y,
        scale: isClicking ? 0.8 : 1,
        opacity: isVisible && cursorType !== 'hidden' ? 1 : 0
      }}
      transition={{
        type: "spring",
        stiffness: 1000,
        damping: 45,
        mass: 0.2
      }}
      style={{
        height: cursorSize.size,
        width: cursorSize.size,
        marginLeft: cursorSize.offset,
        marginTop: cursorSize.offset,
        mixBlendMode: 'difference'
      }}
    />
  );
};

export default CustomCursor; 