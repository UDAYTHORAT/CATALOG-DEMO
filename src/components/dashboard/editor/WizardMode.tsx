'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, CheckCircle2, Rocket, Info,
  Settings, Type, LayoutGrid, Package, MessageCircle, MapPin,
  ShieldCheck, Zap, Smartphone, Trophy, HelpCircle, Menu, X,
  Eye, Edit2, ArrowRight
} from 'lucide-react';
import type { Content, TabId, Section, SectionId } from './types';
import type { Funnel } from '@/app/actions/funnels';
import PreviewPane from './PreviewPane';
import EditorSidebar from './EditorSidebar';

interface WizardProps {
  content: Content;
  funnel: Funnel;
  panelRenderer: (tab: TabId) => React.ReactNode;
  products: any[];
  onSwitchToAdvanced: () => void;
  onFinish: () => void;
  onReorderSections: (sections: Section[]) => void;
}

// Wizard flow: same tabs as Advanced, minus WhatsApp
const WIZARD_FLOW: { id: TabId; label: string; hint: string; proTip: string; guide: string }[] = [
  { 
    id: 'store', 
    label: 'Store Identity', 
    hint: 'Set your store name, WhatsApp number, and logo. This is the foundation of your funnel.',
    proTip: 'Use a clean, high-resolution logo. A professional identity builds instant trust with your customers.',
    guide: '👶 Here is what to fill in:\n• **Logo**: Click or drag a picture here (PNG/JPG up to 5MB).\n• **Business Name**: Type your shop\'s name here (e.g., Urban Living).\n• **WhatsApp Lead Capture**: Put your number with country code (+91). This is where you get leads!'
  },
  { 
    id: 'content', 
    label: 'Hero Landing', 
    hint: 'Write a powerful headline and sub-headline. This is the hook that stops visitors from scrolling away.',
    proTip: 'Focus on benefits, not features. Instead of "We sell furniture", try "Transform your living space with handcrafted luxury".',
    guide: '👶 Here is what to do:\n• Write a big, loud sentence (Headline) to make people say "Wow!".\n• Write a little sentence below that (Sub-headline) to explain more.'
  },
  { 
    id: 'categories', 
    label: 'Collections', 
    hint: 'Create 1-3 product collections. Fewer choices lead to faster buying decisions.',
    proTip: 'Start with your most popular category. Most buyers decide within the first few seconds of viewing your collections.',
    guide: '👶 Here is what to do:\n• Give your group a Name (like "Sofas").\n• Add a Tagline (a short sentence) to describe it.'
  },
  { 
    id: 'products', 
    label: 'Product Showcase', 
    hint: 'Add products with clear names, prices, and descriptions. Quality over quantity.',
    proTip: 'Always use real product photos if possible. Highlight customization options in the description to increase intent.',
    guide: '👶 Here is what to do:\n• Type the Product Name so people know what it is.\n• Put the Price so they know how much it costs.\n• Add a Picture so they can see it.'
  },
  { 
    id: 'testimonials', 
    label: 'Customer Reviews', 
    hint: 'Add real customer reviews. Social proof is the strongest trust signal for new buyers.',
    proTip: 'Include the customer\'s city if possible. Local social proof feels much more authentic to new visitors.',
    guide: '👶 Here is what to do:\n• Put the Customer\'s Name.\n• Write their Review (what they liked).'
  },
  { 
    id: 'location', 
    label: 'Studio Location', 
    hint: 'Add your showroom address or factory location. This helps buyers verify your store is real.',
    proTip: 'Even if you are online-only, mentioning your base city or factory location helps establish authenticity.',
    guide: '👶 Here is what to do:\n• Type your Address (where your shop is).\n• Add a Map Link so they can get directions.'
  },
];

