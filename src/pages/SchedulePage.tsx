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
  const [activeTab, setActiveTab] = useState<string>('gym');
  const [animatedItems, setAnimatedItems] = useState<boolean>(false);

  // Animate items on tab change
  useEffect(() => {
    setAnimatedItems(false);
    const timer = setTimeout(() => {
      setAnimatedItems(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Schedule data exactly matching the user's specified categories
  const scheduleData: Record<string, ScheduleCategory[]> = {
    gym: [
      {
        title: "Morning Gym Hours",
        icon: <Dumbbell size={20} className="text-amber-400" />,
        timeSlots: [
          { title: "Batch 1", time: "06:00am to 07:00am" },
          { title: "Batch 2", time: "07:00am to 08:00am" },
          { title: "Batch 3", time: "08:00am to 09:00am" },
          { title: "Ladies batch", time: "09:30am to 10:30am", notes: "Gym Only", highlight: true }
        ]
      },
      {
        title: "Gym Operating Hours",
        icon: <Clock size={20} className="text-amber-400" />,
        timeSlots: [
          { title: "Morning", time: "06:00am to 10:30am" },
          { title: "Evening", time: "05:00pm to 10:00pm" }
        ]
      }
    ],
    martial: [
      {
        title: "Karate Sessions",
        icon: <Calendar size={20} className="text-amber-400" />,
        timeSlots: [
          { title: "Tuesday", time: "06:00pm to 07:30pm" },
          { title: "Friday", time: "06:00pm to 07:30pm", notes: "MMA" }
        ]
      }
    ],
    group: [
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
            <Dumbbell size={16} className="text-amber-400" />
            <span className="font-medium text-amber-400">Group Fitness Classes</span>
          </motion.div>
        </div>

        {/* Schedule Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <ScheduleTab 
              label="Gym" 
              active={activeTab === 'gym'} 
              onClick={() => setActiveTab('gym')} 
            />
            <ScheduleTab 
              label="MMA/Karate" 
              active={activeTab === 'martial'} 
              onClick={() => setActiveTab('martial')} 
            />
            <ScheduleTab 
              label="Group Fitness" 
              active={activeTab === 'group'} 
              onClick={() => setActiveTab('group')} 
            />
          </div>
        </div>

        {/* Schedule Content */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          key={activeTab}
        >
          {scheduleData[activeTab].map((category, index) => (
            <ScheduleSection 
              key={category.title} 
              category={category} 
              index={index}
              isAnimated={animatedItems}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// Tab component
interface ScheduleTabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const ScheduleTab = ({ label, active, onClick }: ScheduleTabProps) => (
  <motion.button
    className={`px-4 py-2 rounded-xl transition-all duration-300 border ${
      active 
        ? 'bg-white/10 border-amber-400/50 text-amber-400 shadow-[0_4px_12px_rgba(0,0,0,0.1)]' 
        : 'border-white/10 text-white hover:border-white/30'
    }`}
    onClick={onClick}
    whileHover={{ scale: active ? 1 : 1.05 }}
    whileTap={{ scale: 0.97 }}
  >
    {label}
  </motion.button>
);

// Schedule Section component
interface ScheduleSectionProps {
  category: ScheduleCategory;
  index: number;
  isAnimated: boolean;
}

const ScheduleSection = ({ category, index, isAnimated }: ScheduleSectionProps) => (
  <motion.div
    className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: isAnimated ? 1 : 0, 
      y: isAnimated ? 0 : 20 
    }}
    transition={{ delay: index * 0.1, duration: 0.4 }}
  >
    <div className="p-5 border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center border border-white/10">
          {category.icon}
        </div>
        <h3 className="text-xl font-bold text-white">{category.title}</h3>
      </div>
    </div>
    <div className="p-4">
      <ul className="space-y-3">
        {category.timeSlots.map((slot, i) => (
          <motion.li 
            key={i}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            initial={{ opacity: 0, x: -10 }}
            animate={{ 
              opacity: isAnimated ? 1 : 0, 
              x: isAnimated ? 0 : -10 
            }}
            transition={{ delay: (index * 0.1) + (i * 0.05) + 0.2, duration: 0.3 }}
          >
            <div className="flex-shrink-0 w-1.5 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full opacity-70"></div>
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              {slot.title && (
                <div className="text-white font-medium min-w-[100px]">{slot.title}</div>
              )}
              <div className="text-white/90">{slot.time}</div>
              {slot.notes && (
                <div className={`text-sm ${slot.highlight ? 'text-pink-400' : 'text-amber-400'} font-medium ml-1`}>
                  {slot.notes}
                </div>
              )}
            </div>
            <div className="flex-shrink-0">
              <ChevronRight size={16} className="text-white/50" />
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  </motion.div>
);

export default SchedulePage; 