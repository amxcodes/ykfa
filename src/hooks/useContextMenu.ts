import { useState, useEffect, useCallback, RefObject, useRef } from 'react';
import { throttle, safeAddEventListener, safeRemoveEventListener } from '../utils/performanceUtils';
import { createMemorySafeEventHandler } from '../utils/memoryProfiler';

interface ContextMenuPosition {
  x: number;
  y: number;
}

interface UseContextMenuOptions {
  menuWidth?: number;
  menuHeight?: number;
  menuRef?: RefObject<HTMLElement>;
  onOpen?: () => void;
  onClose?: () => void;
  excludeElements?: string[];
}

/**
 * Custom hook to manage context menu behavior with optimized memory usage
 */
export function useContextMenu({
  menuWidth = 220,
  menuHeight = 180,
  menuRef,
  onOpen,
  onClose,
  excludeElements = ['INPUT', 'TEXTAREA']
}: UseContextMenuOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<ContextMenuPosition>({ x: 0, y: 0 });
  
  // Store cleanup functions for memory-safe event handlers
  const cleanupFunctionsRef = useRef<Array<() => void>>([]);

  // Calculate optimal position for the menu
  const calculateMenuPosition = useCallback(
    (clientX: number, clientY: number): ContextMenuPosition => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Ensure menu doesn't go off-screen
      let xPos = Math.max(10, Math.min(clientX, windowWidth - menuWidth - 10));
      let yPos = Math.max(10, Math.min(clientY, windowHeight - menuHeight - 10));

      return { x: xPos, y: yPos };
    },
    [menuWidth, menuHeight]
  );

  // Handle context menu event
  const handleContextMenu = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();

      // Check if the click was on an excluded element
      const targetElement = event.target as HTMLElement;
      
      if (
        excludeElements.includes(targetElement.tagName) ||
        targetElement.isContentEditable ||
        targetElement.closest('[data-no-context-menu="true"]')
      ) {
        return;
      }

      const newPosition = calculateMenuPosition(event.clientX, event.clientY);
      setPosition(newPosition);
      setIsVisible(true);
      
      // Call onOpen callback if provided
      onOpen?.();
    },
    [calculateMenuPosition, excludeElements, onOpen]
  );

  // Handle clicks outside the menu
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (isVisible && menuRef?.current && !menuRef.current.contains(event.target as Node)) {
        setIsVisible(false);
        
        // Call onClose callback if provided
        onClose?.();
      }
    },
    [isVisible, menuRef, onClose]
  );

  // Throttled scroll handler to improve performance
  const handleScroll = useCallback(
    throttle(() => {
      if (isVisible) {
        setIsVisible(false);
        onClose?.();
      }
    }, 100),
    [isVisible, onClose]
  );

  // Handle escape key press
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        setIsVisible(false);
        onClose?.();
      }
    },
    [isVisible, onClose]
  );

  // Throttled resize handler to improve performance
  const handleResize = useCallback(
    throttle(() => {
      if (isVisible) {
        setIsVisible(false);
        onClose?.();
      }
    }, 100),
    [isVisible, onClose]
  );

  // Set up event listeners with improved memory management
  useEffect(() => {
    // Clean up any previous event listeners
    cleanupFunctionsRef.current.forEach(cleanup => cleanup());
    cleanupFunctionsRef.current = [];
    
    // Use memory-safe event handlers to prevent memory leaks
    const cleanupContextMenu = createMemorySafeEventHandler(
      window, 
      'contextmenu', 
      handleContextMenu
    );
    
    const cleanupClickOutside = createMemorySafeEventHandler(
      window, 
      'click', 
      handleClickOutside
    );
    
    const cleanupScroll = createMemorySafeEventHandler(
      window, 
      'scroll', 
      handleScroll, 
      { passive: true }
    );
    
    const cleanupKeyDown = createMemorySafeEventHandler(
      window, 
      'keydown', 
      handleKeyDown
    );
    
    const cleanupResize = createMemorySafeEventHandler(
      window, 
      'resize', 
      handleResize, 
      { passive: true }
    );
    
    // Store cleanup functions
    cleanupFunctionsRef.current = [
      cleanupContextMenu,
      cleanupClickOutside,
      cleanupScroll,
      cleanupKeyDown,
      cleanupResize
    ];

    // Clean up event listeners when component unmounts
    return () => {
      cleanupFunctionsRef.current.forEach(cleanup => cleanup());
      cleanupFunctionsRef.current = [];
    };
  }, [handleContextMenu, handleClickOutside, handleScroll, handleKeyDown, handleResize]);

  // Method to manually close the context menu
  const closeMenu = useCallback(() => {
    setIsVisible(false);
    onClose?.();
  }, [onClose]);

  return {
    isVisible,
    position,
    closeMenu,
    setIsVisible
  };
} 