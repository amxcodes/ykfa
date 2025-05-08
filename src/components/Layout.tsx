import { useState, useEffect, useCallback, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Loader from './Loader';
import { monitorNetworkStatus, createHealthCheck, testCriticalResources } from '../utils/networkUtils';

// Timeout values in milliseconds
const TIMEOUTS = {
  LOADING: 2000, // Reduced from 3 seconds to 2 seconds for maximum loading time
  HEALTH_CHECK: 45000, // 45 seconds between health checks
};

// Critical resource selector for different page types
const CRITICAL_SELECTORS = {
  HOME: 'img[loading="eager"], video, .hero-section img, .hero-section video',
  OTHER: 'img[loading="eager"], .header-section img, .primary-content img'
};

const Layout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [networkError, setNetworkError] = useState<Error | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're on the home page - memoize for performance
  const isHomePage = useMemo(() => location.pathname === '/', [location.pathname]);

  // Add event listener for force loading complete
  useEffect(() => {
    const handleForceComplete = () => {
      console.log('Force completing loading from event');
      setLoadingComplete(true);
    };

    // Listen for the force complete event
    window.addEventListener('forceCompleteLoading', handleForceComplete);
    
    // Fallback timeout - force loading complete after 4 seconds no matter what
    const fallbackTimer = setTimeout(() => {
      console.log('Fallback timer: forcing loading complete');
      setLoadingComplete(true);
    }, 4000);
    
    return () => {
      window.removeEventListener('forceCompleteLoading', handleForceComplete);
      clearTimeout(fallbackTimer);
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
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle network connectivity changes
  const handleOffline = useCallback(() => {
    console.warn('Network connection lost');
    setNetworkError(new Error('Network connection lost. Please check your internet connection.'));
    
    // Only navigate to error page if not already on an error page
    if (!location.pathname.startsWith('/error')) {
      navigate('/error/network', { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleOnline = useCallback(() => {
    console.log('Network connection restored');
    setNetworkError(null);
    
    // Test if critical resources are available
    testCriticalResources().then(result => {
      if (!result.success) {
        console.error('Failed to load critical resources', result.error);
      } else if (location.pathname === '/error/network') {
        // If on network error page and connection is restored, go back
        navigate(-1);
      }
    });
  }, [location.pathname, navigate]);

  // Monitor network connection
  useEffect(() => {
    const cleanup = monitorNetworkStatus(handleOffline, handleOnline);
    
    // Set up periodic health check only on main pages (not error pages)
    let healthCheckCleanup: (() => void) | undefined;
    
    if (!location.pathname.startsWith('/error')) {
      healthCheckCleanup = createHealthCheck(
        '/', 
        TIMEOUTS.HEALTH_CHECK,
        (error) => {
          console.error('Health check failed:', error);
          // Only navigate to error page if not already on an error page
          if (!location.pathname.startsWith('/error') && window.navigator.onLine) {
            navigate('/error/server', { replace: true });
    }
        },
        () => {
          // Health check succeeded - if we previously had a server error, we can consider it resolved
          if (networkError && location.pathname === '/error/server') {
            navigate(-1);
          }
        }
      );
    }

    return () => {
      cleanup();
      if (healthCheckCleanup) healthCheckCleanup();
    };
  }, [location.pathname, navigate, networkError, handleOffline, handleOnline]);
    
  // Function to get critical above-the-fold resources based on page type
  const getCriticalResources = useCallback(() => {
    const selector = isHomePage ? CRITICAL_SELECTORS.HOME : CRITICAL_SELECTORS.OTHER;
    const resources = Array.from(document.querySelectorAll(selector));
    
    // Only resources in the viewport
      return resources.filter((el) => {
        const rect = el.getBoundingClientRect();
        return (
          rect.top < window.innerHeight && 
          rect.bottom >= 0 &&
          rect.left < window.innerWidth && 
          rect.right >= 0
        );
      });
  }, [isHomePage]);

  // Track when critical resources are loaded (prioritize home page)
  useEffect(() => {
    // Skip loading tracking for error pages and non-homepage
    if (!isHomePage) {
      setLoadingComplete(true);
      return;
    }
    
    // Reset loading state on navigation
    setLoadingComplete(false);
    
    // Get critical resources
    const criticalResources = getCriticalResources();
    
    // If no critical resources or already loaded, complete immediately
    if (criticalResources.length === 0) {
      setLoadingComplete(true);
      return;
    }
    
    let loadedCount = 0;
    let errorCount = 0;
    let finished = false;
    
    // Function to check if loading is complete
    const checkLoaded = () => {
      loadedCount++;
      
      if (!finished && (loadedCount + errorCount) >= criticalResources.length) {
        finished = true;
        setLoadingComplete(true);
      }
    };
    
    // Function to handle load errors
    const handleError = (e: Event) => {
      const target = e.target as HTMLElement;
      console.error('Failed to load resource:', target.outerHTML || target);
      errorCount++;
      checkLoaded();
    };
    
    // Timeout fallback (now 2s maximum wait time - reduced from 3s)
    const timeoutId = setTimeout(() => {
      if (!finished) {
        console.warn(`Loading timeout reached after ${TIMEOUTS.LOADING}ms, ${loadedCount} of ${criticalResources.length} resources loaded`);
        finished = true;
        setLoadingComplete(true);
      }
    }, TIMEOUTS.LOADING);
    
    // Track load events for each critical resource
    criticalResources.forEach((el) => {
      // Check if already loaded
      if ((el as HTMLImageElement).complete || (el as HTMLVideoElement).readyState >= 3) {
        checkLoaded();
      } else {
        el.addEventListener('load', checkLoaded, { once: true });
        el.addEventListener('error', handleError, { once: true });
      }
    });
    
    return () => {
      clearTimeout(timeoutId);
      criticalResources.forEach((el) => {
        el.removeEventListener('load', checkLoaded);
        el.removeEventListener('error', handleError);
      });
    };
  }, [location.pathname, isHomePage, getCriticalResources]);

  return (
    <div className="flex flex-col min-h-screen bg-dark-900">
      {/* Only show loader on home page */}
      {isHomePage && <Loader loadingComplete={loadingComplete} />}
      <Navbar isScrolled={isScrolled} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;