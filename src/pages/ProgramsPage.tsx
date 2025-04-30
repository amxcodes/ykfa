import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, Users, Award, Clock, Target } from 'lucide-react';

// Program type definition
interface Program {
  id: number;
  title: string;
  description: string;
  image: string;
  category: 'karate' | 'fitness' | 'kickboxing' | 'self-defense';
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  groupSize: string;
  benefits: string[];
}

const ProgramCard = ({ program }: { program: Program }) => {
  return (
    <div className="card group hover:bg-dark-700 hover:shadow-gold overflow-hidden animate-fade-up">
      <div className="h-64 overflow-hidden rounded-xl mb-4">
        <img 
          src={program.image} 
          alt={program.title} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="bg-dark-700 text-amber-400 text-xs font-medium px-2.5 py-1 rounded">
          {program.category.charAt(0).toUpperCase() + program.category.slice(1)}
        </span>
        <span className="bg-dark-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded flex items-center">
          <Clock className="w-3 h-3 mr-1" /> {program.duration}
        </span>
        <span className="bg-dark-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded flex items-center">
          <Award className="w-3 h-3 mr-1" /> {program.level}
        </span>
      </div>
      <h3 className="text-xl font-bold mb-2">{program.title}</h3>
      <p className="text-gray-400 mb-4">{program.description}</p>
      <Link 
        to={`/contact?program=${encodeURIComponent(program.title)}`} 
        className="inline-flex items-center text-amber-400 hover:text-amber-300"
      >
        Learn more <ArrowRight className="ml-2 w-4 h-4" />
      </Link>
    </div>
  );
};

const ProgramDetail = ({ program }: { program: Program }) => {
  return (
    <div className="grid md:grid-cols-2 gap-8 animate-fade-up">
      <div className="rounded-2xl overflow-hidden">
        <img 
          src={program.image} 
          alt={program.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-amber-400/20 border border-amber-400/30 text-amber-400 text-xs font-medium px-2.5 py-1 rounded">
            {program.category.charAt(0).toUpperCase() + program.category.slice(1)}
          </span>
          <span className="bg-dark-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded flex items-center">
            <Clock className="w-3 h-3 mr-1" /> {program.duration}
          </span>
          <span className="bg-dark-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded flex items-center">
            <Award className="w-3 h-3 mr-1" /> {program.level}
          </span>
          <span className="bg-dark-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded flex items-center">
            <Users className="w-3 h-3 mr-1" /> {program.groupSize}
          </span>
        </div>
        <h3 className="text-2xl font-bold mb-4">{program.title}</h3>
        <p className="text-gray-300 mb-6">{program.description}</p>
        
        <h4 className="text-lg font-semibold mb-3 flex items-center">
          <Target className="w-5 h-5 mr-2 text-amber-400" /> Benefits
        </h4>
        <ul className="space-y-2 mb-8">
          {program.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <span className="text-amber-400 mr-2">•</span>
              <span className="text-gray-400">{benefit}</span>
            </li>
          ))}
        </ul>
        
        <div className="flex flex-wrap gap-4">
          <Link to="/contact" className="btn btn-primary">
            Inquire Now
          </Link>
          <Link to="/membership" className="btn btn-outline">
            View Membership Options
          </Link>
        </div>
      </div>
    </div>
  );
};

