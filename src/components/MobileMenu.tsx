import { Link } from 'react-router-dom';
import { useEffect, useRef, useState, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { Home, Dumbbell, CreditCard, Phone, ShoppingCart, Calendar, BookOpen } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion'; // Replaced with CSS animations

// Google Play Store SVG icon component
const PlayStoreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.609 1.814L13.792 12 3.609 22.186c-.181.181-.29.435-.29.71 0 .528.435.964.963.964.253 0 .477-.1.652-.261L15.147 12.964c.159-.158.256-.377.256-.619 0-.241-.097-.46-.256-.618L4.934 1.104A.957.957 0 004.282.844a.969.969 0 00-.963.962c0 .302.142.56.326.72l-.036-.712zm4.349.793l9.383 9.383L7.958 22.373c-.283.284-.284.722-.059 1.015.224.292.626.36.945.128l14.043-8.107c.246-.142.443-.38.443-.664 0-.282-.197-.522-.443-.664L8.86.583c-.315-.234-.714-.171-.947.121-.23.292-.228.727.045 1.014v.889z"></path>
  </svg>
);

// Apple App Store SVG icon component
const AppleStoreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42Zm2.52 7.44a4.51 4.51 0 0 1 2.16-3.81 4.66 4.66 0 0 0-3.66-2c-1.56-.16-3 .91-3.83.91s-2-.89-3.3-.87a4.92 4.92 0 0 0-4.14 2.53C2.93 12.45 4.24 17 6 19.47c.8 1.21 1.8 2.58 3.12 2.53s1.75-.82 3.28-.82 2 .82 3.3.79 2.22-1.23 3.06-2.45a11 11 0 0 0 1.38-2.85 4.41 4.41 0 0 1-2.68-4.04Z"></path>
  </svg>
);

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath?: string;
  children?: ReactNode;
}

const MobileMenu = ({ isOpen, onClose, currentPath = '/', children }: MobileMenuProps) => {
  // Use ref for screen size to avoid unnecessary re-renders
  const menuRef = useRef<HTMLDivElement>(null);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Track screen size changes with debounce for better performance
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Lock scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Add touch-action none for mobile to prevent background scrolling
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Close menu if clicked outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Use a ref to track mobile state instead of state to reduce re-renders
  const isMobileRef = useRef(window.innerWidth <= 768);

  // Check if device is mobile - optimized to use ref instead of state
  useEffect(() => {
    const checkMobile = () => {
      isMobileRef.current = window.innerWidth <= 768;
    };

    checkMobile();
    // Use passive listener for better performance
    window.addEventListener('resize', checkMobile, { passive: true });

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Calculate responsive dimensions
  const getContainerStyles = () => {
    const width = screenSize.width;

    // Base styles - reduced width
    let containerWidth = Math.min(280, screenSize.width * 0.75) + 'px';
    let borderRadius = '14px';

    // Small phones
    if (width < 350) {
      containerWidth = Math.min(250, screenSize.width * 0.82) + 'px';
      borderRadius = '12px';
    }

    return {
      width: containerWidth,
      borderRadius
    };
  };

  const styles = getContainerStyles();

  // Define navigation items
  const navigationItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/programs', icon: Dumbbell, label: 'Gallery' },
    { to: '/schedule', icon: Calendar, label: 'Schedule' },
    { to: '/store', icon: ShoppingCart, label: 'Store' },
    { to: '/blog', icon: BookOpen, label: 'Blog' },
    { to: '/membership', icon: CreditCard, label: 'Membership' },
    { to: '/contact', icon: Phone, label: 'Contact' }
  ];

  // Simplified animation variants for better performance
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.15 } }
  };

  const menuVariants = {
    hidden: { opacity: 0, transform: 'scale(0.95) translateY(10px)' },
    visible: {
      opacity: 1,
      transform: 'scale(1) translateY(0px)',
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.25
      }
    },
    exit: {
      opacity: 0,
      transform: 'scale(0.95) translateY(10px)',
      transition: {
        duration: 0.15
      }
    }
  };

  // Use portal to render outside the component hierarchy
  return ReactDOM.createPortal(
    <>
      {isOpen && (
        <div
          key="mobile-menu-container"
          className="fixed inset-0 flex items-center justify-center z-[999]"
          style={{
            willChange: 'opacity',
            overscrollBehavior: 'none',
            touchAction: 'none'
          }}
        >
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/90 animate-fade-in"
            onClick={onClose}
            style={{ willChange: 'opacity' }}
          />

          {/* Menu container */}
          <div
            ref={menuRef}
            className="relative z-10 animate-mobile-menu-in"
            style={{
              width: styles.width,
              willChange: 'transform, opacity',
              transform: 'translateZ(0)',
            }}
          >
            <div
              className="glassmorphic"
              style={{ borderRadius: styles.borderRadius, transform: 'translateZ(0)' }}
            >
              {/* Simplified decorative elements - no blur */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full opacity-40 pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full opacity-40 pointer-events-none"></div>

              {/* Header with logo */}
              <div className="p-3 border-b border-white/10">
                <div className="flex items-center justify-center gap-2">
                  {/* Logo container */}
                  <div className="relative w-8 h-8 flex items-center justify-center rounded-lg overflow-hidden bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg">
                    <span className="absolute inset-0 bg-gradient-to-br from-amber-300 to-amber-600 opacity-70"></span>
                    <img
                      src="/icons/dumbbell-small.svg"
                      alt="YKFA"
                      className="w-8 h-8 relative z-10"
                      style={{
                        filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))',
                        transform: 'translateZ(0)'
                      }}
                      width="32"
                      height="32"
                    />
                  </div>

                  {/* Text content */}
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold font-spaceGrotesk tracking-wide whitespace-nowrap">
                      Yaseen's <span className="text-amber-400">YKFA</span>
                    </span>
                    <span className="text-[9px] text-gray-400 -mt-1 tracking-wide">FITNESS & MARTIAL ARTS</span>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="p-2">
                <ul className="space-y-1">
                  {navigationItems.map((item) => {
                    const isActive = currentPath === item.to;
                    const Icon = item.icon;

                    return (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${isActive
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'text-gray-300 hover:bg-white/5'
                            }`}
                          onClick={onClose}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-gray-400'}`} />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* App download buttons */}
              <div className="px-4 py-3 border-t border-white/10">
                <div className="flex gap-2">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.ydl.yaseensykfawarriorss&pcampaignid=web_share"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-black/30 hover:bg-black/50 text-white py-2 rounded-lg border border-white/10 transition-colors"
                    onClick={onClose}
                  >
                    <PlayStoreIcon />
                    <span className="text-xs">Google Play</span>
                  </a>
                  <a
                    href="#"
                    className="flex-1 flex items-center justify-center gap-2 bg-black/30 hover:bg-black/50 text-white py-2 rounded-lg border border-white/10 transition-colors"
                    onClick={onClose}
                  >
                    <AppleStoreIcon />
                    <span className="text-xs">App Store</span>
                  </a>
                </div>
              </div>

              {/* Render children if provided */}
              {children}
            </div>
          </div>
        </div>
      )}

      {/* CSS animation for menu items */}
      <style>{`
        @keyframes navItemFadeIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>,
    document.body
  );
};

export default MobileMenu; 