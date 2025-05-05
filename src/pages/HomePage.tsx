import { ArrowRight, Timer, MessageCircle, Bot, Calculator, X, ChevronRight, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { useState, useEffect, useRef, useContext } from 'react';
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

  // Hide initial tooltip after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialTooltip(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Listen for active widget changes from context menu
  useEffect(() => {
    if (activeWidget) {
      // Expand the floating button menu
      setIsExpanded(true);
      
      // Hide the initial tooltip if it's showing
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
      
      // Reset the active widget in context to avoid reopening on component remounts
      setActiveWidget(null);
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
  
  // Generate details for each program based on MembershipPage.tsx data
  const getProgramDetails = () => {
    const details = {
      price: {
        monthly: program.title === "GYM ONLY" ? "₹2,500" : 
                program.title === "MMA ONLY" ? "₹2,500" : 
                program.title === "GROUP FITNESS" ? "₹2,500" : 
                program.title === "KARATE" ? "₹1,000" : "₹3,500",
        quarterly: program.title === "GYM ONLY" ? "₹5,500" : 
                   program.title === "MMA ONLY" ? "₹5,500" : 
                   program.title === "GROUP FITNESS" ? "₹5,500" : 
                   program.title === "KARATE" ? "Monthly only" : "₹9,500",
        annual: program.title === "GYM ONLY" ? "₹15,000" : 
                program.title === "MMA ONLY" ? "₹15,000" : 
                program.title === "GROUP FITNESS" ? "₹15,000" : 
                program.title === "KARATE" ? "Monthly only" : "₹25,000",
      },
      schedule: program.title === "MMA + GYM" ? "24/7 gym access, 3 martial arts classes per week" :
                program.title === "MMA ONLY" ? "3 martial arts classes per week" :
                program.title === "GROUP FITNESS" ? "2 days cardio, 4 days strength training" :
                program.title === "KARATE" ? "2 classes per week" : "24/7 access",
      trainer: program.title === "MMA + GYM" ? "Yaseen & Team" :
               program.title === "MMA ONLY" ? "Yaseen" :
               program.title === "GROUP FITNESS" ? "Fitness Coach" :
               program.title === "KARATE" ? "Master Yaseen" : "Self-guided with assistance",
      features: program.title === "MMA + GYM" ? [
                  "Access to gym", 
                  "3 martial arts classes per week", 
                  "Basic fitness assessment", 
                  "Access to gym app", 
                  "All MMA disciplines included"
                ] :
                program.title === "MMA ONLY" ? [
                  "3 martial arts classes per week", 
                  "Boxing, Kickboxing, Muay Thai", 
                  "Wrestling, Judo, BJJ", 
                  "Technical sessions", 
                  "Sparring sessions"
                ] :
                program.title === "GROUP FITNESS" ? [
                  "Group cardio sessions with coach", 
                  "Access to gym app", 
                  "2 days cardio and HIIT", 
                  "4 days strength training", 
                  "Personalized fitness guidance"
                ] :
                program.title === "KARATE" ? [
                  "2 classes per week", 
                  "Belt progression system", 
                  "Kata and kumite practice", 
                  "Self-defense techniques", 
                  "Mental discipline focus"
                ] : [
                  "Access to gym", 
                  "Access to gym app", 
                  "Full range of equipment", 
                  "Free weights and machines", 
                  "Cardio section"
                ]
    };
    return details;
  };
  
  const details = getProgramDetails();
  
  // Animation for modal open/close
  useEffect(() => {
    if (!modalRef.current || !contentRef.current) return;
    
    if (isOpen) {
      // Animate backdrop
      gsap.to(modalRef.current, {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        duration: 0.4,
        ease: 'power2.out'
      });
      
      // Animate content
      gsap.fromTo(contentRef.current,
        {
          opacity: 0,
          y: 30,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.7)'
        }
      );
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Animate out
      gsap.to(modalRef.current, {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        backdropFilter: 'blur(0px)',
        duration: 0.3,
        ease: 'power2.in'
      });
      
      gsap.to(contentRef.current, {
        opacity: 0,
        y: 20,
        scale: 0.95,
        duration: 0.3,
        ease: 'power2.in'
      });
      
      // Restore body scroll
      document.body.style.overflow = '';
    }
    
    // Cleanup
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('Escape key pressed - closing modal');
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);
  
  // Simple close handler
  const closeModal = () => {
    console.log('Close modal called');
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 pt-0 sm:p-4 bg-black/0 backdrop-blur-0 transition-all"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)'
      }}
    >
      {/* Backdrop for catching outside clicks */}
      <div 
        className="absolute inset-0 z-0" 
        onClick={closeModal}
      ></div>
      
      <div 
        ref={contentRef}
        className="relative w-full max-w-3xl bg-dark-800/80 backdrop-blur-lg border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl z-10"
        style={{ 
          opacity: 0,
          maxHeight: 'calc(100vh - 84px)', // Account for navbar height + safe area
          marginTop: '60px', // Add top margin to account for navbar
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch', // For smooth scrolling on iOS
          msOverflowStyle: '-ms-autohiding-scrollbar', // Improved scrolling on Edge
          paddingBottom: 'env(safe-area-inset-bottom, 16px)' // iOS safe area bottom padding
        }}
      >
        {/* Close button - fixed position on mobile, absolute on desktop */}
        <button 
          type="button"
          onClick={closeModal}
          className="fixed top-3 right-3 sm:absolute sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-dark-800/90 hover:bg-dark-700 text-white border border-white/20 shadow-lg transition-all duration-300"
          aria-label="Close modal"
        >
          <X size={16} className="text-amber-400 sm:hidden" />
          <X size={20} className="text-amber-400 hidden sm:block" />
        </button>
        
        {/* Hero section - smaller on mobile */}
        <div className="relative h-40 sm:h-56 md:h-72 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent z-10"></div>
          <img 
            src={program.image} 
            alt={program.title} 
            className="w-full h-full object-cover"
            loading="eager" // Prioritize loading for better UX
            width="800"
            height="450"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.pexels.com/photos/4761352/pexels-photo-4761352.jpeg?auto=compress&cs=tinysrgb&w=800";
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 z-10">
            <div className="inline-block mb-1 sm:mb-3 py-1 px-2 sm:px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-[10px] sm:text-xs">{program.category.toUpperCase()}</p>
            </div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-white">{program.title}</h2>
          </div>
        </div>
        
        {/* Content - more compact on mobile */}
        <div className="p-3 sm:p-6">
          {/* Description */}
          <div id="program-description" className="mb-3 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-3 text-white">Description</h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{program.description}</p>
          </div>
          
          {/* Features */}
          <div id="program-features" className="mb-3 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-3 text-white">What's Included</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-1 gap-x-2 gap-y-1 sm:space-y-2">
              {details.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-1.5 sm:gap-2 text-gray-300 text-xs sm:text-sm">
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Details grid */}
          <div id="program-details" className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-6">
            <div className="bg-dark-700/50 border border-white/5 rounded-lg sm:rounded-xl p-2.5 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-amber-400/20 flex items-center justify-center">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
                </div>
                <h4 className="font-medium text-xs sm:text-base text-white">Schedule</h4>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm pl-8 sm:pl-11">{details.schedule}</p>
            </div>
            
            <div className="bg-dark-700/50 border border-white/5 rounded-lg sm:rounded-xl p-2.5 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-amber-400/20 flex items-center justify-center">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
                </div>
                <h4 className="font-medium text-xs sm:text-base text-white">Trainer</h4>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm pl-8 sm:pl-11">{details.trainer}</p>
            </div>
          </div>
          
          {/* Pricing */}
          <div id="program-pricing" className="mb-3 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-3 text-white">Pricing Options</h3>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-1.5 sm:gap-3">
              <div className="bg-dark-700/50 border border-white/5 rounded-lg sm:rounded-xl p-2 sm:p-4 text-center">
                <h4 className="text-gray-300 text-[10px] sm:text-sm mb-0.5 sm:mb-1">Monthly</h4>
                <p className="text-base sm:text-xl font-bold text-white">{details.price.monthly}</p>
                <p className="text-[8px] sm:text-xs text-gray-400">Per month</p>
              </div>
              
              <div className="bg-dark-700/50 border border-white/5 rounded-lg sm:rounded-xl p-2 sm:p-4 text-center relative overflow-hidden">
                <div className="absolute -right-6 -top-1 rotate-45 bg-amber-400/80 text-black text-[7px] sm:text-[10px] font-bold py-0.5 px-6">
                  POPULAR
                </div>
                <h4 className="text-gray-300 text-[10px] sm:text-sm mb-0.5 sm:mb-1">Quarterly</h4>
                <p className="text-base sm:text-xl font-bold text-white">{details.price.quarterly}</p>
                <p className="text-[8px] sm:text-xs text-gray-400">3 months</p>
              </div>
              
              <div className="bg-dark-700/50 border border-white/5 rounded-lg sm:rounded-xl p-2 sm:p-4 text-center">
                <h4 className="text-gray-300 text-[10px] sm:text-sm mb-0.5 sm:mb-1">Annual</h4>
                <p className="text-base sm:text-xl font-bold text-white">{details.price.annual}</p>
                <p className="text-[8px] sm:text-xs text-gray-400">Best value</p>
              </div>
            </div>
          </div>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pb-6 sm:pb-4">
            <a 
              href={`/contact?program=membership&type=${program.title.toLowerCase().replace(' ', '_')}`}
              className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl text-center transition-all text-xs sm:text-base"
            >
              Join Now
            </a>
            
            <a 
              href="/contact" 
              className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl text-center transition-all text-xs sm:text-base"
            >
              Request Information
            </a>
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
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for mobile device and reduced motion preference
  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    
    // Check if user prefers reduced motion
    const checkReducedMotion = () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setPrefersReducedMotion(prefersReduced);
    };
    
    checkMobile();
    checkReducedMotion();
    
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Set up GSAP animations when card becomes visible
  useEffect(() => {
    // IntersectionObserver to detect when card is in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.unobserve(entry.target);
          
          // Start animations once visible
          if (cardRef.current) {
            // Different animation settings based on device and preferences
            const duration = isMobile || prefersReducedMotion ? 0.8 : 1.2;
            const delay = (isMobile ? index * 0.08 : index * 0.15) + (prefersReducedMotion ? 0 : 0);
            const easing = prefersReducedMotion ? "power2.out" : "elastic.out(1, 0.75)";
            
            // Use simpler animation for mobile or reduced motion
            if (isMobile || prefersReducedMotion) {
              // Simpler animation for mobile/reduced motion
              gsap.fromTo(cardRef.current,
                { 
                  y: 30, 
                  opacity: 0
                },
                { 
                  y: 0, 
                  opacity: 1,
                  duration: duration,
                  delay: delay,
                  ease: "power2.out",
                  clearProps: "transform"
                }
              );
            } else {
              // Full animation for desktop
              gsap.fromTo(cardRef.current,
                { 
                  y: 60, 
                  opacity: 0, 
                  scale: 0.9, 
                  rotationX: 5, 
                  rotationY: -5
                },
                { 
                  y: 0, 
                  opacity: 1, 
                  scale: 1, 
                  rotationX: 0, 
                  rotationY: 0,
                  duration: duration,
                  delay: delay,
                  ease: easing,
                  transformOrigin: "center bottom",
                  clearProps: "transform" // Clear transform after animation
                }
              );
            }
            
            // Staggered animation for card contents - simplified for mobile
            const content = cardRef.current.querySelectorAll('.animate-item');
            gsap.fromTo(content,
              { 
                y: isMobile ? 15 : 30, 
                opacity: 0 
              },
              { 
                y: 0, 
                opacity: 1, 
                stagger: isMobile ? 0.05 : 0.1,
                duration: isMobile ? 0.5 : 0.8,
                delay: 0.1 + delay,
                ease: "power3.out"
              }
            );
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    // Set up hover/touch animation - only if not reduced motion
    if (!prefersReducedMotion) {
      const card = cardRef.current;
      const image = imageRef.current;
      
      if (card && image) {
        // Create hover animation timeline - lighter on mobile
        const hoverTl = gsap.timeline({ paused: true });
        
        hoverTl
          .to(card, { 
            y: isMobile ? -4 : -8, 
            scale: isMobile ? 1.01 : 1.02, 
            boxShadow: isMobile ? "0 10px 25px rgba(0, 0, 0, 0.2)" : "0 20px 40px rgba(0, 0, 0, 0.3)",
            duration: isMobile ? 0.3 : 0.4,
            ease: "power2.out"
          })
          .to(image, { 
            scale: isMobile ? 1.05 : 1.1, 
            duration: isMobile ? 0.4 : 0.6, 
            ease: "power1.out" 
          }, 0);
        
        // Desktop: mouse events
        if (!isMobile) {
          card.addEventListener("mouseenter", () => hoverTl.play());
          card.addEventListener("mouseleave", () => hoverTl.reverse());
        } 
        // Mobile: touch events with proper handling
        else {
          // For touch devices, play on touch and reverse on card blur
          let touchTimeout: number;
          
          const handleTouch = () => {
            clearTimeout(touchTimeout);
            hoverTl.play();
            
            // Auto-reverse after delay (simulates "touch away")
            touchTimeout = window.setTimeout(() => {
              hoverTl.reverse();
            }, 2000);
          };
          
          const handleTouchStart = (e: TouchEvent) => {
            // Only handle single touch
            if (e.touches.length !== 1) return;
            handleTouch();
          };
          
          card.addEventListener("touchstart", handleTouchStart, { passive: true });
          
          // Clean up
    return () => {
            observer.disconnect();
            if (!isMobile) {
              card.removeEventListener("mouseenter", () => hoverTl.play());
              card.removeEventListener("mouseleave", () => hoverTl.reverse());
            } else {
              card.removeEventListener("touchstart", handleTouchStart);
              clearTimeout(touchTimeout);
      }
          };
        }
      }
    }
    
    return () => {
      observer.disconnect();
    };
  }, [index, isVisible, isMobile, prefersReducedMotion]);

  return (
    <div 
      ref={cardRef}
      className={`card group relative overflow-hidden backdrop-blur-sm border border-transparent will-change-transform
        ${compact ? 'p-2' : 'p-2 md:p-4'}
      `}
      style={{
        minWidth: compact ? 0 : undefined,
        maxWidth: compact ? '100%' : undefined,
        opacity: 0 // Start invisible, GSAP will handle visibility
      }}
    >
      {/* Gradient border effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 via-amber-500/30 to-dark-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl -z-10"></div>
      
      <div className={`overflow-hidden rounded-xl mb-2 relative ${compact ? 'h-52 sm:h-48 md:h-36' : 'h-64 md:h-64'}`}> 
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
        <img 
          ref={imageRef}
          src={image} 
          alt={title} 
          className={`w-full h-full object-cover object-center ${compact ? 'rounded-xl' : ''} animate-item`}
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 p-2 z-20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <button 
            onClick={() => onDetailsClick(program)}
            className="inline-flex items-center text-black bg-gradient-to-r from-amber-400/90 to-amber-500/90 hover:from-amber-400 hover:to-amber-500 px-2 py-1 rounded-lg transition-all text-xs animate-item"
            aria-label={`Learn more about ${title}`}
          >
            Learn more <ArrowRight className="ml-1 w-3 h-3" />
          </button>
        </div>
      </div>
      <div ref={contentRef} className="p-0 mb-2">
        <h3 className={`font-bold mb-1 animate-item ${compact ? 'text-sm md:text-base' : 'text-base md:text-xl'}`}>{title}</h3>
        <p className={`text-gray-400 mb-2 animate-item ${compact ? 'text-xs' : 'text-xs md:text-sm'} line-clamp-3`}>{description}</p>
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
  const [scrollCount, setScrollCount] = useState(0);
  const [preventScroll, setPreventScroll] = useState(false);
  const [showAboutInstruction, setShowAboutInstruction] = useState(false);
  const wheelCountRef = useRef(0);
  const isAtBottomRef = useRef(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const isTouchActiveRef = useRef(false);
  const lastInteractionTime = useRef(0);
  const interactionCooldown = 200; // Reduced cooldown for faster responsiveness
  const isMobileDevice = useRef(false);
  const previousTouchDeltaY = useRef(0);
  const scrollLockRef = useRef(false);
  const hasPassedLockedSectionRef = useRef(false);
  
  // Force faster loading for loader
  const [forceComplete, setForceComplete] = useState(false);
  
  // Reduce loading time to 1 second
  useEffect(() => {
    // Force complete after 1000ms (1 second)
    const timer = setTimeout(() => {
      setForceComplete(true);
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
        matchingProgram = programs.find(p => p.title === programTitle);
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
        matchingProgram = programs.find(p => p.title === programName);
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

  // Reset wheel count when scrolling away from section
  const resetWheelCount = () => {
    if (!isAtBottomRef.current && wheelCountRef.current > 0) {
      wheelCountRef.current = 0;
      setScrollCount(0);
      setPreventScroll(false);
      setShowAboutInstruction(false);
      scrollLockRef.current = false;
    }
  };

  // Release lock if user has somehow passed the section
  const checkIfPassedLockedSection = () => {
    if (aboutSectionRef.current && programsSectionRef.current) {
      const aboutRect = aboutSectionRef.current.getBoundingClientRect();
      const programsRect = programsSectionRef.current.getBoundingClientRect();
      
      // If the about section is completely above the viewport
      // and the programs section is already visible
      if (aboutRect.bottom < 0 && programsRect.top < window.innerHeight) {
        // User has somehow passed the locked section
        hasPassedLockedSectionRef.current = true;
        scrollLockRef.current = false;
        
        // Reset all locks and counters
        if (wheelCountRef.current < 3) {
          wheelCountRef.current = 3; // Force completion
          setScrollCount(3);
          setPreventScroll(false);
          setShowAboutInstruction(false);
        }
      } else {
        // Reset the flag when scrolling back up
        if (aboutRect.top > 0) {
          hasPassedLockedSectionRef.current = false;
        }
      }
    }
  };

  // About section images array
  const aboutImages = [
    "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&fit=crop&w=800&q=80", // Gym - working
    "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=compress&fit=crop&w=800&q=80", // People working out
    "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&fit=crop&w=800&q=80", // Fitness class - working
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=compress&fit=crop&w=800&q=80"  // Gym equipment
  ];

  // Preload images for smoother transitions
  useEffect(() => {
    aboutImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Change image and handle scroll count
  const handleInteraction = () => {
    const now = Date.now();
    
    // Don't process if we've already passed the section
    if (hasPassedLockedSectionRef.current) return false;
    
    // Throttle interactions to prevent rapid firing
    if (now - lastInteractionTime.current < interactionCooldown) return false;
    lastInteractionTime.current = now;
    
    if (isAtBottomRef.current && wheelCountRef.current < 3) {
      // Change image on each interaction
      setAboutImageIndex(prevIndex => (prevIndex + 1) % aboutImages.length);
      wheelCountRef.current++;
      
      // Update state for UI feedback
      setScrollCount(wheelCountRef.current);
      setPreventScroll(true);
      scrollLockRef.current = true;
      
      // After 3 interactions, allow scrolling
      if (wheelCountRef.current === 3) {
        setTimeout(() => {
          setPreventScroll(false);
          setShowAboutInstruction(false);
          scrollLockRef.current = false;
        }, 500);
      }
      
      return true; // Interaction was processed
    }
    
    return false; // No interaction processed
  };

  // Check if user has scrolled to bottom of About section - optimized
  useEffect(() => {
    let lastCheckTime = 0;
    const checkInterval = isMobileDevice.current ? 100 : 50; // Less frequent checks on mobile

    const checkSectionPosition = () => {
      const now = Date.now();
      if (now - lastCheckTime < checkInterval) return;
      lastCheckTime = now;
      
      if (aboutSectionRef.current) {
        const rect = aboutSectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const wasAtBottom = isAtBottomRef.current;
        
        // Simplified bottom detection for better performance
        const isAtBottom = 
          rect.bottom <= windowHeight + 100 && // Larger buffer for mobile
          rect.top < windowHeight * 0.6; // Less strict requirement
          
        isAtBottomRef.current = isAtBottom;
        
        // Show instruction when reaching the bottom for the first time
        if (isAtBottom && !wasAtBottom && wheelCountRef.current === 0) {
          setShowAboutInstruction(true);
          scrollLockRef.current = true;
        }
        
        // Reset when scrolling away
        if (!isAtBottom && wasAtBottom) {
          resetWheelCount();
        }
      }
      
      // Check if user has somehow passed the locked section
      checkIfPassedLockedSection();
    };

    // Optimized scroll handler with passive event
    const handleScroll = () => checkSectionPosition();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', checkSectionPosition, { passive: true });
    
    // Initial check
    checkSectionPosition();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkSectionPosition);
    };
  }, []);

  // Block all scrolling while in locked state
  useEffect(() => {
    const blockScroll = (e: Event) => {
      // Check if we're past the section first
      checkIfPassedLockedSection();
      
      // Don't block if we've passed the section
      if (hasPassedLockedSectionRef.current) return true;
      
      if (scrollLockRef.current && isAtBottomRef.current && wheelCountRef.current < 3) {
        e.preventDefault();
        return false;
      }
      return true;
    };

    // Add multiple event handlers to catch all scroll events
    document.addEventListener('wheel', blockScroll, { passive: false });
    document.addEventListener('touchmove', blockScroll, { passive: false });
    document.addEventListener('scroll', blockScroll, { passive: false });
    
    // For iOS momentum scrolling - only when lock is active and we haven't passed the section
    if (scrollLockRef.current && !hasPassedLockedSectionRef.current) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.removeEventListener('wheel', blockScroll);
      document.removeEventListener('touchmove', blockScroll);
      document.removeEventListener('scroll', blockScroll);
      document.body.style.overflow = '';
    };
  }, []);

  // Handle wheel events for desktop
  useEffect(() => {
    if (isMobileDevice.current) return; // Skip wheel handling on mobile
    
    const handleWheel = (e: WheelEvent) => {
      // Don't process if we've already passed the section
      if (hasPassedLockedSectionRef.current) return;
      
      if (isAtBottomRef.current && wheelCountRef.current < 3) {
        // Only prevent default for downward scrolling
        if (e.deltaY > 0) {
          e.preventDefault();
          handleInteraction();
        }
      }
    };
    
    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    
    return () => {
      document.removeEventListener('wheel', handleWheel, { capture: true });
    };
  }, []);

  // Optimized touch handlers for mobile - Main interaction handler
  useEffect(() => {
    // Skip if not a mobile device
    if (!isMobileDevice.current) return;
    
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return; // Only handle single touch
      
      // Don't process if we've already passed the section
      if (hasPassedLockedSectionRef.current) return;
      
      // Store both X and Y for better directional detection
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
      previousTouchDeltaY.current = 0;
      
      // Check if we're in the critical section
      isTouchActiveRef.current = isAtBottomRef.current && wheelCountRef.current < 3;
      
      if (isTouchActiveRef.current) {
        // Mark that we're in a scroll lock state
        scrollLockRef.current = true;
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      // Check first if we've passed the section
      checkIfPassedLockedSection();
      
      // If we've passed, don't process anything
      if (hasPassedLockedSectionRef.current) return;
      
      // If in locked state, prevent all scroll
      if (scrollLockRef.current && isAtBottomRef.current && wheelCountRef.current < 3) {
        const touchY = e.touches[0].clientY;
        const touchX = e.touches[0].clientX;
        const deltaY = touchStartY.current - touchY;
        const deltaX = touchStartX.current - touchX;
        
        // If swiping upward (positive deltaY)
        if (deltaY > 5 && Math.abs(deltaY) > Math.abs(deltaX)) {
          e.preventDefault();
          
          // Only process an interaction if it's a significant swipe
          if (deltaY > 30) {
            const interactionProcessed = handleInteraction();
            
            if (interactionProcessed) {
              // Reset touch to prevent multiple triggers
              touchStartY.current = touchY;
              touchStartX.current = touchX;
            }
          }
        }
      }
    };
    
    const handleTouchEnd = () => {
      if (wheelCountRef.current >= 3 || hasPassedLockedSectionRef.current) {
        scrollLockRef.current = false;
      }
      isTouchActiveRef.current = false;
    };
    
    // Capture all touch events on the document level
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove, { capture: true });
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Regular scroll handler for testimonials
  useEffect(() => {
    const handleScroll = () => {
      // Testimonial section tooltip logic
      if (testimonialSectionRef.current && !hasSwipedCards) {
        const rect = testimonialSectionRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (isVisible) {
          setShowTestimonialTooltip(true);
        } else {
          setShowTestimonialTooltip(false);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasSwipedCards]);

  const handleCardSwipe = () => {
    setShowTestimonialTooltip(false);
    setHasSwipedCards(true);
  };

  const programs = [
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
      description: "Access to all MMA classes including boxing, kickboxing, and grappling.",
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
      description: "Traditional Karate training with belt progression system.",
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


  return (
    <>
      <Hero loadingComplete={forceComplete} />
      
      {/* About Section */}
      <section ref={aboutSectionRef} className="section bg-dark-900">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
                <p className="text-amber-400 font-medium text-sm">About YKFA</p>
              </div>
              <h2 className="mb-6">Elevating Fitness and Martial Arts <span className="text-transparent bg-clip-text bg-gold-gradient">Since 2015</span></h2>
              <p className="text-gray-300 mb-6">
                Yaseen's YKFA combines state-of-the-art fitness facilities with traditional martial arts training. Our academy is built on the principles of discipline, respect, and continuous improvement.
              </p>
              <p className="text-gray-300 mb-6">
                Whether you're a beginner looking to start your fitness journey or an experienced martial artist aiming to refine your skills, our expert instructors provide personalized guidance to help you achieve your goals.
              </p>
              <Link to="/about" className="btn btn-primary">
                Our Story
              </Link>
            </div>
            <div 
              ref={aboutImageRef}
              className="relative animate-fade-up touch-manipulation"
              style={{ 
                overscrollBehavior: 'contain',
                transform: 'translateZ(0)'
              }}
            >
              {/* Mobile instruction message for first-time visitors */}
              {showAboutInstruction && !hasPassedLockedSectionRef.current && (
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-30 w-max max-w-[90%] text-center">
                  <div className="bg-amber-400/90 backdrop-blur-sm text-black text-xs sm:text-sm px-3 py-1.5 rounded-lg animate-bounce-slow inline-flex items-center shadow-lg">
                    <svg className="w-3 h-3 mr-1.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                    </svg>
                    <span className="md:hidden">
                      <span className="font-medium">Locked:</span> Swipe up {scrollCount}/3 times
                    </span>
                    <span className="hidden md:inline">Scroll down {scrollCount}/3 times to continue</span>
                  </div>
                </div>
              )}

              {/* Lock indicator for mobile */}
              {isAtBottomRef.current && wheelCountRef.current < 3 && !showAboutInstruction && !hasPassedLockedSectionRef.current && (
                <div className="md:hidden absolute -bottom-12 left-1/2 -translate-x-1/2 z-30 w-max max-w-[90%] text-center">
                  <div className="bg-amber-400/90 backdrop-blur-sm text-black text-xs px-3 py-1.5 rounded-lg inline-flex items-center shadow-lg">
                    <svg className="w-3 h-3 mr-1.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                    </svg>
                    <span className="font-medium">Locked:</span> Swipe up {3 - wheelCountRef.current} more times
                  </div>
                </div>
              )}

              {/* Progress counter */}
              {preventScroll && !hasPassedLockedSectionRef.current && (
                <div className="absolute top-4 right-4 z-20 bg-amber-400/90 backdrop-blur-sm text-black text-xs font-medium px-2 py-1 rounded-full animate-pulse shadow-md">
                  {scrollCount < 3 ? `${scrollCount}/3` : 'Complete!'}
                </div>
              )}
              
              <div className="absolute -top-6 -left-6 w-64 h-64 rounded-full bg-amber-400/20 blur-3xl"></div>
              <img 
                src={aboutImages[aboutImageIndex]} 
                alt="YKFA Training" 
                className="w-full h-auto rounded-2xl shadow-lg relative z-10 transition-all duration-500 will-change-transform"
                style={{ 
                  objectFit: 'cover', 
                  height: '400px',
                  transform: `translateZ(0)` // Force hardware acceleration
                }}
                loading="eager"
              />
              
              {/* Navigation Buttons - Only visible after scroll lock completion */}
              {wheelCountRef.current >= 3 && (
                <>
                  <button 
                    onClick={() => setAboutImageIndex(prev => (prev - 1 + aboutImages.length) % aboutImages.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:scale-110 border border-white/10 shadow-lg"
                    aria-label="Previous image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setAboutImageIndex(prev => (prev + 1) % aboutImages.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:scale-110 border border-white/10 shadow-lg"
                    aria-label="Next image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </>
              )}
              
              {/* Progress indicator dots */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                {aboutImages.map((_, index) => (
                  <div 
                    key={index} 
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === aboutImageIndex 
                        ? 'bg-amber-400 scale-125' 
                        : 'bg-white/40 scale-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section ref={programsSectionRef} className="section bg-dark-800">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
            <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-sm">Our Programs</p>
            </div>
            <h2 className="mb-4">Training Programs for <span className="text-transparent bg-clip-text bg-gold-gradient">All Levels</span></h2>
            <p className="text-gray-300">
              Explore our diverse range of training programs designed to help you achieve your fitness and martial arts goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {programs.map((program, index) => (
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
            <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-sm">Testimonials</p>
            </div>
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
    </>
  );
};

export default HomePage;