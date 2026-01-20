import { Mail, MapPin, Phone, Facebook, Instagram, ChevronRight, Github, Globe, X, Heart } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { WidgetContext } from '../App';

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
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in backdrop-blur-sm"
          onClick={handleOutsideClick}
        >
          {/* Simple backdrop */}
          <div className="fixed inset-0 bg-black/60" />

          {/* Modal container */}
          <div
            ref={modalRef}
            className="relative w-80 z-10 animate-scale-in"
          >
            {/* Glassmorphic card design */}
            <div className="bg-zinc-900/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl ring-1 ring-white/5">
              {/* Header with close button */}
              <div className="flex justify-between items-center p-5 border-b border-white/5 bg-white/5">
                <h3 className="text-lg font-bold text-white font-spaceGrotesk tracking-wide">Developer Profile</h3>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Profile content */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-amber-700 p-0.5 shadow-lg shadow-orange-500/20">
                    <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-white">
                      A
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white font-spaceGrotesk">Aman Anu</h4>
                    <p className="text-xs font-medium text-amber-400/90 uppercase tracking-wider">Full Stack Developer</p>
                    <p className="text-xs text-gray-500 mt-1">Building digital experiences</p>
                  </div>
                </div>

                {/* Social links */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { icon: <Instagram className="w-5 h-5" />, label: 'Instagram', href: 'https://instagram.com/amanxnu' },
                    { icon: <Github className="w-5 h-5" />, label: 'GitHub', href: 'https://github.com/amxcodes' },
                    { icon: <Globe className="w-5 h-5" />, label: 'Website', href: 'https://amanxnu.space' }
                  ].map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-500/30 transition-all duration-300 group"
                    >
                      <div className="text-gray-400 group-hover:text-amber-400 transition-colors duration-300">
                        {link.icon}
                      </div>
                      <span className="text-[10px] text-gray-400 group-hover:text-white mt-1.5 font-medium">{link.label}</span>
                    </a>
                  ))}
                </div>

                {/* Portfolio link */}
                <a
                  href="https://amanxnu.space/portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-center text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    View Full Portfolio
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDevModal, setShowDevModal] = useState(false);
  const { performanceMode } = useContext(WidgetContext);

  // Check if we're on the timer page
  const isTimerPage = location.pathname === '/timer';

  // Function to handle program link clicks
  const handleProgramClick = (programName: string) => {
    // Store the program name in localStorage
    localStorage.setItem('selectedProgram', programName);

    // Dispatch custom event for program selection
    const event = new CustomEvent(PROGRAM_SELECTED_EVENT, {
      detail: { programName }
    });
    window.dispatchEvent(event);

    // Initial scroll to top before navigation/scroll happens
    window.scrollTo(0, 0);
  };

  return (
    <footer className="relative bg-black z-50">
      {/* Top Border with Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-70"></div>

      {/* Decorative ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[300px] left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[300px] right-1/4 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px]"></div>
        {/* Mesh pattern overlay */}
        <div className="absolute inset-0 bg-[url('/img/grid-pattern.svg')] opacity-[0.03]"></div>
      </div>

      <div className="container mx-auto px-6 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">

          {/* Brand Section (Col Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-block group">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 flex items-center justify-center rounded-xl overflow-hidden shadow-lg shadow-amber-500/10 group-hover:shadow-amber-500/20 transition-all duration-300 bg-zinc-900 border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black opacity-100"></div>
                  <img
                    src="/img/favicon.webp"
                    alt="Yaseen's YKFA"
                    className="w-12 h-12 object-cover relative z-10 opacity-90 group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Sheen effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold font-spaceGrotesk tracking-tight text-white group-hover:text-amber-400 transition-colors duration-300">
                    Yaseen's <span className="text-amber-500">YKFA</span>
                  </span>
                  <span className="text-[10px] font-medium tracking-widest uppercase text-gray-500">Mastery in Motion</span>
                </div>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Elite martial arts and fitness training in Kochi. Join a community dedicated to transforming bodies and minds through discipline, technique, and perseverance.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/share/1AKa49mdi5/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5 hover:bg-blue-600/20 hover:border-blue-500/50 hover:text-blue-500 text-gray-400 transition-all duration-300 group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://www.instagram.com/yaseen.karate?igsh=MWI2aTU5YXFtOXkycg%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5 hover:bg-pink-600/20 hover:border-pink-500/50 hover:text-pink-500 text-gray-400 transition-all duration-300 group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Quick Links (Col Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest font-spaceGrotesk border-l-2 border-amber-500 pl-3">Explore</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', path: '/' },
                { label: 'About & Philosophy', path: '/about' },
                { label: 'Gallery', path: '/programs' },
                { label: 'Store', path: '/store' },
                { label: 'Membership Plans', path: '/membership' },
                { label: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group flex items-center text-sm text-gray-400 hover:text-amber-400 transition-colors duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-amber-400 mr-3 transition-colors duration-200"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs (Col Span 3) */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest font-spaceGrotesk border-l-2 border-amber-500 pl-3">Training</h3>
            <ul className="space-y-3">
              {[
                { label: 'Karate Training', id: 'KARATE' },
                { label: 'MMA + GYM', id: 'MMA + GYM' },
                { label: 'MMA Training', id: 'MMA ONLY' },
                { label: 'Group Fitness', id: 'GROUP FITNESS' },
                { label: 'Gym Access', id: 'GYM FIT FUSION' },
                { label: 'Personal Training', id: 'PERSONAL TRAINING' },
              ].map((program) => (
                <li key={program.id}>
                  <button
                    onClick={() => handleProgramClick(program.id)}
                    className="group flex items-center text-left text-sm text-gray-400 hover:text-amber-400 transition-colors duration-200 w-full"
                  >
                    <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-amber-400 mr-2 transition-colors duration-200" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{program.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact (Col Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest font-spaceGrotesk border-l-2 border-amber-500 pl-3">Visit Us</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-amber-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-sm text-gray-400 leading-relaxed">
                  <span className="text-white font-medium block mb-0.5">Y&Y Arcade</span>
                  Vp Marakkar Road,<br />Edappally Po, Kochi 682024
                </div>
              </li>
              <li>
                <a href="tel:+917736488858" className="flex items-center gap-3 group">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-colors duration-300">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-300">+91 77364 88858</span>
                </a>
              </li>
              <li>
                <a href="mailto:yaseenkfa@gmail.com" className="flex items-center gap-3 group">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-colors duration-300">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-300">yaseenkfa@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Yaseen's YKFA. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowDevModal(true)}
              className="text-xs text-gray-500 hover:text-amber-400 transition-colors flex items-center gap-1.5 group"
            >
              Created with <Heart className="w-3 h-3 text-red-500/70 group-hover:text-red-500 fill-red-500/0 group-hover:fill-red-500 transition-all duration-300" /> by
              <span className="font-medium text-gray-400 group-hover:text-white transition-colors">amanxnu</span>
            </button>
          </div>
        </div>
      </div>

      <DevModal isOpen={showDevModal} onClose={() => setShowDevModal(false)} />
    </footer>
  );
};

export default Footer;