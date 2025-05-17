import { ChevronRight, User, Award, AlignJustify, BookOpen, Heart, Clock, Mail, Phone, MapPin } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Moved tabs data outside the component for stability
const TABS_DATA = [
  { id: 'about', label: 'About Master Yaseen', icon: <User className="w-4 h-4" /> },
  { id: 'achievements', label: 'Achievements', icon: <Award className="w-4 h-4" /> },
  { id: 'mission', label: 'Our Mission', icon: <Heart className="w-4 h-4" /> },
  { id: 'history', label: 'Our History', icon: <Clock className="w-4 h-4" /> },
  { id: 'philosophy', label: 'Training Philosophy', icon: <BookOpen className="w-4 h-4" /> }
];

// Moved gallery images outside the component for stability
const GALLERY_IMAGES_DATA = [
  "https://i.postimg.cc/Cxr6mHh9/IMG-9857.jpg",
  "https://i.postimg.cc/JnVx2p9Y/IMG-9840.jpg",
  "https://i.postimg.cc/P50QC6rf/IMG-9847.jpg",
  "https://i.postimg.cc/dtx8fWCR/IMG-9853.jpg",
  "https://i.postimg.cc/GpkGHd5z/IMG-9860.jpg",
  "https://i.postimg.cc/5ytC7vNk/Screenshot-2025-05-07-010532.png"
];

