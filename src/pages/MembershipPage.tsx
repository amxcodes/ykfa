import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ChevronRight, ArrowRight, HelpCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface PlanFeature {
  name: string;
  included: boolean;
}

interface PricingPlan {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
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
  onSwitchToMonthly 
}: { 
  plan: PricingPlan, 
  isKarateDummy?: boolean,
  onSwitchToMonthly?: () => void 
}) => {
  const [animationKey, setAnimationKey] = useState(0);
  const [showOfferPrice, setShowOfferPrice] = useState(false);
  
  // Animation effect for price switching with continuous strikethrough
  useEffect(() => {
    if (!plan.originalPrice) return;
    
    // Initial animation
    const initialTimeout = setTimeout(() => {
      setShowOfferPrice(true);
    }, 1500);
    
    // Set up cycling animation
    const interval = setInterval(() => {
      // Switch back to original price with fresh animation
      setShowOfferPrice(false);
      setAnimationKey(prev => prev + 1);
      
      // Show offer price after strike animation completes
      setTimeout(() => {
        setShowOfferPrice(true);
      }, 1500);
    }, 3000);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [plan.originalPrice]);
  
  return (
    <div 
      className={`rounded-xl overflow-hidden ${
        plan.recommended ? 'border-2 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.15)]' : 
        isKarateDummy ? 'border border-amber-400/30 bg-gradient-to-b from-dark-900/80 to-dark-800/80' : 
        'border border-white/10'
      } h-full flex flex-col relative`}
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
        <div className="bg-amber-400/20 text-amber-400 text-xs text-center py-1.5 font-medium relative z-10">
          MONTHLY PLAN ONLY
      </div>
      )}
      
      {/* Card Content */}
      <div className="p-6 flex-grow flex flex-col relative z-10">
        {/* Program Title */}
        <div className="mb-5">
          <h3 className="text-xl font-bold">{plan.name}</h3>
          {plan.originalPrice ? (
            <div className="mt-1 h-7 relative">
              {showOfferPrice ? (
                // Offer price
                <div className="flex items-baseline transition-opacity duration-500 animate-fadeIn">
                  <span className={`text-2xl font-bold ${plan.recommended ? 'text-amber-400' : isKarateDummy ? 'text-gray-400' : 'text-white'}`}>
                    ₹{plan.price.toLocaleString()}
                  </span>
                  <span className="text-gray-400 text-xs ml-1">/{plan.period}</span>
                  <span className="ml-2 text-xs text-green-400">Save ₹{(plan.originalPrice - plan.price).toLocaleString()}</span>
                </div>
              ) : (
                // Original price with striking animation
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-200 relative">
                    ₹{plan.originalPrice.toLocaleString()}
                    <span key={animationKey} className="absolute inset-0 flex items-center">
                      <span className="h-0.5 w-full bg-red-500 animate-grow-strikethrough"></span>
                    </span>
                  </span>
                  <span className="text-gray-400 text-xs ml-1">/{plan.period}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-baseline mt-1">
              <span className={`text-2xl font-bold ${plan.recommended ? 'text-amber-400' : isKarateDummy ? 'text-gray-400' : 'text-white'}`}>
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


const MembershipPage = () => {
  const [planDuration, setPlanDuration] = useState<'monthly' | 'quarterly' | 'halfYearly' | 'annual'>('monthly');
  const [selectedProgram] = useState<string>('all');
  const pricingCardsRef = useRef<HTMLDivElement>(null);
  const prevDurationRef = useRef(planDuration);
  
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

  // Animation on scroll for pricing cards
  useEffect(() => {
    const cards = document.querySelectorAll('.pricing-card');
    
    gsap.set(cards, { 
      opacity: 0,
      y: 50
    });
    
    ScrollTrigger.batch(cards, {
      interval: 0.1,
      onEnter: (elements) => {
        gsap.to(elements, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out"
        });
      },
      start: "top 90%"
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  // Animation on duration change
  useEffect(() => {
    if (pricingCardsRef.current && prevDurationRef.current !== planDuration) {
      const cards = pricingCardsRef.current.querySelectorAll('.pricing-card');
      
      // Clear any existing animations
      gsap.killTweensOf(cards);
      
      // First hide the cards
      gsap.set(cards, { 
        opacity: 0,
        x: -20,
        rotateY: -5
      });
      
      // Then animate them in with a staggered effect
      gsap.to(cards, { 
        opacity: 1,
        x: 0,
        rotateY: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "back.out(1.2)",
        clearProps: "transform"
      });
      
      prevDurationRef.current = planDuration;
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
    image: "https://images.pexels.com/photos/7045573/pexels-photo-7045573.jpeg?auto=compress&fit=crop&w=800&q=80",
    features: [
      { name: "2 classes per week", included: true },
      { name: "Belt progression system", included: true },
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
        price: 3500,
        period: "month",
        description: "Complete package with access to all MMA classes and gym facilities.",
        programType: "MMA + GYM",
        image: "https://images.pexels.com/photos/4761798/pexels-photo-4761798.jpeg?auto=compress&fit=crop&w=800&q=80",
        features: [
          { name: "Access to gym", included: true },
          { name: "3 martial arts classes per week", included: true },
          { name: "Basic fitness assessment", included: true },
          { name: "Access to gym app", included: true },
          { name: "All MMA disciplines included", included: true }
        ],
        recommended: true,
        cta: "Choose Plan"
      },
      {
        id: 2,
        name: "MMA ONLY",
        price: 2500,
        period: "month",
        description: "Access to all MMA classes including boxing, kickboxing, and grappling.",
        programType: "MMA ONLY",
        image: "https://images.pexels.com/photos/4761797/pexels-photo-4761797.jpeg?auto=compress&fit=crop&w=800&q=80",
        features: [
          { name: "3 martial arts classes per week", included: true },
          { name: "Boxing, Kickboxing, Muay Thai", included: true },
          { name: "Wrestling, Judo, BJJ", included: true },
          { name: "Technical sessions", included: true },
          { name: "Sparring sessions", included: true }
        ],
        cta: "Choose Plan"
      },
      {
        id: 3,
        name: "GROUP FITNESS",
        price: 3000,
        period: "month",
        description: "High-energy group fitness sessions for improved strength and endurance.",
        programType: "GROUP FITNESS",
        image: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&fit=crop&w=800&q=80",
        features: [
          { name: "Group cardio sessions with coach", included: true },
          { name: "Access to gym app", included: true },
          { name: "2 days cardio and HIIT", included: true },
          { name: "4 days strength training", included: true },
          { name: "Personalized fitness guidance", included: true }
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
        image: "https://images.pexels.com/photos/7045573/pexels-photo-7045573.jpeg?auto=compress&fit=crop&w=800&q=80",
        features: [
          { name: "2 classes per week", included: true },
          { name: "Belt progression system", included: true },
          { name: "Kata and kumite practice", included: true },
          { name: "Self-defense techniques", included: true },
          { name: "Mental discipline focus", included: true }
        ],
        cta: "Choose Plan"
      },
      {
        id: 5,
        name: "GYM ONLY",
        price: 2500,
        period: "month",
        description: "Unlimited access to our modern gym with top-tier equipment.",
        programType: "GYM ONLY",
        image: "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&fit=crop&w=800&q=80",
        features: [
          { name: "Access to gym", included: true },
          { name: "Access to gym app", included: true },
          { name: "Full range of equipment", included: true },
          { name: "Free weights and machines", included: true },
          { name: "Cardio section", included: true }
        ],
        cta: "Choose Plan"
      }
    ],
    quarterly: [
      {
        id: 1,
        name: "MMA + GYM",
        price: 9500,
        originalPrice: 10500,
        period: "quarter",
        description: "Complete package with access to all MMA classes and gym facilities.",
        programType: "MMA + GYM",
        image: "https://images.pexels.com/photos/4761798/pexels-photo-4761798.jpeg?auto=compress&fit=crop&w=800&q=80",
        features: [
          { name: "Access to gym", included: true },
          { name: "3 martial arts classes per week", included: true },
          { name: "Basic fitness assessment", included: true },
          { name: "Access to gym app", included: true },
          { name: "All MMA disciplines included", included: true }
        ],
        recommended: true,
        cta: "Choose Plan"
      },
      {
        id: 2,
        name: "MMA ONLY",
        price: 5500,
        originalPrice: 7500,
        period: "quarter",
        description: "Access to all MMA classes including boxing, kickboxing, and grappling.",
        programType: "MMA ONLY",
        image: "https://images.pexels.com/photos/4761797/pexels-photo-4761797.jpeg?auto=compress&fit=crop&w=800&q=80",
        features: [
          { name: "3 martial arts classes per week", included: true },
          { name: "Boxing, Kickboxing, Muay Thai", included: true },
          { name: "Wrestling, Judo, BJJ", included: true },
          { name: "Technical sessions", included: true },
          { name: "Sparring sessions", included: true }
        ],
        cta: "Choose Plan"
      },
      {
        id: 3,
        name: "GROUP FITNESS",
        price: 5500,
        originalPrice: 7500,
        period: "quarter",
        description: "High-energy group fitness sessions for improved strength and endurance.",
        programType: "GROUP FITNESS",
        image: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&fit=crop&w=800&q=80",
        features: [
          { name: "Group cardio sessions with coach", included: true },
          { name: "Access to gym app", included: true },
          { name: "2 days cardio and HIIT", included: true },
          { name: "4 days strength training", included: true },
          { name: "Personalized fitness guidance", included: true }
        ],
        cta: "Choose Plan"
      },
      {
        id: 5,
        name: "GYM ONLY",
        price: 5500,
        originalPrice: 7500,
        period: "quarter",
        description: "Unlimited access to our modern gym with top-tier equipment.",
        programType: "GYM ONLY",
        image: "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&fit=crop&w=800&q=80",
        features: [
          { name: "Access to gym", included: true },
          { name: "Access to gym app", included: true },
          { name: "Full range of equipment", included: true },
          { name: "Free weights and machines", included: true },
          { name: "Cardio section", included: true }
        ],
        cta: "Choose Plan"
      }
    ],
    halfYearly: [
      {
        id: 1,
        name: "MMA + GYM",
        price: 15000,
        originalPrice: 21000,
        period: "6mo",
        description: "Complete package with access to all MMA classes and gym facilities.",
        programType: "MMA + GYM",
        image: "https://images.pexels.com/photos/4761798/pexels-photo-4761798.jpeg?auto=compress&fit=crop&w=800&q=80",
        features: [
          { name: "Access to gym", included: true },
          { name: "3 martial arts classes per week", included: true },
          { name: "Basic fitness assessment", included: true },
          { name: "Access to gym app", included: true },
          { name: "All MMA disciplines included", included: true }
        ],
        recommended: true,
        cta: "Choose Plan"
      },
      {
        id: 2,
        name: "MMA ONLY",
        price: 10000,
        originalPrice: 15000,
        period: "6mo",
        description: "Access to all MMA classes including boxing, kickboxing, and grappling.",
        programType: "MMA ONLY",
        image: "https://images.pexels.com/photos/4761797/pexels-photo-4761797.jpeg?auto=compress&fit=crop&w=800&q=80",
        features: [
          { name: "3 martial arts classes per week", included: true },
          { name: "Boxing, Kickboxing, Muay Thai", included: true },
          { name: "Wrestling, Judo, BJJ", included: true },
          { name: "Technical sessions", included: true },
          { name: "Sparring sessions", included: true }
        ],
        cta: "Choose Plan"
      },
      {
        id: 3,
        name: "GROUP FITNESS",
        price: 10000,
        originalPrice: 15000,
        period: "6mo",
        description: "High-energy group fitness sessions for improved strength and endurance.",
        programType: "GROUP FITNESS",
        image: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&fit=crop&w=800&q=80",
        features: [
          { name: "Group cardio sessions with coach", included: true },
          { name: "Access to gym app", included: true },
          { name: "2 days cardio and HIIT", included: true },
          { name: "4 days strength training", included: true },
          { name: "Personalized fitness guidance", included: true }
        ],
        cta: "Choose Plan"
      },
      {
        id: 5,
        name: "GYM ONLY",
        price: 10000,
        originalPrice: 15000,
        period: "6mo",
        description: "Unlimited access to our modern gym with top-tier equipment.",
        programType: "GYM ONLY",
        image: "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&fit=crop&w=800&q=80",
        features: [
          { name: "Access to gym", included: true },
          { name: "Access to gym app", included: true },
          { name: "Full range of equipment", included: true },
          { name: "Free weights and machines", included: true },
          { name: "Cardio section", included: true }
        ],
        cta: "Choose Plan"
      }
    ],
    annual: [
      {
        id: 1,
        name: "MMA + GYM",
        price: 25000,
        originalPrice: 42000,
        period: "year",
        description: "Complete package with access to all MMA classes and gym facilities.",
        programType: "MMA + GYM",
        image: "https://images.pexels.com/photos/4761798/pexels-photo-4761798.jpeg?auto=compress&fit=crop&w=800&q=80",
        features: [
          { name: "Access to gym", included: true },
          { name: "3 martial arts classes per week", included: true },
          { name: "Basic fitness assessment", included: true },
          { name: "Access to gym app", included: true },
          { name: "All MMA disciplines included", included: true }
        ],
        recommended: true,
        cta: "Choose Plan"
      },
      {
        id: 2,
        name: "MMA ONLY",
        price: 15000,
        originalPrice: 30000,
        period: "year",
        description: "Access to all MMA classes including boxing, kickboxing, and grappling.",
        programType: "MMA ONLY",
        image: "https://images.pexels.com/photos/4761797/pexels-photo-4761797.jpeg?auto=compress&fit=crop&w=800&q=80",
        features: [
          { name: "3 martial arts classes per week", included: true },
          { name: "Boxing, Kickboxing, Muay Thai", included: true },
          { name: "Wrestling, Judo, BJJ", included: true },
          { name: "Technical sessions", included: true },
          { name: "Sparring sessions", included: true }
        ],
        cta: "Choose Plan"
      },
      {
        id: 3,
        name: "GROUP FITNESS",
        price: 15000,
        originalPrice: 30000,
        period: "year",
        description: "High-energy group fitness sessions for improved strength and endurance.",
        programType: "GROUP FITNESS",
        image: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&fit=crop&w=800&q=80",
        features: [
          { name: "Group cardio sessions with coach", included: true },
          { name: "Access to gym app", included: true },
          { name: "2 days cardio and HIIT", included: true },
          { name: "4 days strength training", included: true },
          { name: "Personalized fitness guidance", included: true }
        ],
        cta: "Choose Plan"
      },
      {
        id: 5,
        name: "GYM ONLY",
        price: 15000,
        originalPrice: 30000,
        period: "year",
        description: "Unlimited access to our modern gym with top-tier equipment.",
        programType: "GYM ONLY",
        image: "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&fit=crop&w=800&q=80",
        features: [
          { name: "Access to gym", included: true },
          { name: "Access to gym app", included: true },
          { name: "Full range of equipment", included: true },
          { name: "Free weights and machines", included: true },
          { name: "Cardio section", included: true }
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
      question: "What's available with the GYM ONLY membership?",
      answer: "GYM ONLY provides access to all gym facilities and the gym app with full range of equipment including free weights and machines, and a cardio section."
    },
    {
      question: "What martial arts disciplines are taught in the MMA program?",
      answer: "Our MMA program includes Boxing, Kickboxing, Muay Thai, Wrestling, Judo, and BJJ (Brazilian Jiu-Jitsu)."
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
              backgroundImage: "url('https://images.pexels.com/photos/4164766/pexels-photo-4164766.jpeg?auto=compress&cs=tinysrgb&w=1920')" 
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
            <div className="relative z-10 mb-6 mt-8">
              <div className="relative max-w-lg mx-auto">
                <div className="absolute inset-0 bg-dark-700 rounded-xl blur-md opacity-80"></div>
                <div className="relative bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800 p-2 rounded-xl border border-white/5 shadow-xl">
                  <div className="flex flex-wrap justify-center items-center gap-2">
                    {/* Monthly */}
              <button 
                      className={`flex-1 min-w-[90px] py-3 px-4 rounded-lg transition-all relative overflow-hidden ${
                        planDuration === 'monthly' 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold shadow-lg' 
                          : 'bg-dark-800/80 text-gray-300 hover:bg-dark-600'
                      }`}
                onClick={() => setPlanDuration('monthly')}
              >
                      <span className={`block text-base ${planDuration === 'monthly' ? 'text-black' : 'text-gray-200'}`}>Monthly</span>
                      <span className={`block text-xs mt-1 ${planDuration === 'monthly' ? 'text-black/80' : 'text-gray-400'}`}>Regular Price</span>
                      {planDuration === 'monthly' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white/30"></span>
                      )}
                    </button>
                    
                    {/* Quarterly */}
                    <button 
                      className={`flex-1 min-w-[90px] py-3 px-4 rounded-lg transition-all relative overflow-hidden ${
                        planDuration === 'quarterly' 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold shadow-lg' 
                          : 'bg-dark-800/80 text-gray-300 hover:bg-dark-600'
                      }`}
                      onClick={() => setPlanDuration('quarterly')}
                      disabled={selectedProgram === 'KARATE'}
                      title={selectedProgram === 'KARATE' ? 'KARATE is available monthly only' : ''}
                    >
                      <span className={`block text-base ${planDuration === 'quarterly' ? 'text-black' : 'text-gray-200'}`}>Quarterly</span>
                      <span className={`block text-xs mt-1 ${planDuration === 'quarterly' ? 'text-black/80' : 'text-gray-400'}`}>Save 17%</span>
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
                      className={`flex-1 min-w-[95px] py-3 px-2 rounded-lg transition-all relative overflow-hidden ${
                        planDuration === 'halfYearly' 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold shadow-lg' 
                          : 'bg-dark-800/80 text-gray-300 hover:bg-dark-600'
                      }`}
                      onClick={() => setPlanDuration('halfYearly')}
                      disabled={selectedProgram === 'KARATE'}
                      title={selectedProgram === 'KARATE' ? 'KARATE is available monthly only' : ''}
                    >
                      <span className={`block text-base ${planDuration === 'halfYearly' ? 'text-black' : 'text-gray-200'}`}>Half Yearly</span>
                      <span className={`block text-xs mt-1 ${planDuration === 'halfYearly' ? 'text-black/80' : 'text-green-400'}`}>Save 25%</span>
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
                      className={`flex-1 min-w-[90px] py-3 px-4 rounded-lg transition-all relative overflow-hidden ${
                        planDuration === 'annual' 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold shadow-lg' 
                          : 'bg-dark-800/80 text-gray-300 hover:bg-dark-600'
                      }`}
                onClick={() => setPlanDuration('annual')}
                      disabled={selectedProgram === 'KARATE'}
                      title={selectedProgram === 'KARATE' ? 'KARATE is available monthly only' : ''}
                    >
                      <span className={`block text-base ${planDuration === 'annual' ? 'text-black' : 'text-gray-200'}`}>Annual</span>
                      <span className={`block text-xs mt-1 ${planDuration === 'annual' ? 'text-black/80' : 'text-green-400'}`}>Save 30%</span>
                      {planDuration === 'annual' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white/30"></span>
                      )}
                      {selectedProgram === 'KARATE' && (
                        <div className="absolute inset-0 bg-dark-900/70 flex items-center justify-center">
                          <span className="text-xs text-gray-400">Not Available</span>
                        </div>
                      )}
              </button>
                  </div>
                  
                  {/* Best Value Indicator */}
                  <div className="mt-3 text-center">
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
            
            {/* GROUP FITNESS Card */}
            {(selectedProgram === 'all' || selectedProgram === 'GROUP FITNESS') && (
              <div className="pricing-card">
                <ModernPricingCard 
                  plan={pricingPlans[planDuration].find(p => p.programType === 'GROUP FITNESS')!} 
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
            
            {/* GYM ONLY Card */}
            {(selectedProgram === 'all' || selectedProgram === 'GYM ONLY') && (
              <div className="pricing-card">
                <ModernPricingCard 
                  plan={pricingPlans[planDuration].find(p => p.programType === 'GYM ONLY')!} 
                />
              </div>
            )}
          </div>
          
          {/* Personal Training Section */}
          <div className="my-10 pt-8 border-t border-white/10 animate-fade-up">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
                <p className="text-amber-400 font-medium text-sm">Premium Service</p>
              </div>
              <h2 className="mb-4">Personal <span className="text-transparent bg-clip-text bg-gold-gradient">Training</span></h2>
              <p className="text-gray-300">
                Experience personalized coaching with our expert trainers for accelerated results.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
                {/* Full-width background image */}
                <div className="absolute inset-0 -z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=compress&q=80&w=1200" 
                    alt="Personal Training"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/60"></div>
                </div>
                
                {/* Glowing accent elements */}
                <div className="absolute top-0 left-[5%] w-1/3 h-1 bg-gradient-to-r from-amber-400 to-transparent rounded-full blur-sm"></div>
                <div className="absolute bottom-0 right-[5%] w-1/3 h-1 bg-gradient-to-l from-amber-400 to-transparent rounded-full blur-sm"></div>
                
                <div className="relative z-10 grid md:grid-cols-12 min-h-[320px]">
                  {/* Left content */}
                  <div className="md:col-span-8 p-8 md:p-12 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 mb-6">
                      <div className="h-px w-8 bg-amber-400"></div>
                      <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Elite Experience</span>
                    </div>
                    
                    <h3 className="text-3xl md:text-4xl font-bold mb-4">One-on-One Training</h3>
                    
                    <p className="text-gray-300 mb-6 max-w-xl">
                      Accelerate your fitness journey with personalized coaching designed specifically for your goals, body type, and preferences.
                    </p>
                    
                    <Link 
                      to="/contact?program=membership&type=personal_training" 
                      className="inline-flex items-center group"
                    >
                      <span className="bg-amber-400 text-black px-6 py-3 rounded-l-lg font-medium group-hover:bg-amber-500 transition-colors">
                        Book Your Session
                      </span>
                      <span className="bg-amber-400/20 text-amber-400 p-3 rounded-r-lg border-l border-amber-400/30 group-hover:bg-amber-400/30 transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </Link>
                  </div>
                  
                  {/* Right content - Price box */}
                  <div className="md:col-span-4 flex items-center justify-center p-8 bg-dark-900/60 backdrop-blur-sm">
                    <div className="text-center py-8 px-4 border border-amber-400/20 rounded-xl bg-dark-900/60 w-full max-w-[220px] relative overflow-hidden">
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-400/10 rounded-full blur-xl"></div>
                      <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-amber-400/10 rounded-full blur-xl"></div>
                      
                      <span className="text-sm text-amber-400 uppercase tracking-wide">Premium</span>
                      <div className="my-3">
                        <span className="text-4xl font-bold text-white">₹8,000</span>
                        <span className="text-gray-400 text-sm">/month</span>
                      </div>
                      <span className="text-xs text-gray-400 px-3 py-1 rounded-full border border-white/10 bg-white/5">Professional Guidance</span>
                    </div>
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