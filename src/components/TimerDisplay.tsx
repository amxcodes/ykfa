import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimerContext } from '../context/TimerContext';
import { ChevronRight, Lightbulb, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';

interface TimerDisplayProps {
  className?: string;
  fullscreen?: boolean;
}

// Fitness facts array - you can replace this with an API call if desired
const fitnessFacts = [
  "Drinking water before meals can help you eat fewer calories.",
  "The average person walks about 10,000 steps a day.",
  "Muscle weighs more than fat, making the scale a poor measure of fitness.",
  "Regular exercise can improve cognitive function and memory.",
  "Even a short walk can boost your creativity and problem-solving ability.",
  "A proper warm-up may reduce your risk of injury by up to 50%.",
  "It takes about 12 weeks of consistent training to see significant changes in your body.",
  "Music can improve workout performance by up to 15%.",
  "Exercise boosts your body's production of endorphins, improving your mood.",
  "Rest days are essential - muscles grow during recovery, not during workouts.",
  "Proper form is more important than the amount of weight you lift.",
  "Stretching after workouts can help reduce muscle soreness.",
  "High-intensity interval training (HIIT) can burn more fat in less time.",
  "The average person should aim for 150 minutes of moderate exercise per week.",
  "Strength training helps maintain bone density as you age.",
];

const TimerDisplay = ({ className = '', fullscreen = false }: TimerDisplayProps) => {
  const {
    currentPhase,
    currentRound,
    settings,
    minutes,
    seconds,
    isRunning,
    formatTime,
    calculateProgress,
    calculateRoundProgress,
    exitFullscreen,
    transitionActive
  } = useTimerContext();

  const [windowHeight, setWindowHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const [shouldResetRing, setShouldResetRing] = useState(false);
  const [prevPhase, setPrevPhase] = useState(currentPhase);
  
  const timerRef = useRef<HTMLDivElement>(null);
  const timeDisplayRef = useRef<HTMLDivElement>(null);
  const prevTimeRef = useRef(`${minutes}:${seconds}`);
  
  // Change facts every minute instead of every 10 seconds
  useEffect(() => {
    const factInterval = setInterval(() => {
      setFactIndex(prevIndex => (prevIndex + 1) % fitnessFacts.length);
    }, 60000); // Changed from 10000 to 60000 (1 minute)
    
    return () => clearInterval(factInterval);
  }, []);
  
  // Track phase changes to reset ring animation
  useEffect(() => {
    if (currentPhase !== prevPhase) {
      // Phase has changed, mark for ring reset
      setShouldResetRing(true);
      setPrevPhase(currentPhase);
    }
  }, [currentPhase, prevPhase]);
  
  // Reset the shouldResetRing flag after animation completes
  useEffect(() => {
    if (shouldResetRing) {
      // Reset the flag after a short delay to allow the animation to restart
      const timeout = setTimeout(() => {
        setShouldResetRing(false);
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [shouldResetRing]);
  
  // Get next phase for display in transition
  const getNextPhase = () => {
    if (currentPhase === 'warmup') return 'Round';
    if (currentPhase === 'round' && currentRound < settings.rounds) return 'Break';
    if (currentPhase === 'round' && currentRound >= settings.rounds) return 'Cooldown';
    if (currentPhase === 'break') return `Round ${currentRound + 1}`;
    if (currentPhase === 'cooldown') return 'Complete';
    return '';
  };

  // Track window dimensions for responsive sizing
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

  // GSAP animations for phase transitions
  useEffect(() => {
    if (timerRef.current && transitionActive) {
      gsap.fromTo(
        timerRef.current.querySelector('.timer-circle-primary'),
        { 
          strokeDashoffset: '0',
          stroke: getPhaseColors().gradientEnd
        },
        { 
          strokeDashoffset: '0',
          stroke: getNextPhaseColors().gradientEnd,
          duration: settings.transitionDelay,
          ease: 'power2.inOut'
        }
      );
      
      // Pulse animation
      gsap.to(timerRef.current, {
        scale: 1.05,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      });
    }
  }, [transitionActive, currentPhase, currentRound, settings.transitionDelay]);

  // Subtle fade animation for time display changes
  useEffect(() => {
    const currentTime = `${minutes}:${seconds}`;
    
    // Only animate if the time has changed and we're running
    if (isRunning && prevTimeRef.current !== currentTime && timeDisplayRef.current) {
      // Update without bounce, just a quick opacity shift
      gsap.fromTo(
        timeDisplayRef.current,
        { opacity: 0.8 },
        { opacity: 1, duration: 0.2, ease: 'power1.out' }
      );
    }
    
    prevTimeRef.current = currentTime;
  }, [minutes, seconds, isRunning]);

  // Add pulse animation when changing phases
  useEffect(() => {
    if (timerRef.current) {
      gsap.to(timerRef.current.querySelector('.phase-label'), {
        scale: 1.2,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      });
    }
  }, [currentPhase]);

  // Get colors for the next phase (for transitions)
  const getNextPhaseColors = () => {
    const nextPhaseInfo = getNextPhase().toLowerCase();
    if (nextPhaseInfo.includes('round')) return getPhaseColorByName('round');
    if (nextPhaseInfo.includes('break')) return getPhaseColorByName('break');
    if (nextPhaseInfo.includes('cooldown')) return getPhaseColorByName('cooldown');
    if (nextPhaseInfo.includes('complete')) return getPhaseColorByName('complete');
    return getPhaseColorByName('warmup');
  };

  // Get phase colors by name
  const getPhaseColorByName = (phaseName: string) => {
    switch (phaseName) {
      case 'warmup':
        return { 
          main: '#22d3ee', 
          bg: 'rgba(34, 211, 238, 0.1)',
          text: '#22d3ee',
          glow: 'rgba(34, 211, 238, 0.3)',
          gradientStart: '#22d3ee',
          gradientEnd: '#0891b2',
          id: 'warmupGradient'
        };
      case 'round':
        return { 
          main: '#f59e0b', 
          bg: 'rgba(245, 158, 11, 0.1)',
          text: '#f59e0b',
          glow: 'rgba(245, 158, 11, 0.3)',
          gradientStart: '#f59e0b',
          gradientEnd: '#d97706',
          id: 'roundGradient'
        };
      case 'break':
        return { 
          main: '#4ade80', 
          bg: 'rgba(74, 222, 128, 0.1)',
          text: '#4ade80',
          glow: 'rgba(74, 222, 128, 0.3)',
          gradientStart: '#4ade80',
          gradientEnd: '#16a34a',
          id: 'breakGradient'
        };
      case 'cooldown':
        return { 
          main: '#60a5fa', 
          bg: 'rgba(96, 165, 250, 0.1)',
          text: '#60a5fa',
          glow: 'rgba(96, 165, 250, 0.3)',
          gradientStart: '#60a5fa',
          gradientEnd: '#2563eb',
          id: 'cooldownGradient'
        };
      case 'complete':
        return { 
          main: '#a855f7', 
          bg: 'rgba(168, 85, 247, 0.1)',
          text: '#a855f7',
          glow: 'rgba(168, 85, 247, 0.3)',
          gradientStart: '#a855f7',
          gradientEnd: '#7e22ce',
          id: 'completeGradient'
        };
      default:
        return { 
          main: '#f59e0b', 
          bg: 'rgba(245, 158, 11, 0.1)',
          text: '#f59e0b',
          glow: 'rgba(245, 158, 11, 0.3)',
          gradientStart: '#f59e0b',
          gradientEnd: '#d97706',
          id: 'defaultGradient'
        };
    }
  };

  // Phase colors and animations
  const getPhaseColors = () => {
    switch (currentPhase) {
      case 'warmup':
        return getPhaseColorByName('warmup');
      case 'round':
        return getPhaseColorByName('round');
      case 'break':
        return getPhaseColorByName('break');
      case 'cooldown':
        return getPhaseColorByName('cooldown');
      case 'complete':
        return getPhaseColorByName('complete');
      default:
        return getPhaseColorByName('round');
    }
  };

  const phaseColors = getPhaseColors();
  const totalRounds = settings.rounds;
  const progress = calculateProgress();

  // Dynamic size based on fullscreen mode and dimensions - improved for all screen sizes
  const isSmallScreen = Math.min(windowHeight, windowWidth) < 600;
  const isMediumScreen = Math.min(windowHeight, windowWidth) < 900;
  
  let containerSize, timeSize, labelSize, strokeWidth, progressSize;

  if (fullscreen) {
    if (isSmallScreen) {
      containerSize = "w-[85%] max-w-[300px] mt-16"; 
      timeSize = "text-4xl";
      progressSize = "text-5xl";
      labelSize = "text-sm";
      strokeWidth = 14;
    } else if (isMediumScreen) {
      containerSize = "w-[85%] max-w-[400px] mt-24";
      timeSize = "text-5xl";
      progressSize = "text-6xl";
      labelSize = "text-base";
      strokeWidth = 16;
    } else {
      containerSize = "w-[85%] max-w-[500px] mt-32";
      timeSize = "text-6xl";
      progressSize = "text-7xl";
      labelSize = "text-lg";
      strokeWidth = 20;
    }
  } else {
    containerSize = "w-full max-w-[350px] mt-8";
    timeSize = "text-3xl";
    progressSize = "text-4xl";
    labelSize = "text-sm";
    strokeWidth = 14;
  }

  // Calculate the actual time values to display
  const displayMinutes = minutes.toString().padStart(2, '0');
  const displaySeconds = seconds.toString().padStart(2, '0');
  const displayProgress = Math.round(progress);

  // Get current fact
  const currentFact = fitnessFacts[factIndex];

  return (
    <div className="flex flex-col items-center">
      <div 
        ref={timerRef} 
        className={`relative timer-display ${className} ${containerSize} mx-auto flex flex-col items-center justify-center`}
      >
        <div className="relative aspect-square">
          <svg
            className="w-full h-full -rotate-90"
            viewBox="0 0 100 100"
            style={{ filter: 'drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.3))' }}
          >
            {/* Define all gradients */}
            <defs>
              <linearGradient id="roundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <linearGradient id="warmupGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#0891b2" />
              </linearGradient>
              <linearGradient id="breakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>
              <linearGradient id="cooldownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
              <linearGradient id="completeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#7e22ce" />
              </linearGradient>
              
              {/* Filter for inner shadow (depth effect) */}
              <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                <feOffset dx="0" dy="4" result="offsetBlur" />
                <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
              </filter>
            </defs>
            
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#333333"
              strokeWidth={strokeWidth}
              opacity="0.3"
            />
            
            {/* Progress Ring with Gradient Fill - with key changing to force animation restart */}
            <motion.circle
              key={`circle-${shouldResetRing ? 'reset' : 'normal'}-${currentPhase}`}
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={`url(#${phaseColors.id})`}
              className="timer-circle-primary"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              filter="url(#innerShadow)"
              strokeDasharray={`${2 * Math.PI * 40} ${2 * Math.PI * 40}`}
              initial={{ strokeDashoffset: `${2 * Math.PI * 40}` }}
              animate={{
                strokeDashoffset: `${2 * Math.PI * 40 * (1 - progress / 100)}`,
                transition: { 
                  type: 'spring', 
                  damping: 15,
                  stiffness: 30
                }
              }}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center bg-black rounded-full w-[65%] h-[65%]">
              {/* Progress percentage */}
              <div ref={timeDisplayRef} className={`${progressSize} font-bold text-white`}>
                {displayProgress}<span className="text-lg md:text-xl align-top">%</span>
              </div>
              
              {/* Time value */}
              <div className={`${timeSize} font-medium text-white opacity-90 mt-0`}>
                {displayMinutes}:{displaySeconds}
              </div>
              
              {/* Current phase label */}
              <div className={`${labelSize} font-medium text-white opacity-70 mt-1 phase-label`}>
                {currentPhase === 'round'
                  ? `Round ${currentRound}/${totalRounds}`
                  : currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Glassmorphism Fitness Fact Box */}
      {fullscreen && (
        <AnimatePresence mode="wait">
          <motion.div 
            key={factIndex}
            className="mt-8 px-6 py-4 rounded-xl w-[85%] max-w-md mx-auto 
              backdrop-blur-md bg-white/10 border border-white/20 shadow-lg
              relative overflow-hidden mb-16" // Added bottom margin to make room for buttons
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            {/* Glowing accent */}
            <div 
              className="absolute top-0 left-0 w-full h-1" 
              style={{ 
                background: `linear-gradient(to right, ${phaseColors.gradientStart}, ${phaseColors.gradientEnd})`,
                boxShadow: `0 0 10px ${phaseColors.gradientStart}`
              }}
            />
            
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-white mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-white font-medium mb-1 text-sm">Fitness Tip</h3>
                <p className="text-white/90 text-sm">{currentFact}</p>
                
                <div className="flex items-center justify-end mt-2 text-xs text-white/70">
                  <span>New tip every minute</span>
                  <ArrowRight className="w-3 h-3 ml-1 animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default TimerDisplay; 