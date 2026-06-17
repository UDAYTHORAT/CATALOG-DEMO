'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Settings, Zap, Type, LayoutGrid, Package, MessageSquare, 
  Rocket, CheckCircle2, Info, ChevronRight, Edit2, Image as ImageIcon, Plus, Star, MapPin, ChevronDown, Check, Globe, Camera, Megaphone, MessageCircle, ShieldCheck, ArrowRight
} from 'lucide-react';

const targetStoreName = "Urban Living Furniture";
const targetWhatsapp = "98765 43210";
const targetHeadline = "Handcrafted Luxury Furniture.";
const targetSubheadline = "Transform your living space with our premium collection, delivered directly to your home.";

const steps = [
  { 
    id: 0, 
    title: "1. Business Trust", 
    desc: "Create the foundation customers need before they trust a business. Add your business name, brand, WhatsApp number, and identity." 
  },
  { 
    id: 1, 
    title: "2. First Impression", 
    desc: "Create the first thing customers see. A strong first impression can determine whether a visitor keeps exploring or leaves." 
  },
  { 
    id: 2, 
    title: "3. Customer Questions", 
    desc: "Help customers find the information they need before they contact you. Anticipate their needs to reduce friction." 
  },
  { 
    id: 3, 
    title: "4. Proof & Pricing", 
    desc: "Add your high-margin offers. The layout automatically emphasizes pricing, urgency, and clear pathways to purchase." 
  },
  { 
    id: 4, 
    title: "5. Trust Signals", 
    desc: "Build instant credibility. Add social proof that seamlessly integrates into the trust-bar sections of your funnel." 
  },
  { 
    id: 5, 
    title: "6. Ready To Contact", 
    desc: "Make it effortless for customers to take action. When customers have answers and trust your business, they're ready to contact you." 
  },
  {
    id: 6,
    title: "Ready to Scale",
    desc: "Hit publish and instantly get your unique FunnelLink. Drop this link in your Instagram bio, Facebook Ads, and WhatsApp blasts to start converting traffic."
  }
];

