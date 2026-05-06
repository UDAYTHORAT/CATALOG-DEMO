'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Monitor, ArrowRight } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { FunnelMockContent } from './FunnelMockContent';
import EliteFurnitureTemplate from '@/components/templates/EliteFurnitureTemplate';
import { createInitialContent } from './editor/utils';

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: any;
  onSelect: (template: any) => void;
}

export function TemplatePreviewModal({ isOpen, onClose, template, onSelect }: TemplatePreviewModalProps) {
  const [view, setView] = useState<'desktop' | 'mobile'>('mobile');

  const isEliteFurniture = template?.id === 'funnelad-elite-furniture';
  
  const elitePreviewProps = useMemo(() => {
    if (!isEliteFurniture) return null;
    const mockFunnel = { id: template.id, story_mode_data: [] } as any;
    const content = createInitialContent(mockFunnel);
    content.logoUrl = ''; // Clear to allow fallback to default logo

    // Mock products with two images each for the preview
    const mockProducts = [
      { 
        id: 'p1', 
        category_id: 'sofas', 
        name: 'Modo Sheesham L-Shape', 
        priceLabel: 'Rs 45,000', 
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        image2: 'https://images.unsplash.com/photo-1550226844-27ceaa53967c?auto=format&fit=crop&w=800&q=80',
        rating: 4.8, 
        urgency: 'Only 2 frames ready', 
        delivery: 'Delivery: 7-10 Days' 
      },
      { 
        id: 'p2', 
        category_id: 'sofas', 
        name: 'Velvet Royal Chesterfield', 
        priceLabel: 'Rs 58,500', 
        image: 'https://images.unsplash.com/photo-1519961655809-34fa156820ff?auto=format&fit=crop&w=800&q=80',
        image2: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80',
        rating: 4.9, 
        urgency: 'Selling fast', 
        delivery: 'Delivery: 5-7 Days' 
      },
      { 
        id: 'p4', 
        category_id: 'beds', 
        name: 'Grand King Upholstered', 
        priceLabel: 'Rs 38,000', 
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
        image2: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
        rating: 4.8, 
        urgency: 'Direct from Factory', 
        delivery: 'Delivery: 10-12 Days' 
      },
      { 
        id: 'p7', 
        category_id: 'dining', 
        name: 'Marble Top 6-Seater', 
        priceLabel: 'Rs 65,000', 
        image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=1200&q=80',
        image2: 'https://images.unsplash.com/photo-1617806118233-18e1db208fa0?auto=format&fit=crop&w=800&q=80',
        rating: 4.9, 
        urgency: 'Premium Finish', 
        delivery: 'Delivery: 10-12 Days' 
      },
      { 
        id: 'p8', 
        category_id: 'dining', 
        name: 'Compact Walnut 4-Seater', 
        priceLabel: 'Rs 22,500', 
        image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=800&q=80',
        rating: 4.8, 
        urgency: 'Space Saver', 
        delivery: 'Delivery: 5-7 Days' 
      }
    ];

    return {
      funnel: { ...mockFunnel, story_mode_data: [{ content }] },
      store: {
        name: content.storeName,
        whatsapp_number: content.whatsappNumber,
        logo_url: null, // Force use of default monogram for premium look
      },
      products: mockProducts,
      isPreview: true,
      previewMode: view
    };
  }, [isEliteFurniture, template?.id, view]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) { window.addEventListener('keydown', h); document.body.style.overflow = 'hidden'; }
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [isOpen, onClose]);

  if (!isOpen || !template) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-md" />
        <motion.div
          initial={{opacity:0, scale:0.95, y:20}}
          animate={{opacity:1, scale:1, y:0}}
          exit={{opacity:0, scale:0.95, y:20}}
          transition={{duration:0.35, ease:[0.16,1,0.3,1]}}
          className="relative w-full max-w-5xl h-full max-h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-black/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-black/10 bg-[#faf7f2] flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{backgroundColor:(template.accentColor||'#1c1b19')+'15'}}>{template.icon}</div>
              <div>
                <h3 className="text-sm font-bold text-[#1c1b19]">{template.name}</h3>
                <p className="text-[10px] text-slate-400"><span className="capitalize">{template.theme}</span> · {template.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-white p-0.5 rounded-lg border border-black/10">
                <button onClick={()=>setView('desktop')} className={`px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1 transition-all ${view==='desktop'?'bg-slate-900 text-white':'text-slate-400'}`}>
                  <Monitor size={12}/> Desktop
                </button>
                <button onClick={()=>setView('mobile')} className={`px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1 transition-all ${view==='mobile'?'bg-slate-900 text-white':'text-slate-400'}`}>
                  <Smartphone size={12}/> Mobile
                </button>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/5 text-slate-400 ml-1"><X size={16}/></button>
            </div>
          </div>

          {/* Preview */}
          <div className="flex-1 bg-[#f6f1e9] flex items-center justify-center overflow-hidden p-2 relative">
            <div className="absolute inset-0 opacity-[0.015]" style={{backgroundImage:'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize:'16px 16px'}} />
            <div className={`relative transition-all duration-500 overflow-hidden ${
              view==='desktop' ? 'w-full h-full rounded-xl shadow-2xl border border-black/10 bg-white' : 'w-full max-w-[420px] h-full rounded-[28px] border-[8px] border-[#1c1b19] shadow-[0_50px_100px_rgba(0,0,0,0.2)] bg-white flex-shrink-0 mx-auto'
            }`}>
              {view==='mobile' && (<>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140px] h-[25px] bg-[#1c1b19] rounded-b-[1.25rem] z-50 flex items-center justify-center gap-2">
                  <div className="w-8 h-1 bg-slate-800 rounded-full"/>
                  <div className="w-1.5 h-1.5 bg-slate-800 rounded-full"/>
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-[#1c1b19] rounded-full z-50 opacity-20"/>
              </>)}
              {view==='desktop' && (
                <div className="h-10 bg-[#faf7f2] border-b border-black/10 flex items-center px-4 gap-2 flex-shrink-0">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-inner"/>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-inner"/>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-inner"/>
                  </div>
                  <div className="flex-1 mx-6"><div className="bg-white/50 backdrop-blur-sm border border-black/5 rounded-lg px-3 py-1 text-[10px] text-slate-400 text-center font-medium truncate">funnellink.co/s/{template.id}</div></div>
                </div>
              )}
              <div id="mobile-scroll-container" className={`overflow-y-auto no-scrollbar ${view==='desktop'?'h-[calc(100%-40px)]':'h-full relative z-10'}`}>
                {isEliteFurniture && elitePreviewProps ? (
                  <EliteFurnitureTemplate {...elitePreviewProps} />
                ) : (
                  <FunnelMockContent template={template} isMobile={view==='mobile'} />
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-black/10 bg-[#faf7f2] flex items-center justify-between flex-shrink-0">
            <div className="flex gap-5 text-[10px]">
              <span><span className="text-slate-400">Sections:</span> <span className="font-bold text-slate-700">6</span></span>
              <span><span className="text-slate-400">Conv:</span> <span className="font-bold text-[#0f766e]">{template.stats?.convRate}</span></span>
              <span><span className="text-slate-400">Avg:</span> <span className="font-bold text-[#1c1b19]">{template.stats?.avgLeads}</span></span>
            </div>
            <div className="flex gap-2">
              <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:bg-black/5">Cancel</button>
              <button onClick={()=>onSelect(template)} className="px-4 py-1.5 bg-[#1c1b19] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-black">
                Use Template <ArrowRight size={13}/>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
