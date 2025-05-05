import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, Camera, Heart, Share2, ChevronLeft, ChevronRight, Info, Tag, Play } from 'lucide-react';

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

// Add function to determine image size class based on aspect ratio
const getImageSize = (aspectRatio: string): 'small' | 'medium' | 'large' | 'wide' | 'tall' | 'full' => {
  const [width, height] = aspectRatio.split('/').map(Number);
  const ratio = width / height;
  
  if (ratio > 1.5) return 'wide';  // Wider images like 16:9
  if (ratio < 0.7) return 'tall';  // Taller images
  if (ratio >= 0.9 && ratio <= 1.1) return 'medium';  // Nearly square images
  return 'full';  // Default size
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

// Updated gallery images with error handling
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
    id: 4,
    src: "https://img.youtube.com/vi/UITDMMyzH04/maxresdefault.jpg",
    fallbackSrc: getRandomFallbackImage(),
    title: "YKFA Training Highlights",
    description: "Watch our students master the art of martial arts",
    featured: true,
    aspectRatio: "360/639",  // Original video aspect ratio
    size: "tall",  // Using tall size for vertical video
    type: "video",
    videoUrl: "https://www.youtube.com/embed/UITDMMyzH04"
  }
];

const ProgramsPage = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>(galleryImages);
  const [animationComplete, setAnimationComplete] = useState<boolean>(false);
  const [imagesLoadedCount, setImagesLoadedCount] = useState<number>(0);
  
  const bentoGridRef = useRef<HTMLDivElement>(null);
  
  // DEBUG: Log image sources to confirm correct paths
  useEffect(() => {
    console.log('Gallery image sources:');
    galleryImages.forEach((img, index) => {
      console.log(`Image ${index + 1}: ${img.src}`);
      
      // Verify if the image really exists (this creates a network request)
      const testImg = new Image();
      testImg.onload = () => console.log(`✅ Image ${index + 1} exists: ${img.src}`);
      testImg.onerror = () => console.error(`❌ Image ${index + 1} does NOT exist: ${img.src}`);
      testImg.src = img.src;
    });
  }, []);

  // Preload images with better tracking, error handling, and fallbacks
  useEffect(() => {
    let loadedCount = 0;
    let errorCount = 0;

    const preloadImages = async () => {
      try {
        console.log("Starting to preload images...");
        
        await Promise.all(
          galleryImages.map((img, index) => {
            return new Promise((resolve) => {
              console.log(`Preloading image ${index + 1}/${galleryImages.length}: ${img.src}`);
              const image = new Image();
              
              // Handle successful load
              image.onload = () => {
                loadedCount++;
                console.log(`Successfully loaded image ${index + 1}/${galleryImages.length}: ${img.src}`);
                setImagesLoadedCount(loadedCount);
                resolve(null);
              };
              
              // Handle loading error with fallback
              image.onerror = () => {
                console.error(`Failed to preload image ${index + 1}/${galleryImages.length}: ${img.src}`);
                
                // Try different Pinterest image formats
                const formats = [
                  "736x", // Original format
                  "564x", // Medium format
                  "236x"  // Small format
                ];
                
                // Extract the image ID and path from the URL
                const urlParts = img.src.split('/');
                const imageId = urlParts[urlParts.length - 1];
                const path = urlParts.slice(0, -1).join('/');
                
                // Get current format
                const currentFormat = urlParts[urlParts.length - 2];
                const currentIndex = formats.indexOf(currentFormat);
                
                if (currentIndex < formats.length - 1) {
                  // Try next format
                  const nextFormat = formats[currentIndex + 1];
                  const newUrl = `${path}/${nextFormat}/${imageId}`;
                  console.log(`Trying fallback URL: ${newUrl}`);
                  
                  // Set up handlers for this fallback
                  const fallbackImg = new Image();
                  
                  // Update the source in the gallery array for future use
                  img.src = newUrl;
                  
                  // Set crossOrigin for external images
                  image.crossOrigin = "anonymous";
                  
                  // Try this URL
                  image.src = newUrl;
                  
                  resolve(null);
                } else {
                  // If all formats fail, use fallback
                  errorCount++;
                  loadedCount++;
                  setImagesLoadedCount(loadedCount);
                  resolve(null);
                }
              };
              
              // Set crossOrigin for external images
              image.crossOrigin = "anonymous";
              
              // Start loading the original image
              image.src = img.src;
            });
          })
        );
        
        console.log(`Preloading complete. Loaded: ${loadedCount}, Errors: ${errorCount}`);
        setIsLoading(false);
      } catch (error) {
        console.error('Unexpected error preloading images:', error);
        setIsLoading(false);
      }
    };

    preloadImages();
  }, []);

  // Handle favorites
  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  // Modal navigation
  const navigateImage = (direction: 'next' | 'prev') => {
    if (selectedImage === null) return;
    
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage);
    let newIndex: number;
    
    if (direction === 'next') {
      newIndex = currentIndex === filteredImages.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    }
    
    setSelectedImage(filteredImages[newIndex].id);
  };
  
  // Set up IntersectionObserver for bento grid animation
  useEffect(() => {
    if (isLoading) return;
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px"
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('bento-grid')) {
            entry.target.classList.add('grid-visible');
          }
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    if (bentoGridRef.current) {
      observer.observe(bentoGridRef.current);
    }
    
    return () => observer.disconnect();
  }, [isLoading]);
  
  // Loading state
  if (isLoading) {
  return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900">
        <div className="relative w-24 h-24 mb-5">
          <div className="absolute inset-0 border-4 border-amber-400/20 rounded-full"></div>
          <div className="absolute inset-0 border-t-4 border-amber-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="w-8 h-8 text-amber-400" />
      </div>
        </div>
        <div className="text-center">
          <p className="text-gray-300 text-lg font-medium mb-2">Loading Gallery</p>
          <p className="text-gray-400 text-sm mb-3">
            {imagesLoadedCount === 0 
              ? "Preparing your images..." 
              : `Loaded ${imagesLoadedCount} of ${galleryImages.length} images`}
          </p>
          <div className="w-64 h-3 bg-dark-700 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-amber-400 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(imagesLoadedCount / galleryImages.length) * 100}%` }}
            ></div>
        </div>
          <p className="text-gray-500 text-xs">
            {imagesLoadedCount === galleryImages.length 
              ? "Finishing up..." 
              : "Loading high-quality images for the best experience"}
          </p>
      </div>
    </div>
  );
  }
  
  const selectedImageData = selectedImage !== null 
    ? galleryImages.find(img => img.id === selectedImage) 
    : null;

  // Animation variants for the puzzle effect
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0.7 
    },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  // Update the size classes function for better 16:9 handling
  const getSizeClass = (size: string): string => {
    switch (size) {
      case 'small':
        return 'col-span-1 row-span-1';
      case 'medium':
        return 'col-span-1 row-span-1 sm:col-span-2 sm:row-span-1';
      case 'large':
        return 'col-span-1 row-span-1 sm:col-span-2 sm:row-span-2';
      case 'wide':
        return 'col-span-1 sm:col-span-2 lg:col-span-2 row-span-1';  // Optimized for 16:9
      case 'tall':
        return 'col-span-1 row-span-2';
      case 'full':
        return 'col-span-1 row-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4';
      default:
        return 'col-span-1 row-span-1';
    }
  };

  // Update the image error handling logic
  const handleImageError = (imgElement: HTMLImageElement, originalSrc: string) => {
    console.error(`Failed to load image: ${originalSrc}`);
    
    // Try different Pinterest image formats
    const formats = [
      "736x", // Original format
      "564x", // Medium format
      "236x"  // Small format
    ];
    
    // Extract the image ID and path from the URL
    const urlParts = originalSrc.split('/');
    const imageId = urlParts[urlParts.length - 1];
    const path = urlParts.slice(0, -1).join('/');
    
    // Get current format
    const currentFormat = urlParts[urlParts.length - 2];
    const currentIndex = formats.indexOf(currentFormat);
    
    if (currentIndex < formats.length - 1) {
      // Try next format
      const nextFormat = formats[currentIndex + 1];
      const newUrl = `${path}/${nextFormat}/${imageId}`;
      console.log(`Trying fallback URL: ${newUrl}`);
      imgElement.src = newUrl;
    } else {
      // If all formats fail, use fallback
      imgElement.src = "/icons/dumbbell-small.svg";
    }
  };

  // Update the Pinterest embed component
  const PinterestEmbed = ({ id }: { id: string }) => {
    return (
      <iframe 
        src={`https://assets.pinterest.com/ext/embed.html?id=${id}`}
        height="415"
        width="236"
        frameBorder="0"
        scrolling="no"
        className="w-full h-full"
        style={{ maxWidth: '100%' }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Programs/Gallery Title Section */}
        <div className="mb-10">
          <div className="max-w-3xl">
            <div className="inline-block mb-6 py-1.5 px-4 rounded-full backdrop-blur-md bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-sm">Our Programs</p>
            </div>
            <h1 className="mb-4 text-4xl md:text-5xl font-bold leading-tight">
              Discover Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">Training Programs</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 text-gray-300 max-w-2xl">
              Explore our comprehensive range of martial arts and fitness programs designed for all skill levels
            </p>
          </div>
        </div>
        
        {/* Bento Grid Gallery */}
        <motion.div 
          ref={bentoGridRef}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="bento-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-[minmax(200px,_auto)] gap-4"
        >
          {filteredImages.map((image) => (
            <motion.div
              key={image.id}
              layout
              variants={itemVariants}
              className={`${getSizeClass(image.size)} bento-item relative overflow-hidden group backdrop-blur-md bg-white/10 hover:bg-white/15 rounded-2xl border border-white/10 hover:border-amber-400/30 transition-all duration-300 shadow-lg shadow-black/20`}
              onClick={() => setSelectedImage(image.id)}
              style={{ 
                originX: 0.5,
                originY: 0.5
              }}
            >
              <div className="relative overflow-hidden rounded-2xl h-full">
                {/* Loading placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-dark-700 to-dark-800 animate-pulse flex items-center justify-center z-0">
                  {image.type === 'video' ? (
                    <Play className="w-8 h-8 text-amber-400/50" />
                  ) : (
                    <Camera className="w-8 h-8 text-amber-400/50" />
                  )}
                </div>
                
                {/* Content Container */}
                <div className="relative w-full h-full">
                  {image.type === 'video' ? (
                    <div className="relative w-full h-full">
                      <img
                        src={image.src}
                        alt={image.title}
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform relative z-10"
                        style={{ aspectRatio: image.aspectRatio }}
                        onError={(e) => {
                          const imgElement = e.target as HTMLImageElement;
                          if (imgElement.src !== image.fallbackSrc) {
                            imgElement.src = image.fallbackSrc;
                          } else {
                            imgElement.src = "/icons/dumbbell-small.svg";
                          }
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="w-16 h-16 rounded-full bg-amber-400/90 flex items-center justify-center backdrop-blur-sm border border-amber-300/50 transform group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-8 h-8 text-black" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={image.src}
                      alt={image.title}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform relative z-10"
                      style={{ aspectRatio: image.aspectRatio }}
                      onError={(e) => {
                        const imgElement = e.target as HTMLImageElement;
                        if (imgElement.src !== image.fallbackSrc) {
                          imgElement.src = image.fallbackSrc;
                        } else {
                          imgElement.src = "/icons/dumbbell-small.svg";
                        }
                      }}
                    />
                  )}
                </div>
                
                {/* Glass overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Favorite button */}
              <div className="absolute top-3 right-3 z-10">
                <button 
                  onClick={(e) => toggleFavorite(e, image.id)}
                  className="w-8 h-8 flex items-center justify-center backdrop-blur-md bg-white/10 hover:bg-white/20 rounded-full text-gray-300 hover:text-amber-400 transition-colors border border-white/20"
                >
                  <Heart className={`w-4 h-4 ${favorites.includes(image.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
              </div>

              {/* Info */}
              <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 will-change-transform">
                <div className="backdrop-blur-lg bg-black/50 p-3 rounded-xl">
                  <h3 className="text-white text-sm font-bold mb-1">{image.title}</h3>
                  <p className="text-white/80 text-xs line-clamp-2">{image.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Summary stats bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: animationComplete ? 1 : 0, 
            y: animationComplete ? 0 : 20 
          }}
          transition={{ duration: 0.6 }}
          className="mt-8 backdrop-blur-md bg-white/5 rounded-xl border border-white/10 p-4 flex flex-wrap gap-6 justify-between items-center"
        >
          <div>
            <p className="text-gray-400 text-sm">
              Displaying <span className="text-amber-400 font-medium">{filteredImages.length}</span> programs
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center text-gray-400 text-sm">
              <Heart className="w-4 h-4 mr-1.5 text-amber-400" />
              {favorites.length} saved
            </div>
            <div className="h-4 w-px bg-white/20"></div>
            <div className="text-gray-400 text-sm flex items-center">
              <Info className="w-4 h-4 mr-1.5 text-amber-400" />
              Click any program to view details
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage !== null && selectedImageData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:text-amber-400 z-50"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Navigation */}
                <button 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:text-amber-400 z-30"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
            >
              <ChevronLeft className="w-6 h-6" />
                </button>
            
                <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:text-amber-400 z-30"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Content */}
            <div 
              className="w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Media Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="flex-1 rounded-2xl overflow-hidden relative"
                >
                  {selectedImageData.type === 'video' ? (
                    <div className="relative w-full pt-[56.25%]">
                      <iframe
                        className="absolute inset-0 w-full h-full rounded-2xl"
                        src={selectedImageData.videoUrl}
                        title={selectedImageData.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
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
                        if (imgElement.src !== selectedImageData.fallbackSrc) {
                          imgElement.src = selectedImageData.fallbackSrc;
                        } else {
                          imgElement.src = "/icons/dumbbell-small.svg";
                        }
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
                      {selectedImageData.title}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">{selectedImageData.title}</h2>
                    <p className="text-gray-300 mb-6 text-sm">{selectedImageData.description}</p>
                    
                    <div className="flex justify-between">
                      <button
                        onClick={(e) => toggleFavorite(e, selectedImageData.id)}
                        className="flex items-center gap-2 text-sm text-white hover:text-amber-400"
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(selectedImageData.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                        {favorites.includes(selectedImageData.id) ? 'Saved' : 'Save'}
                </button>
                      
                <button 
                        className="flex items-center gap-2 text-sm text-white hover:text-amber-400"
                >
                        <Share2 className="w-4 h-4" />
                        Share
                </button>
              </div>
                  </div>
                  
                  {/* Gallery navigation */}
                  <div className="mt-4 p-5 backdrop-blur-lg bg-white/10 border border-white/10 rounded-2xl">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">More from this program</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {filteredImages
                        .filter(img => img.title === selectedImageData.title)
                        .slice(0, 6)
                        .map(img => (
                          <motion.div
                            key={img.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ 
                              duration: 0.3, 
                              delay: 0.1 + (filteredImages.indexOf(img) * 0.05)
                            }}
                            className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition relative ${
                              selectedImage === img.id ? 'ring-2 ring-amber-400' : 'opacity-60 hover:opacity-100'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(img.id);
                            }}
                          >
                            {/* Thumbnail loading placeholder */}
                            <div className="absolute inset-0 bg-dark-700 animate-pulse flex items-center justify-center z-0">
                              <div className="w-4 h-4 rounded-full bg-amber-400/30"></div>
        </div>
                            
                            <img 
                              src={img.src} 
                              alt={img.title}
                              className="w-full h-full object-cover relative z-10"
                              loading="eager"
                              crossOrigin="anonymous"
                              onError={(e) => {
                                const imgElement = e.target as HTMLImageElement;
                                if (imgElement.src !== img.fallbackSrc) {
                                  imgElement.src = img.fallbackSrc;
                                } else {
                                  imgElement.src = "/icons/dumbbell-small.svg";
                                }
                              }}
                            />
                          </motion.div>
                        ))}
                    </div>
            </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Bento grid and animation styles */}
      <style>{`
        /* Hide scrollbar */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Bento grid fade in */
        .bento-grid {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
          will-change: opacity, transform;
        }
        
        .bento-grid.grid-visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Puzzle-joining animation effect */
        .bento-item {
          position: relative;
          transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          transform-origin: center;
          overflow: hidden;
        }
        
        .bento-item::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          transition: box-shadow 0.3s ease;
          pointer-events: none;
          z-index: 5;
        }
        
        .bento-item:hover {
          transform: translateY(-5px);
          z-index: 20;
        }
        
        .bento-item:hover::before {
          box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.5), 0 0 15px rgba(251, 191, 36, 0.1);
        }
        
        @media (prefers-reduced-motion: reduce) {
          .bento-grid, .bento-item {
            transition: none !important;
            animation: none !important;
            transform: none !important;
          }
        }
        
        /* Staggered animation for items */
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
        </div>
  );
};

export default ProgramsPage;