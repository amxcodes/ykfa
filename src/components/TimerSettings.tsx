import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimerContext } from '../context/TimerContext';
import { 
  Play, Flame, Clock, Activity, Coffee, Fan, Volume2, Plus, Minus, VolumeX, Volume1} from 'lucide-react';
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
      parsedValue = 0;
    }
    
    if (type === 'minutes') {
      // Clamp minutes between 0-99
      parsedValue = Math.max(0, Math.min(99, parsedValue));
      
      // Get current seconds
      const seconds = parseInt(inputValues[setting]?.seconds || '0', 10) || 0;
      
      // Calculate new total time
      let totalSeconds = (parsedValue * 60) + seconds;
      
      // Update setting
      updateSettings(setting, totalSeconds);
      animateSettingChange(`.${setting}-value`);
      
    } else if (type === 'seconds') {
      // Clamp seconds between 0-59
      parsedValue = Math.max(0, Math.min(59, parsedValue));
      
      // Get current minutes
      const minutes = parseInt(inputValues[setting]?.minutes || '0', 10) || 0;
      
      // Calculate new total time
      const totalSeconds = (minutes * 60) + parsedValue;
      
      // Update setting
      updateSettings(setting, totalSeconds);
      animateSettingChange(`.${setting}-value`);
      
    } else { // type === 'value'
      if (setting === 'rounds') {
        // Clamp rounds between 1-99
        parsedValue = Math.max(1, Math.min(99, parsedValue));
      } else if (setting === 'transitionDelay') {
        // For transition delay, allow 0 as minimum
        parsedValue = Math.max(0, Math.min(10, parsedValue));
      } else {
        // For other simple values, allow 0 as minimum
        parsedValue = Math.max(0, Math.min(59, parsedValue));
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
      // Transition delay slider (0-10 seconds)
      const delayValue = Math.max(0, Math.min(10, value));
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

  // Function to format time for slider labels

  return (
    <div 
      ref={settingsRef}
      className={`bg-dark-900/95 backdrop-blur-xl rounded-xl p-4 border border-white/10 shadow-2xl ${className} max-w-sm mx-auto w-full overflow-hidden`}
    >
      {/* Header with gradient text */}
      <motion.div 
        className="text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
          Workout Timer Settings
        </h2>
        <p className="text-gray-400 mt-1 text-xs">Customize your workout experience</p>
      </motion.div>

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
        <AnimatePresence mode="sync">
          {settingSections.map((section, index) => (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-dark-800/50 rounded-lg p-3 border border-white/5 hover:border-amber-500/30 transition-all duration-300"
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
                        onChange={(e) => handleSliderChange(section.key as keyof typeof settings, parseInt(e.target.value, 10))}
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
                        <motion.button
                          className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"
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
                          className="w-12 bg-dark-700 text-center font-medium rounded-lg py-1"
                        />
                        
                        <motion.button
                          className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"
                          whileTap={{ scale: 0.95 }}
                          onClick={handleIncreaseRounds}
                          disabled={settings.rounds >= 99}
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>
                    ) : section.showMinutes ? (
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            value={inputValues[section.key]?.minutes || getMinutes(settings[section.key as keyof typeof settings] as number).toString()}
                            onChange={(e) => handleInputChange(section.key as keyof typeof settings, 'minutes', e.target.value)}
                            onBlur={() => handleInputBlur(section.key as keyof typeof settings, 'minutes')}
                            className="w-12 bg-dark-700 text-center font-medium rounded-lg py-1"
                          />
                          <span className="text-gray-400">m</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            value={inputValues[section.key]?.seconds || getSeconds(settings[section.key as keyof typeof settings] as number).toString()}
                            onChange={(e) => handleInputChange(section.key as keyof typeof settings, 'seconds', e.target.value)}
                            onBlur={() => handleInputBlur(section.key as keyof typeof settings, 'seconds')}
                            className="w-12 bg-dark-700 text-center font-medium rounded-lg py-1"
                          />
                          <span className="text-gray-400">s</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <input
                          type="text"
                          value={inputValues[section.key]?.value || settings[section.key as keyof typeof settings].toString()}
                          onChange={(e) => handleInputChange(section.key as keyof typeof settings, 'value', e.target.value)}
                          onBlur={() => handleInputBlur(section.key as keyof typeof settings, 'value')}
                          className="w-12 bg-dark-700 text-center font-medium rounded-lg py-1"
                        />
                        <span className="text-gray-400">{section.unit}</span>
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
            className="bg-dark-800/50 rounded-lg p-3 border border-white/5 hover:border-amber-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                >
                  {getVolumeIcon()}
                </motion.button>
                <span className="font-medium text-white text-sm">Sound Volume</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.soundVolume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 bg-dark-700 rounded-lg appearance-none cursor-pointer 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 
                    [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:hover:bg-amber-300
                    [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:shadow-lg"
                />
                <span className="text-amber-400 font-medium text-sm w-6 text-right">
                  {Math.round(settings.soundVolume * 10)}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Start Button */}
      <motion.button
        className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold rounded-lg 
          hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all duration-300 relative overflow-hidden group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleStartWorkout}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        <div className="relative flex items-center justify-center space-x-2">
          <Play className="w-4 h-4" />
          <span className="text-sm">START WORKOUT</span>
        </div>
      </motion.button>
    </div>
  );
};

export default TimerSettings; 