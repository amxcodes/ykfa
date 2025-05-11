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

// Add function to share content 
const shareContent = (title: string, text: string, url: string) => {
  if (navigator.share) {
    navigator.share({
      title,
      text,
      url
    })
    .then(() => console.log('Shared successfully'))
    .catch((error) => console.log('Error sharing:', error));
  } else {
    // Fallback for browsers that don't support Web Share API
    navigator.clipboard.writeText(url)
      .then(() => alert('Link copied to clipboard!'))
      .catch((err) => console.error('Could not copy text: ', err));
  }
};

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
  },
  {
    id: 7,
    src: "https://i.postimg.cc/3RJcSt0H/img-4.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "Training Session",
    description: "Intensive training session with expert instructors",
    aspectRatio: "4/3",
    size: "medium",
    type: "image"
  },
  {
    id: 8,
    src: "https://i.postimg.cc/1tCYLDDV/img-3.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "Technique Practice",
    description: "Refining techniques through dedicated practice",
    aspectRatio: "4/3",
    size: "medium",
    type: "image"
  },
  {
    id: 9,
    src: "https://i.postimg.cc/rpqnsfJt/img-22.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "Strength Training",
    description: "Building strength and endurance through specialized exercises",
    aspectRatio: "4/3",
    size: "medium",
    type: "image"
  },
  {
    id: 10,
    src: "https://i.postimg.cc/wBFWmDf4/img-11.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "Group Training",
    description: "Collaborative training sessions for improved skills",
    aspectRatio: "4/3",
    size: "medium",
    type: "image"
  },
  {
    id: 11,
    src: "https://i.postimg.cc/rsRg3387/img-6.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "Form Practice",
    description: "Mastering forms and stances for better performance",
    aspectRatio: "4/3",
    size: "medium",
    type: "image"
  },
  {
    id: 12,
    src: "https://i.postimg.cc/NfYppN3C/img-9.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "Defense Techniques",
    description: "Learning effective self-defense strategies",
    aspectRatio: "4/3",
    size: "medium",
    type: "image"
  },
  {
    id: 13,
    src: "https://i.postimg.cc/bNTLMx8y/img-20.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "Competition Training",
    description: "Preparing athletes for competitive events",
    aspectRatio: "4/3",
    size: "medium",
    type: "image"
  },
  {
    id: 14,
    src: "https://i.postimg.cc/0yyZqz2p/img-19.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "Sparring Session",
    description: "Controlled sparring to develop fighting skills",
    aspectRatio: "4/3",
    size: "medium",
    type: "image"
  },
  {
    id: 15,
    src: "https://i.postimg.cc/mrcwtK9k/img-21.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "Kickboxing Practice",
    description: "Perfecting kickboxing techniques and combinations",
    aspectRatio: "4/3",
    size: "medium",
    type: "image"
  },
  {
    id: 16,
    src: "https://i.postimg.cc/PqBMZKb4/img-12.avif",
    fallbackSrc: getRandomFallbackImage(),
    title: "Professional Training",
    description: "Elite training methodologies for martial artists",
    aspectRatio: "4/3",
    size: "medium",
    type: "image"
  },
  {
    id: 17,
    src: "https://i.postimg.cc/SR5QN2bJ/img-13.avif",
    fallbackSrc: getRandomFallbackImage(),
    title: "Physical Conditioning",
    description: "Building the optimal physical condition for martial arts",
    aspectRatio: "4/3",
    size: "medium",
    type: "image"
  },
  {
    id: 18,
    src: "https://i.postimg.cc/15n57HD6/img17.avif",
    fallbackSrc: getRandomFallbackImage(),
    title: "Advanced Combat",
    description: "Advanced combat techniques for experienced practitioners",
    aspectRatio: "4/3",
    size: "medium",
    type: "image"
  },
  // New images from user
  {
    id: 19,
    src: "https://i.postimg.cc/Cxr6mHh9/IMG-9857.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "YKFA Event 1",
    description: "YKFA event photo 1",
    aspectRatio: "4/3",
    size: "medium",
    type: "image"
  },
  {
    id: 20,
    src: "https://i.postimg.cc/JnVx2p9Y/IMG-9840.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "YKFA Event 2",
    description: "YKFA event photo 2",
    aspectRatio: "4/3",
    size: "medium",
    type: "image"
  },
  {
    id: 21,
    src: "https://i.postimg.cc/P50QC6rf/IMG-9847.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "YKFA Event 3",
    description: "YKFA event photo 3",
    aspectRatio: "4/3",
    size: "medium",
    type: "image"
  },
  {
    id: 22,
    src: "https://i.postimg.cc/dtx8fWCR/IMG-9853.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "YKFA Event 4",
    description: "YKFA event photo 4",
    aspectRatio: "4/3",
    size: "medium",
    type: "image"
  },
  {
    id: 23,
    src: "https://i.postimg.cc/GpkGHd5z/IMG-9860.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "YKFA Event 5",
    description: "YKFA event photo 5",
    aspectRatio: "4/3",
    size: "medium",
    type: "image"
  },
  {
    id: 24,
    src: "https://i.postimg.cc/SsHwxL2w/IMG-9826.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "YKFA Event 6",
    description: "YKFA event photo 6",
    aspectRatio: "4/3",
    size: "medium",
    type: "image"
  },
  {
    id: 25,
    src: "https://i.postimg.cc/Fsy2hL9B/IMG-9828.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "YKFA Event 7",
    description: "YKFA event photo 7",
    aspectRatio: "4/3",
    size: "medium",
    type: "image"
  },
  {
    id: 26,
    src: "https://i.postimg.cc/XYntqYq7/IMG-9845.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "YKFA Event 8",
    description: "YKFA event photo 8",
    aspectRatio: "4/3",
    size: "medium",
    type: "image"
  },
  {
    id: 27,
    src: "https://i.postimg.cc/Wp7856SS/IMG-9836.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "YKFA Event 9",
    description: "YKFA event photo 9",
    aspectRatio: "4/3",
    size: "medium",
    type: "image"
  },
];

