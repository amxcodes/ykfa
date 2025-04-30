import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimerContext } from '../context/TimerContext';
import { 
  Play, Flame, Clock, Activity, Coffee, Fan, Volume2, Plus, Minus, VolumeX, Volume1, Sliders
} from 'lucide-react';
import { gsap } from 'gsap';

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
  
  // Add state for tracking muted status
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const previousVolume = useRef<number>(settings.soundVolume);
  
  // Set slider mode as default state
  const [isSliderMode, setIsSliderMode] = useState<boolean>(true);
  
  // Update input values when settings change
  useEffect(() => {
    const newInputValues: Record<string, { minutes?: string; seconds?: string; value?: string }> = {};
    
    // Build new input values from settings
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
  }, [settings]);

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
        // Clamp rounds between 1-99
        parsedValue = Math.max(1, Math.min(99, parsedValue));
      } else {
        // For transition delay and other simple values
        // Ensure minimum 5 seconds
        parsedValue = Math.max(5, Math.min(59, parsedValue));
      }
      
      // Update setting
      updateSettings(setting, parsedValue);
      animateSettingChange(`.${setting}-value`);
    }
  };

  // Handler for slider changes with smooth animation
  const handleSliderChange = (
    setting: keyof typeof settings,
    value: number
  ) => {
    if (setting === 'rounds') {
      // Rounds slider
      const roundsValue = Math.max(1, Math.min(99, value));
      updateSettings(setting, roundsValue);
    } else if (setting === 'transitionDelay') {
      // Transition delay slider (5-60 seconds)
      const delayValue = Math.max(5, Math.min(60, value));
      updateSettings(setting, delayValue);
    } else {
      // Time-based sliders (in seconds)
      // Round to ensure consistency
      const roundedValue = Math.round(value);
      updateSettings(setting, roundedValue);
    }
    
    // Animate the value change with a more subtle effect
    if (settingsRef.current) {
      const target = settingsRef.current.querySelector(`.${setting}-value`);
      if (target) {
        gsap.fromTo(
          target,
          { 
            scale: 1.1,
            color: '#fbbf24' // amber-400
          },
          { 
            scale: 1,
            color: '#ffffff',
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)'
          }
        );
      }
    }
  };

  useEffect(() => {
    // Reset the timer when entering settings view
    resetTimer();
  }, [resetTimer]);

  // Animation for settings changes
  const animateSettingChange = (element: string) => {
    if (settingsRef.current) {
      const target = settingsRef.current.querySelector(element);
      if (target) {
        gsap.fromTo(
          target,
          { scale: 1.1, color: '#60a5fa' },
          { scale: 1, color: '#ffffff', duration: 0.3, ease: 'power2.out' }
        );
      }
    }
  };

  // Animation to pulse the button when ready
  useEffect(() => {
    if (settingsRef.current) {
      const startButton = settingsRef.current.querySelector('.start-button');
      if (startButton) {
        gsap.to(startButton, {
          boxShadow: '0 0 0px rgba(96, 165, 250, 0), 0 0 15px rgba(96, 165, 250, 0.5), 0 0 0px rgba(96, 165, 250, 0)',
          repeat: -1,
          duration: 2,
          ease: 'sine.inOut'
        });
      }
    }
  }, []);

  const getMinutes = (totalSeconds: number) => {
    return Math.floor(totalSeconds / 60);
  };

  const getSeconds = (totalSeconds: number) => {
    return totalSeconds % 60;
  };

  const handleIncreaseRounds = () => {
    const newValue = settings.rounds + 1;
    if (newValue <= 99) {
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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    updateSettings('soundVolume', newVolume);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    if (isMuted) {
      // Unmute - restore previous volume or default to 0.5
      updateSettings('soundVolume', previousVolume.current > 0 ? previousVolume.current : 0.5);
      setIsMuted(false);
    } else {
      // Mute - save current volume first
      previousVolume.current = settings.soundVolume;
      updateSettings('soundVolume', 0);
      setIsMuted(true);
    }
  };
  
  // Function to get appropriate volume icon based on level
  const getVolumeIcon = () => {
    if (isMuted || settings.soundVolume === 0) {
      return <VolumeX className="w-5 h-5 text-pink-400" />;
    } else if (settings.soundVolume < 0.5) {
      return <Volume1 className="w-5 h-5 text-pink-400" />;
    } else {
      return <Volume2 className="w-5 h-5 text-pink-400" />;
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

  // Icons and colors for each section
  const settingSections = [
    { 
      key: 'warmupDuration', 
      label: 'Warm Up', 
      icon: <Flame className="w-5 h-5 text-cyan-400" />,
      color: 'bg-blue-900/30 border-blue-500/20 hover:bg-blue-800/30',
      unit: 's',
      showMinutes: true,
      sliderMin: 30,
      sliderMax: 300,
      sliderStep: 30
    },
    { 
      key: 'rounds', 
      label: 'Rounds', 
      icon: <Activity className="w-5 h-5 text-amber-400" />,
      color: 'bg-amber-900/30 border-amber-500/20 hover:bg-amber-800/30',
      unit: '',
      showMinutes: false,
      sliderMin: 1,
      sliderMax: 20,
      sliderStep: 1
    },
    { 
      key: 'roundDuration', 
      label: 'Round Time', 
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      color: 'bg-amber-900/30 border-amber-500/20 hover:bg-amber-800/30',
      unit: 's',
      showMinutes: true,
      sliderMin: 30,
      sliderMax: 600,
      sliderStep: 30
    },
    { 
      key: 'breakDuration', 
      label: 'Break Time', 
      icon: <Coffee className="w-5 h-5 text-green-400" />,
      color: 'bg-green-900/30 border-green-500/20 hover:bg-green-800/30',
      unit: 's',
      showMinutes: true,
      sliderMin: 15,
      sliderMax: 300,
      sliderStep: 15
    },
    { 
      key: 'cooldownDuration', 
      label: 'Cool Down', 
      icon: <Fan className="w-5 h-5 text-blue-400" />,
      color: 'bg-blue-900/30 border-blue-500/20 hover:bg-blue-800/30',
      unit: 's',
      showMinutes: true,
      sliderMin: 30,
      sliderMax: 300,
      sliderStep: 30
    },
    {
      key: 'transitionDelay',
      label: 'Transition',
      icon: <Clock className="w-5 h-5 text-purple-400" />,
      color: 'bg-purple-900/30 border-purple-500/20 hover:bg-purple-800/30',
      unit: 's',
      showMinutes: false,
      sliderMin: 3,
      sliderMax: 10,
      sliderStep: 1
    }
  ];

  // Function to format time for slider labels
  const formatTimeForSlider = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) {
      return `${secs}s`;
    } else if (secs === 0) {
      return `${mins}m`;
    } else {
      return `${mins}m ${secs}s`;
    }
  };

  return (
    <div 
      ref={settingsRef}
      className={`bg-black/70 backdrop-blur-md rounded-lg p-5 border border-white/10 ${className} max-w-md mx-auto w-full overflow-hidden`}
    >
      <motion.h2 
        className="text-xl md:text-2xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Workout Timer Settings
      </motion.h2>

      {/* Toggle switch for slider mode */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-2 bg-dark-800/80 rounded-lg p-2">
          <span className={`text-sm ${!isSliderMode ? 'text-amber-400' : 'text-gray-400'}`}>Input</span>
          <button 
            onClick={() => setIsSliderMode(!isSliderMode)}
            className="relative w-12 h-6 transition-colors duration-300 rounded-full focus:outline-none"
          >
            <div className={`absolute inset-0 rounded-full transition-colors ${isSliderMode ? 'bg-amber-500' : 'bg-gray-600'}`}></div>
            <motion.div 
              className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow"
              initial={false}
              animate={{ 
                x: isSliderMode ? 24 : 0 
              }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 20
              }}
            />
            <motion.div
              className="absolute right-1 top-0.5 w-4 h-4 text-black"
              initial={false}
              animate={{ 
                opacity: isSliderMode ? 1 : 0 
              }}
              transition={{ duration: 0.2 }}
            >
              <Sliders className="w-full h-full" />
            </motion.div>
          </button>
          <span className={`text-sm ${isSliderMode ? 'text-amber-400' : 'text-gray-400'}`}>Slider</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <AnimatePresence mode="wait">
          {settingSections.map((section, index) => (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`
                ${section.color} 
                border rounded-lg p-3 transition-all duration-200 backdrop-blur-sm
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {section.icon}
                  <span>{section.label}</span>
                </div>
                
                {isSliderMode ? (
                  <div className="w-full ml-4">
                    <div className="flex items-center justify-between">
                      <div className="w-9/12">
                        <input
                          type="range"
                          min={section.sliderMin}
                          max={section.sliderMax}
                          step={section.sliderStep}
                          value={settings[section.key as keyof typeof settings] as number}
                          onChange={(e) => handleSliderChange(section.key as keyof typeof settings, parseInt(e.target.value, 10))}
                          className="w-full h-2 bg-dark-800 rounded-lg appearance-none cursor-pointer 
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 
                            [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:hover:bg-amber-300
                            [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:shadow-md"
                        />
                      </div>
                      <motion.div 
                        className={`w-3/12 text-right font-semibold ${section.key}-value`}
                        initial={false}
                        animate={{ scale: 1 }}
                        key={String(settings[section.key as keyof typeof settings])}
                      >
                        {section.key === 'rounds' 
                          ? settings.rounds 
                          : section.key === 'transitionDelay'
                            ? `${settings.transitionDelay}s`
                            : formatTimeForSlider(settings[section.key as keyof typeof settings] as number)
                        }
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    {section.key === 'rounds' ? (
                      <div className="flex items-center space-x-2">
                        <motion.button
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-800 hover:bg-dark-700 transition-colors"
                          whileTap={{ scale: 0.95 }}
                          onClick={handleDecreaseRounds}
                          disabled={settings.rounds <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>
                        
                        <input
                          type="text"
                          value={inputValues[section.key]?.value || settings.rounds.toString()}
                          onChange={(e) => handleInputChange(section.key as keyof typeof settings, 'value', e.target.value)}
                          onBlur={() => handleInputBlur(section.key as keyof typeof settings, 'value')}
                          className="w-10 bg-dark-800 text-center font-semibold rounds-value"
                        />
                        
                        <motion.button
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-800 hover:bg-dark-700 transition-colors"
                          whileTap={{ scale: 0.95 }}
                          onClick={handleIncreaseRounds}
                          disabled={settings.rounds >= 99}
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>
                    ) : section.showMinutes ? (
                      <div className="flex items-center">
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={inputValues[section.key]?.minutes || getMinutes(settings[section.key as keyof typeof settings] as number).toString()}
                            onChange={(e) => handleInputChange(section.key as keyof typeof settings, 'minutes', e.target.value)}
                            onBlur={() => handleInputBlur(section.key as keyof typeof settings, 'minutes')}
                            className={`w-12 bg-dark-800 text-center font-semibold rounded-l px-2 py-1 ${section.key}-minutes-value`}
                          />
                          <span className="mx-1">m</span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={inputValues[section.key]?.seconds || getSeconds(settings[section.key as keyof typeof settings] as number).toString()}
                            onChange={(e) => handleInputChange(section.key as keyof typeof settings, 'seconds', e.target.value)}
                            onBlur={() => handleInputBlur(section.key as keyof typeof settings, 'seconds')}
                            className={`w-12 bg-dark-800 text-center font-semibold rounded-l px-2 py-1 ${section.key}-seconds-value`}
                          />
                          <span className="ml-1">s</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={inputValues[section.key]?.value || settings[section.key as keyof typeof settings].toString()}
                          onChange={(e) => handleInputChange(section.key as keyof typeof settings, 'value', e.target.value)}
                          onBlur={() => handleInputBlur(section.key as keyof typeof settings, 'value')}
                          className={`w-12 bg-dark-800 text-center font-semibold rounded px-2 py-1 ${section.key}-value`}
                        />
                        <span className="ml-1">{section.unit}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Sound Volume Control */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, delay: settingSections.length * 0.05 }}
            className="bg-pink-900/30 border-pink-500/20 hover:bg-pink-800/30 border rounded-lg p-3 transition-all duration-200 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMute}
                  className="p-1 rounded-full hover:bg-pink-800/40 transition-colors"
                >
                  {getVolumeIcon()}
                </motion.button>
                <span>Sound Volume</span>
              </div>
              <div className="flex items-center space-x-2 w-32">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.soundVolume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-dark-800 rounded-lg appearance-none cursor-pointer 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-400
                    [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:hover:bg-pink-300
                    [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:shadow-md"
                />
                <motion.div 
                  className={`w-8 text-center font-semibold soundVolume-value ${settings.soundVolume === 0 ? 'text-pink-500/50' : 'text-pink-400'}`}
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    duration: 0.3,
                    ease: "easeOut",
                    times: [0, 0.6, 1]
                  }}
                  key={settings.soundVolume}
                >
                  {Math.round(settings.soundVolume * 10)}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.button
        className="start-button w-full py-3 px-5 bg-blue-600/70 backdrop-blur-md hover:bg-blue-700/80 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-none border border-white/10"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleStartWorkout}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Play className="w-5 h-5" />
        <span>Start Workout</span>
      </motion.button>
    </div>
  );
};

export default TimerSettings; 