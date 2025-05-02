import { useEffect, useState, memo } from 'react';
import { useLocation } from 'react-router-dom';

const Loader = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  
  // Only show loader on home page
  const isHomePage = location.pathname === '/';
  
  useEffect(() => {
    if (!isHomePage) {
      setIsVisible(false);
      return;
    }
    
    // Optimized animation sequence with requestAnimationFrame
    let startTime: number;
    let animationFrameId: number;
    
    const animateLoader = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      
      // Faster initial progress then slows down (easeOut effect)
      const newProgress = Math.min(100, (elapsedTime / 800) * 100);
      setProgress(newProgress);
      
      if (newProgress < 100) {
        animationFrameId = requestAnimationFrame(animateLoader);
      } else {
        // Fade out loader after progress completes
        setTimeout(() => {
          setIsVisible(false);
        }, 200);
      }
    };
    
    // Start animation
    animationFrameId = requestAnimationFrame(animateLoader);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isHomePage]);
  
  // Don't render anything if not on home page or animation is complete
  if (!isHomePage || !isVisible) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-dark-900"
      style={{
        opacity: progress === 100 ? 0 : 1,
        transition: 'opacity 0.3s ease-out',
        willChange: 'opacity', // Performance hint for browsers
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
        className="relative flex items-center justify-center mb-8 w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg shadow-amber-400/20"
        style={{
          transform: `scale(${0.9 + (progress * 0.001)})`,
          willChange: 'transform',
        }}
      >
        <img 
          src="/icons/dumbbell-small.svg" 
          alt="YKFA" 
          width="64"
          height="64"
          className="w-16 h-16 text-black z-10"
          style={{ 
            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      </div>
      
      {/* Loading text with staggered fade-in */}
      <h2 
        className="text-xl font-bold font-spaceGrotesk tracking-wide text-white mb-4"
        style={{
          opacity: progress > 10 ? 1 : 0,
          transform: `translateY(${progress > 10 ? 0 : 10}px)`,
          transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
          willChange: 'opacity, transform',
        }}
      >
        Yaseen's <span className="text-amber-400">YKFA</span>
      </h2>
      
      {/* Progress bar */}
      <div className="w-64 h-1.5 bg-dark-700 rounded-full overflow-hidden relative">
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
        className="mt-3 text-sm text-gray-400"
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

// Memoize component to prevent unnecessary re-renders
export default memo(Loader); 