import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useTimerContext } from '../context/TimerContext';
import { useEffect, useState } from 'react';

interface TimerControlsProps {
  className?: string;
}

const TimerControls = ({ className = '' }: TimerControlsProps) => {
  const { isRunning, toggleTimer, resetTimer, timerMode, transitionActive } = useTimerContext();
  const [windowHeight, setWindowHeight] = useState(0);
  
  // Track window height for sizing adjustments
  useEffect(() => {
    const updateWindowHeight = () => {
      setWindowHeight(window.innerHeight);
    };
    
    updateWindowHeight();
    window.addEventListener('resize', updateWindowHeight);
    
    return () => {
      window.removeEventListener('resize', updateWindowHeight);
    };
  }, []);

  // Adjust button sizes based on screen height and timer mode
  const isSmallScreen = windowHeight < 700;
  
  // Determine button styles based on timer mode, screen size, and states
  const playButtonClass = 
    transitionActive 
      ? 'bg-gray-500 cursor-not-allowed opacity-70' 
      : timerMode === 'running'
        ? isRunning 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-green-500 hover:bg-green-600'
        : isRunning 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-green-500 hover:bg-green-600';

  const resetButtonClass = 
    transitionActive 
      ? 'bg-transparent border-2 border-gray-600 opacity-70 cursor-not-allowed' 
      : 'bg-transparent border-2 border-gray-600 hover:border-white';

  const buttonSize = timerMode === 'running'
    ? isSmallScreen ? 'w-14 h-14' : 'w-16 h-16'
    : 'w-14 h-14';
    
  const iconSize = timerMode === 'running'
    ? isSmallScreen ? 'w-7 h-7' : 'w-8 h-8'
    : 'w-7 h-7';
  
  // Calculate container position
  const positionClass = timerMode === 'running'
    ? 'absolute bottom-16 left-0 right-0 mx-auto' // Moved up from bottom
    : '';
  
  return (
    <div className={`flex gap-4 justify-center ${positionClass} ${className}`}>
      <motion.button
        whileHover={!transitionActive ? { scale: 1.05 } : {}}
        whileTap={!transitionActive ? { scale: 0.95 } : {}}
        onClick={!transitionActive ? toggleTimer : undefined}
        className={`${playButtonClass} ${buttonSize} text-white rounded-full flex items-center justify-center shadow-md border-none transition-all`}
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
        className={`${resetButtonClass} text-white rounded-full ${buttonSize} flex items-center justify-center transition-all`}
        disabled={transitionActive}
      >
        <motion.div
          whileHover={!transitionActive ? { rotate: 180 } : {}}
          transition={{ duration: 0.3 }}
        >
          <RotateCcw className={isSmallScreen ? 'w-6 h-6' : 'w-7 h-7'} />
        </motion.div>
      </motion.button>
    </div>
  );
};

export default TimerControls; 