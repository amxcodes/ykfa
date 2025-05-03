import { useEffect, useState, memo } from 'react';
import { useLocation } from 'react-router-dom';

interface LoaderProps {
  loadingComplete: boolean;
}

const Loader = ({ loadingComplete }: LoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  
  // Only show loader on home page
  const isHomePage = location.pathname === '/';

  // Animate progress bar (simulate loading)
  useEffect(() => {
    if (!isHomePage) {
      setIsVisible(false);
      return;
    }
    if (loadingComplete) {
      setProgress(100);
      setTimeout(() => setIsVisible(false), 300);
      return;
    }
    let startTime: number;
    let animationFrameId: number;
    const animateLoader = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      // Simulate progress up to 95% until loadingComplete is true
      const maxProgress = 95;
      const newProgress = Math.min(maxProgress, (elapsedTime / 800) * 100);
      setProgress(newProgress);
      if (newProgress < maxProgress && !loadingComplete) {
        animationFrameId = requestAnimationFrame(animateLoader);
      }
    };
    animationFrameId = requestAnimationFrame(animateLoader);
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isHomePage, loadingComplete]);

  // Hide loader when not on home or when loading is done
  if (!isHomePage || !isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-dark-900"
      style={{
        opacity: progress === 100 ? 0 : 1,
        transition: 'opacity 0.3s ease-out',
        willChange: 'opacity',
      }}
    >
      {/* Decorative elements - using transform for better performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl"
          style={{
            transform: `scale(${0.8 + (progress * 0.003)})`,
            willChange: 'transform',
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl"
          style={{
            transform: `scale(${0.9 + (progress * 0.002)})`,
            willChange: 'transform',
          }}
        ></div>
      </div>
      {/* Logo with optimized animation */}
      <div 
        className="relative flex items-center justify-center mb-6 w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg shadow-amber-400/20"
        style={{
          transform: `scale(${0.9 + (progress * 0.001)})`,
          willChange: 'transform',
        }}
      >
        <img 
          src="/icons/dumbbell-small.svg" 
          alt="YKFA" 
          width="80"
          height="80"
          className="w-20 h-20 text-black z-10"
          style={{ 
            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      </div>
      {/* Welcome message */}
      <h2 
        className="text-2xl font-bold font-spaceGrotesk tracking-wide text-white mb-2 text-center"
        style={{
          opacity: progress > 10 ? 1 : 0,
          transform: `translateY(${progress > 10 ? 0 : 10}px)`,
          transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
          willChange: 'opacity, transform',
        }}
      >
        Welcome!
      </h2>
      <p
        className="text-base text-amber-400 mb-4 text-center"
        style={{
          opacity: progress > 15 ? 1 : 0,
          transform: `translateY(${progress > 15 ? 0 : 10}px)`,
          transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
          willChange: 'opacity, transform',
        }}
      >
        Please wait while all resources load.
      </p>
      {/* Progress bar */}
      <div className="w-64 h-2 bg-dark-700 rounded-full overflow-hidden relative mb-2">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
          style={{ 
            width: `${progress}%`,
            transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'width',
          }}
        ></div>
      </div>
      {/* Loading message with delayed fade-in */}
      <p 
        className="mt-1 text-sm text-gray-400 text-center"
        style={{
          opacity: progress > 20 ? 1 : 0,
          transition: 'opacity 0.3s ease-out',
          willChange: 'opacity',
        }}
      >
        Loading experience...
      </p>
      {/* Add CSS keyframes for animations */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default memo(Loader); 