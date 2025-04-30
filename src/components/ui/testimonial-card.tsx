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
  image?: string; // Optional image URL
}

export function TestimonialCard({ 
  handleShuffle, 
  testimonial, 
  position, 
  id, 
  author,
  image 
}: TestimonialCardProps) {
  const dragRef = React.useRef(0);
  const isFront = position === "front";
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

  // Use provided image or fallback to avatar placeholder
  const imageUrl = image || `https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80`;

  // Calculate position based on mobile or desktop view
  const getXPosition = () => {
    if (position === "front") return "-12.5%";
    if (position === "middle") return isMobile ? "0%" : "12.5%";
    return isMobile ? "12.5%" : "37.5%";
  };

  return (
    <motion.div
      style={{
        zIndex: position === "front" ? "2" : position === "middle" ? "1" : "0"
      }}
      animate={{
        rotate: position === "front" ? "-6deg" : position === "middle" ? "0deg" : "6deg",
        x: getXPosition()
      }}
      drag={isFront}
      dragElastic={0.35}
      dragListener={isFront}
      dragConstraints={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      onDragStart={(e) => {
        if (isFront) {
          dragRef.current = e.clientX;
        }
      }}
      onDragEnd={(e) => {
        if (isFront && dragRef.current - e.clientX > 150) {
          handleShuffle();
        }
        dragRef.current = 0;
      }}
      transition={{ duration: 0.35 }}
      className={`absolute left-0 top-0 grid min-h-[300px] sm:min-h-[400px] md:min-h-[450px] w-[200px] sm:w-[320px] md:w-[350px] select-none place-content-center space-y-2 sm:space-y-4 md:space-y-6 rounded-2xl border border-amber-400/10 bg-dark-800/30 p-2 sm:p-5 md:p-8 shadow-xl backdrop-blur-md ${
        isFront ? "cursor-grab active:cursor-grabbing" : ""
      }`}
    >
      <img
        src={imageUrl}
        alt={`${author}`}
        className="pointer-events-none mx-auto h-12 w-12 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full border-2 border-amber-400/20 bg-dark-700 object-cover"
      />
      <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 md:gap-3">
        <p className="text-center text-xs sm:text-sm md:text-lg italic text-gray-300 line-clamp-4 sm:line-clamp-none">"{testimonial}"</p>
        <p className="text-center text-[10px] sm:text-xs md:text-sm font-medium text-amber-400">{author}</p>
      </div>
    </motion.div>
  );
}; 