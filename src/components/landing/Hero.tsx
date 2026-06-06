'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MessageCircle, X as XIcon } from 'lucide-react';

export default function Hero() {
  return (
    <section className="section-hero relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-white/[0.03] animate-float-slow" />
        <div className="absolute bottom-10 -left-32 w-[400px] h-[400px] rounded-full bg-indigo-500/[0.04] animate-float-slow" style={{ animationDelay: '-10s' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10 w-full pt-28 pb-20 lg:pt-0 lg:pb-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen lg:py-32">
          {/* Left — Copy */}
          <div className="max-w-xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-sm border border-white/[0.1] rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#25d366] animate-pulse-soft" />
              <span className="text-xs font-semibold text-white/80 tracking-wide">WhatsApp-first sales funnels</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-[2.5rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4.25rem] font-extrabold leading-[1.08] tracking-tight text-white">
              Stop getting
              <br />
              <span className="text-white/40 line-through decoration-red-400/60 decoration-2">&quot;price?&quot;</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">messages.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-lg text-white/55 mt-6 leading-relaxed max-w-md">
              Create one smart link. Visitors pick what they want, choose their budget, and land in your WhatsApp with a{' '}
              <span className="text-white font-medium">complete buying request</span>.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 mt-9">
              <Link href="/signup" className="btn-lime px-8 py-4 text-base flex items-center justify-center gap-2 group">
                Create your funnel — free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="flex flex-wrap items-center gap-5 mt-7">
              {['Free forever', '2 min setup', 'No coding'].map((text) => (
                <span key={text} className="flex items-center gap-1.5 text-xs text-white/40">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="rgba(99,102,241,0.2)" /><path d="M5 8l2 2 4-4" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {text}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right — Before vs After */}
          <div className="hidden lg:block">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} className="relative">
              <div className="absolute inset-0 -m-10 rounded-[2rem] bg-indigo-500/[0.06] blur-3xl" />
              <div className="relative space-y-4 w-[400px]">

                {/* WITHOUT FunnelLink */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.6 }} className="bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                      <XIcon size={12} className="text-red-400" />
                    </div>
                    <span className="text-[11px] font-bold text-red-400/80 uppercase tracking-wider">Without FunnelLink</span>
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3.5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center shrink-0"><span className="text-xs">👤</span></div>
                      <div className="bg-white/[0.06] rounded-xl rounded-tl-sm px-3.5 py-2.5">
                        <p className="text-sm text-white/70">price?</p>
                        <p className="text-[9px] text-white/20 mt-1">10:23 AM</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-white/25 mt-2 text-center">No context. No product. No budget. Dead lead.</p>
                </motion.div>

                {/* WITH FunnelLink */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.6 }} className="bg-white/[0.06] backdrop-blur-sm border border-[#25d366]/20 rounded-2xl p-5 relative">
                  <div className="absolute -top-2.5 right-4 bg-[#25d366] text-[9px] text-white font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">This is what you get</div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-[#25d366]/20 flex items-center justify-center">
                      <MessageCircle size={12} className="text-[#25d366]" />
                    </div>
                    <span className="text-[11px] font-bold text-[#25d366]/80 uppercase tracking-wider">With FunnelLink</span>
                  </div>
                  <div className="bg-[#dcf8c6]/[0.06] border border-[#25d366]/10 rounded-xl p-3.5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#25d366]/15 flex items-center justify-center shrink-0"><span className="text-xs">👤</span></div>
                      <div className="bg-[#25d366]/[0.08] rounded-xl rounded-tl-sm px-3.5 py-2.5 flex-1">
                        <p className="text-[12px] text-white/85 leading-relaxed">
                          Hi <span className="font-semibold">Urban Living</span>,
                        </p>
                        <p className="text-[12px] text-white/85 leading-relaxed mt-1.5">
                          I want a quote for <span className="font-semibold">Milano 3-Seater Sofa</span>
                        </p>
                        <p className="text-[12px] text-white/85 leading-relaxed mt-1.5">
                          Please share:<br />
                          1. Final factory price<br />
                          2. Customization options<br />
                          3. Delivery to my city
                        </p>
                        <p className="text-[9px] text-white/20 mt-2 text-right">10:23 AM ✓✓</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-[#25d366]/50 mt-2 text-center">Product, category, and requirements — ready to close.</p>
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
