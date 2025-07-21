import React, { useContext, useRef, memo, useMemo, useEffect } from 'react';
import { MessageCircle, Bot, Calculator, X } from 'lucide-react';
import { WidgetContext } from '../App';
import { useContextMenu } from '../hooks/useContextMenu';
import { optimizedAnimation } from '../utils/performanceUtils';
import { useLocation, useNavigate } from 'react-router-dom';

const STABLE_EXCLUDE_ELEMENTS = ['INPUT', 'TEXTAREA', 'SELECT'];

// Using memo to prevent unnecessary re-renders
const RightClickMenu: React.FC = memo(() => {
  const { setActiveWidget } = useContext(WidgetContext);
  const menuRef = useRef<HTMLDivElement>(null);
  const animationCleanupRef = useRef<(() => void) | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // DISABLED memory monitoring to prevent memory leaks
  // Initialize memory profiler
  // useEffect(() => {
  //   // Start memory monitoring with custom parameters
  //   startMemoryMonitoring(10000, 50, 0.7); // Check every 10s, keep 50 entries, warn at 70% usage
  //   
  //   // Stop monitoring when component unmounts
  //   return () => {
  //     stopMemoryMonitoring();
  //   };
  // }, []);
  
  // Memoized menu options to prevent recreating on each render
  const menuOptions = useMemo(() => [
    {
      id: 'whatsapp',
      label: 'Chat on WhatsApp',
      icon: <MessageCircle className="w-4 h-4 mr-3 text-green-400 group-hover:scale-110 transition-transform" />,
      color: 'from-green-500/30 to-green-600/10',
      description: 'Send us a message'
    },
    {
      id: 'chatbot',
      label: 'AI Assistant',
      icon: <Bot className="w-4 h-4 mr-3 text-blue-400 group-hover:scale-110 transition-transform" />,
      color: 'from-blue-500/30 to-blue-600/10',
      description: 'Ask our chatbot'
    },
    {
      id: 'bmi',
      label: 'BMI Calculator',
      icon: <Calculator className="w-4 h-4 mr-3 text-amber-400 group-hover:scale-110 transition-transform" />,
      color: 'from-amber-500/30 to-amber-600/10',
      description: 'Check your BMI'
    }
  ], []);

  // Use our custom hook for context menu functionality
  const { isVisible, position, closeMenu } = useContextMenu({
    menuWidth: 220,
    menuHeight: 180,
    menuRef,
    excludeElements: STABLE_EXCLUDE_ELEMENTS
  });

  // Ref to store navigation timeout
  const navTimeoutRef = useRef<number | null>(null);
  
  // Cleanup navigation timeout on unmount
  useEffect(() => {
    return () => {
      if (navTimeoutRef.current) {
        clearTimeout(navTimeoutRef.current);
        navTimeoutRef.current = null;
      }
    };
  }, []);
  
  // Handle menu item click with widget activation and navigation
  const handleMenuItemClick = (widgetName: 'whatsapp' | 'chatbot' | 'bmi') => {
    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      
      // Clear any existing timeout
      if (navTimeoutRef.current) {
        clearTimeout(navTimeoutRef.current);
      }
      
      // Set a small timeout to ensure navigation completes before activating widget
      navTimeoutRef.current = window.setTimeout(() => {
        setActiveWidget(widgetName);
        navTimeoutRef.current = null;
      }, 100);
    } else {
      // Already on home page, just activate the widget
      setActiveWidget(widgetName);
    }
    
    // Close the context menu
    closeMenu();
  };

  // Setup and cleanup animations
  useEffect(() => {
    if (isVisible && menuRef.current) {
      // Create subtle floating animation for glassmorphic effect
      const startTime = performance.now();
      
      // Use optimized animation utility
      animationCleanupRef.current = optimizedAnimation((time) => {
        if (!menuRef.current) return;
        
        const elapsed = time - startTime;
        const yOffset = Math.sin(elapsed / 1000) * 3; // Subtle 3px floating effect
        
        // Apply subtle movement to decorative elements only
        const decorativeElements = menuRef.current.querySelectorAll('.decorative-element');
        decorativeElements.forEach((element: Element, index) => {
          const htmlElement = element as HTMLElement;
          const offsetMultiplier = index % 2 === 0 ? 1 : -1;
          htmlElement.style.transform = `translate(${Math.sin(elapsed / 1200 + index) * 5 * offsetMultiplier}px, ${yOffset * offsetMultiplier}px)`;
        });
      });
    }
    
    // Cleanup animation when component unmounts or menu closes
    return () => {
      if (animationCleanupRef.current) {
        animationCleanupRef.current();
        animationCleanupRef.current = null;
      }
    };
  }, [isVisible]);

  // Return null when menu is not visible to save memory
  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-[1000] w-56 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
      style={{
        top: position.y,
        left: position.x,
        willChange: 'transform', // Optimize for animations
        transform: 'translateZ(0)', // Force GPU acceleration
      }}
      data-testid="right-click-menu"
    >
      {/* Enhanced glassmorphic container */}
      <div className="glassmorphic-menu relative">
        {/* Decorative elements for glassmorphic effect with improved performance */}
        <div className="decorative-element absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full opacity-60 pointer-events-none"></div>
        <div className="decorative-element absolute -bottom-20 -left-20 w-40 h-40 bg-amber-500/10 rounded-full opacity-60 pointer-events-none"></div>
        <div className="decorative-element absolute top-10 left-10 w-20 h-20 bg-purple-500/5 rounded-full opacity-40 pointer-events-none"></div>
        
        {/* Menu header */}
        <div className="px-3 py-2 border-b border-white/10">
          <p className="text-xs font-medium text-amber-400 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 animate-pulse"></span>
            Yaseen's YKFA Tools
          </p>
        </div>
        
        {/* Menu items with optimized rendering */}
        <div className="p-2 space-y-1">
          {menuOptions.map((option, index) => (
            <button
              key={option.id}
              onClick={() => handleMenuItemClick(option.id as 'whatsapp' | 'chatbot' | 'bmi')}
              className={`glassmorphic-menu-item flex items-center w-full px-3 py-2.5 text-sm text-gray-200 hover:text-white group animate-fade-slide-in`}
              style={{ animationDelay: `${index * 50}ms` }}
              data-testid={`menu-item-${option.id}`}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient`}></div>
              
              {/* Icon and content */}
              <div className="relative z-10 flex items-center w-full">
                <div className="flex-shrink-0">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium group-hover:text-amber-300 transition-colors">{option.label}</div>
                  <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{option.description}</div>
                </div>
              </div>
            </button>
          ))}
          
          <div className="h-px bg-white/10 my-1 mx-1"></div>
          
          <button
            onClick={closeMenu}
            className="glassmorphic-menu-item flex items-center w-full px-3 py-2 text-sm text-gray-400 hover:text-gray-200 group animate-fade-slide-in"
            style={{ animationDelay: `${menuOptions.length * 50}ms` }}
            data-testid="menu-close"
          >
            <X className="w-4 h-4 mr-3 text-red-400/70 group-hover:text-red-400 transition-colors" />
            Close Menu
          </button>
        </div>
        
        {/* Footer */}
        <div className="text-center py-2 bg-gradient-to-r from-black/40 via-black/20 to-black/40 text-xs text-gray-500 border-t border-white/5">
          <p>Right-click anywhere for quick access</p>
        </div>
      </div>
    </div>
  );
});

export default RightClickMenu; 