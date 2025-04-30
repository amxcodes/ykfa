import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { useState } from 'react';
// Add an icon for the floating button (you can use any icon you prefer)
import { Timer } from 'lucide-react';
// Import the ShuffleCards component
import { ShuffleCards } from '../components/ui/shuffle-cards';

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

      {/* Floating Timer Icon */}
      <Link
        to="/timer"
        className="fixed bottom-8 right-8 z-50 bg-amber-400 text-black rounded-full shadow-lg p-4 flex items-center justify-center hover:bg-amber-500 transition-colors"
        title="Go to Timer"
        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
      >
        <Timer className="w-7 h-7" />
      </Link>
    </>
  );
};

export default HomePage;