'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import { Send, Check, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-ivory font-chubbo selection:bg-gold/20">
      <Header />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-20 bg-obsidian overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/sofa/room image.jpeg" 
            alt="Contact" 
            className="w-full h-full object-cover opacity-20 grayscale" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-obsidian/80 to-obsidian" />
        </div>
        
        <div className="relative max-w-[1400px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gold mb-6 block">Connect with the Studio</span>
            <h1 className="text-5xl md:text-[7vw] font-chubbo text-white tracking-tighter leading-none mb-8">
              Start an Enquiry
            </h1>
            <p className="text-white/40 text-sm md:text-lg font-light max-w-xl mx-auto">
              Whether you're looking for a signature piece or a bespoke commission, our team is here to guide your discovery.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT SECTION ── */}
      <section className="py-20 md:py-32 px-6 md:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            {/* Left: Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-16"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-chubbo tracking-tighter mb-8 text-obsidian">Our Ateliers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gold mb-3 block flex items-center gap-2">
                      <MapPin size={12} /> London
                    </span>
                    <p className="text-sm text-gray-500 leading-relaxed font-light">
                      24 Mayfair Gardens,<br />
                      London, W1K 2LH<br />
                      United Kingdom
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gold mb-3 block flex items-center gap-2">
                      <MapPin size={12} /> Milan
                    </span>
                    <p className="text-sm text-gray-500 leading-relaxed font-light">
                      Via della Spiga, 12,<br />
                      20121 Milano MI,<br />
                      Italy
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-chubbo tracking-tighter text-obsidian">Direct Access</h2>
                <div className="space-y-4">
                  <a href="mailto:studio@aurelian.com" className="group flex items-center gap-4 text-gray-500 hover:text-black transition-colors">
                    <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                      <Mail size={16} />
                    </div>
                    <span className="text-sm font-medium">studio@aurelian.com</span>
                  </a>
                  <a href="tel:+442079460958" className="group flex items-center gap-4 text-gray-500 hover:text-black transition-colors">
                    <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                      <Phone size={16} />
                    </div>
                    <span className="text-sm font-medium">+44 20 7946 0958</span>
                  </a>
                  <button className="group flex items-center gap-4 text-gray-500 hover:text-black transition-colors">
                    <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-all group-hover:border-[#25D366]">
                      <MessageCircle size={16} />
                    </div>
                    <span className="text-sm font-medium">Chat via WhatsApp</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white p-8 md:p-12 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-50 relative"
            >
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit} 
                    className="space-y-8"
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Full Name *</label>
                        <input 
                          required
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name" 
                          className="w-full bg-transparent border-b border-gray-100 py-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Email Address *</label>
                        <input 
                          required
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="email@example.com" 
                          className="w-full bg-transparent border-b border-gray-100 py-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-gray-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Phone Number *</label>
                      <input 
                        required
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+44 XXXX XXXXXX" 
                        className="w-full bg-transparent border-b border-gray-100 py-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Message (Optional)</label>
                      <textarea 
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your space or the piece you're interested in..." 
                        className="w-full bg-transparent border-b border-gray-100 py-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-gray-200 resize-none"
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full py-5 bg-black text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-gold transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                    >
                      {isSubmitting ? 'Transmitting...' : (
                        <>
                          Send Enquiry 
                          <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                    <p className="text-[9px] text-gray-300 text-center uppercase tracking-widest">
                      We aim to respond to all enquiries within 24 hours.
                    </p>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-20 flex flex-col items-center text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-8 border border-green-100">
                      <Check size={32} className="text-green-500" />
                    </div>
                    <h3 className="text-3xl font-chubbo tracking-tighter mb-4 text-obsidian">Message Received</h3>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto mb-10 font-light leading-relaxed">
                      Thank you for reaching out. A studio representative will be in contact with you shortly to discuss your enquiry.
                    </p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="text-[10px] font-black uppercase tracking-widest text-gold hover:text-black transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-20 border-t border-gray-100 px-6 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">
          Aurelian Studio © 2024 · All Rights Reserved
        </p>
      </footer>
    </main>
  );
}
