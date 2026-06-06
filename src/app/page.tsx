'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, AlertTriangle, ArrowRight, Sparkles, 
  ShieldCheck, CheckCheck, Play, Pause, ChevronRight,
  ChevronLeft, Sofa, Coffee, Building, Eye, RefreshCw
} from 'lucide-react';
import Link from 'next/link';

// Custom CSS declarations injected
const INJECTED_STYLES = `
  .bg-grid-theme {
      background-size: 50px 50px;
      background-image: 
          linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 80%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 80%);
  }

  .premium-depth-card {
      background: linear-gradient(145deg, #0d1222 0%, #04060c 100%);
      box-shadow: 
          0 40px 100px -20px rgba(0, 0, 0, 0.9),
          inset 0 1px 2px rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.04);
  }

  .iphone-bezel {
      background-color: #111;
      box-shadow: 
          inset 0 0 0 2px #52525B, 
          inset 0 0 0 7px #000, 
          0 40px 80px -15px rgba(0,0,0,0.9);
      transform-style: preserve-3d;
  }

  .hardware-btn {
      background: linear-gradient(90deg, #404040 0%, #171717 100%);
      box-shadow: -2px 0 5px rgba(0,0,0,0.8);
  }

  .screen-glare {
      background: linear-gradient(110deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 45%);
  }
`;

interface Scene {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
}

const CINEMA_SCENES: Scene[] = [
  {
    id: 1,
    title: "Scene 1: The Chaos",
    subtitle: "A barrage of raw, unqualified 'price?' messages floods your phone.",
    description: "Every single ad click goes straight to WhatsApp. Leads ask identical questions about price, dimensions, and materials, then ghost before you can answer.",
    color: "text-red-400"
  },
  {
    id: 2,
    title: "Scene 2: The Switch",
    subtitle: "Reroute incoming Instagram ad traffic to a FunnelLink page.",
    description: "Toggle on the pre-qualification filter. Instead of throwing raw leads into a chaotic chat, buyers are guided to browse specifications first.",
    color: "text-amber-400"
  },
  {
    id: 3,
    title: "Scene 3: The Transformation",
    subtitle: "Buyers visually select custom wood, dimensions & fabrics.",
    description: "Before starting a chat, buyers build trust by selecting configuration specs. They understand the product details, options, and pricing automatically.",
    color: "text-blue-400"
  },
  {
    id: 4,
    title: "Scene 4: The Qualified Lead",
    subtitle: "Receive pre-filled, highly detailed purchase specs in chat.",
    description: "Instead of generic price questions, you get a clean order breakdown carrying exact sizes, colors, and shipping locations ready to invoice.",
    color: "text-emerald-400"
  }
];

