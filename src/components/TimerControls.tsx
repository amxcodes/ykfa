// import { motion } from 'framer-motion'; // Replaced with CSS animations
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useTimerContext } from '../context/TimerContext';
import { memo, ReactNode } from 'react';

interface MinimalButtonProps {
  onClick?: () => void;
  icon: ReactNode;
  label: string;
  disabled?: boolean;
}

const MinimalButton = memo(({ onClick, icon, label, disabled }: MinimalButtonProps) => (
  <button
    onClick={onClick}
    className="mx-2 p-2 rounded-full text-white hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors"
    aria-label={label}
    disabled={disabled}
    style={{ background: 'none', border: 'none', boxShadow: 'none' }}
  >
    {icon}
  </button>
));

const TimerControls = ({ className = '' }) => {
  const { isRunning, toggleTimer, resetTimer, transitionActive, isWorkoutSoundMuted, toggleWorkoutSoundMute } = useTimerContext();

  return (
    <div className={`flex justify-center items-center mt-6 ${className}`}>
      <MinimalButton
        onClick={!transitionActive ? toggleTimer : undefined}
        icon={isRunning ? <Pause size={32} /> : <Play size={32} />}
        label={isRunning ? 'Pause' : 'Start'}
        disabled={transitionActive}
      />
      <MinimalButton
        onClick={!transitionActive ? resetTimer : undefined}
        icon={<RotateCcw size={28} />}
        label="Reset"
        disabled={transitionActive}
      />
      <MinimalButton
        onClick={!transitionActive ? toggleWorkoutSoundMute : undefined}
        icon={isWorkoutSoundMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
        label={isWorkoutSoundMuted ? 'Unmute workout sounds' : 'Mute workout sounds'}
        disabled={transitionActive}
      />
    </div>
  );
};

export default memo(TimerControls); 