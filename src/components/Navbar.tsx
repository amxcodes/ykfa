import { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import MobileMenu from './MobileMenu';
import AppStoreWidget from './AppStoreWidget';
import NavbarCursorControl from './NavbarCursorControl';

// Google Play Store SVG icon component
const PlayStoreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.609 1.814L13.792 12 3.609 22.186c-.181.181-.29.435-.29.71 0 .528.435.964.963.964.253 0 .477-.1.652-.261L15.147 12.964c.159-.158.256-.377.256-.619 0-.241-.097-.46-.256-.618L4.934 1.104A.957.957 0 004.282.844a.969.969 0 00-.963.962c0 .302.142.56.326.72l-.036-.712zm4.349.793l9.383 9.383L7.958 22.373c-.283.284-.284.722-.059 1.015.224.292.626.36.945.128l14.043-8.107c.246-.142.443-.38.443-.664 0-.282-.197-.522-.443-.664L8.86.583c-.315-.234-.714-.171-.947.121-.23.292-.228.727.045 1.014v.889z"></path>
  </svg>
);

interface NavbarProps {
  isScrolled: boolean;
}

const Navbar = ({ isScrolled }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [show, setShow] = useState(true);
  const [showAppWidget, setShowAppWidget] = useState(false);
  const appButtonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > 100) {
        if (window.scrollY > lastScrollY) {
          setShow(false);
        } else {
          setShow(true);
        }
      } else {
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.getElementById('mobile-nav');
      const button = document.getElementById('menu-button');
      if (isMenuOpen && nav && !nav.contains(event.target as Node) && button && !button.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Lock scrolling only when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Handle desktop app widget toggle
  const handleAppWidgetToggle = (event: React.MouseEvent) => {
    // Only prevent default on desktop to show widget
    if (window.innerWidth >= 1024) {
      event.preventDefault();
      setShowAppWidget(!showAppWidget);
    }
    // On mobile, default behavior (navigate to Play Store)
  };

  return (
    <header
      className={`fixed w-full z-[100] transition-all duration-300 mt-3 bg-transparent ${
        !show ? '-translate-y-full' : 'translate-y-0'
      }`}
      style={{ 
        willChange: 'transform',
        transform: `translateZ(0)`,
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden'
      }}
    >
      <div className={`max-w-[96%] w-full mx-auto rounded-full transition-all duration-300 ${
        isScrolled 
          ? 'backdrop-blur-xl border border-white/10 shadow-lg' 
          : 'backdrop-blur-md border border-white/10'
      }`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between relative">
            {/* Logo with tagline */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative w-10 h-10 flex items-center justify-center rounded-lg overflow-hidden bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg group-hover:shadow-amber-400/50 transition-shadow duration-300">
                <span className="absolute inset-0 bg-gradient-to-br from-amber-300 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <img 
                  src="https://i.postimg.cc/g0mqFF16/favicon.png" 
                  alt="Dumbbell icon" 
                  className="w-10 h-10 text-black z-10 transform group-hover:scale-105 transition-transform duration-300"
                  style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }}
                  onLoad={(e) => {
                    const img = new Image();
                    img.onload = () => {
                      (e.target as HTMLImageElement).src = "/icons/dumbbell-small.svg";
                    };
                    img.onerror = () => {}; // Keep fallback image
                    img.src = "/icons/dumbbell-small.svg";
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://i.postimg.cc/g0mqFF16/favicon.png";
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold font-spaceGrotesk tracking-wide">
                  Yaseen's <span className="text-amber-400">YKFA</span>
                </span>
                <span className="text-[10px] text-gray-400 -mt-1 tracking-wide">FITNESS & MARTIAL ARTS</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center">
              <div className="flex items-center space-x-1">
                <NavLink to="/" className={({ isActive }) => 
                  `px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                    isActive 
                      ? 'text-amber-400 bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)]' 
                      : 'text-white hover:text-amber-400 hover:bg-white/5 border border-transparent'
                  }`
                }>
                  Home
                </NavLink>
                
                <NavLink to="/programs" className={({ isActive }) => 
                  `px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                    isActive 
                      ? 'text-amber-400 bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)]' 
                      : 'text-white hover:text-amber-400 hover:bg-white/5 border border-transparent'
                  }`
                }>
                  Gallery
                </NavLink>
                
                <NavLink to="/schedule" className={({ isActive }) => 
                  `px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                    isActive 
                      ? 'text-amber-400 bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)]' 
                      : 'text-white hover:text-amber-400 hover:bg-white/5 border border-transparent'
                  }`
                }>
                  Schedule
                </NavLink>
                
                <NavLink to="/store" className={({ isActive }) => 
                  `px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                    isActive 
                      ? 'text-amber-400 bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)]' 
                      : 'text-white hover:text-amber-400 hover:bg-white/5 border border-transparent'
                  }`
                }>
                  Store
                </NavLink>
                <NavLink to="/membership" className={({ isActive }) => 
                  `px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                    isActive 
                      ? 'text-amber-400 bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)]' 
                      : 'text-white hover:text-amber-400 hover:bg-white/5 border border-transparent'
                  }`
                }>
                  Membership
                </NavLink>

                <NavLink to="/blog" className={({ isActive }) => 
                  `px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                    isActive 
                      ? 'text-amber-400 bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)]' 
                      : 'text-white hover:text-amber-400 hover:bg-white/5 border border-transparent'
                  }`
                }>
                  Blogs
                </NavLink>

                <NavLink to="/contact" className={({ isActive }) => 
                  `px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                    isActive 
                      ? 'text-amber-400 bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)]' 
                      : 'text-white hover:text-amber-400 hover:bg-white/5 border border-transparent'
                  }`
                }>
                  Contact
                </NavLink>
              </div>
              
              {/* Divider and Download App Button with extra spacing */}
              <div className="flex items-center">
                <div className="mx-8 h-5 w-px bg-white/10"></div>
                <motion.a 
                  ref={appButtonRef}
                  href="https://play.google.com/store/apps/details?id=com.ydl.yaseensykfawarriors&pcampaignid=web_share" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-amber-400 to-amber-500 text-black px-4 py-1.5 rounded-lg text-sm hover:shadow-[0_0_15px_rgba(255,191,36,0.3)] transition-all flex items-center gap-2 border border-amber-300/30"
                  onClick={handleAppWidgetToggle}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <PlayStoreIcon />
                  <span className="font-medium">Get App</span>
                </motion.a>
                
                {/* Cursor Control Toggle */}
                <NavbarCursorControl className="ml-3" />
              </div>
            </nav>

            {/* Mobile Navigation Toggle */}
            <div className="lg:hidden relative z-50">
              <motion.button
                id="menu-button"
                className="relative z-50 w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm border border-white/10"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                whileTap={{ scale: 0.95 }}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Component */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      {/* App Store Widget (desktop only) */}
      <AppStoreWidget 
        isOpen={showAppWidget} 
        onClose={() => setShowAppWidget(false)} 
        buttonRef={appButtonRef}
      />
    </header>
  );
};

export default Navbar;