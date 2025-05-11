import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MousePointer } from 'lucide-react';

interface NavbarCursorControlProps {
  className?: string;
}

const NavbarCursorControl = ({ className = '' }: NavbarCursorControlProps) => {
  const [isCursorEnabled, setIsCursorEnabled] = useState<boolean>(false);
  
  // Load preference from localStorage on mount
  useEffect(() => {
    const cursorPreference = localStorage.getItem('cursorPreference');
    setIsCursorEnabled(cursorPreference === 'enabled');
  }, []);
  
  const toggleCursor = () => {
    const newState = !isCursorEnabled;
    setIsCursorEnabled(newState);
    
    // Save to localStorage
    localStorage.setItem('cursorPreference', newState ? 'enabled' : 'disabled');
    
    // Apply cursor change immediately
    if (newState) {
      // When enabling custom cursor, we need a page reload for all components to properly initialize
      window.location.reload();
    } else {
      // Custom cursor disabled - make sure normal cursor is immediately visible
      document.body.style.cursor = 'auto';
      
      // Force all cursor-related elements to update
      const event = new Event('cursorDisabled');
      window.dispatchEvent(event);
    }
  };
  
  return (
    <motion.button
      className={`px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-white/5 backdrop-blur-sm border border-transparent hover:border-white/10 transition-all ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={toggleCursor}
      title={isCursorEnabled ? "Disable custom cursor" : "Enable custom cursor"}
      aria-label={isCursorEnabled ? "Disable custom cursor" : "Enable custom cursor"}
    >
      <MousePointer 
        size={16} 
        className={isCursorEnabled ? "text-amber-400" : "text-gray-400 group-hover:text-white"} 
      />
      <span className={`text-sm font-medium ${isCursorEnabled ? "text-amber-400" : "text-gray-300"}`}>
        Custom
      </span>
    </motion.button>
  );
};

export default NavbarCursorControl; 