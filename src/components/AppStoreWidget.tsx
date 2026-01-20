import { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface AppStoreWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef?: React.RefObject<HTMLAnchorElement>;
}

const AppStoreWidget = ({ isOpen, onClose, buttonRef }: AppStoreWidgetProps) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const defaultButtonRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);

  // Use provided buttonRef or fallback to default position
  const actualButtonRef = buttonRef || defaultButtonRef;

  // Calculate position based on button location
  useEffect(() => {
    if (isOpen) {
      if (actualButtonRef.current) {
        const rect = actualButtonRef.current.getBoundingClientRect();
        const navbarHeight = 70; // Approximate navbar height

        setPosition({
          // Align with the bottom of the navbar plus additional offset
          top: navbarHeight + 20, // Added 20px to push it down
          right: window.innerWidth - rect.right
        });
      } else {
        // Fallback position if there's no button reference
        setPosition({
          top: 90, // Increased from 70 to push it down
          right: 20
        });
      }

      // Show the widget container first
      setIsVisible(true);

      // Then reveal the content with a slight delay
      setTimeout(() => {
        setIsContentVisible(true);
      }, 100);
    } else {
      // Hide content first
      setIsContentVisible(false);

      // Then hide container after animation completes
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }
  }, [isOpen, actualButtonRef]);

  // Close widget when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        widgetRef.current &&
        !widgetRef.current.contains(event.target as Node) &&
        (!actualButtonRef.current || !actualButtonRef.current.contains(event.target as Node))
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, actualButtonRef]);

  // Close widget on escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
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

  if (!isOpen && !isVisible) return null;

  return (
    <>
      {/* Widget container - Memory efficient version */}
      <div
        ref={widgetRef}
        className="fixed z-[200] w-72 rounded-xl overflow-hidden"
        style={{
          top: `${position.top}px`,
          right: `${position.right}px`,
          transform: isContentVisible
            ? 'translateY(0) scale(1)'
            : 'translateY(-20px) scale(0.98)',
          opacity: isContentVisible ? 1 : 0,
          boxShadow: isContentVisible
            ? '0 8px 15px -5px rgba(0, 0, 0, 0.25), 0 0 5px rgba(255, 255, 255, 0.05)'
            : '0 0 0 rgba(0, 0, 0, 0)',
          transition: 'transform 0.4s ease, opacity 0.3s ease, box-shadow 0.4s ease'
        }}
      >
        {/* Widget inner with solid background instead of blur */}
        <div className="relative glassmorphic h-full">
          {/* Top light effect - reduced opacity */}
          <div
            className="absolute inset-x-0 top-0 h-20 pointer-events-none transition-opacity duration-500 delay-300"
            style={{
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.02), transparent)',
              opacity: isContentVisible ? 1 : 0
            }}
          />

          {/* Container for all content */}
          <div className="relative">
            {/* Header */}
            <div
              className="p-4 flex gap-3 border-b border-white/10"
              style={{
                transform: isContentVisible ? 'translateY(0)' : 'translateY(-10px)',
                opacity: isContentVisible ? 1 : 0,
                transition: 'transform 0.5s ease, opacity 0.5s ease',
                transitionDelay: '0.1s'
              }}
            >
              {/* App icon - static version */}
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shadow-lg flex-shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-600">
                  <img
                    src="/icons/dumbbell-small.svg"
                    alt="YKFA Warriors"
                    className="w-full h-full p-1.5"
                  />
                </div>
              </div>

              {/* App details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3
                    className="text-base font-bold text-white truncate"
                    style={{
                      transform: isContentVisible ? 'translateY(0)' : 'translateY(-5px)',
                      opacity: isContentVisible ? 1 : 0,
                      transition: 'transform 0.4s ease, opacity 0.4s ease',
                      transitionDelay: '0.2s'
                    }}
                  >
                    YKFA Warriors
                  </h3>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:rotate-90"
                  >
                    <X size={12} className="text-gray-300" />
                  </button>
                </div>
                <p
                  className="text-amber-400 text-xs"
                  style={{
                    transform: isContentVisible ? 'translateY(0)' : 'translateY(-5px)',
                    opacity: isContentVisible ? 1 : 0,
                    transition: 'transform 0.4s ease, opacity 0.4s ease',
                    transitionDelay: '0.25s'
                  }}
                >
                  YourDigitalLift
                </p>
              </div>
            </div>

            {/* Brief Description */}
            <div
              className="p-3 border-b border-white/10"
              style={{
                transform: isContentVisible ? 'translateY(0)' : 'translateY(10px)',
                opacity: isContentVisible ? 1 : 0,
                transition: 'transform 0.5s ease, opacity 0.5s ease',
                transitionDelay: '0.3s'
              }}
            >
              <p className="text-gray-300 text-xs leading-relaxed">
                Track exercise, diet, water intake, BMI, and connect with the YKFA community.
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className="p-3 flex gap-3"
              style={{
                transform: isContentVisible ? 'translateY(0)' : 'translateY(10px)',
                opacity: isContentVisible ? 1 : 0,
                transition: 'transform 0.5s ease, opacity 0.5s ease',
                transitionDelay: '0.35s'
              }}
            >
              <div className="widget-button-container flex-1">
                <a
                  href="https://play.google.com/store/apps/details?id=com.ydl.yaseensykfawarriorss&pcampaignid=web_share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="widget-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                >
                  <div className="widget-button-bg"></div>
                  <div className="widget-button-content">
                    <img src="/icons/google-play.svg" alt="Google Play" className="w-4 h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">Google Play</span>
                  </div>
                </a>
              </div>

              <div className="widget-button-container flex-1">
                <a
                  href="https://apps.apple.com/in/app/yaseens-ykfa-warriors/id6742874298"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="widget-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                >
                  <div className="widget-button-bg"></div>
                  <div className="widget-button-content">
                    <img src="/icons/apple.svg" alt="App Store" className="w-4 h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">App Store</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Add custom styles - simplified for better performance
const style = document.createElement('style');
style.textContent = `
  /* Button styles - simplified */
  .widget-button-container {
    position: relative;
    width: 100%;
    overflow: hidden;
    border-radius: 8px;
    z-index: 1;
  }
  
  .widget-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    padding: 8px 12px;
    position: relative;
    text-align: center;
    color: #000;
    font-weight: 500;
    font-size: 14px;
    overflow: hidden;
    z-index: 1;
    border-radius: 8px;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .widget-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px -5px rgba(245, 158, 11, 0.3);
  }
  
  .widget-button:active {
    transform: translateY(0);
  }
  
  .widget-button-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, #f59e0b, #fbbf24, #f59e0b);
    background-size: 200% 200%;
    z-index: -1;
  }
`;

document.head.appendChild(style);

export default AppStoreWidget; 