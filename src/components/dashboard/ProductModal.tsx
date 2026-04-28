'use client';

import { useEffect, useState, useCallback } from 'react';
import { X, Loader2, Plus, ArrowRight, Edit3 } from 'lucide-react';
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
  const [description, setDescription] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (product) {
      setImageUrl(product.image_url || '');
      setImageUrl2(product.image_url_2 || '');
      setDescription(product.description || '');
    } else {
      setImageUrl('');
      setImageUrl2('');
      setDescription('');
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

  const MAX_DESC = 500;

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
          <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar max-h-[60vh]">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}

            {/* Image uploads */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-indigo-500" />
                  Primary Image
                </label>
                <ImageUpload onUploadComplete={setImageUrl} defaultImage={imageUrl} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-indigo-500" />
                  Detail Image
                </label>
                <ImageUpload onUploadComplete={setImageUrl2} defaultImage={imageUrl2} />
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-semibold text-slate-500">
                Product Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={product?.name}
                required
                placeholder="e.g. Minimalist Oak Workbench"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all text-sm"
              />
            </div>

            {/* Price + Category */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="price" className="text-xs font-semibold text-slate-500">
                  Price (INR) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  defaultValue={product?.price}
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="text-xs font-semibold text-slate-500">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  defaultValue={product?.category || 'Furniture'}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all appearance-none cursor-pointer text-sm"
                >
                  <option value="Furniture">Furniture</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Services">Services</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Dimensions */}
            <div className="space-y-2">
              <label htmlFor="dimensions" className="text-xs font-semibold text-slate-500">
                Dimensions
              </label>
              <input
                type="text"
                id="dimensions"
                name="dimensions"
                defaultValue={product?.dimensions || ''}
                placeholder="e.g. 180cm x 85cm x 75cm"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all text-sm"
              />
            </div>

            {/* Description with character count */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="description" className="text-xs font-semibold text-slate-500">
                  Description
                </label>
                <span className={`text-[10px] font-medium ${
                  description.length > MAX_DESC * 0.9 ? 'text-amber-500' : 'text-slate-300'
                }`}>
                  {description.length}/{MAX_DESC}
                </span>
              </div>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESC))}
                rows={3}
                maxLength={MAX_DESC}
                placeholder="Describe this product..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all resize-none text-sm"
              />
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
