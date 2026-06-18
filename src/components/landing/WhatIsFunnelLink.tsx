'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Heart, Send, Bookmark, MoreHorizontal, 
  MessageCircle, ShoppingBag, ShieldCheck, Zap, RefreshCw, 
  ChevronRight, CheckCircle2, XCircle, MapPin, ArrowRight, 
  Star, ThumbsUp, Share2, HelpCircle, ChevronLeft, Truck, Menu, Eye, Users,
  Globe, Link2, HelpCircle as QuestionIcon, Camera, Briefcase, DollarSign, Clock, Rocket
} from 'lucide-react';

type Step = 'start' | 'simulation' | 'revenue' | 'positioning' | 'questions' | 'result' | 'final';
const STEPS: Step[] = ['start','simulation','revenue','positioning','questions','result','final'];
const E: [number,number,number,number] = [0.16, 1, 0.3, 1];

const OPTIONS = [
  { id:'a', label:'A', title:'Price Uncertainty', desc:'They want to know the cost.', icon: DollarSign },
  { id:'b', label:'B', title:'Slow Replies', desc:'They leave before you respond.', icon: Clock },
  { id:'c', label:'C', title:'Lack of Trust', desc:'They don\'t know if you are legit.', icon: ShieldCheck },
  { id:'d', label:'D', title:'All of the Above', desc:'All friction blocks the sale.', icon: HelpCircle },
];

