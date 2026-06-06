'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Sofa, Home, Coffee, MessageCircle } from 'lucide-react';

type IndustryKey = 'furniture' | 'realestate' | 'cafe';

const demos: Record<IndustryKey, { label: string; icon: typeof Sofa; accent: string; screens: { title: string; content: React.ReactNode }[] }> = {
  furniture: {
    label: 'Furniture',
    icon: Sofa,
    accent: '#3b82f6',
    screens: [
      {
        title: 'Welcome',
        content: (
          <div className="flex flex-col items-center justify-center h-full px-5 text-center bg-[#f7f3ec]">
            <div className="w-12 h-12 rounded-2xl bg-[#111] text-white flex items-center justify-center mb-4"><span className="text-xl">🛋️</span></div>
            <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold mb-1">Urban Living</p>
            <p className="text-base font-extrabold text-[#111] mb-1">Find Your Perfect Sofa</p>
            <p className="text-[11px] text-black/50 mb-6">Factory-direct prices on WhatsApp</p>
            <div className="px-8 py-2.5 rounded-full bg-[#111] text-white text-xs font-bold">Browse Collection →</div>
          </div>
        ),
      },
      {
        title: 'Category',
        content: (
          <div className="flex flex-col h-full px-5 pt-5 bg-[#f7f3ec]">
            <p className="text-sm font-extrabold text-[#111] mb-4">What are you looking for?</p>
            {[{ e: '🛋️', l: 'Luxury Sofas', a: true }, { e: '🛏️', l: 'Beds', a: false }, { e: '🪑', l: 'Dining', a: false }].map((o) => (
              <div key={o.l} className={`flex items-center gap-3 p-3 rounded-xl border mb-2 ${o.a ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                <span className="text-lg">{o.e}</span>
                <span className="text-xs font-semibold text-[#111]">{o.l}</span>
                {o.a && <div className="ml-auto w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center"><svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M3 6l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>}
              </div>
            ))}
          </div>
        ),
      },
      {
        title: 'WhatsApp',
        content: (
          <div className="flex flex-col h-full px-5 pt-5 bg-[#f7f3ec]">
            <p className="text-sm font-extrabold text-[#111] mb-3">Milano 3-Seater</p>
            <div className="bg-white rounded-xl border border-gray-100 p-3 mb-3">
              <p className="text-[10px] text-gray-500">Sheesham Wood · Italian Foam</p>
              <p className="text-sm font-bold text-blue-600 mt-1">₹42,000</p>
            </div>
            <div className="py-2.5 rounded-full bg-[#25d366] text-white text-center text-xs font-bold flex items-center justify-center gap-1">
              <MessageCircle size={13} /> Get Price on WhatsApp
            </div>
          </div>
        ),
      },
    ],
  },
  realestate: {
    label: 'Real Estate',
    icon: Home,
    accent: '#9A7B44',
    screens: [
      {
        title: 'Welcome',
        content: (
          <div className="flex flex-col items-center justify-center h-full px-5 text-center bg-[#FAF9F5]">
            <div className="w-12 h-12 rounded-2xl bg-[#9A7B44] text-white flex items-center justify-center mb-4"><span className="text-xl">🏢</span></div>
            <p className="text-[10px] uppercase tracking-widest text-[#9A7B44] font-bold mb-1">Aurelia Residences</p>
            <p className="text-base font-extrabold text-[#1C1917] mb-1">Own the Skyline</p>
            <p className="text-[11px] text-black/50 mb-6">RERA Approved · Starting ₹2.9 Cr</p>
            <div className="px-8 py-2.5 rounded-full bg-[#9A7B44] text-white text-xs font-bold">View Residences →</div>
          </div>
        ),
      },
      {
        title: 'Unit Select',
        content: (
          <div className="flex flex-col h-full px-5 pt-5 bg-[#FAF9F5]">
            <p className="text-sm font-extrabold text-[#1C1917] mb-4">Select your home</p>
            {[{ e: '✨', l: 'Sky Villa — 4 BHK', a: true }, { e: '🏡', l: 'Family — 3 BHK', a: false }].map((o) => (
              <div key={o.l} className={`flex items-center gap-3 p-3 rounded-xl border mb-2 ${o.a ? 'border-[#9A7B44] bg-[#9A7B44]/10' : 'border-gray-200 bg-white'}`}>
                <span className="text-lg">{o.e}</span>
                <span className="text-xs font-semibold text-[#1C1917]">{o.l}</span>
                {o.a && <div className="ml-auto w-4 h-4 rounded-full bg-[#9A7B44] flex items-center justify-center"><svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M3 6l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>}
              </div>
            ))}
          </div>
        ),
      },
      {
        title: 'WhatsApp',
        content: (
          <div className="flex flex-col h-full px-5 pt-5 bg-[#FAF9F5]">
            <p className="text-sm font-extrabold text-[#1C1917] mb-3">Sky Villa — 4 BHK</p>
            <div className="bg-white rounded-xl border border-gray-100 p-3 mb-3">
              <p className="text-[10px] text-gray-500">3,200 sqft · Double Height Living</p>
              <p className="text-sm font-bold text-[#9A7B44] mt-1">Starting ₹2.9 Cr</p>
            </div>
            <div className="py-2.5 rounded-full bg-[#25d366] text-white text-center text-xs font-bold flex items-center justify-center gap-1">
              <MessageCircle size={13} /> Get Floor Plan
            </div>
          </div>
        ),
      },
    ],
  },
  cafe: {
    label: 'Café',
    icon: Coffee,
    accent: '#C4713B',
    screens: [
      {
        title: 'Welcome',
        content: (
          <div className="flex flex-col items-center justify-center h-full px-5 text-center bg-[#FBF9F6]">
            <div className="w-12 h-12 rounded-2xl bg-[#C4713B] text-white flex items-center justify-center mb-4"><span className="text-xl">☕</span></div>
            <p className="text-[10px] uppercase tracking-widest text-[#C4713B] font-bold mb-1">Kaffestuggu</p>
            <p className="text-base font-extrabold text-[#2C1810] mb-1">Artisanal Brewing</p>
            <p className="text-[11px] text-black/50 mb-6">Est. 1914 · The Oldest Eatery in Town</p>
            <div className="px-8 py-2.5 rounded-full bg-[#C4713B] text-white text-xs font-bold">View Menu →</div>
          </div>
        ),
      },
      {
        title: 'Pre-order',
        content: (
          <div className="flex flex-col h-full px-5 pt-5 bg-[#FBF9F6]">
            <p className="text-sm font-extrabold text-[#2C1810] mb-3">Add to your order</p>
            {[{ e: '🥐', n: 'Butter Croissant', p: '$2.50', on: true }, { e: '☕', n: 'Caramel Latte', p: '$4.20', on: true }, { e: '🥑', n: 'Avocado Toast', p: '$6.50', on: false }].map((i) => (
              <div key={i.n} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-100 mb-1.5">
                <span className="text-base">{i.e}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold truncate">{i.n}</p>
                  <p className="text-[8px] text-gray-400">{i.p}</p>
                </div>
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${i.on ? 'text-[#C4713B] bg-[#C4713B]/10' : 'text-gray-400 bg-gray-50'}`}>{i.on ? '✓' : '+'}</span>
              </div>
            ))}
          </div>
        ),
      },
      {
        title: 'Reserve',
        content: (
          <div className="flex flex-col h-full px-5 pt-5 bg-[#FBF9F6]">
            <p className="text-sm font-extrabold text-[#2C1810] mb-3">Reservation Summary</p>
            <div className="bg-white rounded-xl border border-gray-100 p-3 mb-3">
              <p className="text-[10px] text-gray-500">2 items · Table for 2 · Today 7 PM</p>
              <p className="text-sm font-bold text-[#C4713B] mt-1">$6.70 pre-order</p>
            </div>
            <div className="py-2.5 rounded-full bg-[#25d366] text-white text-center text-xs font-bold flex items-center justify-center gap-1">
              <MessageCircle size={13} /> Reserve on WhatsApp
            </div>
          </div>
        ),
      },
    ],
  },
};

