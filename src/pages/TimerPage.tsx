import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useTimer } from 'react-timer-hook';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';

interface TimerSettings {
  warmupDuration: number;
  rounds: number;
  roundDuration: number;
  breakDuration: number;
  cooldownDuration: number;
}

const TimerPage = () => {
  const [settings, setSettings] = useState<TimerSettings>({
    warmupDuration: 120,
    rounds: 7,
    roundDuration: 180,
    breakDuration: 45,
    cooldownDuration: 120,
  });

  const [currentPhase, setCurrentPhase] = useState<'warmup' | 'round' | 'break' | 'cooldown' | 'complete'>('warmup');
  const [currentRound, setCurrentRound] = useState(1);
  const [isPaused, setIsPaused] = useState(true);

  // Sound effects
  const [playStart] = useSound('/sounds/start.mp3', { volume: 0.5 });
  const [playStop] = useSound('/sounds/stop.mp3', { volume: 0.5 });
  const [playRoundChange] = useSound('/sounds/round.mp3', { volume: 0.75 });

  const getExpiryTimestamp = (seconds: number) => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + seconds);
    return time;
  };

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

  // Effect to handle settings changes
  useEffect(() => {
    if (!isRunning) {
      restart(getExpiryTimestamp(getCurrentPhaseDuration()), false);
    }
  }, [settings]);

  const getCurrentPhaseDuration = () => {
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
  };

  function handlePhaseComplete() {
    playRoundChange();
    let nextPhase = currentPhase;
    let nextRound = currentRound;

    switch (currentPhase) {
      case 'warmup':
        nextPhase = 'round';
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
        setIsPaused(true);
        playStop();
        return;
    }

    setCurrentPhase(nextPhase);
    setCurrentRound(nextRound);
    restart(getExpiryTimestamp(
      nextPhase === 'round' ? settings.roundDuration :
      nextPhase === 'break' ? settings.breakDuration :
      nextPhase === 'cooldown' ? settings.cooldownDuration : 0
    ), !isPaused);
  }

  const formatTime = (m: number, s: number): string => {
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    const totalSeconds = minutes * 60 + seconds;
    const totalTime = getCurrentPhaseDuration();
    return ((totalTime - totalSeconds) / totalTime) * 100;
  };

  const resetTimer = () => {
    setCurrentPhase('warmup');
    setCurrentRound(1);
    setIsPaused(true);
    restart(getExpiryTimestamp(settings.warmupDuration), false);
    playStop();
  };

  const toggleTimer = () => {
    if (isRunning) {
      pause();
      setIsPaused(true);
      playStop();
    } else {
      start();
      setIsPaused(false);
      playStart();
    }
  };

  const updateSettings = (key: keyof TimerSettings, value: number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div 
              className="bg-dark-800 rounded-2xl p-6"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-bold mb-6">Workout Settings</h2>
              <div className="space-y-6">
                {/* Warmup Duration */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Duration of Warmup Phase
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="30"
                      max="300"
                      value={settings.warmupDuration}
                      onChange={(e) => updateSettings('warmupDuration', parseInt(e.target.value))}
                      className="flex-1 accent-amber-400"
                    />
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <input
                        type="number"
                        min="30"
                        max="300"
                        value={settings.warmupDuration}
                        onChange={(e) => updateSettings('warmupDuration', parseInt(e.target.value))}
                        className="w-16 px-2 py-1 bg-dark-700 rounded border border-dark-600 text-center"
                      />
                      <span className="text-sm text-gray-400">sec</span>
                    </div>
                  </div>
                </div>

                {/* Number of Rounds */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Number of Rounds
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={settings.rounds}
                      onChange={(e) => updateSettings('rounds', parseInt(e.target.value))}
                      className="flex-1 accent-amber-400"
                    />
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={settings.rounds}
                        onChange={(e) => updateSettings('rounds', parseInt(e.target.value))}
                        className="w-16 px-2 py-1 bg-dark-700 rounded border border-dark-600 text-center"
                      />
                      <span className="text-sm text-gray-400">rounds</span>
                    </div>
                  </div>
                </div>

                {/* Round Duration */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Duration of One Round
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="60"
                      max="300"
                      value={settings.roundDuration}
                      onChange={(e) => updateSettings('roundDuration', parseInt(e.target.value))}
                      className="flex-1 accent-amber-400"
                    />
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <input
                        type="number"
                        min="60"
                        max="300"
                        value={settings.roundDuration}
                        onChange={(e) => updateSettings('roundDuration', parseInt(e.target.value))}
                        className="w-16 px-2 py-1 bg-dark-700 rounded border border-dark-600 text-center"
                      />
                      <span className="text-sm text-gray-400">sec</span>
                    </div>
                  </div>
                </div>

                {/* Break Duration */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Duration of Break Between Rounds
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="15"
                      max="120"
                      value={settings.breakDuration}
                      onChange={(e) => updateSettings('breakDuration', parseInt(e.target.value))}
                      className="flex-1 accent-amber-400"
                    />
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <input
                        type="number"
                        min="15"
                        max="120"
                        value={settings.breakDuration}
                        onChange={(e) => updateSettings('breakDuration', parseInt(e.target.value))}
                        className="w-16 px-2 py-1 bg-dark-700 rounded border border-dark-600 text-center"
                      />
                      <span className="text-sm text-gray-400">sec</span>
                    </div>
                  </div>
                </div>

                {/* Cooldown Duration */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Duration of Cooldown Phase
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="30"
                      max="300"
                      value={settings.cooldownDuration}
                      onChange={(e) => updateSettings('cooldownDuration', parseInt(e.target.value))}
                      className="flex-1 accent-amber-400"
                    />
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <input
                        type="number"
                        min="30"
                        max="300"
                        value={settings.cooldownDuration}
                        onChange={(e) => updateSettings('cooldownDuration', parseInt(e.target.value))}
                        className="w-16 px-2 py-1 bg-dark-700 rounded border border-dark-600 text-center"
                      />
                      <span className="text-sm text-gray-400">sec</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-dark-800 rounded-2xl p-6 flex flex-col items-center justify-center"
              variants={itemVariants}
            >
              <div className="relative w-64 h-64 mb-6">
                {/* Background Circle */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <svg className="w-full h-full absolute">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      className="fill-none stroke-dark-700"
                      strokeWidth="8"
                    />
                  </svg>
                </motion.div>

                {/* Phase Progress Circle */}
                <motion.div
                  initial={{ rotate: -90 }}
                  animate={{
                    rotate: -90,
                    transition: { duration: 0.3 }
                  }}
                >
                  <svg className="w-full h-full absolute">
                    <motion.circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      className="fill-none stroke-amber-400"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 0.45 * 64}`}
                      animate={{
                        strokeDashoffset: `${2 * Math.PI * 0.45 * 64 * (1 - calculateProgress() / 100)}`
                      }}
                      transition={{ duration: 0.3, ease: "linear" }}
                    />
                  </svg>
                </motion.div>

                {/* Round Progress Circle */}
                <AnimatePresence>
                  {currentPhase === 'round' && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className="w-full h-full absolute transform -rotate-90">
                        <circle
                          cx="50%"
                          cy="50%"
                          r="40%"
                          className="fill-none stroke-amber-600/30"
                          strokeWidth="3"
                        />
                        <motion.circle
                          cx="50%"
                          cy="50%"
                          r="40%"
                          className="fill-none stroke-amber-600"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 0.40 * 64}`}
                          animate={{
                            strokeDashoffset: `${2 * Math.PI * 0.40 * 64 * (1 - (currentRound - 1) / settings.rounds)}`
                          }}
                          transition={{ duration: 0.5 }}
                        />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Timer Display */}
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  animate={isRunning ? {
                    scale: [1, 1.05, 1],
                    transition: {
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  } : {}}
                >
                  <motion.div
                    key={`${minutes}${seconds}`}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-4xl font-bold mb-2"
                  >
                    {formatTime(minutes, seconds)}
                  </motion.div>
                  <motion.div
                    key={currentPhase + currentRound}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-amber-400 font-medium"
                  >
                    {currentPhase === 'round'
                      ? `Round ${currentRound}/${settings.rounds}`
                      : currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
                  </motion.div>
                </motion.div>
              </div>

              {/* Controls */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTimer}
                  className={`btn ${isRunning ? 'btn-error' : 'btn-primary'} rounded-full w-12 h-12 flex items-center justify-center`}
                >
                  {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetTimer}
                  className="btn btn-outline rounded-full w-12 h-12 flex items-center justify-center"
                >
                  <RotateCcw className="w-6 h-6" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TimerPage;