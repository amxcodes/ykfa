import { createContext, useState, useContext, ReactNode, useCallback, useEffect, useRef } from 'react';
import { useTimer } from 'react-timer-hook';
import gsap from 'gsap';

export interface TimerSettings {
  warmupDuration: number;
  rounds: number;
  roundDuration: number;
  breakDuration: number;
  cooldownDuration: number;
  autoStart: boolean;
  transitionDelay: number;
  soundVolume: number;
}

export type TimerPhase = 'warmup' | 'round' | 'break' | 'cooldown' | 'complete';
export type TimerLayer = 'primary' | 'secondary' | 'tertiary';
export type TimerMode = 'setup' | 'running';

interface TimerContextProps {
  settings: TimerSettings;
  currentPhase: TimerPhase;
  currentRound: number;
  isPaused: boolean;
  seconds: number;
  minutes: number;
  isRunning: boolean;
  activeLayer: TimerLayer;
  timerMode: TimerMode;
  transitionActive: boolean;
  formatTime: (m: number, s: number) => string;
  calculateProgress: () => number;
  calculateRoundProgress: () => number;
  calculateWorkoutProgress: () => number;
  updateSettings: (key: keyof TimerSettings, value: number | boolean) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  setTimerMode: (mode: TimerMode) => void;
  exitFullscreen: () => void;
  backgroundGradient: string;
}

const defaultSettings: TimerSettings = {
  warmupDuration: 120,
  rounds: 7,
  roundDuration: 180,
  breakDuration: 45,
  cooldownDuration: 120,
  autoStart: true,
  transitionDelay: 3,
  soundVolume: 0.5,
};

export const TimerContext = createContext<TimerContextProps | undefined>(undefined);

// Sound URLs from free online libraries
const SOUND_URLS = {
  start: '/sounds/start.mp3', // Local start sound
  stop: '/sounds/stop.mp3',  // Local stop sound
  round: '/sounds/round.mp3', // Local round sound
  complete: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3', // Game experience level increased
  countdown: 'https://assets.mixkit.co/active_storage/sfx/254/254-preview.mp3', // Mixkit Click Tone
  // Round announcement sounds
  roundOne: '/sounds/round one.mp3', // Local round one sound
  nextRound: '/sounds/next round.mp3', // Local next round sound
  lastRound: '/sounds/next round.mp3', // Local last round sound
  finalRound: '/sounds/LAST ROUND.mp3', // Using last round for final round too
  // Phase announcement sounds
  warmup: '/sounds/warm up.mp3', // Local warm up announcement
  cooldown: '/sounds/cool down.mp3', // Local cool down announcement
  // Ambient background sound
  ambient: 'https://assets.mixkit.co/active_storage/sfx/2466/2466-preview.mp3' // Medium speed heartbeat for background
};

// Add phase color constants for the background gradients
const PHASE_COLORS = {
  warmup: {
    primary: '#4299e1',   // blue-500
    secondary: '#90cdf4', // blue-300
    gradient: 'linear-gradient(120deg, rgba(66, 153, 225, 0.6) 0%, rgba(144, 205, 244, 0.3) 100%)'
  },
  round: {
    primary: '#ed8936',   // orange-500
    secondary: '#fbd38d', // orange-300
    gradient: 'linear-gradient(120deg, rgba(237, 137, 54, 0.6) 0%, rgba(251, 211, 141, 0.3) 100%)'
  },
  break: {
    primary: '#48bb78',   // green-500
    secondary: '#9ae6b4', // green-300
    gradient: 'linear-gradient(120deg, rgba(72, 187, 120, 0.6) 0%, rgba(154, 230, 180, 0.3) 100%)'
  },
  cooldown: {
    primary: '#667eea',   // indigo-500
    secondary: '#c3dafe', // indigo-300
    gradient: 'linear-gradient(120deg, rgba(102, 126, 234, 0.6) 0%, rgba(195, 218, 254, 0.3) 100%)'
  },
  complete: {
    primary: '#9f7aea',   // purple-500
    secondary: '#d6bcfa', // purple-300
    gradient: 'linear-gradient(120deg, rgba(159, 122, 234, 0.6) 0%, rgba(214, 188, 250, 0.3) 100%)'
  }
};

