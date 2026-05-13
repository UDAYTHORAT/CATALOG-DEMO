import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Package, Plus, Trash2, 
  ChevronDown, ChevronUp,
  Clock, Zap, LayoutList, BadgeCheck, X,
  Flame, Star, Diamond, Info
} from 'lucide-react';
import { Field, IconButton, PanelTitle, subtleInputClass, CustomSelect, type SelectOption } from '../ui';
import type { CategoryItem, ProductItem, ProductsData } from '../types';
import type { Product } from '@/app/actions/products';
import { FALLBACK_PRODUCT_IMAGE, formatProductPrice } from '../utils';
import { ImageUpload } from '@/components/dashboard/ImageUpload';

export default React.memo(function ProductsPanel({
  data,
  categories,
  allProducts,
  onAddFromCatalog,
  onAddCustomProduct,
  onUpdate,
  onRemove,
  isWizard,
}: {
  data: ProductsData;
  categories: CategoryItem[];
  allProducts: Product[];
  onAddFromCatalog: (product: Product) => void;
  onAddCustomProduct: () => void;
  onUpdate: (index: number, updates: Partial<ProductItem>) => void;
  onRemove: (id: string) => void;
  isWizard?: boolean;
}) {
  const products = data.products;
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(() => {
    if (products.length > 0) {
      return { [products[0].id]: true };
    }
    return {};
  });

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const productCountsByCategory = React.useMemo(() => {
    return products.reduce((acc, p) => {
      const catId = p.category_id || 'unassigned';
      acc[catId] = (acc[catId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [products]);

  const hasLimitExceeded = Object.values(productCountsByCategory).some(count => count > 3);
  const defaultCatId = categories[0]?.id || 'seating';
  const defaultCatLabel = categories[0]?.label || 'Default';
  const isDefaultCatFull = (productCountsByCategory[defaultCatId] || 0) >= 3;

  const categoryOptions: SelectOption[] = categories.map(cat => ({
    id: cat.id,
    label: cat.label,
    icon: <LayoutList size={12} className="text-slate-400" />
  }));

  const tierOptions: SelectOption[] = [
    { id: '', label: 'Auto (Recommended)', icon: <Info size={12} className="text-slate-400" /> },
    { id: 'best_value', label: 'Best Value', icon: <Flame size={12} className="text-orange-500" /> },
    { id: 'most_popular', label: 'Most Popular', icon: <Star size={12} className="text-amber-500" /> },
    { id: 'premium', label: 'Premium Choice', icon: <Diamond size={12} className="text-blue-500" /> },
  ];

  return (
    <div className="space-y-8 pb-20">
      <PanelTitle
        icon={Package}
        label="Product Showcase"
        meta={`${products.length} curated pieces`}
        action={
          <button
            onClick={onAddCustomProduct}
            disabled={isDefaultCatFull}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 shadow-lg shadow-slate-900/20 ${
              isDefaultCatFull 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200' 
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
            title={isDefaultCatFull ? `${defaultCatLabel} is full (max 3)` : 'Add Custom Product'}
          >
            <Plus size={14} />
            {isDefaultCatFull ? 'Category Full' : 'Add Custom'}
          </button>
        }
      />
      
      {hasLimitExceeded && (
        <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 flex gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-600 shadow-sm">
            <Zap size={16} />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-wider text-amber-900">Decision Fatigue Warning</p>
            <p className="text-[10px] text-amber-700 leading-relaxed mt-0.5">
              One or more collections exceed 3 products. We will display only the <b>Top 3</b> to maximize conversion speed.
            </p>
          </div>
        </div>
      )}

      {/* Catalog Explorer - Simplified */}
      <div className="rounded-[2rem] border border-slate-200 bg-slate-50/30 p-1">
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutList size={14} className="text-slate-400" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Quick-Add Catalog</p>
          </div>
          <span className="rounded-full bg-slate-200/50 px-2.5 py-0.5 text-[9px] font-bold text-slate-500">{allProducts.length} items</span>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto space-y-1 p-2 pt-0 scrollbar-thin">
          {allProducts.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs font-bold text-slate-400 italic">Catalog is empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-1">
              {allProducts.map((product) => {
                const isSelected = products.some(p => p.id === product.id);
                return (
                  <button
                    key={product.id}
                    onClick={() => onAddFromCatalog(product)}
                    disabled={isSelected || isDefaultCatFull}
                    className={`flex items-center gap-3 rounded-xl border p-2 text-left transition-all ${
                      isSelected 
                        ? 'border-transparent bg-slate-100 opacity-40' 
                        : isDefaultCatFull
                        ? 'border-slate-50 bg-slate-50 opacity-50 cursor-not-allowed'
                        : 'border-white bg-white hover:border-slate-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="h-10 w-10 overflow-hidden rounded-lg border border-slate-100 shadow-inner">
                      <img src={product.image_url || FALLBACK_PRODUCT_IMAGE} className="h-full w-full object-cover" alt="" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-bold text-slate-900">{product.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 tracking-wide">{formatProductPrice(product.price)}</p>
                    </div>
                    <div className={`h-6 w-6 flex items-center justify-center rounded-full ${isSelected ? 'text-emerald-500' : isDefaultCatFull ? 'text-slate-300' : 'bg-slate-50 text-slate-400'}`}>
                      {isSelected ? <CheckCircle2 size={14} /> : isDefaultCatFull ? <X size={14} /> : <Plus size={14} />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Selected Showcase List */}
      <div className="space-y-4">
        <div className="px-1 flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Selected Showcase</p>
          <p className="text-[9px] font-bold text-slate-400 italic">(Drag to reorder - coming soon)</p>
        </div>
        
        {products.length === 0 ? (
          <div id="tour-products-empty" className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 py-16 px-6 text-center">
            <Package className="mb-4 text-slate-300" size={40} />
            <p className="text-sm font-black text-slate-500">No pieces selected</p>
            <p className="mt-1 text-[11px] text-slate-400 max-w-[200px]">Select items from your catalog above to populate your funnel.</p>
          </div>
        ) : (
          products.map((product, index) => {
            const isExpanded = expandedItems[product.id];
            return (
              <div key={product.id} className={`group relative rounded-[2rem] border transition-all ${isExpanded ? 'border-slate-300 bg-white shadow-xl' : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'}`}>
                {/* Product Header Row */}
                <div id={index === 0 ? "tour-products-details" : undefined} className="flex items-center gap-4 p-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-100 shadow-inner">
                    <img src={product.image || FALLBACK_PRODUCT_IMAGE} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <input
                      value={product.name}
                      onChange={(event) => onUpdate(index, { name: event.target.value })}
                      className="w-full truncate rounded-md border-0 bg-transparent p-0 text-sm font-black text-slate-900 outline-none focus:ring-0 placeholder:text-slate-300"
                      placeholder="Product Name"
                    />
                    <div className="mt-1 flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                        <span className="text-emerald-500 tracking-wider font-black">{product.priceLabel}</span>
                        <span className="opacity-30">•</span>
                        <span className="uppercase tracking-widest">{categories.find(c => c.id === product.category_id)?.label || 'Furniture'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconButton label="Delete Piece" onClick={() => onRemove(product.id)}>
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

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className="p-6 pt-0 space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    <div className="h-px bg-slate-50 w-full" />
                    
                    {/* Section 1: Storefront Essentials */}
                    <div id={index === 0 ? "tour-products-storefront" : undefined} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Storefront Identity</p>
                        </div>
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Step 1</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Primary Image</label>
                          <ImageUpload
                            defaultImage={product.image}
                            onUploadComplete={(url) => onUpdate(index, { image: url })}
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Secondary Image</label>
                          <ImageUpload
                            defaultImage={product.image2}
                            onUploadComplete={(url) => onUpdate(index, { image2: url })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Price Label">
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">₹</span>
                            <input
                              value={product.priceLabel}
                              onChange={(event) => onUpdate(index, { priceLabel: event.target.value })}
                              className={`${subtleInputClass} pl-7`}
                              placeholder="45,000"
                            />
                          </div>
                        </Field>
                        <Field label="Collection">
                          <CustomSelect
                            value={product.category_id}
                            options={categoryOptions}
                            onChange={(val) => onUpdate(index, { category_id: val })}
                          />
                        </Field>
                      </div>

                      <Field label="Marketing Tier (Badge Strategy)">
                        <CustomSelect
                          value={product.tier || ''}
                          options={tierOptions}
                          onChange={(val) => onUpdate(index, { tier: (val || undefined) as any })}
                        />
                      </Field>
                    </div>

                    {/* Section 2: Conversion Boosters */}
                    <div id={index === 0 ? "tour-products-boosters" : undefined} className="space-y-4 rounded-[2rem] bg-amber-50/30 p-6 border border-amber-100/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap size={14} className="text-amber-500 fill-amber-500/20" />
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-900/60">Conversion Boosters</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Urgency Hook">
                          <div className="relative">
                            <Zap size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500" />
                            <input
                              value={product.urgency}
                              onChange={(event) => onUpdate(index, { urgency: event.target.value })}
                              className={`${subtleInputClass} pl-9 bg-white border-amber-100/50`}
                              placeholder="e.g. Selling fast"
                            />
                          </div>
                        </Field>
                        <Field label="Delivery Promise">
                          <div className="relative">
                            <Clock size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              value={product.delivery}
                              onChange={(event) => onUpdate(index, { delivery: event.target.value })}
                              className={`${subtleInputClass} pl-9 bg-white border-amber-100/50`}
                              placeholder="e.g. 7-10 Days"
                            />
                          </div>
                        </Field>
                      </div>
                    </div>

                    {/* Section 3: Storytelling */}
                    <div id={index === 0 ? "tour-products-narrative" : undefined} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Elite Narrative</p>
                        </div>
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{product.description?.length || 0}/500</span>
                      </div>
                      <textarea
                        value={product.description ?? ''}
                        onChange={(event) => onUpdate(index, { description: event.target.value })}
                        className={`${subtleInputClass} min-h-[140px] leading-relaxed resize-none py-4 bg-white border-slate-200 text-[13px] shadow-sm focus:shadow-md transition-shadow`}
                        placeholder="Describe the handcrafted quality, material story, and factory-direct value proposition..."
                      />
                    </div>

                    {/* Section 4: Premium Specifications */}
                    <div id={index === 0 ? "tour-products-specs" : undefined} className="space-y-5 rounded-[2.5rem] bg-[#1a1c24] p-7 text-white shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rounded-full -mr-16 -mt-16 blur-3xl" />
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2">
                          <LayoutList size={14} className="text-slate-500" />
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Premium Specifications</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-5 relative z-10">
                        <Field label="Dimensions (WxDxH)">
                          <input
                            value={product.dimensions || ''}
                            onChange={(event) => onUpdate(index, { dimensions: event.target.value })}
                            className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-xs font-bold text-white outline-none transition-all focus:border-white/20 focus:bg-white/10 placeholder:text-white/20"
                            placeholder="e.g. 180 x 90 x 75 cm"
                          />
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Primary Material">
                            <input
                              value={product.material || ''}
                              onChange={(event) => onUpdate(index, { material: event.target.value })}
                              className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-xs font-bold text-white outline-none transition-all focus:border-white/20 focus:bg-white/10 placeholder:text-white/20"
                              placeholder="e.g. Sheesham Wood"
                            />
                          </Field>
                          <Field label="Finish Type">
                            <input
                              value={product.finish || ''}
                              onChange={(event) => onUpdate(index, { finish: event.target.value })}
                              className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-xs font-bold text-white outline-none transition-all focus:border-white/20 focus:bg-white/10 placeholder:text-white/20"
                              placeholder="e.g. Walnut Finish"
                            />
                          </Field>
                        </div>
                      </div>
                    </div>

                    {/* Section 5: Benefits */}
                    <div id={index === 0 ? "tour-products-benefits" : undefined} className="space-y-4 rounded-[2.5rem] bg-[#f2fcf5] p-7 border border-emerald-100/50 shadow-inner">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BadgeCheck size={16} className="text-emerald-500" />
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/60">Craftsmanship Benefits</p>
                        </div>
                        <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-widest">Max 3</span>
                      </div>
                      <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                          {(product.benefits || []).map((benefit, bIndex) => (
                            <motion.div 
                              key={bIndex} 
                              layout
                              initial={{ opacity: 0, scale: 0.9, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: -10 }}
                              className="relative flex flex-col gap-2 rounded-2xl bg-white p-5 shadow-sm border border-emerald-100/30 group"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <input
                                  value={benefit.title}
                                  onChange={(e) => {
                                    const newBenefits = [...(product.benefits || [])];
                                    newBenefits[bIndex] = { ...benefit, title: e.target.value };
                                    onUpdate(index, { benefits: newBenefits });
                                  }}
                                  className="w-full border-none bg-transparent p-0 text-[12px] font-black text-slate-900 outline-none focus:ring-0 placeholder:text-slate-300"
                                  placeholder="Benefit Title (e.g. 100% Solid Wood)"
                                />
                              </div>
                              <textarea
                                value={benefit.desc}
                                onChange={(e) => {
                                  const newBenefits = [...(product.benefits || [])];
                                  newBenefits[bIndex] = { ...benefit, desc: e.target.value };
                                  onUpdate(index, { benefits: newBenefits });
                                }}
                                className="w-full border-none bg-transparent p-0 text-[11px] text-slate-500 outline-none focus:ring-0 resize-none h-14 leading-relaxed placeholder:text-slate-300"
                                placeholder="Brief description of this benefit..."
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newBenefits = product.benefits?.filter((_, i) => i !== bIndex);
                                  onUpdate(index, { benefits: newBenefits });
                                }}
                                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-rose-500 shadow-lg border border-slate-100 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 hover:scale-110 active:scale-95"
                              >
                                <X size={14} />
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        
                        {(product.benefits || []).length < 3 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newBenefits = [...(product.benefits || []), { title: '', desc: '' }];
                              onUpdate(index, { benefits: newBenefits });
                            }}
                            className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 py-4 text-[11px] font-black uppercase tracking-widest text-emerald-600 transition-all hover:bg-white hover:border-emerald-400 hover:shadow-md active:scale-[0.98]"
                          >
                            <Plus size={16} />
                            Add Benefit
                          </button>
                        )}
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
