import { ShoppingBag, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const StorePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Set up IntersectionObserver for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.05,
      rootMargin: "-20px 0px"
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          if (entry.target.classList.contains('observe-me')) {
            entry.target.classList.add('fade-in');
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    const elementsToObserve = [
      contentRef.current,
      ...Array.from(document.querySelectorAll('.observe-me'))
    ].filter(Boolean);
    
    elementsToObserve.forEach(el => {
      if (el) observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  // Style for glassmorphic design
  const glassmorphicStyles = `
  /* Smooth fade-in animation */
  .observe-me {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    will-change: opacity, transform;
  }

  .observe-me.fade-in {
    opacity: 1;
    transform: translateY(0);
  }

  /* Float animation for elements */
  .floating {
    animation: float 6s ease-in-out infinite;
  }

  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  /* Pulse animation */
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.05);
    }
  }

  /* Glow effect */
  .glow-effect {
    box-shadow: 0 0 15px rgba(251, 191, 36, 0.2);
    animation: glowPulse 3s infinite;
  }

  @keyframes glowPulse {
    0%, 100% {
      box-shadow: 0 0 15px rgba(251, 191, 36, 0.2);
    }
    50% {
      box-shadow: 0 0 25px rgba(251, 191, 36, 0.4);
    }
  }

  /* Glassmorphism */
  .backdrop-blur-md {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .backdrop-blur-lg {
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  @media (prefers-reduced-motion: reduce) {
    .observe-me, .floating {
      transition: none !important;
      animation: none !important;
      transform: none !important;
      opacity: 1 !important;
    }
  }
  `;

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-32 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-center bg-cover opacity-40"
            style={{ 
              backgroundImage: "url('https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=800&q=70')",
              willChange: 'transform',
              transform: isVisible ? 'scale(1)' : 'scale(1.05)',
              transition: 'transform 1.5s ease-out'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/3 -left-16 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          {/* Animated circle */}
          <div 
            className="absolute top-1/4 right-1/4 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none floating"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        <div className="container relative z-10">
          <div 
            ref={contentRef}
            className="max-w-4xl mx-auto text-center observe-me"
          >
            <div className="inline-block mb-6 py-1.5 px-4 rounded-full backdrop-blur-md bg-amber-400/20 border border-amber-400/30 glow-effect">
              <p className="text-amber-400 font-medium text-sm">YKFA Store</p>
            </div>
            
            <h1 className="mb-6 text-5xl md:text-7xl font-bold leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">Coming Soon</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto">
              Our premium fitness and martial arts equipment store is under construction. We're working hard to bring you the best training gear soon.
            </p>
            
            {/* Store icon */}
            <div className="relative mb-16">
              <div className="w-36 h-36 backdrop-blur-xl bg-white/10 mx-auto rounded-3xl border border-white/20 flex items-center justify-center floating shadow-2xl" style={{ animationDelay: '0.5s' }}>
                <ShoppingBag className="w-20 h-20 text-amber-400" />
              </div>
              
            </div>
            
            {/* Coming Soon Message */}
            <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-white/20 shadow-xl mb-12 max-w-2xl mx-auto observe-me">
              <h3 className="text-2xl font-bold mb-4 text-white">Our Store is Under Development</h3>
              <p className="text-gray-300 leading-relaxed">
                We're building a curated collection of premium fitness and martial arts equipment. Follow us on social media or visit our academy for updates on the launch date.
              </p>
            </div>
            
            {/* Links */}
            <div className="mt-8">
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/"
                  className="inline-flex items-center backdrop-blur-md bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full font-medium transition-colors border border-white/20 group"
                >
                  Back to Home
                  <ChevronRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="https://wa.me/917736488858"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-amber-400 hover:bg-amber-500 text-black px-5 py-2.5 rounded-full font-medium transition-colors group shadow-lg"
                >
                  Contact Us
                  <ChevronRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Apply styles */}
      <style>{glassmorphicStyles}</style>
    </>
  );
};

export default StorePage; 