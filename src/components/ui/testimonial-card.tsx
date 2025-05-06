"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TestimonialCardProps {
  handleShuffle: () => void;
  testimonial: string;
  position: "front" | "middle" | "back";
  id: number;
  author: string;
  avatar?: string; // Prop for avatar type or image url
}

// Standard user avatar SVG
const UserAvatarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-amber-400"
  >
    <circle cx="12" cy="8.5" r="4" fill="currentColor" className="opacity-30" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 20a7.5 7.5 0 0115 0"
      className="opacity-60"
    />
    <circle cx="12" cy="8.5" r="4" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export function TestimonialCard({ 
  handleShuffle, 
  testimonial, 
  position, 
  author}: TestimonialCardProps) {
  const dragRef = React.useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Render avatar: always show the standard user avatar icon
  const renderAvatar = () => (
    <div className="pointer-events-none mx-auto h-12 w-12 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full flex items-center justify-center bg-amber-500/10 border-2 border-amber-400/30">
      <UserAvatarIcon />
    </div>
  );

  // Calculate position based on mobile or desktop view
  const getXPosition = () => {
    if (position === "front") return "-12.5%";
    if (position === "middle") return isMobile ? "0%" : "12.5%";
    return isMobile ? "12.5%" : "37.5%";
  };

  // Calculate scale based on position
  const getScale = () => {
    if (position === "front") return 1;
    if (position === "middle") return 0.95;
    return 0.9;
  };

  // Calculate opacity based on position
  const getOpacity = () => {
    if (position === "front") return 1;
    if (position === "middle") return 0.9;
    return 0.8;
  };

  // Calculate drag constraints based on position
  const getDragConstraints = () => {
    const baseConstraints = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    };

    // Add position-specific constraints
    if (position === "middle") {
      return {
        ...baseConstraints,
        left: -100,
        right: 100
      };
    }
    if (position === "back") {
      return {
        ...baseConstraints,
        left: -50,
        right: 50
      };
    }

    return baseConstraints;
  };

  return (
    <motion.div
      style={{
        zIndex: position === "front" ? "2" : position === "middle" ? "1" : "0"
      }}
      animate={{
        rotate: position === "front" ? "-6deg" : position === "middle" ? "0deg" : "6deg",
        x: getXPosition(),
        scale: getScale(),
        opacity: getOpacity()
      }}
      drag
      dragElastic={0.35}
      dragListener={true}
      dragConstraints={getDragConstraints()}
      onDragStart={(e: any) => {
        // Fix type issue with clientX
        if (e.clientX) {
          dragRef.current = e.clientX;
        } else if (e.touches && e.touches[0]) {
          dragRef.current = e.touches[0].clientX;
        }
      }}
      onDragEnd={(e: any) => {
        // Fix type issue with clientX
        const currentX = e.clientX || (e.changedTouches && e.changedTouches[0]?.clientX) || 0;
        if (dragRef.current - currentX > 150) {
          handleShuffle();
        }
        dragRef.current = 0;
      }}
      transition={{ 
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        scale: { duration: 0.3 },
        opacity: { duration: 0.3 }
      }}
      className={`absolute left-0 top-0 grid min-h-[300px] sm:min-h-[400px] md:min-h-[450px] w-[200px] sm:w-[320px] md:w-[350px] select-none place-content-center space-y-2 sm:space-y-4 md:space-y-6 rounded-2xl border border-amber-400/10 bg-dark-800/30 p-2 sm:p-5 md:p-8 shadow-xl backdrop-blur-md cursor-grab active:cursor-grabbing`}
    >
      {renderAvatar()}
      <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 md:gap-3">
        <p className="text-center text-xs sm:text-sm md:text-lg italic text-gray-300 line-clamp-4 sm:line-clamp-none">"{testimonial}"</p>
        <p className="text-center text-[10px] sm:text-xs md:text-sm font-medium text-amber-400">{author}</p>
      </div>
    </motion.div>
  );
} 