const ProgramsPage = () => {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Program data
  const programs: Program[] = [
    {
      id: 1,
      title: "Traditional Karate",
      description: "Master the ancient art of Karate with our traditional training program focused on technique, discipline and respect.",
      image: "https://images.pexels.com/photos/7045573/pexels-photo-7045573.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "karate",
      duration: "60 min sessions",
      level: "All Levels",
      groupSize: "Max 20 students",
      benefits: [
        "Learn authentic karate techniques from expert instructors",
        "Develop discipline, focus, and mental clarity",
        "Improve overall physical fitness and coordination",
        "Build confidence and self-defense capabilities",
        "Practice in a respectful, traditional environment"
      ]
    },
    {
      id: 2,
      title: "Strength & Conditioning",
      description: "Build functional strength, endurance, and power with our comprehensive strength and conditioning program.",
      image: "https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "fitness",
      duration: "45 min sessions",
      level: "All Levels",
      groupSize: "Max 15 students",
      benefits: [
        "Increase overall strength and muscle mass",
        "Improve cardiovascular endurance and stamina",
        "Develop functional fitness for everyday activities",
        "Enhance athletic performance for other sports",
        "Train in a supportive, motivating environment"
      ]
    },
    {
      id: 3,
      title: "Kickboxing",
      description: "High-energy cardio workouts that combine martial arts techniques with heart-pumping exercise.",
      image: "https://images.pexels.com/photos/8611871/pexels-photo-8611871.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "kickboxing",
      duration: "50 min sessions",
      level: "All Levels",
      groupSize: "Max 15 students",
      benefits: [
        "Burn calories with intense cardio workouts",
        "Learn proper striking techniques for punches and kicks",
        "Develop coordination and reflexes",
        "Relieve stress in a controlled environment",
        "Build confidence and physical conditioning"
      ]
    },
    {
      id: 4,
      title: "Kids Martial Arts",
      description: "Age-appropriate martial arts training that builds confidence, focus, and respect in children.",
      image: "https://images.pexels.com/photos/7045660/pexels-photo-7045660.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "karate",
      duration: "45 min sessions",
      level: "Beginner",
      groupSize: "Max 12 students",
      benefits: [
        "Develop discipline, respect, and focus from an early age",
        "Learn basic self-defense and personal safety",
        "Improve motor skills and physical coordination",
        "Build confidence and social skills",
        "Have fun while learning valuable life skills"
      ]
    },
    {
      id: 5,
      title: "HIIT Fitness",
      description: "High-Intensity Interval Training for maximum calorie burn and conditioning in minimal time.",
      image: "https://images.pexels.com/photos/6456300/pexels-photo-6456300.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "fitness",
      duration: "30 min sessions",
      level: "Intermediate",
      groupSize: "Max 12 students",
      benefits: [
        "Maximize calorie burn in shorter workout sessions",
        "Boost metabolism for hours after training",
        "Improve cardiovascular and muscular endurance",
        "Train in a high-energy, motivating environment",
        "Achieve visible results in less time"
      ]
    },
    {
      id: 6,
      title: "Self-Defense Essentials",
      description: "Practical self-defense techniques and strategies for real-world situations.",
      image: "https://images.pexels.com/photos/7045596/pexels-photo-7045596.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "self-defense",
      duration: "60 min sessions",
      level: "All Levels",
      groupSize: "Max 15 students",
      benefits: [
        "Learn practical techniques for real-world situations",
        "Develop situational awareness and threat assessment skills",
        "Build confidence in your ability to protect yourself",
        "Improve reaction time and physical readiness",
        "Train in a safe, supportive environment"
      ]
    },
    {
      id: 7,
      title: "Advanced Karate",
      description: "Intensive training for experienced karate practitioners looking to refine technique and advance in rank.",
      image: "https://images.pexels.com/photos/7045439/pexels-photo-7045439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "karate",
      duration: "90 min sessions",
      level: "Advanced",
      groupSize: "Max 10 students",
      benefits: [
        "Refine advanced techniques and kata",
        "Prepare for high-level rank examinations",
        "Deepen understanding of karate philosophy and principles",
        "Receive personalized feedback from master instructors",
        "Train alongside dedicated practitioners"
      ]
    },
    {
      id: 8,
      title: "Fitness Boxing",
      description: "Non-contact boxing training for fitness, focusing on technique, cardio, and core strength.",
      image: "https://images.pexels.com/photos/4754146/pexels-photo-4754146.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "fitness",
      duration: "45 min sessions",
      level: "All Levels",
      groupSize: "Max 15 students",
      benefits: [
        "Learn proper boxing techniques without contact",
        "Improve cardiovascular endurance and stamina",
        "Develop upper body strength and core stability",
        "Relieve stress through intense physical activity",
        "Build confidence and physical coordination"
      ]
    }
  ];

  const filteredPrograms = selectedCategory === 'all' 
    ? programs 
    : programs.filter(program => program.category === selectedCategory);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-black">
        <div className="absolute inset-0 z-0 bg-black">
          <div 
            className="absolute inset-0 bg-center bg-cover opacity-40"
            style={{ 
              backgroundImage: "url('https://images.pexels.com/photos/2628207/pexels-photo-2628207.jpeg?auto=compress&cs=tinysrgb&w=1920')" 
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black"></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-sm">Our Programs</p>
            </div>
            <h1 className="mb-6">Training for <span className="text-transparent bg-clip-text bg-gold-gradient">Body</span> and <span className="text-transparent bg-clip-text bg-gold-gradient">Mind</span></h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl">
              Explore our diverse range of martial arts and fitness programs designed to help you achieve your goals.
            </p>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="section bg-dark-800">
        <div className="container">
          {selectedProgram ? (
            <>
              <button 
                onClick={() => setSelectedProgram(null)}
                className="mb-8 inline-flex items-center text-amber-400 hover:text-amber-300"
              >
                <ArrowRight className="mr-2 w-4 h-4 rotate-180" /> Back to all programs
              </button>
              <ProgramDetail program={selectedProgram} />
            </>
          ) : (
            <>
              {/* Program Tabs */}
              <div className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-up">
                <button 
                  className={`px-4 py-2 rounded-full transition-all ${selectedCategory === 'all' ? 'bg-amber-400 text-black' : 'bg-dark-700 text-gray-300 hover:bg-dark-600'}`}
                  onClick={() => setSelectedCategory('all')}
                >
                  All Programs
                </button>
                <button 
                  className={`px-4 py-2 rounded-full transition-all ${selectedCategory === 'karate' ? 'bg-amber-400 text-black' : 'bg-dark-700 text-gray-300 hover:bg-dark-600'}`}
                  onClick={() => setSelectedCategory('karate')}
                >
                  Karate
                </button>
                <button 
                  className={`px-4 py-2 rounded-full transition-all ${selectedCategory === 'fitness' ? 'bg-amber-400 text-black' : 'bg-dark-700 text-gray-300 hover:bg-dark-600'}`}
                  onClick={() => setSelectedCategory('fitness')}
                >
                  Fitness
                </button>
                <button 
                  className={`px-4 py-2 rounded-full transition-all ${selectedCategory === 'kickboxing' ? 'bg-amber-400 text-black' : 'bg-dark-700 text-gray-300 hover:bg-dark-600'}`}
                  onClick={() => setSelectedCategory('kickboxing')}
                >
                  Kickboxing
                </button>
                <button 
                  className={`px-4 py-2 rounded-full transition-all ${selectedCategory === 'self-defense' ? 'bg-amber-400 text-black' : 'bg-dark-700 text-gray-300 hover:bg-dark-600'}`}
                  onClick={() => setSelectedCategory('self-defense')}
                >
                  Self Defense
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {filteredPrograms.map(program => (
                  <div key={program.id} onClick={() => setSelectedProgram(program)} className="cursor-pointer">
                    <ProgramCard program={program} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Training Philosophy */}
      <section className="section bg-dark-900">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative animate-fade-up order-2 md:order-1">
              <div className="absolute -top-6 -left-6 w-64 h-64 rounded-full bg-amber-400/20 blur-3xl"></div>
              <img 
                src="https://images.pexels.com/photos/4164758/pexels-photo-4164758.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="YKFA Training Philosophy" 
                className="w-full h-auto rounded-2xl shadow-lg relative z-10"
              />
            </div>
            <div className="animate-fade-up order-1 md:order-2">
              <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
                <p className="text-amber-400 font-medium text-sm">Our Approach</p>
              </div>
              <h2 className="mb-6">Training <span className="text-transparent bg-clip-text bg-gold-gradient">Philosophy</span></h2>
              <p className="text-gray-300 mb-6">
                At YKFA, we believe in a holistic approach to training that integrates both body and mind. Our programs are designed to not only improve physical fitness but also to develop mental focus, emotional resilience, and spiritual balance.
              </p>
              <p className="text-gray-300 mb-6">
                We combine traditional training methodologies with modern fitness science to create programs that are both authentic and effective. Every class is structured to provide a challenging yet supportive environment where members can push their limits safely.
              </p>
              <p className="text-gray-300">
                Our instructors are dedicated to helping each member progress at their own pace while maintaining the highest standards of technical excellence and personal growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 relative">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-center bg-cover opacity-30"
            style={{ 
              backgroundImage: "url('https://images.pexels.com/photos/8611887/pexels-photo-8611887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" 
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/70"></div>
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h2 className="mb-6">Start Your <span className="text-transparent bg-clip-text bg-gold-gradient">Journey</span> Today</h2>
            <p className="text-xl text-gray-300 mb-8">
              Experience our training programs firsthand with a free introductory class.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn btn-primary">
                Book a Free Class
              </Link>
              <Link to="/membership" className="btn btn-outline">
                View Membership Options
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProgramsPage;