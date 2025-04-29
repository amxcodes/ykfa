import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '../hooks/useMediaQuery';
import TimerDisplay from '../components/TimerDisplay';
import TimerControls from '../components/TimerControls';
import TimerSettings from '../components/TimerSettings';
import { useTimerContext } from '../context/TimerContext';

const TimerPage = () => {
  const { currentPhase, timerMode } = useTimerContext();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1,
        when: 'beforeChildren'
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 50, damping: 10 }
    }
  };
  
  // Full-screen running mode
  if (timerMode === 'running') {
    return (
      <AnimatePresence>
        <motion.div 
          key="running-mode"
          className="fixed inset-0 z-[90] pt-16 bg-dark-900/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <TimerDisplay fullscreen className="mb-12" />
          <TimerControls className="relative mt-auto" />
        </motion.div>
      </AnimatePresence>
    );
  }

  // Setup mode
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-950 pt-16 md:pt-20 pb-10">
      <div className="container mx-auto px-4 py-4 md:py-8 h-full">
        <motion.div 
          className="max-w-6xl mx-auto h-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-center text-3xl md:text-4xl font-bold mb-8 text-amber-400"
            variants={itemVariants}
          >
            Workout Timer
          </motion.h1>
          
          {/* Mobile Layout */}
          {isMobile && (
            <div className="flex flex-col items-center gap-8">
              <motion.div
                variants={itemVariants}
                className="w-full"
              >
                <TimerSettings className="mb-8" />
              </motion.div>
            </div>
          )}

          {/* Tablet Layout */}
          {isTablet && (
            <div className="flex flex-col items-center gap-8">
              <motion.div
                variants={itemVariants}
                className="w-full max-w-[600px]"
              >
                <TimerSettings className="mb-8" />
              </motion.div>
            </div>
          )}

          {/* Desktop Layout */}
          {!isMobile && !isTablet && (
            <div className="grid grid-cols-1 max-w-[700px] mx-auto">
              <motion.div
                variants={itemVariants}
              >
                <TimerSettings />
              </motion.div>
            </div>
          )}

          {/* Completion Overlay */}
          {currentPhase === 'complete' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 pt-16 bg-black/70 backdrop-blur-sm z-[95] flex items-center justify-center"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 90 }}
                className="bg-dark-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-purple-400">
                  Workout Complete!
                </h2>
                <p className="text-gray-300 mb-6 text-center">
                  Great job! You've successfully completed your workout session.
                </p>
                <TimerControls className="justify-center" />
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TimerPage;