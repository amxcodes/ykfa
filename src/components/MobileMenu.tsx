import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Home, Dumbbell, Users, CreditCard, Phone, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    
    // Base styles
    let containerWidth = '75%';
    let maxWidth = '300px';
    let borderRadius = '16px';
    let fontSize = '14px';
    let maxHeight = '100%';
    let itemPadding = '12px 16px';
    
    // Small phones
    if (width < 350) {
      containerWidth = '85%';
      maxWidth = '260px';
      borderRadius = '14px';
      fontSize = '13px';
      itemPadding = '10px 12px';
    }
    
    // Very small phones in landscape
    if (height < 500) {
      itemPadding = '8px 12px';
    }
    
    // Larger phones
    if (width >= 400) {
      containerWidth = '70%';
      maxWidth = '320px';
    }
    
    return {
      width: containerWidth,
      maxWidth,
      borderRadius,
      fontSize,
      maxHeight,
      itemPadding
    };
  };

  const styles = getContainerStyles();

  // Define navigation items
  const navigationItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/programs', icon: Dumbbell, label: 'Gallery' },
    { to: '/store', icon: ShoppingCart, label: 'Store' },
    { to: '/membership', icon: CreditCard, label: 'Membership' },
    { to: '/contact', icon: Phone, label: 'Contact' }
  ];

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 10, 
      transition: { 
        duration: 0.2 
      } 
    }
  };

  // Use portal to render outside the component hierarchy
  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-[999]"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose} />
          
          {/* Menu container */}
          <motion.div
            ref={menuRef}
            className="relative w-full z-10"
            style={{
              width: styles.width,
              maxWidth: styles.maxWidth
            }}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl opacity-60 pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl opacity-60 pointer-events-none"></div>
              
              {/* Header with logo */}
              <div className="p-5 border-b border-white/10">
                <div className="flex items-center justify-center gap-3">
                  {/* Logo container */}
                  <div className="relative w-10 h-10 flex items-center justify-center rounded-lg overflow-hidden bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg">
                    <span className="absolute inset-0 bg-gradient-to-br from-amber-300 to-amber-600 opacity-70"></span>
                    <img 
                      src="/icons/dumbbell-small.svg" 
                      alt="YKFA" 
                      className="w-10 h-10 relative z-10"
                      style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }}
                    />
                  </div>
                  
                  {/* Text content */}
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-bold font-spaceGrotesk tracking-wide">
                      Yaseen's <span className="text-amber-400">YKFA</span>
                    </span>
                    <span className="text-[10px] text-gray-400 -mt-1 tracking-wide">FITNESS & MARTIAL ARTS</span>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <motion.div 
                className="p-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="space-y-2">
                  {navigationItems.map((item) => (
                    <motion.div
                      key={item.to}
                      variants={itemVariants}
                    >
                      <Link
                        to={item.to}
                        className="flex items-center w-full gap-3 p-3 text-sm transition-all text-gray-200 hover:bg-white/10 rounded-xl group mb-1 border border-transparent hover:border-white/10 relative overflow-hidden"
                        onClick={onClose}
                      >
                        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10 relative z-10">
                          <item.icon size={14} className="text-amber-400" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-white group-hover:text-amber-300 font-medium transition-colors">{item.label}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* App Store Links */}
              <div className="p-4 border-t border-white/10 space-y-3">
                <motion.a
                  href="https://play.google.com/store/apps/details?id=com.ydl.yaseensykfawarriors&pcampaignid=web_share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full gap-2 bg-gradient-to-br from-amber-400 to-amber-500 text-black px-4 py-3 rounded-xl hover:shadow-lg transition-all border border-amber-300/30 font-medium"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <PlayStoreIcon />
                  <span>Download on Google Play</span>
                </motion.a>

                <motion.a
                  href="https://apps.apple.com/in/app/yaseens-ykfa-warriors/id6742874298"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-3 rounded-xl hover:bg-white/15 transition-all border border-white/10 font-medium"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AppleStoreIcon />
                  <span>Download on App Store</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default MobileMenu; 