// Custom data attributes for cursor interactions

const ProgramsPage = () => {
  // State management - optimized to remove unused states
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Use refs instead of state for scroll tracking to reduce re-renders
  const scrollPositionRef = useRef<number>(0);
  // Use a more efficient approach for tracking visible cards
  const visibleCardsRef = useRef<Set<number>>(new Set());
  const [activeFilter, setActiveFilter] = useState<'all' | 'images' | 'videos'>('all');
  
  // Refs for animation elements
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Get filtered gallery items based on active filter
  const filteredGalleryImages = galleryImages.filter(image => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'images') return image.type === 'image';
    if (activeFilter === 'videos') return image.type === 'video';
    return true;
  });
  
  // Initialize card refs with optimized memory usage
  useEffect(() => {
    cardRefs.current = Array(galleryImages.length).fill(null);
    // Clear and reset the visible cards set
    visibleCardsRef.current.clear();
  }, []);

  // Load images with optimized memory usage and progressive loading
  useEffect(() => {
    // Track if component is mounted to prevent state updates after unmount
    let isMounted = true;
    const imageElements: HTMLImageElement[] = [];
    
    // Use a batched approach to load images in smaller groups
    const loadImagesInBatches = async () => {
      const BATCH_SIZE = 5; // Process 5 images at a time to reduce memory pressure
      const batches = [];
      
      // Split gallery images into batches
      for (let i = 0; i < galleryImages.length; i += BATCH_SIZE) {
        batches.push(galleryImages.slice(i, i + BATCH_SIZE));
      }
      
      try {
        // Process each batch sequentially
        for (const batch of batches) {
          if (!isMounted) return; // Stop if component unmounted
          
          await Promise.all(
            batch.map((img) => {
              return new Promise<void>((resolve) => {
                // Use setTimeout to stagger image loading and reduce memory spikes
                setTimeout(() => {
                  if (!isMounted) {
                    resolve();
                    return;
                  }
                  
                  const image = new Image();
                  // Set image size explicitly to help browser allocate memory correctly
                  image.width = 300; // Reasonable thumbnail size
                  image.height = 200;
                  imageElements.push(image);
                  
                  // Add timeout to prevent hanging on slow connections
                  const timeoutId = setTimeout(() => {
                    if (isMounted) {
                      image.src = img.fallbackSrc;
                      resolve();
                    }
                  }, 5000); // 5 second timeout
                  
                  image.onload = () => {
                    clearTimeout(timeoutId);
                    resolve();
                  };
                  
                  image.onerror = () => {
                    clearTimeout(timeoutId);
                    if (isMounted) image.src = img.fallbackSrc;
                    resolve();
                  };
                  
                  // Add query params to request optimized images from server
                  image.src = `${img.src}?w=300&q=75`;
                }, 50); // Stagger loading by 50ms
              });
            })
          );
        }
        
        if (isMounted) setIsLoading(false);
      } catch (error) {
        console.error('Error loading images:', error);
        if (isMounted) setIsLoading(false);
      }
    };

    loadImagesInBatches();
    
    // Comprehensive cleanup function
    return () => {
      isMounted = false;
      imageElements.forEach(img => {
        // Clear all event handlers
        img.onload = null;
        img.onerror = null;
        
        // Cancel any pending requests
        img.src = '';
      });
    };
  }, []);

  // Track scroll position with refs to avoid re-renders
  useEffect(() => {
    const handleScroll = () => {
      // Store scroll position in ref instead of state to avoid re-renders
      scrollPositionRef.current = window.scrollY;
      
      // Optionally trigger any scroll-based animations here directly
      // without causing component re-renders
    };
    
    // Use passive event listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initialize
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Optimized effect for filter changes
  useEffect(() => {
    if (isLoading) return;
    
    // When filter changes, make all cards visible immediately using ref
    // This avoids unnecessary re-renders
    filteredGalleryImages.forEach((_, index) => {
      visibleCardsRef.current.add(index);
    });
    
    // Force a single re-render to apply visibility changes
    forceUpdate({});
  }, [isLoading, activeFilter, filteredGalleryImages.length]);
  
  // Helper function to force a single re-render when needed
  const [, forceUpdate] = useState<object>(() => ({}));
  // This is a common React pattern to force re-renders without state dependencies

  // Set up intersection observer for initial load animations
  useEffect(() => {
    if (isLoading) return;
    
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    };
    
    const observer = new IntersectionObserver((entries) => {
      let needsUpdate = false;
      
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = cardRefs.current.findIndex(ref => ref === entry.target);
          if (index !== -1) {
            // Use Set operations instead of array state updates
            if (!visibleCardsRef.current.has(index)) {
              visibleCardsRef.current.add(index);
              needsUpdate = true;
            }
          }
          observer.unobserve(entry.target);
        }
      });
      
      // Only trigger a re-render if visibility actually changed
      if (needsUpdate) {
        forceUpdate({});
      }
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

  // Handle sharing content
  const handleShare = (e: React.MouseEvent, image: GalleryImage) => {
    e.stopPropagation();
    
    const shareTitle = `YKFA - ${image.title}`;
    const shareText = image.description;
    const shareUrl = window.location.href.split('?')[0] + `?image=${image.id}`;
    
    shareContent(shareTitle, shareText, shareUrl);
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
          <h1 className="mb-4 text-3xl md:text-5xl font-bold leading-tight">
            YKFA <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">Training Gallery</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Explore our comprehensive range of martial arts training, techniques, and fitness programs through our extensive image and video collection
          </p>
        </motion.div>
        
        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-6xl mx-auto mb-6 flex justify-center"
        >
          <div className="backdrop-blur-md bg-white/5 rounded-full border border-white/10 p-1 flex space-x-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === 'all' 
                  ? 'bg-amber-500 text-black' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              {...cursorProps('click')}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('images')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === 'images' 
                  ? 'bg-amber-500 text-black' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              {...cursorProps('click')}
            >
              Images
            </button>
            <button
              onClick={() => setActiveFilter('videos')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === 'videos' 
                  ? 'bg-amber-500 text-black' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              {...cursorProps('click')}
            >
              Videos
            </button>
          </div>
        </motion.div>
        
        {/* Gallery Container */}
        <div 
          ref={containerRef}
          className="max-w-6xl mx-auto relative z-10"
        >
          {filteredGalleryImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredGalleryImages.map((image, index) => (
                <motion.div
                  key={`${activeFilter}-${image.id}`}
                  ref={el => cardRefs.current[index] = el}
                  initial={{ opacity: 0, y: 30, rotateY: 15, scale: 0.95 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    rotateY: 0, 
                    scale: 1,
                    transition: { 
                      duration: 0.5,
                      delay: index * 0.05,
                      ease: [0.25, 0.1, 0.25, 1]
                    }
                  }}
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
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-8 text-center backdrop-blur-md bg-white/5 rounded-xl border border-white/10"
            >
              <p className="text-gray-300 text-lg">No {activeFilter === 'videos' ? 'videos' : 'images'} found in this category.</p>
              <button 
                onClick={() => setActiveFilter('all')}
                className="mt-4 px-4 py-2 bg-amber-500 text-black rounded-lg text-sm font-medium hover:bg-amber-400 transition-colors"
                {...cursorProps('click')}
              >
                Show All Items
              </button>
            </motion.div>
          )}
          
          {/* Summary bar */}
          <motion.div 
            key={`summary-${activeFilter}-${filteredGalleryImages.length}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 backdrop-blur-md bg-white/5 rounded-xl border border-white/10 p-3 flex justify-center items-center"
          >
            <div className="text-gray-400 text-xs flex items-center">
              <Info className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              Displaying <span className="text-amber-400 font-medium mx-1">{filteredGalleryImages.length}</span> gallery items 
              {activeFilter !== 'all' && <> in <span className="text-amber-400 font-medium mx-1">{activeFilter}</span> category</>} • Click to view details
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Image Modal - Completely Redesigned */}
      <AnimatePresence>
        {selectedImage !== null && selectedImageData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[1000] bg-gradient-to-b from-black/98 to-black/95 backdrop-blur-lg flex flex-col items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            {/* Top Bar with Controls */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="w-full px-4 py-3 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 z-50 flex items-center justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-2">
                <div className="h-8 w-2 bg-amber-500 rounded-sm"></div>
                <div>
                  <h3 className="text-white text-sm font-medium">{selectedImageData.title}</h3>
                  <p className="text-gray-400 text-xs">
                    {selectedImageData.type === 'video' ? 'Video' : 'Image'} • YKFA Gallery
                  </p>
                </div>
              </div>
              
            <motion.button 
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-amber-500 hover:text-black transition-colors"
              onClick={() => setSelectedImage(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              {...cursorProps('click')}
            >
                <X className="w-4 h-4" />
            </motion.button>
            </motion.div>
            
            {/* Main Content Area */}
            <div 
              className="w-full h-full max-w-7xl px-4 py-14 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left: Media Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 25 }}
                className="flex-1 flex items-center justify-center relative"
              >
                {/* Navigation buttons overlay */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3 md:px-6 z-20 pointer-events-none">
            <motion.button 
                    className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-400 rounded-full text-black shadow-xl"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              whileHover={{ scale: 1.1, x: -3 }}
              whileTap={{ scale: 0.9 }}
              {...cursorProps('click')}
            >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
            </motion.button>
            
            <motion.button 
                    className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-gradient-to-r from-amber-400 to-amber-500 rounded-full text-black shadow-xl"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              whileHover={{ scale: 1.1, x: 3 }}
              whileTap={{ scale: 0.9 }}
              {...cursorProps('click')}
            >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
            </motion.button>
                </div>
            
                {/* Media content with better styling */}
                <div className="relative overflow-hidden border border-white/10 shadow-[0_0_25px_rgba(251,191,36,0.15)] rounded-xl">
                  {selectedImageData.type === 'video' ? (
                    // YouTube embed with standard dimensions
                    <div className="w-full md:w-[640px] h-[320px] md:h-[360px] bg-black flex items-center justify-center">
                      <iframe
                        src={`${selectedImageData.videoUrl}?autoplay=1&rel=0`}
                        title={selectedImageData.title}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <div className="relative bg-black/40">
                    <img 
                      src={selectedImageData.src} 
                      alt={selectedImageData.title}
                        className="max-w-full max-h-[70vh] object-contain"
                      loading="eager"
                      onError={(e) => {
                        const imgElement = e.target as HTMLImageElement;
                        imgElement.src = selectedImageData.fallbackSrc;
                      }}
                    />
                    </div>
                  )}
                </div>
                </motion.div>
                
              {/* Right: Info Panel (Desktop) / Bottom Panel (Mobile) - Only for desktop */}
                <motion.div
                initial={{ opacity: 0, y: 20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: 20, x: 20 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="hidden md:block md:w-80 lg:w-96 md:self-stretch md:flex md:flex-col"
                >
                <div className="backdrop-blur-xl bg-gradient-to-br from-amber-900/30 to-black/60 border border-amber-500/20 rounded-xl overflow-hidden h-full flex flex-col">
                  {/* Content Area */}
                  <div className="p-4 md:p-6 flex-1">
                    {/* Title and Tag */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="px-2 py-0.5 bg-amber-500/20 rounded-md text-amber-400 text-xs font-medium">
                          {selectedImageData.type === 'video' ? 'Video' : 'Photo'}
                    </div>
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-white">{selectedImageData.title}</h2>
                    </div>
                    
                    {/* Description */}
                    <div className="bg-black/30 rounded-lg p-3 mb-5">
                      <p className="text-gray-300 text-sm">{selectedImageData.description}</p>
                    </div>
                    
                    {/* Image Counter */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-400">
                          {selectedImageData.type === 'video' ? 'Video' : 'Image'} {galleryImages.findIndex(img => img.id === selectedImage) + 1} of {galleryImages.length}
                        </span>
                        <span className="text-xs text-amber-400/70">
                          {selectedImageData.aspectRatio}
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                          style={{ 
                            width: `${((galleryImages.findIndex(img => img.id === selectedImage) + 1) / galleryImages.length) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Action Buttons - Only in desktop */}
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                      whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="h-11 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 text-black rounded-lg font-medium text-sm"
                        onClick={(e) => handleShare(e, selectedImageData)}
                        {...cursorProps('click')}
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="h-11 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white rounded-lg font-medium text-sm"
                        onClick={() => setSelectedImage(null)}
                        {...cursorProps('click')}
                      >
                        <X className="w-4 h-4" />
                        <span>Close</span>
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="p-4 border-t border-white/10 bg-black/20">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">© YKFA Gallery</span>
                      <div className="flex space-x-3">
                        {[...Array(3)].map((_, i) => (
                          <div 
                            key={i} 
                            className="w-1 h-1 rounded-full bg-amber-400/60"
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  </div>
                </motion.div>
            </div>
            
            {/* Mobile-only Bottom Panel - Combined info and controls */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-black/80 backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag indicator */}
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto my-2"></div>
              
              {/* Content container */}
              <div className="px-4 pb-6 pt-2">
                {/* Title and description */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="px-2 py-0.5 bg-amber-500/20 rounded-md text-amber-400 text-xs font-medium">
                      {selectedImageData.type === 'video' ? 'Video' : 'Photo'}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{selectedImageData.title}</h3>
                  <p className="text-gray-300 text-sm line-clamp-2">{selectedImageData.description}</p>
                </div>
                
                {/* Progress bar and page indicator */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-gray-400">
                      {selectedImageData.type === 'video' ? 'Video' : 'Image'} {galleryImages.findIndex(img => img.id === selectedImage) + 1} of {galleryImages.length}
                    </span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                      style={{ 
                        width: `${((galleryImages.findIndex(img => img.id === selectedImage) + 1) / galleryImages.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="h-11 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 text-black rounded-lg font-medium text-sm"
                    onClick={(e) => handleShare(e, selectedImageData)}
                    {...cursorProps('click')}
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="h-11 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white rounded-lg font-medium text-sm"
                    onClick={() => setSelectedImage(null)}
                    {...cursorProps('click')}
                  >
                    <X className="w-4 h-4" />
                    <span>Close</span>
                  </motion.button>
              </div>
            </div>
            </motion.div>
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