'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  MessageCircle, Heart, Send, MoreHorizontal, ChevronRight, Menu, 
  Search, ShoppingCart, MapPin, HelpCircle, Package, MousePointer2, Bookmark 
} from 'lucide-react';

export default function PhoneMockup({ activeScene, overrideScene }: { activeScene: number, overrideScene?: number }) {
  const displayScene = overrideScene ?? activeScene;
  const [messages, setMessages] = useState<string[]>([]);
  
  const allMessages = [
    { text: "Price?", time: "10:01 AM" },
    { text: "Available?", time: "10:02 AM" },
    { text: "Any discount?", time: "10:05 AM" },
    { text: "What's the delivery time?", time: "10:12 AM" },
    { text: "Do you have this in blue?", time: "10:15 AM" },
    { text: "Location?", time: "10:22 AM" },
    { text: "Warranty?", time: "10:28 AM" },
    { text: "Custom size possible?", time: "10:30 AM" }
  ];

  useEffect(() => {
    if (displayScene === 2 && activeScene >= 2) {
      setMessages([]);
      const timeouts: NodeJS.Timeout[] = [];
      allMessages.forEach((msg, idx) => {
        const t = setTimeout(() => {
          setMessages(prev => {
            if (!prev.includes(msg.text)) return [...prev, msg.text];
            return prev;
          });
        }, idx * 600 + 200);
        timeouts.push(t);
      });
      return () => timeouts.forEach(clearTimeout);
    } else {
      setMessages([]);
    }
  }, [activeScene, displayScene]);

  // Determine if the chaos overlay should show
  const showChaos = displayScene === 4;

  return (
    <div className="relative w-[300px] h-[620px] md:w-[340px] md:h-[680px] bg-white rounded-[44px] shadow-[0_30px_80px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] border-[10px] border-slate-900 overflow-hidden flex flex-col bg-slate-50 shrink-0 transform-gpu satoshi-mockup">
      <style>{`
        @font-face {
          font-family: 'Satoshi';
          src: url('/fonts/Satoshi-Variable.woff2') format('woff2'),
               url('/fonts/Satoshi-Variable.ttf') format('truetype');
          font-weight: 300 900;
          font-display: swap;
          font-style: normal;
        }
        .satoshi-mockup, .satoshi-mockup * {
          font-family: 'Satoshi', system-ui, sans-serif !important;
        }
      `}</style>

      {/* ─── HEADERS ─── */}
      <AnimatePresence mode="wait">
        {displayScene === 1 && (
          <motion.div 
            key="header-ad"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-4 shrink-0"
          >
            <div className="font-bold text-xl tracking-tighter text-slate-900">Instagram</div>
            <div className="flex gap-4">
               <Heart size={22} className="text-slate-900" />
               <Send size={22} className="text-slate-900" />
            </div>
          </motion.div>
        )}
        {displayScene === 2 && (
          <motion.div 
            key="header-wa"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-16 bg-[#075E54] flex items-center px-4 gap-3 shrink-0 text-white shadow-sm z-10"
          >
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center overflow-hidden"><MessageCircle size={18}/></div>
            <div>
              <div className="text-sm font-bold leading-tight">Customer</div>
              <div className="text-[10px] text-white/80">online</div>
            </div>
          </motion.div>
        )}
        {(displayScene === 3 || displayScene === 4) && (
          <motion.div 
            key="header-web"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-4 shrink-0"
          >
            <Menu size={24} className="text-slate-700" />
            <div className="font-extrabold text-lg text-slate-900 tracking-tight">URBAN</div>
            <div className="flex gap-3">
              <Search size={20} className="text-slate-700" />
              <ShoppingCart size={20} className="text-slate-700" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── BODY ─── */}
      <div className="flex-1 relative overflow-hidden flex flex-col bg-white">
        <AnimatePresence mode="wait">

          {/* Scene 1: Instagram Ad */}
          {displayScene === 1 && (
            <motion.div 
              key="body-ad"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex flex-col bg-white overflow-y-auto no-scrollbar"
            >
              {/* Ad Header */}
              <div className="h-[60px] flex items-center justify-between px-3 shrink-0">
                 <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600 p-[2px]">
                       <div className="w-full h-full bg-white rounded-full border-[1.5px] border-white overflow-hidden">
                          <img src="/logo.jpeg" alt="Brand Logo" className="w-full h-full object-cover" />
                       </div>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[13px] font-bold text-slate-900 leading-tight">urbanliving.sofas</span>
                       <span className="text-[11px] text-slate-500 leading-tight">Sponsored</span>
                    </div>
                 </div>
                 <MoreHorizontal size={20} className="text-slate-900" />
              </div>

              {/* Ad Image */}
              <div className="w-full aspect-square bg-slate-100 relative shrink-0">
                <img 
                  src="/sofa/blue-sofa.jpeg" 
                  alt="Sofa" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Ad CTA Bar */}
              <div className="bg-[#f0f4f8] border-b border-slate-100 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-[#2A5BEA]/10 transition-colors shrink-0">
                 <div className="flex flex-col">
                    <span className="text-[10px] text-[#2A5BEA] font-bold uppercase tracking-wider mb-0.5">WhatsApp</span>
                    <span className="text-[15px] font-bold text-[#00154A] leading-tight">Send Message</span>
                 </div>
                 <ChevronRight size={20} className="text-[#2A5BEA]" />
              </div>

              {/* Engagement & Caption */}
              <div className="p-3 shrink-0">
                 <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-4">
                       <Heart size={24} className="text-slate-900" />
                       <MessageCircle size={24} className="text-slate-900 transform scale-x-[-1]" />
                       <Send size={24} className="text-slate-900" />
                    </div>
                    <Bookmark size={24} className="text-slate-900" />
                 </div>
                 
                 <div className="text-[13px] font-semibold text-slate-900 mb-1.5">
                    1,204 likes
                 </div>

                 <div className="text-[13px] text-slate-800 leading-snug">
                    <span className="font-semibold text-slate-900 mr-2">urbanliving.sofas</span>
                    Upgrade your living room with the Premium Milano 3-Seater. Teakwood frame & premium fabric. Limited stock! 🛋️✨ #homedecor #sofa #interiordesign
                 </div>
              </div>
            </motion.div>
          )}

          {/* Scene 2: WhatsApp Chat */}
          {displayScene === 2 && (
            <motion.div 
              key="body-wa"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 bg-[#E5DDD5] p-4 flex flex-col gap-3 overflow-y-auto no-scrollbar"
            >
              <div className="flex flex-col gap-2 justify-end min-h-full pb-4">
                {allMessages.map((msg, i) => (
                  <AnimatePresence key={i}>
                    {messages.includes(msg.text) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 15, originX: 0 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="bg-white px-3.5 py-2.5 rounded-[18px] rounded-tl-sm text-slate-800 text-[13px] w-max max-w-[85%] shadow-sm relative self-start"
                      >
                        {msg.text}
                        <span className="text-[9px] text-slate-400 ml-3 float-right mt-1.5">{msg.time}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>
            </motion.div>
          )}

          {/* Scene 3 & 4: Generic Website */}
          {(displayScene === 3 || displayScene === 4) && (
            <motion.div 
              key="body-web"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 bg-white overflow-y-auto no-scrollbar"
            >
              {/* Hero Banner */}
              <div className="w-full h-[220px] relative flex flex-col items-center justify-center text-center px-6 shrink-0">
                <div className="absolute inset-0">
                   <img src="/sofa/sofa-model.jpeg" className="w-full h-full object-cover" alt="Sofa Model" />
                   <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/70"></div>
                </div>
                <div className="relative z-10 flex flex-col items-center">
                   <span className="text-white font-black text-2xl tracking-tighter mb-2">Welcome to URBAN</span>
                   <span className="text-slate-200 text-[11px] leading-relaxed max-w-[260px]">Providing quality home solutions and lifestyle inspirations for modern families since 1999.</span>
                   <button className="mt-4 border border-white/60 text-white px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest shadow-sm backdrop-blur-sm rounded-sm">Read Our Story</button>
                </div>
              </div>

              {/* Categories */}
              <div className="px-4 py-6 shrink-0">
                 <h3 className="font-bold text-slate-800 text-sm mb-3">Browse by Category</h3>
                 <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                   <div className="w-[72px] shrink-0 flex flex-col items-center gap-1.5">
                     <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                        <img src="/sofa/blue-sofa.jpeg" className="w-full h-full object-cover" alt="Blue Sofa" />
                     </div>
                     <span className="text-[10px] text-slate-700 font-semibold">Living</span>
                   </div>
                   <div className="w-[72px] shrink-0 flex flex-col items-center gap-1.5">
                     <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                        <img src="/dining%20table/full%20dining%20table.jpeg" className="w-full h-full object-cover" alt="Dining Table" />
                     </div>
                     <span className="text-[10px] text-slate-700 font-semibold">Dining</span>
                   </div>
                   <div className="w-[72px] shrink-0 flex flex-col items-center gap-1.5">
                     <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                        <img src="/sofa/blue-angle-3.jpeg" className="w-full h-full object-cover" alt="Office Chair" />
                     </div>
                     <span className="text-[10px] text-slate-700 font-semibold">Office</span>
                   </div>
                   <div className="w-[72px] shrink-0 flex flex-col items-center gap-1.5">
                     <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                        <img src="/sofa/green-sofa.jpeg" className="w-full h-full object-cover" alt="Green Sofa" />
                     </div>
                     <span className="text-[10px] text-slate-700 font-semibold">Outdoor</span>
                   </div>
                 </div>
              </div>

              {/* Blog */}
              <div className="bg-slate-50 px-4 py-6 border-t border-b border-slate-100 shrink-0">
                 <h3 className="font-bold text-slate-800 text-sm mb-3">Latest from the Blog</h3>
                 <div className="bg-white border border-slate-200 p-2.5 flex gap-3 mb-2.5 shadow-sm rounded-lg">
                    <div className="w-14 h-14 bg-slate-100 shrink-0 border border-slate-200 overflow-hidden rounded-md">
                       <img src="/sofa/sofa-sketch.jpeg" className="w-full h-full object-cover" alt="Sketch" />
                    </div>
                    <div className="flex flex-col justify-center">
                       <span className="text-[11px] font-bold text-slate-800 leading-tight mb-0.5">Top 5 Trends in 2024</span>
                       <span className="text-[9px] text-slate-500 line-clamp-2 leading-relaxed">Read about the latest interior design trends taking over homes...</span>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 p-2.5 flex gap-3 shadow-sm rounded-lg">
                     <div className="w-14 h-14 bg-slate-100 shrink-0 border border-slate-200 overflow-hidden rounded-md">
                        <img src="/dining%20table/chair.jpeg" className="w-full h-full object-cover" alt="Chair" />
                     </div>
                     <div className="flex flex-col justify-center">
                        <span className="text-[11px] font-bold text-slate-800 leading-tight mb-0.5">Wood Maintenance 101</span>
                        <span className="text-[9px] text-slate-500 line-clamp-2 leading-relaxed">Learn how to properly care for your teakwood furniture...</span>
                     </div>
                  </div>
               </div>

               {/* Newsletter Footer */}
               <div className="px-4 py-8 text-center bg-slate-900 text-white mt-auto shrink-0">
                  <h3 className="font-bold text-[12px] uppercase tracking-widest mb-2">Join our Newsletter</h3>
                  <span className="text-[10px] text-slate-400 block mb-4">Get 5% off your first purchase!</span>
                  <input type="text" placeholder="Enter your email address" className="w-full bg-white/10 border border-white/20 px-3 py-2.5 text-[11px] text-white outline-none mb-3 rounded-md placeholder:text-white/40" />
                  <button className="w-full bg-white text-slate-900 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-md">Subscribe</button>
               </div>

               {/* Confused Question Popups (Scene 4 only) */}
               {showChaos && (
                 <div className="absolute inset-0 z-40 pointer-events-none">
                   <motion.div 
                     initial={{ opacity: 0, y: 10, scale: 0.9 }}
                     animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10], scale: [0.9, 1, 1, 0.9] }}
                     transition={{ duration: 2.5, times: [0, 0.1, 0.8, 1], delay: 0.8, repeat: Infinity, repeatDelay: 1.5 }}
                     className="absolute top-[18%] left-3 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2"
                   >
                     <MapPin size={14} className="text-red-500 shrink-0" />
                     <span className="text-[10px] font-bold text-slate-700">Where is the store?</span>
                   </motion.div>

                   <motion.div 
                     initial={{ opacity: 0, y: 10, scale: 0.9 }}
                     animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10], scale: [0.9, 1, 1, 0.9] }}
                     transition={{ duration: 2.5, times: [0, 0.1, 0.8, 1], delay: 2, repeat: Infinity, repeatDelay: 1.5 }}
                     className="absolute top-[42%] right-3 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2"
                   >
                     <HelpCircle size={14} className="text-orange-500 shrink-0" />
                     <span className="text-[10px] font-bold text-slate-700">Does it fit my room?</span>
                   </motion.div>

                   <motion.div 
                     initial={{ opacity: 0, y: 10, scale: 0.9 }}
                     animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10], scale: [0.9, 1, 1, 0.9] }}
                     transition={{ duration: 2.5, times: [0, 0.1, 0.8, 1], delay: 3.2, repeat: Infinity, repeatDelay: 1.5 }}
                     className="absolute top-[66%] left-6 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2"
                   >
                     <Package size={14} className="text-[#2A5BEA] shrink-0" />
                     <span className="text-[10px] font-bold text-slate-700">Is this in stock?</span>
                   </motion.div>
                 </div>
               )}

               {/* Bounce Rate Chaos Overlay */}
               {showChaos && (
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 0.3, duration: 0.8 }}
                   className="absolute inset-0 bg-red-950/10 backdrop-blur-[1.5px] z-30 pointer-events-none flex flex-col items-center justify-center"
                 >
                   <motion.div 
                     initial={{ scale: 0.7, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 20 }}
                     className="bg-white px-8 py-5 rounded-3xl shadow-[0_20px_60px_rgba(220,38,38,0.15)] border-2 border-red-500 text-center"
                   >
                      <div className="text-red-600 font-black text-5xl mb-1 tracking-tighter">98%</div>
                      <div className="text-slate-600 font-bold text-[10px] tracking-widest uppercase">Bounce Rate</div>
                   </motion.div>
                 </motion.div>
               )}

               {/* Confused cursor animation */}
               {showChaos && (
                 <motion.div 
                   initial={{ x: 150, y: 300, opacity: 0 }}
                   animate={{ 
                     x: [150, 50, 250, 100, 280, 150],
                     y: [300, 150, 200, 400, 100, 300],
                     opacity: [0, 1, 1, 1, 1, 0]
                   }}
                   transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute z-50 pointer-events-none"
                 >
                   <MousePointer2 size={32} fill="white" className="text-red-500 drop-shadow-2xl" />
                 </motion.div>
               )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      
      {/* iPhone notch & home bar */}
      <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20 pointer-events-none">
        <div className="w-[120px] h-6 bg-slate-900 rounded-b-3xl"></div>
      </div>
      <div className="absolute bottom-2 inset-x-0 h-1 flex justify-center z-20 pointer-events-none">
        <div className="w-[120px] h-1.5 bg-slate-900/20 rounded-full"></div>
      </div>
    </div>
  );
}
