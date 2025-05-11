import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, MouseEvent as ReactMouseEvent, createContext } from 'react';
import { Calculator, Bot, MessageCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AboutUsPage from './pages/AboutUsPage';
import ProgramsPage from './pages/ProgramsPage';
import InstructorsPage from './pages/InstructorsPage';
import MembershipPage from './pages/MembershipPage';
import ContactPage from './pages/ContactPage';
import TimerPage from './pages/TimerPage';
import StorePage from './pages/StorePage';
import SchedulePage from './pages/SchedulePage';
import ErrorPage from './pages/ErrorPage';
import NetworkErrorBoundary from './components/NetworkErrorBoundary';
import { TimerProvider } from './context/TimerContext';
import CustomCursor from './components/CustomCursor';

// Define widget types
export type WidgetType = 'whatsapp' | 'chatbot' | 'bmi' | null;

// Create a context to manage active widget state globally
export const WidgetContext = createContext<{
  activeWidget: WidgetType;
  setActiveWidget: (widget: WidgetType) => void;
}>({
  activeWidget: null,
  setActiveWidget: () => {},
});

// Custom Context Menu Component
interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  activateWidget: (widget: WidgetType) => void;
}

const ContextMenu = ({ x, y, onClose, activateWidget }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Widget options that appear in the context menu
  const widgetOptions = [
    { 
      icon: <MessageCircle size={16} className="text-green-400" />, 
      label: 'WhatsApp Chat', 
      widget: 'whatsapp' as WidgetType,
      description: 'Send us a message',
      color: 'from-green-500/20 to-green-500/5'
    },
    { 
      icon: <Bot size={16} className="text-blue-400" />, 
      label: 'AI Assistant', 
      widget: 'chatbot' as WidgetType,
      description: 'Ask our chatbot',
      color: 'from-blue-500/20 to-blue-500/5'
    },
    { 
      icon: <Calculator size={16} className="text-amber-400" />, 
      label: 'BMI Calculator', 
      widget: 'bmi' as WidgetType,
      description: 'Check your BMI',
      color: 'from-amber-500/20 to-amber-500/5'
    },
  ];

  // Handle widget activation and navigation to home if needed
  const handleWidgetActivation = (widget: WidgetType) => {
    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
    }
    
    // Set the active widget
    activateWidget(widget);
    
    // Close the context menu
    onClose();
  };

  // Style adjustments to keep menu in viewport
  const position = {
    left: Math.min(x, window.innerWidth - 280), // Prevent menu from going off right edge
    top: Math.min(y, window.innerHeight - widgetOptions.length * 80 - 60), // Prevent menu from going off bottom
  };

  return (
    <AnimatePresence>
      <motion.div 
        ref={menuRef}
        className="fixed z-[999] overflow-hidden rounded-2xl"
        style={position}
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Glassmorphic container */}
        <div className="backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl overflow-hidden w-64 relative">
          {/* Decorative gradient elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl opacity-60 pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl opacity-60 pointer-events-none"></div>
          
          {/* Header */}
          <div className="p-4 border-b border-white/10 relative z-10">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-amber-400 flex items-center">
                <span className="w-2 h-2 rounded-full bg-amber-400 mr-2 animate-pulse"></span>
                Yaseen's YKFA Tools
              </p>
              
              <button 
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Widgets Section */}
          <div className="p-3">
            {widgetOptions.map((option, index) => (
              <motion.button 
                key={`widget-${index}`} 
                className="flex items-center w-full gap-3 p-3 text-sm transition-all text-gray-200 hover:bg-white/10 rounded-xl group mb-2 border border-transparent hover:border-white/10 relative overflow-hidden"
                onClick={() => handleWidgetActivation(option.widget)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.08 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Background gradient based on icon color */}
                <div className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10 relative z-10 group-hover:shadow-md transition-all">
                  {option.icon}
                </div>
                <div className="flex-1 text-left relative z-10">
                  <p className="text-white group-hover:text-amber-300 font-medium transition-colors">{option.label}</p>
                  <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{option.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-amber-400 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
              </motion.button>
            ))}
          </div>
          
          {/* Footer */}
          <div className="text-center py-2 bg-gradient-to-r from-black/40 via-black/20 to-black/40 text-xs text-gray-500 border-t border-white/5">
            <p>Right-click anywhere for quick access</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  const location = useLocation();
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [activeWidget, setActiveWidget] = useState<WidgetType>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pageLoadedRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  // Signal page load completion
  useEffect(() => {
    let loadTimeoutId: number | undefined;
    
    if (!pageLoadedRef.current) {
      pageLoadedRef.current = true;
      
      // Cancel any pending animation frames
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      
      // Force browser to complete loading state 
      loadTimeoutId = window.setTimeout(() => {
        // Signal to browser that the page has finished loading
        if (document && window) {
          // Cannot assign to readyState since it's read-only
          // Just dispatch the events to indicate page is loaded
          window.dispatchEvent(new Event('load'));
          window.dispatchEvent(new Event('pageshow'));
          
          // Set page loaded state in history
          window.history.replaceState(
            { ...(window.history.state || {}), pageLoaded: true },
            document.title
          );
          
          // Set a flag on window to indicate page is fully loaded
          (window as any).__YKFA_LOADED__ = true;
        }
      }, 100);
    }
    
    return () => {
      // Clean up any pending operations when component unmounts
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      // Clear the timeout to prevent memory leaks
      if (loadTimeoutId) {
        clearTimeout(loadTimeoutId);
      }
      pageLoadedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Initialize animation observer
    const initializeObserver = () => {
      // Clean up any existing observer first
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.1
        }
      );

      observerRef.current = observer;
      
      try {
        // Limit the number of elements to observe to prevent performance issues
        const elements = document.querySelectorAll('.animate-fade-up');
        const maxElements = 20; // Arbitrary limit to avoid performance issues
        
        // Observe elements with a limit
        Array.from(elements).slice(0, maxElements).forEach((element) => {
          // Remove any existing active class to reset animation
          element.classList.remove('active');
          observer.observe(element);
          
          // Add active class immediately if element is already in viewport
          const rect = element.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom >= 0) {
            element.classList.add('active');
            observer.unobserve(element);
          }
        });
      } catch (error) {
        console.error('Error initializing IntersectionObserver:', error);
      }

      return observer;
    };

    // Small delay to ensure DOM is updated after route change
    const timeoutId = setTimeout(() => {
      // Use a safe requestAnimationFrame pattern
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      
      animFrameRef.current = requestAnimationFrame(() => {
        initializeObserver();
        animFrameRef.current = null;
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      // Clean up observer on unmount
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      // Cancel any pending animation frames
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [location.pathname]); // Re-run when route changes

  // Reset active widget when navigating away from home page
  useEffect(() => {
    if (location.pathname !== '/' && activeWidget !== null) {
      setActiveWidget(null);
    }
    
    // Close context menu when route changes
    if (showContextMenu) {
      setShowContextMenu(false);
    }
  }, [location.pathname, activeWidget, showContextMenu]);

  // Handle right-click to show custom context menu
  const handleContextMenu = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  // Close context menu
  const closeContextMenu = () => {
    setShowContextMenu(false);
  };

  return (
    <WidgetContext.Provider value={{ activeWidget, setActiveWidget }}>
      <div onContextMenu={handleContextMenu}>
        <CustomCursor />
        <NetworkErrorBoundary>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="about-us" element={<AboutUsPage />} />
              <Route path="blog" element={<AboutPage />} />
              <Route path="programs" element={<ProgramsPage />} />
              <Route path="instructors" element={<InstructorsPage />} />
              <Route path="membership" element={<MembershipPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="store" element={<StorePage />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route 
                path="timer" 
                element={
                  <TimerProvider>
                    <TimerPage />
                  </TimerProvider>
                } 
              />
            </Route>
            
            {/* Error Routes */}
            <Route path="error">
              <Route path="network" element={<ErrorPage errorType="network" />} />
              <Route path="not-found" element={<ErrorPage errorType="notFound" />} />
              <Route path="server" element={<ErrorPage errorType="server" />} />
              <Route path="unknown" element={<ErrorPage />} />
            </Route>
            
            {/* Catch 404 errors */}
            <Route path="*" element={<ErrorPage errorType="notFound" code={404} />} />
          </Routes>
        </NetworkErrorBoundary>
        
        {/* Custom Context Menu */}
        {showContextMenu && 
          <ContextMenu 
            x={contextMenuPos.x} 
            y={contextMenuPos.y} 
            onClose={closeContextMenu}
            activateWidget={setActiveWidget}
          />
        }
      </div>
    </WidgetContext.Provider>
  );
}

export default App;