'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  X, Check, MessageCircle, AlertTriangle, ArrowRight, 
  Sparkles, ShieldCheck, CheckCheck, Send
} from 'lucide-react';
import Link from 'next/link';

const INJECTED_STYLES = `
  .bg-grid-theme {
      background-size: 60px 60px;
      background-image: 
          linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  /* Physical Card with Dynamic Mouse Lighting */
  .premium-depth-card {
      background: linear-gradient(145deg, #0f1423 0%, #04060c 100%);
      box-shadow: 
          0 50px 120px -30px rgba(0, 0, 0, 0.95),
          0 25px 50px -20px rgba(0, 0, 0, 0.85),
          inset 0 1px 2px rgba(255, 255, 255, 0.12),
          inset 0 -2px 4px rgba(0, 0, 0, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.05);
      position: relative;
  }

  .card-sheen {
      position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
      background: radial-gradient(1000px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.07) 0%, transparent 45%);
      mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  /* Realistic iPhone Mockup Bezel (Scaled up) */
  .iphone-bezel {
      background-color: #111;
      box-shadow: 
          inset 0 0 0 2.5px #52525B, 
          inset 0 0 0 8px #000, 
          0 50px 100px -20px rgba(0,0,0,0.95),
          0 20px 35px -8px rgba(0,0,0,0.8);
      transform-style: preserve-3d;
  }

  .hardware-btn {
      background: linear-gradient(90deg, #404040 0%, #171717 100%);
      box-shadow: 
          -2px 0 5px rgba(0,0,0,0.8),
          inset -1px 0 1px rgba(255,255,255,0.15),
          inset 1px 0 2px rgba(0,0,0,0.8);
      border-left: 1px solid rgba(255,255,255,0.05);
  }
  
  .screen-glare {
      background: linear-gradient(110deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 45%);
  }

  .widget-depth {
      background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
      box-shadow: 
          0 10px 20px rgba(0,0,0,0.3),
          inset 0 1px 1px rgba(255,255,255,0.05),
          inset 0 -1px 1px rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.03);
  }

  .floating-ui-badge {
      background: rgba(255, 255, 255, 0.04);
      backdrop-filter: blur(28px); 
      -webkit-backdrop-filter: blur(28px);
      box-shadow: 
          0 0 0 1px rgba(255, 255, 255, 0.08),
          0 30px 60px -15px rgba(0, 0, 0, 0.85),
          inset 0 1px 1.5px rgba(255,255,255,0.15),
          inset 0 -1px 1.5px rgba(0,0,0,0.6);
  }
`;

