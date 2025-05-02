import { useEffect, useState } from 'react';

const Loader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-dark-900">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Logo */}
      <div className="relative flex items-center justify-center mb-8 w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg shadow-amber-400/20">
        <img 
          src="/icons/dumbbell-small.svg" 
          alt="YKFA" 
          className="w-16 h-16 text-black z-10 animate-pulse"
          style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }}
        />
      </div>
      
      {/* Loading text */}
      <h2 className="text-xl font-bold font-spaceGrotesk tracking-wide text-white mb-4">
        Yaseen's <span className="text-amber-400">YKFA</span>
      </h2>
      
      {/* Progress bar */}
      <div className="w-64 h-1.5 bg-dark-700 rounded-full overflow-hidden relative">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
          style={{ 
            width: `${progress}%`,
            transition: 'width 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        ></div>
      </div>
      
      {/* Loading message */}
      <p className="mt-3 text-sm text-gray-400">Loading experience...</p>
    </div>
  );
};

export default Loader; 