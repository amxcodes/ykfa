import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState, createContext } from 'react';
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
  // Always use performance mode
  const performanceMode = true;
  
  // Apply performance mode class to body
  useEffect(() => {
    document.body.classList.add('reduced-effects');
  }, []);

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