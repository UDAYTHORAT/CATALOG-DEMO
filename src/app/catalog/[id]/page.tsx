'use client';

import Header from '@/components/Header';
import { PRODUCTS } from '@/data/catalog';
import { ChevronLeft, X, Check } from 'lucide-react';
import Link from 'next/link';
import { use, useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import EnquireModal from '@/components/EnquireModal';

/* ─────────────────────────────────────────────
   LIGHTBOX — Full-screen image viewer
   ───────────────────────────────────────────── */
const Lightbox = ({ image, onClose }: { image: string; onClose: () => void }) => {
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
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
      onClick={onClose}
    >
      <button className="absolute top-4 right-4 md:top-8 md:right-8 text-white/30 hover:text-white transition-colors">
        <X size={28} />
      </button>
      <motion.img
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        src={image}
        alt="Full view"
        className="max-w-full max-h-full object-contain"
      />
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   STORY IMAGE COMPONENT — Reusable image block
   ───────────────────────────────────────────── */
const StoryImage = ({ src, alt, caption, onClick, delay = 0, aspect = "aspect-[4/5]" }: { src: string, alt: string, caption?: string, onClick: () => void, delay?: number, aspect?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className="group cursor-pointer w-full flex flex-col"
    onClick={onClick}
  >
    <div className={`w-full overflow-hidden bg-neutral-100 ${aspect}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
        draggable={false}
      />
    </div>
    {caption && (
      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400 group-hover:text-black transition-colors">
        {caption}
      </p>
    )}
  </motion.div>
);

/* ─────────────────────────────────────────────
   PRODUCT PAGE
   ───────────────────────────────────────────── */
export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = useMemo(() => PRODUCTS.find(p => p.id === id) || PRODUCTS[0], [id]);

  const [activeImage, setActiveImage] = useState(product.images.gallery[0]);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showEnquire, setShowEnquire] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Smooth zoom-follow on hover
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { damping: 30, stiffness: 150 });
  const sy = useSpring(my, { damping: 30, stiffness: 150 });
  const scale = useSpring(isHovering ? 1.6 : 1, { damping: 25, stiffness: 120 });
  const tx = useTransform(sx, [0, 1], [24, -24]);
  const ty = useTransform(sy, [0, 1], [24, -24]);

  if (!product) return null;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  const openLightbox = (src: string) => {
    setActiveImage(src);
    setShowLightbox(true);
  };

  // Hero gallery - clean shots for decision making
  const heroGallery = product.images.gallery;

  return (
    <main className="bg-white min-h-screen font-chubbo selection:bg-black/10">
      <Header />

      {/* ═══════════════════════════════════════
          ACT I: THE DECISION ZONE (HERO)
          ═══════════════════════════════════════ */}
      <section className="pt-28 pb-16 px-6 md:px-12 lg:px-20 max-w-[1440px] mx-auto">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors mb-8"
        >
          <ChevronLeft size={14} /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* ── LEFT: IMAGE BLOCK ── */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="relative aspect-[4/3] bg-[#f5f5f3] overflow-hidden cursor-zoom-in"
              onMouseMove={onMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => openLightbox(activeImage)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={activeImage}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-full object-cover will-change-transform"
                  style={{ scale, x: tx, y: ty }}
                  draggable={false}
                />
              </AnimatePresence>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-3">
              {heroGallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(src)}
                  className={`relative flex-1 aspect-[4/3] overflow-hidden transition-all duration-200 ${
                    activeImage === src
                      ? 'ring-2 ring-black ring-offset-2'
                      : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" draggable={false} />
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: DECISION BLOCK ── */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-10 py-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-gray-400">
              {product.category}
            </p>
            <h1 className="text-4xl md:text-7xl font-chubbo tracking-tighter leading-[0.95]">
              {product.name}
            </h1>
            <p className="text-2xl md:text-3xl tracking-tight text-black/80">
              ${product.price.toLocaleString()}
            </p>
            <p className="text-base text-gray-500 leading-relaxed max-w-md">
              {product.description}
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => setShowEnquire(true)}
                className="w-full py-5 bg-black text-white text-[13px] font-bold uppercase tracking-[0.35em] hover:bg-neutral-800 active:scale-[0.98] transition-all"
              >
                Enquire / Order Yours
              </button>
              <p className="text-center text-[11px] text-gray-400">
                Made to order · Delivered in {product.leadTime}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-4 border-t border-gray-100">
              {[
                product.craftNotes.buildTime,
                product.materials[1],
                'Built to last decades',
              ].map((t, i) => (
                <span key={i} className="flex items-center gap-2 text-[11px] text-gray-400">
                  <Check size={14} className="text-green-600" /> {t}
                </span>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-300">Details</p>
              {[
                { label: 'Material', value: product.materials[0] },
                { label: 'Frame', value: product.materials[1] },
                { label: 'Dimensions', value: `${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} cm` },
                { label: 'Finish', value: product.finish },
                { label: 'Weight', value: product.weight },
              ].map((row, i) => (
                <div key={i} className="flex justify-between text-sm border-b border-gray-50 pb-3">
                  <span className="text-gray-400">{row.label}</span>
                  <span className="text-black font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ACT II: THE STORY MODE NARRATIVE
          ═══════════════════════════════════════ */}
      <section className="bg-neutral-50 pt-32 pb-44 mt-20">
        
        {/* NARRATIVE HEADER */}
        <div className="text-center px-6 max-w-4xl mx-auto mb-24 md:mb-40">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-chubbo tracking-tight leading-tight mb-8"
          >
            The making of an artifact.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-gray-500 font-light"
          >
            From the initial geometry to the final hand-stitched seam. <br className="hidden md:block" /> Every detail is a deliberate decision.
          </motion.p>
        </div>

        {/* PHASE 1: GENESIS (Sketches) */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 mb-32 md:mb-48">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
            <div className="md:col-span-4 space-y-6 md:pr-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 block border-b border-gray-200 pb-4">01 — Genesis</span>
              <h3 className="text-3xl font-chubbo tracking-tight">Form follows feeling.</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {`The ${product.name} didn't start as a piece of furniture; it began as a study in spatial tension. The initial sketches explored the interplay between structure and softness — searching for the ideal proportions that would define its character.`}
              </p>
            </div>
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 md:mt-0">
              {product.images.details[0] && (
                <StoryImage src={product.images.details[0]} alt="Initial sketch" caption="Early conceptual geometry" onClick={() => openLightbox(product.images.details[0])} aspect="aspect-[4/3] sm:aspect-square" delay={0.1} />
              )}
              {product.images.details[1] && (
                <StoryImage src={product.images.details[1]} alt="Structural study" caption="Structural exploration" onClick={() => openLightbox(product.images.details[1])} aspect="aspect-[4/3] sm:aspect-square" delay={0.2} />
              )}
              {product.images.details[2] && (
                <div className="sm:col-span-2">
                   <StoryImage src={product.images.details[2]} alt="Final study" caption="Final proportional study" onClick={() => openLightbox(product.images.details[2])} aspect="aspect-[21/9]" delay={0.3} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PHASE 2: CRAFT (The Build) */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 mb-32 md:mb-48">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
            <div className="md:col-span-7 order-2 md:order-1 mt-8 md:mt-0">
              <StoryImage src={product.images.gallery[0]} alt="Construction detail" caption={product.craftNotes.source} onClick={() => openLightbox(product.images.gallery[0])} aspect="aspect-[16/10]" delay={0.1} />
            </div>
            <div className="md:col-span-5 space-y-6 md:pl-8 order-1 md:order-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 block border-b border-gray-200 pb-4">02 — The Craft</span>
              <h3 className="text-3xl font-chubbo tracking-tight">An honest skeleton.</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {`True luxury lives in the unseen. The ${product.name}'s internal chassis is built from ${product.craftNotes.source.toLowerCase()}, with ${product.craftNotes.joinery.toLowerCase()} engineered to endure decades of daily use without compromise. ${product.craftNotes.buildTime} of meticulous attention in every piece.`}
              </p>
            </div>
          </div>
        </div>

        {/* PHASE 3: REALIZATION (The Details & Variants) */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 mb-32 md:mb-48">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
            <div className="md:col-span-4 space-y-6 md:pr-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 block border-b border-gray-200 pb-4">03 — Realization</span>
              <h3 className="text-3xl font-chubbo tracking-tight">Tactile resolution.</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {`The material palette brings the ${product.name} to life. Crafted with ${product.materials[0].toLowerCase()} over a ${product.materials[1].toLowerCase()}, each variant is finished in ${product.finish} — offering a spectrum of moods to complement any interior.`}
              </p>
            </div>
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 md:mt-0">
               {product.images.gallery[1] && (
                 <StoryImage src={product.images.gallery[1]} alt="Variant 1" caption={`${product.materials[0]} • ${product.materials[1]}`} onClick={() => openLightbox(product.images.gallery[1])} aspect="aspect-[4/5]" delay={0.1} />
               )}
               {product.images.gallery[2] && (
                 <StoryImage src={product.images.gallery[2]} alt="Variant 2" caption={`${product.finish}`} onClick={() => openLightbox(product.images.gallery[2])} aspect="aspect-[4/5]" delay={0.3} />
               )}
            </div>
          </div>
        </div>

        {/* PHASE 4: CONTEXT (Lifestyle) */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 block border-b border-gray-200 pb-4 mb-10">04 — Context</span>
            <motion.h3 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="text-4xl md:text-5xl font-chubbo tracking-tight mb-6"
            >
              Designed to last for years,<br />not trends.
            </motion.h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <StoryImage src={product.images.gallery[0]} alt={`${product.name} in situ`} caption={`The ${product.name} in situ`} onClick={() => openLightbox(product.images.gallery[0])} aspect="aspect-[4/5] md:aspect-[3/4]" delay={0.1} />
             {product.images.gallery[3] && (
               <StoryImage src={product.images.gallery[3]} alt="Living space context" caption="Designed for life" onClick={() => openLightbox(product.images.gallery[3])} aspect="aspect-[4/5] md:aspect-[3/4]" delay={0.3} />
             )}
          </div>
        </div>

      </section>

      {/* ═══════════════════════════════════════
          ACT III: REINFORCEMENT (FINAL CTA)
          ═══════════════════════════════════════ */}
      <section className="py-28 px-6 border-t border-gray-100 text-center space-y-10">
        <div className="space-y-4">
          <h3 className="text-3xl md:text-5xl font-chubbo tracking-tight">Ready to bring it home?</h3>
          <p className="text-gray-400 text-sm">Simple ordering · Premium delivery · Lifetime support</p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setShowEnquire(true)}
            className="px-16 py-5 bg-black text-white text-[13px] font-bold uppercase tracking-[0.35em] hover:bg-neutral-800 active:scale-[0.98] transition-all"
          >
            Order Yours — ${product.price.toLocaleString()}
          </button>
          <Link href="/catalog" className="text-[11px] text-gray-400 hover:text-black transition-colors uppercase tracking-[0.3em]">
            or continue browsing
          </Link>
        </div>
      </section>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {showLightbox && (
          <Lightbox image={activeImage} onClose={() => setShowLightbox(false)} />
        )}
      </AnimatePresence>

      {/* ENQUIRE MODAL */}
      <AnimatePresence>
        {showEnquire && (
          <EnquireModal
            product={product}
            onClose={() => setShowEnquire(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
