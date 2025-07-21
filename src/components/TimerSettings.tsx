import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion'; // Replaced with CSS animations
import { useTimerContext } from '../context/TimerContext';
import { 
  Play, Flame, Clock, Activity, Coffee, Fan, Plus, Minus } from 'lucide-react';

// Animation controller for replacing GSAP
class AnimationController {
  // Apply CSS transition to an element
  static animate(element: HTMLElement | null, properties: Record<string, any>, options: {
    duration?: number;
    ease?: string;
    delay?: number;
    onComplete?: () => void;
    repeat?: number;
    yoyo?: boolean;
  } = {}) {
    if (!element) return null;
    
    const { duration = 0.3, ease = 'ease', delay = 0, onComplete, repeat = 0 } = options;
    
    // Save original transition and other properties
    const originalTransition = element.style.transition;
    const originalBoxShadow = element.style.boxShadow;
    
    // Set transition property
    element.style.transition = `all ${duration}s ${ease} ${delay}s`;
    
    // Apply properties
    const timeoutId = setTimeout(() => {
      Object.entries(properties).forEach(([prop, value]) => {
        // Handle special properties
        if (prop === 'scale') {
          element.style.transform = `scale(${value})`;
        } else if (prop === 'boxShadow') {
          element.style.boxShadow = value as string;
        } else if (prop === 'color') {
          element.style.color = value as string;
        } else {
          // For standard CSS properties
          (element.style as any)[prop] = value;
        }
      });
    }, 10);
    
      // Call onComplete after animation finishes
    const completeTimeoutId = setTimeout(() => {
        // Restore original transition
        element.style.transition = originalTransition;
        if (onComplete) onComplete();
      }, (duration + delay) * 1000);
    
    return {
      // Cleanup function to cancel animations
      cancel: () => {
        clearTimeout(timeoutId);
        clearTimeout(completeTimeoutId);
        element.style.transition = originalTransition;
        element.style.boxShadow = originalBoxShadow;
      }
    };
  }
  
  // Apply CSS transition with from and to values
  static fromTo(
    element: HTMLElement | null, 
    fromProps: Record<string, any>, 
    toProps: Record<string, any>, 
    options: {
      duration?: number;
      ease?: string;
      delay?: number;
      onComplete?: () => void;
    } = {}
  ) {
    if (!element) return null;
    
    // Apply from properties immediately without transition
    const originalTransition = element.style.transition;
    element.style.transition = 'none';
    
    Object.entries(fromProps).forEach(([prop, value]) => {
      if (prop === 'scale') {
        element.style.transform = `scale(${value})`;
      } else if (prop === 'color') {
        element.style.color = value as string;
      } else {
        (element.style as any)[prop] = value;
      }
    });
    
    // Force reflow to ensure from properties are applied
    void element.offsetWidth;
    
    // Reset transition and animate to target properties
    const timeoutId = setTimeout(() => {
      element.style.transition = originalTransition;
      AnimationController.animate(element, toProps, options);
    }, 20);
    
    return {
      // Cleanup function
      cancel: () => {
        clearTimeout(timeoutId);
        element.style.transition = originalTransition;
      }
    };
  }
}

interface TimerSettingsProps {
  className?: string;
  onStartWorkout?: () => void;
}

