'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Trash2, Edit3, Search, Loader2, MoreHorizontal } from 'lucide-react';
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
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description?.toLowerCase().includes(searchQuery.toLowerCase());
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
    <div className="space-y-6 animate-counter-up">
      {initialProducts.length === 0 ? (
        <EmptyState
          icon={<Package size={28} />}
          title="No products yet"
          description="Add your first product to start building high-converting discovery funnels."
          action={
            <button 
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
            >
              <Plus size={16} />
              Add First Product
            </button>
          }
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Products</h1>
              <p className="text-sm text-slate-400 mt-1">{filteredProducts.length} of {initialProducts.length} products</p>
            </div>
            <button 
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
            >
              <Plus size={16} />
              Add Product
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 bg-white rounded-[1.5rem] border border-slate-100 p-3">
            {/* Category filter */}
            <div className="flex bg-slate-50 p-1 rounded-xl overflow-x-auto no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === cat 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl outline-none text-sm text-slate-900 font-medium placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all"
              />
            </div>
          </div>

          {/* Product Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
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
                  className="bg-white rounded-2xl overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300 border border-slate-100"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
                    <img 
                      src={product.image_url || '/placeholder.png'} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Hover actions */}
                    <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-slate-600 hover:text-indigo-600 shadow-md transition-colors"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-slate-600 hover:text-red-500 shadow-md transition-colors disabled:opacity-50"
                      >
                        {deletingId === product.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    </div>

                    {/* Category badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-slate-700 rounded-md shadow-sm">
                        {product.category || 'Other'}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-slate-900 text-sm mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 flex-1 mb-3">
                      {product.description || 'No description added'}
                    </p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <span className="text-sm font-bold text-indigo-600">{formatPrice(product.price)}</span>
                      <span className="text-[10px] text-slate-300 font-medium">
                        {product.dimensions || '—'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredProducts.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-sm text-slate-400 mb-3">No products match your search</p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} 
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
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
