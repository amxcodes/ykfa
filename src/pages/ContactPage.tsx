import { useState, FormEvent, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, SendIcon, CheckCircle } from 'lucide-react';

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
  
  // Add custom styling for select element
  useEffect(() => {
    // Target the select element and its options
    const customizeSelect = () => {
      const selectElement = document.getElementById('interest');
      if (selectElement) {
        // Apply styles to options via CSS
        const style = document.createElement('style');
        style.textContent = `
          #interest option {
            background-color: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 10px;
          }
          #interest option:hover {
            background-color: rgba(251, 191, 36, 0.2);
          }
          #interest option:checked {
            background-color: rgba(251, 191, 36, 0.3);
            color: rgb(251, 191, 36);
            font-weight: 500;
          }
        `;
        document.head.appendChild(style);
      }
    };
    
    customizeSelect();
    
    // Cleanup on component unmount
    return () => {
      const styles = document.head.querySelectorAll('style');
      styles.forEach(style => {
        if (style.textContent?.includes('#interest option')) {
          document.head.removeChild(style);
        }
      });
    };
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormError('Please fill in all required fields.');
      return;
    }
    
    // Format message for WhatsApp
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

    // Encode the message for WhatsApp URL
    const encodedMessage = encodeURIComponent(formattedMessage);
    
    // Create WhatsApp URL with the phone number +91 77364 88858
    const whatsappURL = `https://wa.me/917736488858?text=${encodedMessage}`;
    
    // For demo purposes, we'll set form submitted to true before redirecting
    setFormSubmitted(true);
    setFormError(''); // Clear any previous error messages
    
    // Redirect to WhatsApp after a short delay to show the success message
    setTimeout(() => {
      window.open(whatsappURL, '_blank');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-dark-900 to-dark-800 pt-24 pb-16">
      {/* Glassmorphic overlay */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container max-w-6xl mx-auto px-4">
        {/* Simple Header */}
        <div className="text-center mb-12 md:mb-16">
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">Touch</span></h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Have questions or ready to start your fitness journey? We're here to help you.
          </p>
        </div>

        {/* Contact Content */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Info Card */}
          <div className="lg:col-span-2">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 h-full">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <span className="bg-amber-400/20 p-2 rounded-lg mr-3">
                  <Mail className="w-5 h-5 text-amber-400" />
                </span>
                Contact Information
              </h2>
              
              <div className="space-y-6 text-gray-300">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-400/10 p-2 rounded-lg flex-shrink-0">
                    <MapPin className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Our Location</h3>
                    <p className="text-sm">Y&Y Arcade, Vp Marakkar Road, Edappally Po, Kochi 682024</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-amber-400/10 p-2 rounded-lg flex-shrink-0">
                    <Phone className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Phone Number</h3>
                    <p className="text-sm">+91 7736488858</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-amber-400/10 p-2 rounded-lg flex-shrink-0">
                    <Mail className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Email Address</h3>
                    <p className="text-sm">yaseenkfa@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-amber-400/10 p-2 rounded-lg flex-shrink-0">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Hours of Operation</h3>
                    <p className="text-sm">Monday - Saturday: 6:00 AM - 10:00 PM<br />
                   
                    Sunday: Closed</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="font-medium mb-3 text-white">Follow Us</h3>
                <div className="flex space-x-3">
                  <a href="#" className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-amber-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                  <a href="#" className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-amber-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="#" className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-amber-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form Card */}
          <div className="lg:col-span-3">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
              {formSubmitted ? (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-amber-400/20">
                    <CheckCircle className="w-8 h-8 text-amber-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Message Ready!</h2>
                  <p className="text-gray-300 mb-8 max-w-md mx-auto">
                    Your message is being redirected to our WhatsApp. Please complete the process in the WhatsApp window that will open.
                  </p>
                  <button 
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
                    className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-medium rounded-lg hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-6 flex items-center">
                    <span className="bg-amber-400/20 p-2 rounded-lg mr-3">
                      <SendIcon className="w-5 h-5 text-amber-400" />
                    </span>
                    Send Us a Message
                  </h2>
                  
                  {formError && (
                    <div className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                      {formError}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">Name *</label>
                        <input 
                          type="text" 
                          id="name" 
                          name="name" 
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">Email *</label>
                        <input 
                          type="email" 
                          id="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone</label>
                        <input 
                          type="tel" 
                          id="phone" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="interest" className="block text-sm font-medium mb-2">I'm interested in</label>
                        <div className="relative group">
                          <select 
                            id="interest" 
                            name="interest"
                            value={formData.interest}
                            onChange={handleChange}
                            className="w-full appearance-none bg-white/5 border border-white/10 rounded-lg p-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 hover:border-amber-400/30 group-hover:bg-white/[0.07] transition-all"
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
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-amber-400 group-hover:text-amber-300 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                      <input 
                        type="text" 
                        id="subject" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">Message *</label>
                      <textarea 
                        id="message" 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4} 
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all"
                        required
                      ></textarea>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-medium rounded-lg hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] transition-all flex items-center"
                    >
                      Send via WhatsApp
                      <SendIcon className="ml-2 w-4 h-4" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">Find Us</span> Here
          </h2>
          <div className="backdrop-blur-md bg-white/5 border border-amber-400/20 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(251,191,36,0.1)] transition-all hover:shadow-[0_0_35px_rgba(251,191,36,0.15)]">
            <div className="aspect-[16/9] w-full p-1">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.799007875132!2d76.30706187478484!3d10.033438272459017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080db13c8a2ebb%3A0x5d160de4e8d3440f!2sYaseen%E2%80%99s%20Karate%20%26%20Fitness%20Academy%20-%20YKFA%20(Since%202014)!5e0!3m2!1sen!2sin!4v1746354479225!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0, borderRadius: '12px' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Yaseen's Karate & Fitness Academy - YKFA (Since 2014) - Edappally, Kochi"
                className="rounded-xl shadow-lg"
              ></iframe>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <a 
              href="https://maps.app.goo.gl/iQtxQtAiXhDihKpc6" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;