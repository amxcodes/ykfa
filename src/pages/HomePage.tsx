import { ArrowRight, Timer, MessageCircle, Bot, Calculator, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { useState, useEffect, useRef, useContext, useCallback } from 'react';
// Add an icon for the floating button (you can use any icon you prefer)
// Import the ShuffleCards component
import { ShuffleCards } from '../components/ui/shuffle-cards';
import ChatbotInterface from '../components/ChatbotInterface';
import { WidgetContext } from '../App';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROGRAM_SELECTED_EVENT } from '../components/Footer';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Moved static arrays outside components
const ABOUT_IMAGES_DATA = [
  "https://i.postimg.cc/Cxr6mHh9/IMG-9857.jpg", 
  "https://i.postimg.cc/JnVx2p9Y/IMG-9840.jpg", 
  "https://i.postimg.cc/P50QC6rf/IMG-9847.jpg", 
  "https://i.postimg.cc/dtx8fWCR/IMG-9853.jpg", 
  "https://i.postimg.cc/GpkGHd5z/IMG-9860.jpg", 
  "https://i.postimg.cc/5ytC7vNk/Screenshot-2025-05-07-010532.png"
];

const PROGRAMS_DATA = [
  {
    id: 1,
    title: "MMA + GYM",
    description: "Complete package with access to all MMA classes and gym facilities.",
    image: "https://images.pexels.com/photos/4761798/pexels-photo-4761798.jpeg?auto=compress&fit=crop&w=800&q=80",
    link: "/programs",
    category: "mma"
  },
  {
    id: 2,
    title: "MMA ONLY",
    description: "Access to all MMA classes including boxing, kickboxing, and grappling techniques.",
    image: "https://images.pexels.com/photos/4761797/pexels-photo-4761797.jpeg?auto=compress&fit=crop&w=800&q=80",
    link: "/programs",
    category: "mma"
  },
  {
    id: 3,
    title: "GROUP FITNESS",
    description: "High-energy group fitness sessions for improved strength and endurance.",
    image: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&fit=crop&w=800&q=80",
    link: "/programs",
    category: "fitness"
  },
  {
    id: 4,
    title: "KARATE",
    description: "Traditional Karate training with belt progression and certification system.",
    image: "https://images.pexels.com/photos/7045573/pexels-photo-7045573.jpeg?auto=compress&fit=crop&w=800&q=80",
    link: "/programs",
    category: "karate"
  },
  {
    id: 5,
    title: "GYM ONLY",
    description: "Unlimited access to our modern gym with top-tier equipment.",
    image: "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&fit=crop&w=800&q=80",
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
        className={`fixed bottom-24 sm:bottom-28 right-20 sm:right-28 z-50 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-lg shadow-lg transition-all duration-500 max-w-[220px] sm:max-w-none
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
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-white/90 border-b-8 border-b-transparent"></div>
      </div>

      <div className="fixed bottom-24 sm:bottom-28 right-4 sm:right-8 z-50 flex flex-col gap-4">
        <div className={`flex flex-col gap-4 transition-all duration-500 ease-out
          ${isExpanded 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-16 scale-90 pointer-events-none'}`}>
          
          {/* BMI Calculator Widget */}
          <div className="relative group">
            <div 
              className={`fixed bottom-8 sm:bottom-12 right-14 sm:right-16 bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-xl rounded-2xl shadow-xl w-[calc(100vw-32px)] sm:w-72 max-w-[280px] overflow-hidden transition-all duration-500 ease-out border border-white/10
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
                      className="w-full px-2.5 py-2 bg-dark-700/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 text-white placeholder-gray-500 text-xs sm:text-sm transition-all duration-200"
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
                      className="w-full px-2.5 py-2 bg-dark-700/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 text-white placeholder-gray-500 text-xs sm:text-sm transition-all duration-200"
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

            <button
              onClick={() => toggleWidget('bmi')}
              className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-all group relative"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
            >
              <Calculator className={`w-5 h-5 sm:w-6 sm:h-6 text-amber-400 group-hover:scale-110 transition-transform duration-300 ${showBMICalculator ? 'rotate-180' : 'rotate-0'}`} />
            </button>
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
              className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-all group relative"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
            >
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>

          {/* Chatbot Button with pulse animation */}
          <button
            onClick={() => toggleWidget('chatbot')}
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-all group relative"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
          >
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
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
          className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-white/20 shadow-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all group relative overflow-hidden"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 group-hover:scale-150 transition-transform duration-700 ease-out" />
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
  const gsapTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const originalBodyOverflowRef = useRef<string>('');
  const didHideScrollRef = useRef<boolean>(false);
  
  const getProgramDetails = useCallback(() => {
    const pTitle = program?.title || '';
    return {
      schedule: pTitle === "MMA + GYM" ? "24/7 gym access (3 days per week), 3 mixed martial arts classes per week" :
                pTitle === "MMA ONLY" ? "3 mixed martial arts classes per week" :
                pTitle === "GROUP FITNESS" ? "2 days cardio, 4 days strength training" :
                pTitle === "KARATE" ? "2 classes per week" : "24/7 access",
      trainer: pTitle === "MMA + GYM" ? "Yaseen & Team" :
               pTitle === "MMA ONLY" ? "Yaseen" :
               pTitle === "GROUP FITNESS" ? "Fitness Coach" :
               pTitle === "KARATE" ? "Master Yaseen" : "Self-guided with assistance",
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
  
  useEffect(() => {
    if (!modalRef.current || !contentRef.current) return;
    
    const modalElement = modalRef.current;
    const contentElement = contentRef.current;

    if (gsapTimelineRef.current) {
      gsapTimelineRef.current.kill();
      gsapTimelineRef.current = null;
    }

    if (isOpen) {
      if (!didHideScrollRef.current) {
        originalBodyOverflowRef.current = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        didHideScrollRef.current = true;
      }

      gsap.set(modalElement, { display: 'flex', opacity: 1 });
      gsap.set(contentElement, { opacity: 0, y: 30, scale: 0.95 });

      gsapTimelineRef.current = gsap.timeline();

      if (isMobile.current) {
        gsapTimelineRef.current
          .to(modalElement, { backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)', duration: 0.3 })
          .to(contentElement, { opacity: 1, y: 0, scale: 1, duration: 0.3 }, "-=0.2");
    } else {
        gsapTimelineRef.current
          .to(modalElement, {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        duration: 0.4,
        ease: 'power2.out'
          })
          .to(contentElement, 
            { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, 
            "-=0.2"
      );
      }
    } else {
      if (modalElement.style.display === 'flex') {
        gsapTimelineRef.current = gsap.timeline({
          onComplete: () => {
            if (didHideScrollRef.current) {
              document.body.style.overflow = originalBodyOverflowRef.current;
              didHideScrollRef.current = false;
            }
            gsap.set(modalElement, { display: 'none', opacity: 0 });
          }
        });

        gsapTimelineRef.current
          .to(contentElement, {
            opacity: 0, y: 20, scale: 0.95, duration: 0.3, ease: 'power2.in'
          })
          .to(modalElement, {
            backgroundColor: 'rgba(0, 0, 0, 0)',
            backdropFilter: 'blur(0px)',
        opacity: 0,
            duration: 0.3, ease: 'power2.in'
          }, "-=0.1");
      } else {
        if (didHideScrollRef.current) {
             document.body.style.overflow = originalBodyOverflowRef.current;
             didHideScrollRef.current = false;
        }
        gsap.set(modalElement, { display: 'none', opacity: 0 });
      }
    }
    
    return () => {
      if (gsapTimelineRef.current) {
        gsapTimelineRef.current.kill();
        gsapTimelineRef.current = null;
      }
      if (didHideScrollRef.current) {
        document.body.style.overflow = originalBodyOverflowRef.current;
        didHideScrollRef.current = false;
      }
    };
  }, [isOpen, getProgramDetails]);
  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
      window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);
  
  // Conditional rendering: Don't render if not open and not currently animating out.
  if (!isOpen && modalRef.current && modalRef.current.style.display === 'none' && 
      (!gsapTimelineRef.current || !gsapTimelineRef.current.isActive())) {
    return null;
  }
  
  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-50 items-start justify-center"
      style={{
        display: 'none', // Start hidden; GSAP controls display:flex
        opacity: 0,      // Start transparent; GSAP controls opacity
        backgroundColor: 'rgba(0, 0, 0, 0)', // Initial
        backdropFilter: 'blur(0px)',      // Initial
        paddingTop: 'calc(64px + 12vh)', // Pushed down more
        paddingBottom: '2vh',
        paddingLeft: '16px',
        paddingRight: '16px'
      }}
    >
      <div className="absolute inset-0 z-0" onClick={onClose}></div>
      <div 
        ref={contentRef}
        className="relative w-full max-w-sm bg-gradient-to-b from-dark-800/95 to-dark-900/95 backdrop-blur-lg border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl z-10"
        style={{ 
          opacity: 0,
          transform: 'translateY(30px) scale(0.95)', // Initial state for GSAP entrance
          maxWidth: isMobile.current ? '90%' : '500px',
          marginTop: '0px',
        }}
      >
        {/* Enhanced close button */}
        <button 
          type="button" 
          onClick={onClose} 
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 hover:border-white/20 transition-all z-20 group"
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
                className="w-full h-48 object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-dark-900/30"></div>
            </>
          )}
        </div>
        
        {/* Enhanced content section - reduced padding */}
        <div className="p-4 pb-3">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500 mb-3">
            {program?.title || 'Program Details'}
          </h3>
          
          <div className="space-y-2">
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
          
          <div className="mt-3 pt-2 border-t border-white/5">
            <p className="text-xs font-medium text-amber-400/80 mb-2">Features</p>
            <ul className="space-y-1">
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
  const gsapTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const originalBodyOverflowRef = useRef<string>('');
  const didHideScrollRef = useRef<boolean>(false);
  
  // Enhanced mouse effects for desktop
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile.current || !glareRef.current || !contentRef.current) return;
    
    const rect = contentRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xPercent = x / rect.width * 100;
    const yPercent = y / rect.height * 100;
    
    // Enhanced glare effect
    glareRef.current.style.background = `
      radial-gradient(circle at ${xPercent}% ${yPercent}%, 
        rgba(255,255,255,0.15) 0%, 
        rgba(255,255,255,0.1) 25%, 
        rgba(255,255,255,0) 50%)
    `;
    
    if (contentRef.current) {
      // Enhanced 3D rotation with subtle scaling
      gsap.to(contentRef.current, {
        rotateX: (yPercent - 50) / 20,
        rotateY: (xPercent - 50) / 20,
        scale: 1.02,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile.current && contentRef.current) {
      gsap.to(contentRef.current, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.6,
        ease: "elastic.out(1, 0.8)"
      });
    }
  }, []);
  
  useEffect(() => {
    if (!modalRef.current || !contentRef.current) return;

    const modalElement = modalRef.current;
    const contentElement = contentRef.current;

    if (gsapTimelineRef.current) {
      gsapTimelineRef.current.kill();
      gsapTimelineRef.current = null;
    }

    if (isOpen) {
      if (!didHideScrollRef.current) { // Only capture if we haven't hidden scroll yet
        originalBodyOverflowRef.current = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        didHideScrollRef.current = true;
      }

      gsap.set(modalElement, { display: 'flex', opacity: 1 });
      gsap.set(contentElement, { opacity: 0, y: 20, scale: 0.95, rotateX: 5 });

      gsapTimelineRef.current = gsap.timeline({ defaults: { ease: "power3.out" } });
      gsapTimelineRef.current
        .to(modalElement, {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(12px)',
        duration: 0.5
      })
        .to(contentElement, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
      }, "-=0.3");

    } else {
      if (modalElement.style.display === 'flex') {
        gsapTimelineRef.current = gsap.timeline({
          defaults: { ease: "power3.in" },
          onComplete: () => {
            if (didHideScrollRef.current) {
              document.body.style.overflow = originalBodyOverflowRef.current;
              didHideScrollRef.current = false;
            }
            gsap.set(modalElement, { display: 'none', opacity: 0 });
          }
        });

        gsapTimelineRef.current
          .to(contentElement, {
        opacity: 0,
            y: -20, // Changed to -20 to match visual expectation of animating "out and up"
        scale: 0.95,
            rotateX: -5, // Changed to -5
        duration: 0.4
      })
          .to(modalElement, {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        backdropFilter: 'blur(0px)',
            opacity: 0,
        duration: 0.3
      }, "-=0.2");
      } else {
        if (didHideScrollRef.current) {
          document.body.style.overflow = originalBodyOverflowRef.current;
          didHideScrollRef.current = false;
        }
        gsap.set(modalElement, { display: 'none', opacity: 0 });
      }
    }

    return () => {
      if (gsapTimelineRef.current) {
        gsapTimelineRef.current.kill();
        gsapTimelineRef.current = null;
      }
      if (didHideScrollRef.current) {
        document.body.style.overflow = originalBodyOverflowRef.current;
        didHideScrollRef.current = false;
      }
    };
  }, [isOpen]);

  // Conditional rendering to allow animations to finish
  if (!isOpen && modalRef.current && modalRef.current.style.display === 'none' && 
      (!gsapTimelineRef.current || !gsapTimelineRef.current.isActive()) ) {
    return null;
  }

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-start justify-center"
      style={{
        display: 'none', 
        opacity: 0,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        backdropFilter: 'blur(0px)',
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
        className="relative w-full bg-dark-800/30 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden shadow-2xl z-10"
        style={{ 
          opacity: 0,
          transform: 'perspective(1000px)',
          maxWidth: '360px', 
          maxHeight: '80vh', 
          margin: '0 auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 z-20 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-dark-800/50 backdrop-blur-md hover:bg-dark-700/50 text-white border border-white/20 shadow-lg transition-all duration-300 group"
          aria-label="Close modal"
        >
          <X size={14} className="text-amber-400 group-hover:scale-110 transition-transform" />
        </button>
        
        <div className="relative h-24 overflow-hidden"> 
          <div className="absolute inset-0 bg-gradient-to-t from-dark-800/90 via-dark-800/50 to-transparent z-10"></div>
          <img 
            src="https://i.postimg.cc/P50QC6rf/IMG-9847.jpg" 
            alt="YKFA Training" 
            className="w-full h-full object-cover scale-110 hover:scale-105 transition-transform duration-[2s]"
            loading="eager"
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
        
        <div className="p-2.5 max-h-[calc(80vh-96px)] overflow-y-auto scrollbar-hide bg-dark-800/20 backdrop-blur-sm"> 
          <div className="space-y-2.5"> 
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2.5 border border-white/10 shadow-inner"> 
              <h3 className="text-xs font-semibold text-amber-400 mb-1">Our Mission</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                At YKFA, we empower individuals through martial arts and fitness training, developing physical strength, mental discipline, and self-confidence.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2.5 border border-white/10 shadow-inner">
              <h3 className="text-xs font-semibold text-amber-400 mb-1">About Master Yaseen</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                Master Yaseen brings over 20 years of martial arts experience, dedicated to mastering and teaching various disciplines with emphasis on technical precision and character development.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2.5 border border-white/10 shadow-inner">
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
              className="px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-medium text-xs transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/20"
            >
              Know More
            </Link>
            <Link
              to="/contact"
              className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm"
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
  link: string;
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

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Use IntersectionObserver for smooth blur reveal
  useEffect(() => {
    let observer: IntersectionObserver;
    const currentCardRef = cardRef.current;

    if (currentCardRef) {
      observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
            if (isMounted.current) {
          setIsVisible(true);
            }
          
          const card = cardRef.current;
          if (card) {
            card.style.transitionDelay = `${index * 120}ms`;
          }
          if (imageRef.current) {
            setTimeout(() => {
                if (isMounted.current && imageRef.current) {
                  imageRef.current.classList.add('visible');
                }
            }, index * 120 + 250);
          }
          if (titleRef.current) {
            setTimeout(() => {
                if (isMounted.current && titleRef.current) {
                  titleRef.current.classList.add('visible');
                }
            }, index * 120 + 400);
          }
          if (descRef.current) {
            setTimeout(() => {
                if (isMounted.current && descRef.current) {
                  descRef.current.classList.add('visible');
                }
            }, index * 120 + 500);
          }
          
          observer.unobserve(entry.target);
        }
      },
      {
          threshold: 0.12, 
          rootMargin: '0px 0px -40px 0px'
      }
    );
      observer.observe(currentCardRef);
    }

    return () => {
      if (observer && currentCardRef) {
        observer.unobserve(currentCardRef);
      }
      if (observer) {
      observer.disconnect();
      }
    };
  }, [isVisible, index]);

  return (
    <div 
      ref={cardRef}
      className={`card-container ${isVisible ? 'visible' : ''} group`}
      style={{
        minWidth: compact ? 0 : undefined,
        maxWidth: compact ? '100%' : undefined
      }}
    >
      <div className={`card relative overflow-hidden backdrop-blur-sm border border-transparent
        ${compact ? 'p-2' : 'p-2 md:p-4'}
        group-hover:border-amber-500/20
      `}>
        {/* Enhanced gradient border effect on hover with smoother transitions */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 via-amber-500/30 to-dark-600/50 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-2xl -z-10"></div>
        
        {/* Subtle glow effect on hover with longer duration */}
        <div className="absolute -inset-1 bg-amber-500/5 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-1200 rounded-3xl -z-20"></div>
        
        <div className={`overflow-hidden rounded-xl mb-2 relative ${compact ? 'h-52 sm:h-48 md:h-36' : 'h-64 md:h-64'}`}> 
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-70"></div>
          <img 
            ref={imageRef}
            src={image} 
            alt={title} 
            className="w-full h-full object-cover object-center img-active group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 p-2 z-20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <button 
              onClick={() => onDetailsClick(program)}
              className="inline-flex items-center text-black bg-gradient-to-r from-amber-400/90 to-amber-500/90 hover:from-amber-400 hover:to-amber-500 px-2 py-1 rounded-lg transition-all text-xs shadow hover:shadow-amber-400/30"
              aria-label={`Learn more about ${title}`}
            >
              Learn more <ArrowRight className="ml-1 w-3 h-3" />
            </button>
          </div>
        </div>
        <div className="p-0 mb-2">
          <h3 
            ref={titleRef}
            className="font-bold mb-1 text-active group-hover:text-amber-400 transition-colors duration-300"
            style={{
              fontSize: compact ? (isMobile ? '0.875rem' : '1rem') : (isMobile ? '1rem' : '1.25rem')
            }}
          >
            {title}
          </h3>
          <p 
            ref={descRef}
            className="text-gray-400 mb-2 line-clamp-3 text-active group-hover:text-gray-300 transition-colors duration-300"
            style={{
              fontSize: compact ? '0.75rem' : (isMobile ? '0.75rem' : '0.875rem')
            }}
          >
            {description}
          </p>
        </div>
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

  // Centralized isMounted effect for HomePage
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Reduce loading time to 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMounted.current) {
      setForceComplete(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Add state for program details modal
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Handle opening modal with program details
  const handleProgramDetailsClick = (program: any) => {
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
      console.log("Page was refreshed, not opening modal");
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
      
      console.log("Found matching program:", matchingProgram);
      
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
      console.log("Received program selected event:", programName);
      
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
    
    // Add event listener
    window.addEventListener(PROGRAM_SELECTED_EVENT, handleProgramSelected as EventListener);
    
    // Clean up
    return () => {
      window.removeEventListener(PROGRAM_SELECTED_EVENT, handleProgramSelected as EventListener);
    };
  }, []);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      isMobileDevice.current = 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
        window.innerWidth <= 768;
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Manual image change function - with JS enhancement
  const changeImage = useCallback((direction: 'next' | 'prev') => {
    if (imageTransitionInProgress.current) return;
    
    // Interval is now managed by useEffect, so we only clear it here if it exists
    if (autoImageChangeInterval.current) {
      clearInterval(autoImageChangeInterval.current);
      autoImageChangeInterval.current = null;
    }
    
    // Clear any existing timeouts
    imageTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    imageTimeoutsRef.current = [];
    
    imageTransitionInProgress.current = true;
    if (isMounted.current) {
    setImageTransitioning(true);
    setTransitionDirection(direction);
    }
    
    const container = aboutImageRef.current;
    if (container) {
      container.classList.add('transitioning');
      container.classList.add(`transitioning-${direction}`);
      
      const targetImageIndex = direction === 'next' 
        ? (aboutImageIndex + 1) % ABOUT_IMAGES_DATA.length
        : (aboutImageIndex - 1 + ABOUT_IMAGES_DATA.length) % ABOUT_IMAGES_DATA.length;
      
      const preloadImg = new Image();
      preloadImg.src = ABOUT_IMAGES_DATA[targetImageIndex];
      
      const continueTransition = () => {
        const timeout1 = setTimeout(() => {
          if (isMounted.current) {
            if (direction === 'next') {
              setAboutImageIndex(prevIndex => (prevIndex + 1) % ABOUT_IMAGES_DATA.length);
            } else {
              setAboutImageIndex(prevIndex => (prevIndex - 1 + ABOUT_IMAGES_DATA.length) % ABOUT_IMAGES_DATA.length);
            }
            }
            
          const timeout2 = setTimeout(() => {
            if (container) {
              container.classList.remove('transitioning');
              container.classList.remove(`transitioning-${direction}`);
                    }
                    imageTransitionInProgress.current = false;
            if (isMounted.current) {
            setImageTransitioning(false);
            setTransitionDirection(null);
            }
          }, 800);
          
          imageTimeoutsRef.current.push(timeout2);
        }, 400);
        
        imageTimeoutsRef.current.push(timeout1);
      };
      
      if (preloadImg.complete) {
        continueTransition();
      } else {
        preloadImg.onload = continueTransition;
        const fallbackTimeout = setTimeout(continueTransition, 300);
        imageTimeoutsRef.current.push(fallbackTimeout);
      }
    }
  }, [aboutImageIndex]); // Removed ABOUT_IMAGES_DATA as it's a constant
  
  // Clean up all timeouts when component unmounts
  useEffect(() => {
    return () => {
      imageTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      imageTimeoutsRef.current = [];
    };
  }, []);

  // useEffect to manage the auto image change interval
  useEffect(() => {
    // Start the interval only if component is mounted
    if (!autoImageChangeInterval.current && !imageTransitionInProgress.current && isMounted.current) {
      autoImageChangeInterval.current = setInterval(() => {
        // Only proceed if component is still mounted
        if (!imageTransitionInProgress.current && isMounted.current) {
          changeImage('next');
        }
      }, 5000);
    }

    // Cleanup: clear interval on unmount or when dependencies change
    return () => {
      if (autoImageChangeInterval.current) {
        clearInterval(autoImageChangeInterval.current);
        autoImageChangeInterval.current = null;
      }
    };
  }, [changeImage, isMounted]); // Add isMounted to dependency array
  
  // JavaScript animation enhancements for the image slider (useEffect remains largely the same, focuses on DOM manipulation)
  useEffect(() => {
    if (!aboutImageRef.current) return;
    
    const container = aboutImageRef.current;
    const currentImage = container.querySelector<HTMLElement>('.current-image');
    const prevImage = container.querySelector<HTMLElement>('.prev-image');
    const nextImage = container.querySelector<HTMLElement>('.next-image');
    
    if (!currentImage || !prevImage || !nextImage) return;

    if (imageTransitioning && transitionDirection) {
      // JS animations intentionally bypassed to defer to CSS transitions
    } else if (!imageTransitioning) {
      // Transition is over, reset inline styles to allow CSS to take over for the resting state.
      if (currentImage instanceof HTMLElement) {
        currentImage.style.opacity = '';
        currentImage.style.transform = '';
        currentImage.style.filter = '';
        currentImage.style.transition = ''; // Also clear transition
      }
      if (nextImage instanceof HTMLElement) {
        nextImage.style.opacity = '';
        nextImage.style.transform = '';
        nextImage.style.boxShadow = '';
        nextImage.style.transition = '';
      }
      if (prevImage instanceof HTMLElement) {
        prevImage.style.opacity = '';
        prevImage.style.transform = '';
        prevImage.style.boxShadow = '';
        prevImage.style.transition = '';
      }
    }
    
    // Cleanup function for animation: if the component unmounts or dependencies change
    // while an animation is "in flight" (though less critical with this new reset logic).
    return () => {
      // If timeouts were stored, they could be cleared here.
      // For now, the main reset is handled by the else if block.
    };
  }, [imageTransitioning, transitionDirection]);
  
  // Add subtle parallax effect on mouse movement
  useEffect(() => {
    if (!aboutImageRef.current) return;
    
    const container = aboutImageRef.current;
    const currentImage = container.querySelector('.current-image');
    
    const handleMouseMove = (e: MouseEvent) => {
      if (imageTransitionInProgress.current || !currentImage || !(currentImage instanceof HTMLElement)) return;
      
      // Calculate mouse position relative to container center
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const moveX = (e.clientX - centerX) / 30; // Reduce movement amount for subtlety
      const moveY = (e.clientY - centerY) / 30;
      
      // Apply subtle transform to create parallax effect
      requestAnimationFrame(() => {
        currentImage.style.transition = 'transform 0.5s ease-out';
        currentImage.style.transform = `translateX(${moveX}px) translateY(${moveY}px) scale(1.01)`;
      });
    };
    
    const handleMouseLeave = () => {
      if (!currentImage || !(currentImage instanceof HTMLElement)) return;
      
      requestAnimationFrame(() => {
        currentImage.style.transition = 'transform 0.5s ease-out';
        currentImage.style.transform = 'translateX(0) translateY(0) scale(1)';
      });
    };
    
    // Only add mouse effects on non-mobile
    if (!isMobileDevice.current) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (!isMobileDevice.current) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [aboutImageIndex]); // Re-attach when the image changes

  // About section images array (define outside if static, or useMemo if derived)
  // For now, assuming it's fine here as it's used by changeImage which is memoized.
  /* const aboutImages = ABOUT_IMAGES_DATA; */ // Now using ABOUT_IMAGES_DATA directly

  // Preload images for smoother transitions (useEffect for imageCache and preloadAllImages)
  useEffect(() => {
    const imageCache = new Map();
    const preloadAllImages = async () => {
      const loadPromises = ABOUT_IMAGES_DATA.map((src) => { // Use ABOUT_IMAGES_DATA
        return new Promise<void>((resolve) => {
          if (imageCache.has(src)) {
            resolve();
            return;
          }
          
        const img = new Image();
        img.src = src;
          
          // Handle both load event and decode method
          const completeLoad = () => {
          imageCache.set(src, true);
            resolve();
        };
          
          if (img.complete) {
            completeLoad();
          } else {
            img.onload = completeLoad;
            // Fallback in case image loading takes too long
            setTimeout(resolve, 1000);
          }
          
          // Force decode the image if browser supports it
        if ('decode' in img) {
          img.decode().catch(() => {
              // Silently catch decode errors
          });
        }
        });
    });
      
      // Wait for all images to preload
      await Promise.all(loadPromises);
    };
    
    // Start preloading
    preloadAllImages();
    
    return () => {
      // Clear cache references when component unmounts
      imageCache.clear();
    };
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

  // programs array (define outside if static)
  /* const programs = PROGRAMS_DATA; */ // Now using PROGRAMS_DATA directly

  // Add state for about modal
  const [showAboutModal, setShowAboutModal] = useState(false);

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
                  {/* Previous image (left side, minimal peek) */}
                  <div className="prev-image absolute top-0 bottom-0 left-[-5%] w-[12%] z-0 transform scale-[0.97] opacity-70 rounded-xl overflow-hidden shadow-lg transition-all duration-700">
                    <img 
                      src={ABOUT_IMAGES_DATA[(aboutImageIndex - 1 + ABOUT_IMAGES_DATA.length) % ABOUT_IMAGES_DATA.length]} 
                      alt="Previous" 
                      className="w-full h-full object-cover"
                      style={{ 
                        objectPosition: 'right center',
                      }}
                      loading="eager"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                  </div>
                  
                  {/* Next image (right side, minimal peek) */}
                  <div className="next-image absolute top-0 bottom-0 right-[-5%] w-[12%] z-0 transform scale-[0.97] opacity-70 rounded-xl overflow-hidden shadow-lg transition-all duration-700">
                    <img 
                      src={ABOUT_IMAGES_DATA[(aboutImageIndex + 1) % ABOUT_IMAGES_DATA.length]} 
                      alt="Next" 
                      className="w-full h-full object-cover"
                      style={{ 
                        objectPosition: 'left center',
                      }}
                      loading="eager"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                  </div>
                  
                  {/* Current image (center, fully visible) */}
                  <div className="current-image absolute inset-0 z-10 rounded-xl overflow-hidden transform transition-all duration-700 ease-out shadow-xl">
                    <img 
                      src={ABOUT_IMAGES_DATA[aboutImageIndex]} 
                      alt="YKFA Training" 
                      className="w-full h-full object-cover transition-opacity duration-300"
                      loading="eager"
                      decoding="async"
                      style={{
                        opacity: imageTransitioning ? 0.8 : 1,
                      }}
                      onLoad={(e) => {
                        e.currentTarget.style.opacity = '1';
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
      <section ref={programsSectionRef} className="section bg-dark-800">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
            <h2 className="mb-4">Training Programs for <span className="text-transparent bg-clip-text bg-gold-gradient">All Levels</span></h2>
            <p className="text-gray-300">
              Explore our diverse range of training programs designed to help you achieve your fitness and martial arts goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {PROGRAMS_DATA.map((program, index) => (
              <ProgramCard 
                key={program.id}
                title={program.title}
                description={program.description}
                image={program.image}
                link={program.link}
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
        <div className="absolute inset-0 bg-gradient-to-br from-black via-dark-800 to-amber-900/20 opacity-90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.1),transparent_70%)]"></div>
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
      `}} />
    </>
  );
};

export default HomePage;