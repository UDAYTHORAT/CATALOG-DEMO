'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Plus, Trash2,
  ChevronDown, ChevronUp,
  Home, DoorOpen, Zap, Clock,
  LayoutList, X, Ruler, MapPin,
  Lock, Unlock
} from 'lucide-react';
import { Field, IconButton, PanelTitle, subtleInputClass, inputClass } from '../ui';
import type { ProductItem, ProductsData, HeroData } from '../types';
import { ImageUpload } from '@/components/dashboard/ImageUpload';
// ═══════════════════════════════════════════════════════════════════════════
// MAIN PANEL
// ═══════════════════════════════════════════════════════════════════════════

export default React.memo(function RealEstateProductsPanel({
  data,
  onAddCustomProduct,
  onUpdate,
  onRemove,
  heroData,
  onChangeHero,
}: {
  data: ProductsData;
  onAddCustomProduct: () => void;
  onUpdate: (index: number, updates: Partial<ProductItem>) => void;
  onRemove: (id: string) => void;
  heroData?: HeroData;
  onChangeHero?: (updates: Partial<HeroData>) => void;
}) {
  const products = data.products;
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(() => {
    if (products.length > 0) return { [products[0].id]: true };
    return {};
  });
  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8 pb-20">
      <PanelTitle
        icon={Building2}
        label="Residence Layouts"
        meta={`${products.length} configurations`}
        action={
          <button
            onClick={onAddCustomProduct}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 shadow-lg shadow-slate-900/20 bg-slate-900 text-white hover:bg-slate-800"
          >
            <Plus size={14} />
            Add BHK
          </button>
        }
      />

      {/* Residence List */}
      <div className="space-y-4">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 py-16 px-6 text-center">
            <Building2 className="mb-4 text-slate-300" size={40} />
            <p className="text-sm font-black text-slate-500">No residences added</p>
            <p className="mt-1 text-[11px] text-slate-400 max-w-[200px]">Add your BHK configurations to showcase in the funnel.</p>
          </div>
        ) : (
          products.map((product, index) => {
            const isExpanded = expandedItems[product.id];
            const rooms = product.rooms || [];
            return (
              <div key={product.id} className={`group relative rounded-[2rem] border transition-all ${isExpanded ? 'border-slate-300 bg-white shadow-xl' : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'}`}>
                {/* Residence Header */}
                <div className="flex items-center gap-4 p-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-100 shadow-inner bg-slate-50 flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Home size={24} className="text-slate-300" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <input
                      value={product.name}
                      onChange={(e) => onUpdate(index, { name: e.target.value })}
                      className="w-full truncate rounded-md border-0 bg-transparent p-0 text-sm font-black text-slate-900 outline-none focus:ring-0 placeholder:text-slate-300"
                      placeholder="e.g. 3 BHK Signature"
                    />
                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-[10px] font-bold text-emerald-500 tracking-wider">{product.priceLabel}</span>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.dimensions || '—'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconButton label="Delete Residence" onClick={() => onRemove(product.id)}>
                      <Trash2 size={16} className="text-slate-300 hover:text-rose-500" />
                    </IconButton>
                    <button
                      onClick={() => toggleExpand(product.id)}
                      className={`h-8 w-8 flex items-center justify-center rounded-lg transition-colors ${isExpanded ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Residence Details */}
                {isExpanded && (
                  <div className="p-6 pt-0 space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="h-px bg-slate-50 w-full" />

                    {/* Section 1: Identity */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Residence Identity</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Price Label">
                          <input
                            value={product.priceLabel}
                            onChange={(e) => onUpdate(index, { priceLabel: e.target.value })}
                            className={subtleInputClass}
                            placeholder="₹ 6.2 Cr"
                          />
                        </Field>
                        <Field label="Total Area">
                          <input
                            value={product.dimensions || ''}
                            onChange={(e) => onUpdate(index, { dimensions: e.target.value })}
                            className={subtleInputClass}
                            placeholder="1,850 sqft"
                          />
                        </Field>
                      </div>

                      <div>
                        <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Hero Image</label>
                        <ImageUpload
                          defaultImage={product.image}
                          onUploadComplete={(url) => onUpdate(index, { image: url })}
                        />
                      </div>

                      <Field label="Description">
                        <textarea
                          value={product.description ?? ''}
                          onChange={(e) => onUpdate(index, { description: e.target.value })}
                          className={`${subtleInputClass} min-h-[80px] resize-none`}
                          placeholder="Sea-facing living volume with private deck..."
                        />
                      </Field>
                    </div>

                    {/* Section 2: Conversion Hooks */}
                    <div className="space-y-4 rounded-[2rem] bg-amber-50/30 p-5 border border-amber-100/50">
                      <div className="flex items-center gap-2">
                        <Zap size={14} className="text-amber-500 fill-amber-500/20" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-900/60">Conversion Hooks</p>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <Field label="Urgency Badge">
                          <input
                            value={product.urgency}
                            onChange={(e) => onUpdate(index, { urgency: e.target.value })}
                            className={`${subtleInputClass} bg-white border-amber-100/50`}
                            placeholder="3 Units Remaining"
                          />
                        </Field>
                      </div>
                    </div>
                    {/* Section 3: Property Details (Inline WYSIWYG) */}
                    <div className="relative overflow-hidden bg-[#1C1917] rounded-[2rem] p-6 shadow-xl mt-4">
                      {/* Abstract decorative element */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#9A7B44] opacity-10 rounded-bl-full blur-2xl pointer-events-none" />
                      
                      <div className="relative z-10 flex items-center mb-6">
                        <input
                          value={product.propertyDetailsTitle || ''}
                          onChange={(e) => onUpdate(index, { propertyDetailsTitle: e.target.value })}
                          className="text-[10px] tracking-[0.25em] uppercase font-bold text-white/60 bg-transparent border-none p-0 w-full placeholder:text-white/30 outline-none focus:outline-none focus:ring-0"
                          placeholder="PROPERTY DETAILS"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-5 relative z-10">
                        {/* Spec 1 */}
                        <div className="flex items-end justify-between border-b border-white/10 pb-3 gap-4">
                          <input
                            value={product.ownershipLabel || ''}
                            onChange={(e) => onUpdate(index, { ownershipLabel: e.target.value })}
                            className="text-[11px] tracking-wider uppercase text-white/50 font-medium bg-transparent border-none p-0 w-1/3 placeholder:text-white/20 outline-none focus:outline-none focus:ring-0"
                            placeholder="Tenure"
                          />
                          <input
                            value={product.ownership || ''}
                            onChange={(e) => onUpdate(index, { ownership: e.target.value })}
                            className="text-sm font-serif tracking-wide text-white/90 bg-transparent border-none p-0 w-2/3 text-right placeholder:text-white/30 outline-none focus:outline-none focus:ring-0"
                            placeholder="Freehold Estate"
                          />
                        </div>

                        {/* Spec 2 */}
                        <div className="flex items-end justify-between border-b border-white/10 pb-3 gap-4">
                          <input
                            value={product.deliveryLabel || ''}
                            onChange={(e) => onUpdate(index, { deliveryLabel: e.target.value })}
                            className="text-[11px] tracking-wider uppercase text-white/50 font-medium bg-transparent border-none p-0 w-1/3 placeholder:text-white/20 outline-none focus:outline-none focus:ring-0"
                            placeholder="Possession"
                          />
                          <input
                            value={product.delivery || ''}
                            onChange={(e) => onUpdate(index, { delivery: e.target.value })}
                            className="text-sm font-serif tracking-wide text-white/90 bg-transparent border-none p-0 w-2/3 text-right placeholder:text-white/30 outline-none focus:outline-none focus:ring-0"
                            placeholder="Ready to Move"
                          />
                        </div>

                        {/* Spec 3 */}
                        <div className="flex items-end justify-between border-b border-white/10 pb-3 gap-4">
                          <input
                            value={product.automotiveLabel || ''}
                            onChange={(e) => onUpdate(index, { automotiveLabel: e.target.value })}
                            className="text-[11px] tracking-wider uppercase text-white/50 font-medium bg-transparent border-none p-0 w-1/3 placeholder:text-white/20 outline-none focus:outline-none focus:ring-0"
                            placeholder="Parking"
                          />
                          <input
                            value={product.automotive || ''}
                            onChange={(e) => onUpdate(index, { automotive: e.target.value })}
                            className="text-sm font-serif tracking-wide text-white/90 bg-transparent border-none p-0 w-2/3 text-right placeholder:text-white/30 outline-none focus:outline-none focus:ring-0"
                            placeholder="3 Dedicated Spaces"
                          />
                        </div>
                      </div>

                      {/* Inline CTA Editor */}
                      <div className="mt-8 pt-4 border-t border-white/10 relative z-10 flex flex-col gap-2">
                        <span className="text-[9px] tracking-widest uppercase text-white/40 font-bold">Inquiry Button</span>
                        <div className="flex items-center gap-3 w-full bg-black/40 rounded-xl px-4 py-3 border border-white/5">
                          <input
                            value={product.spaceCtaText || ''}
                            onChange={(e) => onUpdate(index, { spaceCtaText: e.target.value })}
                            className="text-xs tracking-[0.2em] uppercase font-bold text-white bg-transparent border-none p-0 w-full placeholder:text-white/30 outline-none focus:outline-none focus:ring-0"
                            placeholder="DISCUSS THIS SPACE"
                          />
                          <span className="text-[#9A7B44]">→</span>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
});
