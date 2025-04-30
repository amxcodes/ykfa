import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center bg-black">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0 bg-black">
        <div 
          className="absolute inset-0 bg-center bg-cover opacity-50"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/4761352/pexels-photo-4761352.jpeg?auto=compress&cs=tinysrgb&w=1920')" 
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black"></div>
      </div>

      <div className="container relative z-10 pt-28 sm:pt-20 md:pt-24 pb-12">
        <div className="max-w-3xl animate-fade-up">
          <h1 className="mb-6">
            Discover Your <span className="text-transparent bg-clip-text bg-gold-gradient">Strength</span> and <span className="text-transparent bg-clip-text bg-gold-gradient">Discipline</span> at YKFA
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-8 text-gray-300 max-w-2xl">
            Premium training facilities with expert coaches dedicated to your transformation through karate and fitness excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/membership" className="btn btn-primary">
              Start Your Journey
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/programs" className="btn btn-outline">
              Explore Programs
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center p-4 bg-dark-800/50 backdrop-blur-sm rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold text-amber-400">10+</div>
              <p className="text-sm sm:text-base text-gray-400">Expert Trainers</p>
            </div>
            <div className="text-center p-4 bg-dark-800/50 backdrop-blur-sm rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold text-amber-400">15+</div>
              <p className="text-sm sm:text-base text-gray-400">Training Programs</p>
            </div>
            <div className="text-center p-4 bg-dark-800/50 backdrop-blur-sm rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold text-amber-400">1000+</div>
              <p className="text-sm sm:text-base text-gray-400">Members</p>
            </div>
            <div className="text-center p-4 bg-dark-800/50 backdrop-blur-sm rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold text-amber-400">8+</div>
              <p className="text-sm sm:text-base text-gray-400">Years Experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;