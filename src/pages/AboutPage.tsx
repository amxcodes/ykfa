import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useState } from 'react';

interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  author: string;
  authorImage: string;
  image: string;
  excerpt: string;
  content: string;
  keywords: string[];
}

// Article data with real, SEO-optimized content
const articles: Article[] = [
  {
    id: 'brazilian-jiu-jitsu-kerala',
    title: 'Brazilian Jiu-Jitsu in Kerala: The Art of Ground Fighting',
    category: 'BJJ',
    date: '2024-03-15',
    author: 'Master Yaseen',
    authorImage: 'https://images.pexels.com/photos/7045560/pexels-photo-7045560.jpeg?auto=compress&cs=tinysrgb&w=500',
    image: 'https://images.pexels.com/photos/7991632/pexels-photo-7991632.jpeg?auto=compress&cs=tinysrgb&w=1280',
    excerpt: 'Discover how Brazilian Jiu-Jitsu is revolutionizing martial arts training in Kerala. Learn about its effectiveness for self-defense, fitness benefits, and why it\'s becoming increasingly popular in Ernakulam.',
    content: `Brazilian Jiu-Jitsu (BJJ) has emerged as one of the most effective martial arts for self-defense and physical fitness in Kerala. At YKFA Edappally, we've seen a significant increase in students seeking to learn this ground-based martial art.

What makes BJJ unique is its focus on leverage and technique over strength, making it accessible to practitioners of all sizes. Our training program covers:

• Fundamental positions and submissions
• Self-defense techniques
• Competition preparation
• Physical conditioning
• Mental discipline

The benefits of BJJ training include:
- Improved cardiovascular health
- Enhanced flexibility and mobility
- Better problem-solving skills
- Increased confidence
- Stress relief

Our BJJ classes in Edappally are structured to accommodate both beginners and advanced practitioners, with separate sessions for different skill levels.`,
    keywords: ['BJJ Kerala', 'Brazilian Jiu-Jitsu Ernakulam', 'ground fighting', 'self-defense Kerala', 'martial arts Edappally']
  },
  {
    id: 'muay-thai-training-kerala',
    title: 'Muay Thai: The Art of Eight Limbs in Kerala',
    category: 'Muay Thai',
    date: '2024-03-10',
    author: 'Coach Rahul',
    authorImage: 'https://images.pexels.com/photos/9385171/pexels-photo-9385171.jpeg?auto=compress&cs=tinysrgb&w=500',
    image: 'https://images.pexels.com/photos/7991209/pexels-photo-7991209.jpeg?auto=compress&cs=tinysrgb&w=1280',
    excerpt: 'Explore the dynamic world of Muay Thai training in Kerala. From traditional techniques to modern fitness applications, learn how this ancient martial art is transforming lives in Ernakulam.',
    content: `Muay Thai, known as the "Art of Eight Limbs," has gained tremendous popularity in Kerala for its comprehensive striking system and fitness benefits. At YKFA Edappally, our Muay Thai program combines traditional techniques with modern training methods.

Key aspects of our Muay Thai training:
• Striking techniques using fists, elbows, knees, and shins
• Clinch work and close-range combat
• Conditioning and strength training
• Traditional Muay Thai rituals and respect
• Competition preparation

Training benefits include:
- Full-body workout
- Improved coordination
- Enhanced cardiovascular fitness
- Mental toughness
- Self-defense skills

Our Muay Thai classes are designed to build both technical skills and physical conditioning, making it an excellent choice for fitness enthusiasts and martial artists alike.`,
    keywords: ['Muay Thai Kerala', 'kickboxing Ernakulam', 'martial arts training', 'fitness Edappally', 'striking techniques']
  },
  {
    id: 'karate-tradition-kerala',
    title: 'Karate in Kerala: Blending Tradition with Modern Training',
    category: 'Karate',
    date: '2024-03-05',
    author: 'Sensei Kumar',
    authorImage: 'https://images.pexels.com/photos/7045704/pexels-photo-7045704.jpeg?auto=compress&cs=tinysrgb&w=500',
    image: 'https://images.pexels.com/photos/7045611/pexels-photo-7045611.jpeg?auto=compress&cs=tinysrgb&w=1280',
    excerpt: 'Discover the rich tradition of Karate training in Kerala. Learn about our comprehensive program that combines traditional techniques with modern training methods for optimal results.',
    content: `Karate training at YKFA Edappally represents the perfect blend of traditional martial arts values and modern training methodologies. Our program emphasizes both physical development and character building.

Our Karate curriculum includes:
• Basic stances and movements
• Kata (forms) practice
• Kumite (sparring) techniques
• Self-defense applications
• Belt progression system

Benefits of Karate training:
- Improved discipline and focus
- Enhanced physical coordination
- Better stress management
- Increased self-confidence
- Traditional martial arts values

We offer classes for all age groups, from children to adults, with specialized programs for different skill levels.`,
    keywords: ['Karate Kerala', 'martial arts training', 'self-defense Ernakulam', 'traditional karate', 'Edappally dojo']
  },
  {
    id: 'kickboxing-kerala',
    title: 'Kickboxing in Kerala: Modern Combat Training',
    category: 'Kickboxing',
    date: '2024-03-01',
    author: 'Coach Alex',
    authorImage: 'https://images.pexels.com/photos/7045586/pexels-photo-7045586.jpeg?auto=compress&cs=tinysrgb&w=500',
    image: 'https://images.pexels.com/photos/7045570/pexels-photo-7045570.jpeg?auto=compress&cs=tinysrgb&w=1280',
    excerpt: 'Experience the dynamic world of Kickboxing at YKFA Edappally. Learn how this high-energy martial art combines striking techniques with cardiovascular fitness for a complete workout.',
    content: `Kickboxing has become one of the most popular martial arts in Kerala, combining elements of boxing and karate for a dynamic full-body workout. At YKFA Edappally, our kickboxing program focuses on both fitness and technique.

Our kickboxing training includes:
• Boxing fundamentals
• Kick techniques
• Combination drills
• Cardio conditioning
• Sparring practice

Benefits of kickboxing:
- Excellent cardiovascular workout
- Improved coordination and balance
- Enhanced strength and flexibility
- Stress relief
- Self-defense skills

Our classes are suitable for all fitness levels, with modifications available for beginners.`,
    keywords: ['Kickboxing Kerala', 'martial arts training', 'fitness Ernakulam', 'combat sports', 'Edappally gym']
  },
  {
    id: 'judo-training-kerala',
    title: 'Judo: The Gentle Way in Kerala',
    category: 'Judo',
    date: '2024-02-25',
    author: 'Sensei Raj',
    authorImage: 'https://images.pexels.com/photos/6765076/pexels-photo-6765076.jpeg?auto=compress&cs=tinysrgb&w=500',
    image: 'https://images.pexels.com/photos/7045390/pexels-photo-7045390.jpeg?auto=compress&cs=tinysrgb&w=1280',
    excerpt: 'Discover the art of Judo at YKFA Edappally. Learn how this Olympic sport combines physical training with mental discipline for a complete martial arts experience.',
    content: `Judo, meaning "the gentle way," is a modern martial art that emphasizes using an opponent's strength against them. At YKFA Edappally, our Judo program teaches both traditional techniques and competitive skills.

Our Judo curriculum includes:
• Throwing techniques (Nage-waza)
• Ground fighting (Ne-waza)
• Break-falling (Ukemi)
• Competition preparation
• Self-defense applications

Benefits of Judo training:
- Improved balance and coordination
- Enhanced physical fitness
- Mental discipline
- Self-confidence
- Respect for others

We offer classes for all ages, with special programs for children and competitive athletes.`,
    keywords: ['Judo Kerala', 'martial arts training', 'self-defense Ernakulam', 'Olympic sports', 'Edappally dojo']
  },
  {
    id: 'wrestling-kerala',
    title: 'Wrestling Training in Kerala: Building Strength and Technique',
    category: 'Wrestling',
    date: '2024-02-20',
    author: 'Coach Mike',
    authorImage: 'https://images.pexels.com/photos/7045669/pexels-photo-7045669.jpeg?auto=compress&cs=tinysrgb&w=500',
    image: 'https://images.pexels.com/photos/2526032/pexels-photo-2526032.jpeg?auto=compress&cs=tinysrgb&w=1280',
    excerpt: 'Learn the art of wrestling at YKFA Edappally. Our comprehensive program combines traditional wrestling techniques with modern training methods for optimal results.',
    content: `Wrestling is one of the oldest forms of combat sports, and at YKFA Edappally, we offer a comprehensive wrestling program that combines traditional techniques with modern training methods.

Our wrestling training includes:
• Takedown techniques
• Ground control
• Pinning combinations
• Strength training
• Competition preparation

Benefits of wrestling training:
- Enhanced physical strength
- Improved flexibility
- Better body control
- Mental toughness
- Self-discipline

Our wrestling classes are suitable for both beginners and experienced wrestlers, with separate sessions for different skill levels.`,
    keywords: ['Wrestling Kerala', 'combat sports', 'martial arts training', 'strength training', 'Edappally gym']
  }
];

