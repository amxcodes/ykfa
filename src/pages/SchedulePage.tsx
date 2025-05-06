import { Clock, Calendar, Users, Dumbbell, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Define schedule data types
interface TimeSlot {
  title?: string;
  time: string;
  notes?: string;
  highlight?: boolean;
}

interface ScheduleCategory {
  title: string;
  icon: React.ReactNode;
  timeSlots: TimeSlot[];
}

const SchedulePage = () => {
  const [activeTab, setActiveTab] = useState<string>('mma');
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
    gym: [
      {
        title: "Gym Only",
        icon: <Dumbbell size={20} className="text-amber-400" />,
        timeSlots: [
          { title: "Morning", time: "06:00am to 10:30am" },
          { title: "Evening", time: "05:00pm to 10:00pm" }
        ]
      }
    ],
    group: [
      {
        title: "Group Fitness Classes",
        icon: <Users size={20} className="text-amber-400" />,
        timeSlots: [
          { title: "Batch 1", time: "06:00am to 07:00am" },
          { title: "Batch 2", time: "07:00am to 08:00am" },
          { title: "Batch 3", time: "08:00am to 09:00am" },
          { title: "Ladies batch", time: "09:30am to 10:30am", highlight: true }
        ]
      }
    ]
  };

  return (
    <div className="relative min-h-screen w-full bg-black/90 pt-28 pb-16 px-4 sm:px-6">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-24 -right-24 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-24 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-12 right-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <div className="mb-10 text-center">
          <motion.h1 
            className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600 mb-2 font-spaceGrotesk"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Class Schedule
          </motion.h1>
          <motion.div 
            className="flex items-center justify-center gap-2 sm:text-lg text-white/80 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
           
          
          </motion.div>
        </div>

        {/* Schedule Tabs */}
        <div className="mb-8">
          <div className="inline-flex p-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full shadow-lg flex-wrap justify-center">
            <motion.button
              className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                activeTab === 'mma' 
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setActiveTab('mma')}
              whileHover={activeTab !== 'mma' ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.97 }}
            >
              MMA
            </motion.button>
            
            <motion.button
              className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                activeTab === 'karate' 
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setActiveTab('karate')}
              whileHover={activeTab !== 'karate' ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.97 }}
            >
              Karate
            </motion.button>
            
            <motion.button
              className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                activeTab === 'gym' 
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setActiveTab('gym')}
              whileHover={activeTab !== 'gym' ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.97 }}
            >
              Gym Only
            </motion.button>
            
            <motion.button
              className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                activeTab === 'group' 
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setActiveTab('group')}
              whileHover={activeTab !== 'group' ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.97 }}
            >
              Group Fitness
            </motion.button>
          </div>
        </div>

        {/* Schedule Content */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          key={activeTab}
        >
          {scheduleData[activeTab].map((category, index) => (
            <motion.div
              key={category.title}
              className="backdrop-blur-md bg-black/40 border border-amber-500/20 rounded-xl overflow-hidden hover:shadow-amber-900/20 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: animatedItems ? 1 : 0, 
                y: animatedItems ? 0 : 20 
              }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
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
                    <motion.li 
                      key={i}
                      className="group"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ 
                        opacity: animatedItems ? 1 : 0, 
                        x: animatedItems ? 0 : -10 
                      }}
                      transition={{ delay: (index * 0.1) + (i * 0.05) + 0.2, duration: 0.3 }}
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
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SchedulePage; 