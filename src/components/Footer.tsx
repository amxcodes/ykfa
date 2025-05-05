import { Mail, MapPin, Phone, Facebook, Instagram, Twitter, ChevronRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Program types that match the HomePage.tsx program data

// Create a custom event for program selection
export const PROGRAM_SELECTED_EVENT = 'programSelected';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
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
          <p className="text-gray-600 text-xs mt-1">Right-click anywhere for quick navigation</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;