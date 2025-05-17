import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, createContext } from 'react';
import { Calculator, Bot, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
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
import { useOptimizedObserver, useAnimationFrames } from './hooks/useMemoryOptimized';

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
  const pageLoadedRef = useRef(false);
  
  // Use optimized animation frame handling
  const { requestFrame, cancelAllFrames } = useAnimationFrames();

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
      // Clean up any pending operations when component unmounts
      cancelAllFrames();
      
      // Clear the timeout to prevent memory leaks
      if (loadTimeoutId) {
        clearTimeout(loadTimeoutId);
      }
      pageLoadedRef.current = false;
    };
  }, [cancelAllFrames]);

  // Use optimized observer
  const observerRef = useOptimizedObserver(() => {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    );
  }, [location.pathname]);

  // Setup animation observers after route change
  useEffect(() => {
    // Small delay to ensure DOM is updated after route change
    const timeoutId = setTimeout(() => {
      // Initialize observer elements
      if (observerRef.current) {
        try {
          // Limit the number of elements to observe to prevent performance issues
          const elements = document.querySelectorAll('.animate-fade-up');
          const maxElements = 20; // Arbitrary limit to avoid performance issues
          
          // Observe elements with a limit
          Array.from(elements).slice(0, maxElements).forEach((element) => {
            // Remove any existing active class to reset animation
            element.classList.remove('active');
            observerRef.current?.observe(element);
            
            // Add active class immediately if element is already in viewport
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
              element.classList.add('active');
              observerRef.current?.unobserve(element);
            }
          });
        } catch (error) {
          console.error('Error initializing IntersectionObserver:', error);
        }
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [location.pathname, observerRef]);

  // Reset active widget when navigating away from home page
  useEffect(() => {
    if (location.pathname !== '/' && activeWidget !== null) {
      setActiveWidget(null);
    }
  }, [location.pathname, activeWidget]);

  // Add a memory management routine
  useEffect(() => {
    // Run garbage collection helper when tab becomes invisible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Clean up any cached resources
        console.log('Tab hidden - cleaning up resources');
        
        // Force image cache cleanup
        const imgs = document.querySelectorAll('img');
        imgs.forEach(img => {
          if (!img.closest('.current-image') && !img.classList.contains('critical')) {
            // Non-critical images can have their src cleared when hidden
            if (img.src) (img as HTMLImageElement).dataset.cachedSrc = img.src;
            (img as HTMLImageElement).src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Tiny transparent image
          }
        });
      } else if (document.visibilityState === 'visible') {
        // Restore images when tab becomes visible again
        console.log('Tab visible - restoring resources');
        const imgs = document.querySelectorAll('img[data-cached-src]');
        imgs.forEach(img => {
          if ((img as HTMLImageElement).dataset.cachedSrc) {
            const cachedSrc = (img as HTMLImageElement).dataset.cachedSrc;
            if (typeof cachedSrc === 'string') {
              (img as HTMLImageElement).src = cachedSrc;
            }
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Add image optimization on load
  useEffect(() => {
    // Function to optimize image memory usage
    const optimizeImages = () => {
      // Don't optimize in production - too much visual quality loss
      if (process.env.NODE_ENV === 'production') return;
      
      // Find all large images
      const imagesToOptimize = document.querySelectorAll('img:not(.critical):not(.optimized)');
      
      imagesToOptimize.forEach((img) => {
        const imgElement = img as HTMLImageElement;
        
        // Skip small images and critical ones
        if (!imgElement.src || imgElement.src.includes('data:image') || 
            imgElement.width < 100 || imgElement.height < 100 ||
            imgElement.classList.contains('critical')) {
          return;
        }
        
        // When image loads, process it if it's large
        const originalSrc = imgElement.src;
        
        // Don't process already processed images
        if (originalSrc.includes('blob:') || originalSrc.startsWith('data:image/')) return;
        
        // --- START MODIFICATION: Prevent visual alteration ---
        // Skip actual optimization to prevent visual changes
        // We can re-enable specific, non-altering optimizations later if needed.
        imgElement.classList.add('optimized'); // Mark as processed
        return; 
        // --- END MODIFICATION ---

        /* Original optimization logic commented out for now:
        try {
          // Create temporary canvas for downscaling
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          
          // Create a temporary image to load the original
          const tempImg = new Image();
          
          tempImg.onload = () => {
            // Set maximum dimensions - drastically reduces memory usage
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 600;
            
            // Calculate new dimensions while maintaining aspect ratio
            let width = tempImg.width;
            let height = tempImg.height;
            
            if (width > MAX_WIDTH) {
              height = Math.round(height * (MAX_WIDTH / width));
              width = MAX_WIDTH;
            }
            
            if (height > MAX_HEIGHT) {
              width = Math.round(width * (MAX_HEIGHT / height));
              height = MAX_HEIGHT;
            }
            
            // Skip if already small enough
            if (tempImg.width <= MAX_WIDTH && tempImg.height <= MAX_HEIGHT) {
              tempImg.onload = null;
              return;
            }
            
            // Downscale the image
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(tempImg, 0, 0, width, height);
            
            // Convert to lower quality JPEG for massive memory savings
            try {
              const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
              
              // Only update if optimization worked
              if (dataUrl && dataUrl !== 'data:,') {
                // Store original for restoration if needed
                imgElement.dataset.originalSrc = originalSrc;
                imgElement.src = dataUrl;
              }
            } catch (e) {
              console.log('Image optimization failed:', e);
            }
            
            // Clean up
            tempImg.onload = null;
            canvas.width = 0;
            canvas.height = 0;
          };
          
          // Handle load errors
          tempImg.onerror = () => {
            tempImg.onload = null;
            tempImg.onerror = null;
          };
          
          // Load the image
          tempImg.crossOrigin = 'anonymous';
          tempImg.src = originalSrc;
        } catch (e) {
          console.log('Error optimizing image:', e);
        }
        */
      });
    };
    
    // Run optimization after a short delay to allow critical content to load
    const optimizeTimeout = setTimeout(optimizeImages, 2000);
    
    // Also optimize after visibility change
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        setTimeout(optimizeImages, 500);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibility);
    
    return () => {
      clearTimeout(optimizeTimeout);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

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