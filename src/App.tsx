import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, createContext } from 'react';
import { Calculator, Bot, MessageCircle } from 'lucide-react';
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

function App() {
  const location = useLocation();
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
  }, [location.pathname, activeWidget]);

  return (
    <NetworkErrorBoundary>
      <TimerProvider>
        <WidgetContext.Provider value={{ activeWidget, setActiveWidget }}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route element={<Layout />}> {/* Layout Route Wrapper */}
                <Route index element={<HomePage />} /> {/* Changed path="/" to index */}
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
              </Route> {/* Closes Layout Route Wrapper */}
              
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
          </AnimatePresence>
        </WidgetContext.Provider>
      </TimerProvider>
    </NetworkErrorBoundary>
  );
}

export default App;