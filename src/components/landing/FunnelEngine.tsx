'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MousePointer2, Star, Check, MessageCircle, Zap } from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon, GoogleMapsIcon } from './Icons';
import { LeverSwitch } from '../ui/lever-switch';

// ATTIO STYLE FLOATING PILL COMPONENT
function Pill({ icon, text, borderColor, iconColor = "text-slate-500" }: { icon: React.ReactNode, text: string, borderColor: string, iconColor?: string }) {
  return (
    <div 
      className={`bg-white px-5 py-3 rounded-full border-[2.5px] ${borderColor} shadow-sm flex items-center gap-2.5 font-bold text-slate-800 text-sm hover:-translate-y-1 transition-transform cursor-default relative group`}
    >
      <div className={`${iconColor} group-hover:scale-110 transition-transform`}>{React.cloneElement(icon as React.ReactElement<any>, { size: 18 })}</div>
      {text}
    </div>
  );
}

// ATTIO STYLE DATA CARD COMPONENT
function DataCard({ icon, title, tag, value, desc, border="border-slate-200", highlight="text-[#2A5BEA] bg-[#2A5BEA]/10" }: any) {
  return (
    <div 
      className={`bg-white rounded-[24px] border border-slate-200 ${border !== 'border-slate-200' ? border : ''} shadow-[0_10px_30px_rgba(0,0,0,0.04)] w-[280px] p-5 hover:-translate-y-1 transition-transform`}
    >
      <div className="flex items-center justify-between mb-5">
        <div className={`flex items-center gap-2.5 font-bold text-slate-800 text-sm`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${highlight}`}>
            {React.cloneElement(icon as React.ReactElement<any>, { size: 16 })}
          </div>
          {title}
        </div>
        <div className="bg-slate-100 text-slate-500 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">{tag}</div>
      </div>
      <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-4 mb-4">
        <div className="text-[17px] font-black text-slate-900 tracking-tight">{value}</div>
      </div>
      <p className="text-[12px] font-medium text-slate-500 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

export default function FunnelEngine() {
  const [isActivated, setIsActivated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section id="flow-engine" className="relative w-full min-h-[500px] sm:min-h-[750px] lg:min-h-[1100px] pt-16 pb-20 md:pt-24 md:pb-32 border-t border-slate-100 overflow-hidden bg-slate-50 select-none satoshi-engine">
      <style>{`
        @font-face {
          font-family: 'Satoshi';
          src: url('/fonts/Satoshi-Variable.woff2') format('woff2'),
               url('/fonts/Satoshi-Variable.ttf') format('truetype');
          font-weight: 300 900;
          font-display: swap;
          font-style: normal;
        }
        .satoshi-engine, .satoshi-engine * {
          font-family: 'Satoshi', system-ui, sans-serif !important;
        }
      `}</style>
      <motion.div 
        animate={{ 
          y: isActivated ? 0 : "22vh",
          scale: isActivated ? 1 : 1.12
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center px-6 relative z-30 pointer-events-auto mb-16"
      >
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight flex flex-wrap items-center justify-center gap-x-1 md:gap-x-1.5 gap-y-1 text-[#0A0A0A] leading-tight">
          <span>The Funnel<span className={isActivated ? "text-[#2563eb] transition-colors duration-500" : "text-inherit transition-colors duration-500"}>Link</span></span>
          <span className="inline-block scale-60 md:scale-75 transform origin-center -translate-y-1 md:-translate-y-1.5 mx-[-4px] md:mx-[-8px] relative">
            <LeverSwitch 
              isActivated={isActivated}
              onChange={(state) => setIsActivated(state)}
            />
            {/* No emoji indicator */}
          </span>
          <span>Engine</span>
        </h2>
        <p className="mt-3 md:mt-4 text-sm md:text-base lg:text-lg font-light max-w-3xl mx-auto text-slate-600">
          Every click arrives with questions. <span className="text-[#0A0A0A] font-semibold">Funnel</span><span className="brand-gradient-text">Link</span> delivers the answers.
        </p>
      </motion.div>

      {/* Scalable Container for Absolute Positioning */}
      <div className="flex items-center justify-center relative overflow-visible w-full h-[460px] sm:h-[570px] md:h-[680px] lg:h-[800px] xl:h-[850px] px-4 md:px-6">
        <div className="relative w-[900px] h-[800px] md:w-[1000px] md:h-[850px] shrink-0 font-sans mx-auto scale-[0.58] sm:scale-[0.72] md:scale-[0.75] lg:scale-[0.9] xl:scale-100 origin-center -translate-x-8 sm:translate-x-0">
          
          {/* BACKGROUNDS (Moved outside to prevent mobile scaling redraw lag) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none rounded-[32px] overflow-hidden border border-slate-100 z-0">
            <div className="absolute top-0 left-0 right-0 h-[350px] bg-white border-b border-[#2A5BEA]/10" style={{ backgroundImage: 'linear-gradient(#f1f5f9 1px, transparent 1px), linear-gradient(90deg, #f1f5f9 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute bottom-0 left-0 right-0 h-[450px] bg-slate-50/50" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: isActivated ? 1 : 0,
              scale: isActivated ? 1 : 0.95
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full relative z-10" 
          >

          {/* SVG CONNECTING LINES */}
          <motion.svg 
            animate={{ opacity: isActivated ? 1 : 0 }}
            transition={{ duration: 0.4, delay: isActivated ? 0.6 : 0, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full pointer-events-none" 
            style={{ zIndex: 5 }}
          >
            {/* Lines from Top Pills to Center Logo */}
            {/* Website Ads to Logo (Shared) */}
            <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: isActivated ? 1 : 0 }} transition={{ duration: 0.6, delay: isActivated ? 0.8 : 0, ease: [0.25, 1, 0.5, 1] }} d="M 500 120 L 500.01 285" stroke="#cbd5e1" strokeWidth="2" fill="none" />

            {/* Laptop/Desktop SVG Connecting Paths */}
            {!isMobile && (
              <g>
                <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: isActivated ? 1 : 0 }} transition={{ duration: 0.6, delay: isActivated ? 0.95 : 0, ease: [0.25, 1, 0.5, 1] }} d="M 250 170 C 250 250, 480 250, 480 285" stroke="#cbd5e1" strokeWidth="2" fill="none" />
                <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: isActivated ? 1 : 0 }} transition={{ duration: 0.6, delay: isActivated ? 1.1 : 0, ease: [0.25, 1, 0.5, 1] }} d="M 750 170 C 750 250, 520 250, 520 285" stroke="#cbd5e1" strokeWidth="2" fill="none" />
                <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: isActivated ? 1 : 0 }} transition={{ duration: 0.6, delay: isActivated ? 1.25 : 0, ease: [0.25, 1, 0.5, 1] }} d="M 150 250 C 350 250, 440 295, 465 295" stroke="#cbd5e1" strokeWidth="2" fill="none" />
                <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: isActivated ? 1 : 0 }} transition={{ duration: 0.6, delay: isActivated ? 1.4 : 0, ease: [0.25, 1, 0.5, 1] }} d="M 850 250 C 650 250, 560 295, 535 295" stroke="#cbd5e1" strokeWidth="2" fill="none" />
              </g>
            )}

            {/* Mobile SVG Connecting Paths */}
            {isMobile && (
              <g>
                <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: isActivated ? 1 : 0 }} transition={{ duration: 0.6, delay: isActivated ? 0.95 : 0, ease: [0.25, 1, 0.5, 1] }} d="M 340 170 C 340 250, 480 250, 480 285" stroke="#cbd5e1" strokeWidth="2" fill="none" />
                <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: isActivated ? 1 : 0 }} transition={{ duration: 0.6, delay: isActivated ? 1.1 : 0, ease: [0.25, 1, 0.5, 1] }} d="M 660 170 C 660 250, 520 250, 520 285" stroke="#cbd5e1" strokeWidth="2" fill="none" />
                <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: isActivated ? 1 : 0 }} transition={{ duration: 0.6, delay: isActivated ? 1.25 : 0, ease: [0.25, 1, 0.5, 1] }} d="M 270 250 C 350 250, 440 295, 465 295" stroke="#cbd5e1" strokeWidth="2" fill="none" />
                <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: isActivated ? 1 : 0 }} transition={{ duration: 0.6, delay: isActivated ? 1.4 : 0, ease: [0.25, 1, 0.5, 1] }} d="M 730 250 C 650 250, 560 295, 535 295" stroke="#cbd5e1" strokeWidth="2" fill="none" />
              </g>
            )}

            {/* Lines from Center to Bottom Cards (Only when activated) */}
            {isActivated && (
              <>
                {/* Laptop/Desktop Bottom Paths & Highlights */}
                {!isMobile && (
                  <g>
                    <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 1.8, ease: [0.25, 1, 0.5, 1] }} d="M 500 395 L 500.01 450" stroke="#94a3b8" strokeWidth="2" fill="none" />
                    <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 2.0, ease: [0.25, 1, 0.5, 1] }} d="M 500.01 450 L 270 450 Q 250 450 250 470 L 250 500" stroke="#94a3b8" strokeWidth="2" fill="none" />
                    <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 2.0, ease: [0.25, 1, 0.5, 1] }} d="M 500.01 450 L 730 450 Q 750 450 750 470 L 750 500" stroke="#94a3b8" strokeWidth="2" fill="none" />
                    <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 2.2, ease: [0.25, 1, 0.5, 1] }} d="M 500.01 450 L 500.02 660" stroke="#94a3b8" strokeWidth="2" fill="none" />

                    {/* Highlight Overlays (Animating pulses for top paths) */}
                    <motion.path d="M 500 120 L 500.01 285" stroke="url(#roseGrad)" strokeWidth="3" fill="none" strokeDasharray="100 1000" animate={{ strokeDashoffset: [1100, -200] }} transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 0.8 }} />
                    <motion.path d="M 250 170 C 250 250, 480 250, 480 285" stroke="url(#pinkGrad)" strokeWidth="3" fill="none" strokeDasharray="100 1000" animate={{ strokeDashoffset: [1100, -200] }} transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 1.2 }} />
                    <motion.path d="M 750 170 C 750 250, 520 250, 520 285" stroke="url(#blueGrad)" strokeWidth="3" fill="none" strokeDasharray="100 1000" animate={{ strokeDashoffset: [1100, -200] }} transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 1.6 }} />
                    <motion.path d="M 150 250 C 350 250, 440 295, 465 295" stroke="url(#emeraldGrad)" strokeWidth="3" fill="none" strokeDasharray="100 1000" animate={{ strokeDashoffset: [1100, -200] }} transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 2.0 }} />
                    <motion.path d="M 850 250 C 650 250, 560 295, 535 295" stroke="url(#redGrad)" strokeWidth="3" fill="none" strokeDasharray="100 1000" animate={{ strokeDashoffset: [1100, -200] }} transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 2.4 }} />

                    {/* Highlight Overlays (Animating pulses for bottom paths) */}
                    <motion.path d="M 500 395 L 500.01 450 L 270 450 Q 250 450 250 470 L 250 500" stroke="url(#blueGrad)" strokeWidth="3" fill="none" strokeDasharray="100 1000" animate={{ strokeDashoffset: [1100, -200] }} transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 2.8 }} />
                    <motion.path d="M 500 395 L 500.01 450 L 730 450 Q 750 450 750 470 L 750 500" stroke="url(#blueGrad)" strokeWidth="3" fill="none" strokeDasharray="100 1000" animate={{ strokeDashoffset: [1100, -200] }} transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 3.2 }} />
                    <motion.path d="M 500 395 L 500.01 660" stroke="url(#greenGrad)" strokeWidth="4" fill="none" strokeDasharray="100 1000" animate={{ strokeDashoffset: [1100, -200] }} transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 3.6 }} />
                  </g>
                )}

                {/* Mobile Bottom Paths & Highlights */}
                {isMobile && (
                  <g>
                    <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 1.8, ease: [0.25, 1, 0.5, 1] }} d="M 500 395 L 500.01 420" stroke="#94a3b8" strokeWidth="2" fill="none" />
                    <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 2.0, ease: [0.25, 1, 0.5, 1] }} d="M 500.01 420 L 330 420 Q 310 420 310 435 L 310 470" stroke="#94a3b8" strokeWidth="2" fill="none" />
                    <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 2.0, ease: [0.25, 1, 0.5, 1] }} d="M 500.01 420 L 670 420 Q 690 420 690 435 L 690 470" stroke="#94a3b8" strokeWidth="2" fill="none" />
                    <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 2.2, ease: [0.25, 1, 0.5, 1] }} d="M 500.01 420 L 500.02 690" stroke="#94a3b8" strokeWidth="2" fill="none" />

                    {/* Highlight Overlays (Animating pulses for top paths) */}
                    <motion.path d="M 500 120 L 500.01 285" stroke="url(#roseGrad)" strokeWidth="3" fill="none" strokeDasharray="100 1000" animate={{ strokeDashoffset: [1100, -200] }} transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 0.8 }} />
                    <motion.path d="M 340 170 C 340 250, 480 250, 480 285" stroke="url(#pinkGrad)" strokeWidth="3" fill="none" strokeDasharray="100 1000" animate={{ strokeDashoffset: [1100, -200] }} transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 1.2 }} />
                    <motion.path d="M 660 170 C 660 250, 520 250, 520 285" stroke="url(#blueGrad)" strokeWidth="3" fill="none" strokeDasharray="100 1000" animate={{ strokeDashoffset: [1100, -200] }} transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 1.6 }} />
                    <motion.path d="M 270 250 C 350 250, 440 295, 465 295" stroke="url(#emeraldGrad)" strokeWidth="3" fill="none" strokeDasharray="100 1000" animate={{ strokeDashoffset: [1100, -200] }} transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 2.0 }} />
                    <motion.path d="M 730 250 C 650 250, 560 295, 535 295" stroke="url(#redGrad)" strokeWidth="3" fill="none" strokeDasharray="100 1000" animate={{ strokeDashoffset: [1100, -200] }} transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 2.4 }} />

                    {/* Highlight Overlays (Animating pulses for bottom paths) */}
                    <motion.path d="M 500 395 L 500.01 420 L 330 420 Q 310 420 310 435 L 310 470" stroke="url(#blueGrad)" strokeWidth="3" fill="none" strokeDasharray="100 1000" animate={{ strokeDashoffset: [1100, -200] }} transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 2.8 }} />
                    <motion.path d="M 500 395 L 500.01 420 L 670 420 Q 690 420 690 435 L 690 470" stroke="url(#blueGrad)" strokeWidth="3" fill="none" strokeDasharray="100 1000" animate={{ strokeDashoffset: [1100, -200] }} transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 3.2 }} />
                    <motion.path d="M 500 395 L 500.01 690" stroke="url(#greenGrad)" strokeWidth="4" fill="none" strokeDasharray="100 1000" animate={{ strokeDashoffset: [1100, -200] }} transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 3.6 }} />
                  </g>
                )}
              </>
            )}

            <defs>
              <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0"/>
                <stop offset="50%" stopColor="#f43f5e" stopOpacity="1"/>
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="pinkGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0"/>
                <stop offset="50%" stopColor="#ec4899" stopOpacity="1"/>
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2A5BEA" stopOpacity="0"/>
                <stop offset="50%" stopColor="#4E3BDA" stopOpacity="1"/>
                <stop offset="100%" stopColor="#7A44E8" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="emeraldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0"/>
                <stop offset="50%" stopColor="#10b981" stopOpacity="1"/>
                <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="redGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0"/>
                <stop offset="50%" stopColor="#ef4444" stopOpacity="1"/>
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0"/>
                <stop offset="50%" stopColor="#22c55e" stopOpacity="1"/>
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="purpleGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0"/>
                <stop offset="50%" stopColor="#a855f7" stopOpacity="1"/>
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
              </linearGradient>
            </defs>
          </motion.svg>

          {/* --- TOP PILLS (TRAFFIC SOURCES) - Appear sequentially when activated --- */}
          <motion.div 
            animate={{ opacity: isActivated ? 1 : 0, y: isActivated ? 0 : 20 }}
            transition={{ duration: 0.5, delay: isActivated ? 0.3 : 0, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[100px] left-[500px] -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <Pill icon={<MousePointer2/>} text="Website Ads" borderColor="border-slate-200" iconColor="text-slate-600" />
          </motion.div>
          <motion.div 
            animate={{ opacity: isActivated ? 1 : 0, y: isActivated ? 0 : 20 }}
            transition={{ duration: 0.5, delay: isActivated ? 0.4 : 0, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[150px] left-[340px] md:left-[250px] -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <Pill icon={<InstagramIcon/>} text="Instagram" borderColor="border-pink-200" iconColor="text-pink-600" />
          </motion.div>
          <motion.div 
            animate={{ opacity: isActivated ? 1 : 0, y: isActivated ? 0 : 20 }}
            transition={{ duration: 0.5, delay: isActivated ? 0.5 : 0, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[150px] left-[660px] md:left-[750px] -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <Pill icon={<FacebookIcon/>} text="Facebook" borderColor="border-[#2A5BEA]/30" iconColor="text-[#2A5BEA]" />
          </motion.div>
          <motion.div 
            animate={{ opacity: isActivated ? 1 : 0, y: isActivated ? 0 : 20 }}
            transition={{ duration: 0.5, delay: isActivated ? 0.6 : 0, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[250px] left-[270px] md:left-[150px] -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <Pill icon={<GoogleMapsIcon/>} text="Google Maps" borderColor="border-emerald-200" iconColor="text-emerald-600" />
          </motion.div>
          <motion.div 
            animate={{ opacity: isActivated ? 1 : 0, y: isActivated ? 0 : 20 }}
            transition={{ duration: 0.5, delay: isActivated ? 0.7 : 0, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[250px] left-[730px] md:left-[850px] -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <Pill icon={<YoutubeIcon/>} text="YouTube" borderColor="border-red-200" iconColor="text-red-600" />
          </motion.div>

          {/* --- CENTER slot placeholder shown when deactivated --- */}
          <motion.div 
            animate={{ opacity: isActivated ? 0 : 1, scale: isActivated ? 0.8 : 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[350px] left-[500px] -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <div className="w-28 h-28 rounded-[32px] border-2 border-dashed border-slate-300 bg-white/80 flex flex-col items-center justify-center text-slate-400 select-none shadow-[inset_0_4px_12px_rgba(0,0,0,0.02)]">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Offline</span>
            </div>
          </motion.div>
 
          {/* --- CENTER: FUNNELLINK LOGO (shown when activated) --- */}
          <motion.div 
            animate={{ scale: isActivated ? 1 : 0.5, opacity: isActivated ? 1 : 0, rotate: isActivated ? 0 : 180 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: isActivated ? 1.2 : 0 }}
            className="absolute top-[340px] left-[500px] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
            style={{ pointerEvents: isActivated ? 'auto' : 'none' }}
          >
            <motion.div 
              animate={{
                boxShadow: isActivated 
                  ? ['0 0 20px rgba(59,130,246,0.3)', '0 0 40px rgba(59,130,246,0.5)', '0 0 20px rgba(59,130,246,0.3)']
                  : '0 0 0px rgba(0,0,0,0)'
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-28 h-28 bg-white rounded-[32px] shadow-[0_20px_50px_rgba(42,91,234,0.15)] border-2 border-[#2A5BEA]/20 flex items-center justify-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#2A5BEA]/5 to-[#4E3BDA]/5 opacity-50"></div>
              <motion.img 
                src="/logo.jpeg" 
                animate={{ scale: isActivated ? 1 : 0.8, opacity: isActivated ? 1 : 0.5 }}
                transition={{ duration: 0.6, delay: isActivated ? 1.2 : 0 }}
                className="w-14 h-14 object-contain mix-blend-multiply relative z-10" 
                alt="FunnelLink" 
              />
            </motion.div>
          </motion.div>
 
          {/* Glowing background aura behind the logo when activated */}
          <motion.div 
            animate={{ 
              opacity: isActivated ? 0.8 : 0,
              scale: isActivated ? 1.3 : 0.8
            }}
            transition={{ duration: 0.5, ease: "easeOut", delay: isActivated ? 1.2 : 0 }}
            className="absolute top-[340px] left-[500px] -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#2A5BEA]/20 blur-2xl rounded-full pointer-events-none z-10"
          />
 
          {/* --- BOTTOM CARDS (OUTCOMES - Reveal dynamically when activated) --- */}
          <div className="absolute top-[470px] md:top-[500px] left-[310px] md:left-[250px] -translate-x-1/2 z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isActivated ? 1 : 0, y: isActivated ? 0 : 30 }}
              transition={{ duration: 0.5, delay: isActivated ? 2.4 : 0, ease: [0.16, 1, 0.3, 1] }}
            >
              <DataCard 
                icon={<Star fill="currentColor" />} 
                title="Answers" 
                tag="Step 1" 
                value="Customer Questions Solved" 
                desc="Pricing, reviews, photos, location, FAQs, and everything customers need before reaching out."
              />
            </motion.div>
          </div>
 
          <div className="absolute top-[470px] md:top-[500px] left-[690px] md:left-[750px] -translate-x-1/2 z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isActivated ? 1 : 0, y: isActivated ? 0 : 30 }}
              transition={{ duration: 0.5, delay: isActivated ? 2.5 : 0, ease: [0.16, 1, 0.3, 1] }}
            >
              <DataCard 
                icon={<Check />} 
                title="Trust" 
                tag="Step 2" 
                value="Confidence Built" 
                desc="Customers understand the business, see proof, and feel ready to move forward."
              />
            </motion.div>
          </div>
 
          <div className="absolute top-[690px] md:top-[660px] left-[500px] -translate-x-1/2 z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isActivated ? 1 : 0, y: isActivated ? 0 : 30 }}
              transition={{ duration: 0.5, delay: isActivated ? 2.6 : 0, ease: [0.16, 1, 0.3, 1] }}
            >
              <DataCard 
                icon={<MessageCircle fill="currentColor" />} 
                title="Action" 
                tag="Conversion" 
                value="Ready-To-Buy Customers" 
                desc="Conversations begin with informed customers instead of endless questions."
                border="border-[#25D366]/40" 
                highlight="text-[#25D366] bg-[#25D366]/10" 
              />
            </motion.div>
          </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
