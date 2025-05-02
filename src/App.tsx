import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef, MouseEvent as ReactMouseEvent } from 'react';
import { Home, Calendar, Phone, Info, User, LogIn, ShoppingBag, FileText, Award } from 'lucide-react';
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

// Custom Context Menu Component
interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

const ContextMenu = ({ x, y, onClose }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
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

  const menuOptions = [
    { icon: <Home size={16} />, label: 'Home', link: '/' },
    { icon: <Calendar size={16} />, label: 'Book a Class', link: '/booking' },
    { icon: <User size={16} />, label: 'Membership', link: '/membership' },
    { icon: <Phone size={16} />, label: 'Contact Us', link: '/contact' },
    { icon: <Info size={16} />, label: 'About YKFA', link: '/about' },
    { icon: <ShoppingBag size={16} />, label: 'Store', link: '/store' },
    { icon: <FileText size={16} />, label: 'Programs', link: '/programs' },
    { icon: <Award size={16} />, label: 'Instructors', link: '/instructors' },
    { icon: <LogIn size={16} />, label: 'Login', link: '/login' },
  ];

  // Style adjustments to keep menu in viewport
  const position = {
    left: Math.min(x, window.innerWidth - 200), // Prevent menu from going off right edge
    top: Math.min(y, window.innerHeight - menuOptions.length * 36 - 16), // Prevent menu from going off bottom
  };

  // Highlight current page in context menu
  const getCurrentPath = () => {
    return location.pathname;
  };

  return (
    <div 
      ref={menuRef}
      className="fixed z-[999] bg-dark-800/95 backdrop-blur-lg border border-amber-400/20 rounded-lg shadow-2xl overflow-hidden w-48 py-1"
      style={position}
    >
      <div className="p-2 border-b border-gray-700/50 mb-1">
        <p className="text-xs text-amber-400 font-medium">Yaseen's YKFA</p>
      </div>
      <div>
        {menuOptions.map((option, index) => (
          <a 
            key={index} 
            href={option.link}
            className={`flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
              getCurrentPath() === option.link 
                ? 'bg-amber-400/30 text-white' 
                : 'text-gray-200 hover:bg-amber-400/20'
            }`}
            onClick={onClose}
          >
            <span className="text-amber-400">{option.icon}</span>
            {option.label}
          </a>
        ))}
      </div>
    </div>
  );
};

function App() {
  const location = useLocation();
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });

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
        />
      }
    </div>
  );
}

export default App;