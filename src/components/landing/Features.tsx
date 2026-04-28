'use client';

import { motion } from 'framer-motion';
import { Smartphone, MousePointerClick, BarChart3, Palette } from 'lucide-react';

const features = [
  {
    tag: 'Create',
    title: 'Create and share your funnel in minutes',
    description: 'Set up your products, categories, and budget ranges. Get a single smart link that you can share on Instagram, WhatsApp status, or anywhere your audience is.',
    icon: Smartphone,
    bg: 'section-cream',
    textColor: 'text-[#1a1a2e]',
    accentColor: '#6366f1',
    cardBg: 'bg-white',
    mockup: (
      <div className="relative w-[280px] h-[480px] mx-auto">
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[#6366f1] to-[#a855f7] shadow-2xl shadow-indigo-500/20 p-3">
          <div className="w-full h-full rounded-[2rem] bg-[#0f1729] flex flex-col overflow-hidden">
            <div className="flex items-center justify-center pt-3 pb-2"><div className="w-20 h-4 rounded-full bg-white/10" /></div>
            <div className="flex-1 p-4 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center mb-4"><span className="text-2xl">🛋️</span></div>
              <p className="text-white font-bold text-sm mb-1">Find your perfect sofa</p>
              <p className="text-white/50 text-xs mb-6">Answer a few quick questions</p>
              <div className="w-full max-w-[160px] py-3 rounded-full bg-[#d2e823] text-[#1a1a2e] text-sm font-bold">Start →</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    tag: 'Guide',
    title: 'Zero friction. Just taps.',
    description: 'Visitors answer 2–3 quick questions. No typing, no sign-ups, no forms. They tap their preferences and we show them the perfect products — all in under 15 seconds.',
    icon: MousePointerClick,
    bg: 'section-lavender',
    textColor: 'text-[#1a1a2e]',
    accentColor: '#a855f7',
    cardBg: 'bg-white',
    mockup: (
      <div className="relative w-[280px] h-[480px] mx-auto">
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[#a855f7] to-[#6366f1] shadow-2xl shadow-purple-500/20 p-3">
          <div className="w-full h-full rounded-[2rem] bg-[#0f1729] flex flex-col overflow-hidden">
            <div className="flex items-center justify-center pt-3 pb-2"><div className="w-20 h-4 rounded-full bg-white/10" /></div>
            <div className="flex-1 p-5">
              <p className="text-white/50 text-xs mb-1">Step 1 of 3</p>
              <p className="text-white font-bold text-sm mb-5">What are you looking for?</p>
              <div className="space-y-3">
                {[{ e: '🛋️', l: 'Sofa', a: true }, { e: '🛏️', l: 'Bed', a: false }, { e: '💺', l: 'Chair', a: false }].map((o) => (
                  <div key={o.l} className={`flex items-center gap-3 p-3 rounded-xl border ${o.a ? 'border-[#a855f7]/60 bg-[#a855f7]/15' : 'border-white/10 bg-white/[0.03]'}`}>
                    <span className="text-lg">{o.e}</span>
                    <span className="text-white text-sm font-medium">{o.l}</span>
                    {o.a && <div className="ml-auto w-5 h-5 rounded-full bg-[#a855f7] flex items-center justify-center"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M3 6l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    tag: 'Convert',
    title: 'Analyze and keep optimizing',
    description: 'Track every step: views, clicks, drop-offs, and conversions. Know exactly where to optimize. Every lead arrives on WhatsApp with product, budget, and preference included.',
    icon: BarChart3,
    bg: 'section-mint',
    textColor: 'text-[#1a1a2e]',
    accentColor: '#22c55e',
    cardBg: 'bg-white',
    mockup: (
      <div className="relative w-[320px] mx-auto">
        <div className="bg-white rounded-2xl shadow-xl shadow-green-500/10 p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <p className="font-bold text-[#1a1a2e] text-sm">This Week</p>
            <div className="text-xs text-[#22c55e] font-semibold bg-[#22c55e]/10 px-2.5 py-1 rounded-full">↑ 24%</div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[{ l: 'Visitors', v: '1,247', c: '#6366f1' }, { l: 'Leads', v: '384', c: '#a855f7' }, { l: 'WhatsApp', v: '312', c: '#22c55e' }].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-lg font-extrabold" style={{ color: s.c }}>{s.v}</p>
                <p className="text-[10px] text-gray-400 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
          <div className="flex items-end gap-1 h-20">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%`, background: i === 5 ? '#22c55e' : '#e5e7eb' }} />
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

export default function Features() {
  return (
    <section id="features">
      {features.map((feature, index) => (
        <div key={feature.tag} className={`${feature.bg} py-20 lg:py-28`}>
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
              {/* Text */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
                className={index % 2 === 1 ? 'lg:col-start-2' : ''}
              >
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6" style={{ background: `${feature.accentColor}15` }}>
                  <feature.icon size={14} style={{ color: feature.accentColor }} />
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: feature.accentColor }}>{feature.tag}</span>
                </div>
                <h2 className={`text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold leading-tight tracking-tight ${feature.textColor} mb-5`}>{feature.title}</h2>
                <p className="text-base lg:text-lg text-gray-600 leading-relaxed max-w-lg mb-8">{feature.description}</p>
                <a href="/signup" className="btn-dark inline-flex items-center gap-2 px-7 py-3.5 text-sm group">
                  Get started free
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:translate-x-1 transition-transform"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              </motion.div>

              {/* Visual */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className={`flex justify-center ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}
              >
                {feature.mockup}
              </motion.div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
