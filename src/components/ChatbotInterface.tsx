import { useState, useRef, useEffect, ReactNode, memo } from 'react';
import { X, Send, Bot, Dumbbell, Info, Calendar, MapPin, CreditCard, Users, Image, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define enhanced interfaces
interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  actions?: ChatAction[];
}

interface ChatAction {
  label: string;
  value: string;
  icon?: ReactNode;
  path?: string;
}

interface QuickPrompt {
  label: string;
  value: string;
  icon: ReactNode;
}

// Add page data for use in the chatbot
interface KnowledgeBase {
  keywords: string[];
  response: string;
  actions?: ChatAction[];
}

interface ChatbotInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

// Memoize individual message component to prevent unnecessary re-renders
const ChatMessage = memo(({ message }: { message: Message }) => {
  const navigate = useNavigate();
  const [actionClicked, setActionClicked] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Enhanced action handler with visual feedback and smooth transitions
  const handleAction = (action: ChatAction) => {
    if (!action.path) return;
    
    // Set which button was clicked for visual feedback
    setActionClicked(action.label);
    setIsNavigating(true);
    
    // Add a small delay for visual feedback before navigation
    setTimeout(() => {
      // Use React Router's navigate for SPA navigation instead of page reload
      navigate(action.path!);
      
      // Reset states after navigation
      setTimeout(() => {
        setActionClicked(null);
        setIsNavigating(false);
      }, 300);
    }, 400);
  };
  
  return (
    <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} mb-3`}>
      <div
        className={`max-w-[90%] sm:max-w-[85%] p-2.5 sm:p-3 rounded-2xl backdrop-blur-sm shadow-lg ${message.isBot
          ? 'bg-dark-700/60 border border-white/10'
          : 'bg-gradient-to-br from-amber-500 to-amber-600 text-black'
          }`}
        style={message.isBot ? { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.05) inset' } : {}}
      >
        <div className="text-sm">{message.text}</div>
        {message.actions && message.actions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleAction(action)}
                disabled={isNavigating}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 
                  transition-all duration-300 transform 
                  ${actionClicked === action.label 
                    ? 'bg-amber-500 text-black scale-95' 
                    : 'bg-gradient-to-br from-amber-400/15 to-amber-500/20 text-amber-400 hover:from-amber-400/25 hover:to-amber-500/30 hover:scale-105'}
                  border border-amber-400/20 backdrop-blur-sm shadow-sm
                `}
              >
                {action.icon}
                <span>{action.label}</span>
                {actionClicked === action.label && (
                  <span className="ml-1 inline-block animate-pulse">→</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

const ChatbotInterface = ({ isOpen, onClose }: ChatbotInterfaceProps) => {
  // Use lazy initialization for initial state to avoid creating objects on every render
  const [messages, setMessages] = useState<Message[]>(() => [{
    id: 1,
    text: "Hello! I'm your YKFA assistant. How can I help you today?",
    isBot: true,
    timestamp: new Date()
  }]);
  const [inputMessage, setInputMessage] = useState('');
  const [showPrompts, setShowPrompts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Track component mount state to prevent memory leaks
  const isMountedRef = useRef(true);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Quick prompts for users to select
  const quickPrompts: QuickPrompt[] = [
    { 
      label: "Programs", 
      value: "What programs do you offer?", 
      icon: <Dumbbell className="w-3 h-3" /> 
    },
    { 
      label: "Location", 
      value: "Where are you located?", 
      icon: <MapPin className="w-3 h-3" /> 
    },
    { 
      label: "Schedule", 
      value: "What are your class timings?", 
      icon: <Calendar className="w-3 h-3" /> 
    },
    { 
      label: "Membership", 
      value: "Tell me about membership options", 
      icon: <CreditCard className="w-3 h-3" /> 
    },
    { 
      label: "Blog & About", 
      value: "Tell me about YKFA and your blog", 
      icon: <Info className="w-3 h-3" /> 
    },
    { 
      label: "Gallery", 
      value: "Show me some photos", 
      icon: <Image className="w-3 h-3" /> 
    },
  ];

  // Knowledge base for the chatbot
  const knowledgeBase: KnowledgeBase[] = [
    // Location information
    {
      keywords: ["location", "address", "where", "place", "situated", "find you", "reach", "directions"],
      response: "We're located at Y&Y Arcade, Vp Marakkar Road, Edappally Po, Kochi 682024. Our academy is easily accessible with ample parking space.",
      actions: [
        { 
          label: "View on Map", 
          value: "map", 
          icon: <MapPin className="w-4 h-4" />,
          path: "/contact" 
        },
        { 
          label: "Contact Page", 
          value: "contact", 
          icon: <ExternalLink className="w-4 h-4" />,
          path: "/contact" 
        }
      ]
    },
    // Hours of operation
    {
      keywords: ["hours", "timings", "open", "close", "schedule", "when", "timing", "class", "classes", "time"],
      response: "We're open Monday through Saturday from 6:00 AM to 10:00 PM. We have different class schedules for MMA, Karate, and Group Fitness programs. Our gym-only members can access the facilities during all operational hours.",
      actions: [
        { 
          label: "View Schedule", 
          value: "schedule", 
          icon: <Calendar className="w-4 h-4" />,
          path: "/schedule" 
        }
      ]
    },
    // About YKFA
    {
      keywords: ["about", "history", "ykfa", "academy", "yaseen", "story", "background", "start"],
      response: "Yaseen's Kickboxing and Fitness Academy (YKFA) was founded by Master Yaseen, a passionate martial artist with over 15 years of experience. Our academy offers a range of martial arts and fitness programs designed to cater to all ages and skill levels. At YKFA, we believe in developing not just physical strength, but also mental discipline, self-confidence, and respect. You can also check out our blog for martial arts tips and insights.",
      actions: [
        { 
          label: "Blogs & About", 
          value: "about", 
          icon: <Info className="w-4 h-4" />,
          path: "/about" 
        }
      ]
    },
    // Blogs and articles
    {
      keywords: ["blog", "article", "post", "read", "martial arts blog", "techniques", "tips", "bjj", "muay thai", "knowledge"],
      response: "We have a knowledge hub with expert articles on various martial arts disciplines including BJJ, Muay Thai, Karate, Kickboxing, and more. Our blog contains detailed information about techniques, benefits, and insights from our experienced instructors.",
      actions: [
        { 
          label: "Read Blog", 
          value: "blog", 
          icon: <ExternalLink className="w-4 h-4" />,
          path: "/about" 
        }
      ]
    },
    // Program information
    {
      keywords: ["program", "classes", "training", "offer", "teach", "course", "learn", "mma", "karate", "fitness", "workout"],
      response: "We offer a variety of programs including MMA (Mixed Martial Arts), Karate, Group Fitness, and Gym-Only memberships. Our MMA program covers boxing, kickboxing, and grappling techniques. We also offer personal training for those seeking more individualized attention.",
      actions: [
        { 
          label: "View Programs", 
          value: "programs", 
          icon: <Dumbbell className="w-4 h-4" />,
          path: "/membership" 
        }
      ]
    },
    // Membership and pricing
    {
      keywords: ["membership", "pricing", "cost", "fee", "price", "package", "join", "subscription", "payment", "monthly", "quarterly", "half-yearly", "annual"],
      response: "We offer various membership options including monthly, quarterly, half-yearly, and annual plans. Our monthly plans start at ₹1,000 for Karate, ₹2,500 for MMA-Only, Group Fitness, or Gym-Only, and ₹3,500 for our comprehensive MMA+GYM package. For quarterly, half-yearly, and annual plans, we offer significant discounts - save up to 28% on quarterly, 34% on half-yearly, and 50% on annual plans.",
      actions: [
        { 
          label: "Membership Details", 
          value: "membership", 
          icon: <CreditCard className="w-4 h-4" />,
          path: "/membership" 
        }
      ]
    },
    // Gallery/Photos
    {
      keywords: ["gallery", "photos", "pictures", "images", "videos", "see", "look", "visual", "photo", "image", "video"],
      response: "We have an extensive gallery showcasing our training facilities, classes, and events. You can browse through images of our MMA training, Karate classes, and fitness programs to get a feel for our academy environment.",
      actions: [
        { 
          label: "View Gallery", 
          value: "gallery", 
          icon: <Image className="w-4 h-4" />,
          path: "/programs" 
        }
      ]
    },
    // Trainers/Instructors
    {
      keywords: ["trainer", "instructor", "coach", "sensei", "master", "teacher", "expert", "professional", "staff"],
      response: "Our academy is led by Master Yaseen, who has over 15 years of martial arts experience. We have 5+ expert trainers specializing in different disciplines including MMA, Karate, and fitness training. All our instructors are certified professionals dedicated to helping you achieve your fitness and martial arts goals.",
      actions: [
        { 
          label: "About Team", 
          value: "team", 
          icon: <Users className="w-4 h-4" />,
          path: "/about" 
        }
      ]
    },
    // MMA specific
    {
      keywords: ["mma", "mixed martial arts", "boxing", "kickboxing", "grappling", "bjj", "judo", "wrestling"],
      response: "Our MMA program combines various martial arts disciplines including Boxing, Kickboxing, Muay Thai, Wrestling, Judo, and Brazilian Jiu-Jitsu (BJJ). We offer both technical training and sparring sessions, along with strength and conditioning, HIIT and cardio sessions. Classes are available 3 times per week, with separate batches for beginners and advanced practitioners.",
      actions: [
        { 
          label: "MMA Program", 
          value: "mma", 
          icon: <Dumbbell className="w-4 h-4" />,
          path: "/membership" 
        }
      ]
    },
    // Karate specific
    {
      keywords: ["karate", "kata", "kumite", "belt", "traditional", "martial art"],
      response: "Our Karate program focuses on traditional techniques with a belt progression and certification system. Classes include kata (forms), kumite (sparring), and self-defense applications. We offer 2 classes per week, and the program emphasizes both physical development and character building. Monthly membership for Karate is ₹1,000.",
      actions: [
        { 
          label: "Karate Program", 
          value: "karate", 
          icon: <Dumbbell className="w-4 h-4" />,
          path: "/membership" 
        }
      ]
    },
    // Gym specific
    {
      keywords: ["gym", "weights", "equipment", "machines", "workout", "fitness center", "weight training"],
      response: "Our gym features modern equipment for both strength training and weight workouts. Members have access to free weights, machines, and dedicated workout areas. Gym-Only membership costs ₹2,500 per month, with quarterly, half-yearly, and annual plans offering significant savings.",
      actions: [
        { 
          label: "Gym Membership", 
          value: "gym", 
          icon: <Dumbbell className="w-4 h-4" />,
          path: "/membership" 
        }
      ]
    },
    // Group Fitness specific
    {
      keywords: ["group fitness", "group training", "cardio", "hiit", "strength", "class", "group workout"],
      response: "Our Group Fitness program includes high-energy sessions focusing on strength and endurance. We offer 2 days of cardio/HIIT and 4 days of strength training per week, plus a basic fitness assessment. Classes are available in multiple batches from 6:00 AM to 10:30 AM, including a special ladies batch.",
      actions: [
        { 
          label: "Group Fitness", 
          value: "group fitness", 
          icon: <Users className="w-4 h-4" />,
          path: "/membership" 
        }
      ]
    },
    // Personal Training
    {
      keywords: ["personal training", "personal trainer", "one on one", "individual", "private session", "pt"],
      response: "Our Personal Training program offers one-on-one coaching designed specifically for your goals, body type, and preferences. The premium service costs ₹8,000 per month and provides accelerated results with customized training plans.",
      actions: [
        { 
          label: "Personal Training", 
          value: "personal training", 
          icon: <Users className="w-4 h-4" />,
          path: "/membership" 
        }
      ]
    },
    // Contact information
    {
      keywords: ["contact", "phone", "email", "call", "message", "get in touch", "reach out", "whatsapp"],
      response: "You can contact us at +91 7736488858 or email us at yaseenkfa@gmail.com. You can also visit our academy at Y&Y Arcade, Vp Marakkar Road, Edappally Po, Kochi 682024 or use the contact form on our website.",
      actions: [
        { 
          label: "Contact Us", 
          value: "contact", 
          icon: <ExternalLink className="w-4 h-4" />,
          path: "/contact" 
        }
      ]
    },
    // Trial class
    {
      keywords: ["trial", "free class", "try", "demo", "first time", "beginner", "start", "testing"],
      response: "We offer free trial classes for all our programs. This allows you to experience our training methods and meet our instructors before committing to a membership. You can book a trial class through our website or by contacting us directly.",
      actions: [
        { 
          label: "Book Trial", 
          value: "trial", 
          icon: <Calendar className="w-4 h-4" />,
          path: "/contact" 
        }
      ]
    },
    // Greetings and basic interactions
    {
      keywords: ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening", "howdy"],
      response: "Hello there! I'm your YKFA assistant. How can I help you today? Feel free to ask about our programs, schedule, membership options, or anything else you'd like to know about Yaseen's Kickboxing and Fitness Academy.",
    },
    // Farewell
    {
      keywords: ["bye", "goodbye", "see you", "farewell", "later", "cya", "take care"],
      response: "Thank you for chatting with me! If you have any more questions, feel free to ask anytime. We hope to see you at YKFA soon!",
    },
    // Thanks
    {
      keywords: ["thanks", "thank you", "appreciate", "helpful", "great"],
      response: "You're welcome! I'm happy to help with any other questions you might have about YKFA. Is there anything else you'd like to know?",
    },
    // Fallback
    {
      keywords: [""],
      response: "I'm not sure I understand. Could you please rephrase your question? I'd be happy to help with information about our programs, membership options, schedule, location, or anything else related to YKFA.",
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset prompts visibility when reopening the chat
  useEffect(() => {
    if (isOpen) {
      // If there's only the welcome message, show prompts
      if (messages.length <= 1) {
        setShowPrompts(true);
      }
    }
  }, [isOpen, messages.length]);

  // Handle mobile keyboard visibility - optimized with passive listeners
  useEffect(() => {
    // Use a debounced version of the resize handler to reduce processing
    let resizeTimeout: NodeJS.Timeout | null = null;
    
    const handleResize = () => {
      // Cancel any pending resize handler
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      
      // Debounce the resize handling to reduce processing
      resizeTimeout = setTimeout(() => {
        if (!isMountedRef.current) return;
        
        if (window.visualViewport) {
          const isKeyboard = window.visualViewport.height < window.innerHeight;
          setIsKeyboardVisible(isKeyboard);
        }
        resizeTimeout = null;
      }, 100); // 100ms debounce
    };

    if (window.visualViewport) {
      // Use passive listeners to improve performance
      window.visualViewport.addEventListener('resize', handleResize, { passive: true });
      window.visualViewport.addEventListener('scroll', handleResize, { passive: true });
    }

    return () => {
      // Clean up event listeners and timeouts
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
        window.visualViewport.removeEventListener('scroll', handleResize);
      }
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      // Clean up any remaining timeouts when component unmounts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      onClose();
      setIsClosing(false);
      timeoutRef.current = null;
    }, 300);
  };

  const handleRefresh = () => {
    // Reset chat to initial state
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your YKFA assistant. How can I help you today?",
        isBot: true,
        timestamp: new Date()
      }
    ]);
    setShowPrompts(true);
    setInputMessage('');
  };

  // Function to match user message with knowledge base using fuzzy matching
  const getBotResponse = (userMessage: string): { text: string; actions?: ChatAction[] } => {
    // Convert to lowercase for easier matching
    const userMessageLower = userMessage.toLowerCase();
    
    // Default response if no match is found
    let matchedResponse: { text: string; actions?: ChatAction[] } = {
      text: "I'm not sure I understand. Could you rephrase your question? I can help with information about our programs, membership options, schedule, location, or anything else related to YKFA."
    };
    
    // Score for the best match
    let bestMatchScore = 0;
    
    // Check each knowledge base entry
    knowledgeBase.forEach(entry => {
      // Calculate match score based on keyword presence
      let matchScore = 0;
      
      entry.keywords.forEach(keyword => {
        // Skip empty keywords (used for fallback)
        if (!keyword) return;
        
        // Simple fuzzy matching - check if keyword is contained in user message
        if (userMessageLower.includes(keyword.toLowerCase())) {
          // Longer keywords get higher scores
          matchScore += keyword.length;
        }
      });
      
      // Update response if this is the best match so far
      if (matchScore > bestMatchScore) {
        bestMatchScore = matchScore;
        matchedResponse = {
          text: entry.response,
          actions: entry.actions
        };
      }
    });
    
    // If no good match, try more lenient matching with individual words
    if (bestMatchScore === 0) {
      const userWords = userMessageLower.split(/\s+/);
      
      knowledgeBase.forEach(entry => {
        let matchScore = 0;
        
        entry.keywords.forEach(keyword => {
          if (!keyword) return;
          
          const keywordLower = keyword.toLowerCase();
          userWords.forEach(word => {
            if (word.length > 3 && (keywordLower.includes(word) || word.includes(keywordLower))) {
              matchScore += 1;
            }
          });
        });
        
        if (matchScore > bestMatchScore) {
          bestMatchScore = matchScore;
          matchedResponse = {
            text: entry.response,
            actions: entry.actions
          };
        }
      });
    }
    
    return matchedResponse;
  };

  // Handle form submission - optimized with isMountedRef check
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // Hide prompts after first user message
    setShowPrompts(false);
    
    // Set typing indicator
    setIsTyping(true);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Get bot response after a delay to simulate typing
    timeoutRef.current = setTimeout(() => {
      // Prevent state updates if component unmounted
      if (!isMountedRef.current) return;
      
      const response = getBotResponse(userMessage.text);
      
      const botMessage: Message = {
        id: messages.length + 2,
        text: response.text,
        isBot: true,
        timestamp: new Date(),
        actions: response.actions
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      timeoutRef.current = null;
    }, Math.min(1000, userMessage.text.length * 50)); // Typing delay based on response length
  };

  // Handle quick prompt selection
  const handleQuickPrompt = (prompt: QuickPrompt) => {
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: prompt.value,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Hide prompts after selection
    setShowPrompts(false);
    
    // Set typing indicator
    setIsTyping(true);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Get bot response after a delay to simulate typing
    timeoutRef.current = setTimeout(() => {
      const response = getBotResponse(prompt.value);
      
      const botMessage: Message = {
        id: messages.length + 2,
        text: response.text,
        isBot: true,
        timestamp: new Date(),
        actions: response.actions
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      timeoutRef.current = null;
    }, 800);
  };

  // ChatMessage component handles actions internally to reduce component coupling
  // This improves memory usage by eliminating unnecessary function references

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div 
        className={`absolute right-2 sm:right-4 w-[calc(100%-16px)] sm:w-[380px] max-w-[380px] pointer-events-auto transition-all duration-300
          ${isKeyboardVisible 
            ? 'bottom-[var(--keyboard-height,0px)]' 
            : 'bottom-20 sm:bottom-24'}`}
      >
        <div 
          className={`bg-dark-800/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 transform origin-bottom-right
            ${isClosing 
              ? 'scale-95 opacity-0' 
              : 'scale-100 opacity-100 animate-apple-pop'}`}
          style={{
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
            background: 'linear-gradient(145deg, rgba(30, 30, 35, 0.8), rgba(15, 15, 20, 0.9))'
          }}
        >
          {/* Header */}
          <div className="p-3 sm:p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-400/10 to-amber-500/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-amber-400/30 to-amber-600/30 flex items-center justify-center border border-amber-400/20 shadow-inner shadow-amber-400/5">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-400">YKFA Assistant</h3>
                <p className="text-[10px] sm:text-xs text-gray-400">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <button 
                onClick={handleRefresh}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400/10 to-amber-600/10 hover:from-amber-400/20 hover:to-amber-600/20 transition-all duration-300 border border-amber-400/20 backdrop-blur-sm transform hover:scale-105 shadow-md"
                title="Refresh chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                </svg>
              </button>
              <button 
                onClick={handleClose}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 transition-all duration-300 border border-white/10 backdrop-blur-sm transform hover:scale-105 shadow-md"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Messages - Using memoized ChatMessage component for better memory efficiency */}
          <div className="h-[300px] sm:h-[400px] overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {messages.map((message) => (
              <div key={message.id}>
                <ChatMessage message={message} />
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-dark-700/60 border border-white/10 p-2.5 sm:p-3 rounded-2xl backdrop-blur-sm shadow-lg">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-400/50 animate-pulse delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-400/50 animate-pulse delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-400/50 animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Quick prompts */}
            {showPrompts && !isTyping && (
              <div className="bg-dark-700/40 backdrop-blur-lg border border-white/10 rounded-xl p-3 shadow-lg" 
                style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.05) inset' }}>
                <p className="text-xs text-gray-400 mb-2">Quick help:</p>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-dark-700/70 to-dark-600/70 
                               hover:from-dark-600/70 hover:to-dark-500/70 text-white rounded-full text-[10px] 
                               transition-all duration-300 border border-white/10 transform hover:scale-105 shadow-sm"
                    >
                      {prompt.icon}
                      <span>{prompt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-white/10 bg-gradient-to-b from-dark-700/30 to-dark-700/70 backdrop-blur-md">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-dark-900/60 border border-white/15 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all duration-300 backdrop-blur-sm shadow-inner"
              />
              <button
                type="submit"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isTyping}
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default memo(ChatbotInterface); 