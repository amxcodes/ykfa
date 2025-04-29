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
  start: 'https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3', // Mixkit Success Bell
  stop: 'https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3',  // Mixkit Attention Bell
  round: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3', // Mixkit Sport Buzzer
  complete: 'https://assets.mixkit.co/active_storage/sfx/1010/1010-preview.mp3', // Mixkit Achievement Bell
  countdown: 'https://assets.mixkit.co/active_storage/sfx/254/254-preview.mp3' // Mixkit Click Tone
};

export function TimerProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<TimerSettings>(defaultSettings);
  const [currentPhase, setCurrentPhase] = useState<TimerPhase>('warmup');
  const [currentRound, setCurrentRound] = useState(1);
  const [isPaused, setIsPaused] = useState(true);
  const [activeLayer, setActiveLayer] = useState<TimerLayer>('primary');
  const [timerMode, setTimerMode] = useState<TimerMode>('setup');
  const [transitionActive, setTransitionActive] = useState(false);
  
  const isInPhaseTransition = useRef(false);
  const transitionTimeout = useRef<NodeJS.Timeout | null>(null);
  const timerDisplayRef = useRef<HTMLDivElement | null>(null);
  const phaseLabelsRef = useRef<HTMLDivElement | null>(null);

  // Audio elements for sounds
  const startSoundRef = useRef<HTMLAudioElement | null>(null);
  const stopSoundRef = useRef<HTMLAudioElement | null>(null);
  const roundChangeSoundRef = useRef<HTMLAudioElement | null>(null);
  const completeSoundRef = useRef<HTMLAudioElement | null>(null);
  const countdownSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio elements
  useEffect(() => {
    startSoundRef.current = new Audio(SOUND_URLS.start);
    stopSoundRef.current = new Audio(SOUND_URLS.stop);
    roundChangeSoundRef.current = new Audio(SOUND_URLS.round);
    completeSoundRef.current = new Audio(SOUND_URLS.complete);
    countdownSoundRef.current = new Audio(SOUND_URLS.countdown);
    
    // Set volume for all sounds
    [startSoundRef, stopSoundRef, roundChangeSoundRef, completeSoundRef, countdownSoundRef].forEach(ref => {
      if (ref.current) {
        ref.current.volume = settings.soundVolume;
      }
    });
    
    // Cleanup
    return () => {
      [startSoundRef, stopSoundRef, roundChangeSoundRef, completeSoundRef, countdownSoundRef].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current.currentTime = 0;
        }
      });
    };
  }, []);
  
  // Update sound volume when settings change
  useEffect(() => {
    [startSoundRef, stopSoundRef, roundChangeSoundRef, completeSoundRef, countdownSoundRef].forEach(ref => {
      if (ref.current) {
        ref.current.volume = settings.soundVolume;
      }
    });
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

  const animatePhaseChange = useCallback(() => {
    const timeline = gsap.timeline();
    
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    
    timeline.to('.timer-display', {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out',
      opacity: 0.9,
    });
    
    timeline.to('.timer-background', {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
  }, []);

  const handlePhaseComplete = useCallback(() => {
    playRoundChangeSound();
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
      playCompleteSound(); // Using new complete sound
      setTransitionActive(false);
      isInPhaseTransition.current = false;
      return;
    }
    
    animatePhaseChange();
    
    if (transitionTimeout.current) {
      clearTimeout(transitionTimeout.current);
    }
    
    // Play countdown during transition
    playCountdownSound();
    
    transitionTimeout.current = setTimeout(() => {
      setCurrentPhase(nextPhase);
      setCurrentRound(nextRound);
      
      restart(getExpiryTimestamp(
        nextPhase === 'round' ? settings.roundDuration :
        nextPhase === 'break' ? settings.breakDuration :
        nextPhase === 'cooldown' ? settings.cooldownDuration : 0
      ), settings.autoStart);
      
      setTransitionActive(false);
      isInPhaseTransition.current = false;
      
      if (settings.autoStart) {
        setIsPaused(false);
        playStartSound();
      } else {
        setIsPaused(true);
      }
    }, settings.transitionDelay * 1000);
    
  }, [currentPhase, currentRound, settings, playRoundChangeSound, playCompleteSound, playCountdownSound, getNextPhaseInfo, animatePhaseChange, getExpiryTimestamp, playStartSound]);

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
      
      // Start timer immediately when entering running mode
      start();
      setIsPaused(false);
      playStartSound();
      return;
    }
    
    if (isRunning) {
      pause();
      setIsPaused(true);
      playStopSound();
      
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
      
      gsap.to('.timer-display', {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'back.out(1.2)'
      });
    }
  }, [isRunning, start, pause, playStartSound, playStopSound, timerMode]);

  const updateTimerMode = useCallback((mode: TimerMode) => {
    if (mode === 'running' && timerMode === 'setup') {
      setTimerMode(mode);
      
      setTimeout(() => {
        start();
        setIsPaused(false);
        playStartSound();
      }, 300);
    } else {
      setTimerMode(mode);
    }
  }, [timerMode, start, playStartSound, setTimerMode]);

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
  };

  return (
    <TimerContext.Provider value={value}>
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