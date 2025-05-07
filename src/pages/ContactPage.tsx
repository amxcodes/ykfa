import { useState, useRef, FormEvent, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, SendIcon, ChevronRight, ArrowRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactPage = () => {
  const [searchParams] = useSearchParams();
  const programInterest = searchParams.get('program');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: programInterest || '',
    message: programInterest ? `I'm interested in learning more about the ${programInterest} program.` : '',
    interest: programInterest || 'General Inquiry'
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    // Add select styles
        const style = document.createElement('style');
        style.textContent = `
          #interest option {
        background-color: rgba(0, 0, 0, 0.95);
            color: white;
        padding: 12px;
          }
          #interest option:checked {
        background-color: rgba(251, 191, 36, 0.2);
            color: rgb(251, 191, 36);
          }
        `;
        document.head.appendChild(style);
    
    return () => {
          document.head.removeChild(style);
    };
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Prevent default context menu to avoid animation glitches on right-click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setFormError('Please fill in all required fields.');
      return;
    }
    
    const formattedMessage = `
*YKFA Contact Form Submission*
-----------------------------
*Name:* ${formData.name}
*Email:* ${formData.email}
*Phone:* ${formData.phone || 'Not provided'}
*Interest:* ${formData.interest}
*Subject:* ${formData.subject || 'Not provided'}
*Message:*
${formData.message}
-----------------------------
    `.trim();

    const encodedMessage = encodeURIComponent(formattedMessage);
    const whatsappURL = `https://wa.me/917736488858?text=${encodedMessage}`;
    
    setFormSubmitted(true);
    setFormError('');
    
    setTimeout(() => {
      window.open(whatsappURL, '_blank');
    }, 1500);
  };

  // Input field component with stable animation (no blinking on focus)
  const InputField = ({ index, name, label, type = "text", value, placeholder, required = false, as = "input", rows = 4 }: { 
    index: number, 
    name: string, 
    label: string, 
    type?: string, 
    value: string, 
    placeholder: string, 
    required?: boolean, 
    as?: "input" | "textarea" | "select",
    rows?: number
  }) => {
    const isFocused = focusedInput === name;
    const borderClass = isFocused ? 'border-amber-400' : 'border-white/20';
    const labelClass = isFocused ? 'text-amber-400' : 'text-white/60';

  return (
      <div className="relative">
        <div className={`relative border-b ${borderClass} transition-colors pb-2`}>
          {as === "input" && (
            <input 
              type={type} 
              id={name} 
              name={name} 
              value={value}
              onChange={handleChange}
              onFocus={() => setFocusedInput(name)}
              onBlur={() => setFocusedInput(null)}
              className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none pt-6"
              placeholder={placeholder}
              required={required}
            />
          )}
          
          {as === "textarea" && (
            <textarea 
              id={name} 
              name={name}
              value={value}
              onChange={handleChange}
              onFocus={() => setFocusedInput(name)}
              onBlur={() => setFocusedInput(null)}
              rows={rows} 
              className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none resize-none pt-6"
              placeholder={placeholder}
              required={required}
            ></textarea>
          )}
          
          {as === "select" && (
            <>
              <select 
                id={name} 
                name={name}
                value={value}
                onChange={handleChange}
                onFocus={() => setFocusedInput(name)}
                onBlur={() => setFocusedInput(null)}
                className="w-full appearance-none bg-transparent text-white focus:outline-none pt-6"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="MMA + GYM">MMA + GYM</option>
                <option value="MMA ONLY">MMA ONLY</option>
                <option value="GROUP FITNESS">GROUP FITNESS</option>
                <option value="KARATE">KARATE</option>
                <option value="GYM ONLY">GYM ONLY</option>
                <option value="PERSONAL TRAINING">PERSONAL TRAINING</option>
                <option value="Trial Class">Trial Class</option>
              </select>
              <ChevronRight className="absolute right-0 bottom-2 w-4 h-4 text-amber-400/70 rotate-90 pointer-events-none" />
            </>
          )}
          
          <label 
            htmlFor={name} 
            className={`absolute top-0 left-0 text-xs font-medium ${labelClass} transition-colors pointer-events-none`}
          >
            {label} {required && <span className="text-amber-400">*</span>}
          </label>
        </div>
      </div>
    );
  };

  // Contact card component for DRY code
  const ContactCard = ({ icon, title, content, href }: { 
    icon: React.ReactNode, 
    title: string, 
    content: React.ReactNode, 
    href?: string 
  }) => {
    const CardComponent = href ? 'a' : 'div';
    const hrefProps = href ? { href, target: "_blank", rel: "noopener noreferrer" } : {};
    
    return (
      <CardComponent 
        {...hrefProps}
        className={`block p-4 backdrop-blur-md bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.05] transition-all group`}
      >
        <div className="flex items-start gap-3">
          <div className="rounded-full p-2.5 bg-amber-400/10 text-amber-400">
            {icon}
                  </div>
          <div className="flex-1">
            <div className="flex items-center mb-0.5">
              <h3 className="font-medium text-white group-hover:text-amber-400 transition-colors text-sm">
                {title}
              </h3>
              {href && (
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </div>
              )}
                  </div>
            <div className="text-white/60 text-xs">{content}</div>
                  </div>
                </div>
      </CardComponent>
    );
  };

  return (
    <div className="bg-black text-white relative overflow-hidden">
      {/* Animated background gradients */}
      <motion.div 
        className="fixed inset-0 -z-10 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute top-0 right-0 w-[900px] h-[900px] rounded-full bg-amber-500/10 blur-[120px] translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] rounded-full bg-amber-500/5 blur-[100px] -translate-x-1/3 translate-y-1/4"></div>
      </motion.div>

      <div className="w-full">
        {/* Header */}
        <div className="pt-32 pb-8 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-2">
              <span className="relative">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">Let's Connect</span>
                <motion.span 
                  className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500/20 to-amber-400/10 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
                ></motion.span>
              </span>
            </h1>
                  </div>
                </div>
                
        {/* Contact Form and Info */}
        <div className="px-4 md:px-6 lg:px-8 pb-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Contact Info */}
            <div className="md:col-span-1">
              <div className="h-full backdrop-blur-md bg-white/[0.03] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
                  <div>
                  <h2 className="text-2xl font-bold mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">Contact</span> Us
                  </h2>
                  <p className="text-white/70 text-sm mb-6">
                    Have questions about our programs? Ready to start your fitness journey? We're here to help you transform your life through fitness and martial arts.
                  </p>
                  
                  <div className="grid gap-3">
                    <ContactCard 
                      icon={<MapPin className="w-4 h-4" />}
                      title="Our Location"
                      content="Y&Y Arcade, Vp Marakkar Road, Edappally Po, Kochi 682024"
                      href="https://maps.app.goo.gl/iQtxQtAiXhDihKpc6"
                    />
                    
                    <ContactCard 
                      icon={<Phone className="w-4 h-4" />}
                      title="Phone Number"
                      content="+91 7736488858"
                      href="tel:+917736488858"
                    />
                    
                    <ContactCard 
                      icon={<Mail className="w-4 h-4" />}
                      title="Email Address"
                      content="yaseenkfa@gmail.com"
                      href="mailto:yaseenkfa@gmail.com"
                    />
                    
                    <ContactCard 
                      icon={<Clock className="w-4 h-4" />}
                      title="Hours of Operation"
                      content={<>Monday - Saturday: 6:00 AM - 10:00 PM<br />Sunday: Closed</>}
                    />
                </div>
              </div>
              
                {/* Light decoration at bottom */}
                <div className="mt-6 h-1 bg-gradient-to-r from-amber-400/20 to-transparent rounded-full"></div>
            </div>
          </div>
          
            {/* Right Column: Form */}
            <div className="md:col-span-2">
              <div className="backdrop-blur-md bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden relative">
                {/* Accent corners */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-400/40 rounded-tl-3xl"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-400/40 rounded-br-3xl"></div>
                
                <AnimatePresence mode="wait">
              {formSubmitted ? (
                    <motion.div 
                      key="success"
                      className="p-10 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 mb-8 rounded-full bg-amber-400/10"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 260,
                          damping: 20
                        }}
                      >
                        <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-amber-400" />
                      </motion.div>
                      <motion.h2 
                        className="text-2xl md:text-3xl font-bold mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        Message Ready!
                      </motion.h2>
                      <motion.p 
                        className="text-gray-300 mb-10 max-w-md mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                    Your message is being redirected to our WhatsApp. Please complete the process in the WhatsApp window that will open.
                      </motion.p>
                      <motion.button 
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        subject: '',
                        message: '',
                        interest: 'General Inquiry'
                      });
                    }}
                        className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-medium rounded-xl hover:shadow-[0_0_25px_rgba(251,191,36,0.4)] transition-all"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                  >
                    Send Another Message
                      </motion.button>
                    </motion.div>
              ) : (
                    <div className="p-8">
                      <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <span className="bg-amber-400/20 p-2 rounded-lg mr-3">
                      <SendIcon className="w-5 h-5 text-amber-400" />
                    </span>
                    Send Us a Message
                  </h2>
                  
                      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">                   
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <InputField 
                            index={0}
                          name="name" 
                            label="Name"
                          value={formData.name}
                            placeholder="Your name"
                          required
                        />
                          
                          <InputField 
                            index={1}
                            name="email"
                            label="Email"
                          type="email" 
                          value={formData.email}
                            placeholder="your@email.com"
                          required
                        />
                    </div>
                    
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <InputField 
                            index={2}
                            name="phone"
                            label="Phone"
                          type="tel" 
                          value={formData.phone}
                            placeholder="Your phone number"
                        />
                          
                          <InputField 
                            index={3}
                            name="interest"
                            label="I'm interested in"
                            as="select"
                            value={formData.interest}
                            placeholder=""
                          />
                    </div>
                    
                        <InputField 
                          index={4}
                        name="subject"
                          label="Subject"
                        value={formData.subject}
                          placeholder="What's this about?"
                      />
                        
                        <InputField 
                          index={5}
                        name="message"
                          label="Message"
                          as="textarea"
                        value={formData.message}
                          placeholder="Your message here..."
                        required
                        />
                        
                        <AnimatePresence>
                          {formError && (
                            <motion.div 
                              className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.3 }}
                            >
                              {formError}
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        <div>
                          <motion.button 
                      type="submit" 
                            className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-medium rounded-xl hover:shadow-[0_0_25px_rgba(251,191,36,0.4)] transition-all flex items-center justify-center gap-2 group"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                    >
                      Send via WhatsApp
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                          </motion.button>
                        </div>
                  </form>
                    </div>
              )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
        
        {/* Map section in container matching form width */}
        <div className="px-4 md:px-6 lg:px-8 pb-16 pt-0 max-w-7xl mx-auto">
          <div className="backdrop-blur-md bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden">
            <div className="h-[450px] relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.799007875132!2d76.30706187478484!3d10.033438272459017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080db13c8a2ebb%3A0x5d160de4e8d3440f!2sYaseen%E2%80%99s%20Karate%20%26%20Fitness%20Academy%20-%20YKFA%20(Since%202014)!5e0!3m2!1sen!2sin!4v1746354479225!5m2!1sen!2sin" 
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Yaseen's Karate & Fitness Academy Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;