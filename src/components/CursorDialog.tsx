import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MousePointer, MousePointerClick } from 'lucide-react';

interface CursorDialogProps {
  onEnable: () => void;
  onDisable: () => void;
}

const CursorDialog = ({ onEnable, onDisable }: CursorDialogProps) => {
  const [isVisible, setIsVisible] = useState(true);

  // Check if preference is already set in localStorage
  useEffect(() => {
    const cursorPreference = localStorage.getItem('cursorPreference');
    if (cursorPreference === 'enabled') {
      onEnable();
      setIsVisible(false);
    } else if (cursorPreference === 'disabled') {
      onDisable();
      setIsVisible(false);
    }
  }, [onEnable, onDisable]);

  const handleEnable = () => {
    localStorage.setItem('cursorPreference', 'enabled');
    onEnable();
    setIsVisible(false);
  };

  const handleDisable = () => {
    localStorage.setItem('cursorPreference', 'disabled');
    onDisable();
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Dialog */}
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[350px] bg-dark-800/95 border border-white/10 backdrop-blur-xl rounded-xl z-[9999] overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Custom Cursor</h3>
                <button 
                  onClick={handleDisable}
                  className="rounded-full p-1 bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
              
              <p className="text-gray-300 text-sm mb-6">
                Would you like to enable the custom cursor for an enhanced browsing experience?
              </p>
              
              <div className="grid grid-cols-2 gap-3 cursor-options mb-2">
                <motion.div
                  className="relative group"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={handleEnable}
                    className="flex flex-col items-center justify-center w-full p-4 rounded-lg border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mb-2">
                      <MousePointerClick size={20} className="text-amber-400" />
                    </div>
                    <span className="text-white font-medium text-sm">Enable</span>
                    <span className="text-amber-400/70 text-xs mt-1">Recommended</span>
                  </button>
                </motion.div>
                
                <motion.div
                  className="relative group"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={handleDisable}
                    className="flex flex-col items-center justify-center w-full p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2">
                      <MousePointer size={20} className="text-gray-400" />
                    </div>
                    <span className="text-white font-medium text-sm">Disable</span>
                    <span className="text-gray-500 text-xs mt-1">Use browser default</span>
                  </button>
                </motion.div>
              </div>
              
              <p className="text-gray-500 text-[10px] text-center mt-4">
                You can change this setting later in your profile preferences.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CursorDialog; 