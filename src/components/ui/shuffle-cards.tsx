import { useState, useEffect } from "react";
import { TestimonialCard } from "./testimonial-card";

// Fitness-related testimonials with Kerala names and Unsplash place avatars
const testimonials = [
  {
    id: 1,
    testimonial: "The MMA training at YKFA has transformed my life. I've gained so much confidence and discipline. Master Yaseen's teaching style makes complex techniques accessible to everyone.",
    author: "Arun Nair - Member since 2022",
    avatar: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=compress&fit=crop&w=200&q=80" // Place photo
  },
  {
    id: 2,
    testimonial: "My son has been attending the karate classes for a year now. The change in his focus and self-discipline is remarkable. The trainers here are excellent with children.", 
    author: "Lakshmi Menon - Parent of Junior Member",
    avatar: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=compress&fit=crop&w=200&q=80" // Place photo
  },
  {
    id: 3,
    testimonial: "I joined the group fitness classes to lose weight, but I gained so much more. The supportive community and expert guidance have kept me motivated throughout my fitness journey.",
    author: "Suresh Kurup - Fitness Enthusiast",
    avatar: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=compress&fit=crop&w=200&q=80" // Place photo
  }
];

interface ShuffleCardsProps {
  onSwipe?: () => void;
}

function ShuffleCards({ onSwipe }: ShuffleCardsProps) {
  const [positions, setPositions] = useState<("front" | "middle" | "back")[]>(["front", "middle", "back"]);
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

  const handleShuffle = () => {
    const newPositions = [...positions];
    newPositions.unshift(newPositions.pop() as "front" | "middle" | "back");
    setPositions(newPositions);
    // Call onSwipe callback when shuffle happens
    onSwipe?.();
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className={`relative min-h-[300px] sm:min-h-[400px] md:min-h-[450px] w-full ${isMobile ? 'max-w-[200px]' : 'max-w-[320px] md:max-w-[350px]'} py-4 sm:py-10`}>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            {...testimonial}
            handleShuffle={handleShuffle}
            position={positions[index]}
          />
        ))}
      </div>
    </div>
  );
}

export { ShuffleCards }; 