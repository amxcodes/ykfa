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
  isWorkoutSoundMuted: boolean;
  toggleWorkoutSoundMute: () => void;
}

const defaultSettings: TimerSettings = {
  warmupDuration: 0,
  rounds: 7,
  roundDuration: 0,
  breakDuration: 0,
  cooldownDuration: 0,
  autoStart: true,
  transitionDelay: 0,
  soundVolume: 0.5,
};

export const TimerContext = createContext<TimerContextProps | undefined>(undefined);

// Sound URLs from free online libraries
const SOUND_URLS = {
  start: './sounds/start.mp3', // Local start sound
  stop: './sounds/stop.mp3',  // Local stop sound
  round: './sounds/workout.mp3', // Workout sound for round changes
  complete: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3', // Game experience level increased
  countdown: 'https://assets.mixkit.co/active_storage/sfx/254/254-preview.mp3', // Mixkit Click Tone
  // Round announcement sounds
  roundOne: './sounds/round one.mp3', // Round one announcement
  nextRound: './sounds/next round.mp3', // Next round announcement
  lastRound: './sounds/next round.mp3', // Using next round sound for last round
  finalRound: './sounds/next round.mp3', // Using next round sound for final round
  // Phase announcement sounds
  warmup: './sounds/warm up.mp3', // Warm up announcement
  cooldown: './sounds/cool down.mp3', // Cool down announcement
  // Break announcement sound
  break: './sounds/start.mp3', // Break announcement
  // Workout sound during rounds
  workout: './sounds/workout.mp3', // Workout sound during rounds
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
  const [isWorkoutSoundMuted, setIsWorkoutSoundMuted] = useState(false);
  
  const isInPhaseTransition = useRef(false);
  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
  const breakSoundRef = useRef<HTMLAudioElement | null>(null);
  // Workout sound for during rounds
  const workoutSoundRef = useRef<HTMLAudioElement | null>(null);
  // Ambient sound for continuous play
  const ambientSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio elements - simplified approach to avoid errors
  useEffect(() => {
    try {
      // Create new audio elements each time to ensure they're fresh
      startSoundRef.current = new Audio(SOUND_URLS.start);
      stopSoundRef.current = new Audio(SOUND_URLS.stop);
      roundChangeSoundRef.current = new Audio(SOUND_URLS.round);
      completeSoundRef.current = new Audio(SOUND_URLS.complete);
      countdownSoundRef.current = new Audio(SOUND_URLS.countdown);
      
      // Round announcement audio
      roundOneSoundRef.current = new Audio(SOUND_URLS.roundOne);
      nextRoundSoundRef.current = new Audio(SOUND_URLS.nextRound);
      lastRoundSoundRef.current = new Audio(SOUND_URLS.lastRound);
      finalRoundSoundRef.current = new Audio(SOUND_URLS.finalRound);
      
      // Phase announcement audio
      warmupSoundRef.current = new Audio(SOUND_URLS.warmup);
      cooldownSoundRef.current = new Audio(SOUND_URLS.cooldown);
      breakSoundRef.current = new Audio(SOUND_URLS.break);
      
      // Workout sound for during rounds - enable looping
      workoutSoundRef.current = new Audio(SOUND_URLS.workout);
      if (workoutSoundRef.current) {
        workoutSoundRef.current.loop = true; // Enable looping
      }
      
      // Ambient sound
      ambientSoundRef.current = new Audio(SOUND_URLS.ambient);
      if (ambientSoundRef.current) {
        ambientSoundRef.current.loop = true;
      }
      
      console.log('All audio elements initialized successfully');
    } catch (error) {
      console.error('Error initializing audio elements:', error);
    }
    
    // Set volume for all sounds
    [
      startSoundRef,
      stopSoundRef,
      roundChangeSoundRef,
      completeSoundRef,
      countdownSoundRef,
      roundOneSoundRef,
      nextRoundSoundRef,
      lastRoundSoundRef,
      finalRoundSoundRef,
      warmupSoundRef,
      cooldownSoundRef
    ].forEach(ref => {
      if (ref.current) {
        ref.current.volume = settings.soundVolume;
      }
    });
    
    // Set lower volume for ambient sound
    if (ambientSoundRef.current) {
      ambientSoundRef.current.volume = settings.soundVolume * 0.3;
    }
    
    // Clean up audio elements on unmount
    return () => {
      [
        startSoundRef,
        stopSoundRef,
        roundChangeSoundRef,
        completeSoundRef,
        countdownSoundRef,
        roundOneSoundRef,
        nextRoundSoundRef,
        lastRoundSoundRef,
        finalRoundSoundRef,
        warmupSoundRef,
        cooldownSoundRef,
        breakSoundRef,
        workoutSoundRef,
        ambientSoundRef
      ].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current.src = '';
        }
      });
    };
  }, [settings.soundVolume]);
  
  // Update mute status for workout sounds
  useEffect(() => {
    const workoutSoundRefs = [
      roundChangeSoundRef,
      roundOneSoundRef,
      nextRoundSoundRef,
      lastRoundSoundRef,
      finalRoundSoundRef,
      warmupSoundRef,
      cooldownSoundRef,
      breakSoundRef,
      workoutSoundRef
    ];
    
    // Apply mute status to all workout sounds
    workoutSoundRefs.forEach(ref => {
      if (ref.current) {
        // We don't actually mute the audio element, as we control playback in the playSound function
        // This is just for future reference if needed
      }
    });
  }, [isWorkoutSoundMuted]);
  
  // Update sound volume when settings change
  useEffect(() => {
    [
      startSoundRef, stopSoundRef, roundChangeSoundRef, completeSoundRef, countdownSoundRef,
      roundOneSoundRef, nextRoundSoundRef, lastRoundSoundRef, finalRoundSoundRef,
      warmupSoundRef, cooldownSoundRef, breakSoundRef
    ].forEach(ref => {
      if (ref.current) {
        ref.current.volume = settings.soundVolume;
      }
    });
    
    // Special handling for workout sound to respect mute state
    if (workoutSoundRef.current) {
      workoutSoundRef.current.volume = isWorkoutSoundMuted ? 0 : settings.soundVolume;
    }
    
    if (ambientSoundRef.current) {
      ambientSoundRef.current.volume = settings.soundVolume * 0.3; // Lower volume for ambient sound
    }
  }, [settings.soundVolume, isWorkoutSoundMuted]);
  
  // Sound player function that supports both one-time sounds and continuous sounds
  const playSound = useCallback((soundRef: React.RefObject<HTMLAudioElement>, isWorkoutSound: boolean = false) => {
    try {
      // Skip if sound is muted and it's a workout sound
      if (isWorkoutSound && isWorkoutSoundMuted) {
        return;
      }
      
      if (soundRef.current) {
        // For regular sounds (not workout music), create a new instance for reliable playback
        if (soundRef !== workoutSoundRef) {
          const audio = new Audio(soundRef.current.src);
          audio.volume = settings.soundVolume;
          audio.play().catch(() => console.log('Auto-play prevented by browser'));
        } else {
          // For workout music, use the existing reference to maintain playback position
          soundRef.current.volume = settings.soundVolume;
          soundRef.current.play().catch(() => console.log('Auto-play prevented by browser'));
        }
      }
    } catch (error) {
      // Silently handle errors to prevent app crashes
    }
  }, [isWorkoutSoundMuted, settings.soundVolume]);
  
  const playStartSound = useCallback(() => playSound(startSoundRef), [playSound]);
  const playStopSound = useCallback(() => playSound(stopSoundRef), [playSound]);
  const playRoundChangeSound = useCallback(() => playSound(roundChangeSoundRef, true), [playSound]);
  const playCompleteSound = useCallback(() => playSound(completeSoundRef), [playSound]);
  const playCountdownSound = useCallback(() => playSound(countdownSoundRef), [playSound]);
  const playRoundOneSound = useCallback(() => playSound(roundOneSoundRef, true), [playSound]);
  const playNextRoundSound = useCallback(() => playSound(nextRoundSoundRef, true), [playSound]);
  const playLastRoundSound = useCallback(() => playSound(lastRoundSoundRef, true), [playSound]);
  const playFinalRoundSound = useCallback(() => playSound(finalRoundSoundRef, true), [playSound]);
  const playWarmupSound = useCallback(() => playSound(warmupSoundRef, true), [playSound]);
  const playCooldownSound = useCallback(() => playSound(cooldownSoundRef, true), [playSound]);
  const playBreakSound = useCallback(() => playSound(breakSoundRef, true), [playSound]);
  const playWorkoutSound = useCallback(() => playSound(workoutSoundRef, true), [playSound]);
  
  // Toggle workout sound mute and control workout music volume
  const toggleWorkoutSoundMute = useCallback(() => {
    setIsWorkoutSoundMuted(prev => {
      const newMuteState = !prev;
      
      // Immediately apply mute state to workout music if it's playing
      if (workoutSoundRef.current) {
        if (newMuteState) {
          workoutSoundRef.current.volume = 0;
        } else {
          workoutSoundRef.current.volume = settings.soundVolume;
        }
      }
      
      return newMuteState;
    });
  }, [settings.soundVolume]);

  const getExpiryTimestamp = useCallback((seconds: number) => {
    // Round seconds to ensure consistency
    const roundedSeconds = Math.round(seconds);
    
    const time = new Date();
    // Clear milliseconds to sync with whole seconds
    time.setMilliseconds(0);
    time.setSeconds(time.getSeconds() + roundedSeconds);
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

  // Get the next phase info, with logic to skip phases with 0 duration
  const getNextPhaseInfo = useCallback(() => {
    // Helper function to check if a phase should be skipped
    const shouldSkipPhase = (phase: TimerPhase): boolean => {
      switch (phase) {
        case 'warmup': return settings.warmupDuration === 0;
        case 'round': return settings.roundDuration === 0;
        case 'break': return settings.breakDuration === 0;
        case 'cooldown': return settings.cooldownDuration === 0;
        default: return false;
      }
    };
    
    // Get the immediate next phase without skipping
    let nextPhase: TimerPhase;
    let nextRound = currentRound;
    
    switch (currentPhase) {
      case 'warmup':
        nextPhase = 'round';
        nextRound = 1;
        break;
      case 'round':
        if (currentRound < settings.rounds) {
          nextPhase = 'break';
        } else {
          nextPhase = 'cooldown';
        }
        break;
      case 'break':
        nextPhase = 'round';
        nextRound = currentRound + 1;
        break;
      case 'cooldown':
        nextPhase = 'complete';
        break;
      default:
        nextPhase = 'warmup';
        nextRound = 1;
        break;
    }
    
    // Skip phases with 0 duration (except 'complete' which can't be skipped)
    while (shouldSkipPhase(nextPhase) && nextPhase !== 'complete') {
      // Get the next phase after the one we're skipping
      switch (nextPhase) {
        case 'warmup':
          nextPhase = 'round';
          nextRound = 1;
          break;
        case 'round':
          if (nextRound < settings.rounds) {
            nextPhase = 'break';
          } else {
            nextPhase = 'cooldown';
          }
          break;
        case 'break':
          nextPhase = 'round';
          nextRound = nextRound + 1;
          break;
        case 'cooldown':
          nextPhase = 'complete';
          break;
      }
    }
    
    return { phase: nextPhase as TimerPhase, round: nextRound };
  }, [currentPhase, currentRound, settings.warmupDuration, settings.roundDuration, settings.breakDuration, settings.cooldownDuration, settings.rounds]);

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
    } else if (nextPhase === 'break') {
      // Play break announcement only once
      playBreakSound();
      
      // Immediately animate the phase change
      animatePhaseChange();
    } else {
      // For other non-announced transitions, play the standard round change sound
      playRoundChangeSound();
      animatePhaseChange();
    }
    
    if (transitionTimeout.current) {
      clearTimeout(transitionTimeout.current);
    }
    
    // Only play countdown sound if we're not in an announced phase
    if (nextPhase !== 'round' && nextPhase !== 'warmup' && nextPhase !== 'cooldown' && nextPhase !== 'break') {
      playCountdownSound();
    }
    
    // Handle workout music for rounds
    if (nextPhase === 'round') {
      // Add a small delay to let the announcement finish
      setTimeout(() => {
        // Only start the workout music if it's not already playing
        if (workoutSoundRef.current && 
            (workoutSoundRef.current.paused || workoutSoundRef.current.ended)) {
          playWorkoutSound();
        }
      }, 2000);
    } else if (workoutSoundRef.current && !workoutSoundRef.current.paused) {
      // Pause workout music when not in round phase
      workoutSoundRef.current.pause();
    }
    
    // Set longer delay for announcement phases to ensure they complete playing
    const transitionDelayMs = settings.transitionDelay * 1000;
    const needsExtraDelay = (nextPhase === 'round' || nextPhase === 'warmup' || nextPhase === 'cooldown');
    // Break doesn't need extra delay since we're not playing a long announcement
    const extraDelayForAnnouncement = needsExtraDelay ? 1500 : 0;
    
    transitionTimeout.current = setTimeout(() => {
      setCurrentPhase(nextPhase);
      setCurrentRound(nextRound);
      
      // Get the duration for the next phase
      const nextPhaseDuration = 
        nextPhase === 'round' ? settings.roundDuration :
        nextPhase === 'break' ? settings.breakDuration :
        nextPhase === 'cooldown' ? settings.cooldownDuration :
        nextPhase === 'warmup' ? settings.warmupDuration : 0;
      
      // Our improved getNextPhaseInfo already handles skipping 0 duration phases
      // So we just need to check if the current phase has 0 duration
      if (nextPhaseDuration === 0) {
        // Reset transition state
        setTransitionActive(false);
        isInPhaseTransition.current = false;
        
        // Log that we're skipping this phase
        console.log(`Skipping phase ${nextPhase} with 0 duration`);
        
        // Immediately move to the next phase without any delay
        // This is more memory efficient than using setTimeout
        setCurrentPhase(nextPhase);
        setCurrentRound(nextRound);
        
        // Trigger the next phase transition immediately if it's not the complete phase
        // Using type guard to satisfy TypeScript
        if (nextPhase === 'warmup' || nextPhase === 'round' || 
            nextPhase === 'break' || nextPhase === 'cooldown') {
          // Use requestAnimationFrame instead of setTimeout for better performance
          requestAnimationFrame(() => {
            handlePhaseComplete();
          });
        }
      } else {
        // Normal behavior for non-zero durations
        restart(getExpiryTimestamp(nextPhaseDuration), settings.autoStart);
        
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
      }
    }, transitionDelayMs + extraDelayForAnnouncement);
    
  }, [
    currentPhase, currentRound, settings, 
    playRoundChangeSound, playCompleteSound, playCountdownSound, 
    playRoundOneSound, playNextRoundSound, playLastRoundSound, playFinalRoundSound,
    playWarmupSound, playCooldownSound,
    getNextPhaseInfo, animatePhaseChange, getExpiryTimestamp, playStartSound
  ]);

  // Create a ref to store the current timer values when paused
  const pausedTimerRef = useRef<{minutes: number, seconds: number} | null>(null);
  
  // Custom wrapper for the useTimer hook to handle proper pausing
  const {
    seconds: timerSeconds,
    minutes: timerMinutes,
    isRunning,
    start,
    pause: originalPause,
    restart
  } = useTimer({
    expiryTimestamp: getExpiryTimestamp(settings.warmupDuration),
    onExpire: handlePhaseComplete,
    autoStart: false
  });
  
  // Use the paused values if available, otherwise use the timer values
  const seconds = isPaused && pausedTimerRef.current ? pausedTimerRef.current.seconds : timerSeconds;
  const minutes = isPaused && pausedTimerRef.current ? pausedTimerRef.current.minutes : timerMinutes;
  
  // Custom pause function that stores the current timer values
  const pause = useCallback(() => {
    // Store current timer values
    pausedTimerRef.current = {
      minutes: timerMinutes,
      seconds: timerSeconds
    };
    originalPause();
  }, [originalPause, timerMinutes, timerSeconds]);

  // Control ambient sound based on timer running state - now added after timer declaration
  useEffect(() => {
    // Play ambient sound when timer is running and not paused or in transition
    if (isRunning && !isPaused && !transitionActive && timerMode === 'running') {
      if (ambientSoundRef.current) {
        ambientSoundRef.current.play().catch(() => {
          // Silent catch for autoplay restrictions
        });
      }
    } else {
      // Pause ambient sound when timer is paused or in transition
      if (ambientSoundRef.current) {
        ambientSoundRef.current.pause();
      }
    }
  }, [isRunning, isPaused, transitionActive, timerMode]);

  // This effect handles timer initialization and settings changes
  // but should not affect paused state
  useEffect(() => {
    // Only reset the timer if we're in setup mode or during a settings change
    // This prevents resetting when pausing
    if (!isRunning && !transitionActive && !isPaused) {
      const duration = getCurrentPhaseDuration();
      // Make sure to reset milliseconds for more consistent timing
      const expiryTime = getExpiryTimestamp(duration);
      restart(expiryTime, false);
    }
  }, [settings, getCurrentPhaseDuration, getExpiryTimestamp, isRunning, restart, transitionActive, isPaused]);

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
    // Prevent reset during transitions
    if (transitionActive) {
      return;
    }
    
    // Clear any pending transitions
    if (transitionTimeout.current) {
      clearTimeout(transitionTimeout.current);
      transitionTimeout.current = null;
    }
    
    // Stop workout music if it's playing
    if (workoutSoundRef.current && !workoutSoundRef.current.paused) {
      workoutSoundRef.current.pause();
      workoutSoundRef.current.currentTime = 0;
    }
    
    // Stop ambient sound if it's playing
    if (ambientSoundRef.current && !ambientSoundRef.current.paused) {
      ambientSoundRef.current.pause();
    }
    
    // Visual feedback animation
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
    
    // Reset all timer state
    setCurrentPhase('warmup');
    setCurrentRound(1);
    setIsPaused(true);
    setActiveLayer('primary');
    
    // Reset the timer with the warmup duration
    restart(getExpiryTimestamp(settings.warmupDuration), false);
    
    // Play stop sound for feedback
    playStopSound();
    
    // Reset UI state
    setTimerMode('setup');
    setTransitionActive(false);
    isInPhaseTransition.current = false;
  }, [settings.warmupDuration, getExpiryTimestamp, restart, playStopSound, transitionActive]);

  const toggleTimer = useCallback(() => {
    // Prevent toggle during transitions
    if (transitionActive) {
      return;
    }
    
    // Starting the timer from setup mode
    if (timerMode === 'setup') {
      setTimerMode('running');
      
      // Animation for starting the timer
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
              ambientSoundRef.current.play().catch(() => {
                // Silent catch for autoplay restrictions
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
          ambientSoundRef.current.play().catch(() => {
            // Silent catch for autoplay restrictions
          });
        }
      }
      
      return;
    }
    
    // Pausing the timer
    if (isRunning) {
      // Set isPaused first to prevent the reset effect from triggering
      setIsPaused(true);
      
      // Then pause the timer
      pause();
      
      // Play feedback sound
      playStopSound();
      
      // Pause workout music if it's playing
      if (workoutSoundRef.current && !workoutSoundRef.current.paused) {
        workoutSoundRef.current.pause();
      }
      
      // Pause ambient sound
      if (ambientSoundRef.current) {
        ambientSoundRef.current.pause();
      }
      
      // Animation for pausing
      gsap.to('.timer-display', {
        scale: 0.98,
        opacity: 0.9,
        duration: 0.2,
        ease: 'power2.out'
      });
    } 
    // Resuming the timer
    else {
      // Update UI state first
      setIsPaused(false);
      
      // Resume the timer from the paused state
      if (pausedTimerRef.current) {
        // Calculate remaining time based on paused values
        const totalSeconds = pausedTimerRef.current.minutes * 60 + pausedTimerRef.current.seconds;
        const newExpiryTime = getExpiryTimestamp(totalSeconds);
        
        // Restart with the exact time from when we paused
        restart(newExpiryTime);
        
        // Clear the paused timer ref since we've resumed
        pausedTimerRef.current = null;
      } else {
        // Fallback to normal start if no paused state (shouldn't happen)
        start();
      }
      
      // Play a subtle resume sound (not the full start sound)
      // We use a quieter sound for resume to differentiate from initial start
      if (countdownSoundRef.current) {
        countdownSoundRef.current.volume = settings.soundVolume * 0.5; // Quieter volume
        countdownSoundRef.current.play().catch(() => {
          // Silent catch for autoplay restrictions
        });
      }
      
      // Resume workout music if we're in a round phase
      if (currentPhase === 'round' && workoutSoundRef.current && workoutSoundRef.current.paused) {
        workoutSoundRef.current.play().catch(() => {
          // Silent catch for autoplay restrictions
        });
      }
      
      // Resume ambient sound
      if (ambientSoundRef.current) {
        ambientSoundRef.current.play().catch(() => {
          // Silent catch for autoplay restrictions
        });
      }
      
      // Animation for resuming
      gsap.to('.timer-display', {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'back.out(1.2)'
      });
    }
  }, [isRunning, start, pause, playStartSound, playStopSound, timerMode, currentPhase, playWarmupSound, transitionActive]);

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
    
    // If the setting is related to time duration and we're in the current phase,
    // we need to update the timer to reflect the new duration
    if (
      (key === 'warmupDuration' && currentPhase === 'warmup') ||
      (key === 'roundDuration' && currentPhase === 'round') ||
      (key === 'breakDuration' && currentPhase === 'break') ||
      (key === 'cooldownDuration' && currentPhase === 'cooldown')
    ) {
      // Get the new value as number
      const newDuration = value as number;
      
      // Calculate how much of the current phase has already passed
      const currentProgress = calculateProgress();
      const elapsedTimePercent = currentProgress / 100;
      
      // Calculate new time remaining based on new total duration and current progress
      let timeRemaining = Math.round(newDuration * (1 - elapsedTimePercent));
      
      // Ensure we have at least 1 second remaining
      timeRemaining = Math.max(1, timeRemaining);
      
      // Set up new expiry timestamp based on remaining time
      const newTimestamp = getExpiryTimestamp(timeRemaining);
      
      // Pause the timer temporarily
      const wasRunning = !isPaused;
      if (wasRunning) {
        pause();
      }
      
      // Update the timer with the new expiry timestamp
      restart(newTimestamp, wasRunning);
    }
    
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
  }, [currentPhase, calculateProgress, getExpiryTimestamp, isPaused, pause, restart]);

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
    isWorkoutSoundMuted,
    toggleWorkoutSoundMute,
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