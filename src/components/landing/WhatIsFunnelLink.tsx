'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Heart, Send, Bookmark, MoreHorizontal, 
  MessageCircle, ShoppingBag, ShieldCheck, Zap, RefreshCw, 
  ChevronRight, CheckCircle2, XCircle, MapPin, ArrowRight, 
  Star, ThumbsUp, Share2, HelpCircle, ChevronLeft, Truck, Menu, Eye, Users,
  Globe, Link2, HelpCircle as QuestionIcon, Camera, Briefcase, DollarSign, Clock
} from 'lucide-react';

type Step = 'quiz' | 'feedback' | 'reveal' | 'simulation' | 'proof' | 'final';
const STEPS: Step[] = ['quiz','feedback','reveal','simulation','proof','final'];
const E: [number,number,number,number] = [0.16, 1, 0.3, 1];

const OPTIONS = [
  { id:'a', label:'A', title:'Price Uncertainty', desc:'They want to know the cost.', icon: DollarSign },
  { id:'b', label:'B', title:'Slow Replies', desc:'They leave before you respond.', icon: Clock },
  { id:'c', label:'C', title:'Lack of Trust', desc:'They don\'t know if you are legit.', icon: ShieldCheck },
  { id:'d', label:'D', title:'All of the Above', desc:'All friction blocks the sale.', icon: HelpCircle },
];

const INJECTED_STYLES = `
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .brand-gradient {
    background: linear-gradient(135deg, #5DBEF5, #2D63EC, #9A58F0);
  }
  .brand-gradient-text {
    background: linear-gradient(to right, #5DBEF5, #2D63EC, #9A58F0) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    background-clip: text !important;
    color: transparent !important;
  }
  .what-is-funnellink-section {
    color: #000000 !important;
  }
  .what-is-funnellink-section [class*="text-slate-9"],
  .what-is-funnellink-section [class*="text-slate-8"],
  .what-is-funnellink-section [class*="text-slate-7"],
  .what-is-funnellink-section [class*="text-neutral-9"],
  .what-is-funnellink-section [class*="text-neutral-8"],
  .what-is-funnellink-section [class*="text-neutral-7"] {
    color: #000000 !important;
    opacity: 1 !important;
  }
  .what-is-funnellink-section [class*="text-slate-6"],
  .what-is-funnellink-section [class*="text-slate-5"],
  .what-is-funnellink-section [class*="text-neutral-6"],
  .what-is-funnellink-section [class*="text-neutral-5"] {
    color: #000000 !important;
    opacity: 0.7 !important;
  }
  .what-is-funnellink-section [class*="text-slate-4"],
  .what-is-funnellink-section [class*="text-slate-3"],
  .what-is-funnellink-section [class*="text-neutral-4"],
  .what-is-funnellink-section [class*="text-neutral-3"] {
    color: #000000 !important;
    opacity: 0.55 !important;
  }
  @keyframes click-bounce {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-5px) scale(1.02); }
  }
  .click-guide-bounce {
    animation: click-bounce 1.0s infinite ease-in-out;
  }
`;

const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YoutubeIcon = ({ size = 24, className = "" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width={size} height={size} className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
    <polygon fill="white" points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
  </svg>
);

const ClickGuide = ({ text, className = "", color = "bg-blue-600", delay = 2.0 }: { text: string; className?: string; color?: string; delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.3 }}
    className={`absolute pointer-events-none flex flex-col items-center z-50 click-guide-bounce ${className}`}
  >
    <div className={`${color} text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-white/20 whitespace-nowrap mb-1`}>
      {text}
    </div>
    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-current" style={{ color: color === 'bg-blue-600' ? '#2D63EC' : color === 'bg-[#25D366]' ? '#25D366' : color === 'bg-emerald-600' ? '#059669' : undefined }}></div>
  </motion.div>
);

