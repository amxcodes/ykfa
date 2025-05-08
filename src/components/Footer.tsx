import { Mail, MapPin, Phone, Facebook, Instagram, ChevronRight, Github, Globe, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Program types that match the HomePage.tsx program data

// Create a custom event for program selection
export const PROGRAM_SELECTED_EVENT = 'programSelected';

// Separate Developer Modal Component
interface DevModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DevModal = ({ isOpen, onClose }: DevModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle clicks outside modal
  const handleOutsideClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  }, [onClose]);
  
  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={handleOutsideClick}
        >
          {/* Simple backdrop */}
          <div className="fixed inset-0 bg-black/70" />
          
          {/* Modal container */}
          <motion.div 
            ref={modalRef}
            className="relative w-72 z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Minimal card design */}
            <div className="bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl">
              {/* Header with close button */}
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">Developer</h3>
                <button 
                  onClick={onClose}
                  className="p-1 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Simple profile content */}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xl font-bold text-white">
                    A
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Aman Anu</h4>
                    <p className="text-xs text-gray-400">Developer & Designer</p>
                  </div>
                </div>
                
                {/* Social links */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { icon: <Instagram className="w-4 h-4" />, label: 'Instagram', href: 'https://instagram.com/amanxnu' },
                    { icon: <Github className="w-4 h-4" />, label: 'GitHub', href: 'https://github.com/amxcodes' },
                    { icon: <Globe className="w-4 h-4" />, label: 'Website', href: 'https://amanxnu.space' }
                  ].map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      {link.icon}
                      <span className="text-[10px] text-gray-400 mt-1">{link.label}</span>
                    </a>
                  ))}
                </div>
                
                {/* Portfolio link */}
                <a
                  href="https://amanxnu.space/portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2 rounded-lg bg-amber-500 text-black font-medium text-center text-sm"
                >
                  View Portfolio
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDevModal, setShowDevModal] = useState(false);
  
  // Function to handle program link clicks
  const handleProgramClick = (programName: string) => {
    // Store the program in localStorage to retrieve in HomePage
    localStorage.setItem('selectedProgram', programName);
    console.log("Stored program in localStorage:", programName);
    
    // Check if we're already on the home page
    if (location.pathname === '/') {
      // If we're already on the home page, dispatch a custom event
      const event = new CustomEvent(PROGRAM_SELECTED_EVENT, { 
        detail: { programName } 
      });
      window.dispatchEvent(event);
      console.log("Dispatched event for:", programName);
    } else {
      // Navigate to home page - the modal will be opened by HomePage useEffect
      navigate('/');
    }
  };
  
  return (
    <footer className="relative bg-black/40 backdrop-blur-xl border-t border-white/10">
      {/* Decorative gradient elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
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
              <span className="text-xl font-bold font-spaceGrotesk tracking-wide">
                Yaseen's <span className="text-amber-400">YKFA</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm max-w-xs">
              Elite training programs for all fitness levels. Join our community and transform your life through fitness and martial arts.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/1AKa49mdi5/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-400 transition-colors rounded-full p-2 hover:bg-amber-400/10" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/yaseen.karate?igsh=MWI2aTU5YXFtOXkycg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-400 transition-colors rounded-full p-2 hover:bg-amber-400/10" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <div className="grid gap-2">
              <Link to="/" className="text-gray-400 hover:text-amber-400 transition-colors text-sm flex items-center">
                <ChevronRight className="w-4 h-4 text-amber-400/70 mr-1.5" />Home
              </Link>
              <Link to="/about" className="text-gray-400 hover:text-amber-400 transition-colors text-sm flex items-center">
                <ChevronRight className="w-4 h-4 text-amber-400/70 mr-1.5" />Blogs
              </Link>
              <Link to="/programs" className="text-gray-400 hover:text-amber-400 transition-colors text-sm flex items-center">
                <ChevronRight className="w-4 h-4 text-amber-400/70 mr-1.5" />Gallery
              </Link>
              
              <Link to="/store" className="text-gray-400 hover:text-amber-400 transition-colors text-sm flex items-center">
                <ChevronRight className="w-4 h-4 text-amber-400/70 mr-1.5" />Store
              </Link>
              <Link to="/membership" className="text-gray-400 hover:text-amber-400 transition-colors text-sm flex items-center">
                <ChevronRight className="w-4 h-4 text-amber-400/70 mr-1.5" />Membership
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-amber-400 transition-colors text-sm flex items-center">
                <ChevronRight className="w-4 h-4 text-amber-400/70 mr-1.5" />Contact
              </Link>
            </div>
          </div>

          {/* Programs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Programs</h3>
            <div className="grid gap-2">
              <button 
                onClick={() => handleProgramClick('KARATE')}
                className="text-left text-gray-400 hover:text-amber-400 transition-colors text-sm flex items-center"
              >
                <ChevronRight className="w-4 h-4 text-amber-400/70 mr-1.5" />Karate Training
              </button>
              <button 
                onClick={() => handleProgramClick('MMA + GYM')}
                className="text-left text-gray-400 hover:text-amber-400 transition-colors text-sm flex items-center"
              >
                <ChevronRight className="w-4 h-4 text-amber-400/70 mr-1.5" />MMA + GYM
              </button>
              <button 
                onClick={() => handleProgramClick('MMA ONLY')}
                className="text-left text-gray-400 hover:text-amber-400 transition-colors text-sm flex items-center"
              >
                <ChevronRight className="w-4 h-4 text-amber-400/70 mr-1.5" />MMA Training
              </button>
              <button 
                onClick={() => handleProgramClick('GROUP FITNESS')}
                className="text-left text-gray-400 hover:text-amber-400 transition-colors text-sm flex items-center"
              >
                <ChevronRight className="w-4 h-4 text-amber-400/70 mr-1.5" />Group Fitness
              </button>
              <button 
                onClick={() => handleProgramClick('GYM ONLY')}
                className="text-left text-gray-400 hover:text-amber-400 transition-colors text-sm flex items-center"
              >
                <ChevronRight className="w-4 h-4 text-amber-400/70 mr-1.5" />Gym Access
              </button>
              <button 
                onClick={() => handleProgramClick('PERSONAL TRAINING')}
                className="text-left text-gray-400 hover:text-amber-400 transition-colors text-sm flex items-center"
              >
                <ChevronRight className="w-4 h-4 text-amber-400/70 mr-1.5" />Personal Training
              </button>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">Y&Y Arcade, Vp Marakkar Road, Edappally Po, Kochi 682024</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+91 7736488858</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">yaseenkfa@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Yaseen's YKFA. All rights reserved.</p>
          <button 
            onClick={() => setShowDevModal(true)}
            className="text-gray-500 hover:text-gray-300 text-xs mt-1 transition-colors flex items-center justify-center mx-auto"
            aria-label="View developer information"
          >
            Made with <span className="mx-1 text-red-500 hover:animate-pulse">❤️</span> by amanxnu
          </button>
        </div>
      </div>

      {/* Render the separate DevModal component */}
      <DevModal isOpen={showDevModal} onClose={() => setShowDevModal(false)} />
    </footer>
  );
};

export default Footer;