export default function Hero() {
  const [flowType, setFlowType] = useState<'direct' | 'funnellink'>('direct');
  const [subPhase, setSubPhase] = useState<number>(0); // 0 = Ad, 1 = Config/Chat, 2 = Result

  const mainCardRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  // 1. High-Performance Mouse Interaction Tilt Logic with Floating Badges Support
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 1.5) return;

      cancelAnimationFrame(requestRef.current);
      
      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          
          mainCardRef.current.style.setProperty("--mouse-x", `${mouseX}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${mouseY}px`);

          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;

          gsap.to(mockupRef.current, {
            rotationY: xVal * 15,
            rotationX: -yVal * 15,
            ease: 'power3.out',
            duration: 1.2,
          });

          // Also tilt floating badges slightly for parallax effect
          gsap.to(".floating-badge", {
            x: xVal * 15,
            y: yVal * 15,
            ease: 'power3.out',
            duration: 1.5,
            stagger: 0.05
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // 2. 10-Second Auto-Playing Loop Transitions
  useEffect(() => {
    const timer = setInterval(() => {
      setSubPhase((prev) => {
        if (prev < 2) {
          return prev + 1;
        } else {
          // Toggle flow types
          setFlowType((prevFlow) => (prevFlow === 'direct' ? 'funnellink' : 'direct'));
          return 0;
        }
      });
    }, 4500); // 4.5 seconds per sub-phase for extra readability

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-[#070b14] text-white pt-24 pb-20 lg:pt-36 lg:pb-28 relative overflow-hidden flex flex-col items-center justify-center min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-50" aria-hidden="true" />

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] rounded-full bg-indigo-500/[0.04] blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.04] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10 w-full text-center flex flex-col items-center">
        
        {/* Pitch Headline */}
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider font-mono">Real-Time Visualization</span>
          </motion.div>

          <h1 className="text-4xl sm:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.05] tracking-tight text-white mb-6">
            Stop getting raw
            <br />
            <span className="text-white/45 line-through decoration-red-500/60 decoration-2">&quot;price?&quot;</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
              messages.
            </span>
          </h1>
        </div>

        {/* Dynamic Status Bar (Active Flow Toggle) */}
        <div className="mb-12 inline-flex p-1 bg-white/5 border border-white/10 rounded-full z-20 shadow-xl">
          <button
            onClick={() => { setFlowType('direct'); setSubPhase(0); }}
            className={`px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              flowType === 'direct'
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/15'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <AlertTriangle size={15} />
            Traditional Way (Chaos)
          </button>
          <button
            onClick={() => { setFlowType('funnellink'); setSubPhase(0); }}
            className={`px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              flowType === 'funnellink'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/15'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles size={15} />
            FunnelLink Way (Order)
          </button>
        </div>

        {/* MOUSE-LIT INTERACTIVE DEPTH CARD (Bigger: max-w-6xl, min-h-[600px]) */}
        <div 
          ref={mainCardRef}
          className="premium-depth-card w-full max-w-5xl rounded-[40px] p-8 lg:p-16 flex flex-col items-center justify-center transition-all duration-300 relative border border-white/5 overflow-visible min-h-[580px]"
          style={{ perspective: "1500px" }}
        >
          <div className="card-sheen" aria-hidden="true" />
          
          <div className="grid lg:grid-cols-12 gap-12 items-center z-10 w-full relative">
            
            {/* LEFT SIDE: Flow Status Information (Bigger text, cleaner layout) */}
            <div className="lg:col-span-6 text-left space-y-6 flex flex-col justify-center">
              <span className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-black ${flowType === 'direct' ? 'text-red-400' : 'text-emerald-400'}`}>
                {flowType === 'direct' ? <AlertTriangle size={14} /> : <Sparkles size={14} />}
                {flowType === 'direct' ? 'Direct Instagram Ads' : 'Optimized Qualified Link'}
              </span>
              
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-white leading-[1.1]">
                {flowType === 'direct' 
                  ? 'Typing identical specifications manual leads to ghosting.' 
                  : 'Buyers visual-select customize options first.'
                }
              </h2>

              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-light">
                {flowType === 'direct'
                  ? 'Without a qualification step, 90% of Instagram ad leads land on WhatsApp as a generic price inquiry. Answering size, wood, and location questions for every lead manually leads to friction, delays, and ghosted customers.'
                  : 'With FunnelLink, you showcase product customizations right in the browser. Buyers tap sizing and finish specifications before opening their chat, landing as qualified leads you can invoice instantly.'
                }
              </p>

              {/* Progress dots bar */}
              <div className="pt-4 flex items-center gap-3.5 border-t border-white/5">
                <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Simulator Timeline</span>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div 
                      key={i} 
                      className={`w-5 h-2 rounded-full transition-all duration-300 ${
                        subPhase === i 
                          ? flowType === 'funnellink' ? 'bg-emerald-500 scale-105' : 'bg-red-500 scale-105'
                          : 'bg-neutral-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Centered BIG Mockup Phone with floating parallax badges */}
            <div className="lg:col-span-6 flex justify-center items-center w-full relative" style={{ perspective: "1200px" }}>
              
              {/* Floating Glass Badges (3D parallax effect) */}
              <div className="floating-badge absolute flex -top-4 -left-6 floating-ui-badge rounded-2xl p-4 items-center gap-3 z-30 pointer-events-none transition-transform duration-300">
                <div className="w-10 h-10 rounded-full bg-gradient-to-b from-red-500/20 to-red-900/10 flex items-center justify-center border border-red-400/30 shadow-inner">
                  <span className="text-lg">🔥</span>
                </div>
                <div className="text-left">
                  <p className="text-white text-xs font-bold tracking-tight">
                    {flowType === 'direct' ? '12 Threads Open' : '10s Qualification'}
                  </p>
                  <p className="text-neutral-400 text-[10px]">
                    {flowType === 'direct' ? 'Typing manually...' : 'Zero typing required'}
                  </p>
                </div>
              </div>

              <div className="floating-badge absolute flex -bottom-6 -right-6 floating-ui-badge rounded-2xl p-4 items-center gap-3 z-30 pointer-events-none transition-transform duration-300">
                <div className="w-10 h-10 rounded-full bg-gradient-to-b from-indigo-500/20 to-indigo-900/10 flex items-center justify-center border border-indigo-400/30 shadow-inner">
                  <span className="text-lg">🤝</span>
                </div>
                <div className="text-left">
                  <p className="text-white text-xs font-bold tracking-tight">
                    {flowType === 'direct' ? '90% Ghost Rate' : '100% ROI Tracking'}
                  </p>
                  <p className="text-neutral-400 text-[10px]">
                    {flowType === 'direct' ? 'Leads drop off' : 'Paid invoice linked'}
                  </p>
                </div>
              </div>

              {/* iPhone Bezel (Sized up: 310px wide, 630px high) */}
              <div
                ref={mockupRef}
                className="relative w-[310px] h-[630px] rounded-[3.3rem] iphone-bezel flex flex-col will-change-transform transform-style-3d z-10"
              >
                {/* Physical Bezel Hardware Buttons */}
                <div className="absolute top-[120px] -left-[3px] w-[3px] h-[28px] hardware-btn rounded-l-md" aria-hidden="true" />
                <div className="absolute top-[165px] -left-[3px] w-[3px] h-[48px] hardware-btn rounded-l-md" aria-hidden="true" />
                <div className="absolute top-[225px] -left-[3px] w-[3px] h-[48px] hardware-btn rounded-l-md" aria-hidden="true" />
                <div className="absolute top-[175px] -right-[3px] w-[3px] h-[75px] hardware-btn rounded-r-md scale-x-[-1]" aria-hidden="true" />

                {/* Inner Screen Container */}
                <div className="absolute inset-[8px] bg-[#050914] rounded-[2.9rem] overflow-hidden shadow-[inset_0_0_15px_rgba(0,0,0,1)] text-white z-10">
                  <div className="absolute inset-0 screen-glare z-45 pointer-events-none" aria-hidden="true" />

                  {/* Dynamic Island Notch */}
                  <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[100px] h-[26px] bg-black rounded-full z-50 flex items-center justify-center border border-white/5">
                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${flowType === 'funnellink' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                    <span className="text-[6.5px] text-neutral-400 uppercase font-black tracking-widest">
                      {flowType === 'direct' ? 'Chaos Active' : 'Funnel Active'}
                    </span>
                  </div>

                  {/* Inside Screen Content (Fitted layout sizes) */}
                  <div className="relative w-full h-full pt-10 pb-4 text-[10px] text-white">
                    <AnimatePresence mode="wait">

                      {/* SUB-PHASE 0: INSTAGRAM AD CLICK */}
                      {subPhase === 0 && (
                        <motion.div
                          key="sub0"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 p-5 flex flex-col justify-between bg-[#050914]"
                        >
                          {/* Insta Header */}
                          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-fuchsia-600 flex items-center justify-center font-bold text-[8px]">UL</div>
                              <p className="font-extrabold text-[9.5px] leading-none">urbanliving_sofas</p>
                            </div>
                            <span className="text-neutral-400 text-sm">•••</span>
                          </div>

                          {/* Image */}
                          <div className="aspect-square bg-gradient-to-br from-indigo-950/70 to-slate-900 rounded-2xl flex items-center justify-center relative shadow-inner my-2">
                            <span className="text-4xl">🛋️</span>
                            <div className="absolute top-3.5 right-3.5 bg-indigo-600 text-[6.5px] px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wide shadow-md">Milano Sofa</div>
                          </div>

                          {/* Action CTA */}
                          <div className="flex-grow flex flex-col justify-between pt-2">
                            <p className="text-[8.5px] text-neutral-300 leading-snug">
                              Customize wood finish, select sizing options & calculate factory rates immediately.
                            </p>
                            
                            <div className="relative mt-2">
                              <div className={`w-full py-3 rounded-xl text-center text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg transition-colors ${
                                flowType === 'funnellink' ? 'bg-indigo-600' : 'bg-red-500'
                              }`}>
                                {flowType === 'funnellink' ? 'Configure sofa specifications' : 'Message on WhatsApp'}
                              </div>
                              {/* Tapping Indicator Pointer */}
                              <motion.div 
                                animate={{ scale: [1, 0.82, 1], y: [0, -3, 0] }}
                                transition={{ repeat: Infinity, duration: 1.2 }}
                                className="absolute -bottom-2 right-10 w-8 h-8 rounded-full bg-white/20 border border-white/50 flex items-center justify-center shadow-2xl pointer-events-none"
                              >
                                <span className="text-xs">👆</span>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* SUB-PHASE 1: CHAOTIC MESSAGES VS CONFIGURATOR SELECTION */}
                      {subPhase === 1 && (
                        <motion.div
                          key="sub1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex flex-col"
                        >
                          {flowType === 'direct' ? (
                            /* WHATSAPP CHAOS */
                            <div className="absolute inset-0 p-5 flex flex-col justify-between bg-[#0a0e1a]">
                              <div className="border-b border-white/5 pb-2.5 mb-2.5">
                                <p className="font-bold text-white text-[10.5px]">WhatsApp Inbox (12 Unread)</p>
                              </div>
                              
                              <div className="space-y-3.5 flex-grow overflow-y-auto pt-1">
                                <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="bg-neutral-800 rounded-xl p-2 max-w-[85%] text-left">
                                  <p className="font-bold text-red-400 text-[7px]">Buyer A:</p>
                                  <p className="text-[9px] text-neutral-200">price?</p>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="bg-neutral-800 rounded-xl p-2 max-w-[85%] text-left">
                                  <p className="font-bold text-red-400 text-[7px]">Buyer B:</p>
                                  <p className="text-[9px] text-neutral-200">What wood type is it? Send photos?</p>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4 }} className="bg-neutral-800 rounded-xl p-2 max-w-[85%] text-left">
                                  <p className="font-bold text-red-400 text-[7px]">Buyer C:</p>
                                  <p className="text-[9px] text-neutral-200">Is delivery free to Bangalore?</p>
                                </motion.div>
                              </div>

                              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2.5 text-center mt-2">
                                <p className="text-[8px] text-red-400 font-extrabold">Typing size & prices manually...</p>
                              </div>
                            </div>
                          ) : (
                            /* CONFIGURATOR */
                            <div className="absolute inset-0 p-5 flex flex-col justify-between bg-[#FAF9F5] text-neutral-800">
                              <div>
                                <div className="border-b border-gray-150 pb-2 flex justify-between items-center text-[7px] text-gray-400">
                                  <span>funnellink.com/urban-living</span>
                                  <span>🔒</span>
                                </div>
                                <p className="font-black text-neutral-900 text-[11px] mt-3">Milano 3-Seater Sofa</p>
                                
                                <div className="space-y-3 mt-4">
                                  <div>
                                    <span className="text-[7.5px] text-gray-400 font-bold block mb-1 uppercase tracking-wider">Wood Finish</span>
                                    <div className="grid grid-cols-2 gap-2">
                                      <motion.div 
                                        animate={{ scale: [1, 1.04, 1], borderColor: ['#e2e8f0', '#4f46e5', '#e2e8f0'] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="border border-indigo-600 bg-indigo-50/50 rounded-lg py-1.5 text-center font-bold text-[8px] text-indigo-700 shadow-sm"
                                      >
                                        Teakwood Finish ✓
                                      </motion.div>
                                      <div className="border border-gray-200 rounded-lg py-1.5 text-center text-[8px] text-gray-400">Sheesham Finish</div>
                                    </div>
                                  </div>

                                  <div>
                                    <span className="text-[7.5px] text-gray-400 font-bold block mb-1 uppercase tracking-wider">Length Choice</span>
                                    <div className="grid grid-cols-3 gap-2">
                                      <div className="border border-gray-200 rounded-lg py-1.5 text-center text-[7.5px] text-gray-400">6 Ft</div>
                                      <motion.div 
                                        animate={{ scale: [1, 1.04, 1], borderColor: ['#e2e8f0', '#4f46e5', '#e2e8f0'] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                                        className="border border-indigo-600 bg-indigo-50/50 rounded-lg py-1.5 text-center font-bold text-[8px] text-indigo-700 shadow-sm"
                                      >
                                        8 Ft ✓
                                      </motion.div>
                                      <div className="border border-gray-200 rounded-lg py-1.5 text-center text-[7.5px] text-gray-400">10 Ft</div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-[#25d366] text-white font-black text-center py-3 rounded-xl text-[9px] flex items-center justify-center gap-1.5 shadow-md mt-2">
                                <MessageCircle size={10} />
                                <span>Get Custom Price Quote</span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* SUB-PHASE 2: BOUNCED LEAD VS PAID DEAL */}
                      {subPhase === 2 && (
                        <motion.div
                          key="sub2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex flex-col p-5 bg-[#0a0e1a] text-white"
                        >
                          {flowType === 'direct' ? (
                            /* GHOSTED */
                            <div className="absolute inset-0 p-5 flex flex-col justify-between">
                              <div>
                                <p className="font-bold border-b border-white/5 pb-2.5 text-[9.5px]">WhatsApp Chat</p>
                                <div className="space-y-3 mt-3">
                                  <div className="bg-neutral-800 rounded-xl p-2 max-w-[80%] text-[8.5px] text-left">
                                    <p>price?</p>
                                  </div>
                                  <div className="bg-indigo-950/40 border border-white/5 rounded-xl p-2 max-w-[85%] ml-auto text-[8.5px] text-left">
                                    <p className="text-neutral-300">Milano starts at ₹38,000 for standard Sheesham finish.</p>
                                  </div>
                                  <div className="bg-neutral-800 rounded-xl p-2 max-w-[80%] text-[8.5px] text-left">
                                    <p>ok thanks</p>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 text-center mb-2">
                                <span className="text-xl">🔇</span>
                                <p className="font-black text-red-400 uppercase text-[10.5px] mt-1.5 leading-none">Buyer Ghosted</p>
                                <p className="text-[8px] text-neutral-400 mt-1 leading-snug">Lead lost. 4 hours wasted with zero conversions.</p>
                              </div>
                            </div>
                          ) : (
                            /* SALE COMPLETED */
                            <div className="absolute inset-0 p-5 flex flex-col justify-between">
                              <div>
                                <p className="font-bold border-b border-white/5 pb-2.5 text-[9.5px]">WhatsApp Chat</p>
                                <div className="space-y-3 mt-3">
                                  <div className="bg-[#dcf8c6]/[0.08] border border-[#25d366]/20 rounded-xl p-2.5 text-[8px] text-left">
                                    <p className="font-bold text-emerald-400 mb-0.5">Custom Configuration:</p>
                                    <p className="text-neutral-300 leading-snug">• Wood: Teakwood Finish<br />• Sizing: 8 Feet Length<br />• Location: Bangalore</p>
                                  </div>
                                  <div className="bg-indigo-600/20 border border-indigo-500/25 rounded-xl p-2.5 text-[8px] max-w-[85%] ml-auto text-left">
                                    <p className="text-neutral-300">Perfect choice! Total with shipping: ₹45,500. Click to pay: invoice.pay/confirm</p>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-2xl p-4 text-center mb-2">
                                <span className="text-xl">🎉</span>
                                <p className="font-black text-emerald-400 uppercase text-[10.5px] mt-1.5 leading-none">Order Paid</p>
                                <p className="text-[8px] text-neutral-400 mt-1 leading-snug">Order verified, lead qualified and paid in seconds.</p>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                    </AnimatePresence>
                    
                    {/* Home Indicator line */}
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/20 rounded-full z-45" />
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Core Value Pillars Grid */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-left">
            <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-2">
              <AlertTriangle size={15} /> Stop Chat Chaos
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              No more manual price lists, specs sheets, or shipping options copy-pasted. Buyers get details visual catalog format first.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-left">
            <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-2">
              <Sparkles size={15} /> Sell Instantly
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Receiving high-intent pre-filled message formats lets you directly send quotations and invoice payments immediately.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-left">
            <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-2">
              <ShieldCheck size={15} /> ROI Attribution
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Identify which visual customization configurations and ads generated messages. Direct tracking leads to ROI transparency.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-16 text-center">
          <Link 
            href="/signup" 
            className="inline-flex items-center gap-2.5 bg-white text-slate-900 hover:bg-neutral-100 transition-colors font-bold px-8 py-4 rounded-full text-sm shadow-lg shadow-white/5 cursor-pointer"
          >
            Start Qualifying Buyers
            <ArrowRight size={16} />
          </Link>
          <p className="text-[10px] text-neutral-500 mt-3">2-minute setup. Free forever. No coding needed.</p>
        </div>

      </div>
    </section>
  );
}
