import { Clock, Calendar, Users, Dumbbell } from 'lucide-react';
// import { motion } from 'framer-motion'; // Replaced with CSS animations
import { useState, useEffect } from 'react';

// Define schedule data types
interface TimeSlot {
  title?: string;
  time: string;
  notes?: string;
  highlight?: boolean;
  coach?: string;
}

interface ScheduleCategory {
  title: string;
  icon: React.ReactNode;
  timeSlots: TimeSlot[];
}

const SchedulePage = () => {
  const [activeTab, setActiveTab] = useState<string>('mmagym');
  const [animatedItems, setAnimatedItems] = useState<boolean>(false);

  // Animate items on tab change
  useEffect(() => {
    setAnimatedItems(false);
    const timer = setTimeout(() => {
      setAnimatedItems(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Schedule data from WhatsApp screenshot
  const scheduleData: Record<string, ScheduleCategory[]> = {
    mmagym: [
      {
        title: "Batch A",
        icon: <Users size={20} className="text-amber-400" />,
        timeSlots: [
          { title: "Monday", time: "07:30 PM to 08:30 PM", notes: "Boxing/Kickboxing/Muay Thai", coach: "John Samuel" },
          { title: "Wednesday", time: "08:00 PM to 09:00 PM", notes: "Strength & Conditioning + Cardio/Sparring", coach: "Malik Dhinar" },
          { title: "Thursday", time: "06:00 PM to 07:30 PM", notes: "Wrestling/Judo/BJJ", coach: "Alan C Benny" },
          { title: "Tuesday", time: "08:00 PM to 09:00 PM", notes: "GYM" },
          { title: "Friday", time: "08:00 PM to 09:00 PM", notes: "GYM" },
          { title: "Saturday", time: "08:00 PM to 09:00 PM", notes: "GYM" },
        ]
      },
      {
        title: "Batch B",
        icon: <Users size={20} className="text-amber-400" />,
        timeSlots: [
          { title: "Monday", time: "08:30 PM to 09:30 PM", notes: "Boxing/Kickboxing/Muay Thai", coach: "John Samuel" },
          { title: "Wednesday", time: "09:00 PM to 10:00 PM", notes: "Strength & Conditioning + Cardio/Sparring", coach: "Malik Dhinar" },
          { title: "Thursday", time: "08:00 PM to 09:30 PM", notes: "Wrestling/Judo/BJJ", coach: "Alan C Benny" },
          { title: "Tuesday", time: "09:00 PM to 10:00 PM", notes: "GYM" },
          { title: "Friday", time: "09:00 PM to 10:00 PM", notes: "GYM" },
          { title: "Saturday", time: "09:00 PM to 10:00 PM", notes: "GYM" },
        ]
      },
      {
        title: "Batch C",
        icon: <Users size={20} className="text-amber-400" />,
        timeSlots: [
          { title: "Tuesday", time: "08:00 PM to 09:30 PM", notes: "Wrestling/Judo/BJJ", coach: "Malik Dhinar" },
          { title: "Friday", time: "07:00 PM to 08:00 PM", notes: "Boxing/Kickboxing/Muay Thai", coach: "John Samuel" },
          { title: "Saturday", time: "08:00 PM to 09:00 PM", notes: "Strength & Conditioning + Cardio/Sparring", coach: "Malik Dhinar" },
          { title: "Monday", time: "08:00 PM to 09:00 PM", notes: "GYM" },
          { title: "Wednesday", time: "08:00 PM to 09:00 PM", notes: "GYM" },
          { title: "Thursday", time: "08:00 PM to 09:00 PM", notes: "GYM" },
        ]
      }
    ],
    mma: [
      {
        title: "Batch A",
        icon: <Users size={20} className="text-amber-400" />,
        timeSlots: [
          { title: "Monday", time: "07:30pm to 08:30pm" },
          { title: "Wednesday", time: "07:30pm to 08:30pm" },
          { title: "Thursday", time: "06:00pm to 07:30pm" }
        ]
      },
      {
        title: "Batch B",
        icon: <Users size={20} className="text-amber-400" />,
        timeSlots: [
          { title: "Monday", time: "08:30pm to 09:30pm" },
          { title: "Wednesday", time: "08:30pm to 09:30pm" },
          { title: "Thursday", time: "08:00pm to 09:30pm" }
        ]
      }
    ],
    karate: [
      {
        title: "Karate Sessions",
        icon: <Calendar size={20} className="text-amber-400" />,
        timeSlots: [
          { title: "Tuesday", time: "06:00pm to 07:30pm" },
          { title: "Friday", time: "06:00pm to 07:30pm" }
        ]
      }
    ],
    group: [
      {
        title: "GYM FIT FUSION",
        icon: <Users size={20} className="text-amber-400" />,
        timeSlots: [
          { title: "Batch 1", time: "06:00am to 07:00am" },
          { title: "Batch 2", time: "07:00am to 08:00am" },
          { title: "Batch 3", time: "08:00am to 09:00am" },
          { title: "Ladies batch", time: "09:30am to 10:30am", highlight: true },
          { title: "Batch 4", time: "05:00pm to 06:00pm" },
          { title: "Batch 5", time: "06:00pm to 07:00pm" },
          { title: "Batch 6", time: "07:00pm to 08:00pm" },
          { title: "Batch 7", time: "08:00pm to 09:00pm" },
          { title: "Batch 8", time: "09:00pm to 10:00pm" },
        ]
      }
    ]
  };

  return (
    <div className="relative min-h-screen w-full bg-black/90 pt-28 pb-16 px-4 sm:px-6">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
          }}
        ></div>
        
        {/* Diagonal lines pattern */}
        <div 
          className="absolute inset-0 opacity-5" 
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, rgba(251, 191, 36, 0.1) 0px, rgba(251, 191, 36, 0.1) 1px, transparent 1px, transparent 20px),
              repeating-linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0px, rgba(251, 191, 36, 0.1) 1px, transparent 1px, transparent 20px)
            `,
          }}
        ></div>
        
        {/* Decorative elements */}
        <div className="absolute top-24 -right-24 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-24 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-12 right-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 
            className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600 mb-2 font-spaceGrotesk animate-fade-in-up"
          >
            Class Schedule
          </h1>
          <div 
            className="flex items-center justify-center gap-2 sm:text-lg text-white/80 mt-2 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
           
          
          </div>
        </div>

        {/* Schedule Tabs */}
        <div className="mb-8 overflow-x-auto overflow-y-hidden -mx-4 px-4 pb-3">
          <div className="inline-flex p-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full shadow-lg whitespace-nowrap">
            <button
              className={`px-4 sm:px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex-shrink-0 ${
                activeTab === 'mmagym' 
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setActiveTab('mmagym')}
            >
              MMA+GYM
            </button>
            
            <button
              className={`px-4 sm:px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex-shrink-0 ${
                activeTab === 'mma' 
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setActiveTab('mma')}
            >
              MMA
            </button>
            
            <button
              className={`px-4 sm:px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex-shrink-0 ${
                activeTab === 'karate' 
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setActiveTab('karate')}
            >
              Karate
            </button>
            
            <button
              className={`px-4 sm:px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex-shrink-0 ${
                activeTab === 'group' 
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setActiveTab('group')}
            >
              GYM FIT FUSION
            </button>
          </div>
        </div>

        {/* Add custom scrollbar styles */}
        <style>{`
          /* Hide scrollbar for Chrome, Safari and Opera */
          .overflow-x-auto::-webkit-scrollbar {
            display: none;
          }

          /* Hide scrollbar for IE, Edge and Firefox */
          .overflow-x-auto {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}</style>

        {/* Schedule Content */}
        <div 
          className="space-y-6"
          key={activeTab}
        >
          {scheduleData[activeTab].map((category, index) => (
            <div
              key={category.title}
              className="backdrop-blur-md bg-black/40 border border-amber-500/20 rounded-xl overflow-hidden hover:shadow-amber-900/20 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Category Header */}
              <div className="bg-gradient-to-r from-amber-500/10 to-amber-800/10 backdrop-blur-lg p-5 border-b border-amber-500/20 relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-xl opacity-60"></div>
                
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center border border-amber-500/30 shadow-inner shadow-amber-500/5">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">{category.title}</h3>
                </div>
              </div>
              
              {/* Time Slots */}
              <div className="p-3 md:p-4">
                <ul className="divide-y divide-amber-500/10">
                  {category.timeSlots.map((slot, i) => (
                    <li 
                      key={i}
                      className="group animate-fade-in-up"
                      style={{ animationDelay: `${(index * 0.1) + (i * 0.05) + 0.2}s` }}
                    >
                      <div className="p-3 md:p-4 flex items-center gap-3 rounded-lg group-hover:bg-amber-500/5 transition-all duration-300 relative">
                        {/* Subtle accent on the left */}
                        <div className="absolute left-0 top-[10%] bottom-[10%] w-0.5 bg-gradient-to-b from-amber-400/60 to-amber-500/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Day/Title */}
                        {slot.title && (
                          <div className="text-white font-medium min-w-[100px]">
                            {slot.title}
                          </div>
                        )}
                        
                        {/* Time */}
                        {slot.time && (
                          <div className="flex items-center text-amber-100/80">
                            <Clock size={14} className="mr-2 text-amber-400" />
                            <span>{slot.time}</span>
                          </div>
                        )}
                        
                        {/* Notes */}
                        {slot.notes && (
                          <div className={`ml-auto text-sm px-3 py-1 rounded-full ${
                            slot.highlight 
                              ? 'bg-pink-500/10 text-pink-300 border border-pink-500/30' 
                              : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                          }`}>
                            {slot.notes}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchedulePage; 