const TAB_TOURS: Record<string, { title: string; description: string; proTip: string; targetId?: string; fallbackId?: string }[]> = {
  store: [
    { 
      title: "Click or drag image (PNG, JPG)", 
      description: "Add logo here.", 
      proTip: "Use a high-resolution logo with a transparent background for the best look.",
      targetId: "tour-store-logo"
    },
    { 
      title: "Business Name", 
      description: "Here add the name of the business.", 
      proTip: "Make it memorable and consistent with your brand.",
      targetId: "tour-store-name"
    },
    { 
      title: "WhatsApp Lead Capture", 
      description: "Add WhatsApp no here.", 
      proTip: "Double check this number! If it is wrong, customers cannot reach you.",
      targetId: "tour-store-whatsapp"
    }
  ],
  content: [
    { 
      title: "Write a Headline", 
      description: "Write a big, bold sentence that grabs attention immediately. This is the first text visitors see. Explain your main benefit in one line.", 
      proTip: "Focus on emotion and benefit (e.g., 'Transform Your Living Space with Handcrafted Luxury').",
      targetId: "tour-content-headline"
    },
    { 
      title: "Add a Sub-headline", 
      description: "Explain a bit more about your offer or what makes you special. This text appears right below the big headline to give more context.", 
      proTip: "Keep it short, supportive, and action-oriented.",
      targetId: "tour-content-subheadline"
    }
  ],
  categories: [
    { 
      title: "Selection Title", 
      description: "This is the main question you ask your customers. What do you want them to pick?", 
      proTip: "Make it action-oriented (e.g., 'What Piece Are You Looking For?').",
      targetId: "tour-categories-global-title"
    },
    { 
      title: "Add Collections", 
      description: "Click here to add product categories like 'Sofas', 'Beds', or 'Dining'.", 
      proTip: "Limit to 1-3 collections. Fewer choices lead to faster buying decisions and less fatigue.",
      targetId: "tour-categories-add-btn"
    },
    { 
      title: "Collection Name", 
      description: "Give your collection a clear name (e.g., 'Luxury Sofas').", 
      proTip: "Keep it simple and descriptive so customers know exactly what's inside.",
      targetId: "tour-categories-name",
      fallbackId: "tour-categories-empty"
    }
  ],
  products: [
    { 
      title: "Add Products", 
      description: "Add items from your catalog. This header holds the product name, category, and main price.", 
      proTip: "Keep the name short. This is what shows up on the main store page.",
      targetId: "tour-products-details",
      fallbackId: "tour-products-empty"
    },
    { 
      title: "Storefront Identity", 
      description: "Upload high-quality images and set your Marketing Tier (like 'Most Popular').", 
      proTip: "Use real lifestyle photos of your furniture, not just stock images. Real photos increase buying intent significantly.",
      targetId: "tour-products-storefront",
      fallbackId: "tour-products-empty"
    },
    { 
      title: "Conversion Boosters", 
      description: "Add urgency hooks (e.g., 'Selling Fast') and delivery promises (e.g., 'Ships in 7 Days').", 
      proTip: "A fast delivery promise is the #1 way to prevent cart abandonment.",
      targetId: "tour-products-boosters",
      fallbackId: "tour-products-empty"
    },
    { 
      title: "Elite Narrative", 
      description: "Write a short, engaging story about this piece. Describe the quality and feel.", 
      proTip: "Don't just list features; tell them how it will make their room look and feel.",
      targetId: "tour-products-narrative",
      fallbackId: "tour-products-empty"
    },
    { 
      title: "Premium Specifications", 
      description: "List the exact dimensions, materials, and finish. Customers need this to measure their space.", 
      proTip: "Be extremely accurate here to reduce return rates.",
      targetId: "tour-products-specs",
      fallbackId: "tour-products-empty"
    },
    { 
      title: "Craftsmanship Benefits", 
      description: "Highlight up to 3 key benefits (e.g., 'Solid Teak Wood', 'Water Resistant').", 
      proTip: "Use punchy titles. Buyers scan these bullets before reading the full narrative.",
      targetId: "tour-products-benefits",
      fallbackId: "tour-products-empty"
    }
  ],
  testimonials: [
    { 
      title: "Add Customer Reviews", 
      description: "Paste what happy customers have said about your products. Real social proof is the strongest trust signal for new buyers.", 
      proTip: "Include the customer's city if possible (e.g., 'Rahul from Mumbai'). Local social proof feels much more authentic.",
      targetId: "tour-testimonials-list"
    }
  ],
  location: [
    { 
      title: "Set Studio Location", 
      description: "Add your physical showroom address or factory location and a Google Maps link. This helps buyers verify your store is real.", 
      proTip: "Even if you are online-only, mentioning your base city or factory location helps establish authenticity.",
      targetId: "tour-location-fields"
    }
  ]
};

