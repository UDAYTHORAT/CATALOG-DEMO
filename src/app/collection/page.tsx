'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { PRODUCTS, CATEGORIES, Product } from '@/data/catalog';
import Link from 'next/link';
import Header from '@/components/Header';
import ImageGallery from '@/components/ui/image-gallery';
import DemoGallery from '@/components/ui/demo';
import { ChevronRight, Filter, Grid3X3, Layers, Play, Pause, ChevronLeft, Eye, ArrowRight, X } from 'lucide-react';

/* ── CATEGORY IMAGE MAP ── */
const CATEGORY_IMAGES: Record<string, string> = {
  'Sofas': '/sofa/full-sofa.jpeg',
  'Dining': '/dining table/full dining table.jpeg',
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Sofas': 'Sculptural comfort for the modern sanctuary',
  'Dining': 'Where craft meets conversation',
};

/* ═══════════════════════════════════════
   STORY MODE COMPONENT
   ═══════════════════════════════════════ */
function StoryMode({ products, onClose }: { products: Product[]; onClose: () => void }) {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const product = products[current];

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setCurrent(p => (p + 1) % products.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [playing, products.length]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black"
    >
      {/* Background image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={product.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image 
            src={product.images.hero} 
            alt={product.name} 
            fill
            priority
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Top controls */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-start p-6 md:p-12">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Story Mode</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setPlaying(p => !p)} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all">
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button onClick={onClose} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={product.id + '-content'}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-0 left-0 right-0 p-6 md:p-16 z-10"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold mb-2 md:mb-4 block">{product.category}</span>
          <h2 className="text-4xl md:text-8xl font-chubbo text-white tracking-tighter leading-none mb-3 md:mb-4">{product.name}</h2>
          <p className="text-white/50 text-xs md:text-lg font-light max-w-lg mb-6 line-clamp-3 md:line-clamp-none">{product.description}</p>
          <div className="flex items-center gap-6">
            <span className="text-xl md:text-2xl font-chubbo text-white">${product.price.toLocaleString()}</span>
            <Link href={`/catalog/${product.id}`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gold hover:text-white transition-colors">
              Explore <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots + progress */}
      <div className="absolute bottom-6 md:bottom-16 right-6 md:right-16 flex items-center gap-3 z-10">
        {products.map((p, i) => (
          <button key={p.id} onClick={() => setCurrent(i)} className="relative">
            <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-500 ${i === current ? 'bg-gold w-6 md:w-8' : 'bg-white/20 hover:bg-white/40'}`} />
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-10">
        <motion.div
          key={current}
          initial={{ width: '0%' }}
          animate={{ width: playing ? '100%' : undefined }}
          transition={{ duration: 5, ease: 'linear' }}
          className="h-full bg-gold"
        />
      </div>

      {/* Arrows - Hidden on very small screens to avoid clutter, accessible via dots */}
      <div className="absolute inset-y-0 left-4 hidden md:flex items-center z-10">
        <button onClick={() => setCurrent(p => (p - 1 + products.length) % products.length)} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
          <ChevronLeft size={20} />
        </button>
      </div>
      <div className="absolute inset-y-0 right-4 hidden md:flex items-center z-10">
        <button onClick={() => setCurrent(p => (p + 1) % products.length)} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
          <ChevronRight size={20} />
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   MAIN COLLECTION PAGE
   ═══════════════════════════════════════ */
export default function CollectionPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'gallery'>('grid');
  const [showStory, setShowStory] = useState(false);
  const [storyProducts, setStoryProducts] = useState<Product[]>(PRODUCTS);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const launchStory = (category?: string) => {
    const prods = category ? PRODUCTS.filter(p => p.category === category) : PRODUCTS;
    setStoryProducts(prods);
    setShowStory(true);
  };

  const galleryImages = filteredProducts.map(p => ({
    src: p.images.hero,
    alt: p.name,
  }));

  const demoImages = filteredProducts.map(p => ({
    src: p.images.hero,
    alt: p.name,
    title: p.name,
    href: `/catalog/${p.id}`,
  }));

  return (
    <main className="bg-white min-h-screen font-chubbo selection:bg-gold/20">
      <Header />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 px-6 md:px-20 bg-obsidian overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/images/living-room.png" 
            alt="Collection" 
            fill
            priority
            className="object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-obsidian/80 to-obsidian" />
        </div>
        <div className="relative max-w-[1600px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gold mb-6 block">The Complete Archive</span>
            <h1 className="text-6xl md:text-[8vw] font-chubbo text-white tracking-tighter leading-[0.9] mb-6">
              Our Collection
            </h1>
            <p className="text-white/40 text-sm md:text-lg font-light max-w-xl mb-10">
              Browse by category, explore in story mode, or discover every artifact in our grid. Each piece is a testament to intentional craft.
            </p>
            <button
              onClick={() => launchStory()}
              className="inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-gold text-obsidian text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all active:scale-[0.98]"
            >
              <Play size={14} /> Launch Story Mode
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORY CARDS ── */}
      <section className="py-20 md:py-32 px-6 md:px-20">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-end justify-between mb-12 md:mb-16 border-b border-gray-100 pb-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-3 block">Browse by Category</span>
              <h2 className="text-3xl md:text-5xl font-chubbo tracking-tighter">Find Your Piece</h2>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">{CATEGORIES.length} Categories</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, idx) => {
              const count = PRODUCTS.filter(p => p.category === cat).length;
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="group relative overflow-hidden cursor-pointer"
                  onClick={() => {
                    setActiveCategory(cat);
                    document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <div className="aspect-[4/5] overflow-hidden bg-gray-50">
                    <img
                      src={CATEGORY_IMAGES[cat] || '/images/living-room.png'}
                      alt={cat}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-2 block">{count} {count === 1 ? 'Piece' : 'Pieces'}</span>
                    <h3 className="text-2xl md:text-3xl font-chubbo text-white tracking-tight mb-2">{cat}</h3>
                    <p className="text-white/50 text-xs font-light">{CATEGORY_DESCRIPTIONS[cat]}</p>
                  </div>
                  {/* Story mode quick-launch */}
                  <button
                    onClick={(e) => { e.stopPropagation(); launchStory(cat); }}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-gold hover:text-obsidian"
                    title={`Story mode: ${cat}`}
                  >
                    <Play size={14} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── EXPANDING GALLERY ── */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <ImageGallery
          title="Visual Archive"
          subtitle="Hover to explore — each frame reveals a different facet of the Aurelian collection."
          images={PRODUCTS.slice(0, 6).map(p => ({ src: p.images.hero, alt: p.name }))}
        />
      </section>

      {/* ── PRODUCT GRID ── */}
      <section id="product-grid" className="py-20 md:py-32 px-6 md:px-20 scroll-mt-24">
        <div className="max-w-[1600px] mx-auto">
          {/* Filter bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 md:mb-16 border-b border-gray-100 pb-8">
            <div className="w-full md:w-auto">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4 flex items-center">
                <Filter size={12} className="mr-2" />Filter Collection
              </span>
              <div className="flex overflow-x-auto pb-4 md:pb-0 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0 gap-2">
                <button
                  onClick={() => setActiveCategory('All')}
                  className={`flex-shrink-0 px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm ${activeCategory === 'All' ? 'bg-black text-white' : 'bg-gray-50 text-gray-400 hover:text-black'}`}
                >
                  All
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex-shrink-0 px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm ${activeCategory === cat ? 'bg-black text-white' : 'bg-gray-50 text-gray-400 hover:text-black'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between w-full md:w-auto gap-4">
              <div className="flex border border-gray-200 rounded-sm overflow-hidden">
                <button onClick={() => setViewMode('grid')} className={`p-2.5 transition-all ${viewMode === 'grid' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}>
                  <Grid3X3 size={16} />
                </button>
                <button onClick={() => setViewMode('gallery')} className={`p-2.5 transition-all ${viewMode === 'gallery' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}>
                  <Layers size={16} />
                </button>
              </div>
              <div className="text-right">
                <p className="text-2xl md:text-3xl font-chubbo tracking-tighter leading-none">{filteredProducts.length}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Results</p>
              </div>
            </div>
          </div>

          {/* Grid view */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-12">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Link href={`/catalog/${product.id}`} className="group block">
                      <div className="aspect-[3/4] md:aspect-[4/5] bg-gray-50 overflow-hidden mb-3 md:mb-5 relative border border-gray-100 transition-colors group-hover:border-black/10">
                        <img src={product.images.hero} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute bottom-4 right-4 w-9 h-9 bg-white hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                          <ChevronRight size={16} />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row justify-between items-start mb-1 md:mb-2">
                        <div>
                          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gold mb-0.5 md:mb-1 block">{product.category}</span>
                          <h3 className="text-sm md:text-xl font-chubbo tracking-tighter group-hover:text-gold transition-colors">{product.name}</h3>
                        </div>
                        <p className="text-sm md:text-lg font-chubbo">${product.price.toLocaleString()}</p>
                      </div>
                      <div className="hidden md:flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        <span>{product.materials[0]}</span>
                        <span className="w-1 h-1 bg-gray-200 rounded-full" />
                        <span>{product.dimensions.length}cm</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            /* Gallery view — using DemoGallery component */
            <DemoGallery
              title={activeCategory === 'All' ? 'Complete Collection' : activeCategory}
              subtitle={activeCategory === 'All' ? 'Every artifact in the Aurelian archive' : CATEGORY_DESCRIPTIONS[activeCategory] || ''}
              images={demoImages}
            />
          )}
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="py-24 md:py-36 bg-obsidian text-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gold mb-6 block">The Journey Continues</span>
          <h2 className="text-4xl md:text-6xl font-chubbo text-white tracking-tighter mb-6">Ready to find yours?</h2>
          <p className="text-white/30 text-sm max-w-md mx-auto mb-10">Each piece is made to order. Begin your journey with a private consultation.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/catalog" className="px-12 py-5 bg-gold text-obsidian text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all">
              Enter the Archive
            </Link>
            <button onClick={() => launchStory()} className="px-12 py-5 border border-white/20 text-white text-[11px] font-black uppercase tracking-[0.3em] hover:border-gold hover:text-gold transition-all flex items-center gap-3">
              <Play size={14} /> Story Mode
            </button>
          </div>
        </motion.div>
      </section>

      {/* STORY MODE OVERLAY */}
      <AnimatePresence>
        {showStory && <StoryMode products={storyProducts} onClose={() => setShowStory(false)} />}
      </AnimatePresence>
    </main>
  );
}
