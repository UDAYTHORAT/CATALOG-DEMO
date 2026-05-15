'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Trash2, Edit3, Search, Loader2, LayoutGrid, List, Eye } from 'lucide-react';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { ProductModal } from '@/components/dashboard/ProductModal';
import { Product, deleteProduct } from '@/app/actions/products';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

export function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => 
    ['All', ...new Set(initialProducts.map(p => p.category || 'Other'))],
    [initialProducts]
  );

  const filteredProducts = useMemo(() => 
    initialProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || (p.category || 'Other') === selectedCategory;
      return matchesSearch && matchesCategory;
    }),
    [initialProducts, searchQuery, selectedCategory]
  );

  const handleDelete = async (id: string) => {
    if (confirm('Delete this product? This action cannot be undone.')) {
      setDeletingId(id);
      try {
        await deleteProduct(id);
      } catch (err) {
        console.error('Failed to delete:', err);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-counter-up">
      {initialProducts.length === 0 ? (
        <EmptyState
          icon={<Package size={28} />}
          title="No products yet"
          description="Add your first product to start building high-converting discovery funnels."
          action={
            <button 
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-black uppercase tracking-wider rounded-2xl hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/30 active:scale-95"
            >
              <Plus size={18} strokeWidth={3} />
              Add First Product
            </button>
          }
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Products</h1>
              <p className="text-base text-slate-500 font-medium mt-1">{filteredProducts.length} of {initialProducts.length} products</p>
            </div>
            <button 
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-black uppercase tracking-wider rounded-2xl hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 active:scale-95"
            >
              <Plus size={18} strokeWidth={3} />
              Add Product
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 bg-white rounded-[2rem] border border-slate-100 p-4 shadow-xl shadow-slate-200/40">
            {/* Category filter */}
            <div className="flex bg-slate-50 p-1.5 rounded-xl overflow-x-auto no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                    selectedCategory === cat 
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-100' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 rounded-xl outline-none text-sm text-slate-900 font-medium placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-200 border border-transparent transition-all"
              />
            </div>
          </div>

          {/* Product Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-[2rem] overflow-hidden flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 shadow-lg shadow-slate-200/30"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
                    <img 
                      src={product.image_url || '/placeholder.png'} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Hover actions */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-xl text-slate-600 hover:text-indigo-600 shadow-lg transition-all hover:scale-110 active:scale-95"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-xl text-slate-600 hover:text-red-500 shadow-lg transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
                      >
                        {deletingId === product.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    </div>

                    {/* Category badge */}
                    <div className="absolute bottom-4 left-4 opacity-100 group-hover:opacity-100 transition-opacity">
                      <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-slate-700 rounded-xl shadow-sm border border-white/50">
                        {product.category || 'Other'}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-black text-slate-900 text-sm mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors tracking-tight">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-auto">
                      <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{formatPrice(product.price)}</span>
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1"
                      >
                        <Eye size={12} />
                        View
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredProducts.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                  <Search size={24} className="text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-400 mb-3">No products match your search</p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} 
                  className="text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-wider"
                >
                  Clear filters
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }} 
        product={editingProduct}
      />
    </div>
  );
}