const INJECTED_STYLES = `
  @font-face {
    font-family: 'Satoshi';
    src: url('/fonts/Satoshi-Variable.woff2') format('woff2'),
         url('/fonts/Satoshi-Variable.ttf') format('truetype');
    font-weight: 300 900;
    font-display: swap;
    font-style: normal;
  }
  .what-is-funnellink-section, .what-is-funnellink-section * {
    font-family: 'Satoshi', system-ui, sans-serif !important;
  }
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
  @keyframes dash-flow {
    to {
      stroke-dashoffset: -20;
    }
  }
  @keyframes dash-flow-vertical {
    to {
      stroke-dashoffset: 20;
    }
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

const AnimatedConnector = ({ 
  label, 
  colorClass, 
  active, 
  flowColor = "text-[#2D63EC]" 
}: { 
  label: string; 
  colorClass: string; 
  active: boolean; 
  flowColor?: string;
}) => (
  <div className="flex flex-1 flex-col items-center justify-center px-1 relative min-w-[40px] sm:min-w-[45px] lg:min-w-[55px] xl:min-w-[70px] shrink-0">
    <span className={`absolute -top-4 text-[9px] font-black uppercase tracking-wider ${colorClass} whitespace-nowrap bg-white/90 px-1.5 py-0.5 rounded shadow-[0_1px_3px_rgba(0,0,0,0.02)] z-10 transition-colors duration-300`}>
      {label}
    </span>
    <svg className="w-full h-2 overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line 
        x1="0" 
        y1="4" 
        x2="100%" 
        y2="4" 
        stroke="#E2E8F0" 
        strokeWidth="2.5" 
        strokeDasharray="5 5"
        strokeLinecap="round"
      />
      {active && (
        <line 
          x1="0" 
          y1="4" 
          x2="100%" 
          y2="4" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          className={`${flowColor} transition-colors duration-300`}
          strokeDasharray="5 5"
          strokeLinecap="round"
          style={{
            animation: 'dash-flow 1.0s linear infinite',
          }}
        />
      )}
    </svg>
  </div>
);

const AnimatedConnectorVertical = ({ 
  label, 
  colorClass, 
  active, 
  flowColor = "text-[#2D63EC]" 
}: { 
  label: string; 
  colorClass: string; 
  active: boolean; 
  flowColor?: string;
}) => (
  <div className="flex lg:hidden h-10 w-6 flex-col items-center justify-center relative my-1">
    <span className={`absolute left-5 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-wider ${colorClass} whitespace-nowrap bg-white/90 px-1.5 py-0.5 rounded shadow-[0_1px_3px_rgba(0,0,0,0.02)] z-10 transition-colors duration-300`}>
      {label}
    </span>
    <svg className="w-2 h-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line 
        x1="4" 
        y1="0" 
        x2="4" 
        y2="100%" 
        stroke="#E2E8F0" 
        strokeWidth="2.5" 
        strokeDasharray="5 5"
        strokeLinecap="round"
      />
      {active && (
        <line 
          x1="4" 
          y1="0" 
          x2="4" 
          y2="100%" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          className={`${flowColor} transition-colors duration-300`}
          strokeDasharray="5 5"
          strokeLinecap="round"
          style={{
            animation: 'dash-flow-vertical 1.0s linear infinite',
          }}
        />
      )}
    </svg>
  </div>
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
                    {mode === 'bad' ? 'Chat on WhatsApp' : 'Start Customer Journey'} <ArrowRight size={14} />
                    <span className="absolute right-4 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                    </span>
                  </button>
                  <ClickGuide text={mode === 'bad' ? "Click to Chat" : "Click to Start Journey"} className="-top-12 left-1/2 -translate-x-1/2" />
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
          <span className="font-sans text-[13px] font-medium tracking-tight">Urban Living.</span>
        </div>
        <Menu size={16} className="text-[#1C1B1A] opacity-60" />
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
        {/* Storefront Hero section */}
        <div className="p-5 text-center bg-white rounded-b-[1.5rem] shadow-sm mb-4">
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#D47A5A] mb-1.5 block">Factory Direct</span>
          <h1 className="font-sans text-[1.4rem] tracking-tight leading-[1.15] mb-1.5 text-slate-900">Luxury sofas,<br/>delivered fast.</h1>
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
                  <h4 className="font-sans text-[14px] leading-tight mb-0.5 text-[#1C1B1A] font-bold">Milano 3-Seater</h4>
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
               <h4 className="font-sans text-[11px] leading-tight mb-0.5 text-slate-900 font-bold">Rustic Bed Frame</h4>
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

        <h2 className="font-sans text-2xl tracking-tight text-[#1C1B1A] leading-tight mb-1">Milano Sofa</h2>
        
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
            <h3 className="text-xs font-black tracking-widest uppercase text-blue-400">Trust Page</h3>
            <p className="text-[9px] text-slate-400 font-medium leading-none mt-0.5">Objection-Handling Decision Page</p>
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
    subtitle = "Entering Customer Journey... ⚡";
    themeColor = "border-blue-200 bg-blue-50/20";
  } else if (gameState === 6) {
    title = "Customer Mind";
    subtitle = "Resolving objections on Trust Page... 🛡️";
    themeColor = "border-indigo-200 bg-indigo-50/20";
  } else if (gameState >= 7) {
    title = "Customer Mind";
    subtitle = "Decision Made & Ready! ✅";
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
    <div className="hidden lg:flex w-full max-w-sm lg:w-[320px] xl:w-[350px] shrink-0 z-30 flex flex-col gap-4">
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

const CombinedSimulation = ({ 
  gameState, 
  setGameState, 
  onNext 
}: { 
  gameState: number; 
  setGameState: React.Dispatch<React.SetStateAction<number>>; 
  onNext: () => void 
}) => {
  const [catalogHighlight, setCatalogHighlight] = useState(-1);

  // Scripts for Chat Simulator
  const badScript = [
    { text: "Hi, I saw your sofa ad.", time: "10:01 AM", sender: "user" as const, delay: 1000 },
    { text: "But I couldn't find the price or sizing anywhere.", time: "10:02 AM", sender: "user" as const, delay: 1200 },
    { text: "Hi! Sizing is 2.2m. Price starts at $400 depending on fabric.", time: "10:03 AM", sender: "bot" as const, delay: 2000 },
    { text: "Are there any real customer reviews or photos?", time: "10:04 AM", sender: "user" as const, delay: 1250 },
    { text: "Is delivery included? Or do I pay extra?", time: "10:05 AM", sender: "user" as const, delay: 1400 },
    { text: "Let me check with shipping team. They reply slowly.", time: "10:06 AM", sender: "bot" as const, delay: 1800 },
    { text: "Actually, it's too risky. I'll pass.", time: "10:08 AM", sender: "user" as const, delay: 1500 },
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
      <div className="hidden lg:flex flex-col max-w-sm relative z-10 text-left shrink-0">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest mb-4 w-max">
          Interactive Simulator
        </div>
        <h3 className="text-3xl font-black font-sans tracking-tight mb-3 text-slate-900 leading-[1.1] uppercase">
          The Most Expensive <span className="brand-gradient-text">Problem In Business</span>
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6 font-sans font-medium">
          Customers are interested. But they aren't convinced. Watch what happens when traffic reaches WhatsApp before trust is built.
        </p>

        {/* Progress Tracker */}
        <div className="space-y-6 ml-3 pl-6 relative font-sans">

          <div className={`relative transition-colors duration-300 ${gameState >= 1 && gameState <= 3 ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
            <div className={`absolute -left-[31px] top-[2px] w-3.5 h-3.5 rounded-full border-2 bg-white flex items-center justify-center transition-colors duration-300 ${gameState >= 1 && gameState <= 3 ? 'border-blue-500' : 'border-slate-300'}`}>
              <div className={`w-1.5 h-1.5 rounded-full transition-colors ${gameState >= 1 && gameState <= 3 ? 'bg-blue-500 animate-pulse' : 'bg-transparent'}`} />
            </div>
            <h4 className="text-xs">1. The Broken Reality</h4>
            <p className="text-[10px] mt-0.5 opacity-70 font-medium font-sans">Directing social traffic straight to WhatsApp.</p>
          </div>
          <div className={`relative transition-colors duration-300 ${gameState >= 4 && gameState <= 6 ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
            <div className={`absolute -left-[31px] top-[2px] w-3.5 h-3.5 rounded-full border-2 bg-white flex items-center justify-center transition-colors duration-300 ${gameState >= 4 && gameState <= 6 ? 'border-blue-500' : 'border-slate-300'}`}>
              <div className={`w-1.5 h-1.5 rounded-full transition-colors ${gameState >= 4 && gameState <= 6 ? 'bg-blue-500 animate-pulse' : 'bg-transparent'}`} />
            </div>
            <h4 className="text-xs">2. The Conversion Layer</h4>
            <p className="text-[10px] mt-0.5 opacity-70 font-medium font-sans">Adding an objection-handling page before the chat.</p>
          </div>
          <div className={`relative transition-colors duration-300 ${gameState >= 7 ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
            <div className={`absolute -left-[31px] top-[2px] w-3.5 h-3.5 rounded-full border-2 bg-white flex items-center justify-center transition-colors duration-300 ${gameState >= 7 ? 'border-emerald-500' : 'border-slate-300'}`}>
              <div className={`w-1.5 h-1.5 rounded-full transition-colors ${gameState >= 7 ? 'bg-emerald-500' : 'bg-transparent'}`} />
            </div>
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
                  <h2 className="text-2xl font-black text-white mb-2 font-black font-sans">Start Journey</h2>
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
                  <h2 className="text-2xl font-black text-slate-900 mb-2 font-black font-sans">The Friction Trap</h2>
                  <p className="text-xs text-slate-600 mb-8 leading-relaxed font-medium font-sans">
                    Directing traffic straight to chat leaves customers confused by unanswered questions, killing interest before they start.
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
                  <h2 className="text-3xl font-black text-slate-900 mb-2 font-black font-sans">Intent over questions.</h2>
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
  const [step, setStep] = useState<Step>('start');
  const [gameState, setGameState] = useState(0);

  const restart = useCallback(() => {
    setStep('start');
    setGameState(0);
  }, []);

  const skip = useCallback(() => {
    if (step === 'start') {
      setStep('simulation');
    } else {
      setGameState(8);
    }
  }, [step]);

  return (
    <div className="min-h-screen w-full bg-white relative flex flex-col items-center justify-start md:justify-center overflow-x-hidden overflow-y-auto px-6 py-10 select-none what-is-funnellink-section">

      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:'radial-gradient(ellipse 60% 45% at 50% 40%, rgba(45,99,236,0.04), transparent)'
      }}/>

      {/* Progress */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 font-sans">
        {step === 'start' ? (
          <div className="h-1 w-5 rounded-full bg-slate-800" />
        ) : (
          [1, 2, 3].map((s) => {
            let active = false;
            if (s === 1 && gameState <= 3) active = true;
            if (s === 2 && gameState >= 4 && gameState <= 6) active = true;
            if (s === 3 && gameState >= 7) active = true;
            return (
              <div key={s} className={`h-1 rounded-full transition-all duration-500 ${active ? 'w-5 bg-slate-800' : 'w-1.5 bg-slate-200'}`} />
            );
          })
        )}
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center justify-center min-h-[500px] my-auto">
        <AnimatePresence mode="wait">

          {/* ═══ START ═══ */}
          {/* ═══ START ═══ */}
          {step==='start' && (
            <motion.div key="start-screen" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-30,filter:'blur(4px)'}} transition={{duration:0.7,ease:E}} className="text-center flex flex-col items-center gap-4 max-w-5xl px-4">
              <motion.span initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.5}}
                className="text-[10px] sm:text-xs font-sans font-black uppercase tracking-[0.2em] text-[#2D63EC] mb-2">
                THE CONVERSION LAYER BETWEEN TRAFFIC AND WHATSAPP
              </motion.span>
              
              <motion.h2 initial={{opacity:0,y:30,filter:'blur(8px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}} transition={{delay:0.2,duration:0.8,ease:E}}
                className="text-4xl sm:text-5xl md:text-6xl font-black font-sans tracking-[-0.03em] leading-[1.05] font-extrabold text-slate-900 uppercase">
                Every Click Starts With <span className="bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">Questions</span>.<br/>
                Every Sale Starts With <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Answers</span>.
              </motion.h2>

              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4,duration:0.8,ease:E}}
                className="text-sm sm:text-base font-sans text-slate-500 font-semibold leading-relaxed max-w-2xl flex flex-col gap-2">
                <p>Customers don't buy the moment they discover you.</p>
                <p>They buy when they understand you.</p>
                <p className="text-[#2D63EC] font-bold">FunnelLink answers the questions that stop sales before they reach WhatsApp.</p>
              </motion.div>
              
              <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:0.6,duration:0.5}}
                className="relative mt-2">
                <button
                  onClick={() => setStep('simulation')}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-black text-sm tracking-wider uppercase transition-all shadow-[0_8px_30px_rgba(45,99,236,0.3)] flex items-center gap-2 hover:scale-[1.03]"
                >
                  Watch The Journey <ArrowRight size={16} />
                </button>
              </motion.div>

              {/* Visual Flow Diagram */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.8, duration: 0.8 }}
                className="w-full max-w-5xl mt-6 p-5 rounded-3xl border border-slate-100 bg-slate-50/50 relative overflow-hidden"
              >
                <div className="flex flex-row items-center justify-start lg:justify-between gap-4 lg:gap-2.5 lg:gap-4 relative z-10 font-sans overflow-x-auto no-scrollbar w-full py-1">
                  {/* Node 1: Traffic Sources */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="px-2.5 lg:px-4 py-2 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col gap-1.5 items-center transition-all duration-300 hover:shadow-md">
                      <span className="text-[9px] font-black tracking-wider uppercase text-slate-400">Traffic Sources</span>
                      <div className="flex items-center gap-2.5 text-slate-700 text-xs font-bold">
                        <InstagramIcon size={12} className="text-pink-500" />
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-700">Ads</span>
                        <span className="text-slate-300">•</span>
                        <YoutubeIcon size={14} className="text-red-500" />
                      </div>
                    </div>
                  </div>
 
                  {/* Connection 1 */}
                  <AnimatedConnector label="Questions" colorClass="text-red-500" active={true} flowColor="text-red-500" />
 
                  {/* Node 2: FunnelLink */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="px-3 lg:px-5 py-2 lg:py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_8px_25px_rgba(45,99,236,0.25)] ring-4 ring-blue-500/10 flex flex-col gap-1 items-center transition-transform hover:scale-[1.02]">
                      <span className="text-[9px] font-black tracking-widest uppercase opacity-90 flex items-center gap-1">
                        <ShieldCheck size={10} className="text-blue-200" /> The Conversion Layer
                      </span>
                      <span className="text-sm font-black tracking-tight flex items-center gap-1">
                        FunnelLink <Zap size={12} className="text-yellow-300 fill-yellow-300" />
                      </span>
                    </div>
                  </div>
 
                  {/* Connection 2 */}
                  <AnimatedConnector label="Trust" colorClass="text-[#2D63EC]" active={true} flowColor="text-[#2D63EC]" />
 
                  {/* Node 3: Chat */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="px-2.5 lg:px-4 py-2 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-emerald-700 shadow-sm flex flex-col gap-1.5 items-center transition-all hover:shadow-md">
                      <span className="text-[9px] font-black tracking-wider uppercase text-emerald-500 flex items-center gap-1">
                        <MessageCircle size={10} className="text-emerald-500 fill-emerald-500" /> Instant Chat
                      </span>
                      <span className="text-xs font-bold text-emerald-950">WhatsApp Business</span>
                    </div>
                  </div>
 
                  {/* Connection 3 */}
                  <AnimatedConnector label="Intent" colorClass="text-emerald-500" active={true} flowColor="text-emerald-500" />
 
                  {/* Node 4: Customer */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="px-2.5 lg:px-4 py-2 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col gap-1.5 items-center transition-all hover:shadow-md">
                      <span className="text-[9px] font-black tracking-wider uppercase text-slate-400 flex items-center gap-1">
                        <CheckCircle2 size={10} className="text-emerald-500" /> Final Outcome
                      </span>
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        Closed Customer
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>


            </motion.div>
          )}

          {/* ═══ COMBINED SIMULATION PATH ═══ */}
          {step==='simulation' && (
            <motion.div key="simulation" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,filter:'blur(6px)'}} className="w-full flex flex-col items-center">
              <CombinedSimulation gameState={gameState} setGameState={setGameState} onNext={() => setGameState(8)} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Scroll Down Cue */}
      {step === 'simulation' && gameState === 8 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 pointer-events-none"
        >
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#2D63EC] animate-pulse">
            Scroll down to see the revenue math
          </span>
          <motion.div 
            animate={{ y: [0, 4, 0] }} 
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm text-[#2D63EC]"
          >
            <ChevronRight size={10} className="rotate-90" />
          </motion.div>
        </motion.div>
      )}

      {/* Skip button */}
      {gameState !== 8 && (
        <button onClick={skip} className="absolute bottom-6 right-6 z-20 flex items-center gap-1 text-[11px] font-sans font-semibold text-slate-300 hover:text-slate-600 transition-colors uppercase tracking-widest py-2 px-3 rounded-lg hover:bg-slate-50 active:scale-95">
          Skip <ChevronRight size={12}/>
        </button>
      )}
    </div>
  );
}