export default function EditorDemoSection() {
  const [activeStep, setActiveStep] = useState(0);
  
  // Typing states
  const [storeName, setStoreName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveStep(index);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    const stepEls = document.querySelectorAll('.demo-step');
    stepEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Typing effect for Business Trust (Step 0)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (activeStep === 0) {
      let i = storeName.length;
      const typeStore = () => {
        if (i <= targetStoreName.length) {
          setStoreName(targetStoreName.slice(0, i));
          i++;
          timeout = setTimeout(typeStore, 30);
        } else {
          let j = whatsapp.length;
          const typeWa = () => {
             if (j <= targetWhatsapp.length) {
                setWhatsapp(targetWhatsapp.slice(0, j));
                j++;
                timeout = setTimeout(typeWa, 30);
             }
          };
          timeout = setTimeout(typeWa, 200);
        }
      };
      typeStore();
    } else if (activeStep > 0) {
      setStoreName(targetStoreName);
      setWhatsapp(targetWhatsapp);
    } else {
      setStoreName("");
      setWhatsapp("");
    }
    return () => clearTimeout(timeout);
  }, [activeStep]);


  // Typing effect for First Impression (Step 1)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (activeStep === 1) {
      let i = headline.length;
      const typeHead = () => {
        if (i <= targetHeadline.length) {
          setHeadline(targetHeadline.slice(0, i));
          i++;
          timeout = setTimeout(typeHead, 25);
        } else {
          let j = subheadline.length;
          const typeSub = () => {
            if (j <= targetSubheadline.length) {
              setSubheadline(targetSubheadline.slice(0, j));
              j++;
              timeout = setTimeout(typeSub, 15);
            }
          };
          timeout = setTimeout(typeSub, 300);
        }
      };
      typeHead();
    } else if (activeStep > 1) {
      setHeadline(targetHeadline);
      setSubheadline(targetSubheadline);
    } else {
      setHeadline("");
      setSubheadline("");
    }
    return () => clearTimeout(timeout);
  }, [activeStep]);

  return (
    <section className="relative w-full bg-[#F8FAFC] font-sans border-t border-slate-200 satoshi-editor" id="editor-demo">
      <style>{`
        @font-face {
          font-family: 'Satoshi';
          src: url('/fonts/Satoshi-Variable.woff2') format('woff2'),
               url('/fonts/Satoshi-Variable.ttf') format('truetype');
          font-weight: 300 900;
          font-display: swap;
          font-style: normal;
        }
        .satoshi-editor, .satoshi-editor * {
          font-family: 'Satoshi', system-ui, sans-serif !important;
        }
      `}</style>
      {/* Section Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 text-center pt-32 pb-10 relative z-20">
         <p className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600 mb-4">THE FUNNELLINK EDITOR</p>
         <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
            3 Minutes To Set Up.<br/>More Revenue From Every Click.
         </h2>
         <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto mb-8">
           Build trust, answer customer questions, and prepare buyers before they reach WhatsApp.
         </p>
         <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest">
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-slate-300"/> No developers.</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-slate-300"/> No complicated setup.</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-slate-300"/> No website project.</span>
         </div>
         <p className="text-base font-black text-slate-900 uppercase tracking-widest">
            Just launch and start converting traffic.
         </p>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 w-full flex flex-col md:flex-row items-start relative">
         
         {/* Left Text Steps (Scrollable) */}
         <div className="w-full md:w-[400px] shrink-0 py-[10vh] md:py-[20vh] relative z-20">
            {steps.map((step, index) => (
               <div 
                 key={step.id} 
                 data-index={index}
                 onClick={(e) => {
                   setActiveStep(index);
                   e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
                 }}
                 className="demo-step min-h-[70vh] md:min-h-[80vh] flex flex-col justify-center pb-[5vh] md:pb-[10vh] cursor-pointer"
               >
                  <div className={`transition-all duration-700 ease-out ${activeStep === index ? 'opacity-100 translate-x-0' : 'opacity-40 md:opacity-20 -translate-x-4 md:translate-x-0'}`}>
                     {index === 6 && (
                       <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 text-[11px] font-black uppercase tracking-widest rounded-full mb-8">
                         <CheckCircle2 size={16}/> Fully Configured
                       </span>
                     )}
                     <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                        {step.title}
                     </h2>
                     <p className="text-xl text-slate-600 font-medium leading-relaxed">
                        {step.desc}
                     </p>

                     {/* Mobile Inline Mockup (hidden on desktop) */}
                     <div className="block md:hidden mt-8 w-full h-[480px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative">
                        <EditorMockupContent 
                           activeStep={index} 
                           storeName={storeName || (index > 0 ? targetStoreName : "")} 
                           whatsapp={whatsapp || (index > 0 ? targetWhatsapp : "")} 
                           headline={headline || (index > 1 ? targetHeadline : "")}
                           subheadline={subheadline || (index > 1 ? targetSubheadline : "")}
                        />
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* Right Sticky Visuals */}
         <div className="hidden md:flex flex-1 sticky top-0 h-screen py-[10vh] pl-16 items-center justify-center overflow-hidden z-10">
            <AnimatePresence mode="wait">
               <motion.div 
                  key="editor"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-full max-w-[1000px] h-full max-h-[800px] bg-white rounded-2xl shadow-[0_40px_100px_rgba(15,23,42,0.1)] border border-slate-200 flex flex-col overflow-hidden ring-1 ring-slate-900/5 relative"
               >
                  <EditorMockupContent 
                     activeStep={activeStep} 
                     storeName={storeName} 
                     whatsapp={whatsapp} 
                     headline={headline}
                     subheadline={subheadline}
                  />
               </motion.div>
            </AnimatePresence>
         </div>
      </div>

      {/* The Result Final Emotional Message */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 text-center pt-32 pb-40">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600 mb-4">THE RESULT</p>
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-tight">Less Explaining.<br/>More Closing.</h2>
        <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto mb-10">
          Instead of answering the same questions all day, spend your time talking to customers who are already ready to buy.
        </p>
        <div className="flex justify-center">
          <a 
            href="/signup" 
            className="px-8 py-4.5 bg-gradient-to-r from-[#2A5BEA] via-[#4E3BDA] to-[#7A44E8] hover:opacity-95 text-white font-black text-sm uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
          >
            Create Your Funnel <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

// Reusable exact UI components from Wizard Mode
const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 placeholder:text-slate-400';

function Field({ label, children, description }: { label: string; children: React.ReactNode; description?: string }) {
  return (
    <label className="flex flex-col h-full w-full">
      <span className="mb-2.5 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 leading-snug">{label}</span>
      <div className="mt-auto w-full">
        {children}
      </div>
      {description && <p className="mt-2 text-[10px] font-medium text-slate-400">{description}</p>}
    </label>
  );
}

function PanelTitle({ icon: Icon, label, meta }: { icon: any; label: string; meta: string }) {
  return (
    <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
          <Icon size={20} />
        </div>
        <div>
          <h2 className="text-base font-black tracking-tight text-slate-900">{label}</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{meta}</p>
        </div>
      </div>
    </div>
  );
}

function LiveFunnelSimulation({ storeName }: { storeName: string }) {
  const [simStep, setSimStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSimStep((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      title: "1. Traffic Enters",
      desc: "Visitor clicks your link from social ads or Instagram bio.",
      icon: Megaphone,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      indicator: "Visitor from Instagram Ads landed"
    },
    {
      title: "2. Objections Cleared",
      desc: "Instant answers read: Pricing, free delivery, Sarah's review.",
      icon: ShieldCheck,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      indicator: "Trust established in 15 seconds"
    },
    {
      title: "3. Direct to WhatsApp",
      desc: "Frictionless transition with pre-filled message.",
      icon: MessageCircle,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      indicator: "Sends: 'I want to order the Sofa!'"
    },
    {
      title: "4. Sale Confirmed",
      desc: "Order confirmed immediately by merchant. Done!",
      icon: CheckCircle2,
      color: "text-emerald-700 bg-emerald-100 border-emerald-200",
      indicator: "Revenue: $899 Closed Deal! 💰"
    }
  ];

  return (
    <div className="w-full border border-slate-200 rounded-2xl p-4 bg-white relative overflow-hidden shadow-sm mt-2">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Live Funnel Simulator</span>
        <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"/> Realtime Loop
        </span>
      </div>

      {/* Visual Pipeline Nodes */}
      <div className="grid grid-cols-4 gap-2 mb-5 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = simStep === idx;
          const isCompleted = idx < simStep;

          return (
            <div key={idx} className="flex flex-col items-center text-center relative">
              {idx < 3 && (
                <div className="absolute top-5 left-[60%] right-[-40%] h-0.5 border-t border-dashed border-slate-200 z-0">
                  {isCompleted && (
                    <motion.div 
                      className="absolute inset-0 bg-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </div>
              )}
              
              <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                isActive ? 'border-indigo-500 bg-indigo-50 text-indigo-600 scale-110 shadow-md shadow-indigo-500/10' :
                isCompleted ? 'border-emerald-500 bg-emerald-50 text-emerald-600' :
                'border-slate-200 bg-white text-slate-400'
              }`}>
                <Icon size={16} />
              </div>
              
              <span className={`text-[8px] font-black mt-2 tracking-tight ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}>
                {step.title.split('. ')[1]}
              </span>
            </div>
          );
        })}
      </div>

      {/* active state detail block */}
      <AnimatePresence mode="wait">
        <motion.div
          key={simStep}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3 min-h-[64px]"
        >
          <div className={`p-2 rounded-lg border shrink-0 ${steps[simStep].color}`}>
            {React.createElement(steps[simStep].icon, { size: 16 })}
          </div>
          <div className="text-left min-w-0 flex-1">
            <h4 className="text-xs font-black text-slate-800">{steps[simStep].title}</h4>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-1">{steps[simStep].desc}</p>
            <span className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50/50 px-1.5 py-0.5 rounded border border-indigo-100/50">
              {steps[simStep].indicator}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function EditorMockupContent({ activeStep, storeName, whatsapp, headline, subheadline }: { activeStep: number, storeName: string, whatsapp: string, headline: string, subheadline: string }) {
  const WIZARD_FLOW = [
    { id: 'store', label: 'Business Trust', hint: 'Set your business name, WhatsApp number, and logo. This builds the foundation of trust.', icon: Settings },
    { id: 'content', label: 'First Impression', hint: 'Write a powerful hook to stop visitors from scrolling away.', icon: Type },
    { id: 'categories', label: 'Customer Questions', hint: 'Help customers find the information they need before they contact you.', icon: LayoutGrid },
    { id: 'products', label: 'Proof & Pricing', hint: 'Add your high-margin offers. Emphasize pricing and urgency.', icon: Package },
    { id: 'testimonials', label: 'Trust Signals', hint: 'Build credibility with real installation photos and reviews.', icon: Star },
    { id: 'location', label: 'Ready To Contact', hint: 'Add your physical coordinates to drive high-intent inquiries.', icon: MapPin }
  ];

  const isLaunch = activeStep === 6;
  const currentWizardStep = Math.min(activeStep, 5); // 0 through 5
  const activeTabInfo = WIZARD_FLOW[currentWizardStep];
  const activeTabId = activeTabInfo.id;

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(`funnellink.io/${storeName ? storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'urban-living'}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showVerifiedBadges = activeStep === 0 && storeName === targetStoreName && whatsapp === targetWhatsapp;

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4 bg-white z-20">
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">Conversion Engine</span>
          <div className="shrink-0 h-5 w-px bg-slate-200" />
          <div className="min-w-0 truncate">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 truncate">Editor</p>
            <p className="text-sm font-semibold text-slate-900 truncate">{storeName || 'Business Name'}</p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <button className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
            Switch to Advanced →
          </button>
          <button className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold shadow-lg transition-all active:scale-95 ${isLaunch ? 'bg-emerald-600 text-white animate-pulse scale-105 shadow-emerald-600/30' : 'bg-slate-900 text-white'}`}>
            {isLaunch ? <><Rocket size={14} className="text-white" /> Publish & Go Live</> : <>Next Step <ChevronRight size={14} /></>}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Nav Column */}
        <div className="w-[260px] shrink-0 border-r border-slate-100 bg-slate-50/50 p-4 flex flex-col z-10 overflow-y-auto">
           <div className="mb-5">
              <div className="flex gap-1 mb-2">
                 {WIZARD_FLOW.map((_, i) => (
                   <div key={i} className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${i <= currentWizardStep ? 'bg-slate-900' : 'bg-slate-200'}`} />
                 ))}
              </div>
              <p className="text-[10px] font-bold text-slate-400">Step {currentWizardStep + 1} of {WIZARD_FLOW.length}</p>
           </div>

           <div className="flex flex-col gap-2">
              {WIZARD_FLOW.map((tab, i) => {
                 const isActive = i === currentWizardStep && !isLaunch;
                 const isDone = i < currentWizardStep || isLaunch;
                 
                 return (
                   <div key={tab.id} className={`group flex items-center justify-between rounded-xl border px-3 py-3 transition-all ${
                       isActive ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10 scale-105'
                       : isDone ? 'border-emerald-200 bg-emerald-50/60 text-emerald-700'
                       : 'border-slate-200 bg-white text-slate-600'
                     }`}
                   >
                      <div className="flex items-center gap-2.5">
                         <div className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                           isActive ? 'bg-white/10' : isDone ? 'bg-emerald-100' : 'bg-slate-100'
                         }`}>
                            {isDone ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-black">{i + 1}</span>}
                         </div>
                         <span className="text-xs font-bold">{tab.label}</span>
                      </div>
                      <ChevronRight size={12} className={isActive ? 'text-white/40' : 'text-slate-300'} />
                   </div>
                 )
              })}
           </div>

           {/* Conversion Engine KPI Panel */}
           <div className="mt-auto pt-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Conversion Engine</p>
              <div className="grid grid-cols-2 gap-2">
                 <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-center transition-all hover:border-slate-300">
                    <p className="text-xl font-black text-slate-900">27</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-1">Questions Answered</p>
                 </div>
                 <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-center transition-all hover:border-slate-300">
                    <p className="text-xl font-black text-slate-900">14</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-1">Trust Signals</p>
                 </div>
                 <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-center transition-all hover:border-slate-300">
                    <p className="text-xl font-black text-slate-900">3<span className="text-sm font-bold text-slate-400 ml-0.5">m</span></p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-1">Setup Time</p>
                 </div>
                 <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-center transition-all hover:border-slate-300">
                    <p className="text-xl font-black text-slate-900">5</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-1">Channels Linked</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Editing Column */}
        <div className="flex-1 p-8 overflow-y-auto relative bg-slate-50/30 flex justify-center">
           <div className="w-full max-w-[500px]">
             
             <AnimatePresence mode="wait">
                {!isLaunch && (
                   <motion.div 
                      key="banner"
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }} 
                      className="relative flex flex-col gap-3 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 mb-6 pr-14"
                   >
                     <div className="absolute top-4 right-4 flex items-center justify-center h-8 w-8 rounded-full bg-white shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-indigo-200 text-indigo-500 animate-pulse ring-4 ring-indigo-500/20">
                        <Info size={16} />
                     </div>
                     <div className="flex items-start gap-3">
                       <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Step {currentWizardStep + 1} — {activeTabInfo.label}</p>
                         <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                           {activeTabInfo.hint}
                         </p>
                       </div>
                     </div>
                   </motion.div>
                )}
             </AnimatePresence>

             {/* Panels */}
             <AnimatePresence mode="wait">
                {activeTabId === 'store' && !isLaunch && (
                   <motion.div key="store" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-8">
                      <PanelTitle icon={Settings} label="Business Trust" meta="Foundation" />
                      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="absolute top-0 h-1.5 w-full bg-slate-900" />
                        <div className="p-6 flex flex-col items-center gap-6 text-center">
                          <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-slate-200 shadow-inner bg-slate-50 flex items-center justify-center">
                            <ImageIcon size={32} className="text-slate-300" />
                          </div>
                          <div className="w-full space-y-5 text-left">
                            <Field label="Business Name">
                              <input
                                readOnly
                                value={storeName}
                                className={`${inputClass} ${activeStep === 0 && storeName.length < targetStoreName.length ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-[0_0_0_4px_rgba(99,102,241,0.1)]' : ''}`}
                                placeholder="e.g. Urban Living Furniture"
                              />
                            </Field>
                            <Field label="Your Live Trust Link" description="Share this unique link directly with your customers on WhatsApp or Instagram.">
                              <div className={`flex items-center rounded-xl border-2 px-4 py-3 overflow-hidden transition-all duration-300 ${activeStep === 0 && storeName.length > 0 ? 'border-indigo-500 bg-indigo-50/20 shadow-[0_0_0_4px_rgba(99,102,241,0.1)]' : 'border-slate-200 bg-slate-50'}`}>
                                 <span className="text-slate-400 font-semibold text-sm whitespace-nowrap">funnellink.io/</span>
                                 <span className={`font-bold text-sm truncate ${storeName.length > 0 ? 'text-indigo-600' : 'text-slate-300'}`}>
                                   {storeName ? storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'your-business'}
                                 </span>
                              </div>
                            </Field>
                            <Field label="WhatsApp Lead Capture" description="Leads will be sent to this number. Includes country code.">
                              <div className="flex gap-2">
                                <div className="relative w-32 shrink-0">
                                  <select className={`${inputClass} appearance-none pr-8 text-xs font-bold`} disabled>
                                    <option value="91">🇮🇳 +91</option>
                                  </select>
                                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <ChevronDown size={12} />
                                  </div>
                                </div>
                                <div className="relative flex-1 w-full">
                                  <input
                                    readOnly
                                    value={whatsapp}
                                    className={`${inputClass} ${activeStep === 0 && storeName.length === targetStoreName.length && whatsapp.length < targetWhatsapp.length ? 'border-emerald-500 ring-4 ring-emerald-500/10 shadow-[0_0_0_4px_rgba(16,185,129,0.1)]' : ''}`}
                                    placeholder="98765 43210"
                                  />
                                </div>
                              </div>
                            </Field>
                          </div>

                          <AnimatePresence>
                             {showVerifiedBadges && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="w-full grid grid-cols-1 gap-2 pt-4 border-t border-slate-100">
                                   <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 py-2 px-3 rounded-lg"><ShieldCheck size={14} className="text-emerald-500"/> Verified Business</motion.div>
                                   <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 py-2 px-3 rounded-lg"><MessageCircle size={14} className="text-emerald-500"/> WhatsApp Connected</motion.div>
                                   <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 py-2 px-3 rounded-lg"><Globe size={14} className="text-emerald-500"/> Trust Link Generated</motion.div>
                                </motion.div>
                             )}
                          </AnimatePresence>
                        </div>
                      </div>
                   </motion.div>
                )}

                {activeTabId === 'content' && !isLaunch && (
                   <motion.div key="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-8 relative">
                      <PanelTitle icon={Type} label="First Impression" meta="Hero Hook" />
                      
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: "spring", stiffness: 200 }} className="absolute -right-4 -top-4 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] z-20">
                        Attention Score: 92%
                      </motion.div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Content Strategy</p>
                        <div className="space-y-5">
                          <Field label="Main Headline">
                            <div className="relative">
                              <textarea
                                readOnly
                                value={headline}
                                rows={2}
                                className={`${inputClass} resize-none leading-tight pb-8 ${activeStep === 1 && headline.length < targetHeadline.length ? 'border-blue-500 ring-4 ring-blue-500/10' : ''}`}
                                placeholder="e.g. Premium Furniture for Modern Living"
                              />
                              <div className="absolute bottom-2.5 right-3 text-[10px] font-bold text-slate-400">
                                {headline.length}/60
                              </div>
                            </div>
                          </Field>
                          
                          <Field label="Supporting Subline">
                            <div className="relative w-full">
                              <textarea
                                readOnly
                                value={subheadline}
                                rows={3}
                                className={`${inputClass} resize-none leading-relaxed pb-8 ${activeStep === 1 && headline === targetHeadline && subheadline.length < targetSubheadline.length ? 'border-blue-500 ring-4 ring-blue-500/10' : ''}`}
                                placeholder="Describe your value proposition..."
                              />
                              <div className="absolute bottom-2.5 right-3 text-[10px] font-bold text-slate-400">
                                {subheadline.length}/150
                              </div>
                            </div>
                          </Field>
                        </div>
                      </div>
                   </motion.div>
                )}

                {activeTabId === 'categories' && !isLaunch && (
                   <motion.div key="categories" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-8">
                      <PanelTitle icon={LayoutGrid} label="Customer Questions" meta="Friction Reduction" />
                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Questions Customers Ask</p>
                        
                        <div className="space-y-2">
                          {[
                            'How much does it cost?', 
                            'Can I trust this business?', 
                            'Do you offer delivery?', 
                            'Can I see previous work?',
                            'How long does setup take?',
                            'What happens after I contact you?'
                          ].map((q, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.3 }} className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                              <span className="text-sm font-bold text-slate-700">{q}</span>
                              <motion.span initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: (i * 0.3) + 0.2 }} className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1">
                                 <Check size={12}/> Answer Added
                              </motion.span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                   </motion.div>
                )}

                {activeTabId === 'products' && !isLaunch && (
                   <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-8">
                      <PanelTitle icon={Package} label="Proof & Pricing" meta="High-Margin Offers" />
                      <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm text-center relative overflow-hidden">
                        <div className="absolute top-0 w-full h-1.5 bg-emerald-500 left-0"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Pricing Transparency</p>
                        <p className="text-4xl font-black text-slate-900 mb-8">Starting From $899</p>
                        <div className="grid grid-cols-2 gap-3 text-left">
                          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 p-3 rounded-xl"><Check size={14} className="text-emerald-500"/> Delivery Included</div>
                          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 p-3 rounded-xl"><Check size={14} className="text-emerald-500"/> Installation Included</div>
                          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 p-3 rounded-xl"><Check size={14} className="text-emerald-500"/> 2 Year Warranty</div>
                          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 p-3 rounded-xl"><Check size={14} className="text-emerald-500"/> No Hidden Fees</div>
                        </div>
                      </div>
                   </motion.div>
                )}

                {activeTabId === 'testimonials' && !isLaunch && (
                   <motion.div key="testimonials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-8">
                      <PanelTitle icon={Star} label="Trust Signals" meta="Social Proof" />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center hover:border-amber-300 transition-colors">
                          <p className="text-3xl font-black text-slate-900 flex items-center gap-2 mb-1">4.9 <Star size={24} fill="currentColor" className="text-amber-400"/></p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">127 Customers</p>
                        </div>
                        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center hover:border-blue-300 transition-colors">
                          <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2"><Globe size={16}/></div>
                          <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Google Reviews Synced</p>
                        </div>
                      </div>

                      <div className={`flex items-start gap-4 rounded-2xl border bg-white p-5 transition-all ${activeStep === 4 ? 'border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]' : 'border-slate-200 shadow-sm'}`}>
                        <div className="h-10 w-10 shrink-0 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-xs">SJ</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1 mb-2 text-amber-400">
                             <Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/>
                          </div>
                          <p className="text-xs text-slate-600 font-medium leading-relaxed">"Absolutely incredible quality. Transformed my living room instantly. Arrived exactly in 3 days."</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">— Sarah Jenkins, London</p>
                        </div>
                      </div>
                   </motion.div>
                )}

                {activeTabId === 'location' && !isLaunch && (
                   <motion.div key="location" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-8">
                      <PanelTitle icon={MapPin} label="Ready To Contact" meta="Accessibility" />
                      <div className={`rounded-2xl border bg-white p-6 transition-all ${activeStep === 5 ? 'border-red-400 shadow-lg shadow-red-500/20 scale-[1.02]' : 'border-slate-200 shadow-sm'}`}>
                        <Field label="Physical Address">
                          <textarea rows={3} className={`${inputClass} resize-none`} readOnly value="123 Luxury Lane, Design District, New York, NY 10001" />
                        </Field>
                        <div className="mt-5">
                          <Field label="Google Maps Link">
                            <input className={inputClass} readOnly value="https://maps.google.com/?q=New+York" />
                          </Field>
                        </div>
                      </div>
                   </motion.div>
                )}

                {isLaunch && (
                   <motion.div 
                     key="launch" 
                     initial={{ opacity: 0, scale: 0.95 }} 
                     animate={{ opacity: 1, scale: 1 }} 
                     transition={{ duration: 0.4 }} 
                     className="py-6 bg-white rounded-3xl border border-emerald-200 shadow-xl shadow-emerald-500/10 flex flex-col items-center justify-start max-w-2xl mx-auto w-full px-6 relative overflow-hidden"
                   >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none"></div>
                      
                      <h3 className="text-xl font-black text-slate-900 mb-1 text-center">Your Conversion Journey Is Live!</h3>
                      <p className="text-[11px] text-slate-500 font-semibold text-center max-w-sm mx-auto mb-5 leading-relaxed">
                         Every visitor now gets the trust and answers they need before reaching WhatsApp.
                      </p>

                      {/* Live Link Section */}
                      <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4 text-left">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">Your Live FunnelLink</span>
                        <div className="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Globe size={14} className="text-indigo-500 shrink-0"/>
                            <span className="text-xs font-bold text-slate-800 truncate">
                              funnellink.io/{storeName ? storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'urban-living'}
                            </span>
                          </div>
                          <button 
                            onClick={handleCopy}
                            className={`shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${copied ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                          >
                            {copied ? 'Copied!' : 'Copy Link'}
                          </button>
                        </div>
                      </div>

                      {/* Live Funnel Flow Simulation */}
                      <div className="w-full mb-4">
                        <LiveFunnelSimulation storeName={storeName} />
                      </div>
                      
                      {/* Revenue Comparison Panel */}
                      <div className="w-full grid grid-cols-2 gap-4 mb-6">
                         <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">Before FunnelLink</p>
                            <div className="space-y-2.5">
                              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500"><span>Visitors</span> <span className="text-slate-700">143</span></div>
                              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500"><span>WhatsApp Chats</span> <span className="text-slate-700">18</span></div>
                              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[11px] font-black text-slate-900"><span>Closed Customers</span> <span>2</span></div>
                            </div>
                         </div>
                         <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-lg shadow-emerald-500/10 text-left relative overflow-hidden">
                            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-3">After FunnelLink</p>
                            <div className="space-y-2.5">
                              <div className="flex justify-between items-center text-[10px] font-bold text-emerald-700"><span>Visitors</span> <span>143</span></div>
                              <div className="flex justify-between items-center text-[10px] font-bold text-emerald-700"><span>Qualified Chats</span> <span>18</span></div>
                              <div className="pt-2 border-t border-emerald-200/50 flex justify-between items-center text-[11px] font-black text-emerald-700"><span>Closed Customers</span> <span>7</span></div>
                            </div>
                         </div>
                      </div>

                      <div className="w-full">
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 text-center">Promote your link everywhere to multiply conversions:</p>
                         <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-left">
                               <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center shrink-0"><Camera size={16} className="text-pink-500"/></div>
                               <span className="text-[11px] font-bold text-slate-700">Instagram Bio</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-left">
                               <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0"><Megaphone size={16} className="text-blue-600"/></div>
                               <span className="text-[11px] font-bold text-slate-700">Facebook Ads</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-left">
                               <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0"><MessageCircle size={16} className="text-emerald-500"/></div>
                               <span className="text-[11px] font-bold text-slate-700">WhatsApp Blasts</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-left">
                               <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0"><Zap size={16} className="text-amber-500"/></div>
                               <span className="text-[11px] font-bold text-slate-700">Instagram Ads</span>
                            </div>
                         </div>
                      </div>
                    </motion.div>
                )}
             </AnimatePresence>
           </div>
        </div>

      </div>
    </div>
  );
}
