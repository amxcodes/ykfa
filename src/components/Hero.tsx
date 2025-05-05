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

  // Start animations earlier if loading is marked complete
  useEffect(() => {
    if (loadingComplete && !hasAnimated.current) {
      hasAnimated.current = true;
      animateNumbers();
    }
  }, [loadingComplete]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
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

  const animateNumbers = () => {
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

    const timer = setInterval(() => {
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
        clearInterval(timer);
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
            <div className="text-center p-4 bg-dark-800/50 backdrop-blur-sm rounded-lg transform hover:scale-105 transition-transform">
              <div className="text-2xl sm:text-3xl font-bold text-amber-400">
                {animatedNumbers.trainers}+
              </div>
              <p className="text-sm sm:text-base text-gray-400">Expert Trainers</p>
            </div>
            <div className="text-center p-4 bg-dark-800/50 backdrop-blur-sm rounded-lg transform hover:scale-105 transition-transform">
              <div className="text-2xl sm:text-3xl font-bold text-amber-400">
                {animatedNumbers.programs}+
              </div>
              <p className="text-sm sm:text-base text-gray-400">Training Programs</p>
            </div>
            <div className="text-center p-4 bg-dark-800/50 backdrop-blur-sm rounded-lg transform hover:scale-105 transition-transform">
              <div className="text-2xl sm:text-3xl font-bold text-amber-400">
                {animatedNumbers.members}+
              </div>
              <p className="text-sm sm:text-base text-gray-400">Members</p>
            </div>
            <div className="text-center p-4 bg-dark-800/50 backdrop-blur-sm rounded-lg transform hover:scale-105 transition-transform">
              <div className="text-2xl sm:text-3xl font-bold text-amber-400">
                {animatedNumbers.years}+
              </div>
              <p className="text-sm sm:text-base text-gray-400">Years Experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;