export function RevenueSection() {
  return (
    <section className="w-full bg-white text-slate-900 py-32 px-6 flex flex-col items-center justify-center relative border-t border-slate-100 font-sans overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background:'radial-gradient(ellipse 60% 45% at 50% 40%, rgba(45,99,236,0.03), transparent)'
      }}/>
      <div className="w-full max-w-4xl relative z-10 flex flex-col items-center gap-16">
        <div className="text-center max-w-2xl">
          <p className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-[#2D63EC] mb-3">The Best Revenue Section</p>
          <h2 className="text-4xl sm:text-6xl font-black font-sans text-slate-900 font-extrabold tracking-tight mb-4 uppercase leading-none">Every Question Costs You Money.</h2>
          <p className="text-sm sm:text-base font-sans text-slate-500 font-semibold max-w-lg mx-auto leading-relaxed">
            Customers don't leave because they aren't interested. They leave because they don't have enough information to make a decision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          {/* Without */}
          <div className="p-8 rounded-2xl border border-slate-200 bg-white text-center flex flex-col items-center justify-between gap-6 shadow-sm">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-red-400">Without FunnelLink</span>
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="flex flex-col items-center"><span className="text-3xl font-black font-sans text-slate-900 font-bold">100</span><span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">Visitors</span></div>
              <div className="w-px h-3.5 bg-slate-200"/>
              <div className="flex flex-col items-center"><span className="text-3xl font-black font-sans text-slate-900 font-bold">35</span><span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">WhatsApp Chats</span></div>
              <div className="w-px h-3.5 bg-slate-200"/>
              <div className="flex flex-col items-center"><span className="text-3xl font-black font-sans text-slate-900 font-bold">22</span><span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">Price Questions</span></div>
              <div className="w-px h-3.5 bg-slate-200"/>
              <div className="flex flex-col items-center"><span className="text-3xl font-black font-sans text-slate-900 font-bold">14</span><span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">Ghosted Conversations</span></div>
              <div className="w-px h-3.5 bg-slate-200"/>
              <div className="flex flex-col items-center"><span className="text-4xl font-black font-sans text-red-500 font-bold">4</span><span className="text-[10px] font-sans font-bold text-red-400 uppercase tracking-wider">Customers</span></div>
            </div>
          </div>

          {/* With */}
          <div className="p-8 rounded-2xl border border-[#2D63EC]/20 bg-[#2D63EC]/[0.02] text-center flex flex-col items-center justify-between gap-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-[#2D63EC]">With FunnelLink</span>
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="flex flex-col items-center"><span className="text-3xl font-black font-sans text-slate-900 font-bold">100</span><span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">Visitors</span></div>
              <div className="w-px h-3.5 bg-[#2D63EC]/20"/>
              <div className="flex flex-col items-center"><span className="text-3xl font-black font-sans text-[#2D63EC] font-bold">12</span><span className="text-[10px] font-sans font-bold text-[#2D63EC] uppercase tracking-wider">Qualified Conversations</span></div>
              <div className="w-px h-3.5 bg-[#2D63EC]/20"/>
              
              {/* What they already saw checklist */}
              <div className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-xl p-3 w-full max-w-[200px] flex flex-col items-start gap-1 text-[11px] font-sans font-bold text-slate-800 shadow-sm font-sans">
                <p className="text-[8px] uppercase tracking-wider text-slate-400 mb-1">Customers Already Saw:</p>
                <span className="text-emerald-600">✓ Pricing</span>
                <span className="text-emerald-600">✓ Reviews</span>
                <span className="text-emerald-600">✓ Portfolio</span>
                <span className="text-emerald-600">✓ FAQs</span>
                <span className="text-emerald-600">✓ Location</span>
              </div>

              <div className="w-px h-3.5 bg-[#2D63EC]/20"/>
              <div className="flex flex-col items-center">
                <span className="text-5xl font-black font-sans text-emerald-600 font-bold">8</span>
                <span className="text-[10px] font-sans font-bold text-emerald-500 uppercase tracking-wider">Customers</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-12 text-center">
          <span className="text-xl sm:text-2xl font-black font-sans text-slate-900 font-bold uppercase tracking-tight">Fewer Chats.</span>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden sm:block"/>
          <span className="text-xl sm:text-2xl font-black font-sans text-slate-900 font-bold uppercase tracking-tight">Better Customers.</span>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden sm:block"/>
          <span className="text-xl sm:text-2xl font-black font-sans text-emerald-600 font-bold uppercase tracking-tight">More Sales.</span>
        </div>
      </div>
    </section>
  );
}

