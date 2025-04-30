import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  isScrolled: boolean;
}

const Navbar = ({ isScrolled }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [show, setShow] = useState(true);

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

  return (
    <header
      className={`fixed w-full z-[100] transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/90 supports-[backdrop-filter]:bg-black/75 backdrop-blur-lg border-b border-amber-400/20' 
          : 'bg-gradient-to-b from-black/80 to-transparent'
      } ${!show ? '-translate-y-full' : 'translate-y-0'}`}
      style={{ 
        WebkitBackdropFilter: isScrolled ? 'blur(8px)' : 'none',
        backdropFilter: isScrolled ? 'blur(8px)' : 'none' 
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between relative">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10 flex items-center justify-center rounded-lg overflow-hidden bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg hover:shadow-amber-400/50 transition-shadow duration-300 group p-0">
              <span className="absolute inset-0 bg-gradient-to-br from-amber-300 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <img 
                src="/icons/dumbbell-small.svg" 
                alt="Dumbbell icon" 
                className="w-10 h-10 text-black z-10 transform group-hover:scale-105 transition-transform duration-300 p-0"
                style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }}
              />
            </div>
            <span className="text-xl font-bold font-spaceGrotesk tracking-wide">
              Yaseen's <span className="text-amber-400">YKFA</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NavLink to="/" className={({ isActive }) => 
              `px-4 py-2 rounded-lg transition-colors ${isActive ? 'text-amber-400 bg-amber-400/10' : 'text-white hover:text-amber-400 hover:bg-dark-800/50'}`
            }>
              Home
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => 
              `px-4 py-2 rounded-lg transition-colors ${isActive ? 'text-amber-400 bg-amber-400/10' : 'text-white hover:text-amber-400 hover:bg-dark-800/50'}`
            }>
              About
            </NavLink>
            <NavLink to="/programs" className={({ isActive }) => 
              `px-4 py-2 rounded-lg transition-colors ${isActive ? 'text-amber-400 bg-amber-400/10' : 'text-white hover:text-amber-400 hover:bg-dark-800/50'}`
            }>
              Programs
            </NavLink>
            <NavLink to="/instructors" className={({ isActive }) => 
              `px-4 py-2 rounded-lg transition-colors ${isActive ? 'text-amber-400 bg-amber-400/10' : 'text-white hover:text-amber-400 hover:bg-dark-800/50'}`
            }>
              Instructors
            </NavLink>
            <NavLink to="/membership" className={({ isActive }) => 
              `px-4 py-2 rounded-lg transition-colors ${isActive ? 'text-amber-400 bg-amber-400/10' : 'text-white hover:text-amber-400 hover:bg-dark-800/50'}`
            }>
              Membership
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => 
              `px-4 py-2 rounded-lg transition-colors ${isActive ? 'text-amber-400 bg-amber-400/10' : 'text-white hover:text-amber-400 hover:bg-dark-800/50'}`
            }>
              Contact
            </NavLink>
            <Link 
              to="/contact" 
              className="ml-4 bg-gradient-to-r from-amber-400 to-amber-500 text-black px-6 py-2 rounded-lg hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] transition-shadow"
            >
              Join Now
            </Link>
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="lg:hidden relative">
            <button
              id="menu-button"
              className="relative z-50 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-dark-800/50 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Navigation Dropdown */}
            <div 
              id="mobile-nav"
              className={`absolute right-0 top-full mt-2 w-64 bg-dark-800/95 backdrop-blur-md rounded-lg shadow-lg border border-dark-700 overflow-hidden transition-all duration-200 origin-top-right ${
                isMenuOpen 
                  ? 'opacity-100 visible scale-100 translate-y-0' 
                  : 'opacity-0 invisible scale-95 -translate-y-2'
              }`}
            >
              <nav className="py-2">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `block px-4 py-2 text-sm ${
                      isActive ? 'text-amber-400 bg-amber-400/10' : 'text-white hover:bg-dark-700'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink 
                  to="/about" 
                  className={({ isActive }) => 
                    `block px-4 py-2 text-sm ${
                      isActive ? 'text-amber-400 bg-amber-400/10' : 'text-white hover:bg-dark-700'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </NavLink>
                <NavLink 
                  to="/programs" 
                  className={({ isActive }) => 
                    `block px-4 py-2 text-sm ${
                      isActive ? 'text-amber-400 bg-amber-400/10' : 'text-white hover:bg-dark-700'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Programs
                </NavLink>
                <NavLink 
                  to="/instructors" 
                  className={({ isActive }) => 
                    `block px-4 py-2 text-sm ${
                      isActive ? 'text-amber-400 bg-amber-400/10' : 'text-white hover:bg-dark-700'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Instructors
                </NavLink>
                <NavLink 
                  to="/membership" 
                  className={({ isActive }) => 
                    `block px-4 py-2 text-sm ${
                      isActive ? 'text-amber-400 bg-amber-400/10' : 'text-white hover:bg-dark-700'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Membership
                </NavLink>
                <NavLink 
                  to="/contact" 
                  className={({ isActive }) => 
                    `block px-4 py-2 text-sm ${
                      isActive ? 'text-amber-400 bg-amber-400/10' : 'text-white hover:bg-dark-700'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </NavLink>
                <div className="px-4 py-2 border-t border-dark-700 mt-2">
                  <Link 
                    to="/contact" 
                    className="block w-full bg-gradient-to-r from-amber-400 to-amber-500 text-black text-center text-sm font-medium px-4 py-2 rounded-lg hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] transition-shadow"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Join Now
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;