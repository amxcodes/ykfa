import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { useState } from 'react';

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

const TestimonialCard = ({ 
  quote, 
  name, 
  role, 
  image 
}: { 
  quote: string; 
  name: string; 
  role: string; 
  image: string; 
}) => {
  return (
    <div className="bg-dark-700 p-6 rounded-2xl shadow animate-fade-up">
      <div className="flex items-start mb-4">
        <div className="text-3xl text-amber-400">"</div>
      </div>
      <p className="text-gray-300 mb-6">{quote}</p>
      <div className="flex items-center gap-3">
        <img 
          src={image} 
          alt={name} 
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h4 className="font-medium">{name}</h4>
          <p className="text-sm text-gray-400">{role}</p>
        </div>
      </div>
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

      {/* Testimonials */}
      <section className="section bg-dark-800">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
            <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-sm">Testimonials</p>
            </div>
            <h2 className="mb-4">What Our Members <span className="text-transparent bg-clip-text bg-gold-gradient">Say</span></h2>
            <p className="text-gray-300">
              Hear from our members about their transformative experiences at Yaseen's YKFA.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TestimonialCard 
              quote="The karate training at YKFA has not only improved my physical fitness but also my mental discipline. The instructors are world-class and truly care about your progress."
              name="Michael Chen"
              role="Member for 3 years"
              image="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            />
            <TestimonialCard 
              quote="I've tried many gyms before, but YKFA offers something special. The combination of traditional martial arts with modern fitness techniques has given me incredible results."
              name="Sarah Johnson"
              role="Member for 1 year"
              image="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            />
            <TestimonialCard 
              quote="Enrolling my kids in the children's program was one of the best decisions I've made. They've gained confidence, discipline, and physical skills in a supportive environment."
              name="David Rodriguez"
              role="Parent of YKFA students"
              image="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;