export default function WizardMode({
  content, funnel, panelRenderer, products,
  onSwitchToAdvanced, onFinish, onReorderSections,
}: WizardProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const activeTab = WIZARD_FLOW[stepIdx];
  const isLast = stepIdx === WIZARD_FLOW.length - 1;

  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [fieldHighlight, setFieldHighlight] = useState<any>(null);
  const [completedTours, setCompletedTours] = useState<Set<string>>(new Set());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentTourSteps = TAB_TOURS[activeTab.id] || [
    { title: "Fill Details", description: "Follow the fields to complete this step.", proTip: "Keep it simple." }
  ];

  // Auto-start tour when tab changes, ONLY if not completed
  useEffect(() => {
    if (!completedTours.has(activeTab.id)) {
      setOnboardingStep(1);
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }
  }, [activeTab.id, completedTours]);

  useEffect(() => {
    if (!showOnboarding) return;
    const step = currentTourSteps[onboardingStep - 1];
    
    if (step && step.targetId) {
      // Small delay to ensure the element is in the DOM before scrolling
      setTimeout(() => {
        let el = document.getElementById(step.targetId!);
        if (!el && step.fallbackId) el = document.getElementById(step.fallbackId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
    }

    // Continuously measure position to track the element while scrolling
    const interval = setInterval(() => {
      if (step && step.targetId) {
        let el = document.getElementById(step.targetId!);
        if (!el && step.fallbackId) el = document.getElementById(step.fallbackId);
        
        if (el) {
          const rect = el.getBoundingClientRect();
          const padding = 12;
          setFieldHighlight((prev: any) => {
            const newTop = rect.top - padding;
            const newLeft = rect.left - padding;
            const newWidth = rect.width + padding * 2;
            const newHeight = rect.height + padding * 2;
            
            // Only trigger re-render if position changed significantly
            if (!prev || Math.abs(prev.top - newTop) > 1 || Math.abs(prev.left - newLeft) > 1) {
              return { top: newTop, left: newLeft, width: newWidth, height: newHeight };
            }
            return prev;
          });
        } else {
          setFieldHighlight(null);
        }
      } else {
        setFieldHighlight(null);
      }
    }, 16); // ~60fps
    
    return () => clearInterval(interval);
  }, [onboardingStep, currentTourSteps, showOnboarding, activeTab.id]);

  const markTourCompleted = () => {
    setCompletedTours(prev => {
      const newSet = new Set(prev);
      newSet.add(activeTab.id);
      return newSet;
    });
  };

  const handleNextTour = () => {
    if (onboardingStep < currentTourSteps.length) {
      setOnboardingStep(prev => prev + 1);
    } else {
      setShowConfetti(true);
      markTourCompleted();
      setTimeout(() => {
        setShowOnboarding(false);
        setOnboardingStep(1);
        setShowConfetti(false);
      }, 1000);
    }
  };

  const handleSkipTour = () => {
    markTourCompleted();
    setShowOnboarding(false);
    setOnboardingStep(1);
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Guided Tour Overlay */}
      <AnimatePresence>
        {showOnboarding && (() => {
          const step = currentTourSteps[onboardingStep - 1];
          if (!step) return null;
          
          const c = { bg: 'bg-indigo-500', bgLight: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-400', btn: 'bg-indigo-600', btnHover: 'hover:bg-indigo-700', shadow: 'shadow-indigo-200', ring: 'ring-indigo-400/30' };

          // Always highlight the editing area for field guides
          const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
          let hl: any = { top: 68, left: 200, width: 460, height: windowHeight - 68 };
          let cardStyle: React.CSSProperties = { left: 680, top: '50%', transform: 'translateY(-50%)' };
          let arrowStyle: React.CSSProperties = { position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderRight: '10px solid white' };

          if (fieldHighlight) {
            hl = fieldHighlight;
            
            // Calculate a smart top position so the card doesn't go off-screen
            const cardHeight = 360; // Approximate card height
            let cardTop = hl.top - 20;
            if (cardTop + cardHeight > windowHeight - 20) {
              cardTop = windowHeight - cardHeight - 20;
            }
            if (cardTop < 80) {
              cardTop = 80;
            }
            
            const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
            const isMobile = windowWidth < 1024;
            

            
            if (isMobile) {
              // Smart Flip: If field is in the lower half of screen, dock card to top. Otherwise, dock to bottom.
              if (hl.top > windowHeight / 2 - 50) {
                cardStyle = { left: 16, right: 16, top: 80, bottom: 'auto', transform: 'none' };
              } else {
                cardStyle = { left: 16, right: 16, bottom: 24, top: 'auto', transform: 'none' };
              }
              arrowStyle = { display: 'none' };
            } else {
              cardStyle = { left: hl.left + hl.width + 24, top: cardTop, width: 360 };
              
              // Calculate the arrow position to point to the middle of the highlighted field
              let arrowTop = (hl.top + (hl.height / 2)) - cardTop - 10;
              // Keep arrow within the bounds of the card
              arrowTop = Math.max(20, Math.min(arrowTop, cardHeight - 40));
              
              arrowStyle = { position: 'absolute', left: -8, top: arrowTop, width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderRight: '10px solid white' };
            }
          }

          return (
            <div className="fixed inset-0 z-[200]">
              {/* Dim overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
                onClick={handleSkipTour}
              >
                <div className="absolute top-0 left-0 right-0 bg-black/40" style={{ height: hl.top }} />
                <div className="absolute left-0 right-0 bottom-0 bg-black/40" style={{ top: hl.top + hl.height }} />
                <div className="absolute bg-black/40" style={{ top: hl.top, left: 0, width: hl.left, height: hl.height }} />
                <div className="absolute bg-black/40" style={{ top: hl.top, left: hl.left + hl.width, right: 0, height: hl.height }} />
              </motion.div>

              {/* Highlight border */}
              <motion.div
                layoutId="guide-highlight"
                className={`absolute z-[201] pointer-events-none border-2 ${c.border} ring-4 ${c.ring}`}
                style={hl}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              />

              {/* Tooltip Card */}
              <motion.div
                key={onboardingStep}
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: 'spring', damping: 28, stiffness: 280, delay: 0.1 }}
                className="fixed z-[210] w-[calc(100%-32px)] lg:w-[360px]"
                style={cardStyle}
              >
                <div style={arrowStyle} />
                <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] overflow-hidden">
                  <div className={`h-1 ${c.bg}`} />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${c.bgLight} ${c.text}`}>
                        <HelpCircle size={10} />
                        Step {onboardingStep} of {currentTourSteps.length}
                      </div>
                      <span className="text-[10px] font-bold text-slate-300">{activeTab.label}</span>
                    </div>
                    <h3 className="text-[28px] leading-[1.1] text-slate-900 mb-3" style={{ fontFamily: "'Tanker', serif" }}>{step.title}</h3>
                    <p className="text-[13px] text-slate-500 leading-relaxed mb-4">{step.description}</p>
                    <div className={`p-3.5 rounded-xl ${c.bgLight} mb-5`}>
                      <p className="text-[12px] font-semibold text-slate-700 leading-snug">{step.proTip}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {currentTourSteps.map((_, i) => (
                          <div key={i} className={`h-1.5 rounded-full transition-all duration-400 ${i < onboardingStep - 1 ? `w-1.5 ${c.bg} opacity-40` : i === onboardingStep - 1 ? `w-6 ${c.bg}` : 'w-1.5 bg-slate-200'}`} />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={handleSkipTour} className="px-3 py-2 text-[10px] font-bold text-slate-400 hover:text-slate-700 uppercase tracking-widest transition-colors">Skip</button>
                        <button onClick={handleNextTour} className={`px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white transition-all active:scale-95 flex items-center gap-1.5 ${c.btn} ${c.btnHover} shadow-md ${c.shadow}`}>
                          {onboardingStep === currentTourSteps.length ? "Done" : "Next"}
                          <ChevronRight size={12} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Header — same as Advanced but with Wizard badge */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <span className="shrink-0 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-indigo-600 bg-indigo-50 px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-indigo-100">Wizard Mode</span>
          <div className="shrink-0 h-4 md:h-5 w-px bg-slate-200" />
          <div className="min-w-0 truncate">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400 truncate">Editor</p>
            <p className="text-sm md:text-base font-semibold text-slate-900 truncate">{funnel?.welcome_title ?? 'Furniture Funnel'}</p>
          </div>
        </div>
        
        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button onClick={onSwitchToAdvanced} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
            Switch to Advanced →
          </button>
          <button
            onClick={() => { if (isLast) onFinish(); else setStepIdx(s => s + 1); }}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold shadow-lg transition-all active:scale-95 ${
              isLast ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-900 text-white hover:bg-black'
            }`}
          >
            {isLast ? <><Rocket className="h-4 w-4 text-orange-400" /> Publish & Go Live</> : <>Next Step <ChevronRight className="h-4 w-4" /></>}
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden flex items-center justify-center p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden absolute top-[73px] left-0 right-0 z-[100] bg-white border-b border-slate-200 shadow-2xl p-4 flex flex-col gap-3"
          >
            <button 
              onClick={() => {
                onSwitchToAdvanced();
                setIsMobileMenuOpen(false);
              }} 
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 p-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Switch to Advanced →
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (isLast) onFinish(); else setStepIdx(s => s + 1);
              }}
              className={`flex w-full items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold shadow-lg transition-all active:scale-95 ${
                isLast ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-900 text-white hover:bg-black'
              }`}
            >
              {isLast ? <><Rocket className="h-4 w-4 text-orange-400" /> Publish & Go Live</> : <>Next Step <ChevronRight className="h-4 w-4" /></>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div id="wizard-mobile-scroll-layout" className="flex flex-1 overflow-x-auto overflow-y-hidden snap-x snap-mandatory lg:overflow-hidden lg:flex-row w-full scrollbar-none scroll-smooth">
        {/* Sidebar */}
        <div className="flex h-full w-full lg:w-[660px] shrink-0 snap-center flex-col border-r border-slate-200 bg-white shadow-xl relative z-40 lg:z-auto">
          <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
            {/* Nav Column */}
            <div className="flex w-full md:w-[260px] shrink-0 flex-col border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50">
              <div className="flex-1 overflow-y-auto p-4 scrollbar-none">
                {/* Progress bar */}
                <div className="mb-5">
                  <div className="flex gap-1 mb-2">
                    {WIZARD_FLOW.map((_, i) => (
                      <div key={i} className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${i <= stepIdx ? 'bg-slate-900' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400">Step {stepIdx + 1} of {WIZARD_FLOW.length}</p>
                </div>

                {/* Step buttons */}
                <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none snap-x">
                  {WIZARD_FLOW.map((tab, i) => {
                    const isActive = i === stepIdx;
                    const isDone = i < stepIdx;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setStepIdx(i)}
                        className={`group shrink-0 flex md:w-full items-center justify-between rounded-xl border px-3 py-3 transition-all snap-start ${
                          isActive ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                          : isDone ? 'border-emerald-200 bg-emerald-50/60 text-emerald-700 hover:bg-emerald-50'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 whitespace-nowrap">
                          <div className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                            isActive ? 'bg-white/10' : isDone ? 'bg-emerald-100' : 'bg-slate-100 group-hover:bg-slate-200'
                          }`}>
                            {isDone ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-black">{i + 1}</span>}
                          </div>
                          <span className="text-xs font-bold">{tab.label}</span>
                        </div>
                        <ChevronRight size={12} className={`ml-2 ${isActive ? 'text-white/40' : 'text-slate-300'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Editing Column */}
            <div className="flex-1 overflow-y-auto bg-white p-4 md:p-6 pb-32 md:pb-6">
              {/* Wizard guidance banner */}
              <div className="relative flex flex-col gap-3 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 mb-6 pr-14">
                <button 
                  onClick={() => {
                    setOnboardingStep(1);
                    setShowOnboarding(true);
                  }}
                  className="absolute top-4 right-4 flex items-center justify-center h-8 w-8 rounded-full bg-white shadow-sm border border-indigo-100 text-indigo-500 hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95"
                  title="Show Guide"
                >
                  <HelpCircle size={16} />
                </button>
                <div className="flex items-start gap-3">
                  <Info size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Step {stepIdx + 1} — {activeTab.label}</p>
                    <p className="text-xs text-indigo-700 leading-relaxed font-medium">{activeTab.hint}</p>
                  </div>
                </div>
                {activeTab.proTip && (
                  <div className="mt-1 p-3 rounded-xl bg-white/80 border border-indigo-50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1">💡 Pro Tip</p>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{activeTab.proTip}</p>
                  </div>
                )}

              </div>

              {/* Render the exact same panel component as Advanced mode */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {panelRenderer(activeTab.id)}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer — Previous / Next */}
          <div className="border-t border-slate-200 bg-slate-50/80 p-4 backdrop-blur-sm flex items-center justify-between">
            <button
              onClick={() => stepIdx > 0 && setStepIdx(s => s - 1)}
              disabled={stepIdx === 0}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-wider text-slate-600 transition-all hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-3 w-3" /> Previous
            </button>
            <button
              onClick={() => { if (isLast) onFinish(); else setStepIdx(s => s + 1); }}
              className={`flex items-center gap-1.5 rounded-lg px-6 py-2 text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 ${
                isLast ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-900 text-white hover:bg-black'
              }`}
            >
              {isLast ? <><Rocket className="h-3 w-3" /> Publish</> : <>Continue <ChevronRight className="h-3 w-3" /></>}
            </button>
          </div>
          
          {/* Floating Mobile Action (Editor -> Preview) */}
          <div className="lg:hidden absolute bottom-24 right-6 z-50">
            <button 
              onClick={() => {
                document.getElementById('wizard-mobile-scroll-layout')?.scrollTo({ left: window.innerWidth, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-full shadow-2xl shadow-slate-900/30 font-bold text-xs active:scale-95 transition-transform"
            >
              <Eye size={16} />
              Preview
              <ArrowRight size={14} className="ml-1 opacity-50" />
            </button>
          </div>
        </div>

        {/* Live Preview — exact same PreviewPane as Advanced */}
        <div className="w-full h-full shrink-0 snap-center lg:w-auto lg:flex-1 relative">
          <PreviewPane
            funnel={funnel}
            content={content}
            products={products}
            previewMode="mobile"
          />
          
          {/* Floating Mobile Action (Preview -> Editor) */}
          <div className="lg:hidden absolute bottom-6 left-6 z-50">
            <button 
              onClick={() => {
                document.getElementById('wizard-mobile-scroll-layout')?.scrollTo({ left: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 bg-white text-slate-900 border border-slate-200 px-5 py-3 rounded-full shadow-2xl font-bold text-xs active:scale-95 transition-transform"
            >
              <ChevronLeft size={14} className="mr-1 opacity-50" />
              <Edit2 size={16} />
              Editor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
