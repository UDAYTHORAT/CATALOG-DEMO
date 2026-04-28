'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const funnelSteps = [
  { icon: '🔗', label: 'Share your link', color: '#6366f1' },
  { icon: '❓', label: 'Visitor picks preferences', color: '#818cf8' },
  { icon: '💰', label: 'Budget filter', color: '#a855f7' },
  { icon: '🎯', label: 'Perfect match found', color: '#c084fc' },
  { icon: '💬', label: 'WhatsApp with message', color: '#25d366' },
];

export default function Hero() {
  return (
    <section className="section-hero relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-white/[0.03] animate-float-slow" />
        <div className="absolute bottom-10 -left-32 w-[400px] h-[400px] rounded-full bg-[#d2e823]/[0.04] animate-float-slow" style={{ animationDelay: '-10s' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10 w-full pt-28 pb-20 lg:pt-0 lg:pb-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-screen lg:py-32">
          <div className="max-w-xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-sm border border-white/[0.1] rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#d2e823] animate-pulse-soft" />
              <span className="text-xs font-semibold text-white/80 tracking-wide">Trusted by 500+ sellers</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-[2.75rem] sm:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] font-extrabold leading-[1.05] tracking-tight text-white">
              One smart link.
              <br />
              <span className="text-[#d2e823]">Infinite leads.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-lg lg:text-xl text-white/65 mt-7 leading-relaxed max-w-md">
              Guide every visitor through a visual decision flow — then send them to WhatsApp with a <span className="text-white font-medium">ready-to-buy message</span>.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link href="/signup" className="btn-lime px-8 py-4 text-base flex items-center justify-center gap-2 group">
                Get started free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#how-it-works" className="btn-outline-light px-8 py-4 text-base text-center">
                See how it works
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="flex flex-wrap items-center gap-6 mt-8">
              {['No credit card required', 'Setup in 2 minutes', 'Free forever'].map((text) => (
                <span key={text} className="flex items-center gap-2 text-xs text-white/50">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="rgba(210,232,35,0.2)" /><path d="M5 8l2 2 4-4" stroke="#d2e823" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {text}
                </span>
              ))}
            </motion.div>
          </div>

          <div className="hidden lg:flex justify-center">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} className="relative">
              <div className="absolute inset-0 -m-10 rounded-[2rem] bg-[#d2e823]/[0.04] blur-3xl" />
              <div className="relative bg-white/[0.06] backdrop-blur-md border border-white/[0.1] rounded-[2rem] p-8 w-[400px] shadow-2xl shadow-black/20">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-white/[0.08] rounded-full px-4 py-1.5 mb-3">
                    <span className="w-2 h-2 rounded-full bg-[#25d366] animate-pulse" />
                    <span className="text-[11px] font-semibold text-white/60 uppercase tracking-widest">Live Preview</span>
                  </div>
                  <p className="text-sm text-white/40">Your funnel in action</p>
                </div>
                <div className="space-y-0">
                  {funnelSteps.map((step, i) => (
                    <motion.div key={step.label} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                      <div className="flex items-center gap-4 py-3">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0" style={{ background: `${step.color}18`, border: `1px solid ${step.color}30` }}>{step.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{step.label}</p>
                          <p className="text-[11px] text-white/35">Step {i + 1}</p>
                        </div>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.0 + i * 0.12, type: 'spring' }} className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: `${step.color}20` }}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 6l2 2 4-4" stroke={step.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </motion.div>
                      </div>
                      {i < funnelSteps.length - 1 && (
                        <div className="flex justify-start ml-[22px]">
                          <motion.div initial={{ height: 0 }} animate={{ height: 14 }} transition={{ delay: 0.8 + i * 0.12, duration: 0.3 }} className="w-[2px] rounded-full" style={{ background: `linear-gradient(to bottom, ${step.color}40, ${funnelSteps[i + 1].color}40)` }} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.6 }} className="mt-8 pt-6 border-t border-white/[0.08] grid grid-cols-3 gap-4">
                  <div className="text-center"><p className="text-xl font-bold text-[#d2e823]">~10s</p><p className="text-[10px] text-white/35 mt-1">Avg. Time</p></div>
                  <div className="text-center"><p className="text-xl font-bold text-[#d2e823]">3x</p><p className="text-[10px] text-white/35 mt-1">More Leads</p></div>
                  <div className="text-center"><p className="text-xl font-bold text-[#d2e823]">0</p><p className="text-[10px] text-white/35 mt-1">Typing</p></div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full"><path d="M0 80V40C240 10 480 0 720 10C960 20 1200 50 1440 40V80H0Z" fill="#ffffff" /></svg>
      </div>
    </section>
  );
}
