'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const screens = [
  {
    id: 'entry',
    title: 'Entry Screen',
    content: (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/30">
          <span className="text-2xl">🛋️</span>
        </div>
        <h3 className="text-white text-lg font-bold mb-2">Find your perfect sofa</h3>
        <p className="text-white/50 text-xs mb-8">Answer a few quick questions</p>
        <div className="w-full max-w-[180px] py-3 rounded-full bg-[#d2e823] text-[#1a1a2e] text-sm font-bold shadow-lg shadow-[#d2e823]/30">Start →</div>
      </div>
    ),
  },
  {
    id: 'category',
    title: 'Select Category',
    content: (
      <div className="flex flex-col h-full px-5 pt-4">
        <p className="text-white/40 text-xs mb-1">Step 1 of 3</p>
        <h3 className="text-white text-base font-bold mb-5">What are you looking for?</h3>
        <div className="space-y-3">
          {[{ emoji: '🛋️', label: 'Sofa', active: true }, { emoji: '🛏️', label: 'Bed', active: false }, { emoji: '💺', label: 'Chair', active: false }].map((opt) => (
            <div key={opt.label} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${opt.active ? 'border-[#6366f1]/50 bg-[#6366f1]/15' : 'border-white/10 bg-white/[0.03]'}`}>
              <span className="text-xl">{opt.emoji}</span>
              <span className="text-white text-sm font-medium">{opt.label}</span>
              {opt.active && (<div className="ml-auto w-5 h-5 rounded-full bg-[#6366f1] flex items-center justify-center"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M3 6l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>)}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'budget',
    title: 'Select Budget',
    content: (
      <div className="flex flex-col h-full px-5 pt-4">
        <p className="text-white/40 text-xs mb-1">Step 2 of 3</p>
        <h3 className="text-white text-base font-bold mb-5">What is your budget?</h3>
        <div className="space-y-3">
          {[{ label: 'Under ₹30k', active: false }, { label: '₹30k – ₹50k', active: true }, { label: '₹50k+', active: false }].map((opt) => (
            <div key={opt.label} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${opt.active ? 'border-[#a855f7]/50 bg-[#a855f7]/15' : 'border-white/10 bg-white/[0.03]'}`}>
              <span className="text-xl">💰</span>
              <span className="text-white text-sm font-medium">{opt.label}</span>
              {opt.active && (<div className="ml-auto w-5 h-5 rounded-full bg-[#a855f7] flex items-center justify-center"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M3 6l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>)}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'results',
    title: 'Results',
    content: (
      <div className="flex flex-col h-full px-5 pt-4">
        <p className="text-white/40 text-xs mb-1">Best matches</p>
        <h3 className="text-white text-base font-bold mb-4">Your top picks 🎯</h3>
        <div className="space-y-3">
          <div className="p-3 rounded-xl border border-[#6366f1]/30 bg-[#6366f1]/10 relative">
            <div className="absolute -top-2 right-3 bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-[9px] text-white font-bold px-2 py-0.5 rounded-full">Best match</div>
            <div className="flex gap-3">
              <div className="w-14 h-14 rounded-lg bg-white/10 flex items-center justify-center text-2xl shrink-0">🛋️</div>
              <div>
                <p className="text-white text-xs font-semibold">Milano 3-Seater</p>
                <p className="text-white/40 text-[10px]">Modern • Fabric</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-white text-xs font-bold">₹42,000</span>
                  <span className="text-[#f59e0b] text-[10px]">⭐ 4.7</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 rounded-xl border border-white/10 bg-white/[0.03]">
            <div className="flex gap-3">
              <div className="w-14 h-14 rounded-lg bg-white/10 flex items-center justify-center text-2xl shrink-0">🛋️</div>
              <div>
                <p className="text-white text-xs font-semibold">Oslo L-Shape</p>
                <p className="text-white/40 text-[10px]">Classic • Leather</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-white text-xs font-bold">₹48,500</span>
                  <span className="text-[#f59e0b] text-[10px]">⭐ 4.5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 py-3 rounded-full bg-[#25d366] text-white text-center text-sm font-semibold shadow-lg shadow-[#25d366]/30">💬 Check on WhatsApp</div>
      </div>
    ),
  },
];

export default function DemoPreview() {
  const [activeScreen, setActiveScreen] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScreen((prev) => (prev + 1) % screens.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section-peach py-20 lg:py-28 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 bg-[#a855f7]/10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#a855f7]">Live Preview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1a1a2e]">
            See the funnel <span className="text-[#a855f7]">in action</span>
          </h2>
          <p className="text-gray-500 mt-4 text-lg max-w-xl mx-auto">
            This is exactly what your visitors experience. Fast, visual, and conversion-focused.
          </p>
        </motion.div>

        {/* Phone Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 -m-6 rounded-[3rem] animate-phone-glow" />
            <div className="relative w-[300px] h-[600px] rounded-[2.5rem] border-[3px] border-gray-800 bg-[#0f1729] overflow-hidden shadow-2xl shadow-black/30">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#0f1729] rounded-b-2xl z-20 flex items-center justify-center">
                <div className="w-12 h-3 rounded-full bg-white/10" />
              </div>
              <div className="relative z-10 flex justify-between items-center px-6 pt-2 pb-1">
                <span className="text-[10px] text-white/40 font-medium">9:41</span>
                <div className="flex gap-1">
                  <div className="w-3.5 h-[6px] rounded-sm bg-white/30" />
                  <div className="w-3.5 h-[6px] rounded-sm bg-white/20" />
                  <div className="w-3.5 h-[6px] rounded-sm bg-white/10" />
                </div>
              </div>
              <div className="relative h-[calc(100%-50px)] pt-4">
                <AnimatePresence mode="wait">
                  <motion.div key={screens[activeScreen].id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="h-full">
                    {screens[activeScreen].content}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-white/20" />
            </div>
          </div>
        </motion.div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {screens.map((screen, i) => (
            <button key={screen.id} onClick={() => setActiveScreen(i)} className={`h-2 rounded-full transition-all duration-300 ${i === activeScreen ? 'w-10 bg-[#a855f7]' : 'w-2 bg-gray-300 hover:bg-gray-400'}`} aria-label={`Go to ${screen.title}`} />
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 mt-3 font-medium">{screens[activeScreen].title}</p>
      </div>
    </section>
  );
}
