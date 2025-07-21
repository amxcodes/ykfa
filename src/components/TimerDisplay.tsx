import { useTimerContext } from '../context/TimerContext';

const phaseColors = {
  warmup: '#60a5fa', // blue
  round: '#fbbf24', // amber
  break: '#4ade80', // green
  cooldown: '#60a5fa', // blue
  complete: '#a855f7', // purple
};

const TimerDisplay = ({ className = '', fullscreen = false }) => {
  const {
    currentPhase,
    currentRound,
    settings,
    minutes,
    seconds
  } = useTimerContext();

  const bgColor = phaseColors[currentPhase] || '#fbbf24';

  return (
    <div
      className={`flex flex-col items-center justify-center w-full ${fullscreen ? 'min-h-screen' : ''} ${className}`}
      style={{ 
        background: bgColor, 
        minHeight: fullscreen ? '100vh' : undefined,
        fontFamily: 'monospace'
      }}
    >
      {/* Phase and round label - mobile optimized */}
      <div 
        className="text-white/90 mb-4 sm:mb-6 md:mb-8 tracking-widest uppercase font-mono"
        style={{
          fontSize: fullscreen ? '0.75rem sm:text-base md:text-lg' : '0.75rem sm:text-sm md:text-base',
          fontWeight: '500',
          letterSpacing: '0.15em sm:tracking-widest md:tracking-widest'
        }}
      >
        {currentPhase === 'round' ? `ROUND ${currentRound}/${settings.rounds}` : currentPhase.toUpperCase()}
      </div>
      
      {/* Large digital time display - mobile responsive */}
            <div 
        className="select-none font-mono text-center text-white"
              style={{ 
          fontSize: fullscreen 
            ? 'clamp(4rem, 15vw, 12rem)' 
            : 'clamp(3rem, 12vw, 8rem)',
          fontWeight: '900',
          letterSpacing: '0.05em sm:tracking-wider md:tracking-widest',
          lineHeight: '0.9',
          textShadow: 'none',
          fontVariantNumeric: 'tabular-nums'
        }}
      >
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
    </div>
  );
};

export default TimerDisplay; 