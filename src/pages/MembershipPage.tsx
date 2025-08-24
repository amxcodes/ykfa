import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ChevronRight, ArrowRight, HelpCircle, Droplet, Wind, Zap } from 'lucide-react';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface RecoveryService {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  duration?: string;
  description: string;
  features: string[];
  image: string;
  icon: React.ReactElement;
  note?: string;
  validity?: string;
}

interface PricingPlan {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  perMonthPrice?: string;
  period: string;
  description: string;
  features: PlanFeature[];
  recommended?: boolean;
  cta: string;
  programType: string;
  image: string;
}

// Modern pricing card
const ModernPricingCard = ({ 
  plan, 
  isKarateDummy = false, 
  onSwitchToMonthly,
  className = ''
}: { 
  plan: PricingPlan, 
  isKarateDummy?: boolean,
  onSwitchToMonthly?: () => void,
  className?: string
}) => {
  const [animationKey, setAnimationKey] = useState(0);
  const [showOfferPrice, setShowOfferPrice] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // DISABLED price animation to reduce memory consumption
  // The continuous 3-second intervals were causing performance issues
  useEffect(() => {
    if (!plan.originalPrice) return;
    
    // Simple one-time animation without intervals
    const timer = setTimeout(() => {
      setShowOfferPrice(true);
    }, 1500);
    
    return () => {
      clearTimeout(timer);
      // Cleanup refs
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [plan.originalPrice]);
  
  // Format per month price if available
  const renderPerMonthPrice = () => {
    if (plan.perMonthPrice) {
      return (
        <div className="text-xs text-green-400 mt-1">
          {plan.perMonthPrice}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div 
      className={`rounded-xl overflow-hidden ${
        plan.recommended ? 'border-2 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.15)]' : 
        'border border-white/10'
      } h-full flex flex-col relative ${className}`}
    >
      {/* Background Image - Half Height and Dimmed */}
      <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/40 to-dark-900/95 z-10"></div>
        <img 
          src={plan.image} 
          alt=""
          className="w-full h-full object-cover object-center opacity-50"
          loading="lazy"
        />
      </div>
      
      {/* Top Badge */}
      {plan.recommended && (
        <div className="bg-amber-400 text-black text-xs text-center py-1.5 font-medium relative z-10">
          MOST POPULAR
        </div>
      )}
      
      {isKarateDummy && (
        <div className="bg-amber-400 text-black text-xs text-center py-1.5 font-medium relative z-10">
          MONTHLY PLAN ONLY
        </div>
      )}
      
      {/* Card Content */}
      <div className="p-6 flex-grow flex flex-col relative z-10">
        {/* Program Title */}
        <div className="mb-5">
          <h3 className="text-xl font-bold">{plan.name}</h3>
          {plan.originalPrice ? (
            <div className="mt-1 min-h-16 relative">
              {showOfferPrice ? (
                // Offer price
                <div className="flex flex-col transition-opacity duration-500 animate-fadeIn">
                  <div className="flex items-baseline">
                    <span className={`text-2xl font-bold ${plan.recommended ? 'text-amber-400' : 'text-white'}`}>
                      ₹{plan.price.toLocaleString()}
                    </span>
                    <span className="text-gray-400 text-xs ml-1">/{plan.period}</span>
                  </div>
                  {renderPerMonthPrice()}
                </div>
              ) : (
                // Original price with striking animation
                <div className="flex flex-col">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-gray-200 relative">
                      ₹{plan.originalPrice.toLocaleString()}
                      <span key={animationKey} className="absolute inset-0 flex items-center">
                        <span className="h-0.5 w-full bg-red-500 animate-grow-strikethrough"></span>
                      </span>
                    </span>
                    <span className="text-gray-400 text-xs ml-1">/{plan.period}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-baseline mt-1">
              <span className={`text-2xl font-bold ${plan.recommended ? 'text-amber-400' : 'text-white'}`}>
                ₹{plan.price.toLocaleString()}
              </span>
              <span className="text-gray-400 text-xs ml-1">/{plan.period}</span>
            </div>
          )}
        </div>
        
        {/* Description */}
        <p className={`text-sm ${isKarateDummy ? 'text-gray-500' : 'text-gray-400'} mb-6`}>
          {plan.description}
        </p>
        
        {/* Features */}
        <div className="space-y-3 mb-6 flex-grow">
        {plan.features.map((feature, index) => (
            <div 
              key={index} 
              className={`flex items-start ${isKarateDummy ? 'opacity-70' : ''}`}
            >
            {feature.included ? (
                <div className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <Check className="w-3 h-3 text-amber-400" />
                </div>
            ) : (
                <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center mr-3 flex-shrink-0">
                  <X className="w-3 h-3 text-gray-500" />
                </div>
            )}
              <span className={`text-sm ${feature.included ? 'text-gray-200' : 'text-gray-500'}`}>
              {feature.name}
            </span>
            </div>
        ))}
        </div>
      </div>
      
      {/* Action Section */}
      <div className="p-6 border-t border-white/10 relative z-10 bg-dark-900/70 backdrop-blur-sm">
        {isKarateDummy ? (
          <div className="space-y-3">
            <button 
              onClick={onSwitchToMonthly} 
              className="w-full py-3 px-4 rounded-lg bg-amber-400 hover:bg-amber-500 text-black font-medium transition-colors flex items-center justify-center"
            >
              Switch to Monthly
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
            <Link 
              to="/contact?program=membership&type=karate" 
              className="w-full py-2 px-4 rounded-lg text-amber-400 hover:text-amber-300 transition-colors text-center block text-sm"
            >
              Contact Us
            </Link>
          </div>
        ) : (
      <Link 
            to={`/contact?program=membership&type=${plan.programType.toLowerCase().replace(' ', '_')}`}
            className={`w-full py-3 px-4 rounded-lg ${
          plan.recommended 
                ? 'bg-amber-400 hover:bg-amber-500 text-black' 
                : 'bg-white/5 hover:bg-white/10 text-white'
            } font-medium transition-colors flex items-center justify-center`}
      >
        {plan.cta}
            <ChevronRight className="ml-2 w-4 h-4" />
      </Link>
        )}
      </div>
    </div>
  );
};

const RecoveryServiceCard = ({ service }: { service: RecoveryService }) => {
  const [animationKey, setAnimationKey] = useState(0);
  const [showOfferPrice, setShowOfferPrice] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // DISABLED price animation intervals to reduce memory consumption
  // The continuous cycling was causing performance issues
  useEffect(() => {
    if (!service.originalPrice) return;
    
    // Simple one-time animation without intervals
    const timer = setTimeout(() => {
      setShowOfferPrice(true);
    }, 1500);
    
    return () => {
      clearTimeout(timer);
      // Cleanup all refs
      if (initialTimeoutRef.current) {
        clearTimeout(initialTimeoutRef.current);
        initialTimeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [service.originalPrice]);

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 h-full flex flex-col relative bg-dark-800 hover:border-amber-500/30 transition-all duration-300 group">
      <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-800/40 to-dark-800/95 z-10"></div>
        <img 
          src={service.image} 
          alt={service.name}
          className="w-full h-full object-cover object-center opacity-40 group-hover:opacity-60 transition-opacity duration-300"
          loading="lazy"
        />
      </div>
      
      {service.validity && (
        <div className="absolute top-0 right-0 bg-green-500 text-black text-xs py-1 px-3 font-medium z-20 m-2 rounded-md">
          {service.validity}
        </div>
      )}

      <div className="p-4 sm:p-6 flex-grow flex flex-col relative z-10">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mr-3 flex-shrink-0 border border-white/10">
            {service.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{service.name}</h3>
            {service.duration && <p className="text-xs text-gray-400">{service.duration}</p>}
          </div>
        </div>

        {service.originalPrice ? (
            <div className="mt-1 min-h-[3.5rem] relative mb-4"> {/* Adjusted min-h */}
              {showOfferPrice ? (
                <div className="flex flex-col transition-opacity duration-500 animate-fadeIn">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-amber-400">
                      ₹{service.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-gray-400 relative">
                      ₹{service.originalPrice.toLocaleString()}
                      <span key={animationKey} className="absolute inset-0 flex items-center">
                        <span className="h-0.5 w-full bg-red-500 animate-grow-strikethrough"></span>
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
          <div className="mb-4">
            <span className="text-2xl font-bold text-amber-400">₹{service.price.toLocaleString()}</span>
            {service.duration && <span className="text-gray-400 text-xs ml-1">/ session</span>}
          </div>
        )}
        
        <p className="text-sm text-gray-400 mb-6">{service.description}</p>
        
        <div className="space-y-3 mb-6 flex-grow">
          {service.features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <div className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center mr-3 flex-shrink-0">
                <Check className="w-3 h-3 text-amber-400" />
              </div>
              <span className="text-sm text-gray-200">{feature}</span>
            </div>
          ))}
        </div>
        {service.note && (
          <p className="text-xs text-amber-300/70 mt-4 italic bg-amber-500/5 p-2 rounded-md border border-amber-500/10">{service.note}</p>
        )}
      </div>
      
      <div className="p-4 sm:p-6 border-t border-white/10 relative z-10 bg-dark-800/70 backdrop-blur-sm">
        <Link 
          to={`/contact?program=recovery&type=${service.id.toLowerCase().replace(' ', '_')}`}
          className="w-full py-2.5 px-4 sm:py-3 rounded-lg bg-amber-400 hover:bg-amber-500 text-black font-medium transition-colors flex items-center justify-center text-sm sm:text-base"
        >
          Book Now
          <ChevronRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

const MembershipPage = () => {
  const [planDuration, setPlanDuration] = useState<'monthly' | 'quarterly' | 'halfYearly' | 'annual'>('monthly');
  const [selectedProgram] = useState<string>('all');
  const pricingCardsRef = useRef<HTMLDivElement>(null);
  const prevDurationRef = useRef(planDuration);
  const recoveryServicesRef = useRef<HTMLDivElement>(null);
  
  const scrollToRecoveryServices = () => {
    recoveryServicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Auto-switch to monthly if KARATE is selected
  useEffect(() => {
    if (selectedProgram === 'KARATE') {
      setPlanDuration('monthly');
    }
  }, [selectedProgram]);
  
  // Function to switch to monthly view to see KARATE
  const switchToMonthlyView = () => {
    setPlanDuration('monthly');
  };

  // Animation on scroll for pricing cards using Intersection Observer
  useEffect(() => {
    // Create an intersection observer to trigger animations when cards enter viewport
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    };
    
    const timeoutRefs: ReturnType<typeof setTimeout>[] = [];
    
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add visible class with staggered delay based on index
          const timeoutId = setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 100); // 100ms stagger
          
          timeoutRefs.push(timeoutId);
          
          // Unobserve once animated
          cardObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe all pricing cards
    const cards = document.querySelectorAll('.pricing-card');
    cards.forEach(card => {
      cardObserver.observe(card);
    });
    
    // Clean up observer and timeouts
    return () => {
      cardObserver.disconnect();
      timeoutRefs.forEach(clearTimeout);
    };
  }, []);
  
  // Animation on duration change using CSS classes
  useEffect(() => {
    if (pricingCardsRef.current && prevDurationRef.current !== planDuration) {
      const cards = pricingCardsRef.current.querySelectorAll('.pricing-card');
      const timeoutRefs: ReturnType<typeof setTimeout>[] = [];
      
      // Apply animations to each card with staggered delays
      cards.forEach((card, index) => {
        // Remove visible class first (if any)
        card.classList.remove('visible');
        
        // Apply enter animation classes
        card.classList.add('duration-change-enter');
        
        // Force a reflow
        if (card instanceof HTMLElement) {
          void card.offsetWidth;
        }
        
        // Start animation after a staggered delay
        const timeoutId1 = setTimeout(() => {
          card.classList.remove('duration-change-enter');
          card.classList.add('duration-change-enter-active');
          
          // Clean up animation classes after animation completes
          const timeoutId2 = setTimeout(() => {
            card.classList.remove('duration-change-enter-active');
            card.classList.add('visible');
          }, 700); // Match the transition duration
          
          timeoutRefs.push(timeoutId2);
        }, index * 120); // Increase stagger delay for more visual separation
        
        timeoutRefs.push(timeoutId1);
      });
      
      prevDurationRef.current = planDuration;
      
      // Clean up timeouts on unmount or dependency change
      return () => {
        timeoutRefs.forEach(clearTimeout);
      };
    }
  }, [planDuration]);
  
  // Create KARATE plan for all durations
  const karatePlan: PricingPlan = {
    id: 4,
    name: "KARATE",
    price: 1000,
    period: "month",
    description: "Traditional Karate training with belt progression system.",
    programType: "KARATE",
    image: "https://images.pexels.com/photos/4428290/pexels-photo-4428290.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    features: [
      { name: "2 classes per week", included: true },
      { name: "Belt progression and certification system", included: true },
      { name: "Kata and kumite practice", included: true },
      { name: "Self-defense techniques", included: true },
      { name: "Mental discipline focus", included: true }
    ],
    cta: "Choose Plan"
  };
  
  const pricingPlans: { monthly: PricingPlan[], quarterly: PricingPlan[], halfYearly: PricingPlan[], annual: PricingPlan[] } = {
    monthly: [
      {
        id: 1,
        name: "MMA + GYM",
        price: 4000,
        period: "month",
        description: "Complete package with access to all MMA classes and gym facilities.",
        programType: "MMA + GYM",
        image: "/img/membership-mma-gym-training-card.webp",
        features: [
          { name: "Access to gym, 3 days per week", included: true },
          { name: "3 mixed martial arts classes per week", included: true },
          { name: "Basic fitness assessment", included: true },
          { name: "Strength and conditioning, HIIT and cardio sessions", included: true },
          { name: "Access to gym app", included: true },
          { name: "All MMA disciplines included", included: true }
        ],
        recommended: true,
        cta: "Choose Plan"
      },
      {
        id: 2,
        name: "MMA ONLY",
        price: 3000,
        period: "month",
        description: "Access to all MMA classes including boxing, kickboxing, and grappling.",
        programType: "MMA ONLY",
        image: "/img/membership-mma-only-training-card.webp",
        features: [
          { name: "3 mixed martial arts classes per week", included: true },
          { name: "Boxing, Kickboxing, Muay Thai", included: true },
          { name: "Wrestling, Judo, BJJ", included: true },
          { name: "Strength and conditioning, HIIT and cardio sessions", included: true },
          { name: "Technical sessions", included: true },
          { name: "Sparring sessions", included: true }
        ],
        cta: "Choose Plan"
      },
      {
        id: 4,
        name: "KARATE",
        price: 1000,
        period: "month",
        description: "Traditional Karate training with belt progression system.",
        programType: "KARATE",
        image: "/img/membership-karate-training-card.webp",
        features: [
          { name: "2 classes per week", included: true },
          { name: "Belt progression and certification system", included: true },
          { name: "Kata and kumite practice", included: true },
          { name: "Self-defense techniques", included: true },
          { name: "Mental discipline focus", included: true }
        ],
        cta: "Choose Plan"
      },
      {
        id: 5,
        name: "GYM FIT FUSION",
        price: 3000,
        period: "month",
        description: "Unlimited access to our modern gym with top-tier equipment.",
        programType: "GYM FIT FUSION",
        image: "/img/membership-gym-fit-fusion-card.webp",
        features: [
          { name: "Access to gym", included: true },
          { name: "Access to gym app", included: true },
          { name: "Full range of equipment", included: true },
          { name: "Free weights and machines", included: true }
        ],
        cta: "Choose Plan"
      }
    ],
    quarterly: [
      {
        id: 1,
        name: "MMA + GYM",
        price: 9000,
        originalPrice: 12000,
        perMonthPrice: "₹3,000 per month",
        period: "quarter",
        description: "Complete package with access to all MMA classes and gym facilities.",
        programType: "MMA + GYM",
        image: "https://images.pexels.com/photos/6295763/pexels-photo-6295763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        features: [
          { name: "Access to gym, 3 days per week", included: true },
          { name: "3 mixed martial arts classes per week", included: true },
          { name: "Basic fitness assessment", included: true },
          { name: "Strength and conditioning, HIIT and cardio sessions", included: true },
          { name: "Access to gym app", included: true },
          { name: "All MMA disciplines included", included: true }
        ],
        recommended: true,
        cta: "Choose Plan"
      },
      {
        id: 2,
        name: "MMA ONLY",
        price: 7500,
        originalPrice: 9000,
        perMonthPrice: "₹2,500 per month",
        period: "quarter",
        description: "Access to all MMA classes including boxing, kickboxing, and grappling.",
        programType: "MMA ONLY",
        image: "https://images.pexels.com/photos/4401810/pexels-photo-4401810.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
        features: [
          { name: "3 mixed martial arts classes per week", included: true },
          { name: "Boxing, Kickboxing, Muay Thai", included: true },
          { name: "Wrestling, Judo, BJJ", included: true },
          { name: "Strength and conditioning, HIIT and cardio sessions", included: true },
          { name: "Technical sessions", included: true },
          { name: "Sparring sessions", included: true }
        ],
        cta: "Choose Plan"
      },
      {
        id: 5,
        name: "GYM FIT FUSION",
        price: 7500,
        originalPrice: 9000,
        perMonthPrice: "₹2,500 per month",
        period: "quarter",
        description: "Unlimited access to our modern gym with top-tier equipment.",
        programType: "GYM FIT FUSION",
        image: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&fit=crop&w=800&q=80",
        features: [
          { name: "Access to gym", included: true },
          { name: "Access to gym app", included: true },
          { name: "Full range of equipment", included: true },
          { name: "Free weights and machines", included: true }
        ],
        cta: "Choose Plan"
      }
    ],
    halfYearly: [
      {
        id: 1,
        name: "MMA + GYM",
        price: 15000,
        originalPrice: 24000,
        perMonthPrice: "₹2,500 per month",
        period: "6mo",
        description: "Complete package with access to all MMA classes and gym facilities.",
        programType: "MMA + GYM",
        image: "https://images.pexels.com/photos/6295763/pexels-photo-6295763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        features: [
          { name: "Access to gym, 3 days per week", included: true },
          { name: "3 mixed martial arts classes per week", included: true },
          { name: "Basic fitness assessment", included: true },
          { name: "Strength and conditioning, HIIT and cardio sessions", included: true },
          { name: "Access to gym app", included: true },
          { name: "All MMA disciplines included", included: true }
        ],
        recommended: true,
        cta: "Choose Plan"
      },
      {
        id: 2,
        name: "MMA ONLY",
        price: 12000,
        originalPrice: 18000,
        perMonthPrice: "₹2,000 per month",
        period: "6mo",
        description: "Access to all MMA classes including boxing, kickboxing, and grappling.",
        programType: "MMA ONLY",
        image: "https://images.pexels.com/photos/4401810/pexels-photo-4401810.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
        features: [
          { name: "3 mixed martial arts classes per week", included: true },
          { name: "Boxing, Kickboxing, Muay Thai", included: true },
          { name: "Wrestling, Judo, BJJ", included: true },
          { name: "Strength and conditioning, HIIT and cardio sessions", included: true },
          { name: "Technical sessions", included: true },
          { name: "Sparring sessions", included: true }
        ],
        cta: "Choose Plan"
      },
      {
        id: 5,
        name: "GYM FIT FUSION",
        price: 12000,
        originalPrice: 18000,
        perMonthPrice: "₹2,000 per month",
        period: "6mo",
        description: "Unlimited access to our modern gym with top-tier equipment.",
        programType: "GYM FIT FUSION",
        image: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&fit=crop&w=800&q=80",
        features: [
          { name: "Access to gym", included: true },
          { name: "Access to gym app", included: true },
          { name: "Full range of equipment", included: true },
          { name: "Free weights and machines", included: true }
        ],
        cta: "Choose Plan"
      }
    ],
    annual: [
      {
        id: 1,
        name: "MMA + GYM",
        price: 24000,
        originalPrice: 48000,
        perMonthPrice: "₹2,000 per month",
        period: "year",
        description: "Complete package with access to all MMA classes and gym facilities.",
        programType: "MMA + GYM",
        image: "https://images.pexels.com/photos/6295763/pexels-photo-6295763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        features: [
          { name: "Access to gym, 3 days per week", included: true },
          { name: "3 mixed martial arts classes per week", included: true },
          { name: "Basic fitness assessment", included: true },
          { name: "Strength and conditioning, HIIT and cardio sessions", included: true },
          { name: "Access to gym app", included: true },
          { name: "All MMA disciplines included", included: true }
        ],
        recommended: true,
        cta: "Choose Plan"
      },
      {
        id: 2,
        name: "MMA ONLY",
        price: 20000,
        originalPrice: 36000,
        perMonthPrice: "₹1,500 per month",
        period: "year",
        description: "Access to all MMA classes including boxing, kickboxing, and grappling.",
        programType: "MMA ONLY",
        image: "https://images.pexels.com/photos/4401810/pexels-photo-4401810.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
        features: [
          { name: "3 mixed martial arts classes per week", included: true },
          { name: "Boxing, Kickboxing, Muay Thai", included: true },
          { name: "Wrestling, Judo, BJJ", included: true },
          { name: "Strength and conditioning, HIIT and cardio sessions", included: true },
          { name: "Technical sessions", included: true },
          { name: "Sparring sessions", included: true }
        ],
        cta: "Choose Plan"
      },
      {
        id: 5,
        name: "GYM FIT FUSION",
        price: 20000,
        originalPrice: 36000,
        perMonthPrice: "₹1,666 per month",
        period: "year",
        description: "Unlimited access to our modern gym with top-tier equipment.",
        programType: "GYM FIT FUSION",
        image: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&fit=crop&w=800&q=80",
        features: [
          { name: "Access to gym", included: true },
          { name: "Access to gym app", included: true },
          { name: "Full range of equipment", included: true },
          { name: "Free weights and machines", included: true }
        ],
        cta: "Choose Plan"
      }
    ]
  };
  
  // Updated FAQ data based on image
  const faqs = [
    {
      question: "What are the key features of MMA + GYM?",
      answer: "MMA + GYM includes access to gym facilities, 3 martial arts classes per week, basic fitness assessment, and access to our gym app."
    },
    {
      question: "What's included in MMA ONLY membership?",
      answer: "MMA ONLY provides 3 martial arts classes per week including Boxing, Kickboxing, Muay Thai, Wrestling, Judo, and BJJ with technical and sparring sessions."
    },
    {
      question: "How many classes per week do I get with KARATE membership?",
      answer: "The KARATE membership includes 2 classes per week focused on traditional karate training."
    },
    {
      question: "What does GROUP FITNESS membership include?",
      answer: "GROUP FITNESS includes group cardio sessions with a coach, access to gym app, 2 days of cardio and HIIT workouts, and 4 days of strength training."
    },
    {
      question: "What's available with the GYM FIT FUSION membership?",
      answer: "GYM FIT FUSION provides access to all gym facilities and the gym app with full range of equipment including free weights and machines, and a cardio section."
    },
    {
      question: "What martial arts disciplines are taught in the MMA program?",
      answer: "Our MMA program includes Boxing, Kickboxing, Muay Thai, Wrestling, Judo, and BJJ (Brazilian Jiu-Jitsu)."
    }
  ];

  const recoveryServicesData: RecoveryService[] = [
    {
      id: "steam",
      name: "Steam Bath",
      price: 500,
      duration: "15 mins",
      description: "Relax and detoxify with a refreshing steam session.",
      features: [
        "Improves circulation",
        "Clears congestion",
        "Soothes muscle soreness",
        "Promotes skin health"
      ],
      image: "/img/facility-steam-bath-facility.webp",
      icon: <Wind size={24} className="text-sky-400" />,
      note: "Must be booked at least one day in advance."
    },
    {
      id: "ice",
      name: "Ice Bath",
      price: 700,
      duration: "10-15 mins",
      description: "Accelerate recovery and reduce inflammation with a revitalizing ice bath.",
      features: [
        "Reduces muscle soreness and inflammation",
        "Improves circulation and recovery",
        "Boosts central nervous system",
        "Enhances mental clarity"
      ],
      image: "/img/facility-ice-bath-facility.webp",
      icon: <Droplet size={24} className="text-blue-400" />,
      note: "Must be booked at least one day in advance."
    },
    {
      id: "recovery-package",
      name: "Recovery Package",
      price: 2500,
      originalPrice: 3600,
      validity: "3 Months Validity",
      description: "Bundle of steam and ice bath sessions for optimal recovery over 3 months.",
      features: [
        "3 Steam Bath sessions",
        "3 Ice Bath sessions",
        "Cost-effective bundle",
        "Flexible booking (1 day advance notice)"
      ],
      image: "/img/facility-recovery-package-facility.webp", // Placeholder
      icon: <Zap size={24} className="text-green-400" />,
      note: "Steam bath and Ice bath services must be booked at least one day in advance."
    }
  ];

  return (
    <>
      {/* Add custom animation styles */}
      <style>
        {`
          @keyframes growStrikethrough {
            0% { transform: scaleX(0); }
            100% { transform: scaleX(1); }
          }
          .animate-grow-strikethrough {
            animation: growStrikethrough 1s cubic-bezier(0.65, 0, 0.35, 1) forwards;
            transform-origin: left;
          }
          
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(5px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}
      </style>
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-black">
        <div className="absolute inset-0 z-0 bg-black">
          <div 
            className="absolute inset-0 bg-center bg-cover opacity-40"
            style={{ 
              backgroundImage: "url('/img/membership-membership-hero-banner.webp')"
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/70"></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-sm">Membership Options</p>
            </div>
            <h1 className="mb-6">Invest in Your <span className="text-transparent bg-clip-text bg-gold-gradient">Transformation</span></h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl">
              Flexible membership options designed to fit your goals, schedule, and budget.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section bg-dark-900">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
            <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-sm">Pricing Plans</p>
            </div>
            <h2 className="mb-4">Choose Your <span className="text-transparent bg-clip-text bg-gold-gradient">Membership</span></h2>
            <p className="text-gray-300 mb-8">
              Select the plan that best fits your training goals and commitment level.
            </p>
            
            {/* Membership Duration - Redesigned */}
            <div className="relative z-10 mb-6 mt-8 px-4 sm:px-0">
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-0 bg-dark-700 rounded-xl blur-md opacity-80"></div>
                <div className="relative bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800 p-2 rounded-xl border border-white/5 shadow-xl overflow-hidden">
                  <div className="flex flex-wrap justify-center items-stretch gap-2">
                    {/* Monthly */}
              <button 
                      className={`flex-1 basis-full sm:basis-[calc(20%-8px)] min-h-[70px] sm:min-h-0 py-3 px-4 rounded-lg transition-all relative overflow-hidden ${
                        planDuration === 'monthly' 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold shadow-lg' 
                          : 'bg-dark-800/80 text-gray-300 hover:bg-dark-600'
                      }`}
                onClick={() => setPlanDuration('monthly')}
              >
                      <div className="flex sm:flex-col items-center justify-between sm:justify-center h-full">
                        <span className={`text-base ${planDuration === 'monthly' ? 'text-black' : 'text-gray-200'}`}>Monthly</span>
                        <span className={`text-xs ${planDuration === 'monthly' ? 'text-black/80' : 'text-gray-400'}`}>Regular Price</span>
                      </div>
                      {planDuration === 'monthly' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white/30"></span>
                      )}
                    </button>
                    
                    {/* Quarterly */}
                    <button 
                      className={`flex-1 basis-[calc(50%-4px)] sm:basis-[calc(20%-8px)] min-h-[70px] sm:min-h-0 py-3 px-4 rounded-lg transition-all relative overflow-hidden ${
                        planDuration === 'quarterly' 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold shadow-lg' 
                          : 'bg-dark-800/80 text-gray-300 hover:bg-dark-600'
                      }`}
                      onClick={() => setPlanDuration('quarterly')}
                      disabled={selectedProgram === 'KARATE'}
                      title={selectedProgram === 'KARATE' ? 'KARATE is available monthly only' : ''}
                    >
                      <div className="flex sm:flex-col items-center justify-between sm:justify-center h-full">
                        <span className={`text-base ${planDuration === 'quarterly' ? 'text-black' : 'text-gray-200'}`}>Quarterly</span>
                        <span className={`text-xs ${planDuration === 'quarterly' ? 'text-black/80' : 'text-gray-400'}`}>Save 28%</span>
                      </div>
                      {planDuration === 'quarterly' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white/30"></span>
                      )}
                      {selectedProgram === 'KARATE' && (
                        <div className="absolute inset-0 bg-dark-900/70 flex items-center justify-center">
                          <span className="text-xs text-gray-400">Not Available</span>
                        </div>
                      )}
                    </button>
                    
                    {/* Half-Yearly */}
                    <button 
                      className={`flex-1 basis-[calc(50%-4px)] sm:basis-[calc(20%-8px)] min-h-[70px] sm:min-h-0 py-3 px-4 rounded-lg transition-all relative overflow-hidden ${
                        planDuration === 'halfYearly' 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold shadow-lg' 
                          : 'bg-dark-800/80 text-gray-300 hover:bg-dark-600'
                      }`}
                      onClick={() => setPlanDuration('halfYearly')}
                      disabled={selectedProgram === 'KARATE'}
                      title={selectedProgram === 'KARATE' ? 'KARATE is available monthly only' : ''}
                    >
                      <div className="flex sm:flex-col items-center justify-between sm:justify-center h-full">
                        <span className={`text-base ${planDuration === 'halfYearly' ? 'text-black' : 'text-gray-200'}`}>Half Yearly</span>
                        <span className={`text-xs ${planDuration === 'halfYearly' ? 'text-black/80' : 'text-green-400'}`}>Save 34%</span>
                      </div>
                      {planDuration === 'halfYearly' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white/30"></span>
                      )}
                      {selectedProgram === 'KARATE' && (
                        <div className="absolute inset-0 bg-dark-900/70 flex items-center justify-center">
                          <span className="text-xs text-gray-400">Not Available</span>
                        </div>
                      )}
              </button>
                    
                    {/* Annual */}
              <button 
                      className={`flex-1 basis-[calc(50%-4px)] sm:basis-[calc(20%-8px)] min-h-[70px] sm:min-h-0 py-3 px-4 rounded-lg transition-all relative overflow-hidden ${
                        planDuration === 'annual' 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold shadow-lg' 
                          : 'bg-dark-800/80 text-gray-300 hover:bg-dark-600'
                      }`}
                onClick={() => setPlanDuration('annual')}
                      disabled={selectedProgram === 'KARATE'}
                      title={selectedProgram === 'KARATE' ? 'KARATE is available monthly only' : ''}
                    >
                      <div className="flex sm:flex-col items-center justify-between sm:justify-center h-full">
                        <span className={`text-base ${planDuration === 'annual' ? 'text-black' : 'text-gray-200'}`}>Annual</span>
                        <span className={`text-xs ${planDuration === 'annual' ? 'text-black/80' : 'text-green-400'}`}>Save 50%</span>
                      </div>
                      {planDuration === 'annual' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white/30"></span>
                      )}
                      {selectedProgram === 'KARATE' && (
                        <div className="absolute inset-0 bg-dark-900/70 flex items-center justify-center">
                          <span className="text-xs text-gray-400">Not Available</span>
                        </div>
                      )}
              </button>

                    {/* Steam/Ice Button */}
                    <button 
                      className="flex-1 basis-[calc(50%-4px)] sm:basis-[calc(20%-8px)] min-h-[70px] sm:min-h-0 py-3 px-4 rounded-lg transition-all relative overflow-hidden bg-gradient-to-r from-sky-500 to-blue-400 text-black font-semibold shadow-lg hover:from-sky-600 hover:to-blue-500"
                      onClick={scrollToRecoveryServices}
                    >
                      <div className="flex sm:flex-col items-center justify-between sm:justify-center h-full gap-1 sm:gap-0">
                        <span className="text-sm sm:text-base whitespace-nowrap">Steam/Ice</span>
                        <span className="text-[10px] sm:text-xs text-black/80 whitespace-nowrap">Recovery</span>
                      </div>
                    </button>
                  </div>
                  
                  {/* Best Value Indicator */}
                  <div className="mt-3 text-center px-2">
                    <span className={`text-xs ${planDuration === 'annual' ? 'text-amber-400' : 'text-gray-500'}`}>
                      {planDuration === 'annual' && "Best value: Save up to ₹17,000 with annual plan"}
                      {planDuration === 'halfYearly' && "Great value: Save up to ₹6,000 with half-yearly plan"}
                      {planDuration === 'quarterly' && "Good value: Save up to ₹2,000 with quarterly plan"}
                      {planDuration === 'monthly' && "Flexible: Pay month-to-month, cancel anytime"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Membership Cards */}
          <div ref={pricingCardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {/* MMA + GYM Card */}
            {(selectedProgram === 'all' || selectedProgram === 'MMA + GYM') && (
              <div className="pricing-card">
                <ModernPricingCard 
                  plan={pricingPlans[planDuration].find(p => p.programType === 'MMA + GYM')!} 
                />
              </div>
            )}
            
            {/* MMA ONLY Card */}
            {(selectedProgram === 'all' || selectedProgram === 'MMA ONLY') && (
              <div className="pricing-card">
                <ModernPricingCard 
                  plan={pricingPlans[planDuration].find(p => p.programType === 'MMA ONLY')!} 
                />
              </div>
            )}
            
            {/* KARATE Card (real or dummy based on duration) */}
            {(selectedProgram === 'all' || selectedProgram === 'KARATE') && (
              <div className="pricing-card">
                {(planDuration === 'monthly' || selectedProgram === 'KARATE') ? (
                  <ModernPricingCard plan={karatePlan} />
                ) : (
                  <ModernPricingCard 
                    plan={karatePlan} 
                    isKarateDummy={true} 
                    onSwitchToMonthly={switchToMonthlyView} 
                  />
                )}
              </div>
            )}
            
            {/* GYM FIT FUSION Card */}
            {(selectedProgram === 'all' || selectedProgram === 'GYM FIT FUSION') && (
              <div className="pricing-card">
                <ModernPricingCard 
                  plan={pricingPlans[planDuration].find(p => p.programType === 'GYM FIT FUSION')!} 
                />
              </div>
            )}

            {/* Coming Soon Card - Now at the end */}
            {(selectedProgram === 'all' || selectedProgram === 'GROUP FITNESS') && (
              <div className="pricing-card relative">
                <div className="rounded-xl overflow-hidden border border-white/10 h-full flex flex-col bg-gradient-to-br from-dark-800 via-dark-900 to-amber-950/50">
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent"></div>
                  <div className="p-6 flex-grow flex flex-col items-center justify-center text-center relative">
                    <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20">
                      <HelpCircle className="w-7 h-7 text-amber-500/70" />
                    </div>
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400 mb-2">Coming Soon</h3>
                    <p className="text-sm text-amber-200/60">New programs launching shortly</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Personal Training Section */}
          <div className="my-10 pt-8 border-t border-white/10 animate-fade-up">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
                <p className="text-amber-400 font-medium text-sm">Premium Service</p>
              </div>
              <h2 className="mb-4">Personal <span className="text-transparent bg-clip-text bg-gold-gradient">Training</span></h2>
              <p className="text-gray-300">
                Experience personalized coaching with our expert trainers for accelerated results.
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
              {/* GYM FIT FUSION Personal Training */}
              <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] group transition-all duration-500 flex flex-col">
                <div className="absolute inset-0 -z-10">
                  <img 
                    src="/img/membership-gym-personal-training.webp" 
                    alt="Gym Personal Training"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-black/80"></div>
                </div>
                
                <div className="absolute top-0 left-[5%] w-1/3 h-1 bg-gradient-to-r from-amber-400 to-transparent rounded-full blur-sm"></div>
                <div className="absolute bottom-0 right-[5%] w-1/3 h-1 bg-gradient-to-l from-amber-400 to-transparent rounded-full blur-sm"></div>
                
                <div className="relative z-10 p-6 md:p-8">
                    <div className="inline-flex items-center gap-2 mb-6">
                      <div className="h-px w-8 bg-amber-400"></div>
                      <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Elite Experience</span>
                    </div>
                    
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">GYM FIT FUSION Training</h3>
                    
                  <p className="text-gray-300 mb-8">
                    Personalized gym workouts and cardio sessions designed for your fitness goals.
                  </p>

                  {/* Features List */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-amber-400" />
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm">Customized workout plans tailored to your goals</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-amber-400" />
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm">One-on-one sessions with certified trainers</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-amber-400" />
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm">Nutrition guidance and meal planning support</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-amber-400" />
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm">Progress tracking and regular assessments</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-6 items-center mt-auto pt-6">
                    <div className="p-4 border border-amber-400/20 rounded-xl bg-dark-900/60 backdrop-blur-sm">
                      <span className="text-sm text-amber-400 uppercase tracking-wide block mb-2">Premium</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white">₹8,000</span>
                        <span className="text-gray-400 text-sm">/month</span>
                      </div>
                    </div>
                    
                    <Link 
                      to="/contact?program=membership&type=personal_training_gym"
                      className="inline-flex items-center justify-center px-8 py-3 font-medium text-amber-400 transition-colors duration-300 bg-transparent border-2 border-amber-400 rounded-lg shadow-lg hover:bg-amber-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-dark-900 group"
                    >
                      <span className="relative flex items-center text-sm sm:text-base">
                        Book Your Session
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </div>
                </div>
                  </div>
                  
              {/* MMA + GYM Personal Training */}
              <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] group transition-all duration-500 flex flex-col">
                <div className="absolute inset-0 -z-10">
                  <img 
                    src="/img/membership-mma-gym-training-card.webp" 
                    alt="MMA Personal Training"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-black/80"></div>
                </div>
                
                <div className="absolute top-0 left-[5%] w-1/3 h-1 bg-gradient-to-r from-amber-400 to-transparent rounded-full blur-sm"></div>
                <div className="absolute bottom-0 right-[5%] w-1/3 h-1 bg-gradient-to-l from-amber-400 to-transparent rounded-full blur-sm"></div>
                
                <div className="relative z-10 p-6 md:p-8">
                  <div className="inline-flex items-center gap-2 mb-6">
                    <div className="h-px w-8 bg-amber-400"></div>
                    <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Premium Plus</span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">MMA + GYM Training</h3>
                  
                  <p className="text-gray-300 mb-8">
                    One-on-one MMA training combined with personalized gym workouts for complete combat fitness.
                  </p>

                  {/* Features List */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-amber-400" />
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm">Private MMA technique and sparring sessions</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-amber-400" />
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm">Strength and conditioning for combat sports</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-amber-400" />
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm">Fight-specific nutrition and recovery plans</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-amber-400" />
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm">Video analysis and technique refinement</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-6 items-center mt-auto pt-6">
                    <div className="p-4 border border-amber-400/20 rounded-xl bg-dark-900/60 backdrop-blur-sm">
                      <span className="text-sm text-amber-400 uppercase tracking-wide block mb-2">Premium Plus</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white">₹10,000</span>
                        <span className="text-gray-400 text-sm">/month</span>
                      </div>
                    </div>
                    
                    <Link
                      to="/contact?program=membership&type=personal_training_mma"
                      className="inline-flex items-center justify-center px-8 py-3 font-medium text-amber-400 transition-colors duration-300 bg-transparent border-2 border-amber-400 rounded-lg shadow-lg hover:bg-amber-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-dark-900 group"
                    >
                      <span className="relative flex items-center text-sm sm:text-base">
                        Book Your Session
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center animate-fade-up">
            <p className="text-gray-400 flex flex-col sm:flex-row items-center justify-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Not sure which plan is right for you? <Link to="/contact" className="text-amber-400 hover:underline">Contact us</Link> for guidance.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Recovery Services Section */}
      <section ref={recoveryServicesRef} className="section bg-dark-900 py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
            <div className="inline-block mb-4 py-1 px-3 rounded-full bg-sky-400/20 border border-sky-400/30">
              <p className="text-sky-400 font-medium text-sm">Recharge & Recover</p>
            </div>
            <h2 className="mb-4">Recovery <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Services</span></h2>
            <p className="text-gray-300">
              Enhance your well-being and accelerate muscle recovery with our specialized services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recoveryServicesData.map((service) => (
              <div key={service.id} className="pricing-card"> {/* Use existing animation class if desired */}
                <RecoveryServiceCard service={service} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs - Redesigned */}
      <section className="section bg-dark-900 py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
            <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-sm">Program Information</p>
            </div>
            <h2 className="mb-4">Program <span className="text-transparent bg-clip-text bg-gold-gradient">Details</span></h2>
            <p className="text-gray-300">
              Learn more about what's included in each of our membership programs.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="card bg-dark-800 hover:bg-dark-700 transition-colors animate-fade-up">
                  <h3 className="text-lg font-bold mb-2 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center mr-3 flex-shrink-0 text-sm font-bold">
                      {index + 1}
                    </span>
                    {faq.question}
                  </h3>
                  <p className="text-gray-400">{faq.answer}</p>
            </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Modified */}
      <section className="py-24 relative">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-center bg-cover opacity-30"
            style={{ 
              backgroundImage: "url('https://images.pexels.com/photos/4162452/pexels-photo-4162452.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" 
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/70"></div>
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h2 className="mb-6">Ready to <span className="text-transparent bg-clip-text bg-gold-gradient">Join</span> Us?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Start your journey toward fitness and martial arts excellence today.
            </p>
            <div className="flex justify-center">
              <Link to="/contact" className="btn btn-primary px-10 py-3 text-base">
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MembershipPage;