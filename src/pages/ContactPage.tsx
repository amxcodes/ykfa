import { useState, FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
    
    // In a real app, you'd send the form data to a server
    // For demo purposes, we'll simulate a successful submission
    setTimeout(() => {
      setFormSubmitted(true);
      setFormError('');
    }, 1000);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-black">
        <div className="absolute inset-0 z-0 bg-black">
          <div 
            className="absolute inset-0 bg-center bg-cover opacity-40"
            style={{ 
              backgroundImage: "url('https://images.pexels.com/photos/7045563/pexels-photo-7045563.jpeg?auto=compress&cs=tinysrgb&w=1920')" 
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black"></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-block mb-4 py-1 px-3 rounded-full bg-amber-400/20 border border-amber-400/30">
              <p className="text-amber-400 font-medium text-sm">Contact Us</p>
            </div>
            <h1 className="mb-6">Get in <span className="text-transparent bg-clip-text bg-gold-gradient">Touch</span></h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl">
              Have questions or ready to start your fitness journey? We're here to help you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="section bg-dark-800">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="md:col-span-1 animate-fade-up">
              <h2 className="text-2xl font-bold mb-6">Contact <span className="text-transparent bg-clip-text bg-gold-gradient">Information</span></h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-400/20 p-3 rounded-full flex-shrink-0">
                    <MapPin className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Our Location</h3>
                    <p className="text-gray-400">123 Fitness Street, City Center, NY 10001</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-amber-400/20 p-3 rounded-full flex-shrink-0">
                    <Phone className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone Number</h3>
                    <p className="text-gray-400">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-amber-400/20 p-3 rounded-full flex-shrink-0">
                    <Mail className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Address</h3>
                    <p className="text-gray-400">info@yaseensykfa.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-amber-400/20 p-3 rounded-full flex-shrink-0">
                    <Clock className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Hours of Operation</h3>
                    <p className="text-gray-400">Monday - Friday: 6:00 AM - 10:00 PM</p>
                    <p className="text-gray-400">Saturday: 8:00 AM - 8:00 PM</p>
                    <p className="text-gray-400">Sunday: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="bg-dark-700 p-2 rounded-full text-gray-400 hover:text-amber-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                  <a href="#" className="bg-dark-700 p-2 rounded-full text-gray-400 hover:text-amber-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="#" className="bg-dark-700 p-2 rounded-full text-gray-400 hover:text-amber-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="md:col-span-2 animate-fade-up">
              <div className="bg-dark-700 p-8 rounded-2xl">
                {formSubmitted ? (
                  <div className="text-center py-12">
                    <div className="flex justify-center mb-4">
                      <CheckCircle className="w-16 h-16 text-amber-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Message Sent Successfully!</h2>
                    <p className="text-gray-300 mb-8">
                      Thank you for reaching out. A member of our team will contact you shortly.
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
                      className="btn btn-primary"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-6">Send Us a <span className="text-transparent bg-clip-text bg-gold-gradient">Message</span></h2>
                    {formError && (
                      <div className="bg-error-100 border border-error-500 text-error-700 px-4 py-3 rounded mb-6">
                        {formError}
                      </div>
                    )}
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-2">Name *</label>
                          <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-dark-800 border border-dark-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
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
                            className="w-full bg-dark-800 border border-dark-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone</label>
                          <input 
                            type="tel" 
                            id="phone" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full bg-dark-800 border border-dark-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                          />
                        </div>
                        <div>
                          <label htmlFor="interest" className="block text-sm font-medium mb-2">I'm interested in</label>
                          <select 
                            id="interest" 
                            name="interest"
                            value={formData.interest}
                            onChange={handleChange}
                            className="w-full bg-dark-800 border border-dark-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                          >
                            <option value="General Inquiry">General Inquiry</option>
                            <option value="Membership">Membership</option>
                            <option value="Trial Class">Trial Class</option>
                            <option value="Karate Training">Karate Training</option>
                            <option value="Fitness Classes">Fitness Classes</option>
                            <option value="Kickboxing">Kickboxing</option>
                            <option value="Kids Program">Kids Program</option>
                            <option value="Personal Training">Personal Training</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                        <input 
                          type="text" 
                          id="subject" 
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full bg-dark-800 border border-dark-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="message" className="block text-sm font-medium mb-2">Message *</label>
                        <textarea 
                          id="message" 
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={5} 
                          className="w-full bg-dark-800 border border-dark-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                          required
                        ></textarea>
                      </div>
                      
                      <button type="submit" className="btn btn-primary w-full md:w-auto">
                        Send Message
                        <SendIcon className="ml-2 w-5 h-5" />
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-dark-900 pb-16">
        <div className="container">
          <div className="bg-dark-800 rounded-2xl overflow-hidden animate-fade-up">
            <div className="aspect-[16/9] w-full">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596552044!2d-74.25986763304324!3d40.69714941680757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1663852894296!5m2!1sen!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="YKFA Location"
              ></iframe>
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
              backgroundImage: "url('https://images.pexels.com/photos/4162421/pexels-photo-4162421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" 
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/70"></div>
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h2 className="mb-6">Start Your <span className="text-transparent bg-clip-text bg-gold-gradient">Journey</span> Today</h2>
            <p className="text-xl text-gray-300 mb-8">
              Ready to transform your life? Visit our academy and experience the YKFA difference.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/membership" className="btn btn-primary">
                View Memberships
              </Link>
              <Link to="/programs" className="btn btn-outline">
                Explore Programs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;