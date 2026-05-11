'use client';

import { useEffect, useState, useCallback } from 'react';
import { X, Loader2, Plus, ArrowRight, Edit3, ChevronDown, Zap, LayoutList } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { createProduct, updateProduct, Product } from '@/app/actions/products';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageUrl2, setImageUrl2] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (product) {
      setImageUrl(product.image_url || '');
      setImageUrl2(product.image_url_2 || '');
      setImageUrl2(product.image_url_2 || '');
    } else {
      setImageUrl('');
      setImageUrl2('');
    }
  }, [product, isOpen]);

  // Escape key to close
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) onClose();
  }, [isOpen, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [handleEscape]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Basic validation with shake
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const price = formData.get('price') as string;

    if (!name?.trim() || !price) {
      setShake(true);
      setError('Please fill in the required fields.');
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsSubmitting(true);

    formData.append('image_url', imageUrl);
    formData.append('image_url_2', imageUrl2);

    // Package story_mode_data
    const storyModeData = {
      ...(product?.story_mode_data || {}),
      urgency: formData.get('urgency'),
      delivery: formData.get('delivery'),
      material: formData.get('material'),
      finish: formData.get('finish'),
    };
    formData.append('story_mode_data', JSON.stringify(storyModeData));

    let result;
    if (product) {
      result = await updateProduct(product.id, formData);
    } else {
      result = await createProduct(formData);
    }

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      onClose();
    }
  };


  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] transition-opacity"
        onClick={onClose}
      />
      
      <div 
        className={`fixed inset-x-4 top-[5%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-white shadow-2xl z-[101] rounded-2xl flex flex-col overflow-hidden animate-counter-up border border-slate-200 ${
          shake ? 'animate-[shake_0.4s_ease-in-out]' : ''
        }`}
        style={shake ? { animation: 'shake 0.4s ease-in-out' } : undefined}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                {product ? <Edit3 size={20} /> : <Plus size={20} />}
             </div>
             <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {product ? 'Edit Product' : 'Add Product'}
                </h2>
                <p className="text-xs text-slate-400">
                  {product ? `ID: ${product.id.slice(0,8)}...` : 'Create a new product entry'}
                </p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar max-h-[75vh]">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                {error}
              </div>
            )}

            {/* Image uploads */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Primary Image
                </label>
                <ImageUpload onUploadComplete={setImageUrl} defaultImage={imageUrl} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                  Detail View
                </label>
                <ImageUpload onUploadComplete={setImageUrl2} defaultImage={imageUrl2} />
              </div>
            </div>

            {/* Name */}
            <div className="space-y-3">
              <label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                Product Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={product?.name}
                required
                placeholder="e.g. Minimalist Oak Workbench"
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 focus:outline-none transition-all text-sm placeholder:text-slate-300"
              />
            </div>

            {/* Price + Category */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label htmlFor="price" className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                  Price (INR) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-300">₹</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    defaultValue={product?.price}
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    className="w-full pl-9 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 focus:outline-none transition-all text-sm placeholder:text-slate-300"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label htmlFor="category" className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                  Collection
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    defaultValue={product?.category || 'Furniture'}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 focus:outline-none transition-all appearance-none cursor-pointer text-sm"
                  >
                    <option value="Furniture">Furniture</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Services">Services</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label htmlFor="description" className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center justify-between">
                <span>Elite Narrative</span>
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Storytelling</span>
              </label>
              <textarea
                id="description"
                name="description"
                defaultValue={product?.description || ''}
                rows={4}
                placeholder="Describe the handcrafted quality, material story, and factory-direct value proposition..."
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 focus:outline-none transition-all text-sm resize-none leading-relaxed placeholder:text-slate-300 shadow-inner"
              />
            </div>

            {/* Conversion Boosters */}
            <div className="p-8 rounded-[2rem] bg-amber-50/50 border border-amber-100 space-y-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-amber-500 fill-amber-500/20" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-900/60">Conversion Boosters</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="urgency" className="text-[10px] font-bold text-amber-900/40 uppercase tracking-wider">Urgency Hook</label>
                  <input
                    type="text"
                    id="urgency"
                    name="urgency"
                    defaultValue={product?.story_mode_data?.urgency || 'Limited Stock'}
                    placeholder="e.g. Selling fast"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-amber-200 text-amber-900 font-black focus:outline-none focus:ring-4 focus:ring-amber-500/10 text-xs shadow-sm transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="delivery" className="text-[10px] font-bold text-amber-900/40 uppercase tracking-wider">Delivery Promise</label>
                  <input
                    type="text"
                    id="delivery"
                    name="delivery"
                    defaultValue={product?.story_mode_data?.delivery || '7-11 Days'}
                    placeholder="e.g. 7-10 Days"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-amber-200 text-amber-900 font-black focus:outline-none focus:ring-4 focus:ring-amber-500/10 text-xs shadow-sm transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Technical Specs */}
            <div className="p-8 rounded-[2.5rem] bg-[#1a1c24] text-white space-y-6 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rounded-full -mr-16 -mt-16 blur-3xl" />
               <div className="flex items-center gap-2 relative z-10">
                <LayoutList size={16} className="text-slate-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Technical Specs</p>
              </div>
              <div className="space-y-3 relative z-10">
                <label htmlFor="dimensions" className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-500/80 flex items-center gap-2 whitespace-nowrap">
                  <div className="w-1 h-1 rounded-full bg-slate-500" />
                  Dimensions (WxDxH)
                </label>
                <input
                  type="text"
                  id="dimensions"
                  name="dimensions"
                  defaultValue={product?.dimensions || ''}
                  placeholder="e.g. 180 x 90 x 75 cm"
                  className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white font-bold focus:outline-none focus:bg-white/[0.06] focus:border-indigo-500/50 text-sm transition-all placeholder:text-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 relative z-10">
                <div className="space-y-3">
                  <label htmlFor="material" className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-500/80 flex items-center gap-2 whitespace-nowrap">
                    <div className="w-1 h-1 rounded-full bg-slate-500" />
                    Primary Material
                  </label>
                  <input
                    type="text"
                    id="material"
                    name="material"
                    defaultValue={product?.story_mode_data?.material || ''}
                    placeholder="e.g. Sheesham Wood"
                    className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white font-bold focus:outline-none focus:bg-white/[0.06] focus:border-indigo-500/50 text-sm transition-all placeholder:text-white/10"
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="finish" className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-500/80 flex items-center gap-2 whitespace-nowrap">
                    <div className="w-1 h-1 rounded-full bg-slate-500" />
                    Finish Type
                  </label>
                  <input
                    type="text"
                    id="finish"
                    name="finish"
                    defaultValue={product?.story_mode_data?.finish || ''}
                    placeholder="e.g. Walnut Finish"
                    className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white font-bold focus:outline-none focus:bg-white/[0.06] focus:border-indigo-500/50 text-sm transition-all placeholder:text-white/10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {product ? 'Save Changes' : 'Create Product'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
