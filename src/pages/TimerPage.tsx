import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '../hooks/useMediaQuery';
import TimerDisplay from '../components/TimerDisplay';
import TimerControls from '../components/TimerControls';
import TimerSettings from '../components/TimerSettings';
import { useTimerContext } from '../context/TimerContext';
import { useEffect, useState } from 'react';
import { CSSProperties } from 'react';

// Phase color definitions with higher quality uneven gradient flow - no textures
const PHASE_GRADIENTS = {
  warmup: 'radial-gradient(circle at 40% 20%, rgba(96, 165, 250, 0.8) 0%, rgba(37, 99, 235, 0.6) 25%, rgba(29, 78, 216, 0.4) 50%, rgba(9, 17, 40, 0.95) 75%, rgba(0, 0, 0, 1) 100%)',
  round: 'radial-gradient(circle at 70% 30%, rgba(245, 158, 11, 0.8) 0%, rgba(217, 119, 6, 0.6) 25%, rgba(180, 83, 9, 0.4) 50%, rgba(9, 17, 40, 0.95) 75%, rgba(0, 0, 0, 1) 100%)',
  break: 'radial-gradient(circle at 30% 40%, rgba(74, 222, 128, 0.8) 0%, rgba(22, 163, 74, 0.6) 25%, rgba(21, 128, 61, 0.4) 50%, rgba(9, 17, 40, 0.95) 75%, rgba(0, 0, 0, 1) 100%)',
  cooldown: 'radial-gradient(circle at 60% 50%, rgba(96, 165, 250, 0.8) 0%, rgba(37, 99, 235, 0.6) 25%, rgba(29, 78, 216, 0.4) 50%, rgba(9, 17, 40, 0.95) 75%, rgba(0, 0, 0, 1) 100%)',
  complete: 'radial-gradient(circle at 50% 30%, rgba(168, 85, 247, 0.8) 0%, rgba(126, 34, 206, 0.6) 25%, rgba(107, 33, 168, 0.4) 50%, rgba(9, 17, 40, 0.95) 75%, rgba(0, 0, 0, 1) 100%)'
};

// Define type for layer
interface GradientLayer {
  gradient: string;
  opacity: number;
  zIndex: number;
}

const TimerPage = () => {
  const { currentPhase, timerMode } = useTimerContext();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  
  // Use two background layers that we'll swap between
  const [bgLayers, setBgLayers] = useState({
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
  
  // Phase change handler with smoother transition
  useEffect(() => {
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
    
  }, [currentPhase]);
  
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

  // Setup mode
  return (
    <div 
      className="min-h-screen pt-16 md:pt-20 pb-20 backdrop-blur-[10px] relative overflow-hidden"
    >
      {/* Gradient background layers */}
      <div style={{
        ...gradientLayerStyle(bgLayers.layer1),
        marginBottom: '-100px',
        height: 'calc(100% + 100px)'
      }} />
      <div style={{
        ...gradientLayerStyle(bgLayers.layer2),
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