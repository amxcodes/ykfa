import { Phone, Heart, Tag, ChevronRight, Star, Award, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
  rating?: number;
  description?: string;
  inStock?: boolean;
}

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'martial-arts', name: 'Martial Arts' },
  { id: 'yoga', name: 'Yoga' },
  { id: 'weights', name: 'Weights & Training' },
  { id: 'accessories', name: 'Accessories' }
];

// Memoized Product Card Components
const ProductCard = memo(({ product, toggleFavorite, favorites, formatPrice }: { 
  product: Product; 
  toggleFavorite: (id: number) => void; 
  favorites: number[]; 
  formatPrice: (price: number) => string;
}) => {
  return (
    <div 
      className="product-card backdrop-blur-lg bg-white/10 rounded-2xl overflow-hidden group border border-white/20 hover:border-amber-400/30 transition-all hover:shadow-lg hover:shadow-amber-500/10"
      style={{ 
        contain: 'content'
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width="300"
          height="225"
          decoding="async"
          fetchPriority="low"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
          style={{ 
            backgroundColor: '#1a1a1a',
            contentVisibility: 'auto'
          }}
        />
        
        {/* Glassmorphic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Category badge */}
        <div className="absolute top-3 left-3 backdrop-blur-md bg-white/10 text-amber-400 text-xs py-1 px-3 rounded-full flex items-center border border-white/20">
          <Tag className="w-3 h-3 mr-1" />
          {categories.find(c => c.id === product.category)?.name || product.category}
        </div>
        
        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={() => toggleFavorite(product.id)} 
            className="w-8 h-8 flex items-center justify-center backdrop-blur-md bg-white/10 hover:bg-white/20 rounded-full text-gray-300 hover:text-amber-400 transition-colors border border-white/20"
          >
            <Heart className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>
        
        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 backdrop-blur-md bg-black/70 flex items-center justify-center">
            <span className="bg-red-500/80 text-white px-3 py-1 rounded-full text-sm font-medium border border-white/20">
              Out of Stock
            </span>
          </div>
        )}
        
        {/* Quick actions on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
          <div className="space-x-2 scale-90 group-hover:scale-100 transition-transform duration-300">
            <Link 
              to={`https://wa.me/917736488858?text=I'm interested in purchasing ${product.name} for ${formatPrice(product.price)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center py-2 px-4 backdrop-blur-md bg-amber-400/90 hover:bg-amber-500 text-black text-sm rounded-full transition-colors shadow-lg"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5" />
              Order via WhatsApp
            </Link>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        {/* Product details */}
        <h3 className="text-base font-semibold mb-2 group-hover:text-amber-400 transition-colors">{product.name}</h3>
        <p className="text-gray-400 text-xs mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-amber-400 font-semibold">{formatPrice(product.price)}</span>
          </div>
          
          {product.rating && (
            <div className="flex items-center text-xs text-gray-400 backdrop-blur-md bg-white/5 py-1 px-2 rounded-full border border-white/10">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1" />
              {product.rating}
            </div>
          )}
        </div>
      </div>
    </div>
  )
});

// Memoized Featured Product Component

