import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '../hooks/useMediaQuery';
import TimerDisplay from '../components/TimerDisplay';
import TimerControls from '../components/TimerControls';
import TimerSettings from '../components/TimerSettings';
import { useTimerContext } from '../context/TimerContext';
import { useEffect, useState } from 'react';
import { CSSProperties } from 'react';
import { Timer, Activity, BadgeCheck } from 'lucide-react';

// Phase color definitions with higher quality uneven gradient flow - no textures
const PHASE_GRADIENTS = {
  warmup: 'radial-gradient(circle at 40% 20%, rgba(96, 165, 250, 0.8) 0%, rgba(37, 99, 235, 0.6) 25%, rgba(29, 78, 216, 0.4) 50%, rgba(9, 17, 40, 0.95) 75%, rgba(0, 0, 0, 1) 100%)',
  round: 'radial-gradient(circle at 70% 30%, rgba(245, 158, 11, 0.8) 0%, rgba(217, 119, 6, 0.6) 25%, rgba(180, 83, 9, 0.4) 50%, rgba(9, 17, 40, 0.95) 75%, rgba(0, 0, 0, 1) 100%)',
  break: 'radial-gradient(circle at 30% 40%, rgba(74, 222, 128, 0.8) 0%, rgba(22, 163, 74, 0.6) 25%, rgba(21, 128, 61, 0.4) 50%, rgba(9, 17, 40, 0.95) 75%, rgba(0, 0, 0, 1) 100%)',
  cooldown: 'radial-gradient(circle at 60% 50%, rgba(96, 165, 250, 0.8) 0%, rgba(37, 99, 235, 0.6) 25%, rgba(29, 78, 216, 0.4) 50%, rgba(9, 17, 40, 0.95) 75%, rgba(0, 0, 0, 1) 100%)',
  complete: 'radial-gradient(circle at 50% 30%, rgba(168, 85, 247, 0.8) 0%, rgba(126, 34, 206, 0.6) 25%, rgba(107, 33, 168, 0.4) 50%, rgba(9, 17, 40, 0.95) 75%, rgba(0, 0, 0, 1) 100%)'
};

// Settings mode gradient - yellow and black
const SETTINGS_GRADIENT = 'radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.8) 0%, rgba(217, 119, 6, 0.6) 35%, rgba(180, 83, 9, 0.4) 60%, rgba(9, 17, 40, 0.95) 85%, rgba(0, 0, 0, 1) 100%)';

// Define type for layer
interface GradientLayer {
  gradient: string;
  opacity: number;
  zIndex: number;
}