const SocialMediaScreen = ({ onAction, mode }: { onAction: () => void; mode: 'bad' | 'good' }) => {
  const [platform, setPlatform] = useState<'instagram' | 'youtube'>('instagram'); 

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 1.05 }}
      className="absolute inset-0 bg-white flex flex-col text-slate-900"
    >
      {/* Platform Switcher Header */}
      <div className="h-12 border-b border-slate-100 flex items-center justify-around px-2 shrink-0 bg-slate-50">
        <button 
          onClick={() => setPlatform('instagram')} 
          className={`flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold transition-all ${
            platform === 'instagram' ? 'text-pink-600 bg-pink-50' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <InstagramIcon size={14} /> Instagram
        </button>
        <button 
          onClick={() => setPlatform('youtube')} 
          className={`flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold transition-all ${
            platform === 'youtube' ? 'text-red-600 bg-red-50' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <YoutubeIcon size={16} /> YouTube
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-6 bg-white">
        <AnimatePresence mode="wait">
          {platform === 'instagram' ? (
            <motion.div 
              key="insta" 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 10 }}
              className="flex flex-col"
            >
              <div className="h-[52px] flex items-center justify-between px-3 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600 p-[1.5px]">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-black text-[9px] text-slate-900">URBN</div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold leading-tight">urbanliving.sofas</span>
                    <span className="text-[10px] text-slate-400 leading-tight">Sponsored</span>
                  </div>
                </div>
                <MoreHorizontal size={18} className="text-slate-400" />
              </div>

              {/* Sofa Image Post */}
              <div className="w-full aspect-square bg-slate-100 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#e2e8f0] to-[#cbd5e1]"></div>
                <div className="text-8xl relative z-10 drop-shadow-xl select-none">🛋️</div>
              </div>

              {/* Instagram CTA Action bar */}
              <div className="relative">
                <button 
                  onClick={onAction} 
                  className={`w-full border-b border-slate-100 px-4 py-3 flex items-center justify-between cursor-pointer transition-colors relative group ${
                    mode === 'bad' ? 'bg-[#f8fafc] hover:bg-slate-150' : 'bg-blue-50 hover:bg-blue-100'
                  }`}
                >
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-black uppercase tracking-widest mb-0.5 text-blue-600">
                      {mode === 'bad' ? 'WhatsApp Ad' : 'FunnelLink Store'}
                    </span>
                    <span className="text-[14px] font-bold text-blue-900 leading-tight">
                      {mode === 'bad' ? 'Send Message' : 'View Store & Prices'}
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                  <span className="absolute right-10 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                  </span>
                </button>
                <ClickGuide text={mode === 'bad' ? "Click 'Send Message'" : "Click 'View Store & Prices'"} className="-top-12 left-1/2 -translate-x-1/2" />
              </div>

              <div className="p-3 font-sans">
                <div className="flex gap-3 mb-2">
                  <Heart size={20} className="text-rose-500 fill-rose-500" />
                  <MessageCircle size={20} className="transform scale-x-[-1]" />
                  <Send size={20} />
                </div>
                <div className="text-[12px] font-bold mb-0.5 text-slate-800">1,204 likes</div>
                <div className="text-[12px] text-slate-600 leading-snug">
                  <span className="font-bold text-slate-800 mr-1.5">urbanliving.sofas</span>
                  Upgrade your living room! Handcrafted luxury. ✨
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="youtube" 
              initial={{ opacity: 0, x: 10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col"
            >
              {/* Simulated Video Player */}
              <div className="w-full aspect-video bg-slate-950 relative flex items-center justify-center">
                <div className="text-5xl z-10 drop-shadow-2xl select-none">🛋️</div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[9px] font-mono font-bold px-1 py-0.5 rounded">0:15</div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <Play size={24} className="text-white fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Ad content */}
              <div className="p-3 border-b border-slate-100 font-sans">
                <h3 className="text-[14px] font-bold text-slate-900 leading-tight mb-1">
                  The Best Sofa for Modern Apartments in 2026
                </h3>
                <div className="text-[10px] text-slate-400 font-medium">
                  145K views • 2 days ago
                </div>
                <div className="flex gap-2 mt-3">
                  <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-600"><ThumbsUp size={11}/> 12K</div>
                  <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-600"><Share2 size={11}/> Share</div>
                </div>
              </div>

              {/* YouTube Sponsored CTA block */}
              <div className="p-3 font-sans">
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-200 rounded-lg flex items-center justify-center text-lg shrink-0 select-none">🛋️</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Sponsored</div>
                    <div className="text-xs font-bold text-slate-800 truncate">Urban Living Sofas</div>
                  </div>
                </div>
                
                <div className="relative mt-3 w-full">
                  <button 
                    onClick={onAction} 
                    className="w-full bg-blue-600 text-white py-3 rounded-full font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors relative"
                  >
                    {mode === 'bad' ? 'Chat on WhatsApp' : 'Open Store'} <ArrowRight size={14} />
                    <span className="absolute right-4 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                    </span>
                  </button>
                  <ClickGuide text={mode === 'bad' ? "Click to Chat" : "Click to Open Store"} className="-top-12 left-1/2 -translate-x-1/2" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const ChatSequence = ({ 
  script, 
  onComplete 
}: { 
  script: Array<{ text: string; time: string; sender: 'user' | 'bot'; delay?: number }>; 
  onComplete: () => void;
}) => {
  const [messages, setMessages] = useState<typeof script>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < script.length) {
      setIsTyping(true);
      const msg = script[currentIndex];
      
      const typingTimer = setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, msg]);
        
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
        }, 400);

      }, msg.delay || 1200);

      return () => clearTimeout(typingTimer);
    } else {
      const endTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 2000);
      return () => clearTimeout(endTimer);
    }
  }, [currentIndex, script, onComplete]);

  return (
    <div className="absolute inset-0 bg-[#E5DDD5] flex flex-col font-sans">
      {/* WhatsApp Header */}
      <div className="h-14 bg-[#075E54] flex items-center px-3 gap-2.5 shrink-0 text-white shadow-md z-10 relative">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center overflow-hidden font-black text-[9px]">URBN</div>
        <div>
          <div className="text-xs font-bold leading-tight">Urban Living</div>
          <div className="text-[9px] text-white/80">Business Account</div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-3.5 flex flex-col gap-2 overflow-y-auto no-scrollbar pb-16">
        <div className="bg-[#D1EAF1] text-center text-[9px] text-slate-500 py-1 px-2.5 rounded-md mx-auto mb-2 shadow-sm">
          Today
        </div>
        
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9, y: 8, originX: msg.sender === 'user' ? 1 : 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`px-3 py-2 rounded-[16px] text-[12.5px] w-max max-w-[85%] shadow-sm relative leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user' 
                  ? 'bg-[#DCF8C6] text-slate-800 rounded-tr-sm self-end' 
                  : 'bg-white text-slate-800 rounded-tl-sm self-start'
              }`}
            >
              {msg.text}
              <span className="text-[8px] text-slate-400 ml-2 float-right mt-1.5 block">{msg.time} {msg.sender === 'user' && '✓✓'}</span>
            </motion.div>
          ))}
          {isTyping && currentIndex < script.length && (
            <motion.div
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className={`text-[9px] text-slate-500 italic px-2 mt-0.5 ${
                script[currentIndex].sender === 'user' ? 'self-end mr-1' : 'self-start ml-1'
              }`}
            >
              {script[currentIndex].sender === 'user' ? 'Customer is typing...' : 'Urban Living is typing...'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* WhatsApp Message Input Bar */}
      <div className="absolute bottom-0 inset-x-0 h-14 bg-[#f0f0f0] flex items-center px-2 gap-2 border-t border-slate-200">
        <div className="flex-1 h-9 bg-white rounded-full px-4 flex items-center text-slate-400 text-xs shadow-inner">
          Type a message
        </div>
        <div className="w-9 h-9 bg-[#075E54] rounded-full flex items-center justify-center text-white opacity-40">
          <Send size={14} />
        </div>
      </div>
    </div>
  );
};

