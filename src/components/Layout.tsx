import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Loader from './Loader';

const Layout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const location = useLocation();

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

  // Track when all images and videos are loaded (only on home page)
  useEffect(() => {
    if (location.pathname !== '/') {
      setLoadingComplete(true);
      return;
    }
    setLoadingComplete(false);
    const resources = Array.from(document.querySelectorAll('img, video'));
    if (resources.length === 0) {
      setLoadingComplete(true);
      return;
    }
    let loadedCount = 0;
    let finished = false;
    const checkLoaded = () => {
      loadedCount++;
      if (!finished && loadedCount === resources.length) {
        finished = true;
        setLoadingComplete(true);
      }
    };
    // Timeout fallback (4 seconds)
    const timeoutId = setTimeout(() => {
      if (!finished) {
        finished = true;
        setLoadingComplete(true);
      }
    }, 4000);
    resources.forEach((el) => {
      if ((el as HTMLImageElement).complete || (el as HTMLVideoElement).readyState === 4) {
        checkLoaded();
      } else {
        el.addEventListener('load', checkLoaded, { once: true });
        el.addEventListener('error', checkLoaded, { once: true });
      }
    });
    return () => {
      clearTimeout(timeoutId);
      resources.forEach((el) => {
        el.removeEventListener('load', checkLoaded);
        el.removeEventListener('error', checkLoaded);
      });
    };
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-dark-900">
      {/* Loader now waits for all images and videos to load */}
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