const AboutUsPage = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [isVisible, setIsVisible] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<number[]>([]);
  
  // Set up intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            
            // Clear any existing timeouts
            timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
            timeoutsRef.current = [];
            
            // Add animation classes to all elements with "animate-me" class
            document.querySelectorAll('.animate-me').forEach((el, index) => {
              const timeoutId = window.setTimeout(() => {
                if (el instanceof HTMLElement) {
                  el.classList.add('animate-visible');
                }
              }, 150 * index); // Staggered delay
              timeoutsRef.current.push(timeoutId);
            });
            
            observer.disconnect(); // Stop observing once visible
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (pageRef.current) {
      observer.observe(pageRef.current);
    }
    
    return () => {
      observer.disconnect();
      // Clear any existing timeouts when component unmounts
      timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
      timeoutsRef.current = [];
    };
  }, []);

  // Add effect to handle tab changes
  useEffect(() => {
    // Reset animation classes when tab changes
    document.querySelectorAll('.animate-me').forEach(el => {
      if (el instanceof HTMLElement) {
        el.classList.remove('animate-visible');
      }
    });
    
    // Clear any existing timeouts
    timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutsRef.current = [];
    
    // Re-add animation classes with a small delay
    const outerTimeoutId = window.setTimeout(() => {
      document.querySelectorAll('.animate-me').forEach((el, index) => {
        const innerTimeoutId = window.setTimeout(() => {
          if (el instanceof HTMLElement) {
            el.classList.add('animate-visible');
          }
        }, 150 * index);
        timeoutsRef.current.push(innerTimeoutId);
      });
    }, 50);
    timeoutsRef.current.push(outerTimeoutId);
    
    return () => {
      // Clean up timeouts when effect re-runs
      timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
      timeoutsRef.current = [];
    };
  }, [activeTab]);

  return (
    <div ref={pageRef} className="min-h-screen bg-dark-900">
      {/* Hero section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-center bg-cover opacity-40"
            style={{ 
              backgroundImage: "url('https://i.postimg.cc/P50QC6rf/IMG-9847.jpg')",
              transform: isVisible ? 'scale(1)' : 'scale(1.1)',
              transition: 'transform 1.5s ease-out'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/3 -left-16 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        <div className="container relative z-10 px-4 sm:px-6">
          <div className="max-w-3xl animate-me opacity-0 -translate-y-8" style={{ transition: 'all 0.8s ease-out' }}>
            <div className="inline-block mb-4 py-1.5 px-3 rounded-full backdrop-blur-md bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-xs">Yaseen's Karate & Fitness Academy</p>
            </div>
            <h1 className="mb-4 text-3xl md:text-4xl lg:text-6xl font-bold leading-tight">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">YKFA</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl">
              YKFA was founded on the principles of discipline, respect, and personal growth. 
              We strive to create champions not just in martial arts, but in life.
            </p>
          </div>
        </div>
      </section>

      {/* Main content with tabs */}
      <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-b from-dark-900 to-dark-800">
        <div className="container px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Sidebar - Tabs navigation for desktop */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 p-4 sticky top-24 shadow-xl animate-me opacity-0 -translate-x-8" style={{ transition: 'all 0.8s ease-out' }}>
                <h3 className="text-lg font-semibold mb-4 text-white">Explore YKFA</h3>
                <nav className="space-y-2">
                  {TABS_DATA.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-2 p-2.5 rounded-xl transition-all text-left text-sm
                        ${activeTab === tab.id 
                          ? 'bg-amber-400/20 text-amber-400 border-amber-400/30 border' 
                          : 'text-gray-300 hover:bg-white/10'
                        }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center
                        ${activeTab === tab.id ? 'bg-amber-400/20' : 'bg-white/10'}`}>
                        {tab.icon}
                      </div>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
                
                <div className="mt-6 pt-4 border-t border-white/10">
                  <Link 
                    to="/contact" 
                    className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-black font-medium py-2.5 px-4 rounded-xl transition-all text-sm"
                  >
                    Contact Us
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Mobile tabs navigation */}
            <div className="lg:hidden mb-6">
              <div className="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 p-3 shadow-xl animate-me opacity-0 -translate-y-8" style={{ transition: 'all 0.8s ease-out' }}>
                <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
                  {TABS_DATA.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 p-2 rounded-xl transition-all text-sm flex-shrink-0
                        ${activeTab === tab.id 
                          ? 'bg-amber-400/20 text-amber-400 border-amber-400/30 border' 
                          : 'text-gray-300 bg-white/5 border border-white/10'
                        }`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center
                        ${activeTab === tab.id ? 'bg-amber-400/20' : 'bg-white/10'}`}>
                        {tab.icon}
                      </div>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Main content area */}
            <div className="lg:col-span-3 space-y-8">
              {/* About Master Yaseen content - First section */}
              <div className={`animate-me opacity-0 translate-y-8 ${activeTab === 'about' ? 'block' : 'hidden'}`} style={{ transition: 'all 0.8s ease-out' }}>
                <div className="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 p-4 md:p-6 shadow-xl">
                  <h2 className="text-2xl font-bold mb-5 text-amber-400">About Master Yaseen</h2>
                  
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="md:w-1/3">
                      <div className="rounded-xl overflow-hidden border border-white/20">
                        <img 
                          src="https://i.postimg.cc/5ytC7vNk/Screenshot-2025-05-07-010532.png" 
                          alt="Sensei Ahmmed Yaseen M.A." 
                          className="w-full h-auto object-cover aspect-square md:aspect-[3/4]"
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3 space-y-4 text-gray-300 mt-4 md:mt-0">
                      <p>
                        Sensei Ahmmed Yaseen M.A. is the Head Coach and Founder of YKFA. With over two decades of martial arts experience, he is a 3rd Dan Black Belt in Karate and a recognized National-level Karate Coach & Referee under the Karate Association of India (KAI)/Karate India Organisation (KIO).
                      </p>
                      <p>
                        He is also a certified Self-Defense Coach, MMA Coach & Referee, and a Level-4 Certified Fitness Trainer. His dedication to holistic martial arts education extends to specialties in Sports Injury Management and Kobudo (traditional weapons training).
                      </p>
                      <p>
                        A national bronze medalist (AIKKPF 2018), Sensei Yaseen is not only a teacher but a lifelong learner and mentor, affiliated with international martial arts bodies and trained under global experts.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        <div className="bg-white/5 rounded-lg border border-white/10 p-3">
                          <h4 className="text-sm font-medium text-amber-400 mb-1">Qualifications</h4>
                          <ul className="text-sm space-y-1">
                            <li className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                              <span>3rd Dan Black Belt in Karate</span>
                            </li>
                            <li className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                              <span>Certified Self-Defense Coach</span>
                            </li>
                            <li className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                              <span>Level-4 Certified Fitness Trainer</span>
                            </li>
                          </ul>
                        </div>
                        <div className="bg-white/5 rounded-lg border border-white/10 p-3">
                          <h4 className="text-sm font-medium text-amber-400 mb-1">Specialties</h4>
                          <ul className="text-sm space-y-1">
                            <li className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                              <span>Karate & MMA</span>
                            </li>
                            <li className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                              <span>Sports Injury Management</span>
                            </li>
                            <li className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                              <span>Kobudo (Weapons Training)</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Achievements content */}
              <div className={`animate-me opacity-0 translate-y-8 ${activeTab === 'achievements' ? 'block' : 'hidden'}`} style={{ transition: 'all 0.8s ease-out' }}>
                <div className="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 p-4 md:p-6 shadow-xl">
                  <h2 className="text-2xl font-bold mb-5 text-amber-400">Achievements</h2>
                  
                  <div className="space-y-6 text-gray-300">
                    <p className="text-sm md:text-base">
                      YKFA has established itself as a premier martial arts academy in Kerala. Under the guidance of Master Yaseen, our students have achieved excellence in various martial arts disciplines and competitions.
                    </p>
                    
                    <div className="bg-amber-400/10 rounded-xl border border-amber-400/20 p-4 mt-4">
                      <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-400" />
                        <span>Academy Recognition</span>
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-amber-400 text-xs font-medium">KIO</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">Karate India Organisation</p>
                            <p className="text-xs text-gray-400">Official recognition and affiliation</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-amber-400 text-xs font-medium">MMA</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">MMA India Federation</p>
                            <p className="text-xs text-gray-400">Certified training center</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mission content */}
              <div className={`animate-me opacity-0 translate-y-8 ${activeTab === 'mission' ? 'block' : 'hidden'}`} style={{ transition: 'all 0.8s ease-out' }}>
                <div className="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 p-4 md:p-6 shadow-xl">
                  <h2 className="text-2xl font-bold mb-5 text-amber-400">Our Mission</h2>
                  <div className="space-y-4 text-gray-300">
                    <p className="text-sm md:text-base">
                      At Yaseens Karate and Fitness Academy, our mission is to empower individuals through martial arts, fitness, and self-discipline. We aim to build not just stronger bodies, but stronger minds—equipping our students with confidence, resilience, and the skills to protect themselves.
                    </p>
                    <p className="text-sm md:text-base">
                      Whether you're a beginner or an aspiring champion, we provide a safe, inclusive environment to grow and achieve excellence. Through our diverse training programs, we aim to make martial arts and fitness accessible to everyone, regardless of age or skill level.
                    </p>
                    <div className="p-4 md:p-5 bg-amber-400/10 rounded-xl border border-amber-400/20 mt-6">
                      <h3 className="text-base lg:text-lg font-medium mb-2 text-white">Core Values</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium text-white text-sm md:text-base">Respect</span>
                            <p className="text-xs md:text-sm text-gray-400">For oneself, instructors, fellow students, and the art</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium text-white text-sm md:text-base">Discipline</span>
                            <p className="text-xs md:text-sm text-gray-400">Commitment to training and continuous improvement</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium text-white text-sm md:text-base">Integrity</span>
                            <p className="text-xs md:text-sm text-gray-400">Honesty and ethical behavior in all situations</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium text-white text-sm md:text-base">Perseverance</span>
                            <p className="text-xs md:text-sm text-gray-400">The strength to overcome challenges and never give up</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* History content */}
              <div className={`animate-me opacity-0 translate-y-8 ${activeTab === 'history' ? 'block' : 'hidden'}`} style={{ transition: 'all 0.8s ease-out' }}>
                <div className="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 p-4 md:p-6 shadow-xl">
                  <h2 className="text-2xl font-bold mb-5 text-amber-400">Our History</h2>
                  
                  <div className="space-y-6 pl-2 sm:pl-0">
                    <div className="relative border-l-2 border-amber-400/30 pl-4 sm:pl-6 pb-6">
                      <div className="absolute top-0 left-0 w-3 sm:w-4 h-3 sm:h-4 -translate-x-1/2 bg-amber-400 rounded-full"></div>
                      <h3 className="text-lg sm:text-xl font-medium text-white mb-2">The Beginning</h3>
                      <p className="text-sm sm:text-base text-gray-300 mb-3">
                        Founded in 2014, YKFA was born from a deep passion for martial arts and a desire to make professional training accessible to all. What started as a small dojo has grown into a trusted institution affiliated with Japan Budo Karate and MMA India.
                      </p>
                      <div className="text-xs text-gray-400 italic">2014</div>
                    </div>
                    
                    <div className="relative border-l-2 border-amber-400/30 pl-4 sm:pl-6 pb-6">
                      <div className="absolute top-0 left-0 w-3 sm:w-4 h-3 sm:h-4 -translate-x-1/2 bg-amber-400 rounded-full"></div>
                      <h3 className="text-lg sm:text-xl font-medium text-white mb-2">Growth & Expansion</h3>
                      <p className="text-sm sm:text-base text-gray-300 mb-3">
                        As word spread about the quality of training at YKFA, our community grew rapidly. We expanded our program offerings to include various martial arts disciplines and fitness classes, working closely with district, state, and national martial arts bodies.
                      </p>
                      <div className="text-xs text-gray-400 italic">2018</div>
                    </div>
                    
                    <div className="relative pl-4 sm:pl-6">
                      <div className="absolute top-0 left-0 w-3 sm:w-4 h-3 sm:h-4 -translate-x-1/2 bg-amber-400 rounded-full"></div>
                      <h3 className="text-lg sm:text-xl font-medium text-white mb-2">YKFA Today</h3>
                      <p className="text-sm sm:text-base text-gray-300 mb-3">
                        Today, YKFA stands as a premier martial arts and fitness academy, recognized for excellence in training and character development. Our journey is one of perseverance, discipline, and community, providing an ideal environment for individuals of all ages and skill levels to pursue their martial arts and fitness journey.
                      </p>
                      <div className="text-xs text-gray-400 italic">Present</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Philosophy content */}
              <div className={`animate-me opacity-0 translate-y-8 ${activeTab === 'philosophy' ? 'block' : 'hidden'}`} style={{ transition: 'all 0.8s ease-out' }}>
                <div className="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 p-4 md:p-6 shadow-xl">
                  <h2 className="text-2xl font-bold mb-5 text-amber-400">Training Philosophy</h2>
                  
                  <div className="space-y-5 text-gray-300">
                    <p>
                      At YKFA, we believe martial arts is more than combat—it's a way of life. Our training blends tradition with modern athleticism, focusing on technique, self-control, and mental fortitude. Every session is designed to push limits safely and build character.
                    </p>
                    <p>
                      We customize programs to suit all ages and skill levels, ensuring that every student—whether a hobbyist, competitor, or fitness enthusiast—finds their path here.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mt-6">
                      <div className="backdrop-blur-sm bg-white/5 rounded-xl border border-white/10 p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-amber-400/20 rounded-lg flex items-center justify-center text-amber-400">
                            <AlignJustify className="w-5 h-5" />
                          </div>
                          <h3 className="font-medium text-white">Balanced Approach</h3>
                        </div>
                        <p className="text-sm">
                          We balance traditional martial arts training with modern fitness methods, ensuring students develop both technical skills and physical conditioning.
                        </p>
                      </div>
                      
                      <div className="backdrop-blur-sm bg-white/5 rounded-xl border border-white/10 p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-amber-400/20 rounded-lg flex items-center justify-center text-amber-400">
                            <User className="w-5 h-5" />
                          </div>
                          <h3 className="font-medium text-white">Individualized Training</h3>
                        </div>
                        <p className="text-sm">
                          We recognize that each student has unique goals and abilities, so we customize our approach to meet individual needs while maintaining high standards.
                        </p>
                      </div>
                      
                      <div className="backdrop-blur-sm bg-white/5 rounded-xl border border-white/10 p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-amber-400/20 rounded-lg flex items-center justify-center text-amber-400">
                            <Heart className="w-5 h-5" />
                          </div>
                          <h3 className="font-medium text-white">Mind-Body Connection</h3>
                        </div>
                        <p className="text-sm">
                          Mental focus is as important as physical technique. We teach students to develop concentration, awareness, and a positive mindset.
                        </p>
                      </div>
                      
                      <div className="backdrop-blur-sm bg-white/5 rounded-xl border border-white/10 p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-amber-400/20 rounded-lg flex items-center justify-center text-amber-400">
                            <Award className="w-5 h-5" />
                          </div>
                          <h3 className="font-medium text-white">Progressive Learning</h3>
                        </div>
                        <p className="text-sm">
                          Our curriculum follows a clear progression, allowing students to build skills systematically and celebrate achievements through belt advancement.
                        </p>
                      </div>
                    </div>
                    
                    <blockquote className="p-4 border-l-4 border-amber-400 bg-white/5 rounded-r-lg italic mt-6">
                      <p className="text-sm md:text-base">"Martial arts is not about fighting others, but about conquering yourself. The greatest victory is self-improvement."</p>
                      <footer className="text-sm text-amber-400 mt-2">— Sensei Yaseen</footer>
                    </blockquote>
                  </div>
                </div>
              </div>
              
              {/* Achievements content */}
              <div className={`animate-me opacity-0 translate-y-8 ${activeTab === 'achievements' ? 'block' : 'hidden'}`} style={{ transition: 'all 0.8s ease-out' }}>
                <div className="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 p-4 md:p-6 shadow-xl">
                  <h2 className="text-2xl font-bold mb-5 text-amber-400">Achievements</h2>
                  
                  <div className="space-y-4">
                    <p className="text-sm md:text-base text-gray-300">
                      Over the years, YKFA and Sensei Yaseen have earned numerous achievements and recognitions that highlight our commitment to excellence in martial arts and fitness training.
                    </p>
                    
                    <div className="grid grid-cols-1 gap-4 mt-5">
                      <div className="backdrop-blur-sm bg-white/5 rounded-xl border border-white/10 p-4">
                        <h3 className="font-medium text-white mb-3">Master Yaseen's Credentials</h3>
                        <ul className="space-y-3 text-gray-300 text-xs md:text-sm">
                          <li className="flex items-start gap-2">
                            <Award className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                            <span>3rd Dan Black Belt in Karate (20+ years of experience)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Award className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                            <span>National-level Certified Karate Coach & Referee (KAI & KIO)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Award className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                            <span>Certified Self-Defense Coach (Recognised by Gov. of India)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Award className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                            <span>Certified MMA Coach & Referee (Kerala)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Award className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                            <span>Level-4 Certified Fitness Trainer (Recognised by Gov. of India)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Award className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                            <span>Certified in Sports Injury Management (Gold's Gym Fitness Institute)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Award className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                            <span>Karate National Champion – AIKKPF 2018 (Bronze Medal)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Award className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                            <span>Kobudo Expert – Weapons Training Specialist</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Award className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                            <span>Trained under international coaches and organizations</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-xl font-medium text-white mb-4">Our Gallery</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {GALLERY_IMAGES_DATA.map((image, index) => (
                          <div key={index} className="rounded-lg overflow-hidden border border-white/10 aspect-square">
                            <img 
                              src={image} 
                              alt={`YKFA Gallery ${index + 1}`} 
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact info card */}
              <div className="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 p-4 md:p-6 shadow-xl animate-me opacity-0 translate-y-8" style={{ transition: 'all 0.8s ease-out' }}>
                <h3 className="text-xl font-medium mb-4 text-white">Get in Touch</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-400/20 rounded-lg flex items-center justify-center text-amber-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Call Us</p>
                      <p className="text-white">+91 7736488858</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-400/20 rounded-lg flex items-center justify-center text-amber-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="text-white">team@yaseens-ykfa.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-400/20 rounded-lg flex items-center justify-center text-amber-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Location</p>
                      <p className="text-white">Edappally, Kerala</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-me {
          will-change: opacity, transform;
        }
        
        .animate-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
          translateX: 0 !important;
        }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-me {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
        
        /* Mobile optimizations */
        @media (max-width: 640px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutUsPage; 