const BlogPage = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const openArticle = (article: Article) => {
    setSelectedArticle(article);
  };

  const closeArticle = () => {
    setSelectedArticle(null);
  };

  return (
    <>
      <Helmet>
        <title>YKFA Blog | Martial Arts & Fitness Training in Edappally, Ernakulam</title>
        <meta name="description" content="Expert insights on MMA, BJJ, Muay Thai, Karate, and other martial arts training in Kerala. Learn about techniques, benefits, and training programs at YKFA Edappally." />
        <meta name="keywords" content="martial arts Kerala, MMA training, BJJ Ernakulam, Muay Thai Edappally, karate training, kickboxing Kerala" />
        <link rel="canonical" href="https://www.ykfa.com/blog" />
      </Helmet>

      {/* Hero Section - Improved with parallax effect */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-black via-amber-950/30 to-black">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-center bg-cover opacity-30 transform scale-105 motion-safe:animate-subtle-zoom"
            style={{ 
              backgroundImage: "url('https://images.pexels.com/photos/7045405/pexels-photo-7045405.jpeg?auto=compress&cs=tinysrgb&w=1280')" 
            }}>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black"></div>
        </div>

        <div className="container relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="mb-8 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="block">Martial Arts</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">Knowledge Hub</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Expert insights, training techniques, and success stories from Kerala's premier martial arts center.
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute -bottom-6 -left-24 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl"></div>
        <div className="absolute -top-6 -right-24 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl"></div>
      </section>

      {/* Featured Articles - With improved card design */}
      <section className="py-20 bg-gradient-to-b from-black to-black/95">
        <div className="container">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-10 w-1.5 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-bold">Featured Articles</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <article 
                key={article.id} 
                className="group bg-gradient-to-br from-amber-950/10 to-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-amber-500/10 hover:border-amber-500/30 shadow-lg hover:shadow-amber-500/5 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="overflow-hidden aspect-[3/2] relative">
                  <img 
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-medium text-amber-400 py-1 px-3 rounded-full bg-amber-400/10 border border-amber-400/20 backdrop-blur-sm shadow-lg shadow-black/20">{article.category}</span>
            </div>
          </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-400">{article.date}</span>
                    <span className="text-amber-500/50">•</span>
                    <span className="text-xs text-gray-400">{article.author}</span>
            </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors mb-3 line-clamp-2">{article.title}</h3>
                  <p className="text-gray-400 mb-4 line-clamp-3">{article.excerpt}</p>
                  
                  <button 
                    onClick={() => openArticle(article)}
                    className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1.5 transition-colors group-hover:gap-2.5"
                  >
                    Read More
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                  </button>
            </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Article Modal - Redesigned with better readability */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center"
          onClick={closeArticle}
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md"></div>
          <div 
            className="relative w-full max-w-2xl mx-4 transform transition-all duration-300 ease-out motion-safe:animate-modal-appear"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-br from-amber-950/20 to-black/70 backdrop-blur-xl rounded-2xl w-full max-h-[80vh] overflow-y-auto border border-amber-500/20 shadow-2xl">
              <button 
                onClick={closeArticle}
                className="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/40 backdrop-blur-sm rounded-full p-2 hover:bg-black/60 transition-colors border border-amber-500/20 z-10 shadow-lg"
                aria-label="Close article"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              <div className="relative h-56 md:h-72 overflow-hidden">
                <img 
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-amber-400 py-1 px-3 rounded-full bg-amber-400/10 border border-amber-400/20 backdrop-blur-sm">{selectedArticle.category}</span>
                    <span className="text-amber-500/50">•</span>
                    <span className="text-xs text-gray-300">{selectedArticle.date}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedArticle.title}</h2>
                </div>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6 border-b border-amber-500/10 pb-4">
                  <img 
                    src={selectedArticle.authorImage} 
                    alt={selectedArticle.author}
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-500/30"
                  />
                  <div>
                    <h3 className="font-medium text-white">{selectedArticle.author}</h3>
                    <p className="text-xs text-gray-400">YKFA Instructor</p>
                  </div>
            </div>

                <div className="prose prose-invert max-w-none">
                  {selectedArticle.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-300 leading-relaxed">{paragraph}</p>
                  ))}
              </div>
                
                <div className="mt-8 pt-6 border-t border-amber-500/10">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedArticle.keywords.map((keyword, index) => (
                      <span key={index} className="text-xs text-gray-400 py-1 px-2 rounded-full bg-amber-500/5 border border-amber-500/10">
                        #{keyword.replace(/\s+/g, '')}
                      </span>
                    ))}
            </div>

                  <div className="flex flex-wrap gap-4">
                    <Link to="/contact" className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/10 transform hover:-translate-y-0.5">
                      Book a Free Class
                    </Link>
                    <Link to="/programs" className="px-6 py-2.5 rounded-full bg-black/30 border border-amber-500/30 text-white font-medium hover:bg-black/50 hover:border-amber-500/50 transition-all backdrop-blur-sm shadow-lg shadow-amber-500/5 transform hover:-translate-y-0.5">
                      Explore Programs
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section - Redesigned with better visual hierarchy */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-amber-950/5 to-black"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl"></div>
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-amber-950/10 to-black/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-amber-500/10 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Martial Arts Journey at <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">YKFA Edappally</span></h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              Join Kerala's premier martial arts and fitness community. Schedule a free trial class today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium hover:from-amber-400 hover:to-amber-500 transition-all shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transform hover:-translate-y-1">
                Book a Free Class
              </Link>
              <Link to="/programs" className="px-8 py-3.5 rounded-full bg-black/40 border border-amber-500/30 text-white font-medium hover:bg-black/60 hover:border-amber-500/50 transition-all backdrop-blur-sm shadow-xl shadow-amber-500/5 hover:shadow-amber-500/10 transform hover:-translate-y-1">
                Explore Programs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPage;