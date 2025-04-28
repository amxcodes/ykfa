import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ChevronRight, Users, Award, Clock, ArrowRight, HelpCircle, Dumbbell, Target } from 'lucide-react';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface PricingPlan {
  id: number;
  name: string;
  price: number;
  period: string;
  description: string;
  features: PlanFeature[];
  recommended?: boolean;
  cta: string;
}

const PricingCard = ({ plan }: { plan: PricingPlan }) => {
  return (
    <div className={`card relative ${plan.recommended ? 'border-2 border-amber-400' : ''} animate-fade-up`}>
      {plan.recommended && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-amber-400 text-black font-medium py-1 px-4 rounded-full text-sm">
          Most Popular
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">${plan.price}</span>
        <span className="text-gray-400">/{plan.period}</span>
      </div>
      <p className="text-gray-400 mb-6">{plan.description}</p>
      
      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            {feature.included ? (
              <Check className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" />
            ) : (
              <X className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
            )}
            <span className={feature.included ? 'text-gray-300' : 'text-gray-500'}>
              {feature.name}
            </span>
          </li>
        ))}
      </ul>
      
      <Link 
        to="/contact" 
        className={`w-full text-center ${
          plan.recommended 
            ? 'btn btn-primary' 
            : 'btn btn-outline'
        }`}
      >
        {plan.cta}
        <ChevronRight className="ml-2 w-5 h-5" />
      </Link>
    </div>
  );
};

const FAQ = ({ 
  question, 
  answer 
}: { 
  question: string; 
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-dark-700 py-4 animate-fade-up">
      <button 
        className="flex items-center justify-between w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium">{question}</h3>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronRight className="w-5 h-5 rotate-90" />
        </div>
      </button>
      <div className={`mt-2 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-400">{answer}</p>
      </div>
    </div>
  );
};

const MembershipPage = () => {
  const [planDuration, setPlanDuration] = useState<'monthly' | 'annual'>('monthly');
  
  const pricingPlans: { monthly: PricingPlan[], annual: PricingPlan[] } = {
    monthly: [
      {
        id: 1,
        name: "Basic",
        price: 79,
        period: "month",
        description: "Perfect for beginners looking to start their fitness journey.",
        features: [
          { name: "Access to gym facilities", included: true },
          { name: "2 martial arts classes per week", included: true },
          { name: "Basic fitness assessment", included: true },
          { name: "Online workout resources", included: true },
          { name: "Access to all specialty classes", included: false },
          { name: "Personal training session", included: false },
          { name: "Nutrition consultation", included: false },
          { name: "Premium recovery amenities", included: false }
        ],
        cta: "Get Started"
      },
      {
        id: 2,
        name: "Premium",
        price: 119,
        period: "month",
        description: "Our most popular plan for dedicated martial artists and fitness enthusiasts.",
        recommended: true,
        features: [
          { name: "Unlimited gym access", included: true },
          { name: "Unlimited martial arts classes", included: true },
          { name: "Advanced fitness assessment", included: true },
          { name: "Online workout resources", included: true },
          { name: "Access to all specialty classes", included: true },
          { name: "1 personal training session/month", included: true },
          { name: "Basic nutrition guidance", included: true },
          { name: "Premium recovery amenities", included: false }
        ],
        cta: "Choose Premium"
      },
      {
        id: 3,
        name: "Elite",
        price: 169,
        period: "month",
        description: "The ultimate membership for those seeking maximum results and personalized attention.",
        features: [
          { name: "24/7 unlimited gym access", included: true },
          { name: "Unlimited classes across all programs", included: true },
          { name: "Comprehensive fitness profile", included: true },
          { name: "Premium online resources", included: true },
          { name: "Priority booking for all classes", included: true },
          { name: "2 personal training sessions/month", included: true },
          { name: "Personalized nutrition plan", included: true },
          { name: "Full access to recovery amenities", included: true }
        ],
        cta: "Choose Elite"
      }
    ],
    annual: [
      {
        id: 1,
        name: "Basic",
        price: 69,
        period: "month",
        description: "Perfect for beginners looking to start their fitness journey.",
        features: [
          { name: "Access to gym facilities", included: true },
          { name: "2 martial arts classes per week", included: true },
          { name: "Basic fitness assessment", included: true },
          { name: "Online workout resources", included: true },
          { name: "Access to all specialty classes", included: false },
          { name: "Personal training session", included: false },
          { name: "Nutrition consultation", included: false },
          { name: "Premium recovery amenities", included: false }
        ],
        cta: "Get Started"
      },
      {
        id: 2,
        name: "Premium",
        price: 99,
        period: "month",
        description: "Our most popular plan for dedicated martial artists and fitness enthusiasts.",
        recommended: true,
        features: [
          { name: "Unlimited gym access", included: true },
          { name: "Unlimited martial arts classes", included: true },
          { name: "Advanced fitness assessment", included: true },
          { name: "Online workout resources", included: true },
          { name: "Access to all specialty classes", included: true },
          { name: "1 personal training session/month", included: true },
          { name: "Basic nutrition guidance", included: true },
          { name: "Premium recovery amenities", included: false }
        ],
        cta: "Choose Premium"
      },
      {
        id: 3,
        name: "Elite",
        price: 149,
        period: "month",
        description: "The ultimate membership for those seeking maximum results and personalized attention.",
        features: [
          { name: "24/7 unlimited gym access", included: true },
          { name: "Unlimited classes across all programs", included: true },
          { name: "Comprehensive fitness profile", included: true },
          { name: "Premium online resources", included: true },
          { name: "Priority booking for all classes", included: true },
          { name: "2 personal training sessions/month", included: true },
          { name: "Personalized nutrition plan", included: true },
          { name: "Full access to recovery amenities", included: true }
        ],
        cta: "Choose Elite"
      }
    ]
  };
  
  const faqs = [
    {
      question: "Is there a joining fee?",
      answer: "We charge a one-time registration fee of $49 which covers your initial fitness assessment, orientation, and administrative costs. This fee is sometimes waived during promotional periods."
    },
    {
      question: "Can I freeze my membership?",
      answer: "Yes, memberships can be frozen for up to 3 months per year with a minimum freeze period of 2 weeks. A small maintenance fee of $10 per month applies during the freeze period."
    },
    {
      question: "Do you offer family discounts?",
      answer: "Yes! We offer a 10% discount on additional family memberships when two or more family members join. This applies to immediate family members living in the same household."
    },
    {
      question: "What is your cancellation policy?",
      answer: "Monthly memberships require 30 days written notice for cancellation. Annual memberships are non-refundable, but can be transferred to another person for a $50 transfer fee."
    },
    {
      question: "Are there age restrictions for memberships?",
      answer: "Our adult programs are for ages 16+. We offer specialized kids programs for children ages 4-15. Members under 18 require parental consent to join."
    },
    {
      question: "Can I try before I buy?",
      answer: "Absolutely! We offer a complimentary trial class for new members. Contact us to schedule your free session and experience YKFA firsthand."
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
              backgroundImage: "url('https://images.pexels.com/photos/4164766/pexels-photo-4164766.jpeg?auto=compress&cs=tinysrgb&w=1920')" 
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black"></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-sm">Membership Options</p>
            </div>
            <h1 className="mb-6">Invest in Your <span className="text-transparent bg-clip-text bg-gold-gradient">Transformation</span></h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl">
              Flexible membership options designed to fit your goals, schedule, and budget.
            </p>
          </div>
        </div>
      </section>

      {/* Membership Benefits */}
      <section className="section bg-dark-800">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
            <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-sm">Why Join YKFA</p>
            </div>
            <h2 className="mb-4">Membership <span className="text-transparent bg-clip-text bg-gold-gradient">Benefits</span></h2>
            <p className="text-gray-300">
              Becoming a YKFA member means joining a community dedicated to excellence and personal growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="card hover:bg-dark-700 transition-all animate-fade-up">
              <div className="bg-amber-400/20 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Instruction</h3>
              <p className="text-gray-400">
                Train with world-class instructors who provide personalized guidance and feedback to accelerate your progress.
              </p>
            </div>
            
            <div className="card hover:bg-dark-700 transition-all animate-fade-up">
              <div className="bg-amber-400/20 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Facilities</h3>
              <p className="text-gray-400">
                Access state-of-the-art training spaces, equipment, and amenities designed for optimal performance and recovery.
              </p>
            </div>
            
            <div className="card hover:bg-dark-700 transition-all animate-fade-up">
              <div className="bg-amber-400/20 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Flexible Scheduling</h3>
              <p className="text-gray-400">
                Choose from a wide range of class times and training options to fit your busy lifestyle and personal preferences.
              </p>
            </div>
            
            <div className="card hover:bg-dark-700 transition-all animate-fade-up">
              <div className="bg-amber-400/20 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Dumbbell className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Program Variety</h3>
              <p className="text-gray-400">
                Access multiple training disciplines under one roof, from traditional martial arts to modern fitness methodologies.
              </p>
            </div>
            
            <div className="card hover:bg-dark-700 transition-all animate-fade-up">
              <div className="bg-amber-400/20 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Supportive Community</h3>
              <p className="text-gray-400">
                Join a community of like-minded individuals who support and motivate each other on their fitness journeys.
              </p>
            </div>
            
            <div className="card hover:bg-dark-700 transition-all animate-fade-up">
              <div className="bg-amber-400/20 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Goal-Oriented Training</h3>
              <p className="text-gray-400">
                Receive personalized guidance to set and achieve your specific fitness and martial arts goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section bg-dark-900">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
            <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-sm">Pricing Plans</p>
            </div>
            <h2 className="mb-4">Choose Your <span className="text-transparent bg-clip-text bg-gold-gradient">Membership</span></h2>
            <p className="text-gray-300 mb-8">
              Select the plan that best fits your training goals and commitment level.
            </p>
            
            <div className="flex justify-center p-1 bg-dark-700 rounded-full max-w-xs mx-auto">
              <button 
                className={`w-1/2 py-2 px-4 rounded-full transition-all ${planDuration === 'monthly' ? 'bg-amber-400 text-black' : 'text-gray-400'}`}
                onClick={() => setPlanDuration('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`w-1/2 py-2 px-4 rounded-full transition-all ${planDuration === 'annual' ? 'bg-amber-400 text-black' : 'text-gray-400'}`}
                onClick={() => setPlanDuration('annual')}
              >
                Annual <span className="text-xs">(Save 15%)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            {pricingPlans[planDuration].map(plan => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
          
          <div className="text-center animate-fade-up">
            <p className="text-gray-400 flex items-center justify-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              Not sure which plan is right for you? <Link to="/contact" className="text-amber-400 hover:underline">Contact us</Link> for guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Special Memberships */}
      <section className="section bg-dark-800">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
            <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-sm">Special Options</p>
            </div>
            <h2 className="mb-4">Additional <span className="text-transparent bg-clip-text bg-gold-gradient">Membership</span> Options</h2>
            <p className="text-gray-300">
              We offer special memberships for specific groups and needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card hover:bg-dark-700 hover:shadow-gold animate-fade-up">
              <h3 className="text-xl font-bold mb-2">Family Membership</h3>
              <p className="text-gray-300 mb-4">
                Train together and save with our family membership options. Receive a 10% discount for each additional family member.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">Discounts for multiple family members</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">Access to both adult and kids programs</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">Shared personal training options</span>
                </li>
              </ul>
              <Link to="/contact" className="inline-flex items-center text-amber-400 hover:text-amber-300">
                Learn more <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            
            <div className="card hover:bg-dark-700 hover:shadow-gold animate-fade-up">
              <h3 className="text-xl font-bold mb-2">Student & Military</h3>
              <p className="text-gray-300 mb-4">
                We offer special discounted rates for students, active military personnel, and veterans with valid ID.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">15% discount on all membership plans</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">Flexible scheduling options</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">Semester-based payment options for students</span>
                </li>
              </ul>
              <Link to="/contact" className="inline-flex items-center text-amber-400 hover:text-amber-300">
                Learn more <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            
            <div className="card hover:bg-dark-700 hover:shadow-gold animate-fade-up">
              <h3 className="text-xl font-bold mb-2">Corporate Wellness</h3>
              <p className="text-gray-300 mb-4">
                Partner with us to bring fitness and martial arts training to your organization with special corporate rates.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">Discounted group rates for employees</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">On-site workshops and classes available</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">Custom wellness programs for your team</span>
                </li>
              </ul>
              <Link to="/contact" className="inline-flex items-center text-amber-400 hover:text-amber-300">
                Learn more <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            
            <div className="card hover:bg-dark-700 hover:shadow-gold animate-fade-up">
              <h3 className="text-xl font-bold mb-2">Senior Fitness</h3>
              <p className="text-gray-300 mb-4">
                Specialized programs for seniors focusing on mobility, strength, and balance with age-appropriate training.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">20% discount for members 65+</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">Modified exercises for joint health</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">Dedicated senior-friendly class times</span>
                </li>
              </ul>
              <Link to="/contact" className="inline-flex items-center text-amber-400 hover:text-amber-300">
                Learn more <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section bg-dark-900">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
            <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-sm">Questions</p>
            </div>
            <h2 className="mb-4">Frequently Asked <span className="text-transparent bg-clip-text bg-gold-gradient">Questions</span></h2>
            <p className="text-gray-300">
              Find answers to common questions about our memberships and policies.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <FAQ key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 relative">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-center bg-cover opacity-30"
            style={{ 
              backgroundImage: "url('https://images.pexels.com/photos/4162452/pexels-photo-4162452.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" 
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/70"></div>
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h2 className="mb-6">Ready to <span className="text-transparent bg-clip-text bg-gold-gradient">Join</span> Us?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Start your journey toward fitness and martial arts excellence today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn btn-primary">
                Join Now
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Book a Trial Class
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MembershipPage;