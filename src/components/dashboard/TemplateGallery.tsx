'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Eye, TrendingUp, Users, Zap, Flame, HelpCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import { MASTER_TEMPLATES, TEMPLATE_CATEGORIES, type FunnelTemplate } from '@/data/funnelTemplates';

interface TemplateGalleryProps { onSelect: (template: FunnelTemplate) => void; }

export function TemplateGallery({ onSelect }: TemplateGalleryProps) {
  const [preview, setPreview] = useState<FunnelTemplate | null>(null);
  const [activeFlowTemplate, setActiveFlowTemplate] = useState<FunnelTemplate | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [cat, setCat] = useState('All');

  useEffect(() => {
    let interval: any;
    if (activeFlowTemplate) {
      setCurrentStep(0); // Reset to 0 when opened
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % 4);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [activeFlowTemplate]);
  const filtered = cat === 'All' ? MASTER_TEMPLATES : MASTER_TEMPLATES.filter(t => t.category === cat);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-linear-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-md">
            <Zap size={14} className="text-white" />
          </div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-[0.15em]">
            Proven · Psychological · High-Converting
          </span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
          Killer Funnel Templates
        </h2>
        <p className="text-sm text-slate-400 max-w-lg">
          Every template is battle-tested with conversion psychology — scarcity, social proof, authority, and loss aversion built in. Pick, deploy, convert.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 w-fit overflow-x-auto no-scrollbar gap-0.5">
        {TEMPLATE_CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              cat === c
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Template Count */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Flame size={12} className="text-orange-500" />
        <span><span className="font-bold text-slate-700">{filtered.length}</span> templates available</span>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
            className="group bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
          >
            {/* Badge */}
            {t.badge && (
              <div className="absolute top-3 left-3 z-20 px-2 py-0.5 bg-white/95 backdrop-blur-sm rounded-md text-[9px] font-black uppercase tracking-wider shadow-md border border-slate-100"
                style={{ color: t.accentColor }}
              >
                {t.badge}
              </div>
            )}

            {/* Mini Preview Header */}
            <div className={`relative h-44 bg-linear-to-br ${t.bgGradient} p-3 overflow-hidden`}>
              <div
                className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-[50px] opacity-30"
                style={{ backgroundColor: t.accentColor }}
              />
              <div
                className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl opacity-15"
                style={{ backgroundColor: t.accentColor }}
              />

              {/* Mini funnel card */}
              <div className={`absolute inset-3 rounded-xl border shadow-lg overflow-hidden ${
                t.theme === 'onyx' || t.theme === 'dark'
                  ? 'bg-slate-900 border-slate-700'
                  : 'bg-white border-slate-200'
              }`}>
                <div className="flex flex-col h-full">
                  <div className={`flex items-center justify-between px-3 py-1.5 border-b ${
                    t.theme === 'onyx' || t.theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
                  }`}>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px]">{t.icon}</span>
                      <span className={`text-[7px] font-bold ${
                        t.theme === 'onyx' || t.theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                      }`}>{t.name}</span>
                    </div>
                    <div
                      className="px-1.5 py-0.5 rounded-full text-[5px] font-bold text-white"
                      style={{ backgroundColor: t.accentColor }}
                    >
                      {t.hero.ctaLabel.split(' ').slice(0, 2).join(' ')}
                    </div>
                  </div>
                    <div className="flex-1 flex flex-col items-center justify-center px-3 text-center gap-1 relative">
                      {t.id === 'funnelad-elite-furniture' && (
                        <img 
                          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=60" 
                          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
                          alt="preview"
                        />
                      )}
                      <p className={`text-[9px] font-extrabold leading-tight relative z-10 ${
                        t.theme === 'onyx' || t.theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>
                        {t.id === 'funnelad-elite-furniture' ? 'Urban Living.' : t.hero.headline}
                      </p>
                    <p className="text-[6px] text-slate-400 leading-tight max-w-[90%]">
                      {t.hero.subheadline.slice(0, 55)}...
                    </p>
                    <div
                      className="mt-1 px-2.5 py-0.5 rounded-full text-[5px] font-bold text-white"
                      style={{ backgroundColor: t.accentColor }}
                    >
                      {t.hero.ctaLabel} →
                    </div>
                  </div>
                </div>
              </div>

              {/* Category badge */}
              <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-white/90 backdrop-blur-sm rounded text-[6px] font-bold uppercase text-slate-500 shadow-sm">
                {t.category}
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">{t.icon}</span>
                <div className="flex items-center gap-1">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {t.name}
                  </h3>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveFlowTemplate(t); }}
                    className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                    title="How it works"
                  >
                    <HelpCircle size={14} />
                  </button>
                </div>
                <span
                  className="text-[7px] font-bold uppercase px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: t.accentColor + '12',
                    color: t.accentColor,
                  }}
                >
                  {t.theme}
                </span>
              </div>

              <p className="text-[13px] text-slate-400 mb-3 leading-relaxed">{t.description}</p>

              {/* Features */}
              <div className="space-y-1.5 mb-3">
                {t.features.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                      style={{ backgroundColor: t.accentColor + '12' }}
                    >
                      <Check size={10} strokeWidth={3} style={{ color: t.accentColor }} />
                    </div>
                    {f}
                  </div>
                ))}
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 py-2.5 border-t border-slate-50 mb-3 text-[11px]">
                <span className="flex items-center gap-1 text-slate-500">
                  <TrendingUp size={11} className="text-emerald-500" />
                  Conv: <span className="font-bold text-emerald-600">{t.stats.convRate}</span>
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Users size={11} className="text-slate-400" />
                  Avg: <span className="font-bold text-slate-700">{t.stats.avgLeads}</span>
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => onSelect(t)}
                  className="flex-1 py-2.5 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                  style={{ backgroundColor: t.accentColor }}
                >
                  <Zap size={13} /> Deploy <ArrowRight size={13} />
                </button>
                <button
                  onClick={() => setPreview(t)}
                  className="py-2.5 px-3.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-600 transition-all"
                  title="Preview"
                >
                  <Eye size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <TemplatePreviewModal
        isOpen={!!preview}
        onClose={() => setPreview(null)}
        template={preview}
        onSelect={(t) => { setPreview(null); onSelect(t); }}
      />

      <AnimatePresence>
        {activeFlowTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setActiveFlowTemplate(null)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2rem] w-full max-w-2xl p-8 shadow-2xl border border-white/60 mx-4"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">How the {activeFlowTemplate.name} Works</h3>
                  <p className="text-sm text-slate-500 mt-1">The psychology behind the conversion flow</p>
                </div>
                <button
                  onClick={() => setActiveFlowTemplate(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <X size={16} className="text-slate-600" />
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Left: Mobile Frame */}
                <div className="w-[260px] h-[480px] bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl relative border-4 border-slate-800 shrink-0">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-b-xl z-20" />
                  
                  {/* Screen */}
                  <div className="w-full h-full bg-white rounded-[1.8rem] overflow-hidden relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                      >
                        {currentStep === 0 && (
                          <div className="p-0 bg-white h-full text-black flex flex-col">
                            {/* Insta Header */}
                            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] text-white font-bold">F</div>
                                <div>
                                  <div className="text-[10px] font-bold">elite_furniture</div>
                                  <div className="text-[8px] text-slate-500">Sponsored</div>
                                </div>
                              </div>
                              <div className="text-slate-400">•••</div>
                            </div>
                            
                            {/* Ad Image */}
                            <div className="relative aspect-square bg-slate-100">
                              <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=60" className="w-full h-full object-cover" alt="ad" />
                              <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-center py-2 text-[10px] font-bold flex justify-between px-3 items-center">
                                <span>Shop Now</span>
                                <span>→</span>
                                {/* Tap Indicator Animation */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-white/50 rounded-full animate-ping" />
                              </div>
                            </div>
                            
                            {/* Actions & Caption */}
                            <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center gap-3 text-slate-700 mb-1">
                                  <span>♥</span><span>💬</span><span>✈</span>
                                </div>
                                <div className="text-[9px] font-bold">1,234 likes</div>
                                <div className="text-[9px] leading-tight mt-0.5">
                                  <span className="font-bold">elite_furniture</span> ❌ Stop scrolling! Get your dream furniture in 30 seconds. No forms, no waiting. Tap Shop Now!
                                </div>
                              </div>
                              
                              <div className="text-[7px] text-slate-400 uppercase font-bold">View all 42 comments</div>
                            </div>
                          </div>
                        )}
                        {currentStep === 1 && (
                          <div className="p-4 bg-white h-full text-black flex flex-col justify-center items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                              <Zap size={24} className="text-indigo-600" />
                            </div>
                            <div className="text-sm font-bold">Connecting to Concierge...</div>
                            <div className="text-[10px] text-slate-500 text-center">Skipping the slow website... Loading custom catalog.</div>
                            <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600 w-2/3 animate-pulse" />
                            </div>
                          </div>
                        )}
                        {currentStep === 2 && (
                          <div className="p-3 bg-white h-full text-black flex flex-col gap-2">
                            {/* Header */}
                            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                              <span className="text-xs font-black tracking-tight">URBAN LIVING</span>
                              <span className="text-[10px] text-slate-500">Menu</span>
                            </div>
                            
                            {/* Hero */}
                            <div className="text-center my-1">
                              <div className="text-[10px] font-bold text-slate-900">Tailor-Made Design</div>
                              <div className="text-[8px] text-slate-500">Get exactly what you want</div>
                            </div>
                            
                            {/* Product Card */}
                            <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                              <div className="aspect-[4/3] bg-slate-100 rounded-md overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=60" className="w-full h-full object-cover" alt="sofa" />
                              </div>
                              <div className="mt-1.5 flex justify-between items-center">
                                <div>
                                  <div className="text-[10px] font-bold">Luxury Velvet Sofa</div>
                                  <div className="text-[8px] text-emerald-600 font-bold">Starting from Rs 70,000</div>
                                </div>
                                <div className="bg-[#111] text-white px-2 py-1 rounded text-[8px] font-bold">
                                  View
                                </div>
                              </div>
                            </div>
                            
                            {/* CTA */}
                            <div className="mt-auto mb-1 bg-[#25D366] text-white text-center py-2 rounded-md text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm">
                              <span>Get Best Deal on WhatsApp</span>
                            </div>
                          </div>
                        )}
                        {currentStep === 3 && (
                          <div className="p-3 bg-[#E5DDD5] h-full text-black flex flex-col">
                            {/* WhatsApp Header */}
                            <div className="flex items-center gap-2 bg-[#075E54] text-white p-2 -mx-3 -mt-3 mb-3">
                              <div className="w-5 h-5 rounded-full bg-slate-300" />
                              <div>
                                <div className="text-[10px] font-bold">Urban Living</div>
                                <div className="text-[6px] text-emerald-200">Online</div>
                              </div>
                            </div>
                            
                            <div className="flex-1 flex flex-col justify-end">
                              <div className="bg-white p-2 rounded-lg shadow-sm text-[9px] self-start max-w-[85%] mb-2 relative">
                                Hi Urban Living, I'm interested in getting an exact quote & photos for:
                                <br/>**Product: Luxury Velvet Sofa**
                                <br/><br/>Please let me know:
                                <br/>1. Exact price for my size
                                <br/>2. Fabric/Wood options
                                <div className="text-[6px] text-slate-400 text-right mt-0.5">12:00 PM</div>
                              </div>
                              <div className="bg-[#DCF8C6] p-2 rounded-lg shadow-sm text-[9px] self-end max-w-[80%] relative">
                                Hi! We can customize the size and fabric. Where should we deliver it?
                                <div className="text-[6px] text-slate-400 text-right mt-0.5">12:00 PM</div>
                              </div>
                            </div>
                            
                            <div className="mt-2 bg-white p-1.5 rounded-full flex items-center justify-between">
                              <span className="text-[9px] text-slate-400 ml-2">Type a message</span>
                              <div className="w-5 h-5 bg-[#128C7E] rounded-full flex items-center justify-center text-white text-[10px]">→</div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Right: Steps List */}
                <div className="flex-1 space-y-4">
                  {[
                    { icon: '📱', title: 'Instagram Ad', desc: 'Customer sees your beautiful ad and stops scrolling.' },
                    { icon: '👇', title: '1-Tap Entry', desc: 'They click and skip the slow, confusing website.' },
                    { icon: '🛋', title: 'No Confusion', desc: 'They see your top products instantly.' },
                    { icon: '💬', title: 'Direct Sale', desc: 'They land in your WhatsApp ready to buy!' }
                  ].map((step, idx) => (
                    <div 
                      key={idx} 
                      className={`relative z-10 p-4 rounded-xl border transition-all cursor-pointer ${
                        currentStep === idx 
                          ? 'bg-indigo-50 border-indigo-200 shadow-sm scale-[1.02]' 
                          : 'bg-white border-slate-100 hover:bg-slate-50'
                      }`}
                      onClick={() => setCurrentStep(idx)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm border ${
                          currentStep === idx ? 'bg-indigo-600 text-white' : 'bg-white border-slate-100'
                        }`}>
                          {step.icon}
                        </div>
                        <div>
                          <h4 className={`text-sm font-bold ${currentStep === idx ? 'text-indigo-900' : 'text-slate-900'}`}>{step.title}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shrink-0">✓</div>
                    <p className="text-xs text-emerald-700 font-medium">
                      Websites confuse buyers with too many options. This funnel takes them straight from Ad to WhatsApp in seconds!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
