import { Mail, MapPin, Phone, Dumbbell, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark-800 border-t border-dark-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 p-2 rounded-lg">
                <Dumbbell className="w-6 h-6 text-black" />
              </span>
              <span className="text-xl font-bold font-spaceGrotesk tracking-wide">
                Yaseen's <span className="text-amber-400">YKFA</span>
              </span>
            </Link>
            <p className="text-gray-400 max-w-xs">
              Elite training programs for all fitness levels. Join our community and transform your life through fitness and martial arts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
              <Link to="/" className="text-gray-400 hover:text-amber-400 transition-colors">Home</Link>
              <Link to="/about" className="text-gray-400 hover:text-amber-400 transition-colors">About</Link>
              <Link to="/programs" className="text-gray-400 hover:text-amber-400 transition-colors">Programs</Link>
              <Link to="/instructors" className="text-gray-400 hover:text-amber-400 transition-colors">Instructors</Link>
              <Link to="/membership" className="text-gray-400 hover:text-amber-400 transition-colors">Membership</Link>
              <Link to="/contact" className="text-gray-400 hover:text-amber-400 transition-colors">Contact</Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Programs</h3>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
              <Link to="/programs" className="text-gray-400 hover:text-amber-400 transition-colors">Karate Training</Link>
              <Link to="/programs" className="text-gray-400 hover:text-amber-400 transition-colors">Strength & Conditioning</Link>
              <Link to="/programs" className="text-gray-400 hover:text-amber-400 transition-colors">Kids Martial Arts</Link>
              <Link to="/programs" className="text-gray-400 hover:text-amber-400 transition-colors">Fitness Classes</Link>
              <Link to="/programs" className="text-gray-400 hover:text-amber-400 transition-colors">Personal Training</Link>
              <Link to="/programs" className="text-gray-400 hover:text-amber-400 transition-colors">Self Defense</Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">123 Fitness Street, City Center, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span className="text-gray-400">info@yaseensykfa.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-dark-700 text-center">
          <p className="text-gray-500">© {new Date().getFullYear()} Yaseen's YKFA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;