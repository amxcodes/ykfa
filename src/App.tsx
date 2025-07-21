import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, createContext } from 'react';
import { Calculator, Bot, MessageCircle } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion'; // DISABLED to prevent memory leaks
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/AboutPage';
import AboutUsPage from './pages/AboutUsPage';
import ProgramsPage from './pages/ProgramsPage';
import MembershipPage from './pages/MembershipPage';
import ContactPage from './pages/ContactPage';
import TimerPage from './pages/TimerPage';
import StorePage from './pages/StorePage';
import SchedulePage from './pages/SchedulePage';
import ErrorPage from './pages/ErrorPage';
import NetworkErrorBoundary from './components/NetworkErrorBoundary';
import { TimerProvider } from './context/TimerContext';
import { useOptimizedObserver } from './hooks/useMemoryOptimized';

// Define widget types
export type WidgetType = 'whatsapp' | 'chatbot' | 'bmi' | null;

// Create a context to manage active widget state globally
export const WidgetContext = createContext<{
  activeWidget: WidgetType;
  setActiveWidget: (widget: WidgetType) => void;
  performanceMode: boolean;
}>({
  activeWidget: null,
  setActiveWidget: () => {},
  performanceMode: true,
});

function App() {
  const location = useLocation();
  const [activeWidget, setActiveWidget] = useState<WidgetType>(null);
  const pageLoadedRef = useRef(false);
  // Always use performance mode
  const performanceMode = true;
  
  // Apply performance mode class to body
  useEffect(() => {
    // Always add the reduced-effects class
    document.body.classList.add('reduced-effects');
  }, []);

  // Signal page load completion
  useEffect(() => {
    let loadTimeoutId: number | undefined;
    
    if (!pageLoadedRef.current) {
      pageLoadedRef.current = true;
      
      // Force browser to complete loading state 
      loadTimeoutId = window.setTimeout(() => {
        // Signal to browser that the page has loaded
        if (document && window) {
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
      if (loadTimeoutId) {
        clearTimeout(loadTimeoutId);
      }
    };
  }, []);

  // Optimized intersection observer with reduced memory usage
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1, // Reduced threshold for better performance
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    // Observe only essential elements to reduce memory usage
    const elementsToObserve = document.querySelectorAll(
      '.animate-fade-up, .card-container, .pricing-card'
    );

    // Limit the number of observed elements to prevent memory leaks
    const maxElements = 20;
    const limitedElements = Array.from(elementsToObserve).slice(0, maxElements);

    limitedElements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);

  // Reset active widget when navigating away from home page
  useEffect(() => {
    if (location.pathname !== '/' && activeWidget !== null) {
      setActiveWidget(null);
    }
  }, [location.pathname, activeWidget]);

  return (
    <WidgetContext.Provider value={{ activeWidget, setActiveWidget, performanceMode }}>
      <div className="App min-h-screen bg-black">
        <NetworkErrorBoundary>
          <TimerProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/about-us" element={<AboutUsPage />} />
                <Route path="/programs" element={<ProgramsPage />} />
                <Route path="/membership" element={<MembershipPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/timer" element={<TimerPage />} />
                <Route path="/store" element={<StorePage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </Layout>
          </TimerProvider>
        </NetworkErrorBoundary>
      </div>
    </WidgetContext.Provider>
  );
}

export default App;