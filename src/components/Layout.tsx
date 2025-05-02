import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Loader from './Loader';

const Layout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const location = useLocation();

  // Handle initial page load animation
  useEffect(() => {
    if (isInitialLoad) {
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isInitialLoad]);

  // Reset initial load animation when route changes
  useEffect(() => {
    setIsInitialLoad(true);
    
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Handle scroll to show/hide navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-dark-900">
      {isInitialLoad && <Loader />}
      
      <Navbar isScrolled={isScrolled} />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;