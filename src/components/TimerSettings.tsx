import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimerContext } from '../context/TimerContext';
import { 
  Play, Flame, Clock, Activity, Coffee, Fan, Volume2, Plus, Minus
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
          boxShadow: ['0 0 0px rgba(96, 165, 250, 0)', '0 0 15px rgba(96, 165, 250, 0.5)', '0 0 0px rgba(96, 165, 250, 0)'],
          repeat: -1,
          duration: 2,
          ease: 'sine.inOut'
        });
      }
    }
  }, []);

  const handleTimeChange = (setting: keyof typeof settings, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 999) {
      updateSettings(setting, numValue);
      animateSettingChange(`.${setting}-value`);
    }
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
      color: 'bg-cyan-800/20 border-cyan-600/30 hover:bg-cyan-700/30',
      unit: 's'
    },
    { 
      key: 'rounds', 
      label: 'Rounds', 
      icon: <Activity className="w-5 h-5 text-amber-400" />,
      color: 'bg-amber-800/20 border-amber-600/30 hover:bg-amber-700/30',
      unit: ''
    },
    { 
      key: 'roundDuration', 
      label: 'Round Time', 
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      color: 'bg-amber-800/20 border-amber-600/30 hover:bg-amber-700/30',
      unit: 's'
    },
    { 
      key: 'breakDuration', 
      label: 'Break Time', 
      icon: <Coffee className="w-5 h-5 text-green-400" />,
      color: 'bg-green-800/20 border-green-600/30 hover:bg-green-700/30',
      unit: 's'
    },
    { 
      key: 'cooldownDuration', 
      label: 'Cool Down', 
      icon: <Fan className="w-5 h-5 text-blue-400" />,
      color: 'bg-blue-800/20 border-blue-600/30 hover:bg-blue-700/30',
      unit: 's'
    },
    {
      key: 'transitionDelay',
      label: 'Transition',
      icon: <Clock className="w-5 h-5 text-purple-400" />,
      color: 'bg-purple-800/20 border-purple-600/30 hover:bg-purple-700/30',
      unit: 's'
    }
  ];

  return (
    <div 
      ref={settingsRef}
      className={`bg-dark-900 rounded-lg p-5 ${className} max-w-md mx-auto w-full overflow-hidden`}
    >
      <motion.h2 
        className="text-xl md:text-2xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Workout Timer Settings
      </motion.h2>

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
                border rounded-lg p-3 transition-all duration-200
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {section.icon}
                  <span>{section.label}</span>
                </div>
                
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
                      
                      <div 
                        className="w-10 text-center font-semibold rounds-value"
                      >
                        {settings.rounds}
                      </div>
                      
                      <motion.button
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-800 hover:bg-dark-700 transition-colors"
                        whileTap={{ scale: 0.95 }}
                        onClick={handleIncreaseRounds}
                        disabled={settings.rounds >= 99}
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="1"
                        max="999"
                        value={settings[section.key as keyof typeof settings]}
                        onChange={(e) => handleTimeChange(section.key as keyof typeof settings, e.target.value)}
                        className={`w-16 bg-dark-800 text-center font-semibold rounded px-2 py-1 ${section.key}-value`}
                      />
                      <span className="ml-1">{section.unit}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Sound Volume Control */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, delay: settingSections.length * 0.05 }}
            className="bg-pink-800/20 border-pink-600/30 hover:bg-pink-700/30 border rounded-lg p-3 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-5 h-5 text-pink-400" />
                <span>Sound Volume</span>
              </div>
              <div className="flex items-center space-x-2 w-28">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.soundVolume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-dark-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-400"
                />
                <div className="w-8 text-center font-semibold soundVolume-value">
                  {Math.round(settings.soundVolume * 10)}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.button
        className="start-button w-full py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg"
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