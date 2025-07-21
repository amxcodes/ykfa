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

  // Force hide loader after 3 seconds and signal completion
  useEffect(() => {
    const forceHideTimer = setTimeout(() => {
      setIsVisible(false);
      
      // Signal to browser that loading is complete
      window.dispatchEvent(new Event('load'));
      
      // Remove loading indicator from browser tab
      if (document.title.includes('Loading')) {
        document.title = document.title.replace(' - Loading...', '');
      }
      
      // Also directly modify the DOM element to ensure it disappears
      if (loaderRef.current) {
        loaderRef.current.style.display = 'none';
      }
    }, 3000);
    
    return () => clearTimeout(forceHideTimer);
  }, []);

  // Simple progress animation
  useEffect(() => {
    if (!isHomePage || loadingComplete) {
      return;
    }
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [isHomePage, loadingComplete]);

  // Hide loader when not on home or when loading is done
  if (!isHomePage || !isVisible) return null;

  return (
    <div 
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
      style={{
        opacity: progress >= 95 ? 0 : 1,
        transition: 'opacity 0.3s ease-out',
      }}
    >
      {/* Simplified loader with reduced complexity */}
      <div 
        className="relative"
        style={{
          width: '120px',
          height: '120px',
        }}
      >
        {/* Simple spinning ring */}
        <svg 
          className="absolute inset-0 animate-spin"
          viewBox="0 0 100 100"
          style={{
            animationDuration: '2s',
          }}
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="3"
            stroke="rgba(245, 158, 11, 0.3)"
            strokeDasharray="10,20"
          />
        </svg>
        
        {/* Logo in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="/img/favicon.webp" 
            alt="YKFA" 
            width="60"
            height="60"
            className="w-12 h-12"
            style={{ filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.3))' }}
          />
        </div>
        
        {/* Simple progress circle */}
        <svg 
          className="absolute inset-0"
          viewBox="0 0 100 100"
          style={{
            transform: 'rotate(-90deg)',
          }}
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            strokeWidth="4"
            stroke="rgba(245, 158, 11, 0.2)"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            strokeWidth="4"
            stroke="rgba(245, 158, 11, 0.8)"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
            style={{
              transition: 'stroke-dashoffset 0.3s ease-out',
            }}
          />
        </svg>
      </div>
      
      {/* Loading text */}
      <div className="mt-6 text-center">
        <p className="text-amber-400 text-sm font-medium">Loading YKFA</p>
        <p className="text-gray-400 text-xs mt-1">{Math.round(progress)}%</p>
      </div>
    </div>
  );
};

export default memo(Loader); 