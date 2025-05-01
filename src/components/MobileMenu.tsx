import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Home, Info, Dumbbell, Users, CreditCard, Phone, ShoppingCart } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

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
    let maxHeight = '100%'; // No need for max-height with compact design
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

  if (!isOpen) return null;

  // Use portal to render outside the component hierarchy
  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 99999,
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        ref={menuRef}
        style={{
          width: styles.width,
          maxWidth: styles.maxWidth,
          padding: styles.padding,
          backgroundColor: 'rgba(28, 28, 32, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: styles.borderRadius,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          marginTop: 0,
          marginBottom: 0,
          marginLeft: 'auto',
          marginRight: 'auto',
          animation: 'scaleIn 0.3s ease-out',
          position: 'relative',
          isolation: 'isolate',
          overflowY: 'visible' // Ensure no scrollbars appear
        }}
      >
        {/* Golden gradient blur elements */}
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
            opacity: 0.6
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
            opacity: 0.5
          }}
        />

        <div
          style={{
            marginBottom: '10px', // Reduced from 16px
            textAlign: 'center',
            paddingBottom: screenSize.height < 600 ? '8px' : '10px', // Reduced
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            width: '100%'
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

        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: screenSize.height < 600 ? '3px' : '6px', // Reduced
            width: '100%',
            marginBottom: screenSize.height < 600 ? '8px' : '12px' // Reduced
          }}
        >
          {/* Only show essential links to make menu more compact */}
          <Link
            to="/"
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
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}
            onClick={onClose}
          >
            <Home size={screenSize.width < 350 ? 12 : 14} style={{ color: '#f59e0b' }} />
            <span>Home</span>
          </Link>
          <Link
            to="/programs"
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
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}
            onClick={onClose}
          >
            <Dumbbell size={screenSize.width < 350 ? 12 : 14} style={{ color: '#f59e0b' }} />
            <span>Programs</span>
          </Link>
          <Link
            to="/store"
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
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}
            onClick={onClose}
          >
            <ShoppingCart size={screenSize.width < 350 ? 12 : 14} style={{ color: '#f59e0b' }} />
            <span>Store</span>
          </Link>
          <Link
            to="/instructors"
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
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}
            onClick={onClose}
          >
            <Users size={screenSize.width < 350 ? 12 : 14} style={{ color: '#f59e0b' }} />
            <span>Instructors</span>
          </Link>
          <Link
            to="/membership"
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
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}
            onClick={onClose}
          >
            <CreditCard size={screenSize.width < 350 ? 12 : 14} style={{ color: '#f59e0b' }} />
            <span>Membership</span>
          </Link>
          <Link
            to="/contact"
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
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}
            onClick={onClose}
          >
            <Phone size={screenSize.width < 350 ? 12 : 14} style={{ color: '#f59e0b' }} />
            <span>Contact</span>
          </Link>
        </nav>

        <div
          style={{
            width: '100%',
            paddingTop: screenSize.height < 600 ? '8px' : '10px', // Reduced
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <Link
            to="/membership"
            style={{
              display: 'block',
              width: '100%',
              padding: screenSize.height < 600 ? '8px' : '12px', // Reduced
              background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
              color: '#151515',
              fontSize: screenSize.width < 350 ? '13px' : '14px', // Reduced
              fontWeight: 'bold',
              textAlign: 'center',
              borderRadius: '8px', // Reduced
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.25)',
              border: '1px solid rgba(251, 191, 36, 0.5)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={onClose}
          >
            Join Now
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MobileMenu; 