import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const galleryImages = [
  {
    src: "https://images.pexels.com/photos/7045573/pexels-photo-7045573.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Traditional Karate",
    category: "Martial Arts",
    description: "Master the ancient art of karate with our expert instructors"
  },
  {
    src: "https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Strength & Conditioning",
    category: "Fitness",
    description: "Build strength and endurance with our specialized training programs"
  },
  {
    src: "https://images.pexels.com/photos/8611871/pexels-photo-8611871.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Kickboxing",
    category: "Martial Arts",
    description: "Learn powerful striking techniques and improve your fitness"
  },
  {
    src: "https://images.pexels.com/photos/7045660/pexels-photo-7045660.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Kids Martial Arts",
    category: "Kids",
    description: "Fun and engaging martial arts training for young warriors"
  },
  {
    src: "https://images.pexels.com/photos/6456300/pexels-photo-6456300.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "HIIT Fitness",
    category: "Fitness",
    description: "High-intensity interval training for maximum results"
  },
  {
    src: "https://images.pexels.com/photos/7045596/pexels-photo-7045596.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Self-Defense Essentials",
    category: "Self-Defense",
    description: "Practical self-defense techniques for real-world situations"
  },
  {
    src: "https://images.pexels.com/photos/7045439/pexels-photo-7045439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Advanced Karate",
    category: "Martial Arts",
    description: "Take your karate skills to the next level"
  },
  {
    src: "https://images.pexels.com/photos/4754146/pexels-photo-4754146.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Fitness Boxing",
    category: "Fitness",
    description: "Cardio boxing workouts for strength and endurance"
  }
];

