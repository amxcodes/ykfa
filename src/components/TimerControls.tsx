import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useTimerContext } from '../context/TimerContext';
import { useEffect, useState } from 'react';

interface TimerControlsProps {
  className?: string;
}

const TimerControls = ({ className = '' }: TimerControlsProps) => {
  const { isRunning, toggleTimer, resetTimer, transitionActive } = useTimerContext();
  const [windowHeight, setWindowHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  
  // Track window dimensions for sizing adjustments
  useEffect(() => {
    const updateWindowDimensions = () => {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    };
    
    updateWindowDimensions();
    window.addEventListener('resize', updateWindowDimensions);
    
    return () => {
      window.removeEventListener('resize', updateWindowDimensions);
    };
  }, []);

  // Adjust button sizes based on screen dimensions
  const isSmallScreen = Math.min(windowHeight, windowWidth) < 600;
  
  // Determine button styles based on timer mode and states
  const playButtonClass = 
    transitionActive 
      ? 'bg-gray-800/60 backdrop-blur-md cursor-not-allowed opacity-70 border border-white/10' 
      : isRunning 
        ? 'bg-red-500/60 backdrop-blur-md hover:bg-red-600/70 border border-white/10' 
        : 'bg-green-500/60 backdrop-blur-md hover:bg-green-600/70 border border-white/10';

  const resetButtonClass = 
    transitionActive 
      ? 'bg-dark-800/40 backdrop-blur-md border border-gray-700/50 opacity-70 cursor-not-allowed' 
      : 'bg-dark-800/40 backdrop-blur-md border border-white/10 hover:border-white/30';
  
  // Adjust button sizing and container position for better mobile layout
  const buttonSize = isSmallScreen ? 'w-12 h-12' : 'w-14 h-14';
  const iconSize = isSmallScreen ? 'w-6 h-6' : 'w-7 h-7';
  
  return (
    <div className={`flex justify-center gap-4 py-3 ${className}`}>
      <motion.button
        whileHover={!transitionActive ? { scale: 1.05 } : {}}
        whileTap={!transitionActive ? { scale: 0.95 } : {}}
        onClick={!transitionActive ? toggleTimer : undefined}
        className={`${playButtonClass} ${buttonSize} text-white rounded-full flex items-center justify-center shadow-none transition-all`}
        disabled={transitionActive}
      >
        {isRunning ? (
          <Pause className={iconSize} />
        ) : (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <Play className={`${iconSize} ml-0.5`} />
          </motion.div>
        )}
      </motion.button>
      
      <motion.button
        whileHover={!transitionActive ? { scale: 1.05 } : {}}
        whileTap={!transitionActive ? { scale: 0.95 } : {}}
        onClick={!transitionActive ? resetTimer : undefined}
        className={`${resetButtonClass} text-white rounded-full ${buttonSize} flex items-center justify-center transition-all shadow-none backdrop-blur-md`}
        disabled={transitionActive}
      >
        <motion.div
          whileHover={!transitionActive ? { rotate: 180 } : {}}
          transition={{ duration: 0.3 }}
        >
          <RotateCcw className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </div>
  );
};

export default TimerControls; 