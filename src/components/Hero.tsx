import { useEffect, useState, useRef } from 'react';

interface HeroProps {
  loadingComplete?: boolean;
}

const Hero = ({ loadingComplete = false }: HeroProps) => {
  const [animatedNumbers, setAnimatedNumbers] = useState({
    trainers: 0,
    programs: 0,
    members: 0,
    years: 0
  });

  const statsRef = useRef(null);
  const hasAnimated = useRef(false);
  
  // Force animation to start regardless of loading state
  useEffect(() => {
    console.log('Hero mounted, will start animations');
    
    // Start animation after a short delay to ensure component is fully mounted
    const initialDelay = setTimeout(() => {
      console.log('Starting animations now');
      hasAnimated.current = true;
      animateNumbers();
    }, 1000); // Delay animation start by 1 second
    
    return () => clearTimeout(initialDelay);
  }, []);
  
  // Backup animation trigger when loading completes
  useEffect(() => {
    if (loadingComplete && !hasAnimated.current) {
      console.log('Loader complete, starting animations');
      hasAnimated.current = true;
      animateNumbers();
    }
  }, [loadingComplete]);

  // Fallback animation trigger using IntersectionObserver
  // Only used if the loader-based trigger doesn't work
  useEffect(() => {
    // Only set up the observer if animations haven't started yet
    if (hasAnimated.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          console.log('Stats section visible, starting animations');
          hasAnimated.current = true;
          animateNumbers();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  // Ref to store the animation timer
  const timerRef = useRef<number | null>(null);
  
  // Clean up the timer when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const animateNumbers = () => {
    console.log('Starting number animation'); // Debug log
    
    // Reset numbers first to ensure animation is visible
    setAnimatedNumbers({
      trainers: 0,
      programs: 0,
      members: 0,
      years: 0
    });
    
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    const targetNumbers = {
      trainers: 5,
      programs: 10,
      members: 500,
      years: 20
    };

    let currentStep = 0;
    
    // Clear any existing timer before starting a new one
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Start the animation immediately
    timerRef.current = window.setInterval(() => {
      currentStep++;
      
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4); // Easing function

      setAnimatedNumbers({
        trainers: Math.round(targetNumbers.trainers * easeOutQuart),
        programs: Math.round(targetNumbers.programs * easeOutQuart),
        members: Math.round(targetNumbers.members * easeOutQuart),
        years: Math.round(targetNumbers.years * easeOutQuart)
      });

      if (currentStep === steps) {
        if (timerRef.current !== null) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }, interval);
  };

  return (
    <section className="hero-section relative min-h-[90vh] md:min-h-screen flex items-center bg-black">
      {/* Background video with overlay */}
      <div className="absolute inset-0 z-0 bg-black overflow-hidden">
        <video 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          autoPlay 
          muted 
          loop 
          playsInline
          poster="https://images.pexels.com/photos/4761352/pexels-photo-4761352.jpeg?auto=compress&cs=tinysrgb&w=1920"
        >
          <source src="/sounds/video1.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          <img 
            src="https://images.pexels.com/photos/4761352/pexels-photo-4761352.jpeg?auto=compress&cs=tinysrgb&w=1920" 
            alt="Martial arts training"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            loading="eager"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black"></div>
      </div>

      <style>
        {`
          @keyframes gradientFlow {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          .animated-gradient-text {
            background: linear-gradient(
              to right,
              #fbbf24,
              #f59e0b,
              #d97706,
              #f59e0b,
              #fbbf24
            );
            background-size: 300% auto;
            animation: gradientFlow 6s ease-in-out infinite;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-fill-color: transparent;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 20px rgba(251, 191, 36, 0.1);
          }
        `}
      </style>

      <div className="container relative z-10 pt-28 sm:pt-20 md:pt-24 pb-12">
        <div className="max-w-3xl animate-fade-up">
          <h1 className="mb-6">
            Discover Your <span className="animated-gradient-text font-bold">Strength</span> and <span className="animated-gradient-text font-bold">Discipline</span> at YKFA
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-8 text-gray-300 max-w-2xl">
            Premium training facilities with expert coaches dedicated to your transformation through mma, karate, and fitness excellence.
          </p>
          

          <div ref={statsRef} className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center justify-center px-4 py-4 sm:px-5 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/10 transition-all duration-300 hover:rotate-1 hover:translate-x-1 hover:border-amber-400/30 overflow-hidden group relative">
              <div className="absolute inset-0 bg-amber-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-400 relative z-10 mr-3 sm:mr-4">
                {animatedNumbers.trainers}+
              </div>
              <p className="text-xs sm:text-sm text-gray-300 relative z-10">Expert Trainers</p>
            </div>
            <div className="flex items-center justify-center px-4 py-4 sm:px-5 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/10 transition-all duration-300 hover:rotate-1 hover:translate-x-1 hover:border-amber-400/30 overflow-hidden group relative">
              <div className="absolute inset-0 bg-amber-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-400 relative z-10 mr-3 sm:mr-4">
                {animatedNumbers.programs}+
              </div>
              <p className="text-xs sm:text-sm text-gray-300 relative z-10">Training Programs</p>
            </div>
            <div className="flex items-center justify-center px-4 py-4 sm:px-5 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/10 transition-all duration-300 hover:rotate-1 hover:translate-x-1 hover:border-amber-400/30 overflow-hidden group relative">
              <div className="absolute inset-0 bg-amber-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-400 relative z-10 mr-3 sm:mr-4">
                {animatedNumbers.members}+
              </div>
              <p className="text-xs sm:text-sm text-gray-300 relative z-10">Active Members</p>
            </div>
            <div className="flex items-center justify-center px-4 py-4 sm:px-5 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/10 transition-all duration-300 hover:rotate-1 hover:translate-x-1 hover:border-amber-400/30 overflow-hidden group relative">
              <div className="absolute inset-0 bg-amber-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-400 relative z-10 mr-3 sm:mr-4">
                {animatedNumbers.years}+
              </div>
              <p className="text-xs sm:text-sm text-gray-300 relative z-10">Years Experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;