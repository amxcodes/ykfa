import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-black">
        <div className="absolute inset-0 z-0 bg-black">
          <div 
            className="absolute inset-0 bg-center bg-cover opacity-40"
            style={{ 
              backgroundImage: "url('https://images.pexels.com/photos/8612000/pexels-photo-8612000.jpeg?auto=compress&cs=tinysrgb&w=1920')" 
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black"></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-sm">About Us</p>
            </div>
            <h1 className="mb-6">Our Journey to <span className="text-transparent bg-clip-text bg-gold-gradient">Excellence</span></h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl">
              Discover the story behind Yaseen's YKFA, our mission, values, and commitment to excellence in martial arts and fitness.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section bg-dark-800">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
                <p className="text-amber-400 font-medium text-sm">Our Story</p>
              </div>
              <h2 className="mb-6">From Passion to <span className="text-transparent bg-clip-text bg-gold-gradient">Academy</span></h2>
              <p className="text-gray-300 mb-6">
                Founded in 2015 by Master Yaseen, a world-renowned martial artist and fitness expert, YKFA began as a small karate school with a vision to transform lives through discipline, respect, and physical excellence.
              </p>
              <p className="text-gray-300 mb-6">
                After years of training and competing at international levels, Yaseen recognized the need for a comprehensive training facility that combined traditional martial arts wisdom with modern fitness science. This insight led to the creation of YKFA, where ancient practices meet cutting-edge training methodologies.
              </p>
              <p className="text-gray-300">
                What started as a small dojo has now grown into one of the region's premier martial arts and fitness academies, with thousands of members whose lives have been transformed through our programs.
              </p>
            </div>
            <div className="relative animate-fade-up">
              <div className="absolute -top-6 -left-6 w-64 h-64 rounded-full bg-amber-400/20 blur-3xl"></div>
              <img 
                src="https://images.pexels.com/photos/7045665/pexels-photo-7045665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="YKFA Founder" 
                className="w-full h-auto rounded-2xl shadow-lg relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="section bg-dark-900">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
            <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-sm">Mission & Values</p>
            </div>
            <h2 className="mb-4">Guided by <span className="text-transparent bg-clip-text bg-gold-gradient">Principles</span></h2>
            <p className="text-gray-300">
              Our mission and values form the foundation of everything we do at Yaseen's YKFA.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 mb-12">
            <div className="card hover:shadow-gold animate-fade-up">
              <div className="bg-amber-400/20 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <span className="text-xl font-bold text-amber-400">01</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Our Mission</h3>
              <p className="text-gray-400">
                To empower individuals through martial arts and fitness training, creating a community where discipline, respect, and continuous growth lead to transformative life changes. We strive to make high-quality training accessible to everyone, regardless of age, background, or current fitness level.
              </p>
            </div>
            
            <div className="card hover:shadow-gold animate-fade-up">
              <div className="bg-amber-400/20 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <span className="text-xl font-bold text-amber-400">02</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Our Vision</h3>
              <p className="text-gray-400">
                To be recognized as the premier martial arts and fitness academy, setting the gold standard for training excellence and personal development. We envision a future where YKFA has empowered thousands to lead stronger, more disciplined lives while fostering a global community united by the values of martial arts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card hover:bg-dark-700 transition-all animate-fade-up">
              <h3 className="text-xl font-bold mb-3 text-amber-400">Excellence</h3>
              <p className="text-gray-400">
                We pursue excellence in every aspect of our academy, from our training programs to our facilities and instruction, never settling for anything less than the best.
              </p>
            </div>

            <div className="card hover:bg-dark-700 transition-all animate-fade-up">
              <h3 className="text-xl font-bold mb-3 text-amber-400">Respect</h3>
              <p className="text-gray-400">
                We foster an environment of mutual respect – for ourselves, our peers, our instructors, and our academy – creating a supportive community where everyone can thrive.
              </p>
            </div>

            <div className="card hover:bg-dark-700 transition-all animate-fade-up">
              <h3 className="text-xl font-bold mb-3 text-amber-400">Discipline</h3>
              <p className="text-gray-400">
                We instill discipline through structured training, helping our members develop the mental fortitude to overcome challenges both in and outside the academy.
              </p>
            </div>

            <div className="card hover:bg-dark-700 transition-all animate-fade-up">
              <h3 className="text-xl font-bold mb-3 text-amber-400">Growth</h3>
              <p className="text-gray-400">
                We believe in continuous improvement, encouraging our members to push their boundaries and embrace the journey of personal development.
              </p>
            </div>

            <div className="card hover:bg-dark-700 transition-all animate-fade-up">
              <h3 className="text-xl font-bold mb-3 text-amber-400">Community</h3>
              <p className="text-gray-400">
                We build a strong community that supports and motivates one another, recognizing that together we can achieve more than we can alone.
              </p>
            </div>

            <div className="card hover:bg-dark-700 transition-all animate-fade-up">
              <h3 className="text-xl font-bold mb-3 text-amber-400">Integrity</h3>
              <p className="text-gray-400">
                We operate with honesty and transparency in all our dealings, holding ourselves to the highest ethical standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="section bg-dark-800">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
            <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-sm">Our Facilities</p>
            </div>
            <h2 className="mb-4">State-of-the-Art <span className="text-transparent bg-clip-text bg-gold-gradient">Training Facilities</span></h2>
            <p className="text-gray-300">
              Explore our premium training spaces designed for optimal performance and growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="animate-fade-up">
              <div className="rounded-2xl overflow-hidden mb-4 aspect-[4/3]">
                <img 
                  src="https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Martial Arts Dojo" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Traditional Dojo</h3>
              <p className="text-gray-400">
                Our 2,500 sq ft traditional dojo features authentic tatami mats, training equipment, and a peaceful atmosphere for martial arts practice.
              </p>
            </div>

            <div className="animate-fade-up">
              <div className="rounded-2xl overflow-hidden mb-4 aspect-[4/3]">
                <img 
                  src="https://images.pexels.com/photos/4164762/pexels-photo-4164762.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Fitness Area" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Modern Gym</h3>
              <p className="text-gray-400">
                Our fitness center is equipped with the latest strength and conditioning equipment, free weights, and functional training areas.
              </p>
            </div>

            <div className="animate-fade-up">
              <div className="rounded-2xl overflow-hidden mb-4 aspect-[4/3]">
                <img 
                  src="https://images.pexels.com/photos/3076516/pexels-photo-3076516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Recovery Lounge" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Recovery Lounge</h3>
              <p className="text-gray-400">
                Our recovery area includes hot and cold plunge pools, stretching areas, and relaxation spaces to optimize your training recovery.
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
              backgroundImage: "url('https://images.pexels.com/photos/6456207/pexels-photo-6456207.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" 
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/70"></div>
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h2 className="mb-6">Experience YKFA <span className="text-transparent bg-clip-text bg-gold-gradient">For Yourself</span></h2>
            <p className="text-xl text-gray-300 mb-8">
              Ready to join our community of dedicated martial artists and fitness enthusiasts? Schedule a tour or try a free class today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn btn-primary">
                Schedule a Tour
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

export default AboutPage;