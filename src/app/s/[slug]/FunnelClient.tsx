'use client';

import { useState, useCallback, useEffect } from 'react';
import { MessageCircle, ShieldCheck, CheckCircle2, ChevronRight, Share2, Sparkles, Image as ImageIcon, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createLead } from '@/app/actions/leads';
import { ResultRule } from '@/data/funnelTemplates';

interface FunnelClientProps {
  funnel: {
    id: string;
    theme: string | null;
    welcome_title: string | null;
    welcome_description: string | null;
    questions?: any[];
    story_mode_data?: any[];
  };
  store: {
    id: string;
    name: string;
    bio: string | null;
    logo_url: string | null;
    whatsapp_number: string | null;
  };
  products: FunnelProduct[];
}

export interface FunnelProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  image_url_2: string | null;
  category: string | null;
  dimensions: string | null;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

type Step = 'hero' | 'quiz' | 'result';

export default function FunnelClient({ funnel, store, products }: FunnelClientProps) {
  const [currentStep, setCurrentStep] = useState<Step>('hero');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // index -> optionIndex
  
  // Smart Enquiry Form State
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  
  const questions = funnel.questions || [];
  
  // Load result settings
  const resultData = funnel.story_mode_data?.[0] || {};
  const resultTitle = resultData.resultTitle || 'Your Perfect Match Found';
  const resultDesc = resultData.resultDesc || 'Based on your answers, we highly recommend this for you.';
  const ctaLabel = resultData.ctaLabel || 'Get Started';
  const ctaType = resultData.ctaType || 'whatsapp';
  const rules = resultData.resultRules as ResultRule[] | undefined;

  // Compute specific result based on answers
  let activeTitle = resultTitle;
  let activeDesc = resultDesc;
  let activeCtaLabel = ctaLabel;
  let activeBadge = undefined;

  if (rules) {
    for (const rule of rules) {
      if (answers[rule.condition.questionIndex] === rule.condition.optionIndex) {
        activeTitle = rule.title;
        activeDesc = rule.description;
        activeCtaLabel = rule.ctaLabel;
        activeBadge = rule.badge;
        break; // first matching rule applies
      }
    }
  }

  // The recommended product could be dynamic. For now we just pick the first product or random.
  // In a full implementation, you'd link products to rules.
  const recommendedProduct = products[0] || null;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: store.name,
          text: funnel.welcome_description || store.bio || 'Check out this experience',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (e) {
      console.log('Error sharing', e);
    }
  };

  const submitEnquiry = useCallback(async () => {
    setEnquirySubmitting(true);

    const storeNumber = store.whatsapp_number?.replace(/\D/g, '') || '';

    await createLead(
      funnel.id,
      store.id,
      enquiryName.trim() || 'Visitor',
      enquiryPhone.trim(),
      JSON.stringify({ type: 'funnel_completion', answers }), 
      recommendedProduct?.id
    );

    if (ctaType === 'whatsapp' && storeNumber) {
      const message = encodeURIComponent(
        `Hi ${store.name}!\n\nI just completed your assessment.\n` + 
        (recommendedProduct ? `I'm interested in *${recommendedProduct.name}*.\n` : '') +
        `\nPlease share more details!`
      );
      window.open(`https://wa.me/${storeNumber}?text=${message}`, '_blank');
    } else {
      alert('Thanks! Your response has been recorded.');
    }
    
    setEnquirySubmitting(false);
  }, [enquiryName, enquiryPhone, store, funnel.id, recommendedProduct, ctaType, answers]);

  const themes = {
    bubbly: {
      bg: 'bg-gradient-to-br from-indigo-50 via-white to-purple-50',
      text: 'text-slate-900',
      card: 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]',
      accent: 'bg-indigo-600 text-white',
      accentHover: 'hover:bg-indigo-700',
    },
    dark: {
      bg: 'bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a]',
      text: 'text-white',
      card: 'bg-white/5 border border-white/10',
      accent: 'bg-white text-black',
      accentHover: 'hover:bg-white/90',
    },
    ethereal: {
      bg: 'bg-gradient-to-tr from-rose-100 via-teal-50 to-violet-100',
      text: 'text-slate-800',
      card: 'bg-white/60 backdrop-blur-xl border border-white/60',
      accent: 'bg-teal-600 text-white',
      accentHover: 'hover:bg-teal-700',
    },
  };

  const activeTheme = themes[funnel.theme as keyof typeof themes] || themes.bubbly;

  const handleOptionSelect = (optIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: optIndex }));
    
    // Auto advance
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setCurrentStep('result');
      }
    }, 400);
  };

  return (
    <div className={`min-h-[100dvh] font-sans relative ${activeTheme.bg} ${activeTheme.text} flex flex-col`}>
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-50">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto flex-1 flex flex-col">
        
        {/* Top Header */}
        <div className="p-4 flex items-center justify-between border-b border-black/5 bg-white/30 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-3">
            {store.logo_url ? (
              <img src={store.logo_url} className="w-10 h-10 rounded-full object-cover shadow-sm border border-white" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">{store.name.charAt(0)}</div>
            )}
            <div className="font-bold tracking-tight text-sm leading-tight">
              {store.name}
              <div className="text-[10px] opacity-60 font-medium flex items-center gap-1"><CheckCircle2 size={10} className="text-blue-500"/> Verified</div>
            </div>
          </div>
          <button onClick={handleShare} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition">
            <Share2 size={16} />
          </button>
        </div>

        <div className="flex-1 flex flex-col p-6 h-full justify-center">
          <AnimatePresence mode="wait">
            
            {/* ── STEP 1: HERO ── */}
            {currentStep === 'hero' && (
              <motion.div key="hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="flex flex-col items-center text-center mt-10">
                <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold mb-6 tracking-wide shadow-sm border border-emerald-200">
                  <Sparkles size={14} className="inline mr-1 -mt-0.5" /> 1000+ Users
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-[1.1]">
                  {funnel.welcome_title || 'Find the right product.'}
                </h1>
                
                <p className="text-lg opacity-80 mb-10 font-medium max-w-sm">
                  {funnel.welcome_description || 'Answer a few quick questions and we will match you with the perfect option.'}
                </p>
                
                <button 
                  onClick={() => questions.length > 0 ? setCurrentStep('quiz') : setCurrentStep('result')}
                  className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl shadow-black/10 flex items-center justify-center gap-2 active:scale-95 transition-all ${activeTheme.accent} ${activeTheme.accentHover}`}
                >
                  Start Now <ArrowRight size={20} />
                </button>
                
                {/* Mini Trust Bar */}
                <div className="mt-8 grid grid-cols-2 gap-2 w-full text-left">
                   <div className="p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-black/5 flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><Check size={12} strokeWidth={3}/></div>
                     <span className="text-[10px] font-bold uppercase tracking-wider">Free Shipping</span>
                   </div>
                   <div className="p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-black/5 flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><ShieldCheck size={12} strokeWidth={3}/></div>
                     <span className="text-[10px] font-bold uppercase tracking-wider">Trusted Store</span>
                   </div>
                </div>

                <div className="mt-6 flex items-center gap-4 opacity-50 text-[10px] font-bold uppercase tracking-widest">
                  <span>Fast</span> • <span>Secure</span> • <span>Private</span>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: QUIZ ── */}
            {currentStep === 'quiz' && questions.length > 0 && (
              <motion.div key={`quiz-${currentQuestionIndex}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex flex-col h-full mt-4">
                <div className="w-full bg-black/10 h-1.5 rounded-full mb-8 overflow-hidden">
                  <div className="h-full bg-black transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }} />
                </div>
                
                <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-2">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
                
                <h2 className="text-3xl font-black mb-10 leading-tight">
                  {questions[currentQuestionIndex].question}
                </h2>
                
                <div className="space-y-3 mt-auto mb-10">
                  {questions[currentQuestionIndex].options?.map((opt: string, idx: number) => {
                    const isSelected = answers[currentQuestionIndex] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        className={`w-full p-5 text-left rounded-2xl font-bold text-lg transition-all border-2 flex justify-between items-center ${
                          isSelected ? 'border-black bg-black text-white shadow-lg scale-[1.02]' : `${activeTheme.card} border-transparent hover:border-black/20`
                        }`}
                      >
                        {opt}
                        {isSelected && <Check size={20} />}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: RESULT ── */}
            {currentStep === 'result' && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center mt-4 pb-12">
                
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
                  <Check size={32} strokeWidth={3} />
                </div>
                
                {activeBadge && (
                  <div className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                    {activeBadge}
                  </div>
                )}
                
                <h2 className="text-3xl font-black mb-3 text-center leading-tight">
                  {activeTitle}
                </h2>
                
                <p className="text-center font-medium opacity-80 mb-8 max-w-sm text-lg">
                  {activeDesc}
                </p>

                {recommendedProduct && (
                  <div className={`w-full p-4 rounded-[2rem] border-2 border-black/5 shadow-xl mb-8 bg-white text-black`}>
                    <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden mb-4 relative">
                      {recommendedProduct.image_url ? (
                        <img src={recommendedProduct.image_url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={48} /></div>
                      )}
                    </div>
                    <div className="px-2">
                      <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">{recommendedProduct.category || 'Recommended'}</div>
                      <h3 className="font-black text-2xl mb-1">{recommendedProduct.name}</h3>
                      <p className="font-bold text-xl opacity-60 mb-2">{formatPrice(recommendedProduct.price)}</p>
                    </div>
                  </div>
                )}

                <div className="w-full p-6 bg-white/50 backdrop-blur-md rounded-[2rem] border border-black/5">
                  <h4 className="font-black text-sm mb-4">Where should we send details?</h4>
                  <div className="space-y-3 mb-6">
                    <input 
                      type="text" placeholder="Your Name" value={enquiryName} onChange={e=>setEnquiryName(e.target.value)}
                      className="w-full px-5 py-4 bg-white rounded-xl border border-black/10 outline-none focus:border-black font-bold"
                    />
                    <input 
                      type="tel" placeholder="WhatsApp Number" value={enquiryPhone} onChange={e=>setEnquiryPhone(e.target.value)}
                      className="w-full px-5 py-4 bg-white rounded-xl border border-black/10 outline-none focus:border-black font-bold"
                    />
                  </div>
                  
                  <button 
                    onClick={submitEnquiry} disabled={enquirySubmitting}
                    className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl shadow-[#25d366]/30 flex items-center justify-center gap-2 active:scale-95 transition-all ${ctaType === 'whatsapp' ? 'bg-[#25d366] text-white hover:bg-[#20bd5a]' : 'bg-black text-white hover:bg-gray-800'} disabled:opacity-50`}
                  >
                    {enquirySubmitting ? <Loader2 className="animate-spin" /> : ctaType === 'whatsapp' ? <MessageCircle size={20} /> : null}
                    {activeCtaLabel}
                  </button>
                  <div className="text-center mt-4 flex items-center justify-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><ShieldCheck size={14}/> Secure connection</div>
                </div>

                {/* Final Urgency Push */}
                <div className="w-full mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center text-amber-800">
                  <div className="text-xs font-black uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                     <span className="relative flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                     </span>
                     Limited Offer
                  </div>
                  <div className="text-sm font-bold opacity-80">This recommendation is valid for 15 minutes.</div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

        <footer className="py-6 text-center opacity-30 text-[9px] font-black uppercase tracking-[0.4em]">
          Powered by FunnelLink
        </footer>
      </div>
    </div>
  );
}
