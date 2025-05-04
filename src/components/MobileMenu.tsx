import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Home, Dumbbell, Users, CreditCard, Phone, ShoppingCart } from 'lucide-react';

// Google Play Store SVG icon component
const PlayStoreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.609 1.814L13.792 12 3.609 22.186c-.181.181-.29.435-.29.71 0 .528.435.964.963.964.253 0 .477-.1.652-.261L15.147 12.964c.159-.158.256-.377.256-.619 0-.241-.097-.46-.256-.618L4.934 1.104A.957.957 0 004.282.844a.969.969 0 00-.963.962c0 .302.142.56.326.72l-.036-.712zm4.349.793l9.383 9.383L7.958 22.373c-.283.284-.284.722-.059 1.015.224.292.626.36.945.128l14.043-8.107c.246-.142.443-.38.443-.664 0-.282-.197-.522-.443-.664L8.86.583c-.315-.234-.714-.171-.947.121-.23.292-.228.727.045 1.014v.889z"></path>
  </svg>
);

// Apple App Store SVG icon component
const AppleStoreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42Zm2.52 7.44a4.51 4.51 0 0 1 2.16-3.81 4.66 4.66 0 0 0-3.66-2c-1.56-.16-3 .91-3.83.91s-2-.89-3.3-.87a4.92 4.92 0 0 0-4.14 2.53C2.93 12.45 4.24 17 6 19.47c.8 1.21 1.8 2.58 3.12 2.53s1.75-.82 3.28-.82 2 .82 3.3.79 2.22-1.23 3.06-2.45a11 11 0 0 0 1.38-2.85 4.41 4.41 0 0 1-2.68-4.04Z"></path>
  </svg>
);

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Handle visibility state
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 400); // Match this with the animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Track screen size changes
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Lock scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Close menu if clicked outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Calculate responsive dimensions
  const getContainerStyles = () => {
    const width = screenSize.width;
    const height = screenSize.height;
    
    // Base styles - making everything smaller
    let containerWidth = '75%';
    let maxWidth = '280px';
    let padding = '16px';
    let borderRadius = '14px';
    let fontSize = '14px';
    let maxHeight = '100%';
    let itemPadding = '10px 12px';
    
    // Small phones
    if (width < 350) {
      containerWidth = '85%';
      maxWidth = '250px';
      padding = '14px';
      borderRadius = '12px';
      fontSize = '13px';
      itemPadding = '8px 10px';
    }
    
    // Very small phones in landscape
    if (height < 500) {
      padding = '10px';
      itemPadding = '6px 8px';
    }
    
    // Larger phones
    if (width >= 400) {
      containerWidth = '70%';
      maxWidth = '300px';
    }
    
    return {
      width: containerWidth,
      maxWidth,
      padding,
      borderRadius,
      fontSize,
      maxHeight,
      itemPadding
    };
  };

  const styles = getContainerStyles();

  if (!isVisible) return null;

  // Use portal to render outside the component hierarchy
  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 99999,
        opacity: isOpen ? 1 : 0,
        transition: 'opacity 0.3s ease-out'
      }}
    >
      <div
        ref={menuRef}
        style={{
          width: styles.width,
          maxWidth: styles.maxWidth,
          padding: styles.padding,
          backgroundColor: 'rgba(28, 28, 32, 0.5)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: styles.borderRadius,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          marginTop: 0,
          marginBottom: 0,
          marginLeft: 'auto',
          marginRight: 'auto',
          position: 'relative',
          isolation: 'isolate',
          overflowY: 'visible',
          transformOrigin: 'center',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* Golden gradient blur elements with animation */}
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, rgba(251, 191, 36, 0) 70%)',
            borderRadius: '100%',
            filter: 'blur(20px)',
            zIndex: -1,
            opacity: 0,
            animation: 'fadeIn 0.6s ease-out forwards',
            animationDelay: '0.2s'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0) 70%)',
            borderRadius: '100%',
            filter: 'blur(25px)',
            zIndex: -1,
            opacity: 0,
            animation: 'fadeIn 0.6s ease-out forwards',
            animationDelay: '0.3s'
          }}
        />

        {/* Header with animation */}
        <div
          style={{
            marginBottom: '10px',
            textAlign: 'center',
            paddingBottom: screenSize.height < 600 ? '8px' : '10px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            width: '100%',
            opacity: 0,
            transform: 'translateY(-10px)',
            animation: 'fadeInUp 0.5s ease-out forwards',
            animationDelay: '0.2s'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: screenSize.width < 350 ? '8px' : '10px', // Reduced
              borderRadius: '10px', // Reduced from 12px
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.05))',
              marginBottom: screenSize.height < 600 ? '4px' : '6px', // Reduced
              boxShadow: '0 4px 12px rgba(251, 191, 36, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(251, 191, 36, 0.2)'
            }}
          >
            <img 
              src="/icons/dumbbell-small.svg" 
              alt="YKFA" 
              style={{
                width: screenSize.width < 350 ? '18px' : '20px', // Reduced
                height: screenSize.width < 350 ? '18px' : '20px', // Reduced
              }}
            />
          </div>
          <div>
            <span
              style={{
                fontSize: screenSize.width < 350 ? '14px' : '16px', // Reduced
                fontWeight: 'bold',
                color: 'white',
                letterSpacing: '0.5px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
              }}
            >
              <span style={{ 
                background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>YKFA</span>{' '}
              <span>Menu</span>
            </span>
          </div>
        </div>

        {/* Navigation with staggered animations */}
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: screenSize.height < 600 ? '3px' : '6px',
            width: '100%',
            marginBottom: screenSize.height < 600 ? '8px' : '12px'
          }}
        >
          {[
            { to: '/', icon: Home, label: 'Home' },
            { to: '/programs', icon: Dumbbell, label: 'Programs' },
            { to: '/store', icon: ShoppingCart, label: 'Store' },
            { to: '/instructors', icon: Users, label: 'Instructors' },
            { to: '/membership', icon: CreditCard, label: 'Membership' },
            { to: '/contact', icon: Phone, label: 'Contact' }
          ].map((item, index) => (
            <Link
              key={item.to}
              to={item.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: styles.itemPadding,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                borderRadius: '8px',
                fontSize: styles.fontSize,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                gap: '10px',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.03)',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                opacity: 0,
                transform: 'translateX(-20px)',
                animation: 'slideInRight 0.4s ease-out forwards',
                animationDelay: `${0.3 + index * 0.1}s`
              }}
              onClick={onClose}
            >
              <item.icon size={screenSize.width < 350 ? 12 : 14} style={{ color: '#f59e0b' }} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer with animation */}
        <div
          style={{
            width: '100%',
            paddingTop: screenSize.height < 600 ? '8px' : '10px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            opacity: 0,
            transform: 'translateY(10px)',
            animation: 'fadeInUp 0.5s ease-out forwards',
            animationDelay: '0.8s',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <a
            href="https://play.google.com/store/apps/details?id=com.ydl.yaseensykfawarriors&pcampaignid=web_share"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: screenSize.height < 600 ? '8px' : '12px',
              background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
              color: '#151515',
              fontSize: screenSize.width < 350 ? '13px' : '14px',
              fontWeight: 'bold',
              textAlign: 'center',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.25)',
              border: '1px solid rgba(251, 191, 36, 0.5)',
              position: 'relative',
              overflow: 'hidden',
              gap: '8px'
            }}
            onClick={onClose}
          >
            <PlayStoreIcon />
            <span>Google Play</span>
          </a>
          <a
            href="https://apps.apple.com/in/app/yaseens-ykfa-warriors/id6742874298"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: screenSize.height < 600 ? '8px' : '12px',
              background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
              color: '#151515',
              fontSize: screenSize.width < 350 ? '13px' : '14px',
              fontWeight: 'bold',
              textAlign: 'center',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.25)',
              border: '1px solid rgba(251, 191, 36, 0.5)',
              position: 'relative',
              overflow: 'hidden',
              gap: '8px'
            }}
            onClick={onClose}
          >
            <AppleStoreIcon />
            <span>App Store</span>
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Add these keyframes at the top of the file, after the imports
const keyframes = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

// Add the keyframes to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = keyframes;
document.head.appendChild(styleSheet);

export default MobileMenu; 