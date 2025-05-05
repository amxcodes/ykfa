import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Loader from './Loader';

const Layout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const location = useLocation();

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
    
    // Timeout fallback (reduced from 2s to 1s)
    const timeoutId = setTimeout(() => {
      if (!finished) {
        finished = true;
        setLoadingComplete(true);
      }
    }, 1000); // 1 second timeout
    
    // Track load events for each critical resource
    criticalResources.forEach((el) => {
      if ((el as HTMLImageElement).complete || (el as HTMLVideoElement).readyState >= 3) {
        checkLoaded();
      } else {
        el.addEventListener('load', checkLoaded, { once: true });
        el.addEventListener('error', checkLoaded, { once: true });
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