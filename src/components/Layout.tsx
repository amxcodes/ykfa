import { useState, useEffect, useRef, ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Loader from './Loader';

// Add children prop to support both Outlet and direct children
interface LayoutProps {
  children?: ReactNode;
}

// Simplified Layout component - removed all network monitoring code
const Layout = ({ children }: LayoutProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const location = useLocation();
  // Use a more generic type to store event handlers
  const eventHandlersRef = useRef<{ [key: string]: any }>({});
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Add event listener for force loading complete
  useEffect(() => {
    // Force loading complete after 2 seconds no matter what
    const fallbackTimer = setTimeout(() => {
      setLoadingComplete(true);
    }, 2000);
    
    // Track timeout for proper cleanup
    timeoutsRef.current.push(fallbackTimer);
    
    return () => {
      // Clear all tracked timeouts
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  // Always scroll to top on route change or refresh
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Handle scroll to show/hide navbar background - optimized with passive event
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    // Store reference to event handler for proper cleanup
    eventHandlersRef.current.scroll = handleScroll;
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', eventHandlersRef.current.scroll);
    };
  }, []);
  
  // Prevent text selection and right-click menu
  useEffect(() => {
    // Prevent text selection attempts
    const handleSelectStart = (e: Event) => {
      // Allow selection in inputs and textareas
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.getAttribute('data-selectable') === 'true') {
        return true;
      }
      e.preventDefault();
      return false;
    };
    
    // Prevent context menu (right-click)
    const handleContextMenu = (e: Event) => {
      // Only prevent default context menu for text elements
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.closest('[data-allow-context-menu="true"]')) {
        e.preventDefault();
      }
    };
    
    // Store references to event handlers
    eventHandlersRef.current.selectstart = handleSelectStart;
    eventHandlersRef.current.contextmenu = handleContextMenu;
    
    // Add event listeners
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      // Clean up event listeners
      document.removeEventListener('selectstart', eventHandlersRef.current.selectstart);
      document.removeEventListener('contextmenu', eventHandlersRef.current.contextmenu);
    };
  }, []);

  return (
    <>
      {/* Re-enabled now that initialization error is fixed */}
      {/* Show loader until critical resources are loaded */}
      {!loadingComplete && <Loader loadingComplete={loadingComplete} />}
      
      {/* Main layout */}
      <div className="flex flex-col min-h-screen bg-dark-950 text-white">
        <Navbar isScrolled={isScrolled} />
        <main className="flex-grow">
          {children || <Outlet />}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;