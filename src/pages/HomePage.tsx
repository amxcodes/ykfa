import { ArrowRight, Timer, MessageCircle, Bot, Calculator, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { useState, useEffect, useRef, useContext, useCallback } from 'react';
// Import the ShuffleCards component
import { ShuffleCards } from '../components/ui/shuffle-cards';
import ChatbotInterface from '../components/ChatbotInterface';
import { WidgetContext } from '../App';
import { PROGRAM_SELECTED_EVENT } from '../components/Footer';

// Moved static arrays outside components and optimized image dimensions
const ABOUT_IMAGES_DATA = [
  "/img/about-img9857.webp", 
  "/img/about-img9840.webp", 
  "/img/about-img9847.webp", 
  "/img/about-img9853.webp", 
  "/img/about-img9860.webp", 
  "/img/screenshot-2025-05-07.webp"
];

const PROGRAMS_DATA = [
  {
    id: 1,
    title: "MMA + GYM",
    description: "Complete package with access to all MMA classes and gym facilities.",
    image: "/img/membership-card1 mma + gym.webp",
    link: "/programs",
    category: "mma"
  },
  {
    id: 2,
    title: "MMA ONLY",
    description: "Access to all MMA classes including boxing, kickboxing etc",
    image: "/img/membership-hero mma only.webp",
    link: "/programs",
    category: "mma"
  },
  {
    id: 4,
    title: "KARATE",
    description: "Traditional Karate training with belt progression system.",
    image: "/img/membership-card3 karate.webp",
    link: "/programs",
    category: "karate"
  },
  {
    id: 5,
    title: "GYM FIT FUSION",
    description: "Unlimited access to our modern gym with top-tier equipment.",
    image: "/img/membership-card4 gym.webp",
    link: "/programs",
    category: "fitness"
  }
];

const FloatingButtons = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showWhatsAppWidget, setShowWhatsAppWidget] = useState(false);
  const [showInitialTooltip, setShowInitialTooltip] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showBMICalculator, setShowBMICalculator] = useState(false);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const { activeWidget, setActiveWidget } = useContext(WidgetContext);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Hide initial tooltip after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMounted.current) {
      setShowInitialTooltip(false);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Listen for active widget changes from context menu
  useEffect(() => {
    if (activeWidget) {
      if (isMounted.current) {
      setIsExpanded(true);
      setShowInitialTooltip(false);
      // Open the appropriate widget
      switch (activeWidget) {
        case 'whatsapp':
          setShowWhatsAppWidget(true);
          setShowChatbot(false);
          setShowBMICalculator(false);
          break;
        case 'chatbot':
          setShowWhatsAppWidget(false);
          setShowChatbot(true);
          setShowBMICalculator(false);
          break;
        case 'bmi':
          setShowWhatsAppWidget(false);
          setShowChatbot(false);
          setShowBMICalculator(true);
          break;
      }
        setActiveWidget(null); // This is fine as it's part of context, not local state
      }
    }
  }, [activeWidget, setActiveWidget]);

  // Toggle widget visibility and ensure only one is open at a time
  const toggleWidget = (widgetName: 'whatsapp' | 'chatbot' | 'bmi') => {
    // Determine which state to toggle based on widget name
    switch (widgetName) {
      case 'whatsapp':
        // Close other widgets if opening this one
        if (!showWhatsAppWidget) {
          setShowChatbot(false);
          setShowBMICalculator(false);
        }
        setShowWhatsAppWidget(!showWhatsAppWidget);
        break;
      case 'chatbot':
        // Close other widgets if opening this one
        if (!showChatbot) {
          setShowWhatsAppWidget(false);
          setShowBMICalculator(false);
        }
        setShowChatbot(!showChatbot);
        break;
      case 'bmi':
        // Close other widgets if opening this one
        if (!showBMICalculator) {
          setShowWhatsAppWidget(false);
          setShowChatbot(false);
        }
        setShowBMICalculator(!showBMICalculator);
        break;
    }
  };

  const calculateBMI = () => {
    if (weight && height) {
      const weightInKg = parseFloat(weight);
      const heightInM = parseFloat(height) / 100; // Convert cm to m
      const bmi = weightInKg / (heightInM * heightInM);
      setBmiResult(parseFloat(bmi.toFixed(1)));
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-400' };
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-400' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-400' };
    return { category: 'Obese', color: 'text-red-400' };
  };

  return (
    <>
      {/* Initial Tooltip with enhanced animation */}
      <div 
        className={`fixed bottom-24 sm:bottom-28 right-20 sm:right-28 z-50 glassmorphic text-white px-4 py-2 transition-all duration-500 max-w-[220px] sm:max-w-none
          ${showInitialTooltip && !isExpanded 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}
      >
        <p className="text-sm">Need help? Click + to:</p>
        <ul className="mt-1 text-xs space-y-1">
          <li className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3 text-green-500" />
            Chat on WhatsApp
          </li>
          <li className="flex items-center gap-1">
            <Bot className="w-3 h-3 text-blue-500" />
            Talk to our AI Assistant
          </li>
          <li className="flex items-center gap-1">
            <Calculator className="w-3 h-3 text-amber-500" />
            Calculate your BMI
          </li>
        </ul>
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-black/80 border-b-8 border-b-transparent"></div>
      </div>

      <div className="fixed bottom-24 sm:bottom-28 right-4 sm:right-8 z-50 flex flex-col gap-4">
        <div className={`flex flex-col gap-4 transition-all duration-500 ease-out
          ${isExpanded 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-16 scale-90 pointer-events-none'}`}>
          
          {/* BMI Calculator Widget */}
          <div className="relative group">
            <div 
              className={`fixed bottom-8 sm:bottom-12 right-14 sm:right-16 glassmorphic-dark w-[calc(100vw-32px)] sm:w-72 max-w-[280px] overflow-hidden transition-all duration-500 ease-out border border-white/10
                ${showBMICalculator 
                  ? 'opacity-100 translate-y-0 scale-100 rotate-0' 
                  : 'opacity-0 translate-y-8 translate-x-8 scale-95 rotate-3 pointer-events-none'}`}
              style={{ 
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                maxHeight: bmiResult !== null ? 'calc(100vh - 250px)' : 'auto',
                height: bmiResult !== null ? 'auto' : 'fit-content',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: 50,
                top: 'auto',
                bottom: '2rem',
                transform: 'none',
                transformOrigin: 'bottom right'
              }}
            >
              <div 
                className={`bg-gradient-to-r from-amber-400/20 to-amber-500/20 border-b border-amber-400/20 p-2.5 sm:p-3 transition-all duration-500 ${showBMICalculator ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                style={{ transitionDelay: showBMICalculator ? '0.1s' : '0s' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 rounded-xl bg-amber-400/20 flex items-center justify-center">
                    <Calculator className={`w-4 h-4 sm:w-5 sm:h-5 text-amber-400 transition-all duration-500 ${showBMICalculator ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} 
                      style={{ transitionDelay: showBMICalculator ? '0.2s' : '0s' }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`font-semibold text-xs sm:text-sm truncate text-white transition-all duration-500 ${showBMICalculator ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                      style={{ transitionDelay: showBMICalculator ? '0.25s' : '0s' }}
                    >
                      BMI Calculator
                    </h3>
                    <p className={`text-[10px] text-gray-400 transition-all duration-500 ${showBMICalculator ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                      style={{ transitionDelay: showBMICalculator ? '0.3s' : '0s' }}
                    >
                      Calculate your Body Mass Index
                    </p>
                  </div>
                </div>
              </div>
              <div 
                className="p-2.5 sm:p-3 overflow-y-auto scrollbar-hide" 
                style={{ 
                  maxHeight: bmiResult !== null ? 'calc(100vh - 350px)' : 'auto',
                  transition: 'max-height 0.5s ease-out',
                  scrollbarWidth: 'none', /* Firefox */
                  msOverflowStyle: 'none', /* IE and Edge */
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                <div className="space-y-2.5 sm:space-y-3">
                  <div className={`space-y-1.5 transition-all duration-500 ${showBMICalculator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: showBMICalculator ? '0.35s' : '0s' }}
                  >
                    <label className="block text-xs font-medium text-gray-300">Weight (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-2.5 py-2 bg-white/90 border border-white/20 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 text-gray-900 placeholder-gray-500 text-xs sm:text-sm transition-all duration-200"
                      placeholder="Enter weight"
                    />
                  </div>
                  <div className={`space-y-1.5 transition-all duration-500 ${showBMICalculator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: showBMICalculator ? '0.4s' : '0s' }}
                  >
                    <label className="block text-xs font-medium text-gray-300">Height (cm)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-2.5 py-2 bg-white/90 border border-white/20 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 text-gray-900 placeholder-gray-500 text-xs sm:text-sm transition-all duration-200"
                      placeholder="Enter height"
                    />
                  </div>
                  <button
                    onClick={calculateBMI}
                    className={`w-full bg-gradient-to-r from-amber-400/20 to-amber-500/20 hover:from-amber-400/30 hover:to-amber-500/30 text-amber-400 font-medium py-2 rounded-lg transition-all duration-500 text-xs sm:text-sm border border-amber-400/20 hover:border-amber-400/30 ${showBMICalculator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: showBMICalculator ? '0.45s' : '0s' }}
                  >
                    Calculate BMI
                  </button>
                  {bmiResult !== null && (
                    <div className="mt-3 p-3 bg-gradient-to-br from-dark-700/50 to-dark-800/50 rounded-lg border border-white/5 animate-fade-in">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs text-gray-400">Your BMI:</p>
                        <p className="text-xl sm:text-2xl font-bold text-white">{bmiResult}</p>
                      </div>
                      <div className={`text-xs font-medium py-1 px-2.5 rounded-md bg-amber-400/10 border border-amber-400/20 ${getBMICategory(bmiResult).color}`}>
                        {getBMICategory(bmiResult).category}
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/5">
                        <p className="text-[9px] sm:text-[10px] text-gray-400 leading-relaxed">
                          {bmiResult < 18.5 ? 'Consider consulting a healthcare provider for guidance on healthy weight gain.' :
                           bmiResult < 25 ? 'Your BMI is within the healthy range. Keep maintaining a balanced lifestyle!' :
                           bmiResult < 30 ? 'Consider consulting a healthcare provider for guidance on healthy weight management.' :
                           'Consider consulting a healthcare provider for guidance on weight management and overall health.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <style 
                dangerouslySetInnerHTML={{
                  __html: `
                    /* Hide scrollbar for Chrome, Safari and Opera */
                    .scrollbar-hide::-webkit-scrollbar {
                      display: none;
                    }
                    
                    /* Global scrollbar hiding styles */
                    ::-webkit-scrollbar {
                      width: 0px;
                      background: transparent;
                    }
                    
                    * {
                      scrollbar-width: none;
                      -ms-overflow-style: none;
                    }
                    
                    body {
                      overflow-y: scroll;
                      scrollbar-width: none;
                      -ms-overflow-style: none;
                    }
                  `
                }}
              ></style>
            </div>

            {/* BMI Calculator Button with pulse animation */}
            <div className="relative group">
              <button
                onClick={() => toggleWidget('bmi')}
                className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full glassmorphic group relative"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
              >
                <Calculator className={`w-5 h-5 sm:w-6 sm:h-6 text-amber-400 group-hover:scale-110 transition-transform duration-300 ${showBMICalculator ? 'rotate-180' : 'rotate-0'}`} />
                
                {/* Floating label */}
                <span 
                  className={`absolute glassmorphic px-3 py-1.5 text-white text-xs whitespace-nowrap transition-all duration-500 pointer-events-none group-hover:bg-amber-400/20 group-hover:border-amber-400/30
                right-full mr-3
                ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
                  style={{
                    transitionDelay: isExpanded ? '200ms' : '0ms',
                    top: '50%',
                    transform: `translateY(-50%) ${isExpanded ? 'translateX(0)' : 'translateX(-10px)'}`
                  }}
                >
                  BMI Calculator
                </span>
              </button>
            </div>
          </div>

          {/* WhatsApp Widget Container */}
          <div className="relative group">
            <div 
              className={`absolute bottom-0 right-0 sm:right-16 bg-white rounded-lg shadow-xl w-[calc(100vw-24px)] sm:w-80 max-w-[320px] overflow-hidden transition-all duration-500 ease-out
                ${showWhatsAppWidget 
                  ? 'opacity-100 translate-x-0 scale-100' 
                  : 'opacity-0 translate-x-16 scale-95 pointer-events-none'}`}
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
            >
              <div className="bg-[#25D366] text-white p-2.5 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm sm:text-base truncate">How may we Help you?</h3>
                    <p className="text-[10px] sm:text-xs opacity-90">Hit Click below to chat on WhatsApp</p>
                  </div>
                </div>
              </div>
              <div className="p-2.5 sm:p-4">
                <p className="text-gray-500 text-[10px] sm:text-xs mb-2 sm:mb-3">Our team typically replies in a few minutes.</p>
                <a 
                  href="https://wa.me/917736488858"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center bg-[#25D366]/10 rounded-full flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="#25D366" className="w-4 h-4 sm:w-6 sm:h-6">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">Yaseen's YKFA</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">+91 77364 88858</p>
                  </div>
                  <div className="text-[#25D366] flex-shrink-0">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </a>
              </div>
            </div>

            {/* WhatsApp Button with pulse animation */}
            <button
              onClick={() => toggleWidget('whatsapp')}
              className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full glassmorphic group relative"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
            >
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 group-hover:scale-110 transition-transform duration-300" />
              
              {/* Floating label */}
              <span 
                className={`absolute glassmorphic px-3 py-1.5 text-white text-xs whitespace-nowrap transition-all duration-500 pointer-events-none group-hover:bg-green-400/20 group-hover:border-green-400/30
                right-full mr-3
                ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
                style={{
                  transitionDelay: isExpanded ? '100ms' : '0ms',
                  top: '50%',
                  transform: `translateY(-50%) ${isExpanded ? 'translateX(0)' : 'translateX(-10px)'}`
                }}
              >
                WhatsApp
              </span>
            </button>
          </div>

          {/* Chatbot Button with pulse animation */}
          <button
            onClick={() => toggleWidget('chatbot')}
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full glassmorphic group relative"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
          >
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
            
            {/* Floating label */}
            <span 
              className={`absolute glassmorphic px-3 py-1.5 text-white text-xs whitespace-nowrap transition-all duration-500 pointer-events-none group-hover:bg-blue-400/20 group-hover:border-blue-400/30
              right-full mr-3
              ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
              style={{
                transitionDelay: isExpanded ? '0ms' : '0ms',
                top: '50%',
                transform: `translateY(-50%) ${isExpanded ? 'translateX(0)' : 'translateX(-10px)'}`
              }}
            >
              AI Assistant
            </span>
          </button>
        </div>

        {/* Main Toggle Button with enhanced animation */}
        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
            if (!isExpanded) {
              setShowInitialTooltip(false);
            } else {
              // Close all widgets when collapsing the menu
              setShowWhatsAppWidget(false);
              setShowChatbot(false);
              setShowBMICalculator(false);
            }
          }}
          className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full glassmorphic group relative overflow-hidden"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-amber-600/20 group-hover:scale-150 transition-transform duration-700 ease-out" />
          <div className="relative w-5 h-5 sm:w-6 sm:h-6">
            <div className={`absolute inset-0 transition-all duration-500 ${isExpanded ? 'rotate-180 scale-110' : 'rotate-0'}`}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-full h-full text-white"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" className={`transition-all duration-500 ${isExpanded ? 'opacity-0' : 'opacity-100'}`} />
                <path d="M5 5l14 14M19 5L5 19" className={`transition-all duration-500 ${isExpanded ? 'opacity-100' : 'opacity-0'}`} />
              </svg>
            </div>
          </div>
        </button>
      </div>

      {/* Chatbot Interface */}
      <ChatbotInterface isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
    </>
  );
};

// Program details modal component
const ProgramDetailsModal = ({
  program,
  isOpen,
  onClose
}: {
  program: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = useRef(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  
  // Use a single animation state with a unified type
  const [modalState, setModalState] = useState<'closed' | 'opening' | 'open' | 'closing'>(isOpen ? 'opening' : 'closed');
  
  // Modal state management
  useEffect(() => {
    if (isOpen && modalState === 'closed') {
      setModalState('opening');
    } else if (!isOpen && modalState === 'open') {
      setModalState('closing');
    }
  }, [isOpen, modalState]);
  
  // Handle modal state transitions
  useEffect(() => {
    if (modalState === 'opening') {
      const timer = setTimeout(() => {
        setModalState('open');
      }, 100);
      return () => clearTimeout(timer);
    } else if (modalState === 'closing') {
      const timer = setTimeout(() => {
        setModalState('closed');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [modalState]);
  
  // Add proper ESC key handler cleanup
  useEffect(() => {
    // Add ESC key handler only when modal is open
    if (isOpen) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEsc);
      
      // Prevent scrolling on the body while modal is open
      document.body.style.overflow = 'hidden';
      
      // Cleanup function to remove event listener and restore scroll
      return () => {
        document.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = '';
      };
    }
    
    // Empty cleanup when modal is not open
    return () => {};
  }, [isOpen, onClose]);
  
  const getProgramDetails = useCallback(() => {
    const pTitle = program?.title || '';
    return {
      schedule: pTitle === "MMA + GYM" ? "Gym access (3 days per week), 3 mixed martial arts classes per week" :
                pTitle === "MMA ONLY" ? "3 mixed martial arts classes per week" :
                pTitle === "GROUP FITNESS" ? "2 days cardio, 4 days strength training" :
                pTitle === "KARATE" ? "2 classes per week" : "Gym access",
      trainer: pTitle === "MMA + GYM" ? "Coach Yaseen & Team" :
               pTitle === "MMA ONLY" ? "Coach Yaseen & Team" :
               pTitle === "GROUP FITNESS" ? "Fitness Coach" :
               pTitle === "KARATE" ? "Master Yaseen & Team" : "Self-guided with assistance",
      features: pTitle === "MMA + GYM" ? [
                  "Access to gym, 3 days per week", 
                  "3 mixed martial arts classes per week", 
                  "Strength and conditioning, HIIT and cardio sessions",
                  "Basic fitness assessment",
                  "All MMA disciplines included"
                ] :
                pTitle === "MMA ONLY" ? [
                  "3 mixed martial arts classes per week",
                  "Boxing, Kickboxing, Muay Thai", 
                  "Wrestling, Judo, BJJ", 
                  "Strength and conditioning, HIIT and cardio sessions",
                  "Technical sessions" 
                ] :
                pTitle === "GROUP FITNESS" ? [
                  "Group cardio sessions with coach", 
                  "2 days cardio and HIIT",
                  "4 days strength training", 
                  "Basic fitness assessment" 
                ] :
                pTitle === "KARATE" ? [
                  "2 classes per week",
                  "Belt progression and certification system", 
                  "Kata and kumite practice", 
                  "Self-defense techniques",
                  "Mental discipline focus"
                ] : [
                  "Access to gym", 
                  "Access to gym app",
                  "Full range of equipment", 
                  "Free weights and machines"
                ]
    };
  }, [program?.title]);
  
  const details = getProgramDetails();
  
  // Don't render anything if closed and animation is complete
  if (!isOpen && modalState === 'closed') {
    return null;
  }
  
  return (
    <div 
      ref={modalRef}
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ease-in-out ${
        modalState === 'closed' ? 'opacity-0 pointer-events-none' : 
        modalState === 'closing' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        backgroundColor: modalState === 'open' || modalState === 'opening' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0)',
        backdropFilter: modalState === 'open' || modalState === 'opening' ? 'blur(5px)' : 'blur(0px)',
        padding: '20px'
      }}
    >
      <div className="absolute inset-0 z-0" onClick={onClose}></div>
      <div 
        ref={contentRef}
        className={`relative w-full max-w-sm glassmorphic-dark overflow-hidden shadow-2xl z-20 transition-all duration-300 ease-in-out ${
          modalState === 'opening' ? 'opacity-0 translate-y-8 scale-95' : 
          modalState === 'open' ? 'opacity-100 translate-y-0 scale-100' : 
          modalState === 'closing' ? 'opacity-0 translate-y-8 scale-95' : 
          'opacity-0 translate-y-8 scale-95'
        }`}
        style={{ 
          maxWidth: isMobile.current ? '90%' : '500px',
          margin: '0 auto'
        }}
      >
        {/* Enhanced close button */}
        <button 
          type="button" 
          onClick={onClose} 
          className="absolute top-3 right-3 p-1.5 rounded-full glassmorphic group"
        >
          <X size={14} className="text-white/70 group-hover:text-white transition-colors" />
        </button>
        {/* Image with overlay gradient */}
        <div className="relative">
          {program?.image && (
            <>
              <img 
                src={program.image} 
                alt={program.title || 'Program'} 
                className="w-full h-36 object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-dark-900/30"></div>
            </>
          )}
        </div>
        
        {/* Enhanced content section - further reduced padding */}
        <div className="p-3 pb-2">
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500 mb-2">
            {program?.title || 'Program Details'}
          </h3>
          
          <div className="space-y-1.5">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-amber-400/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Timer size={12} className="text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-amber-400/80 mb-0.5">Schedule</p>
                <p className="text-sm text-gray-300">{details.schedule}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-amber-400/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-amber-400/80 mb-0.5">Trainer</p>
                <p className="text-sm text-gray-300">{details.trainer}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-2 pt-1.5 border-t border-white/5">
            <p className="text-xs font-medium text-amber-400/80 mb-1.5">Features</p>
            <ul className="space-y-0.5">
              {details.features?.map((feature: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-1 h-1 rounded-full bg-amber-400"></div>
                  </div>
                  <p className="text-sm text-gray-300 flex-1">{feature}</p>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Membership Button */}
          <div className="mt-3 px-2 pb-3">
            <Link 
              to="/membership" 
              className="block w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium text-center rounded-lg transition-all shadow-lg hover:shadow-amber-500/20"
              onClick={() => {
                // Close the modal when navigating
                onClose();
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <span>View Membership Options</span>
                <ChevronRight size={16} />
              </div>
            </Link>
          </div>
          
          {/* Bottom padding */}
          <div className="h-1"></div>
        </div>
      </div>
    </div>
  );
};

// AboutDetailsModal component
const AboutDetailsModal = ({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const isMobile = useRef(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  
  // Animation state using CSS transitions
  const [animationState, setAnimationState] = useState('closed'); // 'closed', 'opening', 'open', 'closing'
  
  // Enhanced mouse effects for desktop - using CSS variables for better performance
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile.current || !contentRef.current) return;
    
    const rect = contentRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xPercent = x / rect.width * 100;
    const yPercent = y / rect.height * 100;
    
    // Apply immediate glare effect via direct DOM manipulation for responsive feel
    if (glareRef.current) {
      glareRef.current.style.background = `
        radial-gradient(circle at ${xPercent}% ${yPercent}%, 
          rgba(255,255,255,0.15) 0%, 
          rgba(255,255,255,0.1) 25%, 
          rgba(255,255,255,0) 50%)
      `;
    }
    
    // Apply 3D transforms via CSS variables for smooth animation
    if (contentRef.current) {
      contentRef.current.style.setProperty('--rotateX', `${(yPercent - 50) / 20}deg`);
      contentRef.current.style.setProperty('--rotateY', `${(xPercent - 50) / 20}deg`);
      contentRef.current.style.setProperty('--scale', '1.02');
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isMobile.current || !contentRef.current) return;
    
    // Reset transforms via CSS variables
    if (contentRef.current) {
      contentRef.current.style.setProperty('--rotateX', '0deg');
      contentRef.current.style.setProperty('--rotateY', '0deg');
      contentRef.current.style.setProperty('--scale', '1');
    }
  }, []);
  
  // Handle open/close with CSS transitions
  useEffect(() => {
    // Handle body scroll
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setAnimationState('opening');
      
      // Transition to open state after a brief delay
      const timer = setTimeout(() => {
        setAnimationState('open');
      }, 50);
      
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      
      if (animationState !== 'closed') {
        setAnimationState('closing');
        
        // Set to fully closed after animation duration
        const timer = setTimeout(() => {
          setAnimationState('closed');
        }, 500); // Match the CSS transition duration
        
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen]);
  
  // Don't render if closed and animation is complete
  if (!isOpen && animationState === 'closed') {
    return null;
  }

  return (
    <div 
      ref={modalRef}
      className={`fixed inset-0 z-50 flex items-start justify-center transition-all duration-500 ease-in-out ${
        animationState === 'closed' ? 'opacity-0 pointer-events-none' : 
        animationState === 'closing' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        backgroundColor: animationState === 'open' || animationState === 'opening' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)',
        backdropFilter: animationState === 'open' || animationState === 'opening' ? 'blur(12px)' : 'blur(0px)',
        paddingTop: 'calc(64px + 6vh)',
        paddingBottom: '2vh',
        paddingLeft: '16px',
        paddingRight: '16px'
      }}
    >
      <div 
        className="absolute inset-0 z-0" 
        onClick={onClose}
      ></div>
      
      <div ref={glareRef} className="absolute inset-0 pointer-events-none"></div>
      
      <div 
        ref={contentRef}
        className={`relative w-full glassmorphic-dark overflow-hidden shadow-2xl z-10 transition-all duration-600 ${
          animationState === 'opening' ? 'opacity-0 translate-y-8 scale-95' : 
          animationState === 'open' ? 'opacity-100 translate-y-0 scale-100' : 
          animationState === 'closing' ? 'opacity-0 -translate-y-8 scale-95' : 
          'opacity-0 translate-y-8 scale-95'
        }`}
        style={{ 
          maxWidth: '360px', 
          maxHeight: '80vh', 
          margin: '0 auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
          transform: `
            perspective(1000px) 
            rotateX(var(--rotateX, 0deg)) 
            rotateY(var(--rotateY, 0deg)) 
            scale(var(--scale, 1))
          `,
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 z-20 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full glassmorphic group"
          aria-label="Close modal"
        >
          <X size={14} className="text-white group-hover:scale-110 transition-transform" />
        </button>
        
        <div className="relative h-24 overflow-hidden"> 
          <div className="absolute inset-0 bg-gradient-to-t from-dark-800/90 via-dark-800/50 to-transparent z-10"></div>
          <img 
            src="https://i.postimg.cc/P50QC6rf/IMG-9847.jpg" 
            alt="YKFA Training" 
            className="w-full h-full object-cover scale-110 hover:scale-105 transition-transform duration-[2s]"
            loading="lazy"
          />
          
          {!isMobile.current && (
            <div className="absolute inset-0 opacity-30 hidden sm:block mix-blend-soft-light">
              <div className="absolute top-0 left-1/4 w-[100px] h-[200px] bg-blue-500/30 blur-[30px] transform -rotate-45 animate-pulse"></div>
              <div className="absolute top-0 right-1/4 w-[100px] h-[200px] bg-amber-500/30 blur-[30px] transform rotate-45 animate-pulse delay-1000"></div>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-2.5 z-20"> 
            <h2 className="text-base font-bold text-white leading-tight"> 
              <span className="relative z-10">About <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">YKFA</span></span>
              <div className="absolute -bottom-1 left-0 h-0.5 w-8 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"></div>
            </h2>
          </div>
          </div>
        
        <div className="p-2.5 max-h-[calc(80vh-96px)] overflow-y-auto scrollbar-hide glassmorphic"> 
          <div className="space-y-2.5"> 
            <div className="glassmorphic p-2.5"> 
              <h3 className="text-xs font-semibold text-amber-400 mb-1">Our Mission</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                At YKFA, we empower individuals through martial arts and fitness training, developing physical strength, mental discipline, and self-confidence.
              </p>
            </div>
            
            <div className="glassmorphic p-2.5">
              <h3 className="text-xs font-semibold text-amber-400 mb-1">About Master Yaseen</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                Master Yaseen brings over 20 years of martial arts experience, dedicated to mastering and teaching various disciplines with emphasis on technical precision and character development.
              </p>
            </div>
            
            <div className="glassmorphic p-2.5">
              <h3 className="text-xs font-semibold text-amber-400 mb-1">Training Programs</h3>
              <ul className="space-y-1">
                <li className="flex items-start gap-1">
                  <ChevronRight className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300 text-xs leading-relaxed">MMA training including Boxing, Kickboxing, and Grappling</p>
                </li>
                <li className="flex items-start gap-1">
                  <ChevronRight className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300 text-xs leading-relaxed">Traditional Karate with belt progression system</p>
                </li>
                <li className="flex items-start gap-1">
                  <ChevronRight className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300 text-xs leading-relaxed">Group fitness classes and personal training</p>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-2 justify-center"> 
            <Link
              to="/about-us"
              className="px-2.5 py-1 rounded-md glassmorphic text-white font-medium text-xs transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/20"
            >
              Know More
            </Link>
            <Link
              to="/contact"
              className="px-2.5 py-1 rounded-md glassmorphic text-white font-medium text-xs border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProgramCard = ({ 
  title, 
  description, 
  image, 
  index,
  compact,
  program,
  onDetailsClick
}: { 
  title: string; 
  description: string; 
  image: string; 
  index: number;
  compact?: boolean;
  program: any;
  onDetailsClick: (program: any) => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const isMounted = useRef(true);

  // Check if this is the "Coming Soon" card
  const isComingSoon = title === "COMING SOON";

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      if (isMounted.current) {
      setIsMobile(window.innerWidth <= 768);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Effect 1: Setup IntersectionObserver to set isVisible
  useEffect(() => {
    const currentCardRef = cardRef.current;
    // If no ref, or already visible (e.g., from a previous observation), do nothing.
    // The isVisible check here prevents re-observing if the component re-renders for other reasons while already visible.
    if (!currentCardRef || isVisible) return;

    let observerInstance: IntersectionObserver | undefined;

    const handleIntersection: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (isMounted.current) { // Ensure component is still mounted
            setIsVisible(true); // Set state to trigger animation effect
          }
          // Important: Unobserve the target element after it has intersected and isVisible is set.
          if (observerInstance && entry.target) {
            observerInstance.unobserve(entry.target);
          }
        }
      });
    };

    observerInstance = new IntersectionObserver(handleIntersection, {
      threshold: 0.12, // How much of the item must be visible to trigger
      rootMargin: '0px 0px -40px 0px', // Adjust viewport bounds
    });

    observerInstance.observe(currentCardRef);

    return () => {
      if (observerInstance) {
        // Disconnect the observer when the component unmounts or dependencies change
        // For this effect, deps are [index, title, isVisible]. If isVisible becomes true,
        // this cleanup runs, observer is disconnected. Then the effect re-runs, but `!isVisible` is false, so it exits.
        observerInstance.disconnect();
      }
    };
  }, [index, title, isVisible]); // isVisible is a key dependency here.

  // Effect 2: Trigger animations when isVisible becomes true
  useEffect(() => {
    // Only run animations if isVisible is true and component is mounted
    if (isVisible && isMounted.current) {
      const timeouts: NodeJS.Timeout[] = [];

      // Animate image (only if not coming soon)
      if (!isComingSoon && imageRef.current) {
        const timeoutId = setTimeout(() => {
                if (isMounted.current && imageRef.current) {
                  imageRef.current.classList.add('visible');
                }
        }, index * 100 + 150); // Stagger appearance based on card index + base delay
        timeouts.push(timeoutId);
          }

      // Animate title
          if (titleRef.current) {
        const timeoutId = setTimeout(() => {
                if (isMounted.current && titleRef.current) {
                  titleRef.current.classList.add('visible');
                }
        }, index * 100 + 300); // Stagger appearance
        timeouts.push(timeoutId);
          }

      // Animate description (only if not coming soon)
      if (!isComingSoon && descRef.current) {
        const timeoutId = setTimeout(() => {
                if (isMounted.current && descRef.current) {
                  descRef.current.classList.add('visible');
                }
        }, index * 100 + 450); // Stagger appearance
        timeouts.push(timeoutId);
        }

      // Cleanup function for this effect
    return () => {
        timeouts.forEach(clearTimeout);
      };
      }
  }, [isVisible, index, title, isComingSoon]); // This effect runs when isVisible changes (or index/title, less likely)

  return (
    <div 
      ref={cardRef}
      className={`card-container ${isVisible ? 'visible' : ''} group flex flex-col justify-between h-[24rem]`}
      style={{
        minWidth: compact ? 0 : undefined,
        maxWidth: compact ? '100%' : undefined
      }}
    >
      <div 
        className={`card relative overflow-hidden glassmorphic
        ${compact ? 'p-2' : 'p-2 md:p-4'}
        group-hover:border-amber-500/30 group-hover:bg-white/10 shadow-lg
        transition-all duration-500 ease-out cursor-pointer
      `}>
        {/* Glass effect with light reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-30 rounded-xl -z-10"></div>
        
        {/* Enhanced gradient border effect on hover with smoother transitions */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 via-amber-500/30 to-dark-600/50 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-xl -z-5"></div>
        
        {/* Subtle glow effect on hover with longer duration */}
        <div className="absolute -inset-1 bg-amber-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-1000 rounded-3xl -z-20"></div>
        
        {/* Top reflection highlight */}
        <div className="absolute top-0 left-5 right-5 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50"></div>
        
        {isComingSoon ? (
          // Coming Soon Card Design
          <>
            {/* Placeholder image area (same as image cards) */}
            <div className={`overflow-hidden rounded-xl mb-3 relative ${compact ? 'h-52 sm:h-48 md:h-36' : 'h-64 md:h-64'} bg-gradient-to-br from-gray-800/50 to-gray-900/50`} />
            {/* Text area below, matching other cards' structure */}
            <div className="p-0 mb-2 flex flex-col items-center justify-start min-h-[5.5rem] mt-2">
              <div className="text-amber-400/60 text-4xl sm:text-5xl md:text-6xl mb-2">⏳</div>
              <h3 
                ref={titleRef}
                className="font-bold text-white/80 program-card-title text-center"
                style={{
                  fontSize: compact ? (isMobile ? '0.875rem' : '1rem') : (isMobile ? '1rem' : '1.25rem')
                }}
              >
                {title}
              </h3>
              <p className="text-gray-400 mb-2 line-clamp-3 program-card-desc group-hover:text-gray-300 transition-colors duration-300 invisible" style={{ fontSize: compact ? '0.75rem' : (isMobile ? '0.75rem' : '0.875rem') }}>
                More details coming soon.
              </p>
            </div>
          </>
        ) : (
          // Regular Card Design
          <>
            <div className={`overflow-hidden rounded-xl mb-3 relative ${compact ? 'h-52 sm:h-48 md:h-36' : 'h-64 md:h-64'} group-hover:shadow-[0_0_15px_rgba(251,191,36,0.15)] transition-all duration-500`}> 
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-70"></div>
              <img 
                ref={imageRef}
                src={image} 
                alt={title} 
                className="w-full h-full object-cover object-center program-card-image group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 z-20 overflow-hidden">
                <button 
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onDetailsClick(program);
                  }}
                  className="inline-flex items-center text-white glassmorphic px-2 py-1 rounded-lg transition-all text-xs shadow-sm hover:shadow-md cursor-pointer z-30 transform translate-y-[150%] group-hover:translate-y-0 transition-transform duration-300 ease-out"
                  aria-label={`Learn more about ${title}`}
                  type="button"
                >
                  Learn more <ArrowRight className="ml-1 w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="p-0 mb-2 flex-1 flex flex-col">
              <h3 
                ref={titleRef}
                className="font-bold mb-1 program-card-title group-hover:text-amber-400 transition-colors duration-300"
                style={{
                  fontSize: compact ? (isMobile ? '0.875rem' : '1rem') : (isMobile ? '1rem' : '1.25rem')
                }}
              >
                {title}
              </h3>
              <p 
                ref={descRef}
                className="text-gray-400 mb-2 line-clamp-3 program-card-desc group-hover:text-gray-300 transition-colors duration-300"
                style={{
                  fontSize: compact ? '0.75rem' : (isMobile ? '0.75rem' : '0.875rem')
                }}
              >
                {description}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const HomePage = () => {
  const [showTestimonialTooltip, setShowTestimonialTooltip] = useState(false);
  const [hasSwipedCards, setHasSwipedCards] = useState(false);
  const testimonialSectionRef = useRef<HTMLElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const programsSectionRef = useRef<HTMLElement>(null);
  const aboutImageRef = useRef<HTMLDivElement>(null);
  const [aboutImageIndex, setAboutImageIndex] = useState(0);
  const isMobileDevice = useRef(false);
  const autoImageChangeInterval = useRef<NodeJS.Timeout | null>(null);
  const imageTransitionInProgress = useRef(false);
  const [imageTransitioning, setImageTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev' | null>(null);
  // Create a ref to store all timeouts for proper cleanup
  const imageTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  
  // Force faster loading for loader
  const [forceComplete, setForceComplete] = useState(false);
  const isMounted = useRef(true); // Mounted ref for HomePage

  // Add state for about modal
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Throttle function for performance optimization - memoized to prevent memory leaks
  const throttle = useCallback((func: Function, limit: number) => {
    let inThrottle: boolean = false;
    let lastFunc: ReturnType<typeof setTimeout> | null = null;
    let lastRan: number = 0;
    
    return function(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        lastRan = Date.now();
        inThrottle = true;
        
        const timeoutId = setTimeout(() => {
          inThrottle = false;
        }, limit);
        
        // Store timeout for cleanup
        if (timeoutId) {
          imageTimeoutsRef.current.push(timeoutId);
        }
      } else {
        if (lastFunc) {
          clearTimeout(lastFunc);
          // Remove from cleanup array
          const index = imageTimeoutsRef.current.indexOf(lastFunc);
          if (index > -1) {
            imageTimeoutsRef.current.splice(index, 1);
          }
        }
        
        lastFunc = setTimeout(() => {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
        
        // Store timeout for cleanup
        if (lastFunc) {
          imageTimeoutsRef.current.push(lastFunc);
        }
      }
    };
  }, []);

  // Memoized throttle instances to prevent recreation
  const throttledScrollHandler = useCallback(
    throttle(() => {
      if (!isMounted.current) return;
      
      // Only run scroll effects if component is still mounted
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Optimize scroll effects to reduce memory pressure
      if (aboutImageRef.current) {
        const rect = aboutImageRef.current.getBoundingClientRect();
        const isVisible = rect.top < windowHeight && rect.bottom > 0;
        
        if (isVisible) {
          // Only apply effects when visible
          const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));
          aboutImageRef.current.style.transform = `translateY(${progress * 20}px)`;
        }
      }
    }, 16),
    []
  );

  const throttledMouseMoveHandler = useCallback(
    throttle((e: MouseEvent) => {
      if (imageTransitionInProgress.current || !aboutImageRef.current) return;
      
      const container = aboutImageRef.current;
      const currentImage = container.querySelector('.current-image');
      
      if (!currentImage || !(currentImage instanceof HTMLElement)) return;
      
      // Calculate mouse position relative to container center
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const moveX = (e.clientX - centerX) / 40; // Further reduce movement for better performance
      const moveY = (e.clientY - centerY) / 40;
      
      // Apply subtle transform
      currentImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }, 16),
    []
  );

  // Centralized isMounted effect for HomePage
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // DISABLED loading timeout to fix browser tab loading issue
  useEffect(() => {
    // Immediately set force complete to prevent loading delays
    if (isMounted.current) {
      setForceComplete(true);
    }
  }, []);
  
  // Add state for program details modal
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Handle opening modal with program details
  const handleProgramDetailsClick = (program: any) => {
    // Set directly without delay
    setSelectedProgram(program);
    setIsModalOpen(true);
  };
  
  // Handle closing modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Check localStorage for a selected program on component mount
  useEffect(() => {
    // Skip auto-opening modals on page refresh
    // We detect refresh by checking the navigation type from the Performance API
    const navigationEntries = performance.getEntriesByType('navigation');
    const isRefresh = navigationEntries.length > 0 && 
      (navigationEntries[0] as PerformanceNavigationTiming).type === 'reload';
    
    if (isRefresh) {
      // Clear any stored program on refresh to prevent auto-opening
      localStorage.removeItem('selectedProgram');
      return;
    }
    
    const storedProgram = localStorage.getItem('selectedProgram');
    if (storedProgram) {
      const programTitle = storedProgram;
      
      // Find the program by title or create a synthetic one if needed for "PERSONAL TRAINING"
      let matchingProgram;
      
      if (programTitle === "PERSONAL TRAINING") {
        // Create a synthetic program object for Personal Training
        matchingProgram = {
          id: 6,
          title: "PERSONAL TRAINING",
          description: "One-on-one personalized coaching with expert trainers.",
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=compress&q=80&w=1200",
          link: "/programs",
          category: "fitness"
        };
      } else {
        // For other programs, find in the programs array
        matchingProgram = PROGRAMS_DATA.find(p => p.title === programTitle);
      }
      
      if (matchingProgram) {
        // Open the modal with this program
        setSelectedProgram(matchingProgram);
        setIsModalOpen(true);
        
        // Clear localStorage so it doesn't reopen on refresh
        localStorage.removeItem('selectedProgram');
      }
    }
  }, []);

  // Listen for custom program selection event (when already on home page)
  useEffect(() => {
    const handleProgramSelected = (event: CustomEvent) => {
      const { programName } = event.detail;
      
      // Find the program by title or create a synthetic one if needed for "PERSONAL TRAINING"
      let matchingProgram;
      
      if (programName === "PERSONAL TRAINING") {
        // Create a synthetic program object for Personal Training
        matchingProgram = {
          id: 6,
          title: "PERSONAL TRAINING",
          description: "One-on-one personalized coaching with expert trainers.",
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=compress&q=80&w=1200",
          link: "/programs",
          category: "fitness"
        };
      } else {
        // For other programs, find in the programs array
        matchingProgram = PROGRAMS_DATA.find(p => p.title === programName);
      }
      
      if (matchingProgram) {
        // Open the modal with this program
        setSelectedProgram(matchingProgram);
        setIsModalOpen(true);
      }
    };
    
    window.addEventListener(PROGRAM_SELECTED_EVENT, handleProgramSelected as EventListener);
    
    return () => {
      window.removeEventListener(PROGRAM_SELECTED_EVENT, handleProgramSelected as EventListener);
    };
  }, []);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      if (isMounted.current) {
      isMobileDevice.current = window.innerWidth <= 768;
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Optimized image transition function with better memory management
  const changeImage = useCallback((direction: 'next' | 'prev') => {
    if (imageTransitionInProgress.current || !isMounted.current) return;
    
    imageTransitionInProgress.current = true;
    setImageTransitioning(true);
    setTransitionDirection(direction);
    
    // Use a simple timeout instead of requestAnimationFrame to prevent memory leaks
    setTimeout(() => {
      if (!isMounted.current) return;
      
      const newIndex = direction === 'next' 
        ? (aboutImageIndex + 1) % ABOUT_IMAGES_DATA.length
        : (aboutImageIndex - 1 + ABOUT_IMAGES_DATA.length) % ABOUT_IMAGES_DATA.length;
      
      setAboutImageIndex(newIndex);
      
      // Use a shorter timeout for better responsiveness
      const timeout = setTimeout(() => {
        if (isMounted.current) {
          setImageTransitioning(false);
          setTransitionDirection(null);
          imageTransitionInProgress.current = false;
        }
      }, 300);
      
      // Store timeout for cleanup
      imageTimeoutsRef.current.push(timeout);
    }, 50);
  }, [aboutImageIndex]);
  
  // Clean up all timeouts when component unmounts
  // Clean up all timeouts when component unmounts or when transitioning starts
  useEffect(() => {
    return () => {
      // Clear all timeouts and animation frames
      imageTimeoutsRef.current.forEach(id => {
        if (typeof id === 'number') {
          // Animation frame IDs are typically very large numbers
          // Timeout IDs are typically smaller numbers
          if (id > 1000000) {
            try {
              cancelAnimationFrame(id);
            } catch (e) {
              // Ignore errors for invalid animation frame IDs
            }
          } else {
            try {
              clearTimeout(id);
            } catch (e) {
              // Ignore errors for invalid timeout IDs
            }
          }
        }
      });
      imageTimeoutsRef.current = [];
      
      // Clear any autoImageChangeInterval
      if (autoImageChangeInterval.current) {
        clearInterval(autoImageChangeInterval.current);
        autoImageChangeInterval.current = null;
      }
      
      // Mark not transitioning to prevent memory leaks
      imageTransitionInProgress.current = false;
    };
  }, []);

  // Optimized image preloading with better memory management
  useEffect(() => {
    // TEMPORARILY DISABLED to prevent memory spikes on initial load
    // let isMounted = true;
    // const imageCache = new Map<string, HTMLImageElement>();
    // let loadPromises: Promise<void>[] = [];
    // let timeoutId: NodeJS.Timeout | null = null;
    
    // const preloadAllImages = async () => {
    //   if (!isMounted) return;
      
    //   try {
    //     // Set a reasonable timeout for the entire operation
    //     const timeoutPromise = new Promise<void>((_, reject) => {
    //       timeoutId = setTimeout(() => {
    //         reject(new Error('Preloading images timed out'));
    //       }, 3000); // Reduced timeout to 3 seconds
    //     });
        
    //     await Promise.race([Promise.all(loadPromises), timeoutPromise]);
    //   } catch (error) {
    //     if (isMounted) {
    //       console.log('Preloading images timed out');
    //     }
    //   } finally {
    //     // Clear references only if still mounted
    //     if (isMounted) {
    //       loadPromises = [];
    //       imageCache.clear();
    //     }
    //   }
    // };
    
    // // Start preloading
    // preloadAllImages();
    
    // return () => {
    //   // Clear cache references and abort any pending operations when component unmounts
    //   isMounted = false;
    //   imageCache.clear();
    //   loadPromises = [];
    //   if (timeoutId) {
    //     clearTimeout(timeoutId);
    //   }
    // };
  }, []);
  
  // Regular scroll handler for testimonials
  useEffect(() => {
    const handleScroll = () => {
      if (testimonialSectionRef.current && !hasSwipedCards) {
        const rect = testimonialSectionRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (isMounted.current) { // Guard setShowTestimonialTooltip
          setShowTestimonialTooltip(isVisible); // Simplified
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasSwipedCards]);
  
  const handleCardSwipe = () => {
    if (isMounted.current) { // Guard setHasSwipedCards and setShowTestimonialTooltip
    setHasSwipedCards(true);
    setShowTestimonialTooltip(false);
    }
  };

  // COMPLETELY DISABLED auto image rotation to fix 3GB+ memory leak
  // Optimized auto image change interval with IntersectionObserver for better performance
  // useEffect(() => {
  //   let observer: IntersectionObserver | null = null;
  //   let intervalId: NodeJS.Timeout | null = null;
    
  //   // Only start auto-rotation when the image slider is visible in viewport
  //   if (aboutImageRef.current && 'IntersectionObserver' in window) {
  //     observer = new IntersectionObserver((entries) => {
  //       entries.forEach(entry => {
  //         // Start/stop interval based on visibility
  //         if (entry.isIntersecting) {
  //           // Start the interval only if component is mounted and visible
  //           if (!intervalId && !imageTransitionInProgress.current && isMounted.current) {
  //             intervalId = setInterval(() => {
  //               // Only proceed if component is still mounted and not transitioning
  //               if (!imageTransitionInProgress.current && isMounted.current) {
  //                 changeImage('next');
  //               }
  //             }, 20000); // Increased from 12000 to 20000 (20 seconds) to reduce memory pressure
              
  //             // Store interval in ref for cleanup elsewhere
  //             autoImageChangeInterval.current = intervalId;
  //           }
  //         } else {
  //           // Stop the interval when not visible to save resources
  //           if (intervalId) {
  //             clearInterval(intervalId);
  //             intervalId = null;
  //             autoImageChangeInterval.current = null;
  //           }
  //         }
  //       });
  //     }, { threshold: 0.2 }); // Start when 20% visible
      
  //     observer.observe(aboutImageRef.current);
  //   }

  //   // Cleanup: clear interval and disconnect observer on unmount
  //   return () => {
  //     if (intervalId) {
  //       clearInterval(intervalId);
  //       intervalId = null;
  //     }
      
  //     if (autoImageChangeInterval.current) {
  //       clearInterval(autoImageChangeInterval.current);
  //       autoImageChangeInterval.current = null;
  //     }
      
  //     if (observer) {
  //       observer.disconnect();
  //       observer = null;
  //     }
  //   };
  // }, [changeImage]);
  
  // Optimized animation enhancements with better memory management
  useEffect(() => {
    if (!imageTransitioning || !aboutImageRef.current) return;
    
    const container = aboutImageRef.current;
    const currentImage = container.querySelector('.current-image') as HTMLElement;
    const nextImage = container.querySelector('.next-image') as HTMLElement;
    const prevImage = container.querySelector('.prev-image') as HTMLElement;
    
    if (!currentImage || !nextImage || !prevImage) return;
    
    // Use simple CSS transitions instead of complex animations
    if (transitionDirection === 'next') {
      currentImage.style.opacity = '0';
      currentImage.style.transform = 'translateX(-20px)';
      nextImage.style.opacity = '1';
      nextImage.style.transform = 'translateX(0)';
    } else if (transitionDirection === 'prev') {
      currentImage.style.opacity = '0';
      currentImage.style.transform = 'translateX(20px)';
      prevImage.style.opacity = '1';
      prevImage.style.transform = 'translateX(0)';
    }
    
    // Reset styles after transition
    const timeout = setTimeout(() => {
      if (currentImage) {
        currentImage.style.opacity = '';
        currentImage.style.transform = '';
      }
      if (nextImage) {
        nextImage.style.opacity = '';
        nextImage.style.transform = '';
      }
      if (prevImage) {
        prevImage.style.opacity = '';
        prevImage.style.transform = '';
      }
    }, 300);
    
    return () => {
      clearTimeout(timeout);
    };
  }, [imageTransitioning, transitionDirection]);
  
  // Optimized parallax effect with throttling for better performance and memory usage
  useEffect(() => {
    if (!aboutImageRef.current) return;
    
    const container = aboutImageRef.current;
    const currentImage = container.querySelector('.current-image');
    
    const handleMouseLeave = () => {
      if (currentImage && currentImage instanceof HTMLElement) {
        currentImage.style.transform = '';
      }
    };
    
    // Add event listeners with passive option for better performance
    container.addEventListener('mousemove', throttledMouseMoveHandler as EventListener, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    
    // Cleanup event listeners
    return () => {
      container.removeEventListener('mousemove', throttledMouseMoveHandler as EventListener);
        container.removeEventListener('mouseleave', handleMouseLeave);
      
      // Reset transform on cleanup
      if (currentImage && currentImage instanceof HTMLElement) {
        currentImage.style.transform = '';
        }
      };
  }, [throttledMouseMoveHandler]);
  
  // Optimized scroll handler with throttling
  useEffect(() => {
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [throttledScrollHandler]);
  
  // COMPLETELY DISABLED visibility change handler to fix memory leak
  // Optimized visibility change handler
  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === 'hidden') {
  //       // Pause animations and intervals when tab is hidden
  //       if (autoImageChangeInterval.current) {
  //         clearInterval(autoImageChangeInterval.current);
  //         autoImageChangeInterval.current = null;
  //       }
  //     } else if (document.visibilityState === 'visible') {
  //       // Resume animations when tab becomes visible
  //       if (aboutImageRef.current && !autoImageChangeInterval.current && !imageTransitionInProgress.current) {
  //         autoImageChangeInterval.current = setInterval(() => {
  //           if (!imageTransitionInProgress.current && isMounted.current) {
  //             changeImage('next');
  //           }
  //         }, 20000); // Increased from 12000 to 20000 (20 seconds) to reduce memory pressure
  //       }
  //     }
  //   };
    
  //   document.addEventListener('visibilitychange', handleVisibilityChange);
    
  //   return () => {
  //     document.removeEventListener('visibilitychange', handleVisibilityChange);
  //   };
  // }, [changeImage]);

  return (
    <>
      <Hero loadingComplete={forceComplete} />
      
      {/* About Section */}
      <section ref={aboutSectionRef} className="section py-16 sm:py-24 relative overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="mb-6">Welcome to <span className="text-transparent bg-clip-text bg-gold-gradient">YKFA</span></h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  YKFA was founded by Master Yaseen, a passionate martial artist with over 20 years of experience. Our academy offers a range of martial arts and fitness programs designed to cater to all ages and skill levels.
                </p>
                <p>
                  At YKFA, we believe in developing not just physical strength, but also mental discipline, self-confidence, and respect. Our instructors are dedicated to providing a supportive and motivating environment where members can achieve their fitness and martial arts goals.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => setShowAboutModal(true)}
                    className="btn btn-primary"
                  >
                    Curious !
                  </button>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 rounded-full bg-amber-400/20 blur-3xl hidden md:block"></div>
              <div 
                ref={aboutImageRef}
                className={`relative z-10 rounded-xl overflow-visible image-slider ${imageTransitioning ? 'transitioning' : ''}`}
                style={{ 
                  height: '380px',
                  perspective: '1000px',
                  width: '100%',
                  maxWidth: '580px',
                  margin: '0 auto',
                  paddingTop: '30px',
                  paddingBottom: '30px'
                }}
              >
                {/* Stack of images with minimal design */}
                <div className="image-stack relative w-full h-full overflow-visible"
                  style={{ 
                    position: 'absolute',
                    top: '30px',
                    bottom: '30px',
                    left: 0,
                    right: 0
                  }}
                >
                  {/* Previous image (left side, minimal peek) - optimized */}
                  <div className="prev-image absolute top-0 bottom-0 left-[-5%] w-[12%] z-0 transform scale-[0.97] opacity-70 rounded-xl overflow-hidden shadow-lg transition-all duration-700">
                    <img 
                      src={ABOUT_IMAGES_DATA[(aboutImageIndex - 1 + ABOUT_IMAGES_DATA.length) % ABOUT_IMAGES_DATA.length]} 
                      alt="Previous" 
                      className="w-full h-full object-cover"
                      style={{ 
                        objectPosition: 'right center',
                        transform: 'translateZ(0)', // Hardware acceleration hint
                        imageRendering: 'auto' // Let browser optimize based on device
                      }}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                  </div>
                  
                  {/* Next image (right side, minimal peek) - optimized */}
                  <div className="next-image absolute top-0 bottom-0 right-[-5%] w-[12%] z-0 transform scale-[0.97] opacity-70 rounded-xl overflow-hidden shadow-lg transition-all duration-700">
                    <img 
                      src={ABOUT_IMAGES_DATA[(aboutImageIndex + 1) % ABOUT_IMAGES_DATA.length]} 
                      alt="Next" 
                      className="w-full h-full object-cover"
                      style={{ 
                        objectPosition: 'left center',
                        transform: 'translateZ(0)', // Hardware acceleration hint
                        imageRendering: 'auto' // Let browser optimize based on device
                      }}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                  </div>
                  
                  {/* Current image (center, fully visible) - optimized for memory usage */}
                  <div className="current-image absolute inset-0 z-10 rounded-xl overflow-hidden transform transition-all duration-700 ease-out shadow-xl">
                    <img 
                      src={ABOUT_IMAGES_DATA[aboutImageIndex]} 
                      alt="YKFA Training" 
                      className="w-full h-full object-cover transition-opacity duration-300"
                      loading="lazy"
                      decoding="async"
                      style={{
                        opacity: imageTransitioning ? 0.8 : 1,
                        transform: 'translateZ(0)' // Hardware acceleration hint
                      }}
                            onLoad={(e) => {
        if (e.currentTarget) {
          e.currentTarget.style.opacity = '1';
          // Clean up any references - simplified to prevent memory leaks
          const img = e.currentTarget;
          // Use a simple timeout instead of requestAnimationFrame to prevent memory leaks
          setTimeout(() => {
            if (img && isMounted.current) {
              img.style.opacity = '1';
            }
          }, 0);
        }
      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
                
                {/* Progress indicator dots */}
                <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-1.5 z-20">
                  {ABOUT_IMAGES_DATA.map((_, index) => (
                    <button 
                      key={index} 
                      onClick={() => {
                        if (index !== aboutImageIndex && !imageTransitionInProgress.current) {
                          // Determine direction for animation
                          const direction = index > aboutImageIndex ? 'next' : 'prev';
                          changeImage(direction);
                        }
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer progress-dot ${
                        index === aboutImageIndex ? 'active' : 'bg-white/30 w-1.5'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
                
                {/* Navigation Buttons */}
                <button 
                  onClick={() => !imageTransitionInProgress.current && changeImage('prev')}
                  className={`image-nav-button absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-amber-500/80 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${imageTransitioning ? 'pointer-events-none opacity-50' : 'opacity-70'}`}
                  aria-label="Previous image"
                  disabled={imageTransitioning}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button 
                  onClick={() => !imageTransitionInProgress.current && changeImage('next')}
                  className={`image-nav-button absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-amber-500/80 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${imageTransitioning ? 'pointer-events-none opacity-50' : 'opacity-70'}`}
                  aria-label="Next image"
                  disabled={imageTransitioning}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section ref={programsSectionRef} className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-95 z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.05),transparent_80%)] z-0"></div>
        <div className="container z-10 relative">
          <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
            <h2 className="mb-4 text-white">Training Programs for <span className="text-transparent bg-clip-text bg-gold-gradient">All Levels</span></h2>
            <p className="text-gray-200">
              Explore our diverse range of training programs designed to help you achieve your fitness and martial arts goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROGRAMS_DATA.map((program, index) => (
              <ProgramCard 
                key={program.id}
                title={program.title}
                description={program.description}
                image={program.image}
                index={index}
                compact
                program={program}
                onDetailsClick={handleProgramDetailsClick}
              />
            ))}
          </div>

         
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialSectionRef} className="section py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-95"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.05),transparent_80%)]"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 animate-fade-up">
            <h2 className="mb-4">What Our <span className="text-transparent bg-clip-text bg-gold-gradient">Members</span> Say</h2>
            <p className="text-gray-300">
              Hear from our community about their experiences and transformations at YKFA.
            </p>
          </div>

          <div className="flex justify-center items-center w-full py-6 sm:py-10 relative">
            {/* Swipe tooltip - positioned over the cards */}
            {showTestimonialTooltip && (
              <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-40 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-lg shadow-lg transition-all duration-500 animate-bounce-slow whitespace-nowrap text-xs inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-amber-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                <span className="font-medium">Swipe left for more</span>
              </div>
            )}
            <ShuffleCards onSwipe={handleCardSwipe} />
          </div>
        </div>
      </section>

      <section className="py-24 relative">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-center bg-cover opacity-30"
            style={{ 
              backgroundImage: "url('https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" 
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/70"></div>
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h2 className="mb-6">Ready to <span className="text-transparent bg-clip-text bg-gold-gradient">Transform</span> Your Life?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join Yaseen's YKFA today and start your journey towards a stronger, more disciplined you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/membership" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Buttons */}
      <FloatingButtons />

      {/* Floating Timer Icon */}
      <Link
        to="/timer"
        className="fixed bottom-8 right-4 sm:right-8 z-50 bg-amber-400 text-black rounded-full shadow-lg p-3 sm:p-4 flex items-center justify-center hover:bg-amber-500 transition-colors group"
        title="Go to Timer"
        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
      >
        <Timer className="w-5 h-5 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
      </Link>

      {/* Program Details Modal */}
      {selectedProgram && (
        <ProgramDetailsModal
          program={selectedProgram}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}

      {/* About Details Modal */}
      <AboutDetailsModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      {/* Modified CSS styles for image slider transitions */}
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Core image slider styles */
        .image-slider {
          position: relative;
          transition: transform 0.5s ease-out; /* Increased duration */
        }
        
        .image-slider.transitioning {
          transform: scale(0.99);
        }
        
        .image-stack {
          transform-style: preserve-3d;
          position: relative;
          overflow: visible !important;
        }
        
        .image-stack > div {
          backface-visibility: hidden;
          transition: all 0.8s ease-out; /* Increased duration for smoother effect */
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          opacity: 1; /* Ensure initial opacity */
        }
        
        /* Current image animations */
        .current-image {
          transform: translateY(0) rotateZ(0) scale(1);
          opacity: 1;
          filter: blur(0);
          z-index: 10;
          transition: all 0.8s ease-out; /* Increased duration */
        }
        
        .transitioning-next .current-image {
          transform: translateY(-10px) translateX(10px) rotateZ(1deg) scale(0.97);
          opacity: 0;
          filter: blur(3px);
          z-index: 1; /* Move to back */
          transition-delay: 0.05s; /* Small delay for smoother sequence */
        }
        
        .transitioning-prev .current-image {
          transform: translateY(-10px) translateX(-10px) rotateZ(-1deg) scale(0.97);
          opacity: 0;
          filter: blur(3px);
          z-index: 1; /* Move to back */
          transition-delay: 0.05s; /* Small delay for smoother sequence */
        }
        
        /* Previous image animations */
        .prev-image {
          transform: translateX(0) scale(0.97);
          opacity: 0.7;
          z-index: 5;
          transition: all 0.8s ease-out; /* Increased duration */
        }
        
        .transitioning-next .prev-image {
          transform: translateX(-8%) scale(0.95);
          opacity: 0.5;
          z-index: 3;
          transition-delay: 0.1s; /* Staggered delay for sequence */
        }
        
        .transitioning-prev .prev-image {
          transform: translateX(-2%) translateY(-5px) scale(1) rotateZ(0);
          opacity: 1;
          z-index: 10; /* Move to front */
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
          transition-delay: 0.15s; /* Staggered delay for sequence */
        }
        
        /* Next image animations */
        .next-image {
          transform: translateX(0) scale(0.97);
          opacity: 0.7;
          z-index: 5;
          transition: all 0.8s ease-out; /* Increased duration */
        }
        
        .transitioning-next .next-image {
          transform: translateX(2%) translateY(-5px) scale(1) rotateZ(0);
          opacity: 1;
          z-index: 10; /* Move to front */
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
          transition-delay: 0.15s; /* Staggered delay for sequence */
        }
        
        .transitioning-prev .next-image {
          transform: translateX(8%) scale(0.95);
          opacity: 0.5;
          z-index: 3;
          transition-delay: 0.1s; /* Staggered delay for sequence */
        }
        
        /* Back card animations */
        .image-slider:before,
        .image-slider:after {
          content: '';
          position: absolute;
          top: 35px;
          bottom: 35px;
          width: 8%;
          background: rgba(0,0,0,0.2);
          border-radius: 8px;
          z-index: 0;
          transition: all 0.8s ease-out; /* Increased duration */
          opacity: 0;
          transform: translateY(10px) scale(0.9);
        }
        
        .image-slider:before {
          left: -4%;
        }
        
        .image-slider:after {
          right: -4%;
        }
        
        .transitioning .image-slider:before,
        .transitioning .image-slider:after {
          opacity: 0.4;
          transform: translateY(3px) scale(0.95);
        }
        
        /* Image styles */
        .image-stack img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: translateZ(0);
          will-change: transform; /* Performance hint */
        }
        
        /* Progress indicator dots */
        .progress-dot {
          transition: all 0.4s ease-in-out;
          height: 1.5px;
        }
        
        .progress-dot.active {
          background-color: #f59e0b;
          width: 1rem;
        }
        
        .progress-dot:not(.active) {
          background-color: rgba(255, 255, 255, 0.3);
          width: 1.5px;
        }
        
        .progress-dot:not(.active):hover {
          background-color: rgba(255, 255, 255, 0.7);
          transform: scaleX(1.3);
        }
        
        /* Navigation buttons */
        .image-nav-button {
          transition: all 0.3s ease;
          z-index: 40;
          opacity: 0.7;
        }
        
        .image-nav-button:hover:not(:disabled) {
          transform: translateY(-50%) scale(1.15) !important;
          opacity: 1 !important;
          box-shadow: 0 0 15px rgba(251, 191, 36, 0.4);
        }
        
        .image-nav-button:active:not(:disabled) {
          transform: translateY(-50%) scale(0.95) !important;
          transition: all 0.1s ease;
        }

        /* Program Card Animation Styles */
        .program-card-image {
          opacity: 0;
          transform: scale(0.95);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }

        .program-card-image.visible {
          opacity: 1;
          transform: scale(1);
        }

        .program-card-title {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.4s ease-out 0.1s, transform 0.4s ease-out 0.1s; /* Staggered delay */
        }

        .program-card-title.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .program-card-desc {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.4s ease-out 0.2s, transform 0.4s ease-out 0.2s; /* Staggered delay */
        }

        .program-card-desc.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}} />
    </>
  );
};

export default HomePage;