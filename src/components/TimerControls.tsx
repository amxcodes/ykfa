import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useTimerContext } from '../context/TimerContext';
import { useEffect, useState } from 'react';

interface TimerControlsProps {
  className?: string;
}

// Define styles as a global CSS module that will be included in the component
const TimerControlsStyles = () => (
  <style>
    {`
      @keyframes ping-slow {
        0% {
          transform: scale(1);
          opacity: 0.1;
        }
        50% {
          opacity: 0.2;
        }
        100% {
          transform: scale(1.5);
          opacity: 0;
        }
      }
      
      .animate-ping-slow {
        animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
      }
      
      .active-play-btn {
        background-color: rgba(245, 158, 11, 0.1);
        border: 1px solid rgba(245, 158, 11, 0.3);
        color: white;
      }
      
      .active-play-btn:hover {
        border: 1px solid rgba(245, 158, 11, 0.5);
      }
      
      .active-pause-btn {
        background-color: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: white;
      }
      
      .active-pause-btn:hover {
        border: 1px solid rgba(239, 68, 68, 0.5);
      }
    `}
  </style>
);

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
      ? 'cursor-not-allowed opacity-70' 
      : isRunning 
        ? 'active-pause-btn' 
        : 'active-play-btn';

  const resetButtonClass = 
    transitionActive 
      ? 'bg-dark-800/40 backdrop-blur-md border border-gray-700/50 opacity-70 cursor-not-allowed' 
      : 'bg-dark-800/40 backdrop-blur-md border border-white/10 hover:border-white/30 hover:bg-dark-700/40';
  
  // Adjust button sizing and container position for better mobile layout
  const buttonSize = isSmallScreen ? 'w-14 h-14' : 'w-16 h-16';
  const iconSize = isSmallScreen ? 'w-6 h-6' : 'w-7 h-7';
  
  return (
    <>
      {/* Include global styles */}
      <TimerControlsStyles />
      
      <div className={`flex justify-center gap-4 py-3 ${className}`}>
        {/* Enhanced play/pause button */}
        <motion.button
          whileHover={!transitionActive ? { scale: 1.05 } : {}}
          whileTap={!transitionActive ? { scale: 0.95 } : {}}
          onClick={!transitionActive ? toggleTimer : undefined}
          className={`${playButtonClass} ${buttonSize} rounded-full flex items-center justify-center shadow-lg transition-all relative overflow-hidden group`}
          disabled={transitionActive}
          style={{
            boxShadow: isRunning 
              ? '0 10px 25px -5px rgba(239, 68, 68, 0.5)' 
              : '0 10px 25px -5px rgba(16, 185, 129, 0.5)'
          }}
        >
          {/* Animated background gradient */}
          <div className={`absolute inset-0 ${isRunning ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-amber-400 to-amber-500'}`}></div>
          
          {/* Shine effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out"></div>
          
          {/* Subtle pulsing ring */}
          <div className={`absolute inset-0 rounded-full animate-ping-slow ${isRunning ? 'bg-red-500/10' : 'bg-amber-400/10'}`}></div>
          
          {/* Icon container */}
          <div className="relative z-10">
            {isRunning ? (
              <Pause className={`${iconSize} text-white`} />
            ) : (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <Play className={`${iconSize} ml-0.5 text-white`} />
              </motion.div>
            )}
          </div>
        </motion.button>
        
        {/* Reset button with improved design */}
        <motion.button
          whileHover={!transitionActive ? { scale: 1.05 } : {}}
          whileTap={!transitionActive ? { scale: 0.95 } : {}}
          onClick={!transitionActive ? resetTimer : undefined}
          className={`${resetButtonClass} text-white rounded-full ${buttonSize} flex items-center justify-center transition-all shadow-lg backdrop-blur-md relative overflow-hidden group`}
          disabled={transitionActive}
        >
          {/* Subtle hover effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out"></div>
          
          <motion.div
            whileHover={!transitionActive ? { rotate: 180 } : {}}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.div>
        </motion.button>
      </div>
    </>
  );
};

export default TimerControls; 