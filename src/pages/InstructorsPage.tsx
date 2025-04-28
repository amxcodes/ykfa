import { useState } from 'react';
import { Facebook, Instagram, Linkedin, X, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Instructor {
  id: number;
  name: string;
  title: string;
  image: string;
  bio: string;
  experience: string;
  specialties: string[];
  certifications: string[];
  social: {
    email?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

const InstructorCard = ({ 
  instructor, 
  onClick 
}: { 
  instructor: Instructor, 
  onClick: () => void 
}) => {
  return (
    <div 
      className="card group hover:bg-dark-700 hover:shadow-gold overflow-hidden cursor-pointer animate-fade-up"
      onClick={onClick}
    >
      <div className="h-64 overflow-hidden rounded-xl mb-4">
        <img 
          src={instructor.image} 
          alt={instructor.name} 
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <h3 className="text-xl font-bold mb-1">{instructor.name}</h3>
      <p className="text-amber-400 font-medium mb-3">{instructor.title}</p>
      <p className="text-gray-400 line-clamp-2">{instructor.bio}</p>
      
      <div className="mt-4 flex gap-2">
        {instructor.social.email && (
          <a href={`mailto:${instructor.social.email}`} className="text-gray-400 hover:text-amber-400 transition-colors" onClick={(e) => e.stopPropagation()}>
            <Mail className="w-5 h-5" />
          </a>
        )}
        {instructor.social.facebook && (
          <a href={instructor.social.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-amber-400 transition-colors" onClick={(e) => e.stopPropagation()}>
            <Facebook className="w-5 h-5" />
          </a>
        )}
        {instructor.social.instagram && (
          <a href={instructor.social.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-amber-400 transition-colors" onClick={(e) => e.stopPropagation()}>
            <Instagram className="w-5 h-5" />
          </a>
        )}
        {instructor.social.linkedin && (
          <a href={instructor.social.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-amber-400 transition-colors" onClick={(e) => e.stopPropagation()}>
            <Linkedin className="w-5 h-5" />
          </a>
        )}
        {instructor.social.twitter && (
          <a href={instructor.social.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-amber-400 transition-colors" onClick={(e) => e.stopPropagation()}>
            <X className="w-5 h-5" />
          </a>
        )}
      </div>
    </div>
  );
};

const InstructorDetail = ({ 
  instructor, 
  onClose 
}: { 
  instructor: Instructor, 
  onClose: () => void 
}) => {
  return (
    <div className="animate-fade-up">
      <button 
        onClick={onClose}
        className="mb-6 inline-flex items-center text-amber-400 hover:text-amber-300"
      >
        ← Back to all instructors
      </button>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <div className="rounded-2xl overflow-hidden mb-6">
            <img 
              src={instructor.image} 
              alt={instructor.name} 
              className="w-full h-auto"
            />
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Connect</h3>
            <div className="flex gap-3">
              {instructor.social.email && (
                <a href={`mailto:${instructor.social.email}`} className="bg-dark-700 p-2 rounded-full text-gray-400 hover:text-amber-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              )}
              {instructor.social.facebook && (
                <a href={instructor.social.facebook} target="_blank" rel="noreferrer" className="bg-dark-700 p-2 rounded-full text-gray-400 hover:text-amber-400 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {instructor.social.instagram && (
                <a href={instructor.social.instagram} target="_blank" rel="noreferrer" className="bg-dark-700 p-2 rounded-full text-gray-400 hover:text-amber-400 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {instructor.social.linkedin && (
                <a href={instructor.social.linkedin} target="_blank" rel="noreferrer" className="bg-dark-700 p-2 rounded-full text-gray-400 hover:text-amber-400 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {instructor.social.twitter && (
                <a href={instructor.social.twitter} target="_blank" rel="noreferrer" className="bg-dark-700 p-2 rounded-full text-gray-400 hover:text-amber-400 transition-colors">
                  <X className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Experience</h3>
            <p className="text-gray-400">{instructor.experience}</p>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold mb-1">{instructor.name}</h2>
          <p className="text-amber-400 font-medium mb-6">{instructor.title}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Biography</h3>
            <p className="text-gray-300 mb-4">{instructor.bio}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Specialties</h3>
              <ul className="space-y-2">
                {instructor.specialties.map((specialty, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-amber-400 mr-2">•</span>
                    <span className="text-gray-400">{specialty}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Certifications</h3>
              <ul className="space-y-2">
                {instructor.certifications.map((certification, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-amber-400 mr-2">•</span>
                    <span className="text-gray-400">{certification}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <Link to="/contact" className="btn btn-primary">
            Book a Session
          </Link>
        </div>
      </div>
    </div>
  );
};

const InstructorsPage = () => {
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  
  // Instructor data
  const instructors: Instructor[] = [
    {
      id: 1,
      name: "Master Yaseen",
      title: "Founder & Head Instructor",
      image: "https://images.pexels.com/photos/8939369/pexels-photo-8939369.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Master Yaseen has over 20 years of experience in traditional karate and modern fitness methodologies. After competing internationally and earning multiple black belts across different disciplines, he founded YKFA with a vision to create a comprehensive training facility that honors traditional martial arts while embracing modern fitness science. His teaching philosophy emphasizes discipline, respect, and continuous self-improvement.",
      experience: "20+ years in martial arts, 15+ years teaching experience",
      specialties: [
        "Traditional Shotokan Karate",
        "Strength & Conditioning",
        "Martial Arts Philosophy",
        "Competitive Karate Coaching"
      ],
      certifications: [
        "7th Dan Black Belt in Shotokan Karate",
        "Certified Strength and Conditioning Specialist (CSCS)",
        "International Karate Federation Master Instructor",
        "First Aid and CPR Certified"
      ],
      social: {
        email: "master.yaseen@yaseensykfa.com",
        facebook: "#",
        instagram: "#",
        linkedin: "#"
      }
    },
    {
      id: 2,
      name: "Sarah Chen",
      title: "Kickboxing Program Director",
      image: "https://images.pexels.com/photos/8936558/pexels-photo-8936558.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Sarah brings high energy and technical precision to every class. With a background in competitive kickboxing and a passion for fitness, she creates challenging workouts that build both technique and conditioning. Her classes focus on proper form, progressive skill development, and creating a supportive community of practitioners.",
      experience: "12+ years in martial arts, 8+ years teaching experience",
      specialties: [
        "Cardio Kickboxing",
        "Technical Kickboxing",
        "HIIT Training",
        "Women's Self-Defense"
      ],
      certifications: [
        "3rd Dan Black Belt in Taekwondo",
        "Certified Kickboxing Instructor",
        "NASM Certified Personal Trainer",
        "Kettlebell Certification"
      ],
      social: {
        email: "sarah.chen@yaseensykfa.com",
        instagram: "#",
        twitter: "#"
      }
    },
    {
      id: 3,
      name: "David Rodriguez",
      title: "Fitness & Conditioning Coach",
      image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "David specializes in strength training and conditioning for martial artists. His background in exercise science and competitive athletics gives him a unique perspective on functional training for combat sports. David's approach focuses on building real-world strength, explosive power, and injury prevention. His sessions are challenging but adaptable to all fitness levels.",
      experience: "10+ years in strength & conditioning, 6+ years with martial artists",
      specialties: [
        "Strength Training for Martial Artists",
        "Athletic Performance Enhancement",
        "Functional Movement",
        "Injury Prevention"
      ],
      certifications: [
        "MS in Exercise Science",
        "Certified Strength and Conditioning Specialist (CSCS)",
        "TRX Certified Trainer",
        "Functional Movement Specialist"
      ],
      social: {
        email: "david.rodriguez@yaseensykfa.com",
        instagram: "#",
        linkedin: "#"
      }
    },
    {
      id: 4,
      name: "Aisha Johnson",
      title: "Kids Program Instructor",
      image: "https://images.pexels.com/photos/7991264/pexels-photo-7991264.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Aisha has a special gift for working with children and teaching them the fundamentals of martial arts in an engaging, age-appropriate way. With a background in education and developmental psychology, she creates classes that build not only physical skills but also confidence, focus, and respect. Parents consistently praise her ability to connect with children of all personalities and learning styles.",
      experience: "8+ years teaching martial arts to children ages 4-12",
      specialties: [
        "Age-appropriate Martial Arts Instruction",
        "Character Development",
        "Anti-Bullying Programs",
        "Youth Physical Development"
      ],
      certifications: [
        "4th Dan Black Belt in Karate",
        "Child Development Certification",
        "Youth Fitness Specialist",
        "First Aid and CPR Certified"
      ],
      social: {
        email: "aisha.johnson@yaseensykfa.com",
        facebook: "#",
        instagram: "#"
      }
    },
    {
      id: 5,
      name: "Michael Tanaka",
      title: "Traditional Karate Instructor",
      image: "https://images.pexels.com/photos/7045514/pexels-photo-7045514.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Michael is deeply committed to preserving and teaching the traditional aspects of karate, including its philosophical foundations and cultural heritage. Having studied extensively in Japan, he brings authentic knowledge and practice to his classes. Michael emphasizes proper technique, disciplined practice, and the deeper meanings behind karate movements and forms.",
      experience: "15+ years in traditional karate, trained in Japan for 5 years",
      specialties: [
        "Traditional Kata (Forms)",
        "Bunkai (Application Analysis)",
        "Karate Philosophy",
        "Japanese Martial Arts Culture"
      ],
      certifications: [
        "5th Dan Black Belt in Shotokan Karate",
        "Certified by Japan Karate Association",
        "Traditional Martial Arts Preservation Society Member",
        "Authorized Instructor of Classical Kata"
      ],
      social: {
        email: "michael.tanaka@yaseensykfa.com",
        facebook: "#",
        instagram: "#"
      }
    },
    {
      id: 6,
      name: "Emma Wilson",
      title: "Self-Defense Specialist",
      image: "https://images.pexels.com/photos/8939461/pexels-photo-8939461.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Emma specializes in practical, real-world self-defense training for people of all ages and physical abilities. Drawing from multiple martial arts disciplines and her background in security consulting, she teaches situational awareness, threat assessment, and effective techniques that don't rely on size or strength. Her workshops and classes emphasize building confidence and developing a safety mindset.",
      experience: "12+ years in self-defense training, former security consultant",
      specialties: [
        "Practical Self-Defense",
        "Women's Safety Workshops",
        "Situational Awareness Training",
        "Corporate Security Training"
      ],
      certifications: [
        "Multiple Black Belts (Jiu-Jitsu, Krav Maga)",
        "Certified Personal Protection Specialist",
        "Crisis Prevention Training",
        "Law Enforcement Defensive Tactics Instructor"
      ],
      social: {
        email: "emma.wilson@yaseensykfa.com",
        twitter: "#",
        linkedin: "#"
      }
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-black">
        <div className="absolute inset-0 z-0 bg-black">
          <div 
            className="absolute inset-0 bg-center bg-cover opacity-40"
            style={{ 
              backgroundImage: "url('https://images.pexels.com/photos/7045632/pexels-photo-7045632.jpeg?auto=compress&cs=tinysrgb&w=1920')" 
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black"></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-sm">Our Team</p>
            </div>
            <h1 className="mb-6">Meet Our <span className="text-transparent bg-clip-text bg-gold-gradient">Expert</span> Instructors</h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl">
              Learn from our highly qualified team of martial arts masters and fitness professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="section bg-dark-800">
        <div className="container">
          {selectedInstructor ? (
            <InstructorDetail 
              instructor={selectedInstructor} 
              onClose={() => setSelectedInstructor(null)} 
            />
          ) : (
            <>
              <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
                <p className="text-gray-300">
                  Our instructors bring decades of combined experience in martial arts and fitness. 
                  Each is selected not only for their technical expertise but also for their ability to teach, 
                  inspire, and bring out the best in our members.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {instructors.map(instructor => (
                  <InstructorCard 
                    key={instructor.id} 
                    instructor={instructor} 
                    onClick={() => setSelectedInstructor(instructor)} 
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Teaching Philosophy */}
      {!selectedInstructor && (
        <section className="section bg-dark-900">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-up">
                <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
                  <p className="text-amber-400 font-medium text-sm">Our Philosophy</p>
                </div>
                <h2 className="mb-6">Teaching <span className="text-transparent bg-clip-text bg-gold-gradient">Approach</span></h2>
                <p className="text-gray-300 mb-6">
                  At YKFA, our instructors follow a teaching philosophy centered on meeting students where they are while pushing them to reach their full potential. We believe in creating a supportive environment where:
                </p>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-3 text-xl">•</span>
                    <p className="text-gray-300">Every student receives personalized attention and feedback</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-3 text-xl">•</span>
                    <p className="text-gray-300">Techniques are taught with attention to detail and proper form</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-3 text-xl">•</span>
                    <p className="text-gray-300">Traditional values of respect, discipline, and perseverance are upheld</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-3 text-xl">•</span>
                    <p className="text-gray-300">Students are empowered to set and achieve meaningful goals</p>
                  </li>
                </ul>
                <p className="text-gray-300">
                  Our instructors continually update their knowledge and skills through ongoing education and certification, ensuring that YKFA members receive the most effective and up-to-date training available.
                </p>
              </div>
              <div className="relative animate-fade-up">
                <div className="absolute -top-6 -left-6 w-64 h-64 rounded-full bg-amber-400/20 blur-3xl"></div>
                <img 
                  src="https://images.pexels.com/photos/8939470/pexels-photo-8939470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="YKFA Instructor Teaching" 
                  className="w-full h-auto rounded-2xl shadow-lg relative z-10"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-24 relative">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-center bg-cover opacity-30"
            style={{ 
              backgroundImage: "url('https://images.pexels.com/photos/7045591/pexels-photo-7045591.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" 
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/70"></div>
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h2 className="mb-6">Train With The <span className="text-transparent bg-clip-text bg-gold-gradient">Best</span></h2>
            <p className="text-xl text-gray-300 mb-8">
              Experience expert instruction and personalized guidance on your fitness journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn btn-primary">
                Book an Introduction
              </Link>
              <Link to="/programs" className="btn btn-outline">
                Explore Our Programs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InstructorsPage;