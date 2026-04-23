'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS, Product } from '@/data/catalog';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function LiveCatalog() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeMaterial, setActiveMaterial] = useState<string>('All');
  
  const categories = useMemo(() => {
    const cats = new Set(PRODUCTS.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const materials = useMemo(() => {
    const mats = new Set(PRODUCTS.flatMap(p => p.materials));
    return ['All', ...Array.from(mats)];
  }, []);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchMat = activeMaterial === 'All' || p.materials.includes(activeMaterial);
      return matchCat && matchMat;
    });
  }, [activeCategory, activeMaterial]);

  return (
    <section className="py-32 px-8 md:px-20 bg-white" id="collection">
      <div className="max-w-[1600px] mx-auto">
        
        {/* REFINED FILTER SYSTEM */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-gray-100 pb-12">
             <div className="flex flex-col gap-8">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4 block">Filter by Collection</span>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                       <button
                         key={cat}
                         onClick={() => setActiveCategory(cat)}
                         className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm ${activeCategory === cat ? 'bg-black text-white' : 'bg-gray-50 text-gray-400 hover:text-black'}`}
                       >
                         {cat}
                       </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4 block">Materiality</span>
                  <div className="flex flex-wrap gap-2">
                    {materials.map((mat) => (
                       <button
                         key={mat}
                         onClick={() => setActiveMaterial(mat)}
                         className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm ${activeMaterial === mat ? 'bg-black text-white' : 'bg-gray-50 text-gray-400 hover:text-black'}`}
                       >
                         {mat}
                       </button>
                    ))}
                  </div>
                </div>
             </div>
             
             <div className="text-right">
               <p className="text-5xl font-chubbo tracking-tighter leading-none mb-2">{filteredProducts.length}</p>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Artifacts Discovered</p>
             </div>
          </div>
        </div>

        {/* REFINED PRODUCT GRID */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Link href={`/catalog/${product.id}`} className="group block">
                    {/* Image Card - Higher Quality, No Icons */}
                    <div className="aspect-[4/5] bg-gray-50 overflow-hidden mb-8 relative border border-gray-100 transition-colors group-hover:border-black/10">
                      <Image 
                        src={product.images.hero} 
                        alt={product.name} 
                        fill
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute bottom-6 right-6 w-10 h-10 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                        <ChevronRight size={18} />
                      </div>
                    </div>

                    {/* Product Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-gold mb-1 block">{product.category}</span>
                          <h3 className="text-3xl font-chubbo tracking-tighter group-hover:text-gold transition-colors">{product.name}</h3>
                      </div>
                      <p className="text-xl font-chubbo">${product.price}</p>
                    </div>

                    {/* Detail Strip */}
                    <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                       <span>{product.materials[0]}</span>
                       <span className="w-1 h-1 bg-gray-200 rounded-full" />
                       <span>{product.dimensions.length}cm L</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-40 text-center">
            <p className="text-gray-400 font-light">No artifacts found in this sector.</p>
          </div>
        )}
      </div>
    </section>
  );
}