const TimerSettings: React.FC<TimerSettingsProps> = ({ 
  className = '',
  onStartWorkout
}) => {
  const { 
    settings, 
    updateSettings,
    isPaused,
    resetTimer,
    setTimerMode,
    toggleTimer
  } = useTimerContext();

  const settingsRef = useRef<HTMLDivElement>(null);

  // Local state for input fields
  const [inputValues, setInputValues] = useState<Record<string, { minutes?: string; seconds?: string; value?: string }>>({});
  
  // Set slider mode as default state
  const [isSliderMode, setIsSliderMode] = useState<boolean>(true);

  // Initialize input values with current settings
  useEffect(() => {
    const newInputValues: Record<string, { minutes?: string; seconds?: string; value?: string }> = {};
    settingSections.forEach(section => {
      if (section.showMinutes) {
        newInputValues[section.key] = {
          minutes: getMinutes(settings[section.key as keyof typeof settings] as number).toString(),
          seconds: getSeconds(settings[section.key as keyof typeof settings] as number).toString()
        };
      } else if (section.key === 'rounds') {
        newInputValues[section.key] = {
          value: settings[section.key].toString()
        };
      } else {
        newInputValues[section.key] = {
          value: settings[section.key as keyof typeof settings]?.toString() || ''
        };
      }
    });
    setInputValues(newInputValues);
  }, []); // Only run once on mount

  const getMinutes = (totalSeconds: number) => {
    return Math.floor(totalSeconds / 60);
  };

  const getSeconds = (totalSeconds: number) => {
    return totalSeconds % 60;
  };

  // Icons and colors for each section
  const settingSections = [
    { 
      key: 'warmupDuration', 
      label: 'Warm Up', 
      icon: <Flame className="w-5 h-5 text-cyan-400" />,
      color: 'bg-blue-900/30 border-blue-500/20 hover:bg-blue-800/30',
      unit: 's',
      showMinutes: true,
      sliderMin: 0,
      sliderMax: 300,
      sliderStep: 5
    },
    { 
      key: 'rounds', 
      label: 'Rounds', 
      icon: <Activity className="w-5 h-5 text-amber-400" />,
      color: 'bg-amber-900/30 border-amber-500/20 hover:bg-amber-800/30',
      unit: '',
      showMinutes: false,
      sliderMin: 1,
      sliderMax: 30,
      sliderStep: 1
    },
    { 
      key: 'roundDuration', 
      label: 'Round Time', 
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      color: 'bg-amber-900/30 border-amber-500/20 hover:bg-amber-800/30',
      unit: 's',
      showMinutes: true,
      sliderMin: 0,
      sliderMax: 600,
      sliderStep: 5
    },
    { 
      key: 'breakDuration', 
      label: 'Break Time', 
      icon: <Coffee className="w-5 h-5 text-green-400" />,
      color: 'bg-green-900/30 border-green-500/20 hover:bg-green-800/30',
      unit: 's',
      showMinutes: true,
      sliderMin: 0,
      sliderMax: 300,
      sliderStep: 5
    },
    { 
      key: 'cooldownDuration', 
      label: 'Cool Down', 
      icon: <Fan className="w-5 h-5 text-blue-400" />,
      color: 'bg-blue-900/30 border-blue-500/20 hover:bg-blue-800/30',
      unit: 's',
      showMinutes: true,
      sliderMin: 0,
      sliderMax: 300,
      sliderStep: 5
    },
    {
      key: 'transitionDelay',
      label: 'Transition',
      icon: <Clock className="w-5 h-5 text-purple-400" />,
      color: 'bg-purple-900/30 border-purple-500/20 hover:bg-purple-800/30',
      unit: 's',
      showMinutes: false,
      sliderMin: 0,
      sliderMax: 10,
      sliderStep: 1
    }
  ];

  // Set sound volume to full on mount
  useEffect(() => {
    if (settings.soundVolume !== 1) {
      updateSettings('soundVolume', 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Update input values when settings change (but not when user is actively editing)
  useEffect(() => {
    const newInputValues: Record<string, { minutes?: string; seconds?: string; value?: string }> = {};
    settingSections.forEach(section => {
      if (section.showMinutes) {
        newInputValues[section.key] = {
          minutes: getMinutes(settings[section.key as keyof typeof settings] as number).toString(),
          seconds: getSeconds(settings[section.key as keyof typeof settings] as number).toString()
        };
      } else if (section.key === 'rounds') {
        newInputValues[section.key] = {
          value: settings[section.key].toString()
        };
      } else {
        newInputValues[section.key] = {
          value: settings[section.key as keyof typeof settings]?.toString() || ''
        };
      }
    });
    setInputValues(newInputValues);
  }, [settings, settingSections, getMinutes, getSeconds]);

  // Handler for input changes
  const handleInputChange = (
    setting: keyof typeof settings, 
    type: 'minutes' | 'seconds' | 'value', 
    value: string
  ) => {
    // Update local state immediately for responsive UI
    setInputValues(prev => ({
      ...prev,
      [setting]: {
        ...prev[setting],
        [type]: value
      }
    }));
  };

  // Validate and commit changes on blur
  const handleInputBlur = (
    setting: keyof typeof settings, 
    type: 'minutes' | 'seconds' | 'value'
  ) => {
    const currentValue = inputValues[setting]?.[type] || '';
    let parsedValue = parseInt(currentValue, 10);
    
    // Handle empty inputs
    if (currentValue === '' || isNaN(parsedValue)) {
      parsedValue = type === 'minutes' || type === 'value' ? 0 : 5;
    }
    
    if (type === 'minutes') {
      // Clamp minutes between 0-99
      parsedValue = Math.max(0, Math.min(99, parsedValue));
      
      // Get current seconds
      const seconds = parseInt(inputValues[setting]?.seconds || '0', 10) || 0;
      
      // Calculate new total time
      let totalSeconds = (parsedValue * 60) + seconds;
      
      // If minutes are 0, ensure seconds are at least 5
      if (parsedValue === 0 && seconds < 5) {
        totalSeconds = 5;
        
        // Update the seconds field in UI
        setInputValues(prev => ({
          ...prev,
          [setting]: {
            ...prev[setting],
            seconds: '5'
          }
        }));
      }
      
      // Update setting
      updateSettings(setting, totalSeconds);
      animateSettingChange(`.${setting}-value`);
      
    } else if (type === 'seconds') {
      // Clamp seconds between 0-59
      parsedValue = Math.max(0, Math.min(59, parsedValue));
      
      // Get current minutes
      const minutes = parseInt(inputValues[setting]?.minutes || '0', 10) || 0;
      
      // If minutes are 0, ensure seconds are at least 5
      if (minutes === 0 && parsedValue < 5) {
        parsedValue = 5;
        
        // Update the seconds field in UI
        setInputValues(prev => ({
          ...prev,
          [setting]: {
            ...prev[setting],
            seconds: '5'
          }
        }));
      }
      
      // Calculate new total time
      const totalSeconds = (minutes * 60) + parsedValue;
      
      // Update setting
      updateSettings(setting, totalSeconds);
      animateSettingChange(`.${setting}-value`);
      
    } else { // type === 'value'
      if (setting === 'rounds') {
        // Clamp rounds between 1-30
        parsedValue = Math.max(1, Math.min(30, parsedValue));
      } else {
        // For transition delay and other simple values
        // Allow 0 as minimum value
        parsedValue = Math.max(0, Math.min(59, parsedValue));
      }
      
      // Update setting
      updateSettings(setting, parsedValue);
      animateSettingChange(`.${setting}-value`);
    }
  };

  // Handler for slider changes
  const handleSliderChange = useCallback((
    setting: keyof typeof settings,
    value: number
  ) => {
    if (setting === 'rounds') {
      const roundsValue = Math.max(1, Math.min(30, value));
      updateSettings('rounds', roundsValue);
    } else {
      updateSettings(setting, value);
    }
  }, [updateSettings]);

  useEffect(() => {
    // Reset the timer when entering settings view
    resetTimer();
  }, [resetTimer]);

  // Animation for settings changes
  const animateSettingChange = (element: string) => {
    if (settingsRef.current) {
      const target = settingsRef.current.querySelector(element) as HTMLElement;
      if (target) {
        AnimationController.fromTo(
          target,
          { scale: 1.1, color: '#60a5fa' },
          { scale: 1, color: '#ffffff' },
          { 
            duration: 0.3, 
            ease: 'ease-out' // power2.out
          }
        );
      }
    }
  };

  // Animation to pulse the button when ready
  useEffect(() => {
    if (settingsRef.current) {
      const startButton = settingsRef.current.querySelector('.start-button') as HTMLElement;
      if (startButton) {
        // Use CSS animation instead of JavaScript intervals to prevent memory leaks
        startButton.style.animation = 'pulse-glow 2s ease-in-out infinite';
      }
      
      // Clean up animation on unmount
      return () => {
        const startButton = settingsRef.current?.querySelector('.start-button') as HTMLElement;
        if (startButton) {
          startButton.style.animation = '';
        }
      };
    }
  }, []);

  const handleIncreaseRounds = () => {
    const newValue = settings.rounds + 1;
    if (newValue <= 30) {
      updateSettings('rounds', newValue);
      animateSettingChange(`.rounds-value`);
    }
  };

  const handleDecreaseRounds = () => {
    const newValue = settings.rounds - 1;
    if (newValue >= 1) {
      updateSettings('rounds', newValue);
      animateSettingChange(`.rounds-value`);
    }
  };

  const handleStartWorkout = () => {
    // Update to running mode
    setTimerMode('running');
    
    // Start the timer immediately
    updateSettings('autoStart', true);
    
    // Force start the timer
    if (isPaused) {
      toggleTimer();
    }
    
    // Call the callback if provided
    if (onStartWorkout) {
      onStartWorkout();
    }
  };

  // Function to format time for slider labels

  return (
    <div 
      ref={settingsRef}
      className={`glassmorphic-dark p-4 ${className} max-w-sm mx-auto w-full overflow-hidden`}
    >
      {/* Header with gradient text */}
      <div 
        className="text-center mb-4 animate-fade-in-up"
      >
        <h2 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
          Workout Timer Settings
        </h2>
        <p className="text-gray-400 mt-1 text-xs">Customize your workout experience</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center justify-center mb-4">
        <div className="bg-dark-800/50 rounded-full p-0.5 flex items-center">
          <button 
            onClick={() => setIsSliderMode(false)}
            className={`px-3 py-1 rounded-full text-xs transition-all duration-300 ${
              !isSliderMode 
                ? 'bg-amber-500 text-black font-medium' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Input
          </button>
          <button 
            onClick={() => setIsSliderMode(true)}
            className={`px-3 py-1 rounded-full text-xs transition-all duration-300 ${
              isSliderMode 
                ? 'bg-amber-500 text-black font-medium' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Slider
          </button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="space-y-2">
        {settingSections.map((section, index) => (
          <div
            key={section.key}
            className="bg-dark-800/50 rounded-lg p-3 border border-white/5 hover:border-amber-500/30 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10">
                    {section.icon}
                  </div>
                  <span className="font-medium text-white text-sm">{section.label}</span>
                </div>
                
                {isSliderMode ? (
                  <div className="flex-1 ml-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min={section.sliderMin}
                        max={section.sliderMax}
                        step={section.sliderStep}
                        value={settings[section.key as keyof typeof settings] as number}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (section.key === 'rounds') {
                            const roundsValue = Math.max(1, Math.min(30, value));
                            updateSettings('rounds', roundsValue);
                          } else {
                            handleSliderChange(section.key as keyof typeof settings, value);
                          }
                        }}
                        className="w-full h-1 bg-dark-700 rounded-lg appearance-none cursor-pointer 
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 
                          [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:hover:bg-amber-300
                          [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:shadow-lg"
                      />
                      <div className="flex items-center space-x-1 min-w-[3.5rem] justify-end">
                        {section.key === 'rounds' ? (
                          <span className="text-amber-400 font-medium text-sm">{settings.rounds}</span>
                        ) : section.key === 'transitionDelay' ? (
                          <span className="text-amber-400 font-medium text-sm">{settings.transitionDelay}s</span>
                        ) : (
                          <>
                            <span className="text-amber-400 font-medium text-sm">
                              {getMinutes(settings[section.key as keyof typeof settings] as number)}
                            </span>
                            <span className="text-gray-400 text-xs">m</span>
                            <span className="text-amber-400 font-medium text-sm">
                              {getSeconds(settings[section.key as keyof typeof settings] as number).toString().padStart(2, '0')}
                            </span>
                            <span className="text-gray-400 text-xs">s</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    {section.key === 'rounds' ? (
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors active:scale-95"
                          onClick={handleDecreaseRounds}
                          disabled={settings.rounds <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <input
                          type="text"
                          value={inputValues[section.key]?.value || settings.rounds.toString() || '1'}
                          onChange={(e) => handleInputChange(section.key as keyof typeof settings, 'value', e.target.value)}
                          onBlur={() => handleInputBlur(section.key as keyof typeof settings, 'value')}
                          className="w-12 bg-dark-700 text-center font-medium rounded-lg py-1 text-white placeholder-gray-400 border border-gray-600"
                          placeholder="1"
                          style={{ 
                            color: 'white !important', 
                            backgroundColor: '#374151 !important',
                            caretColor: 'white',
                            outline: 'none'
                          }}
                        />
                        
                        <button
                          className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors active:scale-95"
                          onClick={handleIncreaseRounds}
                          disabled={settings.rounds >= 30}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : section.showMinutes ? (
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            value={inputValues[section.key]?.minutes || getMinutes(settings[section.key as keyof typeof settings] as number).toString() || '0'}
                            onChange={(e) => handleInputChange(section.key as keyof typeof settings, 'minutes', e.target.value)}
                            onBlur={() => handleInputBlur(section.key as keyof typeof settings, 'minutes')}
                            className="w-12 bg-dark-700 text-center font-medium rounded-lg py-1 text-white placeholder-gray-400 border border-gray-600"
                            placeholder="0"
                            style={{ 
                              color: 'white !important', 
                              backgroundColor: '#374151 !important',
                              caretColor: 'white',
                              outline: 'none'
                            }}
                          />
                          <span className="text-gray-400">m</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            value={inputValues[section.key]?.seconds || getSeconds(settings[section.key as keyof typeof settings] as number).toString() || '0'}
                            onChange={(e) => handleInputChange(section.key as keyof typeof settings, 'seconds', e.target.value)}
                            onBlur={() => handleInputBlur(section.key as keyof typeof settings, 'seconds')}
                            className="w-12 bg-dark-700 text-center font-medium rounded-lg py-1 text-white placeholder-gray-400 border border-gray-600"
                            placeholder="0"
                            style={{ 
                              color: 'white !important', 
                              backgroundColor: '#374151 !important',
                              caretColor: 'white',
                              outline: 'none'
                            }}
                          />
                          <span className="text-gray-400">s</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <input
                          type="text"
                          value={inputValues[section.key]?.value || settings[section.key as keyof typeof settings].toString() || '0'}
                          onChange={(e) => handleInputChange(section.key as keyof typeof settings, 'value', e.target.value)}
                          onBlur={() => handleInputBlur(section.key as keyof typeof settings, 'value')}
                          className="w-12 bg-dark-700 text-center font-medium rounded-lg py-1 text-white placeholder-gray-400 border border-gray-600"
                          placeholder="0"
                          style={{ 
                            color: 'white !important', 
                            backgroundColor: '#374151 !important',
                            caretColor: 'white',
                            outline: 'none'
                          }}
                        />
                        <span className="text-gray-400">{section.unit}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      {/* Start Button */}
      <button
        className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold rounded-lg 
          hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group animate-fade-in-up"
        onClick={handleStartWorkout}
        style={{ animationDelay: '0.3s' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        <div className="relative flex items-center justify-center space-x-2">
          <Play className="w-4 h-4" />
          <span className="text-sm">START WORKOUT</span>
        </div>
      </button>
    </div>
  );
};

export default TimerSettings; 