import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UtensilsCrossed, Plus, Trash2,
  ChevronDown, ChevronUp,
  Sparkles, Star, X, CheckCircle2,
} from 'lucide-react';
import { subtleInputClass } from '../ui';
import type { CategoryItem, ProductItem, ProductsData } from '../types';
import type { Product } from '@/app/actions/products';
import { FALLBACK_PRODUCT_IMAGE, formatProductPrice } from '../utils';
import { ImageUpload } from '@/components/dashboard/ImageUpload';

export default React.memo(function CafeMenuPanel({
  data,
  categories,
  allProducts,
  onAddFromCatalog,
  onAddCustomProduct,
  onRemove,
  onUpdate,
}: {
  data: ProductsData;
  categories: CategoryItem[];
  allProducts: Product[];
  onAddFromCatalog: (product: Product) => void;
  onAddCustomProduct: () => void;
  onRemove: (id: string) => void;
  onUpdate: (index: number, updates: Partial<ProductItem>) => void;
}) {
  const products = data.products;
  const [expandedId, setExpandedId] = useState<string | null>(
    products.length > 0 ? products[0].id : null
  );

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 pb-20">
      {/* ── Header ── */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3A2211] text-[#F4F0EB] shadow-lg shadow-[#3A2211]/20">
            <UtensilsCrossed size={20} />
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight text-slate-900">Specialities</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {products.length}/3 signature dish{products.length !== 1 ? 'es' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={onAddCustomProduct}
          disabled={products.length >= 3}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] transition-all shadow-lg active:scale-95 ${
            products.length >= 3
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-[#3A2211] text-[#F4F0EB] hover:bg-[#2a180b] shadow-[#3A2211]/20'
          }`}
        >
          <Plus size={14} />
          {products.length >= 3 ? 'Limit Reached' : 'Add Dish'}
        </button>
      </div>

      {/* ── Section Text ── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Section Text</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-0.5">Kicker</span>
              <input
                value={data.preTitle ?? 'Our Signature'}
                onChange={(e) => onUpdate(-1, { preTitle: e.target.value } as any)}
                placeholder="e.g. Our Signature"
                className={subtleInputClass}
              />
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-0.5">Main Heading</span>
              <input
                value={data.title ?? 'Must try'}
                onChange={(e) => onUpdate(-1, { title: e.target.value } as any)}
                placeholder="e.g. Must try"
                className={subtleInputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick-Add from Catalog ── */}
      {allProducts.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/30 overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles size={13} className="text-amber-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Quick-Add from Catalog
              </p>
            </div>
            <span className="rounded-full bg-slate-200/50 px-2.5 py-0.5 text-[9px] font-bold text-slate-500">
              {allProducts.length} items
            </span>
          </div>
          <div className="max-h-[200px] overflow-y-auto p-2 scrollbar-thin">
            <div className="grid grid-cols-1 gap-1">
              {allProducts.map((product) => {
                const isSelected = products.some(p => p.id === product.id);
                return (
                  <button
                    key={product.id}
                    onClick={() => onAddFromCatalog(product)}
                    disabled={isSelected || products.length >= 3}
                    className={`flex items-center gap-3 rounded-xl border p-2 text-left transition-all ${
                      isSelected
                        ? 'border-transparent bg-slate-100 opacity-40'
                        : products.length >= 3
                        ? 'border-slate-50 bg-slate-50 opacity-50 cursor-not-allowed'
                        : 'border-white bg-white hover:border-slate-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="h-10 w-10 overflow-hidden rounded-lg border border-slate-100 shadow-inner shrink-0">
                      <img src={product.image_url || FALLBACK_PRODUCT_IMAGE} className="h-full w-full object-cover" alt="" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-bold text-slate-900">{product.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 tracking-wide">{formatProductPrice(product.price, true)}</p>
                    </div>
                    <div className={`h-6 w-6 flex items-center justify-center rounded-full ${isSelected ? 'text-emerald-500' : 'bg-slate-50 text-slate-400'}`}>
                      {isSelected ? <CheckCircle2 size={14} /> : <Plus size={14} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Menu Items List ── */}
      <div className="space-y-3">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
          Specialities ({products.length}/3)
        </p>

        {products.length === 0 ? (
          <div id="tour-products-empty" className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-14 px-6 text-center">
            <UtensilsCrossed className="mb-4 text-slate-300" size={36} />
            <p className="text-sm font-black text-slate-500">No dishes yet</p>
            <p className="mt-1 text-[11px] text-slate-400 max-w-[220px]">
              Add your signature dishes to showcase on your cafe page.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {products.map((product, index) => {
              const isExpanded = expandedId === product.id;

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isExpanded
                      ? 'border-[#3A2211]/20 bg-white shadow-xl'
                      : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                  }`}
                >
                  {/* ── Collapsed Row ── */}
                  <div
                    id={index === 0 ? "tour-products-details" : undefined}
                    className="flex items-center gap-3 p-3 cursor-pointer"
                    onClick={() => toggleExpand(product.id)}
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-100 shadow-inner flex items-center justify-center bg-slate-50">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UtensilsCrossed size={20} className="text-slate-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-900">{product.name || 'Untitled Dish'}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-[10px]">
                        <span className="font-black text-[#D94A4A]">{product.priceLabel || '—'}</span>
                        {product.tier === 'most_popular' && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="flex items-center gap-0.5 text-amber-500 font-black">
                              <Star size={9} className="fill-amber-500" /> Best Seller
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); onRemove(product.id); }}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className={`h-8 w-8 flex items-center justify-center rounded-lg transition-colors ${isExpanded ? 'bg-[#3A2211] text-white' : 'bg-slate-50 text-slate-400'}`}>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </div>
                    </div>
                  </div>

                  {/* ── Expanded Detail ── */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-5 space-y-5">
                          <div className="h-px bg-slate-100" />

                          {/* ── Compact Form Layout ── */}
                          <div id={index === 0 ? "tour-products-storefront" : undefined} className="flex flex-col sm:flex-row gap-4">
                            {/* Photo Column */}
                            <div className="w-full sm:w-[120px] shrink-0">
                              <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-0.5">
                                Photo
                              </span>
                              <ImageUpload
                                defaultImage={product.image}
                                onUploadComplete={(url) => onUpdate(index, { image: url })}
                              />
                            </div>

                            {/* Inputs Column */}
                            <div className="flex-1 space-y-3">
                              <div>
                                <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-0.5">
                                  Dish Name
                                </span>
                                <input
                                  value={product.name}
                                  onChange={(e) => onUpdate(index, { name: e.target.value })}
                                  className={subtleInputClass}
                                  placeholder="e.g. Iced Caramel Latte"
                                />
                              </div>

                              <div>
                                <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-0.5">
                                  Price
                                </span>
                                <input
                                  value={product.priceLabel}
                                  onChange={(e) => onUpdate(index, { priceLabel: e.target.value })}
                                  className={subtleInputClass}
                                  placeholder="e.g. $4.50"
                                />
                              </div>
                            </div>
                          </div>

                          {/* ── Description ── */}
                          <div id={index === 0 ? "tour-products-narrative" : undefined}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-0.5">
                                Description
                              </span>
                              <span className="text-[10px] font-medium text-slate-300">
                                {(product.description || '').length}/150
                              </span>
                            </div>
                            <textarea
                              value={product.description ?? ''}
                              onChange={(e) => onUpdate(index, { description: e.target.value })}
                              maxLength={150}
                              className={`${subtleInputClass} min-h-[70px] resize-none py-3 leading-relaxed`}
                              placeholder="e.g. Smooth espresso, steamed milk, and sea salt caramel."
                            />
                          </div>

                          {/* ── Best Seller Toggle ── */}
                          <div id={index === 0 ? "tour-products-boosters" : undefined} className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdate(index, {
                                  tier: product.tier === 'most_popular' ? undefined : 'most_popular',
                                })
                              }
                              className="flex items-center gap-3 w-full text-left"
                            >
                              <div
                                className={`h-9 w-9 flex items-center justify-center rounded-xl transition-all ${
                                  product.tier === 'most_popular'
                                    ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                                    : 'bg-amber-100 text-amber-400'
                                }`}
                              >
                                <Star size={16} className={product.tier === 'most_popular' ? 'fill-white' : ''} />
                              </div>
                              <div className="flex-1">
                                <p className="text-[11px] font-black text-slate-800">Best Seller Badge</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  Highlights this dish with a &quot;Best Seller&quot; tag on the live page.
                                </p>
                              </div>
                              <div
                                className={`h-6 w-11 rounded-full relative transition-colors ${
                                  product.tier === 'most_popular' ? 'bg-amber-500' : 'bg-slate-200'
                                }`}
                              >
                                <div
                                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                                    product.tier === 'most_popular' ? 'left-[22px]' : 'left-0.5'
                                  }`}
                                />
                              </div>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
});
