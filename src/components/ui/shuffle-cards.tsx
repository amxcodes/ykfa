import { useState, useEffect } from "react";
import { TestimonialCard } from "./testimonial-card";

// Fitness-related testimonials
const testimonials = [
  {
    id: 1,
    testimonial: "I've been training at YKFA for 6 months and the transformation is incredible. The instructors are world-class and the community is so supportive.",
    author: "Aisha K. - Member since 2022",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
  },
  {
    id: 2,
    testimonial: "The karate program at YKFA has helped my child develop discipline and confidence. I've seen massive improvements in focus at school too.", 
    author: "Michael T. - Parent of Junior Member",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
  },
  {
    id: 3,
    testimonial: "As a complete beginner to fitness, I was intimidated at first, but the trainers at YKFA made me feel welcome from day one. Now I can't imagine life without my training sessions!",
    author: "Sarah J. - Kickboxing Enthusiast",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=461&q=80"
  }
];

function ShuffleCards() {
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
  };

  return (
    <div className="flex justify-center items-center w-full overflow-visible">
      <div className={`relative min-h-[450px] w-full ${isMobile ? 'max-w-[300px]' : 'max-w-[350px] sm:max-w-[400px] md:max-w-[500px]'} py-6 sm:py-10`}>
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