export default function Home() {
  // Cinema Theatre states
  const [activeScene, setActiveScene] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  // Industry tabs
  const [activeDemoTab, setActiveDemoTab] = useState<'furniture' | 'cafe' | 'realestate'>('furniture');

  // Live Demo customization variables
  const [furnWood, setFurnWood] = useState<string>('Teakwood');
  const [furnSize, setFurnSize] = useState<string>('8 Ft');
  const [furnFabric, setFurnFabric] = useState<string>('Beige');
  const [cafeItems, setCafeItems] = useState<string[]>(['Croissant', 'Latte']);
  const [cafeSeats, setCafeSeats] = useState<string>('2 People');
  const [reBhk, setReBhk] = useState<string>('3 BHK');
  const [reLocation, setReLocation] = useState<string>('Aurelia Sky Villa');

  // Scene 1: Chaos message states
  const [chaosChats, setChaosChats] = useState<string[]>([]);
  
  // Manage timeline timer for the cinema player
  useEffect(() => {
    if (!isPlaying) return;

    setProgress(0);
    const intervalTime = 50; // ms
    const duration = 6000; // 6s per scene
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveScene((current) => (current === 4 ? 1 : current + 1));
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, activeScene]);

  // Handle Scene 1 text spawning loop
  useEffect(() => {
    if (activeScene !== 1) {
      setChaosChats([]);
      return;
    }
    const messages = ["Price?", "Location?", "Is it Sheesham wood?", "Delivery cost?", "Warranty?"];
    let idx = 0;
    const chatInterval = setInterval(() => {
      setChaosChats((prev) => {
        if (idx >= messages.length) {
          idx = 0;
          return [];
        }
        const next = [...prev, messages[idx]];
        idx++;
        return next;
      });
    }, 1100);

    return () => clearInterval(chatInterval);
  }, [activeScene]);

  const handleNext = () => {
    setActiveScene((prev) => (prev === 4 ? 1 : prev + 1));
    setProgress(0);
  };

  const handleBack = () => {
    setActiveScene((prev) => (prev === 1 ? 4 : prev - 1));
    setProgress(0);
  };

  return (
    <main className="min-h-screen bg-[#070b14] text-white overflow-x-hidden font-sans antialiased relative selection:bg-indigo-500 selection:text-white pb-16">
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-40" />

      {/* Glow Backdrops */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute top-2/3 right-1/4 w-[500px] h-[500px] bg-emerald-500/[0.02] blur-[150px] pointer-events-none" />

      {/* NAVBAR */}
      <nav className="relative z-30 max-w-[1280px] mx-auto px-6 py-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-white p-0.5 flex items-center justify-center border border-white/10 shadow-md">
            <img src="/logo.jpeg" alt="FunnelLink Logo" className="max-w-full max-h-full object-contain" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white">
            Funnel<span className="text-indigo-400">Link</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-xs sm:text-sm font-bold text-neutral-400 hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/signup" className="text-xs sm:text-sm font-bold bg-white text-slate-950 hover:bg-neutral-200 transition-colors px-4 py-2 rounded-full">
            Start Free
          </Link>
        </div>
      </nav>

      {/* SECTION 1 — THE HOOK */}
      <section className="relative z-10 pt-20 pb-12 text-center max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Cinematic Presentation</span>
        </motion.div>

        <h1 className="text-4xl sm:text-6xl font-black leading-[1.08] tracking-tight text-white mb-6">
          Stop Sending Every Instagram Click Directly To WhatsApp.
        </h1>

        <p className="text-neutral-400 text-sm sm:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8">
          Most businesses waste hours answering the same questions, chasing unqualified leads, and losing customers before the sale starts.
        </p>

        <div className="flex justify-center">
          <a 
            href="#cinema" 
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3.5 rounded-full text-sm shadow-lg shadow-indigo-600/10 transition-all cursor-pointer"
          >
            See How It Works
            <ArrowRight size={14} />
          </a>
        </div>
      </section>

      {/* THE CINEMATIC THEATRE (SECTIONS 2, 3, 4, 5 consolidated as a movie console) */}
      <section id="cinema" className="relative z-10 py-12 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs uppercase font-bold text-indigo-400 tracking-widest block mb-1">Interactive Theater</span>
          <h2 className="text-3xl font-black text-white">Watch The FunnelLink Movie</h2>
        </div>

        {/* Outer Director\'s Console */}
        <div className="premium-depth-card rounded-[2.5rem] p-6 lg:p-12 relative border border-white/5 overflow-visible">
          
          {/* Cinema Header Timeline */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-6 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-red-500 animate-ping font-extrabold text-xs">●</span>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Theater Active</span>
            </div>
            
            {/* Steps Navigator */}
            <div className="flex gap-2.5">
              {CINEMA_SCENES.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => { setActiveScene(scene.id); setProgress(0); }}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeScene === scene.id 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-white/5 text-neutral-400 hover:text-white'
                  }`}
                >
                  Scene {scene.id}
                </button>
              ))}
            </div>
          </div>

          {/* Theater Screen Grid */}
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Movie Script description */}
            <div className="lg:col-span-6 text-left space-y-6">
              <span className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-black ${CINEMA_SCENES[activeScene - 1].color}`}>
                🎬 {CINEMA_SCENES[activeScene - 1].title}
              </span>
              
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                {CINEMA_SCENES[activeScene - 1].subtitle}
              </h3>

              <p className="text-neutral-400 text-sm leading-relaxed font-light">
                {CINEMA_SCENES[activeScene - 1].description}
              </p>

              {/* Cinema Control Bar */}
              <div className="pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 text-white cursor-pointer transition-all"
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button 
                    onClick={handleBack}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 text-neutral-400 hover:text-white cursor-pointer transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 text-neutral-400 hover:text-white cursor-pointer transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Progress bar timeline */}
                <div className="flex-1 max-w-[200px]">
                  <div className="flex justify-between text-[9px] text-neutral-500 mb-1 font-mono">
                    <span>TIMELINE</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-75"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Right Centerpiece Phone Screen */}
            <div className="lg:col-span-6 flex justify-center items-center relative">
              
              {/* iPhone bezel structure (300px wide, 600px high) */}
              <div className="relative w-[300px] h-[600px] rounded-[3.3rem] iphone-bezel p-2 z-10 transition-transform duration-300">
                <div className="absolute top-[120px] -left-[3px] w-[3px] h-[28px] hardware-btn rounded-l-md" aria-hidden="true" />
                <div className="absolute top-[165px] -left-[3px] w-[3px] h-[48px] hardware-btn rounded-l-md" aria-hidden="true" />
                <div className="absolute top-[225px] -left-[3px] w-[3px] h-[48px] hardware-btn rounded-l-md" aria-hidden="true" />
                <div className="absolute top-[175px] -right-[3px] w-[3px] h-[75px] hardware-btn rounded-r-md scale-x-[-1]" aria-hidden="true" />

                {/* Screen wrapper */}
                <div className="absolute inset-[8px] bg-[#050914] rounded-[2.9rem] overflow-hidden shadow-[inset_0_0_15px_rgba(0,0,0,1)] text-white z-10">
                  <div className="absolute inset-0 screen-glare z-45 pointer-events-none" aria-hidden="true" />

                  {/* Notch */}
                  <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[90px] h-[24px] bg-black rounded-full z-50 flex items-center justify-center border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse mr-2" />
                    <span className="text-[6px] text-neutral-400 font-bold tracking-widest font-mono">SCENE 0{activeScene}</span>
                  </div>

                  {/* Inside Screen Content based on scene id */}
                  <div className="relative w-full h-full pt-10 pb-4 text-[10px] text-white">
                    <AnimatePresence mode="wait">

                      {/* SCENE 1: WHATSAPP CHAOS */}
                      {activeScene === 1 && (
                        <motion.div
                          key="scene1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 p-5 flex flex-col justify-between bg-[#0a0e1a]"
                        >
                          <div>
                            <div className="border-b border-white/5 pb-2 mb-2 flex justify-between items-center text-[7.5px]">
                              <span className="font-bold text-white">WhatsApp Inbox</span>
                              <span className="text-red-400 font-bold">12 UNREAD</span>
                            </div>
                            
                            <div className="space-y-2.5 pt-1 text-left">
                              {chaosChats.map((c, i) => (
                                <motion.div 
                                  key={i} 
                                  initial={{ opacity: 0, x: -10 }} 
                                  animate={{ opacity: 1, x: 0 }} 
                                  className="bg-neutral-800 rounded-lg p-2 max-w-[85%] text-[8.5px] border border-white/5 shadow-md"
                                >
                                  <p className="text-red-400 font-bold text-[6px]">Buyer:</p>
                                  <p className="text-white mt-0.5">{c}</p>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                            <p className="font-black text-red-400 text-[9px] uppercase tracking-wider animate-pulse">❌ Typing Manual Prices...</p>
                            <p className="text-[7px] text-neutral-400 mt-0.5 leading-snug">Chats ghosted because of delays.</p>
                          </div>
                        </motion.div>
                      )}

                      {/* SCENE 2: THE SWITCH */}
                      {activeScene === 2 && (
                        <motion.div
                          key="scene2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 p-5 flex flex-col justify-between bg-[#050914] text-center"
                        >
                          <div className="border-b border-white/5 pb-2.5 flex justify-between items-center">
                            <span className="text-[7.5px] text-neutral-400 font-mono">Routing System</span>
                            <span className="text-[7px] bg-indigo-600 text-white px-1.5 rounded">FILTER</span>
                          </div>

                          <div className="space-y-4 my-auto">
                            <span className="text-[7px] text-neutral-500 font-black uppercase tracking-widest block">System Path</span>
                            
                            {/* Visual toggle switch */}
                            <div className="flex flex-col items-center">
                              <motion.div 
                                animate={{ scale: [1, 1.05, 1] }} 
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-24 h-11 bg-emerald-500 border border-emerald-400/40 rounded-full p-1 flex items-center justify-end shadow-lg shadow-emerald-500/15"
                              >
                                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-black text-[9px] text-[#070b14]">ON</div>
                              </motion.div>
                              <span className="text-[8px] text-emerald-400 font-bold mt-2 uppercase tracking-wide">FunnelLink Connected</span>
                            </div>

                            <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 text-[7px] text-neutral-400 leading-normal">
                              Instagram Ads ──► FunnelLink Filter ──► WhatsApp
                            </div>
                          </div>

                          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl py-2.5 text-center">
                            <span className="text-[8.5px] text-emerald-400 font-black">Pre-Qualification Enabled</span>
                          </div>
                        </motion.div>
                      )}

                      {/* SCENE 3: THE TRANSFORMATION */}
                      {activeScene === 3 && (
                        <motion.div
                          key="scene3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 p-5 flex flex-col justify-between bg-[#FAF9F5] text-neutral-800"
                        >
                          <div>
                            <div className="border-b border-gray-150 pb-1.5 flex justify-between items-center text-[7px] text-gray-400">
                              <span>funnellink.com/urban-living</span>
                              <span>🔒</span>
                            </div>

                            <p className="font-black text-neutral-900 text-[11px] mt-2.5">Milano 3-Seater Sofa</p>
                            
                            {/* Visual Options configured */}
                            <div className="space-y-3 mt-3 flex-1 text-left">
                              <div>
                                <span className="text-[6.5px] text-gray-400 font-bold block mb-1 uppercase tracking-wider">Wood Finish</span>
                                <div className="grid grid-cols-2 gap-1.5">
                                  <div className="border border-indigo-600 bg-indigo-50/50 rounded-lg py-1 text-center font-bold text-[7.5px] text-indigo-700 shadow-sm">Teakwood Finish ✓</div>
                                  <div className="border border-gray-200 rounded-lg py-1 text-center text-[7.5px] text-gray-400">Sheesham Finish</div>
                                </div>
                              </div>

                              <div>
                                <span className="text-[6.5px] text-gray-400 font-bold block mb-1 uppercase tracking-wider">Sizing Selection</span>
                                <div className="grid grid-cols-3 gap-1">
                                  <div className="border border-gray-200 rounded-lg py-1 text-center text-[7px] text-gray-400">6 Ft</div>
                                  <div className="border border-indigo-600 bg-indigo-50/50 rounded-lg py-1 text-center font-bold text-[7.5px] text-indigo-700 shadow-sm">8 Ft ✓</div>
                                  <div className="border border-gray-200 rounded-lg py-1 text-center text-[7px] text-gray-400">10 Ft</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-[#25d366] text-white font-extrabold text-center py-2.5 rounded-xl text-[8px] flex items-center justify-center gap-1 shadow-md">
                            <MessageCircle size={10} />
                            <span>Submit Custom Order</span>
                          </div>
                        </motion.div>
                      )}

                      {/* SCENE 4: QUALIFIED INCOMING LEAD */}
                      {activeScene === 4 && (
                        <motion.div
                          key="scene4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 p-5 flex flex-col justify-between bg-[#0a0e1a] text-left"
                        >
                          <div>
                            <div className="border-b border-white/5 pb-2 mb-2 flex justify-between items-center text-[7.5px]">
                              <span className="font-bold text-white">WhatsApp Chat</span>
                              <span className="text-emerald-400 font-bold">1 NEW MESSAGE</span>
                            </div>

                            <div className="bg-[#050812] border border-[#25d366]/20 rounded-xl p-3 text-[8px] font-mono text-neutral-300 leading-normal space-y-1 mt-2">
                              <p className="text-emerald-400 font-bold">// Order Specifications</p>
                              <p>Hi,</p>
                              <p>Interested in <span className="text-white font-bold">Milano Sofa</span>.</p>
                              <p className="text-neutral-400">
                                Selection:<br />
                                • Wood: Teakwood<br />
                                • Sizing: 8 Feet<br />
                                • Fabric: Beige
                              </p>
                              <p className="text-white pt-1">Please confirm price.</p>
                            </div>
                          </div>

                          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl py-3 text-center">
                            <span className="text-[8.5px] text-emerald-400 font-black">✓ Read and Ready to Invoice</span>
                          </div>
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

          {/* Subtitles Cinema Card */}
          <div className="mt-8 bg-black/40 border border-white/5 rounded-2xl p-4 text-center">
            <span className="text-[8px] text-indigo-400 font-mono block mb-1">CINEMATIC SUBTITLES</span>
            <p className="text-xs sm:text-sm text-neutral-200 font-medium">
              &quot;{CINEMA_SCENES[activeScene - 1].subtitle}&quot;
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 6 — PROBLEMS WE SOLVE */}
      <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-bold text-indigo-400 tracking-widest block mb-2">Key Value Pillars</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Problems We Solve</h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-2">Engineered to eliminate high-ticket ad dropoffs</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-left hover:border-indigo-500/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400 mb-4">
              <MessageCircle size={20} />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Repetitive Questions</h4>
            <p className="text-neutral-400 text-xs leading-relaxed font-light">
              Stop answering the same things all day. Sizing, prices, materials, and warranty are visually laid out instantly.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-left hover:border-indigo-500/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400 mb-4">
              <Sparkles size={20} />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Low Quality Leads</h4>
            <p className="text-neutral-400 text-xs leading-relaxed font-light">
              Get serious buyers. Filtering out casual tire-kickers ensures only qualified purchase intent reaches your inbox.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-left hover:border-indigo-500/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400 mb-4">
              <AlertTriangle size={20} />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">WhatsApp Chaos</h4>
            <p className="text-neutral-400 text-xs leading-relaxed font-light">
              Know who wants what. Filter lead threads so you can reply with exact invoices in seconds instead of descriptive typing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-left hover:border-indigo-500/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400 mb-4">
              <ShieldCheck size={20} />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">No Trust</h4>
            <p className="text-neutral-400 text-xs leading-relaxed font-light">
              Build confidence before conversation starts. Clear visual spec filters, photos, and warranties build professional buyer trust.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7 — INDUSTRIES */}
      <section id="industries" className="relative z-10 py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-bold text-indigo-400 tracking-widest block mb-2">Built-in Abstractions</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Custom-Built Industries</h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-2">Tap any industry to load its interactive preview configuration below</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Furniture Card */}
          <button
            onClick={() => setActiveDemoTab('furniture')}
            className={`p-6 rounded-3xl border text-left transition-all duration-300 cursor-pointer ${
              activeDemoTab === 'furniture'
                ? 'bg-indigo-950/20 border-indigo-500 shadow-lg shadow-indigo-500/10'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-blue-400 mb-4">
              <Sofa size={20} />
            </div>
            <h4 className="text-lg font-bold text-white mb-1">Furniture Funnel</h4>
            <p className="text-neutral-400 text-xs font-light leading-relaxed mb-4">
              Configure sizing, materials, and fabric selections visually.
            </p>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
              Preview Demo <ArrowRight size={10} />
            </span>
          </button>

          {/* Cafe Card */}
          <button
            onClick={() => setActiveDemoTab('cafe')}
            className={`p-6 rounded-3xl border text-left transition-all duration-300 cursor-pointer ${
              activeDemoTab === 'cafe'
                ? 'bg-indigo-950/20 border-indigo-500 shadow-lg shadow-indigo-500/10'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#c4713b]/10 border border-[#c4713b]/20 flex items-center justify-center text-orange-400 mb-4">
              <Coffee size={20} />
            </div>
            <h4 className="text-lg font-bold text-white mb-1">Cafe Funnel</h4>
            <p className="text-neutral-400 text-xs font-light leading-relaxed mb-4">
              Bundle table reservation slots with signature item pre-orders.
            </p>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
              Preview Demo <ArrowRight size={10} />
            </span>
          </button>

          {/* Real Estate Card */}
          <button
            onClick={() => setActiveDemoTab('realestate')}
            className={`p-6 rounded-3xl border text-left transition-all duration-300 cursor-pointer ${
              activeDemoTab === 'realestate'
                ? 'bg-indigo-950/20 border-indigo-500 shadow-lg shadow-indigo-500/10'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#9A7B44]/10 border border-[#9A7B44]/20 flex items-center justify-center text-yellow-500 mb-4">
              <Building size={20} />
            </div>
            <h4 className="text-lg font-bold text-white mb-1">Real Estate Funnel</h4>
            <p className="text-neutral-400 text-xs font-light leading-relaxed mb-4">
              Qualify BHK preferences and display floorplans with location maps.
            </p>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
              Preview Demo <ArrowRight size={10} />
            </span>
          </button>
        </div>
      </section>

      {/* SECTION 8 — LIVE DEMO */}
      <section id="demo" className="relative z-10 py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-bold text-indigo-400 tracking-widest block mb-2">Interactive Preview</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Live Interactive Demo</h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-2">Test the actual funnel interface. Tap choices to watch the WhatsApp format update.</p>
        </div>

        <div className="premium-depth-card rounded-[2.5rem] p-6 lg:p-10 grid md:grid-cols-12 gap-8 items-stretch max-w-4xl mx-auto relative overflow-hidden">
          
          {/* Interactive Screen Preview */}
          <div className="md:col-span-7 bg-[#FAF9F5] text-neutral-800 rounded-3xl p-6 text-left flex flex-col justify-between min-h-[360px] shadow-lg">
            <div>
              <div className="border-b border-gray-150 pb-1.5 flex justify-between items-center text-[7px] text-gray-400">
                <span>demo.funnellink.com/urban-living</span>
                <span>🔒</span>
              </div>

              {activeDemoTab === 'furniture' && (
                <div className="space-y-4 mt-3">
                  <h3 className="font-black text-neutral-900 text-lg leading-none">Milano 3-Seater Sofa</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-[8px] text-gray-400 font-bold block mb-1 uppercase tracking-wider">Wood Finish</span>
                      <div className="grid grid-cols-2 gap-2">
                        {['Teakwood', 'Sheesham'].map((w) => (
                          <button 
                            key={w} 
                            onClick={() => setFurnWood(w)}
                            className={`border py-1.5 rounded-lg text-center font-bold text-[8.5px] cursor-pointer transition-all ${
                              furnWood === w ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' : 'border-gray-200 text-gray-400 bg-transparent'
                            }`}
                          >
                            {w} {furnWood === w && '✓'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[8px] text-gray-400 font-bold block mb-1 uppercase tracking-wider">Custom Length</span>
                      <div className="grid grid-cols-3 gap-2">
                        {['6 Ft', '8 Ft', '10 Ft'].map((s) => (
                          <button 
                            key={s} 
                            onClick={() => setFurnSize(s)}
                            className={`border py-1 rounded-lg text-center font-bold text-[8px] cursor-pointer transition-all ${
                              furnSize === s ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' : 'border-gray-200 text-gray-400 bg-transparent'
                            }`}
                          >
                            {s} {furnSize === s && '✓'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[8px] text-gray-400 font-bold block mb-1 uppercase tracking-wider">Fabric Color</span>
                      <div className="grid grid-cols-3 gap-2">
                        {['Beige', 'Velvet Grey', 'Royal Blue'].map((f) => (
                          <button 
                            key={f} 
                            onClick={() => setFurnFabric(f)}
                            className={`border py-1 rounded-lg text-center font-bold text-[8px] cursor-pointer transition-all ${
                              furnFabric === f ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' : 'border-gray-200 text-gray-400 bg-transparent'
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeDemoTab === 'cafe' && (
                <div className="space-y-4 mt-3">
                  <h3 className="font-black text-neutral-900 text-lg leading-none">Coffee & Croissants Pre-Order</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-[8px] text-gray-400 font-bold block mb-1 uppercase tracking-wider">Select Menu Items</span>
                      <div className="grid grid-cols-2 gap-2">
                        {['Croissant', 'Latte', 'Avocado Toast', 'Cold Brew'].map((item) => {
                          const isAdded = cafeItems.includes(item);
                          return (
                            <button
                              key={item}
                              onClick={() => {
                                setCafeItems(prev => 
                                  isAdded ? prev.filter(i => i !== item) : [...prev, item]
                                );
                              }}
                              className={`border py-1.5 rounded-lg text-center font-bold text-[8.5px] cursor-pointer transition-all ${
                                isAdded ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' : 'border-gray-200 text-gray-400 bg-transparent'
                              }`}
                            >
                              {item} {isAdded ? '✓' : '+'}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <span className="text-[8px] text-gray-400 font-bold block mb-1 uppercase tracking-wider">Table Reservation Sizing</span>
                      <div className="grid grid-cols-3 gap-2">
                        {['2 People', '4 People', '6+ Group'].map((s) => (
                          <button 
                            key={s} 
                            onClick={() => setCafeSeats(s)}
                            className={`border py-1.5 rounded-lg text-center font-bold text-[8px] cursor-pointer transition-all ${
                              cafeSeats === s ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' : 'border-gray-200 text-gray-400 bg-transparent'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeDemoTab === 'realestate' && (
                <div className="space-y-4 mt-3">
                  <h3 className="font-black text-neutral-900 text-lg leading-none">Aurelia Residences</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-[8px] text-gray-400 font-bold block mb-1 uppercase tracking-wider">Property BHK Configuration</span>
                      <div className="grid grid-cols-3 gap-2">
                        {['2 BHK', '3 BHK', '4 BHK Villa'].map((bhk) => (
                          <button 
                            key={bhk} 
                            onClick={() => setReBhk(bhk)}
                            className={`border py-1.5 rounded-lg text-center font-bold text-[8.5px] cursor-pointer transition-all ${
                              reBhk === bhk ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' : 'border-gray-200 text-gray-400 bg-transparent'
                            }`}
                          >
                            {bhk}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[8px] text-gray-400 font-bold block mb-1 uppercase tracking-wider">Select Residence Block</span>
                      <div className="grid grid-cols-2 gap-2">
                        {['Aurelia Sky Villa', 'East wing tower', 'Aurelia Penthouse'].map((loc) => (
                          <button 
                            key={loc} 
                            onClick={() => setReLocation(loc)}
                            className={`border py-1.5 rounded-lg text-center font-bold text-[8px] cursor-pointer transition-all ${
                              reLocation === loc ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' : 'border-gray-200 text-gray-400 bg-transparent'
                            }`}
                          >
                            {loc}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#25d366] text-white font-extrabold text-center py-2.5 rounded-xl text-[9px] flex items-center justify-center gap-1 shadow-sm mt-3">
              <MessageCircle size={11} />
              <span>Send Config to WhatsApp</span>
            </div>
          </div>

          {/* Qualified Output Message */}
          <div className="md:col-span-5 bg-[#0a0e1a] rounded-3xl p-5 border border-white/5 flex flex-col justify-between text-left">
            <div>
              <span className="text-[7.5px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full uppercase mb-3 inline-block">WhatsApp lead generated:</span>
              
              <div className="bg-[#050812] border border-white/5 rounded-xl p-3 text-[8.5px] font-mono text-neutral-300 leading-normal space-y-1.5 min-h-[200px]">
                <p className="text-emerald-400 font-bold">// Incoming Message Format</p>
                <p>Hi,</p>
                
                {activeDemoTab === 'furniture' && (
                  <>
                    <p>Interested in <span className="text-white font-bold">Milano Sofa</span>.</p>
                    <p className="text-neutral-400">
                      Selected Specifications:<br />
                      • Wood: {furnWood}<br />
                      • Size: {furnSize}<br />
                      • Fabric: {furnFabric}
                    </p>
                  </>
                )}

                {activeDemoTab === 'cafe' && (
                  <>
                    <p>Table pre-order for <span className="text-white font-bold">{cafeSeats}</span>.</p>
                    <p className="text-neutral-400">
                      Items Basket:<br />
                      {cafeItems.map(i => `• ${i}`).join('\n')}
                    </p>
                  </>
                )}

                {activeDemoTab === 'realestate' && (
                  <>
                    <p>Interested in <span className="text-white font-bold">{reLocation}</span>.</p>
                    <p className="text-neutral-400">
                      Configuration:<br />
                      • BHK: {reBhk} Floorplan
                    </p>
                  </>
                )}

                <p className="pt-2 text-white">Please send quotation.</p>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 text-center mt-3 text-[8px] text-emerald-400 font-bold">
              ✓ Leads formatted automatically
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 9 — SIMPLE DASHBOARD */}
      <section className="relative z-10 py-16 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-bold text-indigo-400 tracking-widest block mb-2">Metrics Console</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Simple Dashboard</h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-2">Track views, clicks, and conversion rates cleanly. No bloat.</p>
        </div>

        {/* Dashboard Grid Panel */}
        <div className="premium-depth-card rounded-[2rem] p-6 lg:p-8 max-w-xl mx-auto grid grid-cols-3 gap-4 border border-white/5">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
            <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-mono">Views</span>
            <p className="text-xl sm:text-3xl font-black text-white mt-1">1,240</p>
          </div>
          
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
            <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-mono">Clicks</span>
            <p className="text-xl sm:text-3xl font-black text-white mt-1">420</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 rounded-2xl p-4 border border-indigo-500/10 text-center">
            <span className="text-[9px] text-neutral-300 uppercase tracking-widest font-mono">Leads</span>
            <p className="text-xl sm:text-3xl font-black text-emerald-400 mt-1">142</p>
          </div>
        </div>
      </section>

      {/* SECTION 10 — PRICING */}
      <section id="pricing" className="relative z-10 py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-bold text-[#6366f1] tracking-widest block mb-2">Flat Industry Billing</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Simple Pricing</h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-2">Simple plans. Cancel or upgrade anytime.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Furniture plan */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-left flex flex-col justify-between min-h-[280px]">
            <div>
              <h3 className="text-md font-bold text-white mb-1">Furniture Funnel</h3>
              <p className="text-neutral-400 text-[11px] leading-relaxed mb-4">Complete configuration layout for visual e-commerce.</p>
              <div className="flex items-end gap-1 mb-4">
                <span className="text-3xl sm:text-4xl font-black text-white">₹499</span>
                <span className="text-xs text-neutral-400 mb-1">/ month</span>
              </div>
            </div>
            <Link href="/signup" className="block w-full py-2.5 rounded-full text-center text-xs font-bold bg-white text-slate-900 hover:bg-neutral-200 transition-all shadow-md cursor-pointer">
              Choose Furniture
            </Link>
          </div>

          {/* Cafe plan */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-left flex flex-col justify-between min-h-[280px]">
            <div>
              <h3 className="text-md font-bold text-white mb-1">Cafe Funnel</h3>
              <p className="text-neutral-400 text-[11px] leading-relaxed mb-4">Reservation calendar and signature coffee pre-order options.</p>
              <div className="flex items-end gap-1 mb-4">
                <span className="text-3xl sm:text-4xl font-black text-white">₹499</span>
                <span className="text-xs text-neutral-400 mb-1">/ month</span>
              </div>
            </div>
            <Link href="/signup" className="block w-full py-2.5 rounded-full text-center text-xs font-bold bg-white text-slate-900 hover:bg-neutral-200 transition-all shadow-md cursor-pointer">
              Choose Cafe
            </Link>
          </div>

          {/* Real estate plan */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-left flex flex-col justify-between min-h-[280px]">
            <div>
              <h3 className="text-md font-bold text-white mb-1">Real Estate Funnel</h3>
              <p className="text-neutral-400 text-[11px] leading-relaxed mb-4">Unlimited BHK layout showcases, interactive map nodes & high tier lead filter.</p>
              <div className="flex items-end gap-1 mb-4">
                <span className="text-3xl sm:text-4xl font-black text-white">₹999</span>
                <span className="text-xs text-neutral-400 mb-1">/ month</span>
              </div>
            </div>
            <Link href="/signup" className="block w-full py-2.5 rounded-full text-center text-xs font-bold bg-white text-slate-900 hover:bg-neutral-200 transition-all shadow-md cursor-pointer">
              Choose Real Estate
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 11 — FINAL CTA & FOOTER */}
      <section className="relative z-10 py-16 px-6 max-w-4xl mx-auto text-center border-t border-white/5 mt-10">
        <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
          Turn Instagram Clicks Into Qualified WhatsApp Leads.
        </h2>
        <p className="text-neutral-400 text-xs sm:text-sm max-w-md mx-auto mb-8 font-light">
          Set up your visual selection pre-qualification link in 2 minutes. Focus on closing sales instead of typing details.
        </p>

        <div className="flex flex-col items-center">
          <Link 
            href="/signup" 
            className="inline-flex items-center gap-2.5 bg-white text-slate-950 hover:bg-neutral-200 font-extrabold px-8 py-3.5 rounded-full text-sm transition-all shadow-lg cursor-pointer"
          >
            Create My Funnel
            <ArrowRight size={15} />
          </Link>
          <span className="text-[10px] text-neutral-500 mt-2 font-mono">No card required · Cancel anytime</span>
        </div>

        {/* Minimal Footer with logo */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-neutral-500 text-[10px] sm:text-xs">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <div className="w-6 h-6 rounded-md overflow-hidden bg-white p-0.5 flex items-center justify-center border border-white/5">
              <img src="/logo.jpeg" alt="FunnelLink Logo" className="max-w-full max-h-full object-contain" />
            </div>
            <p>© 2026 FunnelLink. All rights reserved.</p>
          </div>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
