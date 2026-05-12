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
  const [selectedCategory, setSelectedCategory] = useState<string>('Furniture');
  const [customCategory, setCustomCategory] = useState<string>('');

  useEffect(() => {
    if (product) {
      setImageUrl(product.image_url || '');
      setImageUrl2(product.image_url_2 || '');
      const cat = product.category || 'Furniture';
      const isPredefined = ['Furniture', 'Electronics', 'Apparel', 'Real Estate', 'Services'].includes(cat);
      if (isPredefined) {
        setSelectedCategory(cat);
        setCustomCategory('');
      } else {
        setSelectedCategory('Other');
        setCustomCategory(cat);
      }
    } else {
      setImageUrl('');
      setImageUrl2('');
      setSelectedCategory('Furniture');
      setCustomCategory('');
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

    const category = selectedCategory === 'Other' ? customCategory : selectedCategory;
    formData.set('category', category);

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
                    id="category_select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
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

                {selectedCategory === 'Other' && (
                  <div className="mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Type your collection name..."
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 focus:outline-none transition-all text-sm placeholder:text-slate-300"
                      required
                    />
                  </div>
                )}
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
