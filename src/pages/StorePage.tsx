import { Phone, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

const StorePage = () => {
  const products: Product[] = [
    {
      id: 1,
      name: "Premium Yoga Mat",
      price: 49.99,
      image: "https://images.pexels.com/photos/4662438/pexels-photo-4662438.jpeg",
      category: "yoga"
    },
    {
      id: 2,
      name: "Adjustable Dumbbell Set",
      price: 299.99,
      image: "https://images.pexels.com/photos/4164766/pexels-photo-4164766.jpeg",
      category: "weights"
    },
    {
      id: 3,
      name: "Resistance Band Pack",
      price: 29.99,
      image: "https://images.pexels.com/photos/4498155/pexels-photo-4498155.jpeg",
      category: "accessories"
    },
    {
      id: 4,
      name: "Boxing Gloves",
      price: 79.99,
      image: "https://images.pexels.com/photos/4754146/pexels-photo-4754146.jpeg",
      category: "martial-arts"
    },
    {
      id: 5,
      name: "Karate Gi",
      price: 89.99,
      image: "https://images.pexels.com/photos/7045391/pexels-photo-7045391.jpeg",
      category: "martial-arts"
    },
    {
      id: 6,
      name: "Foam Roller",
      price: 34.99,
      image: "https://images.pexels.com/photos/4498137/pexels-photo-4498137.jpeg",
      category: "accessories"
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
              backgroundImage: "url('https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=1920')" 
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black"></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-sm">Store</p>
            </div>
            <h1 className="mb-6">Premium Fitness <span className="text-transparent bg-clip-text bg-gold-gradient">Equipment</span></h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl">
              Discover our curated selection of high-quality fitness and martial arts equipment to enhance your training journey.
            </p>
          </div>
        </div>
      </section>

      {/* Store Content */}
      <section className="py-16 bg-dark-800">
        <div className="container">
          {/* Products Grid - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-dark-700 rounded-xl overflow-hidden group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 space-x-2">
                    <button className="p-2 bg-dark-800/80 backdrop-blur-sm rounded-full text-gray-300 hover:text-amber-400 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <span className="text-amber-400 font-semibold text-lg">${product.price}</span>
                    <Link to="/contact" className="btn btn-primary btn-sm w-full sm:w-auto">
                      <Phone className="w-4 h-4 mr-2" />
                      Contact and Buy
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default StorePage; 