// Memoized Category Pills
const CategoryPills = memo(({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: { 
  categories: { id: string; name: string }[]; 
  activeCategory: string; 
  onCategoryChange: (id: string) => void; 
}) => {
  return (
    <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
      <div className="flex space-x-3 min-w-max">
        {categories.map(category => (
          <button
            key={category.id}
            className={`py-2.5 px-5 rounded-full transition-all text-sm font-medium flex items-center shadow-lg
              ${activeCategory === category.id 
                ? 'bg-amber-400/90 text-black border border-amber-300/50' 
                : 'backdrop-blur-md bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
              }`}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
});

const StorePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const productGridRef = useRef<HTMLDivElement>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Add state for lazy loading animations
  const [isVisible, setIsVisible] = useState(false);
  
  const products: Product[] = useMemo(() => [
    {
      id: 1,
      name: "Premium Yoga Mat",
      price: 1499,
      image: "https://images.pexels.com/photos/4662438/pexels-photo-4662438.jpeg",
      category: "yoga",
      rating: 4.8,
      description: "High-density eco-friendly yoga mat with non-slip surface",
      inStock: true,
      featured: true
    },
    {
      id: 2,
      name: "Adjustable Dumbbell Set",
      price: 8999,
      image: "https://images.pexels.com/photos/4164766/pexels-photo-4164766.jpeg",
      category: "weights",
      rating: 4.9,
      description: "Space-saving adjustable dumbbells from 5-25kg each",
      inStock: true
    },
    {
      id: 3,
      name: "Resistance Band Pack",
      price: 899,
      image: "https://images.pexels.com/photos/4498155/pexels-photo-4498155.jpeg",
      category: "accessories",
      rating: 4.7,
      description: "Set of 5 resistance bands with different resistance levels",
      inStock: true
    },
    {
      id: 4,
      name: "Boxing Gloves",
      price: 2499,
      image: "https://images.pexels.com/photos/4754146/pexels-photo-4754146.jpeg",
      category: "martial-arts",
      rating: 4.6,
      description: "Premium leather boxing gloves with wrist support",
      inStock: true,
      featured: true
    },
    {
      id: 5,
      name: "Karate Gi",
      price: 2699,
      image: "https://images.pexels.com/photos/7045391/pexels-photo-7045391.jpeg",
      category: "martial-arts",
      rating: 4.8,
      description: "Traditional karate uniform made from high-quality cotton",
      inStock: true
    },
    {
      id: 6,
      name: "Foam Roller",
      price: 999,
      image: "https://images.pexels.com/photos/4498137/pexels-photo-4498137.jpeg",
      category: "accessories",
      rating: 4.5,
      description: "Textured foam roller for massage and muscle recovery",
      inStock: true
    },
    {
      id: 7,
      name: "Punching Bag",
      price: 3499,
      image: "https://images.pexels.com/photos/5749068/pexels-photo-5749068.jpeg",
      category: "martial-arts",
      rating: 4.7,
      description: "Heavy-duty punching bag with chain mount system",
      inStock: false
    },
    {
      id: 8,
      name: "Suspension Trainer",
      price: 1999,
      image: "https://images.pexels.com/photos/4164756/pexels-photo-4164756.jpeg",
      category: "weights",
      rating: 4.8,
      description: "Complete body weight training system with door anchor",
      inStock: true,
      featured: true
    }
  ], []);

  // Memoized featured products

  // Handle favorites - memoized
  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  }, []);

  // Memoized price formatter
  const formatPrice = useCallback((price: number) => {
    return `₹${price}`;
  }, []);

  // Handle category change - memoized
  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
  }, []);

  // Filter products on category change
  useEffect(() => {
    // Don't set isInitialLoad to false on first render
    if (!isInitialLoad) {
      // Use a simple state update to prevent React from batching state updates
      requestAnimationFrame(() => {
        if (activeCategory === 'all') {
          setFilteredProducts(products);
        } else {
          setFilteredProducts(products.filter(product => product.category === activeCategory));
        }
      });
    } else {
      // Just set filtered products without animations on initial load
      setFilteredProducts(activeCategory === 'all' ? products : products.filter(product => product.category === activeCategory));
      // Set isInitialLoad to false after first render
      setTimeout(() => setIsInitialLoad(false), 100);
    }
  }, [activeCategory, products, isInitialLoad]);
  
  // Animation for product grid on category change - only run when not initial load
  useEffect(() => {
    if (productGridRef.current && !isInitialLoad) {
      // Add and remove class to trigger animations
      productGridRef.current.classList.add('animate-products');
      
      // Remove animation class after animation completes
      const timer = setTimeout(() => {
        if (productGridRef.current) {
          productGridRef.current.classList.remove('animate-products');
        }
      }, 1000); // Slightly longer than the animation duration
      
      return () => clearTimeout(timer);
    }
  }, [filteredProducts, isInitialLoad]);

  // Set up IntersectionObserver for lazy loading animations
  useEffect(() => {
    // Create options with low threshold for earlier detection
    const observerOptions = {
      threshold: 0.05,
      rootMargin: "-20px 0px"
    };
    
    // Create one observer for all elements
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Handle section visibility
          setIsVisible(true);
          
          // Handle any element with observe-me class
          if (entry.target.classList.contains('observe-me')) {
            entry.target.classList.add('fade-in');
          }
          
          // Handle product grid
          if (entry.target.classList.contains('products-grid')) {
            entry.target.classList.add('grid-visible');
          }
          
          // Stop observing once visible
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Collect all elements to observe
    const elementsToObserve = [
      productGridRef.current,
      ...Array.from(document.querySelectorAll('.observe-me'))
    ].filter(Boolean); // Filter out null elements
    
    // Start observing all elements
    elementsToObserve.forEach(el => {
      if (el) observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  // Style modifications for glassmorphic design
  const glassmorphicStyles = `
  /* Hide scrollbar */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* Smooth fade-in animation with CSS only */
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

  /* Products grid animations */
  .products-grid {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    will-change: opacity, transform;
  }

  .products-grid.grid-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Product grid animations on category change with staggered delay */
  .products-grid-animated .product-card {
    opacity: 0;
    transform: translateY(15px);
    animation: fadeInUp 0.5s ease-out forwards;
    contain: content;
  }

  /* Staggered animation delays */
  .products-grid-animated .product-card:nth-child(4n+1),
  .animate-products .product-card:nth-child(4n+1) {
    animation-delay: 0.05s;
  }
  .products-grid-animated .product-card:nth-child(4n+2),
  .animate-products .product-card:nth-child(4n+2) {
    animation-delay: 0.1s;
  }
  .products-grid-animated .product-card:nth-child(4n+3),
  .animate-products .product-card:nth-child(4n+3) {
    animation-delay: 0.15s;
  }
  .products-grid-animated .product-card:nth-child(4n+4),
  .animate-products .product-card:nth-child(4n+4) {
    animation-delay: 0.2s;
  }

  /* Animation when changing category */
  .animate-products .product-card {
    opacity: 0;
    transform: translateY(15px);
    animation: fadeInUp 0.5s ease-out forwards;
  }

  /* Animation for category filtering */
  .category-filtered .product-card {
    transition: opacity 0.4s ease-out, transform 0.4s ease-out;
  }

  /* Glassmorphic hover effect */
  .product-card {
    transition: transform 0.3s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out;
  }

  .product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 15px rgba(251, 191, 36, 0.1);
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes pulseGlow {
    0%, 100% {
      box-shadow: 0 0 0 rgba(251, 191, 36, 0);
    }
    50% {
      box-shadow: 0 0 15px rgba(251, 191, 36, 0.2);
    }
  }

  /* Add smooth glow animation to buttons */
  .bg-amber-400 {
    animation: pulseGlow 3s infinite;
  }

  /* Add backdrop-filter for better blur support */
  .backdrop-blur-md {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .backdrop-blur-lg {
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  @media (prefers-reduced-motion: reduce) {
    .observe-me, .products-grid, .product-card {
      transition: none !important;
      animation: none !important;
      transform: none !important;
      opacity: 1 !important;
    }
  }
  `;

  // In the document head section, add a preload directive for critical images

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-20 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-center bg-cover opacity-50"
            style={{ 
              backgroundImage: "url('https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=1280&q=80')",
              willChange: 'transform',
              contentVisibility: 'auto',
              transform: isVisible ? 'scale(1)' : 'scale(1.05)',
              transition: 'transform 1.5s ease-out'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black"></div>
          
          {/* Glassmorphic decorative elements */}
          <div className="absolute top-1/3 -left-16 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block mb-6 py-1.5 px-4 rounded-full backdrop-blur-md bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-sm">YKFA Store</p>
            </div>
            <h1 className="mb-4 text-4xl md:text-5xl font-bold leading-tight">
              Premium Fitness <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">Equipment</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 text-gray-300 max-w-2xl">
              Discover our curated selection of high-quality fitness and martial arts equipment to enhance your training journey.
            </p>
            
            {/* Quick inventory panel */}
            <div className="backdrop-blur-lg bg-white/10 p-5 rounded-2xl border border-white/20 mb-6 shadow-xl transform transition-all duration-500 hover:border-amber-400/20">
              <div className="flex justify-between items-center">
                <h3 className="text-white text-sm sm:text-base font-medium">Browse our collection of quality fitness equipment</h3>
                <div className="text-xs text-amber-300 backdrop-blur-md bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  {filteredProducts.length} products
                </div>
              </div>
            </div>
            
            {/* Direct Contact Banner */}
            <div className="backdrop-blur-lg bg-gradient-to-r from-amber-500/20 to-amber-600/10 p-5 rounded-2xl border border-amber-400/30 shadow-xl mb-8">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="p-3 backdrop-blur-md bg-amber-400/20 rounded-full border border-amber-400/30">
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-amber-300 font-medium text-sm sm:text-base mb-1">Direct WhatsApp Ordering</h3>
                  <p className="text-xs sm:text-sm text-gray-300">Browse products, save favorites, and message us on WhatsApp at <span className="text-amber-200 font-medium">+91 7736488858</span> to purchase</p>
                </div>
                <Link
                  to="https://wa.me/917736488858"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 sm:mt-0 py-2.5 px-5 bg-amber-400 hover:bg-amber-500 text-black text-sm rounded-full transition-colors whitespace-nowrap flex-shrink-0 shadow-lg transform hover:scale-105 transition-transform duration-300"
                >
                  Open WhatsApp
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Quality Showcase */}
      <section className="py-16 bg-gradient-to-b from-black to-dark-900">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="backdrop-blur-lg bg-white/10 p-6 rounded-2xl border border-white/20 hover:border-amber-400/20 transition-all shadow-xl observe-me hover:transform hover:translate-y-[-5px] transition-transform duration-300">
              <div className="flex items-start gap-5">
                <div className="p-3.5 backdrop-blur-md bg-amber-400/10 rounded-full text-amber-400 border border-amber-400/20">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">Premium Quality</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">We source only durable, high-quality equipment from trusted brands for your training needs.</p>
                </div>
              </div>
            </div>
            <div className="backdrop-blur-lg bg-white/10 p-6 rounded-2xl border border-white/20 hover:border-amber-400/20 transition-all shadow-xl observe-me hover:transform hover:translate-y-[-5px] transition-transform duration-300">
              <div className="flex items-start gap-5">
                <div className="p-3.5 backdrop-blur-md bg-amber-400/10 rounded-full text-amber-400 border border-amber-400/20">
                  <Phone className="w-6 h-6" />
                  </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">Easy Ordering</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Simply contact us via WhatsApp with the products you want to purchase. No complicated checkout!</p>
                </div>
              </div>
            </div>
            <div className="backdrop-blur-lg bg-white/10 p-6 rounded-2xl border border-white/20 hover:border-amber-400/20 transition-all shadow-xl observe-me hover:transform hover:translate-y-[-5px] transition-transform duration-300">
              <div className="flex items-start gap-5">
                <div className="p-3.5 backdrop-blur-md bg-amber-400/10 rounded-full text-amber-400 border border-amber-400/20">
                  <ShoppingBag className="w-6 h-6" />
                  </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">In-Store Pickup</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Visit our facility to pick up your purchased items or ask about local delivery options.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Content - Main product catalog */}
      <section className="py-20 bg-gradient-to-b from-dark-900 to-dark-800">
        <div className="container">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-amber-400"></div>
              <h2 className="text-2xl md:text-3xl font-bold">Our Products</h2>
            </div>
            <p className="text-gray-400 max-w-2xl">Browse our catalog of high-quality fitness and martial arts equipment</p>
          </div>
          
          {/* Category Pills */}
          <CategoryPills 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
          
          {/* Products Grid */}
          <div 
            ref={productGridRef} 
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 products-grid ${!isInitialLoad ? 'products-grid-animated' : ''} ${activeCategory !== 'all' ? 'category-filtered' : ''}`}
            style={{ contain: 'content' }}
          >
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
                toggleFavorite={toggleFavorite}
                favorites={favorites}
                formatPrice={formatPrice}
              />
            ))}
          </div>
          
          {/* Contact CTA */}
          <div className="mt-20 backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/10 rounded-3xl border border-white/20 p-8 relative overflow-hidden shadow-2xl observe-me hover:border-amber-400/20 transition-all">
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>
            
            <div className="max-w-xl relative">
              <h3 className="text-2xl font-bold mb-5">How to Purchase Our Products</h3>
              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 backdrop-blur-md bg-amber-400/20 rounded-full flex items-center justify-center text-amber-400 text-sm font-bold mt-0.5 border border-amber-400/30">1</div>
                  <p className="text-gray-300">Browse our products and mark your favorites</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 backdrop-blur-md bg-amber-400/20 rounded-full flex items-center justify-center text-amber-400 text-sm font-bold mt-0.5 border border-amber-400/30">2</div>
                  <p className="text-gray-300">Contact us via WhatsApp at +91 7736488858 with the product names</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 backdrop-blur-md bg-amber-400/20 rounded-full flex items-center justify-center text-amber-400 text-sm font-bold mt-0.5 border border-amber-400/30">3</div>
                  <p className="text-gray-300">Arrange payment and pickup from our facility, or inquire about delivery options</p>
                </div>
              </div>
              
              <Link 
                to="https://wa.me/917736488858"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-amber-400 hover:bg-amber-500 text-black px-7 py-3.5 rounded-full font-medium transition-colors group shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                WhatsApp Us Now
                <ChevronRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Apply glassmorphic styles */}
      <style>{glassmorphicStyles}</style>
    </>
  );
};

export default StorePage; 