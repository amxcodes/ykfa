import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Loader from './Loader';
import { monitorNetworkStatus, createHealthCheck, testCriticalResources } from '../utils/networkUtils';

const Layout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [networkError, setNetworkError] = useState<Error | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Always scroll to top on route change or refresh
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Handle scroll to show/hide navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Monitor network connection
  useEffect(() => {
    const cleanup = monitorNetworkStatus(
      // When offline
      () => {
        console.warn('Network connection lost');
        setNetworkError(new Error('Network connection lost. Please check your internet connection.'));
        // Only navigate to error page if not already on an error page
        if (!location.pathname.startsWith('/error')) {
          navigate('/error/network', { replace: true });
        }
      },
      // When online
      () => {
        console.log('Network connection restored');
        setNetworkError(null);
        // Test if critical resources are available
        testCriticalResources().then(result => {
          if (!result.success) {
            console.error('Failed to load critical resources', result.error);
          } else if (location.pathname === '/error/network') {
            // If we're on the network error page and connection is restored, go back
            navigate(-1);
          }
        });
      }
    );

    // Set up periodic health check when on main pages (not error pages)
    let healthCheckCleanup: (() => void) | undefined;
    
    if (!location.pathname.startsWith('/error')) {
      healthCheckCleanup = createHealthCheck(
        '/', 
        30000, // Check every 30 seconds
        (error) => {
          console.error('Health check failed:', error);
          // Only navigate to error page if not already on an error page
          if (!location.pathname.startsWith('/error')) {
            navigate('/error/server', { replace: true });
          }
        },
        () => {
          // Health check succeeded, everything is fine
        }
      );
    }

    return () => {
      cleanup();
      if (healthCheckCleanup) healthCheckCleanup();
    };
  }, [location.pathname, navigate]);

  // Track when critical resources are loaded (only on home page)
  useEffect(() => {
    if (location.pathname !== '/') {
      setLoadingComplete(true);
      return;
    }
    setLoadingComplete(false);
    
    // Function to get only critical above-the-fold resources
    const getCriticalResources = () => {
      const resources = Array.from(document.querySelectorAll('img[loading="eager"], video, .hero-section img, .hero-section video'));
      return resources.filter((el) => {
        const rect = el.getBoundingClientRect();
        return (
          rect.top < window.innerHeight && 
          rect.bottom >= 0 &&
          rect.left < window.innerWidth && 
          rect.right >= 0
        );
      });
    };
    
    // Get critical resources
    const criticalResources = getCriticalResources();
    
    // If no critical resources or already loaded, complete immediately
    if (criticalResources.length === 0) {
      setLoadingComplete(true);
      return;
    }
    
    let loadedCount = 0;
    let finished = false;
    
    const checkLoaded = () => {
      loadedCount++;
      if (!finished && loadedCount >= criticalResources.length) {
        finished = true;
        setLoadingComplete(true);
      }
    };
    
    // Timeout fallback (set to 3s to allow more time for resources to load)
    const timeoutId = setTimeout(() => {
      if (!finished) {
        console.warn('Loading timeout reached, some resources may still be loading');
        finished = true;
        setLoadingComplete(true);
      }
    }, 3000);
    
    // Track load events for each critical resource
    criticalResources.forEach((el) => {
      if ((el as HTMLImageElement).complete || (el as HTMLVideoElement).readyState >= 3) {
        checkLoaded();
      } else {
        el.addEventListener('load', checkLoaded, { once: true });
        el.addEventListener('error', (e) => {
          console.error('Failed to load resource:', (e.target as HTMLElement).outerHTML);
          checkLoaded();
        }, { once: true });
      }
    });
    
    return () => {
      clearTimeout(timeoutId);
      criticalResources.forEach((el) => {
        el.removeEventListener('load', checkLoaded);
        el.removeEventListener('error', checkLoaded);
      });
    };
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-dark-900">
      <Loader loadingComplete={loadingComplete} />
      <Navbar isScrolled={isScrolled} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;