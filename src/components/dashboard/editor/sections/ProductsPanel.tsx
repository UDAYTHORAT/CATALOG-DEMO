import React from 'react';
import { CheckCircle2, Package, Plus, Trash2 } from 'lucide-react';
import { Field, IconButton, PanelTitle, subtleInputClass } from '../ui';
import type { CategoryItem, ProductItem, ProductsData } from '../types';
import type { Product } from '@/app/actions/products';
import { FALLBACK_PRODUCT_IMAGE, formatProductPrice } from '../utils';

export default React.memo(function ProductsPanel({
  data,
  categories,
  allProducts,
  onAddFromCatalog,
  onAddCustomProduct,
  onUpdate,
  onRemove,
}: {
  data: ProductsData;
  categories: CategoryItem[];
  allProducts: Product[];
  onAddFromCatalog: (product: Product) => void;
  onAddCustomProduct: () => void;
  onUpdate: (index: number, updates: Partial<ProductItem>) => void;
  onRemove: (id: string) => void;
}) {
  const products = data.products;

  return (
    <div className="space-y-8">
      <PanelTitle
        icon={Package}
        label="Product Showcase"
        meta={`${products.length} curated pieces`}
        action={
          <button
            onClick={onAddCustomProduct}
            className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-white transition-all hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-900/20"
          >
            <Plus size={14} />
            Add Custom
          </button>
        }
      />

      {/* Catalog Explorer */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Inventory Catalog</p>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">{allProducts.length} items</span>
        </div>
        
        <div className="max-h-[320px] space-y-2 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
          {allProducts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm font-semibold text-slate-400">
              No products in your main catalog.
            </div>
          ) : (
            allProducts.map((product) => {
              const isSelected = products.some(p => p.id === product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => onAddFromCatalog(product)}
                  disabled={isSelected}
                  className={`flex w-full items-center gap-4 rounded-xl border p-2.5 text-left transition-all ${
                    isSelected 
                      ? 'border-slate-100 bg-slate-50 opacity-60 grayscale' 
                      : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="h-12 w-12 overflow-hidden rounded-lg border border-slate-100">
                    <img
                      src={product.image_url || FALLBACK_PRODUCT_IMAGE}
                      className="h-full w-full object-cover"
                      alt=""
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-black text-slate-900">{product.name}</p>
                    <p className="text-[10px] font-bold text-slate-500">{formatProductPrice(product.price)}</p>
                  </div>
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                    isSelected ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Plus size={14} className={isSelected ? 'hidden' : 'block'} />
                    <Package size={14} className={isSelected ? 'block' : 'hidden'} />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Selected Showcase List */}
      <div className="space-y-4">
        <p className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Selected Showcase</p>
        
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-12 px-6 text-center">
            <Package className="mb-3 text-slate-300" size={32} />
            <p className="text-sm font-bold text-slate-400">Your showcase is empty</p>
            <p className="mt-1 text-[11px] text-slate-400">Select items from the catalog above to build your funnel.</p>
          </div>
        ) : (
          products.map((product, index) => (
            <div key={product.id} className="group relative rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-md">
              <div className="mb-5 flex items-start gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-100 shadow-inner">
                  <img src={product.image || FALLBACK_PRODUCT_IMAGE} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center justify-between">
                    <input
                      value={product.name}
                      onChange={(event) => onUpdate(index, { name: event.target.value })}
                      className="w-full truncate rounded-md border-0 bg-transparent p-0 text-sm font-black text-slate-900 outline-none focus:ring-0"
                    />
                    <button
                      onClick={() => onRemove(product.id)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Price Label</p>
                      <input
                        value={product.priceLabel}
                        onChange={(event) => onUpdate(index, { priceLabel: event.target.value })}
                        className={subtleInputClass}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Category</p>
                      <select
                        value={product.category_id}
                        onChange={(event) => onUpdate(index, { category_id: event.target.value })}
                        className={subtleInputClass}
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-50 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Urgency Badge">
                    <input
                      value={product.urgency}
                      onChange={(event) => onUpdate(index, { urgency: event.target.value })}
                      className={subtleInputClass}
                      placeholder="e.g. Selling Fast"
                    />
                  </Field>
                  <Field label="Shipping Promise">
                    <input
                      value={product.delivery}
                      onChange={(event) => onUpdate(index, { delivery: event.target.value })}
                      className={subtleInputClass}
                      placeholder="e.g. 7-10 Days"
                    />
                  </Field>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Elite Product Description</p>
                  <textarea
                    value={product.description ?? `Handcrafted by master artisans in Jodhpur, this ${product.name} combines timeless Sheesham wood durability with modern ergonomics. By cutting out retail middlemen, we deliver this certified factory unit directly to your home at unbeatable value.`}
                    onChange={(event) => onUpdate(index, { description: event.target.value })}
                    className={`${subtleInputClass} min-h-[100px] leading-relaxed resize-none py-3`}
                    placeholder="Describe the craftsmanship, material, and factory-direct value..."
                  />
                </div>

                <div className="space-y-4 rounded-xl bg-slate-50/50 p-4 border border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    Elite Craftsmanship Benefits
                  </p>
                  <div className="space-y-4">
                    {[0, 1, 2].map((bIndex) => {
                      const defaultBenefits = [
                        { title: 'Certified Solid Wood', desc: 'No MDF or particle board. Only premium seasoned Sheesham/Teak.' },
                        { title: 'Factory-Direct Pricing', desc: 'Save up to 40% by avoiding showroom markups.' },
                        { title: 'Customizable Finish', desc: 'WhatsApp us to choose your preferred wood stain.' }
                      ];
                      
                      return (
                        <div key={bIndex} className="space-y-2">
                          <input
                            placeholder={`Benefit ${bIndex + 1} Title`}
                            value={product.benefits?.[bIndex]?.title ?? defaultBenefits[bIndex].title}
                            onChange={(e) => {
                              const newBenefits = [...(product.benefits || defaultBenefits)];
                              newBenefits[bIndex] = { ...newBenefits[bIndex], title: e.target.value };
                              onUpdate(index, { benefits: newBenefits });
                            }}
                            className={`${subtleInputClass} bg-white text-[11px] font-bold`}
                          />
                          <textarea
                            placeholder={`Benefit ${bIndex + 1} Description`}
                            value={product.benefits?.[bIndex]?.desc ?? defaultBenefits[bIndex].desc}
                            onChange={(e) => {
                              const newBenefits = [...(product.benefits || defaultBenefits)];
                              newBenefits[bIndex] = { ...newBenefits[bIndex], desc: e.target.value };
                              onUpdate(index, { benefits: newBenefits });
                            }}
                            className={`${subtleInputClass} bg-white text-[10px] min-h-[60px] resize-none`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});
