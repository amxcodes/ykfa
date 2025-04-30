import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

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
      }}
    >
      <div
        ref={menuRef}
        style={{
          width: '240px',
          padding: '16px',
          backgroundColor: 'rgba(35, 35, 35, 0.95)',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginTop: 0,
          marginBottom: 0,
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        <div
          style={{
            marginBottom: '12px',
            textAlign: 'center',
            paddingBottom: '8px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            width: '100%'
          }}
        >
          <span
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: 'white'
            }}
          >
            <span style={{ color: '#f59e0b' }}>YKFA</span> Menu
          </span>
        </div>

        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            width: '100%',
            marginBottom: '12px'
          }}
        >
          <a
            href="/"
            style={{
              display: 'block',
              padding: '7px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              borderRadius: '6px',
              fontSize: '12px',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            onClick={(e) => { e.preventDefault(); onClose(); }}
          >
            Home
          </a>
          <a
            href="/about"
            style={{
              display: 'block',
              padding: '7px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              borderRadius: '6px',
              fontSize: '12px',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            onClick={(e) => { e.preventDefault(); onClose(); }}
          >
            About
          </a>
          <a
            href="/programs"
            style={{
              display: 'block',
              padding: '7px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              borderRadius: '6px',
              fontSize: '12px',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            onClick={(e) => { e.preventDefault(); onClose(); }}
          >
            Programs
          </a>
          <a
            href="/instructors"
            style={{
              display: 'block',
              padding: '7px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              borderRadius: '6px',
              fontSize: '12px',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            onClick={(e) => { e.preventDefault(); onClose(); }}
          >
            Instructors
          </a>
          <a
            href="/membership"
            style={{
              display: 'block',
              padding: '7px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              borderRadius: '6px',
              fontSize: '12px',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            onClick={(e) => { e.preventDefault(); onClose(); }}
          >
            Membership
          </a>
          <a
            href="/contact"
            style={{
              display: 'block',
              padding: '7px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              borderRadius: '6px',
              fontSize: '12px',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            onClick={(e) => { e.preventDefault(); onClose(); }}
          >
            Contact
          </a>
        </nav>

        <div
          style={{
            width: '100%',
            paddingTop: '8px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Link
            to="/contact"
            style={{
              display: 'block',
              width: '100%',
              padding: '8px',
              background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
              color: 'black',
              fontSize: '12px',
              fontWeight: 'bold',
              textAlign: 'center',
              borderRadius: '6px',
              textDecoration: 'none'
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