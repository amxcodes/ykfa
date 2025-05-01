import { ArrowRight, Timer, MessageCircle, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { useState, useEffect } from 'react';
// Add an icon for the floating button (you can use any icon you prefer)
// Import the ShuffleCards component
import { ShuffleCards } from '../components/ui/shuffle-cards';
import ChatbotInterface from '../components/ChatbotInterface';

const FloatingButtons = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showWhatsAppWidget, setShowWhatsAppWidget] = useState(false);
  const [showInitialTooltip, setShowInitialTooltip] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);

  // Hide initial tooltip after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialTooltip(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Initial Tooltip */}
      <div 
        className={`fixed bottom-28 right-28 z-50 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 max-w-[200px] sm:max-w-none hidden sm:block ${
          showInitialTooltip && !isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <p className="text-sm">Need help? Click + to:</p>
        <ul className="mt-1 text-xs space-y-1">
          <li className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3 text-green-500" />
            Chat on WhatsApp
          </li>
          <li className="flex items-center gap-1">
            <Bot className="w-3 h-3 text-blue-500" />
            Talk to our AI Assistant
          </li>
        </ul>
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-[16px] border-r-white/90 border-b-8 border-b-transparent"></div>
      </div>

      <div className="fixed bottom-24 sm:bottom-28 right-4 sm:right-8 z-50 flex flex-col gap-4">
        <div className={`flex flex-col gap-4 transition-all duration-300 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          <div className="relative group">
            {/* WhatsApp Widget */}
            <div 
              className={`absolute bottom-0 right-12 sm:right-16 bg-white rounded-lg shadow-xl w-[calc(100vw-32px)] sm:w-80 max-w-[320px] overflow-hidden transition-all duration-300 ${
                showWhatsAppWidget 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-10 pointer-events-none'
              }`}
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
            >
              <div className="bg-[#25D366] text-white p-2.5 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base truncate">How may we Help you?</h3>
                    <p className="text-[10px] sm:text-xs opacity-90">Hit Click below to chat on WhatsApp</p>
                  </div>
                </div>
              </div>
              <div className="p-2.5 sm:p-4">
                <p className="text-gray-500 text-[10px] sm:text-xs mb-2 sm:mb-3">Our team typically replies in a few minutes.</p>
                <a 
                  href="https://wa.me/917736488858"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center bg-[#25D366]/10 rounded-full flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="#25D366" className="w-4 h-4 sm:w-6 sm:h-6">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">Yaseen's YKFA</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">+91 77364 88858</p>
                  </div>
                  <div className="text-[#25D366] flex-shrink-0">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </a>
              </div>
            </div>

            {/* WhatsApp Button */}
            <button
              onClick={() => setShowWhatsAppWidget(!showWhatsAppWidget)}
              className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-all group"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
            >
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          <button
            onClick={() => setShowChatbot(!showChatbot)}
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-all group"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
          >
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
            if (!isExpanded) {
              setShowInitialTooltip(false);
            }
          }}
          className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-white/20 shadow-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all group"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
        >
          <div className="relative w-5 h-5 sm:w-6 sm:h-6">
            <div className={`absolute inset-0 transition-all duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-full h-full text-white"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" className={`transition-all duration-300 ${isExpanded ? 'opacity-0' : 'opacity-100'}`} />
                <path d="M5 5l14 14M19 5L5 19" className={`transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`} />
              </svg>
            </div>
          </div>
        </button>
      </div>

      {/* Chatbot Interface */}
      <ChatbotInterface isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
    </>
  );
};

const ProgramCard = ({ 
  title, 
  description, 
  image, 
  link 
}: { 
  title: string; 
  description: string; 
  image: string; 
  link: string; 
}) => {
  return (
    <div className="card group hover:bg-dark-700 hover:shadow-gold overflow-hidden animate-fade-up">
      <div className="h-64 overflow-hidden rounded-xl mb-4">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <Link 
        to={link} 
        className="inline-flex items-center text-amber-400 hover:text-amber-300"
      >
        Learn more <ArrowRight className="ml-2 w-4 h-4" />
      </Link>
    </div>
  );
};


const HomePage = () => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'karate' | 'fitness' | 'kickboxing'>('all');

  const programs = [
    {
      id: 1,
      title: "Traditional Karate",
      description: "Master the ancient art of Karate with our traditional training program focused on technique, discipline and respect.",
      image: "https://images.pexels.com/photos/7045573/pexels-photo-7045573.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      link: "/programs",
      category: "karate"
    },
    {
      id: 2,
      title: "Strength & Conditioning",
      description: "Build functional strength, endurance, and power with our comprehensive strength and conditioning program.",
      image: "https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      link: "/programs",
      category: "fitness"
    },
    {
      id: 3,
      title: "Kickboxing",
      description: "High-energy cardio workouts that combine martial arts techniques with heart-pumping exercise.",
      image: "https://images.pexels.com/photos/8611871/pexels-photo-8611871.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      link: "/programs",
      category: "kickboxing"
    },
    {
      id: 4,
      title: "Kids Martial Arts",
      description: "Age-appropriate martial arts training that builds confidence, focus, and respect in children.",
      image: "https://images.pexels.com/photos/7045660/pexels-photo-7045660.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      link: "/programs",
      category: "karate"
    }
  ];

  const filteredPrograms = selectedTab === 'all' 
    ? programs 
    : programs.filter(program => program.category === selectedTab);

  return (
    <>
      <Hero />
      
      {/* About Section */}
      <section className="section bg-dark-900">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
                <p className="text-amber-400 font-medium text-sm">About YKFA</p>
              </div>
              <h2 className="mb-6">Elevating Fitness and Martial Arts <span className="text-transparent bg-clip-text bg-gold-gradient">Since 2015</span></h2>
              <p className="text-gray-300 mb-6">
                Yaseen's YKFA combines state-of-the-art fitness facilities with traditional martial arts training. Our academy is built on the principles of discipline, respect, and continuous improvement.
              </p>
              <p className="text-gray-300 mb-6">
                Whether you're a beginner looking to start your fitness journey or an experienced martial artist aiming to refine your skills, our expert instructors provide personalized guidance to help you achieve your goals.
              </p>
              <Link to="/about" className="btn btn-primary">
                Our Story
              </Link>
            </div>
            <div className="relative animate-fade-up">
              <div className="absolute -top-6 -left-6 w-64 h-64 rounded-full bg-amber-400/20 blur-3xl"></div>
              <img 
                src="https://images.pexels.com/photos/4752861/pexels-photo-4752861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="YKFA Training" 
                className="w-full h-auto rounded-2xl shadow-lg relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="section bg-dark-800">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
            <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-sm">Our Programs</p>
            </div>
            <h2 className="mb-4">Training Programs for <span className="text-transparent bg-clip-text bg-gold-gradient">All Levels</span></h2>
            <p className="text-gray-300">
              Explore our diverse range of training programs designed to help you achieve your fitness and martial arts goals.
            </p>
          </div>

          {/* Program Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 animate-fade-up">
            <button 
              className={`px-4 py-2 rounded-full transition-all ${selectedTab === 'all' ? 'bg-amber-400 text-black' : 'bg-dark-700 text-gray-300 hover:bg-dark-600'}`}
              onClick={() => setSelectedTab('all')}
            >
              All Programs
            </button>
            <button 
              className={`px-4 py-2 rounded-full transition-all ${selectedTab === 'karate' ? 'bg-amber-400 text-black' : 'bg-dark-700 text-gray-300 hover:bg-dark-600'}`}
              onClick={() => setSelectedTab('karate')}
            >
              Karate
            </button>
            <button 
              className={`px-4 py-2 rounded-full transition-all ${selectedTab === 'fitness' ? 'bg-amber-400 text-black' : 'bg-dark-700 text-gray-300 hover:bg-dark-600'}`}
              onClick={() => setSelectedTab('fitness')}
            >
              Fitness
            </button>
            <button 
              className={`px-4 py-2 rounded-full transition-all ${selectedTab === 'kickboxing' ? 'bg-amber-400 text-black' : 'bg-dark-700 text-gray-300 hover:bg-dark-600'}`}
              onClick={() => setSelectedTab('kickboxing')}
            >
              Kickboxing
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPrograms.map((program) => (
              <ProgramCard 
                key={program.id}
                title={program.title}
                description={program.description}
                image={program.image}
                link={program.link}
              />
            ))}
          </div>

          <div className="text-center mt-10 animate-fade-up">
            <Link to="/programs" className="btn btn-outline">
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 relative">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-center bg-cover opacity-30"
            style={{ 
              backgroundImage: "url('https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" 
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/70"></div>
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h2 className="mb-6">Ready to <span className="text-transparent bg-clip-text bg-gold-gradient">Transform</span> Your Life?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join Yaseen's YKFA today and start your journey towards a stronger, more disciplined you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/membership" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-dark-800 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 animate-fade-up">
            <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-sm">Testimonials</p>
            </div>
            <h2 className="mb-4">What Our <span className="text-transparent bg-clip-text bg-gold-gradient">Members</span> Say</h2>
            <p className="text-gray-300">
              Hear from our community about their experiences and transformations at YKFA.
            </p>
          </div>

          <div className="flex justify-center items-center w-full py-6 sm:py-10">
            <ShuffleCards />
          </div>
          
          <div className="text-center mt-6 sm:mt-8 animate-fade-up">
            <Link to="/membership" className="btn btn-outline">
              Join Our Community
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Buttons */}
      <FloatingButtons />

      {/* Floating Timer Icon */}
      <Link
        to="/timer"
        className="fixed bottom-8 right-4 sm:right-8 z-50 bg-amber-400 text-black rounded-full shadow-lg p-3 sm:p-4 flex items-center justify-center hover:bg-amber-500 transition-colors group"
        title="Go to Timer"
        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
      >
        <Timer className="w-5 h-5 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
      </Link>
    </>
  );
};

export default HomePage;