import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Share2, ChevronLeft, ChevronRight, Info, Play } from 'lucide-react';
import { cursorProps } from '../types/cursor';

// Define types for better TypeScript support
interface GalleryImage {
  id: number;
  src: string;
  fallbackSrc: string;
  title: string;
  description: string;
  featured?: boolean;
  aspectRatio: string;
  size: 'small' | 'medium' | 'large' | 'wide' | 'tall' | 'full';
  type?: 'image' | 'video';
  videoUrl?: string;
}

// Add fallback images array
const fallbackImages = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80", // Boxing gym
  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80", // MMA training
  "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&auto=format&fit=crop&q=80", // Martial arts dojo
  "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&auto=format&fit=crop&q=80", // Kickboxing
  "https://images.unsplash.com/photo-1605296867424-35c82a8b402e?w=800&auto=format&fit=crop&q=80", // Gym equipment
  "https://images.unsplash.com/photo-1591117207239-788bf8de6c3b?w=800&auto=format&fit=crop&q=80"  // Training area
];

// Add function to get random fallback image
const getRandomFallbackImage = (): string => {
  const randomIndex = Math.floor(Math.random() * fallbackImages.length);
  return fallbackImages[randomIndex];
};

// Gallery images with fallbacks
const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "https://i.postimg.cc/jdRQXCw0/image1.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "Martial Arts Training",
    description: "Professional martial arts training and fitness programs",
    featured: true,
    aspectRatio: "4/3",
    size: "wide",
    type: "image"
  },
  {
    id: 2,
    src: "https://i.postimg.cc/cCvZyd6s/image2.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "Advanced Training",
    description: "Advanced martial arts techniques and training sessions",
    featured: true,
    aspectRatio: "16/9",
    size: "wide",
    type: "image"
  },
  {
    id: 3,
    src: "https://img.youtube.com/vi/GLtEfAEpa_s/hqdefault.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "YKFA Gym Promo",
    description: "Explore our modern gym facilities and training equipment",
    featured: true,
    aspectRatio: "16/9",
    size: "wide",
    type: "video",
    videoUrl: "https://www.youtube.com/embed/GLtEfAEpa_s"
  },
  {
    id: 4,
    src: "https://img.youtube.com/vi/ZzWmeqCa3RI/maxresdefault.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "YKFA Promo",
    description: "Experience the power of martial arts training at YKFA",
    featured: true,
    aspectRatio: "16/9",
    size: "wide",
    type: "video",
    videoUrl: "https://www.youtube.com/embed/ZzWmeqCa3RI"
  },
  {
    id: 5,
    src: "https://img.youtube.com/vi/UITDMMyzH04/hqdefault.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "YKFA Training Highlights",
    description: "Watch our students master the art of martial arts",
    featured: true,
    aspectRatio: "16/9",
    size: "wide",
    type: "video",
    videoUrl: "https://www.youtube.com/embed/UITDMMyzH04"
  },
  {
    id: 6,
    src: "https://img.youtube.com/vi/KLy38Oplx_E/maxresdefault.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "YKFA Champions",
    description: "Meet the champions trained at YKFA and their inspiring journey",
    featured: true,
    aspectRatio: "16/9",
    size: "wide",
    type: "video",
    videoUrl: "https://www.youtube.com/embed/KLy38Oplx_E"
  }
];

// Custom data attributes for cursor interactions
const CURSOR_ATTRIBUTES = {
  HOVER: 'data-cursor-hover',
  CLICK: 'data-cursor-click',
};

