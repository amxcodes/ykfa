import { useEffect, useState, memo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface LoaderProps {
  loadingComplete: boolean;
}

const Loader = ({ loadingComplete }: LoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  const loaderRef = useRef<HTMLDivElement>(null);
  
  // Only show loader on home page
  const isHomePage = location.pathname === '/';

  // Force hide loader after 5 seconds no matter what
  useEffect(() => {
    const forceHideTimer = setTimeout(() => {
      setIsVisible(false);
      
      // Also directly modify the DOM element to ensure it disappears
      if (loaderRef.current) {
        loaderRef.current.style.display = 'none';
      }
    }, 5000);
    
    return () => clearTimeout(forceHideTimer);
  }, []);

  // Animate progress bar (simulate loading) - reduced to 1 second total
  useEffect(() => {
    if (!isHomePage) {
      setIsVisible(false);
      return;
    }
    if (loadingComplete) {
      setProgress(100);
      setTimeout(() => setIsVisible(false), 200); // Faster fade-out
      return;
    }
    let startTime: number;
    let animationFrameId: number;
    const animateLoader = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      // Simulate progress within 1 second
      const maxProgress = 98;
      const newProgress = Math.min(maxProgress, (elapsedTime / 500) * 100);
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
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
      style={{
        opacity: progress === 100 ? 0 : 1,
        transition: 'opacity 0.3s ease-out',
        willChange: 'opacity',
      }}
    >
      {/* Particle effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-25"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              backgroundColor: 'rgba(245, 158, 11, 0.5)',
              borderRadius: '50%',
              boxShadow: '0 0 2px rgba(245, 158, 11, 0.3)',
              transform: `scale(${0.5 + Math.sin(progress * 0.03 + i) * 0.5})`,
              transition: 'transform 1s ease-out',
            }}
          />
        ))}
      </div>

      {/* Main loader element */}
      <div 
        className="relative"
        style={{
          width: '170px',
          height: '170px',
        }}
      >
        {/* Outer spinning ring - slower */}
        <svg 
          className="absolute inset-0 z-10 animate-spin-reverse"
          viewBox="0 0 100 100"
          style={{
            animationDuration: '30s',
          }}
        >
          <defs>
            <linearGradient id="outerRingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(245, 158, 11, 0.08)" />
              <stop offset="50%" stopColor="rgba(245, 158, 11, 0.15)" />
              <stop offset="100%" stopColor="rgba(245, 158, 11, 0.08)" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="49"
            fill="none"
            strokeWidth="0.5"
            stroke="url(#outerRingGradient)"
            strokeDasharray="3,17"
          />
        </svg>
        
        {/* Middle spinning ring - faster rotation */}
        <svg 
          className="absolute inset-0 z-10 animate-spin-slow"
          viewBox="0 0 100 100"
          style={{
            animationDuration: '20s',
          }}
        >
          <defs>
            <linearGradient id="middleRingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(245, 158, 11, 0.05)" />
              <stop offset="50%" stopColor="rgba(245, 158, 11, 0.12)" />
              <stop offset="100%" stopColor="rgba(245, 158, 11, 0.05)" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            strokeWidth="0.5"
            stroke="url(#middleRingGradient)"
            strokeDasharray="5,15"
          />
        </svg>
        
        {/* Logo in center with subtle float animation */}
        <div 
          className="absolute inset-0 flex items-center justify-center z-20"
          style={{
            opacity: progress > 10 ? 1 : 0,
            transition: 'opacity 0.4s ease-out',
          }}
        >
          <div className="animate-float">
            <img 
              src="https://i.postimg.cc/g0mqFF16/favicon.png" 
              alt="YKFA" 
              width="60"
              height="60"
              className="w-14 h-14 text-amber-400"
              style={{ filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.3))' }}
              onLoad={(e) => {
                const img = new Image();
                img.onload = () => {
                  (e.target as HTMLImageElement).src = "/icons/dumbbell-small.svg";
                };
                img.onerror = () => {}; // Keep fallback image
                img.src = "/icons/dumbbell-small.svg";
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://i.postimg.cc/g0mqFF16/favicon.png";
              }}
            />
          </div>
        </div>
        
        {/* Main progress circle */}
        <svg 
          className="absolute inset-0 z-10"
          viewBox="0 0 100 100"
          style={{
            transform: 'rotate(-90deg)',
            overflow: 'visible',
          }}
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            strokeWidth="1"
            stroke="rgba(255, 255, 255, 0.05)"
          />
          
          {/* Secondary progress circle (glow effect) */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            strokeWidth="1.5"
            stroke="rgba(245, 158, 11, 0.15)"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * progress / 100 * 1.05)}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.6s ease-out',
              filter: 'blur(4px)',
            }}
          />
          
          {/* Main progress arc with gradient */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            strokeWidth="2"
            stroke="url(#progressGradient)"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * progress / 100)}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.5s ease-out',
              filter: 'drop-shadow(0 0 2px rgba(245, 158, 11, 0.6))'
            }}
          />
          
          {/* Progress indicators */}
          <circle
            cx="50"
            cy="10"
            r="2"
            fill="#f59e0b"
            transform={`rotate(${progress * 3.6}, 50, 50)`}
            style={{
              transition: 'transform 0.2s ease-out',
              filter: 'drop-shadow(0 0 2px rgba(245, 158, 11, 0.5))',
            }}
          />
          
          <circle
            cx="50"
            cy="10"
            r="1"
            fill="#fbbf24"
            transform={`rotate(${progress * 3.6 + 10}, 50, 50)`}
            style={{
              transition: 'transform 0.2s ease-out',
              opacity: 0.7,
            }}
          />
        </svg>
      </div>
      
      {/* Add animations */}
      <style>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        @keyframes spin-reverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 25s linear infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2px, 2px); }
          50% { transform: translate(0, -2px); }
          75% { transform: translate(2px, 1px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default memo(Loader); 