import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatbotInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatbotInterface = ({ isOpen, onClose }: ChatbotInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your YKFA assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle mobile keyboard visibility
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const isKeyboard = window.visualViewport.height < window.innerHeight;
        setIsKeyboardVisible(isKeyboard);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
        window.visualViewport.removeEventListener('scroll', handleResize);
      }
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

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

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: "I'm here to help! However, I'm currently in demo mode. Please contact our staff for actual assistance.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

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
        >
          {/* Header */}
          <div className="p-3 sm:p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-400/10 to-amber-500/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-400/20 flex items-center justify-center">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">YKFA Assistant</h3>
                <p className="text-[10px] sm:text-xs text-gray-400">Online</p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-[300px] sm:h-[400px] overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] p-2.5 sm:p-3 rounded-2xl ${
                    message.isBot
                      ? 'bg-dark-700/50 border border-white/5'
                      : 'bg-amber-400 text-black'
                  }`}
                >
                  <p className="text-xs sm:text-sm leading-relaxed">{message.text}</p>
                  <p className="text-[9px] sm:text-[10px] mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-white/10 bg-dark-700/50">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-dark-800/50 border border-white/10 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-amber-400 text-black hover:bg-amber-500 transition-colors"
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

export default ChatbotInterface; 