const ProgramsPage = () => {
  // State management
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scrollY, setScrollY] = useState<number>(0);
  const [cardsVisible, setCardsVisible] = useState<boolean[]>([]);
  
  // Refs for animation elements
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Initialize card refs
  useEffect(() => {
    cardRefs.current = Array(galleryImages.length).fill(null);
    setCardsVisible(Array(galleryImages.length).fill(false));
  }, []);

  // Load images
  useEffect(() => {
    const loadImages = async () => {
      try {
        await Promise.all(
          galleryImages.map((img) => {
            return new Promise((resolve) => {
              const image = new Image();
              image.onload = () => resolve(null);
              image.onerror = () => {
                image.src = img.fallbackSrc;
                resolve(null);
              };
              image.src = img.src;
            });
          })
        );
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading images:', error);
        setIsLoading(false);
      }
    };

    loadImages();
  }, []);

  // Track scroll position with simplified footer awareness
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initialize
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Set up intersection observer for card animations
  useEffect(() => {
    if (isLoading) return;
    
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = cardRefs.current.findIndex(ref => ref === entry.target);
          if (index !== -1) {
            setCardsVisible(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    
    return () => observer.disconnect();
  }, [isLoading]);

  // Modal navigation
  const navigateImage = (direction: 'next' | 'prev') => {
    if (selectedImage === null) return;
    
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage);
    let newIndex: number;
    
    if (direction === 'next') {
      newIndex = currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1;
    }
    
    setSelectedImage(galleryImages[newIndex].id);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900">
        <div className="relative w-20 h-20 mb-4">
          <div className="absolute inset-0 border-4 border-amber-400/20 rounded-full"></div>
          <div className="absolute inset-0 border-t-4 border-amber-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="w-6 h-6 text-amber-400" />
          </div>
        </div>
        <p className="text-gray-300 text-lg font-medium mb-2">Loading Gallery</p>
        <p className="text-gray-400 text-sm">Preparing your images...</p>
      </div>
    );
  }
  
  const selectedImageData = selectedImage !== null 
    ? galleryImages.find(img => img.id === selectedImage) 
    : null;

  // Find the YKFA Champions video
  const championsVideo = galleryImages.find(img => img.id === 6);

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 pt-20 md:pt-24 pb-16 md:pb-20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Gallery Title Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10 md:mb-14 text-center"
        >
          <div className="inline-block mb-4 py-1.5 px-4 rounded-full backdrop-blur-md bg-amber-400/20 border border-amber-400/30">
            <p className="text-amber-400 font-medium text-sm">Our Gallery</p>
          </div>
          <h1 className="mb-4 text-3xl md:text-5xl font-bold leading-tight">
            Discover Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">Gallery</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Explore our comprehensive range of martial arts and fitness programs
          </p>
        </motion.div>
        
        {/* Gallery Container */}
        <div 
          ref={containerRef}
          className="max-w-4xl mx-auto relative z-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                ref={el => cardRefs.current[index] = el}
                initial={{ opacity: 0, y: 30, rotateY: 15, scale: 0.95 }}
                animate={cardsVisible[index] ? { 
                  opacity: 1, 
                  y: 0, 
                  rotateY: 0, 
                  scale: 1,
                  transition: { 
                    duration: 0.65,
                    delay: index * 0.12,
                    ease: [0.25, 0.1, 0.25, 1]
                  }
                } : {}}
                className="gallery-card relative overflow-hidden group backdrop-blur-md bg-white/5 hover:bg-white/10 rounded-xl md:rounded-xl border border-white/10 hover:border-white/20 shadow-lg shadow-black/20"
                onClick={() => setSelectedImage(image.id)}
                style={{ 
                  minHeight: '180px',
                  maxHeight: '240px',
                  transformStyle: 'preserve-3d',
                }}
                {...cursorProps('hover')}
              >
                <div className="relative overflow-hidden rounded-xl h-full">
                  {/* Content Container */}
                  <div className="relative w-full h-full">
                    {image.type === 'video' ? (
                      <div className="relative w-full h-full">
                        <img
                          src={image.src}
                          alt={image.title}
                          loading="eager"
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 relative z-10"
                          style={{ aspectRatio: image.aspectRatio }}
                          onError={(e) => {
                            const imgElement = e.target as HTMLImageElement;
                            imgElement.src = image.fallbackSrc;
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                          <motion.div 
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-400/90 flex items-center justify-center backdrop-blur-sm border border-amber-300/50"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            {...cursorProps('click')}
                          >
                            <Play className="w-5 h-5 md:w-6 md:h-6 text-black" fill="currentColor" />
                          </motion.div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={image.src}
                        alt={image.title}
                        loading="eager"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 relative z-10"
                        style={{ aspectRatio: image.aspectRatio }}
                        onError={(e) => {
                          const imgElement = e.target as HTMLImageElement;
                          imgElement.src = image.fallbackSrc;
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 transition-opacity duration-300"></div>
                </div>

                {/* Info */}
                <div className="absolute inset-x-0 bottom-0 p-2.5 md:p-3">
                  <div className="backdrop-blur-sm bg-black/40 p-2 md:p-2.5 rounded-lg">
                    <h3 className="text-white text-xs md:text-sm font-bold mb-0.5">{image.title}</h3>
                    <p className="text-white/80 text-xs line-clamp-1">{image.description}</p>
                  </div>
                </div>
                
                {/* Interactive hover effects */}
                <motion.div 
                  className="absolute inset-0 bg-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"
                  initial={false}
                  whileHover={{ opacity: 1 }}
                ></motion.div>
              </motion.div>
            ))}
          </div>
          
          {/* Summary bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 backdrop-blur-md bg-white/5 rounded-xl border border-white/10 p-3 flex justify-center items-center"
          >
            <div className="text-gray-400 text-xs flex items-center">
              <Info className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              Displaying <span className="text-amber-400 font-medium mx-1">{galleryImages.length}</span> gallery items • Click to view details
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage !== null && selectedImageData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 pt-16 md:pt-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close button */}
            <motion.button 
              className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:text-amber-400 z-50"
              onClick={() => setSelectedImage(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              {...cursorProps('click')}
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>
            
            {/* Navigation */}
            <motion.button 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:text-amber-400 z-30"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              whileHover={{ scale: 1.1, x: -3 }}
              whileTap={{ scale: 0.9 }}
              {...cursorProps('click')}
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>
            
            <motion.button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:text-amber-400 z-30"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              whileHover={{ scale: 1.1, x: 3 }}
              whileTap={{ scale: 0.9 }}
              {...cursorProps('click')}
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>
            
            {/* Content */}
            <div 
              className="w-full max-w-5xl overflow-y-auto max-h-[calc(100vh-32px)] md:max-h-[calc(100vh-64px)] custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Media Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="flex-1 rounded-2xl overflow-hidden relative"
                >
                  {selectedImageData.type === 'video' ? (
                    <div className="relative w-full pt-[56.25%]">
                      <iframe
                        className="absolute inset-0 w-full h-full rounded-2xl"
                        src={selectedImageData.videoUrl}
                        title={selectedImageData.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <img 
                      src={selectedImageData.src} 
                      alt={selectedImageData.title}
                      className="w-full h-auto max-h-[70vh] object-contain rounded-2xl relative z-10"
                      loading="eager"
                      onError={(e) => {
                        const imgElement = e.target as HTMLImageElement;
                        imgElement.src = selectedImageData.fallbackSrc;
                      }}
                    />
                  )}
                </motion.div>
                
                {/* Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="md:max-w-xs flex flex-col"
                >
                  <div className="backdrop-blur-lg bg-white/10 border border-white/10 p-6 rounded-2xl">
                    <div className="inline-block px-2.5 py-1 bg-amber-400/20 rounded-full text-amber-400 text-xs mb-4">
                      {selectedImageData.type === 'video' ? 'Video' : 'Image'}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">{selectedImageData.title}</h2>
                    <p className="text-gray-300 mb-6 text-sm">{selectedImageData.description}</p>
                    
                    <motion.div 
                      className="flex justify-center"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      {...cursorProps('hover')}
                    >
                      <button className="flex items-center gap-2 text-sm text-white hover:text-amber-400 transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Custom styles for animations */}
      <style>{`
        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 191, 36, 0.5);
        }
        
        /* Advanced hover effects */
        .gallery-card {
          transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        
        .gallery-card:hover {
          transform: translateY(-8px) scale(1.02) rotateX(2deg);
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
        }
        
        @media (prefers-reduced-motion: reduce) {
          .gallery-card,
          .gallery-card:hover {
            transition: opacity 0.3s linear !important;
            transform: none !important;
            perspective: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProgramsPage;