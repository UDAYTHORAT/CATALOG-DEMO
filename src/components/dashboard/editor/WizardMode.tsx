'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, CheckCircle2, Rocket, Info,
  Settings, Type, LayoutGrid, Package, MessageCircle, MapPin,
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
const WIZARD_FLOW: { id: TabId; label: string; hint: string }[] = [
  { id: 'store', label: 'Store Identity', hint: 'Set your store name, WhatsApp number, and logo. This is the first thing your customers will see — make it memorable.' },
  { id: 'content', label: 'Hero Landing', hint: 'Write a powerful headline and sub-headline. This is the hook that stops visitors from scrolling away.' },
  { id: 'categories', label: 'Collections', hint: 'Create 2-3 product collections (e.g. "Sofas", "Beds"). Fewer choices = faster buying decisions.' },
  { id: 'products', label: 'Product Showcase', hint: 'Add 2-3 products per collection with name, price, and a short description. Quality over quantity.' },
  { id: 'testimonials', label: 'Customer Reviews', hint: 'Add real customer reviews. Social proof is the #1 trust signal for new buyers.' },
  { id: 'location', label: 'Studio Location', hint: 'Add your showroom address and a Google Maps link. This helps buyers verify your store is real.' },
];

export default function WizardMode({
  content, funnel, panelRenderer, products,
  onSwitchToAdvanced, onFinish, onReorderSections,
}: WizardProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const activeTab = WIZARD_FLOW[stepIdx];
  const isLast = stepIdx === WIZARD_FLOW.length - 1;

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header — same as Advanced but with Wizard badge */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">Wizard Mode</span>
          <div className="h-5 w-px bg-slate-200" />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Editor</p>
            <p className="text-base font-semibold text-slate-900">{funnel?.welcome_title ?? 'Furniture Funnel'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — same 660px as Advanced */}
        <div className="flex h-full w-[660px] shrink-0 flex-col border-r border-slate-200 bg-white shadow-xl">
          <div className="flex flex-1 overflow-hidden">
            {/* Nav Column — wizard step list instead of EditorSidebar */}
            <div className="flex w-[200px] shrink-0 flex-col border-r border-slate-100 bg-slate-50/50">
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

                {/* Step buttons — same style as EditorSidebar */}
                <div className="space-y-2">
                  {WIZARD_FLOW.map((tab, i) => {
                    const isActive = i === stepIdx;
                    const isDone = i < stepIdx;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setStepIdx(i)}
                        className={`group flex w-full items-center justify-between rounded-xl border px-3 py-3 transition-all ${
                          isActive ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                          : isDone ? 'border-emerald-200 bg-emerald-50/60 text-emerald-700 hover:bg-emerald-50'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                            isActive ? 'bg-white/10' : isDone ? 'bg-emerald-100' : 'bg-slate-100 group-hover:bg-slate-200'
                          }`}>
                            {isDone ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-black">{i + 1}</span>}
                          </div>
                          <span className="text-xs font-bold">{tab.label}</span>
                        </div>
                        <ChevronRight size={12} className={isActive ? 'text-white/40' : 'text-slate-300'} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Editing Column — renders the SAME panels as Advanced */}
            <div className="flex-1 overflow-y-auto bg-white p-6">
              {/* Wizard guidance banner */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 mb-6">
                <Info size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Step {stepIdx + 1} — {activeTab.label}</p>
                  <p className="text-xs text-indigo-700 leading-relaxed font-medium">{activeTab.hint}</p>
                </div>
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
        </div>

        {/* Live Preview — exact same PreviewPane as Advanced */}
        <PreviewPane
          funnel={funnel}
          content={content}
          products={products}
          previewMode="mobile"
        />
      </div>
    </div>
  );
}
