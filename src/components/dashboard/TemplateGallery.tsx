'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Check, Eye, TrendingUp, Users, Zap, Flame } from 'lucide-react';
import { useState } from 'react';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import { MASTER_TEMPLATES, TEMPLATE_CATEGORIES, type FunnelTemplate } from '@/data/funnelTemplates';

interface TemplateGalleryProps { onSelect: (template: FunnelTemplate) => void; }

export function TemplateGallery({ onSelect }: TemplateGalleryProps) {
  const [preview, setPreview] = useState<FunnelTemplate | null>(null);
  const [cat, setCat] = useState('All');
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
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {t.name}
                </h3>
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
    </div>
  );
}