const GalleryPage = () => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const categories = ['all', ...new Set(galleryImages.map(img => img.category))];

  // Preload images for better performance
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = galleryImages.map(img => {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.src = img.src;
          image.onload = resolve;
          image.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
        setIsLoading(false);
      } catch (error) {
        console.error('Error preloading images:', error);
        setIsLoading(false);
      }
    };

    preloadImages();
  }, []);

  // Optimized animation setup
  const setupAnimations = useCallback(() => {
    if (!heroRef.current || !gridRef.current) return;

    // Hero animations
    const hero = heroRef.current;
    const heroElements = {
      title: hero.querySelector('h1'),
      subtitle: hero.querySelector('p'),
      button: hero.querySelector('button'),
      overlay: hero.querySelector('.hero-overlay')
    };

    const heroTimeline = gsap.timeline();
    heroTimeline
      .fromTo(heroElements.overlay, 
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.inOut' }
      )
      .fromTo([heroElements.title, heroElements.subtitle, heroElements.button],
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.2, 
          duration: 0.8, 
          ease: 'power3.out' 
        },
        '-=0.5'
      );

    // Parallax effect
    gsap.to(hero, {
      backgroundPosition: '50% 100%',
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    // Grid animations
    const items = gridRef.current.querySelectorAll('.gallery-img-item');
    items.forEach((item, i) => {
      const img = item.querySelector('img');
      const overlay = item.querySelector('.gallery-overlay');
      const content = item.querySelector('.gallery-content');

      // Initial animation
      gsap.fromTo(item,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          delay: 0.2 + i * 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );

      // Hover animation
      const hoverTimeline = gsap.timeline({ paused: true });
      hoverTimeline
        .to([img, overlay], {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        })
        .to(content, {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        }, '-=0.2');

      item.addEventListener('mouseenter', () => hoverTimeline.play());
      item.addEventListener('mouseleave', () => hoverTimeline.reverse());
    });

    // Scroll progress bar
    gsap.to(progressRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
      }
    });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setupAnimations();
    }
  }, [isLoading, setupAnimations]);

  // Enhanced modal animation
  const openModal = useCallback((idx: number) => {
    setSelectedIdx(idx);
    if (modalRef.current) {
      const modal = modalRef.current;
      const img = modal.querySelector('img');
      const content = modal.querySelector('.modal-content');

      const modalTimeline = gsap.timeline();
      modalTimeline
        .fromTo(modal,
          { opacity: 0, scale: 0.92 },
          { 
            opacity: 1, 
            scale: 1, 
            duration: 0.4, 
            ease: 'power3.out' 
          }
        )
        .fromTo(img,
          { scale: 0.8, opacity: 0 },
          { 
            scale: 1, 
            opacity: 1, 
            duration: 0.5, 
            ease: 'power3.out' 
          },
          '-=0.2'
        )
        .fromTo(content,
          { y: 30, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.4, 
            ease: 'power2.out' 
          },
          '-=0.3'
        );
    }
  }, []);

  const filteredImages = activeCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-black">
      {/* Scroll Progress Bar */}
      <div 
        ref={progressRef}
        className="fixed top-0 left-0 w-full h-1 bg-amber-400 origin-left scale-x-0 z-50"
      />

      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative flex flex-col items-center justify-center h-screen text-center"
        style={{
          background: 'url(/your-hero-image.jpg) center/cover no-repeat fixed',
        }}
      >
        <div className="hero-overlay absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-transparent"></div>
        <h1 className="text-8xl font-extrabold text-white drop-shadow-lg mb-6 relative z-10">
          <span className="text-amber-400">YKFA</span> Gallery
        </h1>
        <p className="text-3xl text-amber-300 mb-12 max-w-2xl mx-auto relative z-10">
          Explore our world of fitness, martial arts, and community.
        </p>
        <button
          className="px-10 py-5 bg-amber-400 text-black font-bold rounded-full shadow-lg hover:bg-amber-500 transition-all duration-300 hover:scale-105 relative z-10"
          onClick={() => window.scrollTo({ top: gridRef.current?.offsetTop || 0, behavior: 'smooth' })}
        >
          View Gallery
        </button>
      </div>

      {/* Category Filter */}
      <div className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-md py-4 mb-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-amber-400 text-black shadow-lg'
                    : 'bg-dark-700 text-white hover:bg-dark-600'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div 
        ref={gridRef} 
        className="max-w-7xl mx-auto px-4 columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8 pb-24"
      >
        {filteredImages.map((img, idx) => (
          <div
            key={idx}
            className="gallery-img-item mb-8 break-inside-avoid rounded-2xl overflow-hidden shadow-2xl group cursor-pointer relative"
            onClick={() => openModal(idx)}
          >
            <img
              src={img.src}
              alt={img.title}
              className="w-full h-auto object-cover object-center transition-transform duration-500"
              style={{ aspectRatio: '4/3' }}
              loading="lazy"
            />
            <div className="gallery-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="gallery-content absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <span className="text-amber-400 text-sm font-medium mb-2 block">{img.category}</span>
              <h3 className="text-2xl font-bold text-white mb-2">{img.title}</h3>
              <p className="text-white/80 text-sm">{img.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedIdx !== null && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
          onClick={() => setSelectedIdx(null)}
        >
          <button
            className="absolute top-6 right-8 text-4xl text-white/80 hover:text-amber-400 transition-colors z-50"
            onClick={() => setSelectedIdx(null)}
            aria-label="Close"
          >
            &times;
          </button>
          <div className="max-w-5xl w-full p-4 relative">
            <img
              src={galleryImages[selectedIdx].src}
              alt={galleryImages[selectedIdx].title}
              className="w-full h-auto rounded-2xl shadow-2xl border-4 border-amber-400/20"
            />
            <div className="modal-content mt-8 text-center">
              <span className="text-amber-400 text-lg font-medium mb-2 block">
                {galleryImages[selectedIdx].category}
              </span>
              <h2 className="text-4xl font-bold text-white mb-4">
                {galleryImages[selectedIdx].title}
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                {galleryImages[selectedIdx].description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default GalleryPage;