export default function DemoPreview() {
  const [tab, setTab] = useState<IndustryKey>('furniture');
  const [screen, setScreen] = useState(0);
  const demo = demos[tab];

  useEffect(() => {
    const timer = setInterval(() => setScreen((s) => (s + 1) % demo.screens.length), 3000);
    return () => clearInterval(timer);
  }, [tab, demo.screens.length]);

  return (
    <section className="py-20 lg:py-28 bg-slate-50 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1a1a2e]">
            See it in action
          </h2>
          <p className="text-gray-500 mt-3 text-base max-w-md mx-auto">
            Watch how a visitor goes from opening your link to messaging you on WhatsApp.
          </p>
        </div>

        {/* Industry tabs */}
        <div className="flex justify-center gap-2 mb-14">
          {(Object.keys(demos) as IndustryKey[]).map((key) => {
            const d = demos[key];
            const Icon = d.icon;
            return (
              <button
                key={key}
                onClick={() => { setTab(key); setScreen(0); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                  tab === key
                    ? 'bg-[#1a1a2e] border-[#1a1a2e] text-white shadow-md'
                    : 'bg-white border-slate-200 text-gray-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={15} />
                {d.label}
              </button>
            );
          })}
        </div>

        {/* Phone + step labels */}
        <div className="flex flex-col items-center">
          {/* Step dots */}
          <div className="flex items-center gap-3 mb-8">
            {demo.screens.map((s, i) => (
              <button
                key={s.title}
                onClick={() => setScreen(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  screen === i
                    ? 'bg-white shadow-md text-[#1a1a2e] border border-slate-200'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${screen === i ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{i + 1}</span>
                {s.title}
              </button>
            ))}
          </div>

          {/* Phone */}
          <div className="relative">
            <div className="absolute inset-0 -m-4 rounded-[3rem] blur-2xl transition-colors duration-500" style={{ backgroundColor: `${demo.accent}20` }} />
            <div className="relative w-[280px] h-[520px] rounded-[2.5rem] border-[4px] border-gray-800 bg-gray-900 overflow-hidden shadow-2xl">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-900 rounded-b-xl z-20 flex items-center justify-center">
                <div className="w-10 h-2.5 rounded-full bg-white/10" />
              </div>
              {/* Status */}
              <div className="relative z-10 flex justify-between items-center px-6 pt-2 pb-0.5">
                <span className="text-[9px] text-gray-500 font-semibold">9:41</span>
                <div className="flex gap-1"><div className="w-3 h-[5px] rounded-sm bg-gray-600" /><div className="w-3 h-[5px] rounded-sm bg-gray-700" /></div>
              </div>
              {/* Content */}
              <div className="h-[calc(100%-40px)] pt-2 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${tab}-${screen}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="h-full"
                  >
                    {demo.screens[screen].content}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
