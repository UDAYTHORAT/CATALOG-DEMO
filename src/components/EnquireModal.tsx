'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Phone, Send, ChevronLeft, Check } from 'lucide-react';
import { Product } from '@/data/catalog';

/* ── CONFIG ── */
const BUSINESS_PHONE = '918722200100'; // WhatsApp / Call number
const BUSINESS_EMAIL = 'estrefurnitures@gmail.com'; // Owner email for enquiry forms

interface EnquireModalProps {
  product: Product;
  onClose: () => void;
}

type Screen = 'options' | 'form' | 'success';

export default function EnquireModal({ product, onClose }: EnquireModalProps) {
  const [screen, setScreen] = useState<Screen>('options');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  /* ── WHATSAPP ── */
  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Aurelian Studio! 👋\n\nI'm interested in the *${product.name}* (${product.category}).\n\n` +
      `📦 Product: ${product.name}\n` +
      `💰 Price: ${product.priceRange}\n` +
      `🪵 Material: ${product.materials[0]}\n` +
      `📐 Dimensions: ${product.dimensions.length}L × ${product.dimensions.width}W × ${product.dimensions.height}H cm\n\n` +
      `Could you please share more details, availability, and lead time?\n\nThank you!`
    );
    window.open(`https://wa.me/${BUSINESS_PHONE}?text=${text}`, '_blank');
  };

  /* ── CALL ── */
  const handleCall = () => {
    window.open(`tel:+${BUSINESS_PHONE}`, '_self');
  };

  /* ── FORM SUBMIT via mailto ── */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const subject = encodeURIComponent(`Enquiry: ${product.name} — Aurelian Studio`);
    const body = encodeURIComponent(
      `New Enquiry from Aurelian Website\n` +
      `${'─'.repeat(40)}\n\n` +
      `CUSTOMER DETAILS\n` +
      `Name:    ${name}\n` +
      `Email:   ${email}\n` +
      `Phone:   ${phone}\n\n` +
      `PRODUCT INTEREST\n` +
      `Product:    ${product.name}\n` +
      `Category:   ${product.category}\n` +
      `Price:      ${product.priceRange}\n` +
      `Material:   ${product.materials.join(', ')}\n` +
      `Finish:     ${product.finish}\n` +
      `Dimensions: ${product.dimensions.length}L × ${product.dimensions.width}W × ${product.dimensions.height}H cm\n` +
      `Lead Time:  ${product.leadTime}\n\n` +
      `MESSAGE\n` +
      `${message || '(No additional message)'}\n\n` +
      `${'─'.repeat(40)}\n` +
      `Sent from: aurelianstudio.com/catalog/${product.id}`
    );

    // Opens the user's mail client pre-filled with all info
    window.open(`mailto:${BUSINESS_EMAIL}?subject=${subject}&body=${body}`, '_blank');

    setTimeout(() => {
      setSubmitting(false);
      setScreen('success');
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[300] flex items-end md:items-center justify-center p-0 md:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full md:max-w-md bg-white md:rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Product header strip */}
        <div className="bg-black px-6 pt-8 pb-6 flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold block mb-1">{product.category}</span>
            <h3 className="text-3xl font-chubbo text-white tracking-tighter leading-none">{product.name}</h3>
            <p className="text-white/40 text-xs mt-1">{product.priceRange}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Screens */}
        <AnimatePresence mode="wait">

          {/* ── OPTIONS SCREEN ── */}
          {screen === 'options' && (
            <motion.div
              key="options"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.22 }}
              className="p-6 space-y-4"
            >
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">
                How would you like to connect?
              </p>

              {/* WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <MessageCircle size={22} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-black">WhatsApp</p>
                  <p className="text-[11px] text-gray-400">Chat instantly · Product info pre-filled</p>
                </div>
              </button>

              {/* Call */}
              <button
                onClick={handleCall}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-black hover:bg-black/5 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <Phone size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-black">Call Us</p>
                  <p className="text-[11px] text-gray-400">+91 87222 00100 · Mon–Sat 10am–7pm</p>
                </div>
              </button>

              {/* Send Enquiry Form */}
              <button
                onClick={() => setScreen('form')}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gold hover:bg-gold/5 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <Send size={18} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-black">Send an Enquiry</p>
                  <p className="text-[11px] text-gray-400">Fill a quick form · We'll call you back</p>
                </div>
              </button>

              <p className="text-center text-[10px] text-gray-300 pt-2">
                All enquiries are responded to within 24 hours
              </p>
            </motion.div>
          )}

          {/* ── FORM SCREEN ── */}
          {screen === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
              className="p-6"
            >
              <button
                onClick={() => setScreen('options')}
                className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-black transition-colors mb-5 font-black uppercase tracking-widest"
              >
                <ChevronLeft size={14} /> Back
              </button>

              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 mb-5">
                Your Details
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">Full Name *</label>
                  <input
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full border border-gray-200 px-4 py-3 text-sm rounded-lg focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">Email *</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full border border-gray-200 px-4 py-3 text-sm rounded-lg focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">Phone</label>
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full border border-gray-200 px-4 py-3 text-sm rounded-lg focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">Message</label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Any specific requirements or questions…"
                    className="w-full border border-gray-200 px-4 py-3 text-sm rounded-lg focus:outline-none focus:border-black transition-colors resize-none"
                  />
                </div>

                {/* Pre-filled product info shown to customer */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Enquiring About</p>
                  <p className="text-sm font-bold text-black">{product.name}</p>
                  <p className="text-[11px] text-gray-400">{product.priceRange} · {product.materials[0]}</p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gold transition-all active:scale-[0.98] rounded-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting ? 'Opening Mail…' : <>Send Enquiry <Send size={14} /></>}
                </button>

                <p className="text-center text-[10px] text-gray-300">
                  This will open your email app pre-filled with your enquiry
                </p>
              </form>
            </motion.div>
          )}

          {/* ── SUCCESS SCREEN ── */}
          {screen === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-10 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mb-6">
                <Check size={28} className="text-green-500" />
              </div>
              <h4 className="text-2xl font-chubbo tracking-tight mb-2">Enquiry Sent!</h4>
              <p className="text-sm text-gray-400 max-w-xs mb-8">
                Your enquiry for <span className="font-bold text-black">{product.name}</span> has been sent. We'll reach out within 24 hours.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleWhatsApp}
                  className="flex-1 py-3.5 bg-[#25D366] text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={14} /> WhatsApp
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 border border-gray-200 text-[10px] font-black uppercase tracking-widest rounded-sm hover:border-black transition-all"
                >
                  Done
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
