import { Mail, MapPin, Phone, Facebook, Instagram, Twitter, ChevronRight, Github, Globe } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Program types that match the HomePage.tsx program data

// Create a custom event for program selection
export const PROGRAM_SELECTED_EVENT = 'programSelected';

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
                  src="/icons/dumbbell-small.svg" 
                  alt="Dumbbell icon" 
                  className="w-10 h-10 text-black z-10 transform group-hover:scale-105 transition-transform duration-300"
                  style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }}
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
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors rounded-full p-2 hover:bg-amber-400/10" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors rounded-full p-2 hover:bg-amber-400/10" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors rounded-full p-2 hover:bg-amber-400/10" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
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
                <ChevronRight className="w-4 h-4 text-amber-400/70 mr-1.5" />About
              </Link>
              <Link to="/programs" className="text-gray-400 hover:text-amber-400 transition-colors text-sm flex items-center">
                <ChevronRight className="w-4 h-4 text-amber-400/70 mr-1.5" />Gallery
              </Link>
              <Link to="/instructors" className="text-gray-400 hover:text-amber-400 transition-colors text-sm flex items-center">
                <ChevronRight className="w-4 h-4 text-amber-400/70 mr-1.5" />Instructors
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
            className="text-gray-500 hover:text-gray-300 text-xs mt-1 transition-colors flex items-center justify-center mx-auto group"
          >
            Made with <span className="mx-1 text-red-500 group-hover:animate-pulse">❤️</span> by amanxnu
          </button>
        </div>
      </div>

      {/* Developer Modal */}
      <AnimatePresence>
        {showDevModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Modal content */}
              <div className="relative p-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
                {/* Background effects */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"></div>
                
                {/* Close button */}
                <button 
                  onClick={() => setShowDevModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                {/* Profile section */}
                <div className="text-center mb-5">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-red-500 p-1 mx-auto">
                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-2xl font-bold text-white">
                      A
                    </div>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-white">amanxnu</h3>
                  <p className="text-gray-300 text-sm mt-1">Developer & Designer</p>
                </div>
                
                {/* Social links */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <a 
                    href="https://instagram.com/amanxnu" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <Instagram className="w-6 h-6 text-pink-400 mb-1" />
                    <span className="text-xs text-gray-300">Instagram</span>
                  </a>
                  <a 
                    href="https://github.com/amanxnu" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-300 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    <span className="text-xs text-gray-300">GitHub</span>
                  </a>
                  <a 
                    href="https://amanxnu.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-400 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    <span className="text-xs text-gray-300">Website</span>
                  </a>
                </div>
                
                {/* Footer */}
                <div className="text-center text-xs text-gray-400 border-t border-white/10 pt-4">
                  <p>Thanks for checking out my work!</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;