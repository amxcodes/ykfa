import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, MouseEvent as ReactMouseEvent, createContext } from 'react';
import { Calculator, Bot, MessageCircle } from 'lucide-react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgramsPage from './pages/ProgramsPage';
import InstructorsPage from './pages/InstructorsPage';
import MembershipPage from './pages/MembershipPage';
import ContactPage from './pages/ContactPage';
import TimerPage from './pages/TimerPage';
import StorePage from './pages/StorePage';
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

// Custom Context Menu Component
interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  activateWidget: (widget: WidgetType) => void;
}

const ContextMenu = ({ x, y, onClose, activateWidget }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Widget options that appear in the context menu
  const widgetOptions = [
    { 
      icon: <MessageCircle size={16} className="text-green-400" />, 
      label: 'WhatsApp Chat', 
      widget: 'whatsapp' as WidgetType,
      description: 'Send us a message'
    },
    { 
      icon: <Bot size={16} className="text-blue-400" />, 
      label: 'AI Assistant', 
      widget: 'chatbot' as WidgetType,
      description: 'Ask our chatbot'
    },
    { 
      icon: <Calculator size={16} className="text-amber-400" />, 
      label: 'BMI Calculator', 
      widget: 'bmi' as WidgetType,
      description: 'Check your BMI'
    },
  ];

  // Handle widget activation and navigation to home if needed
  const handleWidgetActivation = (widget: WidgetType) => {
    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
    }
    
    // Set the active widget
    activateWidget(widget);
    
    // Close the context menu
    onClose();
  };

  // Style adjustments to keep menu in viewport
  const position = {
    left: Math.min(x, window.innerWidth - 240), // Prevent menu from going off right edge
    top: Math.min(y, window.innerHeight - widgetOptions.length * 70 - 40), // Prevent menu from going off bottom
  };

  return (
    <div 
      ref={menuRef}
      className="fixed z-[999] bg-dark-800/95 backdrop-blur-lg border border-amber-400/20 rounded-lg shadow-2xl overflow-hidden w-60 py-2"
      style={position}
    >
      <div className="p-2 border-b border-gray-700/50 mb-2">
        <p className="text-xs text-amber-400 font-medium">Yaseen's YKFA Tools</p>
      </div>
      
      {/* Widgets Section */}
      <div className="px-2 py-1">
        {widgetOptions.map((option, index) => (
          <button 
            key={`widget-${index}`} 
            className="flex items-center w-full gap-3 px-3 py-2.5 text-sm transition-colors text-gray-200 hover:bg-amber-400/20 rounded-md group mb-1.5"
            onClick={() => handleWidgetActivation(option.widget)}
          >
            <div className="h-9 w-9 flex-shrink-0 rounded-full bg-dark-700/80 flex items-center justify-center">
              {option.icon}
            </div>
            <div className="flex-1 text-left">
              <p className="text-white group-hover:text-amber-300 font-medium transition-colors">{option.label}</p>
              <p className="text-xs text-gray-400">{option.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

function App() {
  const location = useLocation();
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [activeWidget, setActiveWidget] = useState<WidgetType>(null);

  useEffect(() => {
    // Initialize animation observer
    const initializeObserver = () => {
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

      // Observe all elements with animate-fade-up class
      document.querySelectorAll('.animate-fade-up').forEach((element) => {
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

      return observer;
    };

    // Small delay to ensure DOM is updated after route change
    const timeoutId = setTimeout(() => {
      const observer = initializeObserver();
      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]); // Re-run when route changes

  // Reset active widget when navigating away from home page
  useEffect(() => {
    if (location.pathname !== '/' && activeWidget !== null) {
      setActiveWidget(null);
    }
  }, [location.pathname]);

  // Handle right-click to show custom context menu
  const handleContextMenu = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  // Close context menu
  const closeContextMenu = () => {
    setShowContextMenu(false);
  };

  return (
    <WidgetContext.Provider value={{ activeWidget, setActiveWidget }}>
      <div onContextMenu={handleContextMenu}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="programs" element={<ProgramsPage />} />
            <Route path="instructors" element={<InstructorsPage />} />
            <Route path="membership" element={<MembershipPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="store" element={<StorePage />} />
            <Route 
              path="timer" 
              element={
                <TimerProvider>
                  <TimerPage />
                </TimerProvider>
              } 
            />
          </Route>
        </Routes>
        
        {/* Custom Context Menu */}
        {showContextMenu && 
          <ContextMenu 
            x={contextMenuPos.x} 
            y={contextMenuPos.y} 
            onClose={closeContextMenu}
            activateWidget={setActiveWidget}
          />
        }
      </div>
    </WidgetContext.Provider>
  );
}

export default App;