// App loading component
const TimerAppLoading = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isAppReady, setIsAppReady] = useState(false);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [features, setFeatures] = useState<{icon: JSX.Element, text: string, loaded: boolean}[]>([
    { 
      icon: <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />, 
      text: "Initializing timer core", 
      loaded: false 
    },
    { 
      icon: <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />, 
      text: "Loading workout profiles", 
      loaded: false 
    },
    { 
      icon: <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />, 
      text: "Ready to train!", 
      loaded: false 
    }
  ]);

  useEffect(() => {
    // Simulate loading sequence for each feature
    features.forEach((_, index) => {
      // Adjust timing to be slightly faster on mobile for better UX
      const baseDelay = isMobile ? 200 : 250;
      const itemDelay = isMobile ? 250 : 300;
      const delay = baseDelay + (index * itemDelay);
      
      setTimeout(() => {
        setFeatures(prev => {
          const newFeatures = [...prev];
          newFeatures[index].loaded = true;
          return newFeatures;
        });
        
        // Update progress percentage based on completed features
        setProgress(((index + 1) / features.length) * 100);
        
        // When all features are loaded
        if (index === features.length - 1) {
          setTimeout(() => {
            setIsAppReady(true);
            setTimeout(onComplete, isMobile ? 400 : 500); // Faster completion on mobile
          }, isMobile ? 300 : 400);
        }
      }, delay);
    });
  }, [isMobile]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black px-4"
      initial={{ opacity: 1 }}
      animate={{ opacity: isAppReady ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Decorative background elements - smaller on mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* App logo - smaller on mobile */}
      <motion.div 
        className="relative flex items-center justify-center mb-8 sm:mb-12 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Timer className="w-10 h-10 sm:w-12 sm:h-12 text-black" />
      </motion.div>
      
      {/* App name - adjusted text size for mobile */}
      <motion.h1
        className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        Yaseen's <span className="text-amber-400">Workout Timer</span>
      </motion.h1>
      
      {/* Loading progress bar - fluid width on mobile */}
      <motion.div 
        className="w-full max-w-xs sm:max-w-sm h-1.5 bg-dark-700 rounded-full overflow-hidden mb-6 sm:mb-8 relative"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "100%", opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full absolute left-0 top-0"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        ></motion.div>
      </motion.div>

      {/* Loading features list - adjusted for mobile */}
      <div className="space-y-2 sm:space-y-3 w-full max-w-xs sm:max-w-sm">
        {features.map((feature, index) => (
          <motion.div 
            key={index}
            className="flex items-center space-x-2 sm:space-x-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ 
              opacity: feature.loaded ? 1 : 0.4, 
              x: 0 
            }}
            transition={{ duration: 0.2, delay: 0.3 + (index * 0.05) }}
          >
            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors ${feature.loaded ? 'bg-amber-500/20' : 'bg-gray-800'}`}>
              {feature.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm text-gray-300 truncate">{feature.text}</div>
              {index !== features.length - 1 && (
                <div className="h-0.5 bg-dark-700 mt-1 relative overflow-hidden">
                  {feature.loaded && (
                    <motion.div 
                      className="absolute inset-y-0 left-0 bg-amber-500/40"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                  )}
                </div>
              )}
            </div>
            {feature.loaded && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0"
              >
                <BadgeCheck className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Ready message when all features loaded - adjusted for mobile */}
      <motion.div
        className="mt-6 sm:mt-8 text-amber-400 text-sm sm:text-base font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isAppReady ? 1 : 0, y: isAppReady ? 0 : 10 }}
        transition={{ duration: 0.3 }}
      >
        Your workout session is ready!
      </motion.div>
    </motion.div>
  );
};

const TimerPage = () => {
  const { currentPhase, timerMode } = useTimerContext();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const [isLoading, setIsLoading] = useState(true);

  // Use two background layers that we'll swap between
  const [bgLayers, setBgLayers] = useState({
    layer1: {
      gradient: timerMode === 'running' ? PHASE_GRADIENTS[currentPhase] : SETTINGS_GRADIENT,
      opacity: 1,
      zIndex: 1
    },
    layer2: {
      gradient: timerMode === 'running' ? PHASE_GRADIENTS[currentPhase] : SETTINGS_GRADIENT,
      opacity: 0,
      zIndex: 0
    }
  });

  // Update gradient when timer mode changes
  useEffect(() => {
    // If we're not in running mode, use the settings gradient
    if (timerMode !== 'running') {
      setBgLayers({
        layer1: {
          gradient: SETTINGS_GRADIENT,
          opacity: 1,
          zIndex: 1
        },
        layer2: {
          gradient: SETTINGS_GRADIENT,
          opacity: 0,
          zIndex: 0
        }
      });
    } else {
      // When starting the timer, set to the current phase gradient
      setBgLayers({
        layer1: {
          gradient: PHASE_GRADIENTS[currentPhase],
          opacity: 1,
          zIndex: 1
        },
        layer2: {
          gradient: PHASE_GRADIENTS[currentPhase],
          opacity: 0,
          zIndex: 0
        }
      });
    }
  }, [timerMode]);

  // Phase change handler with smoother transition (only used when timer is running)
  useEffect(() => {
    // Only update gradients while timer is running
    if (timerMode !== 'running') return;
    
    // Get current gradient for this phase
    const targetGradient = PHASE_GRADIENTS[currentPhase];
    
    // Determine which layer is currently visible
    const activeLayer = bgLayers.layer1.opacity === 1 ? 'layer1' : 'layer2';
    const inactiveLayer = activeLayer === 'layer1' ? 'layer2' : 'layer1';
    
    // Set the new gradient on the inactive layer
    setBgLayers(prev => ({
      ...prev,
      [inactiveLayer]: {
        ...prev[inactiveLayer],
        gradient: targetGradient,
        zIndex: 2, // Put this on top for the transition
      }
    }));
    
    // Give the DOM time to update before starting the transition
    setTimeout(() => {
      // Fade in the inactive layer with the new gradient
      setBgLayers(prev => ({
        ...prev,
        [inactiveLayer]: {
          ...prev[inactiveLayer],
          opacity: 1
        },
        [activeLayer]: {
          ...prev[activeLayer],
          opacity: 0
        }
      }));
    }, 50);
    
    // After transition completes, reset z-indices for next change
    const transitionDuration = 3000; // 3 seconds for a slower, smoother transition
    setTimeout(() => {
      setBgLayers(prev => ({
        ...prev,
        [activeLayer]: {
          ...prev[activeLayer],
          zIndex: 0
        },
        [inactiveLayer]: {
          ...prev[inactiveLayer],
          zIndex: 1
    }
      }));
    }, transitionDuration);
    
  }, [currentPhase, timerMode]);
  
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

  // CSS for the gradient layers - no texture overlay
  const gradientLayerStyle = (layer: GradientLayer): CSSProperties => ({
    position: 'absolute',
    inset: 0,
    background: layer.gradient,
    opacity: layer.opacity,
    zIndex: layer.zIndex,
    transition: 'opacity 3s ease-in-out',
  });
  
  // Add a subtle vignette effect
  const vignetteStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)',
    opacity: 0.7,
    pointerEvents: 'none',
    zIndex: 2,
  };

  // Handle loading complete
  const handleLoadingComplete = () => {
    // Scroll to top of page
    window.scrollTo(0, 0);
    setIsLoading(false);
  };
  
  // Show app loading screen
  if (isLoading) {
    return <TimerAppLoading onComplete={handleLoadingComplete} />;
  }
  
  // Full-screen running mode
  if (timerMode === 'running') {
  return (
      <AnimatePresence>
        <motion.div 
          key="running-mode"
          className="fixed inset-0 z-[90] backdrop-blur-[15px] pt-24 sm:pt-16 md:pt-12 pb-64 sm:pb-48 md:pb-36 flex flex-col items-center justify-center overflow-hidden"
          style={{ position: 'relative' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Gradient background layers - extended extremely far for mobile */}
          <div style={{
            ...gradientLayerStyle(bgLayers.layer1),
            marginBottom: '-400px',
            height: 'calc(100% + 400px)'
          }} />
          <div style={{
            ...gradientLayerStyle(bgLayers.layer2),
            marginBottom: '-400px',
            height: 'calc(100% + 400px)'
          }} />

          {/* Visual enhancement - vignette only, no texture */}
          <div style={{
            ...vignetteStyle,
            marginBottom: '-400px',
            height: 'calc(100% + 400px)'
          }} />
          
          {/* Content - Push down on mobile with better spacing */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center mt-28 sm:mt-16 md:mt-0 mb-16 sm:mb-10 md:mb-0">
            <TimerDisplay fullscreen />
                </div>

          {/* Controls - High position on mobile/tablet, original position on desktop */}
          <div className="fixed bottom-64 sm:bottom-52 md:bottom-16 left-0 right-0 z-20">
            <TimerControls />
              </div>
            </motion.div>
      </AnimatePresence>
    );
  }

  // Setup mode with yellow and black gradient
  return (
    <div 
      className="min-h-screen pt-16 md:pt-20 pb-20 backdrop-blur-[10px] relative overflow-hidden"
    >
      {/* Settings mode: Fixed yellow and black gradient background */}
      <div className="absolute inset-0 z-0" style={{
        background: SETTINGS_GRADIENT,
        marginBottom: '-100px',
        height: 'calc(100% + 100px)'
      }} />
      
      {/* Visual enhancement - vignette only, no texture */}
      <div style={{
        ...vignetteStyle,
        marginBottom: '-100px',
        height: 'calc(100% + 100px)'
      }} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-4 md:py-8 h-full">
            <motion.div
            className="max-w-6xl mx-auto h-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
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
                className="fixed inset-0 pt-16 backdrop-blur-[15px] bg-black/50 z-[95] flex items-center justify-center"
              >
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 90 }}
                  className="bg-dark-800/70 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-md mx-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-purple-400">
                    Workout Complete!
                  </h2>
                  <p className="text-gray-300 mb-6 text-center">
                    Great job! You've successfully completed your workout session.
                  </p>
                  
                  {/* Controls in modal */}
                  <div className="py-2">
                    <TimerControls className="justify-center" />
              </div>
                </motion.div>
              </motion.div>
            )}
            </motion.div>
          </div>
      </div>
    </div>
  );
};

export default TimerPage;