import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MousePointer } from 'lucide-react';

interface CursorControlProps {
  className?: string;
}

const CursorControl = ({ className = '' }: CursorControlProps) => {
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
    
    // Reload page to apply change
    window.location.reload();
  };
  
  return (
    <motion.button
      className={`fixed bottom-4 right-4 z-50 p-2 rounded-full bg-dark-800/80 backdrop-blur-sm border border-white/10 shadow-lg ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleCursor}
      title={isCursorEnabled ? "Disable custom cursor" : "Enable custom cursor"}
      aria-label={isCursorEnabled ? "Disable custom cursor" : "Enable custom cursor"}
    >
      <MousePointer 
        size={16} 
        className={isCursorEnabled ? "text-amber-400" : "text-gray-400"} 
      />
    </motion.button>
  );
};

export default CursorControl; 