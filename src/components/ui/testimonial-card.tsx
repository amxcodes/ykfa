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
    if (position === "front") return "0%";
    if (position === "middle") return isMobile ? "18%" : "33%";
    return isMobile ? "36%" : "66%";
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
      drag={true}
      dragElastic={0.35}
      dragListener={isFront}
      dragConstraints={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      onDragStart={(e) => {
        dragRef.current = e.clientX;
      }}
      onDragEnd={(e) => {
        if (dragRef.current - e.clientX > 150) {
          handleShuffle();
        }
        dragRef.current = 0;
      }}
      transition={{ duration: 0.35 }}
      className={`absolute left-0 top-0 grid min-h-[400px] sm:min-h-[450px] w-[280px] sm:w-[320px] md:w-[350px] select-none place-content-center space-y-4 sm:space-y-6 rounded-2xl border border-amber-400/10 bg-dark-800/30 p-4 sm:p-6 md:p-8 shadow-xl backdrop-blur-md ${
        isFront ? "cursor-grab active:cursor-grabbing" : ""
      }`}
    >
      <img
        src={imageUrl}
        alt={`${author}`}
        className="pointer-events-none mx-auto h-20 w-20 sm:h-24 sm:w-24 rounded-full border-2 border-amber-400/20 bg-dark-700 object-cover"
      />
      <div className="flex flex-col items-center justify-center gap-2 sm:gap-3">
        <p className="text-center text-base sm:text-lg italic text-gray-300">"{testimonial}"</p>
        <p className="text-center text-xs sm:text-sm font-medium text-amber-400">{author}</p>
      </div>
    </motion.div>
  );
}; 