const FunnelLinkStorefront = ({ onAction }: { onAction: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 1.05 }}
      className="absolute inset-0 bg-[#F7F5F0] flex flex-col text-[#1C1B1A] overflow-hidden font-sans"
    >
      {/* Header */}
      <div className="h-12 border-b border-black/5 flex items-center justify-between px-3 shrink-0 bg-white shadow-sm z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 bg-[#1C1B1A] rounded-full text-white flex items-center justify-center text-[10px] font-bold">U</div>
          <span className="font-serif text-[13px] font-medium tracking-tight">Urban Living.</span>
        </div>
        <Menu size={16} className="text-[#1C1B1A] opacity-60" />
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
        {/* Storefront Hero section */}
        <div className="p-5 text-center bg-white rounded-b-[1.5rem] shadow-sm mb-4">
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#D47A5A] mb-1.5 block">Factory Direct</span>
          <h1 className="font-serif text-[1.4rem] tracking-tight leading-[1.15] mb-1.5 text-slate-900">Luxury sofas,<br/>delivered fast.</h1>
          <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto leading-relaxed">Browse details and purchase instantly via WhatsApp.</p>
        </div>

        {/* Dynamic Reviews Metric Bar */}
        <div className="px-3.5 mb-4">
          <div className="bg-white rounded-xl p-3 shadow-sm border border-black/5 flex justify-around items-center">
             <div className="text-center">
                <div className="font-bold text-xs text-[#1C1B1A] flex items-center justify-center gap-0.5">
                  4.8 <Star size={10} fill="currentColor" className="text-[#F2A900] text-amber-500" />
                </div>
                <div className="text-[8px] text-slate-400 uppercase tracking-wider mt-0.5">Reviews</div>
             </div>
             <div className="w-px h-6 bg-black/5" />
             <div className="text-center">
                <div className="font-bold text-xs text-[#1C1B1A]">1200+</div>
                <div className="text-[8px] text-slate-400 uppercase tracking-wider mt-0.5">Delivered</div>
             </div>
          </div>
        </div>

        {/* Featured Items Grid */}
        <div className="px-3.5">
          <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-800 mb-3 ml-0.5">Featured Collection</h3>
          
          {/* Main Sofa Listing Card */}
          <div className="relative">
            <button 
              onClick={onAction} 
              className="w-full text-left bg-white rounded-[1.25rem] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-black/5 relative group cursor-pointer active:scale-[0.98] transition-all block"
            >
              <div className="h-32 bg-[#EBE6DC] relative">
                <img 
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80" 
                  className="w-full h-full object-cover" 
                  alt="Milano Sofa"
                />
                <div className="absolute top-2.5 left-2.5 bg-[#1C1B1A] text-white text-[7px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-md">Top Pick</div>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-[14px] leading-tight mb-0.5 text-[#1C1B1A] font-bold">Milano 3-Seater</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#D47A5A] font-bold text-xs">$400</span>
                    <span className="text-[9px] text-slate-400 line-through">$650</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center relative shadow-md shrink-0">
                  <ArrowRight size={14} />
                  <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366] border border-white"></span>
                  </span>
                </div>
              </div>
            </button>
            <ClickGuide text="Click Milano Sofa" className="-top-12 left-1/2 -translate-x-1/2" />
          </div>
          
          {/* Decorative Secondary Card to make it feel like a real storefront list */}
          <div className="w-full mt-3 bg-white rounded-[1.25rem] overflow-hidden shadow-sm border border-black/5 flex opacity-60">
            <div className="w-16 h-16 bg-[#EBE6DC] shrink-0">
               <img 
                 src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=300&q=80" 
                 className="w-full h-full object-cover" 
                 alt="Bed Frame" 
               />
            </div>
            <div className="p-2.5 flex flex-col justify-center">
               <h4 className="font-serif text-[11px] leading-tight mb-0.5 text-slate-900 font-bold">Rustic Bed Frame</h4>
               <span className="text-[#D47A5A] font-bold text-[10px]">$550</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FunnelLinkCatalog = ({ 
  onAction, 
  catalogHighlight, 
  setCatalogHighlight 
}: { 
  onAction: () => void; 
  catalogHighlight: number;
  setCatalogHighlight: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);

  useEffect(() => {
    setCheckedSteps([]);
    setCatalogHighlight(-1);
    const t1 = setTimeout(() => setCheckedSteps(prev => [...prev, 0]), 400);
    const t2 = setTimeout(() => setCheckedSteps(prev => [...prev, 1]), 800);
    const t3 = setTimeout(() => setCheckedSteps(prev => [...prev, 2]), 1200);
    const t4 = setTimeout(() => setCheckedSteps(prev => [...prev, 3]), 1600);
    const t5 = setTimeout(() => setCatalogHighlight(4), 2000);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5);
    };
  }, [setCatalogHighlight]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -50 }}
      className="absolute inset-0 bg-[#F7F5F0] flex flex-col text-[#1C1B1A] overflow-hidden font-sans"
    >
      {/* Product Image Cover */}
      <div className="w-full aspect-[4/5] bg-[#EBE6DC] relative shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80" 
          alt="Milano Sofa" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute top-3 left-3 w-7 h-7 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm">
          <ChevronLeft size={16} className="text-[#1C1B1A]"/>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Details Scroll area */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 -mt-4 rounded-t-3xl bg-white p-4 pb-20 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <Star size={10} className="text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-bold text-slate-800">4.8</span>
          </div>
          <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <ShieldCheck size={10} className="text-emerald-600" />
            <span className="text-[8px] font-black text-emerald-700 uppercase">Solid Oak Wood</span>
          </div>
        </div>

        <h2 className="font-serif text-2xl tracking-tight text-[#1C1B1A] leading-tight mb-1">Milano Sofa</h2>
        
        <div className="flex items-center gap-1.5 mb-5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D47A5A] animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-wider text-[#D47A5A]">Only 2 frames left</span>
        </div>

        {/* Static background objection panels */}
        <div className="flex gap-2.5 mb-4 w-full">
          <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col justify-center">
            <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Price</p>
            <p className="text-lg font-black text-slate-800">$400</p>
          </div>
          
          <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col justify-center">
            <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Delivery</p>
            <div className="flex items-center gap-1">
              <Truck size={10} className="text-[#D47A5A]" />
              <p className="text-[11px] font-bold text-[#D47A5A] uppercase">Free</p>
            </div>
          </div>
        </div>

        <div className="mb-4 p-3 rounded-xl border bg-slate-50 border-slate-100">
          <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-1">Color Finish</p>
          <div className="flex items-center gap-2">
            <div className="w-4.5 h-4.5 rounded-full bg-blue-900 border border-white shadow-sm" />
            <p className="text-xs font-bold text-slate-800">Deep Navy Velvet</p>
          </div>
        </div>

        <div className="p-3 rounded-xl border bg-slate-50 border-slate-100">
          <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-1">Warranty</p>
          <p className="text-xs font-bold text-slate-800">5-Year Structural Frame Guarantee</p>
        </div>

      </div>

      {/* Pre-Sales Conversion Layer Overlay Checklist */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="absolute inset-x-3 bottom-[72px] z-40 bg-slate-950 text-white rounded-2xl p-4 shadow-[0_12px_36px_rgba(0,0,0,0.35)] border border-white/10"
      >
        <div className="flex items-center gap-2.5 mb-3 pb-2 border-b border-white/10">
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center shadow">
            <Zap size={13} className="text-white fill-white" />
          </div>
          <div>
            <h3 className="text-xs font-black tracking-widest uppercase text-blue-400">Conversion Layer</h3>
            <p className="text-[9px] text-slate-400 font-medium leading-none mt-0.5">Answering customer objections pre-chat</p>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Price Objection Resolved</span>
            <span className="font-bold flex items-center gap-1">
              {checkedSteps.includes(0) ? (
                <motion.span initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-emerald-400 flex items-center gap-1 font-bold">
                  ✓ $400 Direct
                </motion.span>
              ) : (
                <span className="text-slate-600 animate-pulse">Scanning...</span>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Delivery Fears Resolved</span>
            <span className="font-bold flex items-center gap-1">
              {checkedSteps.includes(1) ? (
                <motion.span initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-emerald-400 flex items-center gap-1 font-bold">
                  ✓ Free Shipping
                </motion.span>
              ) : (
                <span className="text-slate-600">
                  {checkedSteps.includes(0) ? <span className="animate-pulse">Scanning...</span> : "Pending"}
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Warranty Handled</span>
            <span className="font-bold flex items-center gap-1">
              {checkedSteps.includes(2) ? (
                <motion.span initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-emerald-400 flex items-center gap-1 font-bold">
                  ✓ 5-Year structural
                </motion.span>
              ) : (
                <span className="text-slate-600">
                  {checkedSteps.includes(1) ? <span className="animate-pulse">Scanning...</span> : "Pending"}
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Trust Objections Handled</span>
            <span className="font-bold flex items-center gap-1">
              {checkedSteps.includes(3) ? (
                <motion.span initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-emerald-400 flex items-center gap-1 font-bold">
                  ✓ Solid Oak wood
                </motion.span>
              ) : (
                <span className="text-slate-600">
                  {checkedSteps.includes(2) ? <span className="animate-pulse">Scanning...</span> : "Pending"}
                </span>
              )}
            </span>
          </div>
        </div>

        {checkedSteps.includes(3) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider"
          >
            🔥 Customer Ready to Buy
          </motion.div>
        )}
      </motion.div>

      {/* Sticky Whatsapp Order CTA */}
      <div className="absolute bottom-3 inset-x-3 z-30">
        <div className="relative w-full">
          <button 
            onClick={onAction} 
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg border border-white/10"
          >
            <MessageCircle size={16} fill="currentColor" /> Chat & Buy
            <AnimatePresence>
              {catalogHighlight >= 4 && (
                <motion.span initial={{opacity: 0}} animate={{opacity: 1}} className="absolute right-4 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <ClickGuide text="Click 'Chat & Buy'" className="-top-12 left-1/2 -translate-x-1/2 bg-[#25D366]" color="bg-[#25D366]" />
        </div>
      </div>
    </motion.div>
  );
};

const CustomerMindSidebar = ({ 
  gameState, 
  catalogHighlight 
}: { 
  gameState: number; 
  catalogHighlight: number;
}) => {
  const questions = [
    { id: 0, q: "How much does it cost?", a: "Price clearly shown ($400)" },
    { id: 1, q: "What colors are available?", a: "Color option selected visually" },
    { id: 2, q: "Is there a warranty?", a: "5-Year Guarantee included" },
    { id: 3, q: "Do you deliver to my area?", a: "Free downtown delivery stated" }
  ];

  let title = "Customer Mind";
  let subtitle = "Objections and questions";
  let themeColor = "border-slate-200 bg-white";

  if (gameState === 0) {
    title = "Customer Mind";
    subtitle = "Waiting to start...";
  } else if (gameState === 1 || gameState === 2) {
    title = "Customer Mind";
    subtitle = "Friction is building up... ⚠️";
    themeColor = "border-amber-200 bg-amber-50/20";
  } else if (gameState === 3) {
    title = "Customer Mind";
    subtitle = "Lead abandoned! ❌";
    themeColor = "border-rose-200 bg-rose-50/20";
  } else if (gameState === 4 || gameState === 5) {
    title = "Customer Mind";
    subtitle = "Entering pre-selling store... 🛍️";
    themeColor = "border-blue-200 bg-blue-50/20";
  } else if (gameState === 6) {
    title = "Customer Mind";
    subtitle = "Pre-selling in real time... ✨";
    themeColor = "border-indigo-200 bg-indigo-50/20";
  } else if (gameState >= 7) {
    title = "Customer Mind";
    subtitle = "100% Pre-sold & Ready! ✅";
    themeColor = "border-emerald-200 bg-emerald-50/20";
  }

  return (
    <motion.div 
      layout
      className={`w-full max-w-sm bg-white rounded-[2rem] border p-6 shadow-xl transition-colors duration-500 font-sans ${themeColor}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 ${
          gameState === 3 ? 'bg-rose-100 text-rose-600' :
          gameState >= 7 ? 'bg-emerald-100 text-emerald-600' :
          gameState === 6 ? 'bg-indigo-100 text-indigo-600' :
          'bg-slate-100 text-slate-500'
        }`}>
          {gameState === 3 ? <XCircle size={20} /> :
           gameState >= 7 ? <CheckCircle2 size={20} /> :
           <HelpCircle size={20} />}
        </div>
        <div>
          <h3 className="font-black text-slate-900 text-lg leading-tight">{title}</h3>
          <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-4 relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-slate-100/80 z-0"></div>

        {questions.map((q) => {
          let itemStyle = "bg-white border-slate-100 text-slate-400";
          let badgeStyle = "bg-slate-100 text-slate-400";
          let label = "Pending";
          let answerText = "";
          let icon = <HelpCircle size={16} />;

          if (gameState === 1 || gameState === 2) {
            // Unresolved questions
            itemStyle = "bg-white border-amber-100 text-slate-600 shadow-sm";
            badgeStyle = "bg-amber-100 text-amber-700 animate-pulse";
            label = "Waiting...";
            icon = <HelpCircle size={16} className="text-amber-600" />;
          } else if (gameState === 3) {
            // Abandoned
            itemStyle = "bg-rose-50/50 border-rose-150 text-rose-900/60 line-through decoration-rose-200";
            badgeStyle = "bg-rose-100 text-rose-700";
            label = "Abandoned";
            icon = <XCircle size={16} className="text-rose-600" />;
          } else if (gameState === 4 || gameState === 5) {
            itemStyle = "bg-white border-slate-150 text-slate-500";
            badgeStyle = "bg-slate-100 text-slate-500";
            label = "Entering...";
          } else if (gameState === 6) {
            const isActive = catalogHighlight === q.id;
            const isChecked = catalogHighlight > q.id;

            if (isActive) {
              itemStyle = "bg-amber-50 border-amber-400 shadow-lg scale-[1.03] ring-4 ring-amber-105/50 text-amber-950 font-bold z-10";
              badgeStyle = "bg-amber-400 text-white shadow-inner animate-bounce";
              label = "Resolving...";
              icon = <Zap size={14} fill="currentColor" className="text-white animate-pulse" />;
            } else if (isChecked) {
              itemStyle = "bg-emerald-50 border-emerald-200 shadow-sm text-emerald-900 z-10";
              badgeStyle = "bg-emerald-500 text-white shadow-md";
              label = "Answered!";
              answerText = q.a;
              icon = <CheckCircle2 size={14} strokeWidth={3} />;
            }
          } else if (gameState >= 7) {
            // All resolved
            itemStyle = "bg-emerald-50 border-emerald-100 shadow-sm text-emerald-900";
            badgeStyle = "bg-emerald-500 text-white shadow-sm";
            label = "Answered!";
            answerText = q.a;
            icon = <CheckCircle2 size={14} strokeWidth={3} />;
          }

          return (
            <motion.div 
              key={q.id} 
              layout
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 relative z-10 ${itemStyle}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${badgeStyle}`}>
                {icon}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <span className="text-xs font-bold block truncate leading-tight">{q.q}</span>
                {answerText && (
                  <motion.span 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="block text-[11px] font-semibold text-emerald-600 mt-1 leading-snug text-left"
                  >
                    {answerText}
                  </motion.span>
                )}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shrink-0 self-center ${
                label === 'Answered!' ? 'bg-emerald-100 text-emerald-700' :
                label === 'Resolving...' ? 'bg-amber-100 text-amber-800' :
                label === 'Abandoned' ? 'bg-rose-100 text-rose-700' :
                'bg-slate-100 text-slate-400'
              }`}>
                {label}
              </span>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {gameState === 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-800 font-bold text-xs text-center flex flex-col items-center gap-2"
          >
            <div className="text-base">😞</div>
            No response from business. Customer goes to a competitor.
          </motion.div>
        )}
        {gameState === 8 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold text-xs text-center flex flex-col items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
               <Zap size={16} fill="currentColor" />
            </div>
            Friction Eliminated.
            <span className="text-[10px] font-medium text-emerald-600 block">Customer arrives ready to pay instantly!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const OwnersMindSidebar = ({ gameState }: { gameState: number }) => {
  let title = "Owner's Mind";
  let subtitle = "Business operations status";
  let themeColor = "border-slate-200 bg-white";
  let iconColor = "bg-slate-100 text-slate-500";
  let thoughts: Array<{ text: string; icon: React.ReactNode; color: string }> = [];

  if (gameState === 0) {
    title = "Owner's Mind";
    subtitle = "Waiting to launch...";
    themeColor = "border-slate-200 bg-white";
    thoughts = [
      { text: "Ad budget is active on Instagram & YouTube.", icon: <Briefcase size={14} />, color: "text-slate-500 bg-slate-50" },
      { text: "Hoping leads convert today.", icon: <Star size={14} />, color: "text-slate-500 bg-slate-50" }
    ];
  } else if (gameState === 1 || gameState === 2) {
    title = "Owner's Mind";
    subtitle = "Frustrated & Overwhelmed 😩";
    themeColor = "border-amber-200 bg-amber-50/20";
    iconColor = "bg-amber-100 text-amber-700 animate-pulse";
    thoughts = [
      { text: "Spent 2 hours manually replying to 'How much?'", icon: <XCircle size={14} />, color: "text-amber-700 bg-amber-50" },
      { text: "No idea if lead came from Instagram or YouTube.", icon: <HelpCircle size={14} />, color: "text-amber-700 bg-amber-50" },
      { text: "Tied to my phone 24/7 just to answer basic FAQs.", icon: <MessageCircle size={14} />, color: "text-amber-700 bg-amber-50" }
    ];
  } else if (gameState === 3) {
    title = "Owner's Mind";
    subtitle = "Lost Sale & Wasted Budget 💸";
    themeColor = "border-rose-200 bg-rose-50/20";
    iconColor = "bg-rose-100 text-rose-700";
    thoughts = [
      { text: "Replied 15 mins too late. Lead already left.", icon: <XCircle size={14} />, color: "text-rose-700 bg-rose-50" },
      { text: "Zero tracking of customer conversion rate.", icon: <HelpCircle size={14} />, color: "text-rose-700 bg-rose-50" },
      { text: "Customer got confused by chat price and dropped.", icon: <XCircle size={14} />, color: "text-rose-700 bg-rose-50" }
    ];
  } else if (gameState === 4 || gameState === 5 || gameState === 6) {
    title = "Owner's Mind";
    subtitle = "FunnelLink Automating... 🤖";
    themeColor = "border-indigo-200 bg-indigo-50/20";
    iconColor = "bg-indigo-100 text-indigo-700";
    thoughts = [
      { text: "Objection resolution layer handles friction.", icon: <Eye size={14} />, color: "text-indigo-700 bg-indigo-50" },
      { text: "Source tracked: UTM parameters active.", icon: <CheckCircle2 size={14} />, color: "text-indigo-700 bg-indigo-50" },
      { text: "All 4 objections answered automatically.", icon: <ShieldCheck size={14} />, color: "text-indigo-700 bg-indigo-50" }
    ];
  } else if (gameState >= 7) {
    title = "Owner's Mind";
    subtitle = "Relaxed & Profitable! 😎";
    themeColor = "border-emerald-200 bg-emerald-50/20";
    iconColor = "bg-emerald-100 text-emerald-700";
    thoughts = [
      { text: "Pre-sold lead arrived ready to pay instantly.", icon: <CheckCircle2 size={14} />, color: "text-emerald-700 bg-emerald-50" },
      { text: "Closed sale in 1 tap using checkout link.", icon: <Zap size={14} fill="currentColor" />, color: "text-emerald-700 bg-emerald-50" },
      { text: "Friction resolved before owner needs to type.", icon: <CheckCircle2 size={14} />, color: "text-emerald-700 bg-emerald-50" }
    ];
  }

  return (
    <motion.div 
      layout
      className={`w-full max-w-sm bg-white rounded-[2rem] border p-6 shadow-xl transition-colors duration-500 font-sans ${themeColor}`}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 ${iconColor}`}>
          {gameState <= 3 ? <Briefcase size={18} /> : <Zap size={18} />}
        </div>
        <div>
          <h3 className="font-black text-slate-900 text-lg leading-tight">{title}</h3>
          <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-3">
        {thoughts.map((t, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.15 }}
            className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm text-left"
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${t.color}`}>
              {t.icon}
            </div>
            <span className="text-xs font-semibold text-slate-700 leading-tight">{t.text}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const DualMindSidebar = ({ 
  gameState, 
  catalogHighlight 
}: { 
  gameState: number; 
  catalogHighlight: number;
}) => {
  const [activeTab, setActiveTab] = useState<'customer' | 'owner'>('customer');

  useEffect(() => {
    if (gameState >= 4) {
      setActiveTab('owner');
    } else {
      setActiveTab('customer');
    }
  }, [gameState]);

  return (
    <div className="w-full max-w-sm lg:w-[320px] xl:w-[350px] shrink-0 z-30 flex flex-col gap-4">
      {/* Segmented Control Selector */}
      <div className="flex p-1 bg-slate-100/80 backdrop-blur rounded-xl border border-slate-200/50">
        <button 
          onClick={() => setActiveTab('customer')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'customer' 
              ? 'bg-white text-slate-800 shadow-sm' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users size={14} /> Customer's Mind
        </button>
        <button 
          onClick={() => setActiveTab('owner')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'owner' 
              ? 'bg-white text-slate-800 shadow-sm' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase size={14} /> Owner's Mind
        </button>
      </div>

      <div className="relative min-h-[440px]">
        <AnimatePresence mode="wait">
          {activeTab === 'customer' ? (
            <motion.div
              key="customer-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 top-0"
            >
              <CustomerMindSidebar gameState={gameState} catalogHighlight={catalogHighlight} />
            </motion.div>
          ) : (
            <motion.div
              key="owner-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 top-0"
            >
              <OwnersMindSidebar gameState={gameState} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const CombinedSimulation = ({ onNext }: { onNext: () => void }) => {
  const [gameState, setGameState] = useState(0);
  const [catalogHighlight, setCatalogHighlight] = useState(-1);

  // Scripts for Chat Simulator
  const badScript = [
    { text: "Hi, I saw your ad on social media.", time: "10:01 AM", sender: "user" as const, delay: 1000 },
    { text: "What is the price of the sofa?", time: "10:02 AM", sender: "user" as const, delay: 1200 },
    { text: "Hi! Let me check with the warehouse.", time: "10:25 AM", sender: "bot" as const, delay: 2000 },
    { text: "Do you have it in blue?", time: "10:26 AM", sender: "user" as const, delay: 1200 },
    { text: "Do you deliver to my area?", time: "10:28 AM", sender: "user" as const, delay: 1500 },
    { text: "Hello?? Are you there?", time: "11:15 AM", sender: "user" as const, delay: 2500 },
    { text: "Nevermind, buying somewhere else.", time: "11:40 AM", sender: "user" as const, delay: 1500 },
    { text: "Sorry for delay! Yes we have blue. Delivery is $80.", time: "02:15 PM", sender: "bot" as const, delay: 2000 },
  ];

  const goodScript = [
    { 
      text: "Hi Urban Living,\n\nI’m interested in this:\n\n• Product: Milano Sofa\n\nPlease share:\n1. Best final factory price\n2. Customization (size, fabric, wood)\n3. Delivery time to my city", 
      time: "10:05 AM", 
      sender: "user" as const, 
      delay: 1000 
    },
    { 
      text: "Hi there! Absolutely. 🛋️✨\n\nHere are the details for your Milano Sofa inquiry:\n• Price: $400 (Factory Direct)\n• Colors: Deep Navy Velvet\n• Warranty: 5-Year Guarantee\n• Delivery: Free Downtown Delivery\n\nHere is your secure checkout link:\nhttps://pay.urban.co/checkout\n\nOnce paid, we will schedule your delivery!", 
      time: "10:06 AM", 
      sender: "bot" as const, 
      delay: 2000 
    },
    { 
      text: "Perfect! Just completed the payment. Please confirm.", 
      time: "10:07 AM", 
      sender: "user" as const, 
      delay: 1200 
    },
    { 
      text: "Payment confirmed! Your order is scheduled for delivery tomorrow morning. 🚚", 
      time: "10:08 AM", 
      sender: "bot" as const, 
      delay: 1000 
    }
  ];

  return (
    <div className="w-full min-h-[610px] flex flex-col lg:flex-row items-center justify-center p-2 gap-8 lg:gap-12 relative">
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      
      {/* Background aesthetics */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className={`w-[600px] h-[600px] rounded-full blur-[120px] transition-colors duration-1000 ${
          gameState === 2 || gameState === 3 ? 'bg-red-500/5' : gameState >= 5 ? 'bg-emerald-500/5' : 'bg-transparent'
        }`} />
      </div>

      {/* Context Sidebar (Left side) */}
      <div className="flex flex-col max-w-sm relative z-10 text-left shrink-0">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest mb-4 w-max">
          Interactive Simulator
        </div>
        <h3 className="text-3xl font-tanker tracking-tight mb-3 text-slate-900 leading-[1.1]">
          The Customer <span className="brand-gradient-text">Journey Game</span>
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6 font-sans">
          Play the simulation to see how friction kills leads, and how clarity creates instant conversions.
        </p>

        {/* Progress Tracker */}
        <div className="space-y-4 border-l-2 border-slate-200 ml-3 pl-6 relative font-sans">
          <div className="absolute -left-[2px] top-0 bottom-0 w-[2px] overflow-hidden">
            <motion.div 
              className="w-[2px] bg-blue-500 absolute top-0 left-0 rounded-full"
              animate={{ height: `${(gameState / 8) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className={`relative transition-colors duration-300 ${gameState >= 1 && gameState <= 3 ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
            <div className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 bg-white transition-colors duration-300 ${gameState >= 1 && gameState <= 3 ? 'border-blue-500' : 'border-slate-300'}`}></div>
            <h4 className="text-xs">1. The Broken Reality</h4>
            <p className="text-[10px] mt-0.5 opacity-70 font-medium font-sans">Directing social traffic straight to WhatsApp.</p>
          </div>
          <div className={`relative transition-colors duration-300 ${gameState >= 4 && gameState <= 6 ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
            <div className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 bg-white transition-colors duration-300 ${gameState >= 4 && gameState <= 6 ? 'border-blue-500' : 'border-slate-300'}`}></div>
            <h4 className="text-xs">2. The FunnelLink Fix</h4>
            <p className="text-[10px] mt-0.5 opacity-70 font-medium font-sans">Adding a pre-sales page before the chat.</p>
          </div>
          <div className={`relative transition-colors duration-300 ${gameState >= 7 ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
            <div className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 bg-white transition-colors duration-300 ${gameState >= 7 ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'}`}></div>
            <h4 className="text-xs">3. Sale Closed</h4>
            <p className="text-[10px] mt-0.5 opacity-70 font-medium font-sans">A perfect, frictionless conversion.</p>
          </div>
        </div>
      </div>

      {/* Mobile Phone Mockup Container (Middle) */}
      <div className="relative shrink-0">
        <div className="relative w-[310px] h-[610px] bg-slate-900 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border-[10px] border-slate-900 overflow-hidden z-20">
          
          {/* Dynamic Notch */}
          <div className="absolute top-0 inset-x-0 h-5 flex justify-center z-50 pointer-events-none">
            <div className="w-[100px] h-[16px] bg-slate-900 rounded-b-xl"></div>
          </div>

          {/* Screen Content Wrapper */}
          <div className="relative w-full h-full bg-white overflow-hidden">
            <AnimatePresence mode="wait">
              
              {/* STATE 0: Start Menu */}
              {gameState === 0 && (
                <motion.div 
                  key="start"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center"
                >
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-lg">
                    <Play size={32} className="text-[#5DBEF5] ml-0.5" fill="currentColor" />
                  </div>
                  <h2 className="text-2xl font-black text-white mb-2 font-tanker">Start Journey</h2>
                  <p className="text-xs text-slate-400 mb-8 leading-relaxed font-sans">
                    Let's see what happens when you send Instagram or YouTube traffic directly to WhatsApp.
                  </p>
                  <div className="relative w-full">
                    <button 
                      onClick={() => setGameState(1)}
                      className="w-full brand-gradient text-white py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                    >
                      Play Reality
                    </button>
                    <ClickGuide text="Click to Play" className="-top-12 left-1/2 -translate-x-1/2" />
                  </div>
                </motion.div>
              )}

              {/* STATE 1: Bad Ad */}
              {gameState === 1 && (
                <SocialMediaScreen key="bad-ad" mode="bad" onAction={() => setGameState(2)} />
              )}

              {/* STATE 2: Bad Chat */}
              {gameState === 2 && (
                <ChatSequence key="bad-chat" script={badScript} onComplete={() => setGameState(3)} />
              )}

              {/* STATE 3: Interstitial / The Friction Trap */}
              {gameState === 3 && (
                <motion.div 
                  key="interstitial"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-rose-50 flex flex-col items-center justify-center p-6 text-center"
                >
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-md text-rose-500">
                    <XCircle size={32} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-2 font-tanker">The Friction Trap</h2>
                  <p className="text-xs text-slate-600 mb-8 leading-relaxed font-medium font-sans">
                    Directing traffic to WhatsApp forces the client to ask basic questions. Slow replies kill 80% of sales.
                  </p>
                  
                  <div className="w-full h-px bg-slate-200 my-4"></div>

                  <p className="text-[10px] font-bold text-blue-600 mb-4 uppercase tracking-widest font-sans">Insert FunnelLink</p>
                  
                  <div className="relative w-full">
                    <button 
                      onClick={() => setGameState(4)}
                      className="w-full bg-blue-600 text-white py-3.5 rounded-full font-black text-sm flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-md"
                    >
                      <Zap size={16} fill="currentColor" /> Fix The Journey
                    </button>
                    <ClickGuide text="Click to Fix Journey" className="-top-12 left-1/2 -translate-x-1/2" />
                  </div>
                </motion.div>
              )}

              {/* STATE 4: Good Ad */}
              {gameState === 4 && (
                <SocialMediaScreen key="good-ad" mode="good" onAction={() => setGameState(5)} />
              )}

              {/* STATE 5: FunnelLink Storefront */}
              {gameState === 5 && (
                <FunnelLinkStorefront key="good-store" onAction={() => setGameState(6)} />
              )}

              {/* STATE 6: FunnelLink Catalog Details Walkthrough */}
              {gameState === 6 && (
                <FunnelLinkCatalog 
                  key="good-catalog" 
                  catalogHighlight={catalogHighlight} 
                  setCatalogHighlight={setCatalogHighlight} 
                  onAction={() => setGameState(7)} 
                />
              )}

              {/* STATE 7: Good Chat */}
              {gameState === 7 && (
                <ChatSequence key="good-chat" script={goodScript} onComplete={() => setGameState(8)} />
              )}

              {/* STATE 8: Success Screen */}
              {gameState === 8 && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-emerald-50 flex flex-col items-center justify-center p-6 text-center"
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-30 rounded-full"></div>
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg relative z-10">
                      <CheckCircle2 size={40} className="text-emerald-500" strokeWidth={2.5} />
                    </div>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2 font-tanker">Intent over questions.</h2>
                  <p className="text-xs text-slate-600 mb-8 leading-relaxed font-medium font-sans">
                    The customer arrived ready to buy. The conversation started with intent, not repetitive questions.
                  </p>
                  
                  <div className="flex flex-col gap-2.5 w-full font-sans">
                    <div className="relative w-full">
                      <button 
                        onClick={onNext}
                        className="w-full bg-emerald-600 text-white py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow"
                      >
                        Continue Journey <ArrowRight size={14} />
                      </button>
                      <ClickGuide text="Click to Continue" className="-top-12 left-1/2 -translate-x-1/2 bg-emerald-600" color="bg-emerald-600" />
                    </div>
                    <button 
                      onClick={() => setGameState(0)}
                      className="w-full bg-white border border-slate-200 text-slate-600 py-2.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                    >
                      <RefreshCw size={12} /> Play Again
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
          
          {/* Home Bar */}
          <div className="absolute bottom-1.5 inset-x-0 h-1 flex justify-center z-50 pointer-events-none">
            <div className="w-[100px] h-1 bg-slate-900/20 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Right sidebar: Dual Perspective selector */}
      <DualMindSidebar gameState={gameState} catalogHighlight={catalogHighlight} />
    </div>
  );
};

export default function WhatIsFunnelLink() {
  const [step, setStep] = useState<Step>('quiz');
  const [feedbackLine1, setFeedbackLine1] = useState('Part of the problem.');
  const [feedbackLine2, setFeedbackLine2] = useState('But the real issue runs deeper.');

  useEffect(() => {
    const ms: Partial<Record<Step,number>> = {
      feedback:1200, reveal:4000, proof:5000,
    };
    const d = ms[step];
    if (!d) return;
    const t = setTimeout(() => { const i = STEPS.indexOf(step); if (i < STEPS.length-1) setStep(STEPS[i+1]); }, d);
    return () => clearTimeout(t);
  }, [step]);

  const pick = useCallback((id: string) => {
    if (step !== 'quiz') return;
    if (id === 'd') {
      setFeedbackLine1('Exactly.');
      setFeedbackLine2("But why does this happen?");
    } else {
      setFeedbackLine1('Part of the problem.');
      setFeedbackLine2("But the real issue runs deeper.");
    }
    setStep('feedback');
  }, [step]);

  const restart = useCallback(() => setStep('quiz'), []);
  const skip = useCallback(() => {
    const i = STEPS.indexOf(step);
    if (i < STEPS.length-1) setStep(STEPS[i+1]); else restart();
  }, [step, restart]);

  const ci = STEPS.indexOf(step);

  return (
    <div className="min-h-screen w-full bg-white relative flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto px-6 py-20 select-none what-is-funnellink-section">

      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:'radial-gradient(ellipse 60% 45% at 50% 40%, rgba(45,99,236,0.04), transparent)'
      }}/>

      {/* Progress */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {STEPS.map((s,i) => <div key={s} className={`h-1 rounded-full transition-all duration-500 ${i<=ci?'w-5 bg-slate-800':'w-1.5 bg-slate-200'}`}/>)}
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center justify-center min-h-[500px]">
        <AnimatePresence mode="wait">

          {/* ═══ QUIZ ═══ */}
          {step==='quiz' && (
            <motion.div key="quiz" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-30,filter:'blur(4px)'}} transition={{duration:0.7,ease:E}} className="w-full flex flex-col items-center">
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-tanker tracking-[-0.02em] text-slate-900 leading-tight text-center mb-4 font-extrabold max-w-4xl">
                Why do customers leave after clicking your ad?
              </h2>
              <p className="text-sm font-sans font-bold uppercase tracking-[0.3em] text-slate-400 mb-16">Choose the main reason</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
                {OPTIONS.map((o,i) => {
                  const Icon = o.icon;
                  return (
                    <motion.button key={o.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15+i*0.08,duration:0.5,ease:E}}
                      whileHover={{y:-3,boxShadow:'0 8px 30px rgba(0,0,0,0.08)'}} whileTap={{scale:0.97}}
                      onClick={() => pick(o.id)}
                      className="group relative p-6 rounded-2xl border border-slate-200/80 bg-white text-left transition-colors hover:border-slate-300 cursor-pointer">
                      <span className="absolute top-4 right-4 text-[10px] font-bold text-slate-300 tracking-wider font-sans">{o.label}</span>
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-100 transition-colors">
                          <Icon size={20} className="text-slate-400 group-hover:text-slate-600 transition-colors"/>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-lg font-bold text-slate-900 leading-tight font-sans">{o.title}</span>
                          <span className="text-sm text-slate-500 font-medium leading-snug font-sans">{o.desc}</span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ═══ FEEDBACK ═══ */}
          {step==='feedback' && (
            <motion.div key="fb" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:1.05,filter:'blur(6px)'}} transition={{duration:0.5}} className="text-center space-y-4">
              <motion.p animate={{x:[-10,10,-10,10,0]}} transition={{duration:0.5}}
                className="text-4xl sm:text-5xl md:text-6xl font-tanker tracking-tight text-slate-950 font-bold">
                {feedbackLine1}
              </motion.p>
              {feedbackLine2 && (
                <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8,duration:0.5}}
                  className="text-3xl sm:text-4xl md:text-5xl font-tanker tracking-tight text-slate-400 font-bold">
                  {feedbackLine2}
                </motion.p>
              )}
            </motion.div>
          )}

          {/* ═══ REVEAL & THE GAP ═══ */}
          {step==='reveal' && (
            <motion.div key="rev" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,filter:'blur(8px)'}} className="text-center flex flex-col items-center gap-8 max-w-4xl px-4">
              <motion.span initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.5}}
                className="text-xl sm:text-2xl font-sans text-slate-400 font-bold uppercase tracking-wider">
                The Real Problem
              </motion.span>
              <motion.h2 initial={{opacity:0,y:30,filter:'blur(8px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}} transition={{delay:0.3,duration:0.8,ease:E}}
                className="text-4xl sm:text-6xl md:text-7xl font-tanker tracking-[-0.03em] leading-[1.05] font-extrabold text-slate-900">
                Is <span className="bg-gradient-to-r from-[#2D63EC] to-[#9A58F0] bg-clip-text text-transparent">Uncertainty</span>.
              </motion.h2>
              <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.2,duration:0.8,ease:E}}
                className="text-lg sm:text-2xl font-sans text-slate-500 font-medium leading-relaxed max-w-2xl">
                Most customers leave between the click and the conversation.<br/>
                <span className="font-bold text-[#2D63EC]">FunnelLink closes that gap.</span>
              </motion.p>
              <motion.div initial={{opacity:0,scale:0.5}} animate={{opacity:1,scale:1}} transition={{delay:1.5,duration:1.2}}
                className="w-[350px] h-[350px] rounded-full absolute -z-10" style={{background:'radial-gradient(circle, rgba(45,99,236,0.06), transparent 70%)'}}/>
            </motion.div>
          )}

          {/* ═══ COMBINED SIMULATION PATH ═══ */}
          {step==='simulation' && (
            <motion.div key="simulation" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,filter:'blur(6px)'}} className="w-full flex flex-col items-center">
              <CombinedSimulation onNext={skip} />
            </motion.div>
          )}

          {/* ═══ PROOF / CONVERSION COMPARISON ═══ */}
          {step==='proof' && (
            <motion.div key="proof" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,filter:'blur(6px)'}} className="w-full flex flex-col items-center gap-10">
              <div className="text-center">
                <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-slate-300 mb-2">The Revenue Difference</motion.p>
                <h3 className="text-3xl sm:text-4xl font-tanker text-slate-900 font-bold tracking-tight">How the revenue math changes</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-2xl">
                {/* Without */}
                <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2,duration:0.6,ease:E}}
                   className="p-8 rounded-2xl border border-slate-200 bg-white text-center flex flex-col items-center gap-6">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-red-400">Without FunnelLink</span>
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-col items-center"><span className="text-4xl font-tanker text-slate-900 font-bold">100</span><span className="text-xs font-sans font-medium text-slate-400 uppercase tracking-wider">ad clicks</span></div>
                    <div className="w-px h-4 bg-slate-200"/>
                    <div className="flex flex-col items-center"><span className="text-4xl font-tanker text-slate-900 font-bold">30</span><span className="text-xs font-sans font-medium text-slate-400 uppercase tracking-wider">chats (heavy manual burden)</span></div>
                    <div className="w-px h-4 bg-slate-200"/>
                    <div className="flex flex-col items-center"><span className="text-5xl font-tanker text-red-500 font-bold">4</span><span className="text-xs font-sans font-medium text-red-400 uppercase tracking-wider">sales (low conversion)</span></div>
                  </div>
                </motion.div>
                {/* With */}
                <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.8,duration:0.6,ease:E}}
                   className="p-8 rounded-2xl border border-[#2D63EC]/20 bg-[#2D63EC]/[0.02] text-center flex flex-col items-center gap-6">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-[#2D63EC]">With FunnelLink</span>
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-col items-center"><span className="text-4xl font-tanker text-slate-900 font-bold">100</span><span className="text-xs font-sans font-medium text-slate-400 uppercase tracking-wider">ad clicks</span></div>
                    <div className="w-px h-4 bg-[#2D63EC]/20"/>
                    <div className="flex flex-col items-center"><span className="text-4xl font-tanker text-[#2D63EC] font-bold">12</span><span className="text-xs font-sans font-medium text-[#2D63EC] uppercase tracking-wider">qualified chats (pre-sold)</span></div>
                    <div className="w-px h-4 bg-[#2D63EC]/20"/>
                    <div className="flex flex-col items-center">
                      <motion.span initial={{scale:0.8}} animate={{scale:[0.8,1.1,1]}} transition={{delay:1.4,duration:0.6}} className="text-5xl font-tanker text-emerald-600 font-bold">8</motion.span>
                      <span className="text-xs font-sans font-medium text-emerald-500 uppercase tracking-wider">sales (conceptual projection)</span>
                    </div>
                  </div>
                </motion.div>
              </div>
              <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.8,duration:0.6}}
                className="text-sm font-sans text-slate-500 font-semibold text-center max-w-md">
                Questions become answers &rarr; Answers become confidence &rarr; Confidence becomes revenue.
              </motion.p>
            </motion.div>
          )}

          {/* ═══ FINAL ═══ */}
          {step==='final' && (
            <motion.div key="final" initial={{opacity:0,y:40,filter:'blur(8px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}} transition={{duration:0.9,ease:E}}
              className="text-center flex flex-col items-center gap-8">
              <div className="flex flex-col items-center gap-4">
                <span className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-[#2D63EC]">FunnelLink</span>
                <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-tanker tracking-[-0.03em] text-slate-955 leading-[0.95] max-w-4xl font-extrabold">
                  The missing step<br/>between{' '}
                  <span className="bg-gradient-to-r from-[#2D63EC] to-[#7c3aed] bg-clip-text text-transparent">traffic</span>
                  {' '}and{' '}
                  <span className="bg-gradient-to-r from-[#7c3aed] to-[#2D63EC] bg-clip-text text-transparent">customers</span>.
                </h2>
              </div>

              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6,duration:0.6}}
                className="max-w-lg flex flex-col items-center gap-4">
                <p className="text-lg sm:text-xl font-sans text-slate-500 font-medium leading-relaxed">
                  Most businesses focus on getting clicks.
                </p>
                <p className="text-xl sm:text-2xl font-sans text-slate-900 font-bold leading-relaxed">
                  FunnelLink focuses on what happens next.
                </p>
              </motion.div>

              <motion.button initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2}} onClick={restart}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-sans font-bold tracking-tight transition-all active:scale-95 shadow-sm hover:shadow">
                <RefreshCw size={14}/> Replay
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Skip button */}
      {step!=='final' && (
        <button onClick={skip} className="absolute bottom-6 right-6 z-20 flex items-center gap-1 text-[11px] font-sans font-semibold text-slate-300 hover:text-slate-600 transition-colors uppercase tracking-widest py-2 px-3 rounded-lg hover:bg-slate-50 active:scale-95">
          Skip <ChevronRight size={12}/>
        </button>
      )}
    </div>
  );
}