export function TimerProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<TimerSettings>(defaultSettings);
  const [currentPhase, setCurrentPhase] = useState<TimerPhase>('warmup');
  const [currentRound, setCurrentRound] = useState(1);
  const [isPaused, setIsPaused] = useState(true);
  const [activeLayer, setActiveLayer] = useState<TimerLayer>('primary');
  const [timerMode, setTimerMode] = useState<TimerMode>('setup');
  const [transitionActive, setTransitionActive] = useState(false);
  // Add state for background gradient
  const [backgroundGradient, setBackgroundGradient] = useState(PHASE_COLORS.warmup.gradient);
  
  const isInPhaseTransition = useRef(false);
  const transitionTimeout = useRef<number | null>(null);

  // Audio elements for sounds
  const startSoundRef = useRef<HTMLAudioElement | null>(null);
  const stopSoundRef = useRef<HTMLAudioElement | null>(null);
  const roundChangeSoundRef = useRef<HTMLAudioElement | null>(null);
  const completeSoundRef = useRef<HTMLAudioElement | null>(null);
  const countdownSoundRef = useRef<HTMLAudioElement | null>(null);
  // Round announcement audio elements
  const roundOneSoundRef = useRef<HTMLAudioElement | null>(null);
  const nextRoundSoundRef = useRef<HTMLAudioElement | null>(null);
  const lastRoundSoundRef = useRef<HTMLAudioElement | null>(null);
  const finalRoundSoundRef = useRef<HTMLAudioElement | null>(null);
  // Phase announcement audio elements
  const warmupSoundRef = useRef<HTMLAudioElement | null>(null);
  const cooldownSoundRef = useRef<HTMLAudioElement | null>(null);
  // Ambient sound for continuous play
  const ambientSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio elements
  useEffect(() => {
    startSoundRef.current = new Audio(SOUND_URLS.start);
    stopSoundRef.current = new Audio(SOUND_URLS.stop);
    roundChangeSoundRef.current = new Audio(SOUND_URLS.round);
    completeSoundRef.current = new Audio(SOUND_URLS.complete);
    countdownSoundRef.current = new Audio(SOUND_URLS.countdown);
    // Initialize round announcement audio
    roundOneSoundRef.current = new Audio(SOUND_URLS.roundOne);
    nextRoundSoundRef.current = new Audio(SOUND_URLS.nextRound);
    lastRoundSoundRef.current = new Audio(SOUND_URLS.lastRound);
    finalRoundSoundRef.current = new Audio(SOUND_URLS.finalRound);
    // Initialize phase announcement audio
    warmupSoundRef.current = new Audio(SOUND_URLS.warmup);
    cooldownSoundRef.current = new Audio(SOUND_URLS.cooldown);
    // Initialize ambient sound with looping enabled
    ambientSoundRef.current = new Audio(SOUND_URLS.ambient);
    if (ambientSoundRef.current) {
      ambientSoundRef.current.loop = true;
      ambientSoundRef.current.volume = settings.soundVolume * 0.3; // Lower volume for ambient sound
    }
    
    // Set volume for all sounds
    [
      startSoundRef, stopSoundRef, roundChangeSoundRef, completeSoundRef, countdownSoundRef,
      roundOneSoundRef, nextRoundSoundRef, lastRoundSoundRef, finalRoundSoundRef,
      warmupSoundRef, cooldownSoundRef
    ].forEach(ref => {
      if (ref.current) {
        ref.current.volume = settings.soundVolume;
      }
    });
    
    // Cleanup
    return () => {
      [
        startSoundRef, stopSoundRef, roundChangeSoundRef, completeSoundRef, countdownSoundRef,
        roundOneSoundRef, nextRoundSoundRef, lastRoundSoundRef, finalRoundSoundRef,
        warmupSoundRef, cooldownSoundRef, ambientSoundRef
      ].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current.currentTime = 0;
        }
      });
    };
  }, []);
  
  // Update sound volume when settings change
  useEffect(() => {
    [
      startSoundRef, stopSoundRef, roundChangeSoundRef, completeSoundRef, countdownSoundRef,
      roundOneSoundRef, nextRoundSoundRef, lastRoundSoundRef, finalRoundSoundRef,
      warmupSoundRef, cooldownSoundRef
    ].forEach(ref => {
      if (ref.current) {
        ref.current.volume = settings.soundVolume;
      }
    });
    
    // Ambient sound at lower volume
    if (ambientSoundRef.current) {
      ambientSoundRef.current.volume = settings.soundVolume * 0.3;
    }
  }, [settings.soundVolume]);
  
  // Sound player functions
  const playSound = useCallback((soundRef: React.RefObject<HTMLAudioElement>) => {
    if (soundRef.current) {
      // Reset the sound to the beginning
      soundRef.current.pause();
      soundRef.current.currentTime = 0;
      
      // Play the sound
      soundRef.current.play().catch(error => {
        console.log('Error playing sound:', error);
      });
    }
  }, []);
  
  const playStartSound = useCallback(() => playSound(startSoundRef), [playSound]);
  const playStopSound = useCallback(() => playSound(stopSoundRef), [playSound]);
  const playRoundChangeSound = useCallback(() => playSound(roundChangeSoundRef), [playSound]);
  const playCompleteSound = useCallback(() => playSound(completeSoundRef), [playSound]);
  const playCountdownSound = useCallback(() => playSound(countdownSoundRef), [playSound]);
  const playRoundOneSound = useCallback(() => playSound(roundOneSoundRef), [playSound]);
  const playNextRoundSound = useCallback(() => playSound(nextRoundSoundRef), [playSound]);
  const playLastRoundSound = useCallback(() => playSound(lastRoundSoundRef), [playSound]);
  const playFinalRoundSound = useCallback(() => playSound(finalRoundSoundRef), [playSound]);
  const playWarmupSound = useCallback(() => playSound(warmupSoundRef), [playSound]);
  const playCooldownSound = useCallback(() => playSound(cooldownSoundRef), [playSound]);

  const getExpiryTimestamp = useCallback((seconds: number) => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + seconds);
    return time;
  }, []);

  const getCurrentPhaseDuration = useCallback(() => {
    switch (currentPhase) {
      case 'warmup':
        return settings.warmupDuration;
      case 'round':
        return settings.roundDuration;
      case 'break':
        return settings.breakDuration;
      case 'cooldown':
        return settings.cooldownDuration;
      default:
        return 0;
    }
  }, [currentPhase, settings]);

  const getNextPhaseInfo = useCallback(() => {
    switch (currentPhase) {
      case 'warmup':
        return { phase: 'round' as TimerPhase, round: 1 };
      case 'round':
        if (currentRound < settings.rounds) {
          return { phase: 'break' as TimerPhase, round: currentRound };
        } else {
          return { phase: 'cooldown' as TimerPhase, round: currentRound };
        }
      case 'break':
        return { phase: 'round' as TimerPhase, round: currentRound + 1 };
      case 'cooldown':
        return { phase: 'complete' as TimerPhase, round: currentRound };
      default:
        return { phase: 'warmup' as TimerPhase, round: 1 };
    }
  }, [currentPhase, currentRound, settings.rounds]);

  // Update background gradient when phase changes
  useEffect(() => {
    // Update gradient based on current phase
    setBackgroundGradient(PHASE_COLORS[currentPhase].gradient);
    
    // Apply the gradient to the body
    document.body.style.background = backgroundGradient;
    
    // Cleanup
    return () => {
      document.body.style.background = '';
    };
  }, [currentPhase, backgroundGradient]);

  const animatePhaseChange = useCallback(() => {
    const timeline = gsap.timeline();
    
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    
    // Add animation for background gradient
    gsap.to('body', {
      background: PHASE_COLORS[currentPhase].gradient,
      duration: 1.2,
      ease: 'power2.inOut'
    });
    
    timeline.to('.timer-display', {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out',
      opacity: 0.9,
    });
    
    timeline.to('.timer-background', {
      backgroundColor: `rgba(${currentPhase === 'round' ? '237, 137, 54' : 
                             currentPhase === 'break' ? '72, 187, 120' : 
                             currentPhase === 'cooldown' ? '102, 126, 234' : 
                             currentPhase === 'complete' ? '159, 122, 234' : '66, 153, 225'}, 0.15)`,
      duration: 0.2,
      ease: 'power1.inOut',
    }, '<');
    
    timeline.to('.phase-label', {
      y: -10,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
    }, '<');
    
    timeline.to('.timer-display', {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.in',
    });
    
    timeline.to('.timer-background', {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      duration: 0.3,
      ease: 'power1.inOut',
    }, '<');
    
    timeline.to('.phase-label', {
      y: 0,
      opacity: 1,
      duration: 0.25,
      ease: 'power2.out',
      delay: 0.1,
    });
    
    return timeline;
  }, [currentPhase]);

  const handlePhaseComplete = useCallback(() => {
    setTransitionActive(true);
    isInPhaseTransition.current = true;
    
    const { phase: nextPhase, round: nextRound } = getNextPhaseInfo();
    
    if (nextPhase === 'complete') {
      const completionTimeline = gsap.timeline();
      completionTimeline.to('.timer-display', {
        scale: 1.1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
        opacity: 1,
      });
      
      if (navigator.vibrate) {
        navigator.vibrate([100, 100, 100, 100, 200]);
      }
      
      setCurrentPhase('complete');
      setIsPaused(true);
      playCompleteSound(); // Play completion sound
      setTransitionActive(false);
      isInPhaseTransition.current = false;
      return;
    }
    
    // Handle different phase transitions with appropriate sounds
    if (nextPhase === 'round') {
      // Play only the round announcement sound without any other sounds
      if (nextRound === 1) {
        // First round starting after warmup
        playRoundOneSound();
      } else if (nextRound === settings.rounds) {
        // Last round
        playFinalRoundSound();
      } else if (nextRound === settings.rounds - 1) {
        // Second to last round
        playLastRoundSound();
      } else {
        // Other rounds
        playNextRoundSound();
      }
      
      // Add a delay to let the announcement play before visual changes
      setTimeout(() => {
        animatePhaseChange();
      }, 1000);
    } else if (nextPhase === 'warmup') {
      // Play warmup announcement
      playWarmupSound();
      
      // Add a delay to let the announcement play before visual changes
      setTimeout(() => {
        animatePhaseChange();
      }, 1000);
    } else if (nextPhase === 'cooldown') {
      // Play cooldown announcement
      playCooldownSound();
      
      // Add a delay to let the announcement play before visual changes
      setTimeout(() => {
        animatePhaseChange();
      }, 1000);
    } else {
      // For non-announced transitions (like break), play the standard round change sound
      playRoundChangeSound();
      animatePhaseChange();
    }
    
    if (transitionTimeout.current) {
      clearTimeout(transitionTimeout.current);
    }
    
    // Only play countdown sound if we're not in an announced phase
    if (nextPhase !== 'round' && nextPhase !== 'warmup' && nextPhase !== 'cooldown') {
      playCountdownSound();
    }
    
    // Set longer delay for announcement phases to ensure they complete playing
    const transitionDelayMs = settings.transitionDelay * 1000;
    const needsExtraDelay = (nextPhase === 'round' || nextPhase === 'warmup' || nextPhase === 'cooldown');
    const extraDelayForAnnouncement = needsExtraDelay ? 1500 : 0;
    
    transitionTimeout.current = setTimeout(() => {
      setCurrentPhase(nextPhase);
      setCurrentRound(nextRound);
      
      restart(getExpiryTimestamp(
        nextPhase === 'round' ? settings.roundDuration :
        nextPhase === 'break' ? settings.breakDuration :
        nextPhase === 'cooldown' ? settings.cooldownDuration :
        nextPhase === 'warmup' ? settings.warmupDuration : 0
      ), settings.autoStart);
      
      setTransitionActive(false);
      isInPhaseTransition.current = false;
      
      if (settings.autoStart) {
        setIsPaused(false);
        // Don't play start sound for announced transitions to avoid interrupting announcements
        if (nextPhase !== 'round' && nextPhase !== 'warmup' && nextPhase !== 'cooldown') {
          playStartSound();
        }
      } else {
        setIsPaused(true);
      }
    }, transitionDelayMs + extraDelayForAnnouncement);
    
  }, [
    currentPhase, currentRound, settings, 
    playRoundChangeSound, playCompleteSound, playCountdownSound, 
    playRoundOneSound, playNextRoundSound, playLastRoundSound, playFinalRoundSound,
    playWarmupSound, playCooldownSound,
    getNextPhaseInfo, animatePhaseChange, getExpiryTimestamp, playStartSound
  ]);

  const {
    seconds,
    minutes,
    isRunning,
    start,
    pause,
    restart
  } = useTimer({
    expiryTimestamp: getExpiryTimestamp(settings.warmupDuration),
    onExpire: handlePhaseComplete,
    autoStart: false
  });

  // Control ambient sound based on timer running state - now added after timer declaration
  useEffect(() => {
    // Play ambient sound when timer is running and not paused or in transition
    if (isRunning && !isPaused && !transitionActive && timerMode === 'running') {
      if (ambientSoundRef.current) {
        ambientSoundRef.current.play().catch(error => {
          console.log('Error playing ambient sound:', error);
        });
      }
    } else {
      // Pause ambient sound when timer is paused or in transition
      if (ambientSoundRef.current) {
        ambientSoundRef.current.pause();
      }
    }
  }, [isRunning, isPaused, transitionActive, timerMode]);

  useEffect(() => {
    if (!isRunning && !transitionActive) {
      restart(getExpiryTimestamp(getCurrentPhaseDuration()), false);
    }
  }, [settings, getCurrentPhaseDuration, getExpiryTimestamp, isRunning, restart, transitionActive]);

  useEffect(() => {
    return () => {
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current);
      }
    };
  }, []);

  const formatTime = useCallback((m: number, s: number): string => {
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

  const calculateProgress = useCallback(() => {
    const totalSeconds = minutes * 60 + seconds;
    const totalTime = getCurrentPhaseDuration();
    return totalTime > 0 ? ((totalTime - totalSeconds) / totalTime) * 100 : 0;
  }, [minutes, seconds, getCurrentPhaseDuration]);

  const calculateRoundProgress = useCallback(() => {
    return settings.rounds > 0 ? ((currentRound - 1) / settings.rounds) * 100 : 0;
  }, [currentRound, settings.rounds]);

  const calculateWorkoutProgress = useCallback(() => {
    const totalWorkoutTime = 
      settings.warmupDuration + 
      (settings.roundDuration * settings.rounds) + 
      (settings.breakDuration * (settings.rounds - 1)) + 
      settings.cooldownDuration;
    
    let elapsedTime = 0;
    
    if (currentPhase === 'round' || currentPhase === 'break' || currentPhase === 'cooldown' || currentPhase === 'complete') {
      elapsedTime += settings.warmupDuration;
    }
    
    if (currentPhase === 'break' || currentPhase === 'cooldown' || currentPhase === 'complete') {
      elapsedTime += settings.roundDuration * (currentRound - 1 > 0 ? currentRound - 1 : 0);
    }
    
    if (currentPhase === 'round' && currentRound > 1) {
      elapsedTime += settings.breakDuration * (currentRound - 1);
    } else if ((currentPhase === 'cooldown' || currentPhase === 'complete')) {
      elapsedTime += settings.breakDuration * (settings.rounds - 1);
    }
    
    if (currentPhase === 'complete') {
      elapsedTime += settings.cooldownDuration;
    }
    
    const currentPhaseDuration = getCurrentPhaseDuration();
    const currentPhaseElapsed = currentPhaseDuration - (minutes * 60 + seconds);
    elapsedTime += currentPhaseElapsed;
    
    return totalWorkoutTime > 0 ? (elapsedTime / totalWorkoutTime) * 100 : 0;
  }, [currentPhase, currentRound, minutes, seconds, settings, getCurrentPhaseDuration]);

  const resetTimer = useCallback(() => {
    if (transitionTimeout.current) {
      clearTimeout(transitionTimeout.current);
    }
    
    gsap.to('.timer-display', {
      opacity: 0.5,
      scale: 0.95,
      duration: 0.3,
      onComplete: () => {
        gsap.to('.timer-display', {
          opacity: 1,
          scale: 1,
          duration: 0.3
        });
      }
    });
    
    setCurrentPhase('warmup');
    setCurrentRound(1);
    setIsPaused(true);
    setActiveLayer('primary');
    restart(getExpiryTimestamp(settings.warmupDuration), false);
    playStopSound();
    setTimerMode('setup');
    setTransitionActive(false);
    isInPhaseTransition.current = false;
  }, [settings.warmupDuration, getExpiryTimestamp, restart, playStopSound]);

  const toggleTimer = useCallback(() => {
    if (timerMode === 'setup') {
      setTimerMode('running');
      
      gsap.fromTo('.timer-display', 
        { scale: 0.95, opacity: 0.8 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.4, 
          ease: 'back.out(1.2)'
        }
      );
      
      // Play warmup announcement when starting the timer from setup
      if (currentPhase === 'warmup') {
        playWarmupSound();
        
        // Small delay to let announcement play
        setTimeout(() => {
          // Start timer after announcement
          start();
          setIsPaused(false);
          
          // Start ambient sound after a short delay
          setTimeout(() => {
            if (ambientSoundRef.current) {
              ambientSoundRef.current.play().catch(error => {
                console.log('Error playing ambient sound:', error);
              });
            }
          }, 500);
        }, 1200);
      } else {
        // Start timer immediately for other phases
        start();
        setIsPaused(false);
        playStartSound();
        
        // Start ambient sound
        if (ambientSoundRef.current) {
          ambientSoundRef.current.play().catch(error => {
            console.log('Error playing ambient sound:', error);
          });
        }
      }
      
      return;
    }
    
    if (isRunning) {
      pause();
      setIsPaused(true);
      playStopSound();
      
      // Pause ambient sound
      if (ambientSoundRef.current) {
        ambientSoundRef.current.pause();
      }
      
      gsap.to('.timer-display', {
        scale: 0.98,
        opacity: 0.9,
        duration: 0.2,
        ease: 'power2.out'
      });
    } else {
      start();
      setIsPaused(false);
      playStartSound();
      
      // Resume ambient sound
      if (ambientSoundRef.current) {
        ambientSoundRef.current.play().catch(error => {
          console.log('Error playing ambient sound:', error);
        });
      }
      
      gsap.to('.timer-display', {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'back.out(1.2)'
      });
    }
  }, [isRunning, start, pause, playStartSound, playStopSound, timerMode, currentPhase, playWarmupSound]);

  const updateTimerMode = useCallback((mode: TimerMode) => {
    if (mode === 'running' && timerMode === 'setup') {
      setTimerMode(mode);
      
      // Play warmup announcement when starting from settings
      if (currentPhase === 'warmup') {
        playWarmupSound();
        
        setTimeout(() => {
          start();
          setIsPaused(false);
        }, 1200);
      } else {
        setTimeout(() => {
          start();
          setIsPaused(false);
          playStartSound();
        }, 300);
      }
    } else {
      setTimerMode(mode);
    }
  }, [timerMode, start, playStartSound, setTimerMode, currentPhase, playWarmupSound]);

  const updateSettings = useCallback((key: keyof TimerSettings, value: number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    gsap.fromTo('.settings-item',
      { scale: 1 },
      { 
        scale: 1.02, 
        duration: 0.2, 
        yoyo: true, 
        repeat: 1,
        stagger: 0.05,
        ease: 'power1.inOut' 
      }
    );
  }, []);

  const exitFullscreen = useCallback(() => {
    if (isRunning) {
      pause();
      setIsPaused(true);
    }
    
    gsap.to('.timer-display', {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    });
    
    setTimerMode('setup');
  }, [isRunning, pause]);

  // Add this useEffect to ensure warmup sound plays after setup
  useEffect(() => {
    // Play warmup sound when transitioning from setup to running mode
    if (timerMode === 'running' && currentPhase === 'warmup' && !isRunning && !transitionActive) {
      setTimeout(() => {
        playWarmupSound();
      }, 100);
    }
  }, [timerMode, currentPhase, isRunning, transitionActive, playWarmupSound]);

  const value = {
    settings,
    currentPhase,
    currentRound,
    isPaused,
    seconds,
    minutes,
    isRunning,
    activeLayer,
    timerMode,
    transitionActive,
    formatTime,
    calculateProgress,
    calculateRoundProgress,
    calculateWorkoutProgress,
    updateSettings,
    toggleTimer,
    resetTimer,
    setTimerMode: updateTimerMode,
    exitFullscreen,
    backgroundGradient,
  };

  // Wrap the timer provider with a div that has the background gradient
  return (
    <TimerContext.Provider value={value}>
      <div className="gradient-container" style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        background: backgroundGradient,
        transition: 'background 0.8s ease'
      }}>
      </div>
      {children}
    </TimerContext.Provider>
  );
}

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
}; 