export function PositioningSection() {
  return (
    <section className="w-full bg-white text-slate-900 py-32 px-6 flex flex-col items-center justify-center relative border-t border-slate-100 font-sans overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background:'radial-gradient(ellipse 60% 45% at 50% 40%, rgba(45,99,236,0.02), transparent)'
      }}/>
      <div className="w-full max-w-4xl relative z-10 flex flex-col items-center gap-12 text-center">
        <div>
          <p className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-[#2D63EC] mb-3">The Strongest Positioning Section</p>
          <h2 className="text-4xl sm:text-6xl font-black font-sans text-slate-900 font-extrabold tracking-tight mb-4 uppercase leading-none">Stop Paying For Clicks That Go Nowhere.</h2>
          <p className="text-sm sm:text-base font-sans text-slate-500 font-semibold max-w-lg mx-auto leading-relaxed">
            Most businesses spend money getting attention. Very few optimize what happens after the click. <br/>FunnelLink turns traffic into informed buyers before the conversation starts.
          </p>
        </div>

        <div className="w-full max-w-2xl bg-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/5 relative overflow-hidden flex flex-col items-center text-center gap-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <p className="text-base sm:text-lg font-sans font-semibold text-slate-400 uppercase tracking-widest">Traffic is not the problem.</p>
            <h4 className="text-4xl sm:text-6xl font-black font-sans font-bold tracking-tight text-white uppercase">Conversion is.</h4>
          </div>

          <div className="w-12 h-px bg-white/10 relative z-10" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full relative z-10 font-sans">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#5DBEF5] mb-1">Instagram</p>
              <p className="text-xs font-bold text-slate-200">gets attention.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-1">WhatsApp</p>
              <p className="text-xs font-bold text-slate-200">starts conversations.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(45,99,236,0.15)] ring-1 ring-blue-500/30">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1">FunnelLink</p>
              <p className="text-xs font-black text-white">creates buyers.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function QuestionsSection() {
  return (
    <section className="w-full bg-white text-slate-900 py-32 px-6 flex flex-col items-center justify-center relative border-t border-slate-100 font-sans overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background:'radial-gradient(ellipse 60% 45% at 50% 40%, rgba(45,99,236,0.02), transparent)'
      }}/>
      <div className="w-full max-w-4xl relative z-10 flex flex-col items-center gap-16">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-[#2D63EC] mb-3">The "Will Make Me Money" Section</p>
          <h2 className="text-4xl sm:text-6xl font-black font-sans text-slate-900 font-extrabold tracking-tight mb-4 uppercase leading-none">Your Team Shouldn't Answer The Same Questions 100 Times.</h2>
          <p className="text-sm sm:text-base font-sans text-slate-500 font-semibold max-w-lg mx-auto leading-relaxed">
            Every unanswered question is a lost sale. Customers don't buy when they're confused—they buy when they're confident. FunnelLink builds that confidence before they reach WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          {/* Repeated Price? bubble stack */}
          <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-4 relative min-h-[220px] overflow-hidden">
            <div className="absolute top-3 left-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Repetitive Chat Fatigue</div>
            
            <motion.div animate={{y: [10, -10, 10]}} transition={{repeat: Infinity, duration: 3, ease: "easeInOut"}}
              className="flex flex-col gap-2 w-full max-w-[200px] font-sans">
              <div className="bg-white p-2.5 rounded-2xl rounded-bl-none shadow-sm border border-slate-200 text-xs font-bold text-slate-800 self-start">Price?</div>
              <div className="bg-white p-2.5 rounded-2xl rounded-br-none shadow-sm border border-slate-200 text-xs font-bold text-slate-800 self-end">Is it in stock?</div>
              <div className="bg-white p-2.5 rounded-2xl rounded-bl-none shadow-sm border border-slate-200 text-xs font-bold text-slate-800 self-start">Where are you located?</div>
            </motion.div>
            
            <div className="absolute bottom-4 inset-x-4 bg-gradient-to-t from-slate-50 to-transparent h-8 pointer-events-none"/>
          </div>

          {/* FunnelLink answers once benefits grid */}
          <div className="p-8 rounded-2xl border border-blue-100 bg-blue-50/10 flex flex-col gap-4 relative justify-center font-sans">
            <div className="absolute top-3 left-4 text-[9px] font-bold text-[#2D63EC] uppercase tracking-wider">FunnelLink answers them once</div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0"><Clock size={16} /></div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Less Support</h4>
                  <p className="text-[10px] text-slate-500">Eliminate 90% of basic informational queries.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0"><XCircle size={16} /></div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Less Ghosting</h4>
                  <p className="text-[10px] text-slate-500">No more drop-offs while waiting for a response.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0"><RefreshCw size={16} /></div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Less Repetition</h4>
                  <p className="text-[10px] text-slate-500">FunnelLink answers them once on the trust page.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0"><DollarSign size={16} /></div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-700">More Revenue</h4>
                  <p className="text-[10px] text-slate-500">Arriving leads are fully pre-sold and ready to pay.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ResultSection() {
  return (
    <section className="w-full bg-white text-slate-900 py-32 px-6 flex flex-col items-center justify-center relative border-t border-slate-100 font-sans overflow-hidden">
      <div className="w-full max-w-4xl relative z-10 flex flex-col items-center gap-12 text-center">
        <div>
          <p className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-[#2D63EC] mb-3">The Section That Makes People Pay</p>
          <h2 className="text-4xl sm:text-6xl font-black font-sans text-slate-900 font-extrabold tracking-tight mb-4 uppercase leading-none">The Result</h2>
          <p className="text-sm sm:text-base font-sans text-slate-500 font-semibold max-w-lg mx-auto leading-relaxed">
            Instead of answering basic questions all day, you spend your time closing sales.
          </p>
        </div>

        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl flex flex-col gap-6 text-left font-sans">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">Customers Arrive Already Knowing:</div>
          
          <div className="flex flex-col gap-3 font-bold text-slate-800 text-sm">
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <span>What you sell</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <span>How much it costs</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <span>Why they should trust you</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <span>What happens next</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <span>How to buy</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 mt-2">
          <span className="text-2xl sm:text-3xl font-black font-sans text-slate-900 font-bold uppercase">Less Explaining.</span>
          <div className="w-2 h-2 rounded-full bg-slate-300"/>
          <span className="text-2xl sm:text-3xl font-black font-sans text-emerald-600 font-bold uppercase">More Closing.</span>
        </div>
      </div>
    </section>
  );
}

export function FinalSection() {
  return (
    <section className="w-full bg-white text-slate-900 py-32 px-6 flex flex-col items-center justify-center relative border-t border-slate-100 font-sans overflow-hidden">
      <div className="w-full max-w-4xl relative z-10 flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-[#2D63EC]">The Highest-Converting Message</span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black font-sans tracking-[-0.03em] text-slate-900 leading-[1.05] max-w-3xl font-extrabold uppercase">
            FunnelLink Doesn't Generate More Traffic.
          </h2>
          <p className="text-2xl sm:text-4xl font-black font-sans text-emerald-600 font-bold leading-tight max-w-2xl uppercase">
            It helps you make more money from the traffic you already have.
          </p>
        </div>

        <div className="max-w-lg flex flex-col items-center gap-4 mt-2">
          <p className="text-sm sm:text-base font-sans text-slate-500 font-semibold leading-relaxed">
            Stop letting confused clicks walk away. Establish a conversion layer, resolve friction automatically, and filter for ready-to-buy conversations.
          </p>
        </div>
      </div>
    </section>
  );
}
