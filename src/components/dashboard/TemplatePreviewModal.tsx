'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Monitor, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { FunnelMockContent } from './FunnelMockContent';

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: any;
  onSelect: (template: any) => void;
}

export function TemplatePreviewModal({ isOpen, onClose, template, onSelect }: TemplatePreviewModalProps) {
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) { window.addEventListener('keydown', h); document.body.style.overflow = 'hidden'; }
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [isOpen, onClose]);

  if (!isOpen || !template) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" />
        <motion.div
          initial={{opacity:0, scale:0.95, y:20}}
          animate={{opacity:1, scale:1, y:0}}
          exit={{opacity:0, scale:0.95, y:20}}
          transition={{duration:0.35, ease:[0.16,1,0.3,1]}}
          className="relative w-full max-w-5xl h-full max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{backgroundColor:(template.accentColor||'#4f46e5')+'15'}}>{template.icon}</div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{template.name}</h3>
                <p className="text-[10px] text-slate-400"><span className="capitalize">{template.theme}</span> · {template.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-white p-0.5 rounded-lg border border-slate-200">
                <button onClick={()=>setView('desktop')} className={`px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1 transition-all ${view==='desktop'?'bg-slate-900 text-white':'text-slate-400'}`}>
                  <Monitor size={12}/> Desktop
                </button>
                <button onClick={()=>setView('mobile')} className={`px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1 transition-all ${view==='mobile'?'bg-slate-900 text-white':'text-slate-400'}`}>
                  <Smartphone size={12}/> Mobile
                </button>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 ml-1"><X size={16}/></button>
            </div>
          </div>

          {/* Preview */}
          <div className="flex-1 bg-slate-100 flex items-center justify-center overflow-hidden p-4 relative">
            <div className="absolute inset-0 opacity-[0.015]" style={{backgroundImage:'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize:'16px 16px'}} />
            <div className={`relative transition-all duration-500 overflow-hidden ${
              view==='desktop' ? 'w-full h-full rounded-xl shadow-xl border border-slate-200' : 'w-[360px] h-[680px] rounded-[2.5rem] border-[8px] border-slate-900 shadow-2xl'
            }`}>
              {view==='mobile' && (<>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900 rounded-b-xl z-50"/>
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-600 rounded-full z-50"/>
              </>)}
              {view==='desktop' && (
                <div className="h-7 bg-slate-50 border-b border-slate-200 flex items-center px-2.5 gap-1 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-red-400"/>
                  <div className="w-2 h-2 rounded-full bg-amber-400"/>
                  <div className="w-2 h-2 rounded-full bg-green-400"/>
                  <div className="flex-1 mx-4"><div className="bg-white border border-slate-200 rounded px-2 py-0.5 text-[8px] text-slate-400 text-center">funnellink.co/s/{template.id}</div></div>
                </div>
              )}
              <div className={`overflow-y-auto no-scrollbar ${view==='desktop'?'h-[calc(100%-28px)]':'h-full'}`}>
                <FunnelMockContent template={template} isMobile={view==='mobile'} />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between flex-shrink-0">
            <div className="flex gap-5 text-[10px]">
              <span><span className="text-slate-400">Sections:</span> <span className="font-bold text-slate-700">6</span></span>
              <span><span className="text-slate-400">Conv:</span> <span className="font-bold text-emerald-600">{template.stats?.convRate}</span></span>
              <span><span className="text-slate-400">Avg:</span> <span className="font-bold text-slate-700">{template.stats?.avgLeads}</span></span>
            </div>
            <div className="flex gap-2">
              <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:bg-slate-100">Cancel</button>
              <button onClick={()=>onSelect(template)} className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-indigo-700">
                Use Template <ArrowRight size={13}/>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
