'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { CATALOG_DATA, Product, IntroPhase } from '@/data/catalog';
import { 
  ChevronLeft, ChevronRight, X, Eye, Info, ShoppingBag 
} from 'lucide-react';
import Link from 'next/link';
import EnquireModal from '@/components/EnquireModal';

// --- MOTION CONSTANTS ---
const TRANSITION_MAIN = { duration: 0.8, ease: [0.22, 1, 0.36, 1] };
const TRANSITION_PANEL = { type: "spring", damping: 25, stiffness: 200, mass: 0.8 };
const TRANSITION_MICRO = { duration: 0.2, ease: [0.22, 1, 0.36, 1] };

// --- SUB-COMPONENT: PRODUCT PANEL ---
const ProductPanel = ({ 
  product, 
  onClose,
  allProductsInSpread,
  onSelectProduct,
  onEnquire
}: { 
  product: Product | null, 
  onClose: () => void,
  allProductsInSpread: Product[],
  onSelectProduct: (p: Product) => void,
  onEnquire: (p: Product) => void
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={TRANSITION_MICRO}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[4px] pointer-events-auto cursor-pointer"
      />
      
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={TRANSITION_PANEL}
        className="absolute top-0 right-0 h-full w-full md:w-[540px] bg-white pointer-events-auto shadow-[-40px_0_80px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden"
      >
        <div className="px-5 pt-8 pb-4 md:px-8 md:pt-12 md:pb-6 flex justify-between items-start">
           <div className="flex flex-col">
              <span className="text-[10px] text-gold font-black uppercase tracking-[0.4em] mb-1">{product.category}</span>
              <div className="flex gap-2 mt-2">
                {allProductsInSpread.map((p) => (
                  <button 
                    key={p.id}
                    onClick={() => onSelectProduct(p)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${p.id === product.id ? 'bg-gold w-6' : 'bg-gray-200 hover:bg-gray-400'}`}
                  />
                ))}
              </div>
           </div>
           <button 
             onClick={onClose}
             className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all border border-gray-100 active:scale-95"
           >
             <X size={20} />
           </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={TRANSITION_MICRO}
            data-lenis-prevent
            className="flex-1 overflow-y-auto px-5 pb-8 md:px-8 md:pb-12 custom-scrollbar"
          >
             {/* Staggered Content Reveal */}
             <motion.div 
               initial={{ opacity: 0, scale: 1.05 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.1, duration: 0.5 }}
               className="aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden mb-6 md:mb-10 bg-gray-50 border border-gray-100 group"
             >
                <img 
                  src={product.images.hero} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
             </motion.div>

             <div className="mb-10">
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="text-3xl md:text-5xl font-chubbo tracking-tighter mb-3 md:mb-4 leading-none"
                >
                  {product.name}
                </motion.h3>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="flex items-baseline gap-4 mb-8"
                >
                  <span className="text-xl md:text-2xl font-chubbo italic text-black">${product.price.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">{product.priceRange}</span>
                </motion.div>
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="text-gray-600 text-sm md:text-lg leading-relaxed mb-6 md:mb-10 font-light"
                >
                  {product.description}
                </motion.p>
             </div>

             <motion.div 
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
               className="grid grid-cols-2 gap-y-6 gap-x-4 md:gap-y-10 md:gap-x-6 border-t border-gray-100 pt-6 md:pt-10"
             >
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3 block">Composition</span>
                  <p className="text-sm font-medium leading-tight">{product.materials.join(' • ')}</p>
                  <p className="text-[10px] text-gold mt-2 uppercase font-black tracking-widest animate-pulse">{product.finish}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3 block">Scale</span>
                  <p className="text-sm font-medium">{product.dimensions.length}L x {product.dimensions.width}W x {product.dimensions.height}H {product.dimensions.unit}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3 block">Build Quality</span>
                  <p className="text-sm font-medium">{product.construction}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3 block">Provenance</span>
                  <p className="text-sm font-medium">{product.origin}</p>
                </div>
             </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="p-5 md:p-8 bg-gray-50 border-t border-gray-100">
           <div className="flex justify-between items-center mb-4 md:mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-gold animate-ping" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Limited Archive Artifact</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gold hover:scale-105 transition-transform cursor-help">Wait Time: {product.leadTime}</span>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <Link 
                href={`/catalog/${product.id}`}
                className="py-4 md:py-6 bg-black text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center justify-center gap-2 md:gap-3 hover:bg-gold transition-all rounded-sm shadow-xl active:scale-[0.98]"
              >
                View Full Dossier <Eye size={14} />
              </Link>
              <button
                onClick={() => onEnquire(product!)}
                className="py-4 md:py-6 border border-gray-200 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center justify-center gap-2 md:gap-3 hover:border-black transition-all rounded-sm active:scale-[0.98] group relative overflow-hidden"
              >
                <span className="relative z-10">Enquire</span>
                <div className="absolute inset-0 bg-black/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <ShoppingBag size={14} className="relative z-10" />
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- SUB-COMPONENT: HOTSPOT ---
const Hotspot = ({ product, onSelect, isActive }: { product: Product, onSelect: (p: Product) => void, isActive: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="absolute z-30 group"
      style={{ left: product.hotspot.x, top: product.hotspot.y }}
    >
      <button 
        onClick={() => onSelect(product)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex items-center justify-center active:scale-90 transition-transform duration-150"
      >
        <motion.div 
          animate={{ 
            scale: isActive ? 1.2 : isHovered ? 1.4 : [1, 1.4, 1], 
            opacity: isActive ? 0.8 : isHovered ? 0.6 : hasLoaded ? [0.2, 0.4, 0.2] : [0.4, 0.7, 0.4] 
          }}
          transition={{ 
            duration: hasLoaded ? 3 : 1, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className={`absolute w-8 h-8 md:w-12 md:h-12 rounded-full ${isActive ? 'bg-gold' : 'bg-white shadow-xl'}`}
        />
        <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 shadow-2xl ${isActive ? 'bg-gold border-white scale-125' : 'bg-white border-gold group-hover:scale-115 group-hover:shadow-[0_0_20px_rgba(197,160,89,0.5)]'}`} />
        
        {/* Subtle Tooltip */}
        <AnimatePresence>
          {isHovered && !isActive && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={TRANSITION_MICRO}
              className="absolute bottom-full mb-4 px-4 py-2 bg-black text-white text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap rounded-full shadow-2xl pointer-events-none"
            >
              Explore {product.name}
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};

// --- MAIN COMPONENT: CATALOG ENGINE ---
export default function Catalog() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [enquireProduct, setEnquireProduct] = useState<Product | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Parallax Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const totalPages = CATALOG_DATA.length;

  const nextSlide = useCallback(() => setCurrentIndex((prev) => (prev + 1) % totalPages), [totalPages]);
  const prevSlide = useCallback(() => setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages), [totalPages]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') setSelectedProduct(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [nextSlide, prevSlide]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const moveX = (clientX - window.innerWidth / 2) / 50;
    const moveY = (clientY - window.innerHeight / 2) / 50;
    mouseX.set(moveX);
    mouseY.set(moveY);
  };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
    setTouchStart(null);
  };

  const currentSpread = CATALOG_DATA[currentIndex];
  const [introStep, setIntroStep] = useState(0);
  const [showIntro, setShowIntro] = useState(!!currentSpread.introSequence);

  useEffect(() => {
    if (currentSpread.introSequence && showIntro) {
      const timer = setInterval(() => {
        setIntroStep((prev) => {
          if (prev >= currentSpread.introSequence!.length - 1) {
            clearInterval(timer);
            setTimeout(() => setShowIntro(false), 1800);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [currentSpread.id, showIntro]);

  useEffect(() => {
    if (currentSpread.introSequence) {
      setIntroStep(0);
      setShowIntro(true);
    } else {
      setShowIntro(false);
    }
  }, [currentIndex]);

  if (CATALOG_DATA.length === 0) {
    return (
      <main className="relative h-screen w-full bg-black flex flex-col items-center justify-center text-center px-12 font-chubbo">
        <h2 className="text-4xl md:text-6xl text-white tracking-tighter mb-8">The Archive is Silent</h2>
        <p className="text-white/40 text-lg font-light max-w-md mb-12 leading-relaxed">All artifacts are currently being recalibrated. Please check back as the collection evolves.</p>
        <Link href="/" className="text-gold font-black uppercase tracking-[0.4em] text-[10px] hover:text-white transition-colors">Return to Sanctuary</Link>
      </main>
    );
  }

  return (
    <main 
      className="relative w-full bg-black font-chubbo selection:bg-gold/20"
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-screen w-full overflow-hidden">
      
      <div className="relative h-full w-full">
        <AnimatePresence>
          <motion.div 
            key={currentSpread.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={TRANSITION_MAIN}
            className="absolute inset-0 w-full h-full"
          >
            {/* INTRO SEQUENCE OVERLAY — CINEMATIC LAYERED BUILD */}
            <AnimatePresence>
              {showIntro && currentSpread.introSequence && (() => {
                const phase = currentSpread.introSequence[introStep];
                const isSketchType = phase.type === 'sketch';
                const isBuildType = phase.type === 'build';
                const isComposeType = phase.type === 'compose';
                const isRevealType = phase.type === 'reveal';
                const isRoomType = phase.type === 'room';

                const imageFilter = isSketchType
                  ? 'grayscale(1) contrast(1.4) brightness(1.1)'
                  : isBuildType
                  ? 'sepia(0.4) saturate(1.2) brightness(1.05)'
                  : isComposeType
                  ? 'grayscale(0.3) brightness(1.05)'
                  : 'brightness(1) saturate(1)';

                const imageFilterBright = isSketchType
                  ? 'grayscale(1) contrast(1.4) brightness(1.5)'
                  : isBuildType
                  ? 'sepia(0.4) saturate(1.2) brightness(1.5)'
                  : isComposeType
                  ? 'grayscale(0.3) brightness(1.5)'
                  : 'brightness(1.5) saturate(1)';

                const imageFilterDark = isSketchType
                  ? 'grayscale(1) contrast(1.4) brightness(0.7)'
                  : isBuildType
                  ? 'sepia(0.4) saturate(1.2) brightness(0.7)'
                  : isComposeType
                  ? 'grayscale(0.3) brightness(0.7)'
                  : 'brightness(0.7) saturate(1)';

                return (
                  <motion.div 
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 z-[60] bg-black"
                  >
                    {/* LAYER 1: Persistent room backdrop */}
                    <motion.div
                      initial={{ scale: 1.15, opacity: 0 }}
                      animate={{ scale: 1.02, opacity: isRoomType ? 1 : 0.3 }}
                      transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <img
                        src={currentSpread.introSequence[0].image}
                        alt="Room"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                    </motion.div>

                    {/* LAYER 2: Phase image on top */}
                    {!isRoomType && (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={phase.type + introStep}
                          initial={{
                            opacity: 0,
                            scale: isSketchType ? 0.85 : 1.08,
                            filter: imageFilterBright,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            filter: imageFilter,
                          }}
                          exit={{
                            opacity: 0,
                            scale: isRevealType ? 1 : 0.97,
                            filter: imageFilterDark,
                          }}
                          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute inset-0"
                        >
                          {(isSketchType || isBuildType) ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/10 via-transparent to-black/30">
                              <img
                                src={phase.image}
                                alt={phase.label}
                                className="max-w-[65%] max-h-[70%] object-contain drop-shadow-2xl"
                              />
                            </div>
                          ) : (
                            <img
                              src={phase.image}
                              alt={phase.label}
                              className="w-full h-full object-cover"
                            />
                          )}
                          {/* Vignette overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
                        </motion.div>
                      </AnimatePresence>
                    )}

                    {/* LAYER 3: Phase label text */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`label-${introStep}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                        className="absolute bottom-24 md:bottom-32 left-6 md:left-24 z-[70] pointer-events-none"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 32 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-px bg-gold"
                          />
                          <span className="text-[10px] text-gold font-black uppercase tracking-[0.5em]">
                            Phase {String(introStep + 1).padStart(2, '0')} / {String(currentSpread.introSequence.length).padStart(2, '0')}
                          </span>
                        </div>
                        <h3 className="text-3xl md:text-7xl font-chubbo text-white tracking-tighter leading-none mb-2 md:mb-3">
                          {phase.label}
                        </h3>
                        <p className="text-white/50 text-sm md:text-base font-light tracking-wide max-w-md">
                          {phase.sublabel}
                        </p>
                      </motion.div>
                    </AnimatePresence>

                    {/* LAYER 4: Progress bar */}
                    <div className="absolute bottom-6 md:bottom-12 left-6 md:left-24 right-6 md:right-24 flex gap-2 z-[70]">
                      {currentSpread.introSequence.map((p, i) => (
                        <div key={i} className="flex-1 flex flex-col gap-2">
                          <div className={`h-[2px] rounded-full transition-all duration-1000 ease-out ${
                            i < introStep ? 'bg-gold' : i === introStep ? 'bg-gold shadow-[0_0_8px_rgba(197,160,89,0.6)]' : 'bg-white/10'
                          }`}>
                            {i === introStep && (
                              <motion.div
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 3, ease: 'linear' }}
                                className="h-full bg-gold rounded-full"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Skip button */}
                    <button
                      onClick={() => setShowIntro(false)}
                      className="absolute top-6 right-6 md:top-12 md:right-12 z-[70] text-[8px] md:text-[9px] text-white/40 font-black uppercase tracking-[0.3em] md:tracking-[0.4em] hover:text-white transition-colors border border-white/10 px-4 py-2 md:px-6 md:py-3 rounded-full hover:border-white/30 active:scale-95"
                    >
                      Skip Intro
                    </button>
                  </motion.div>
                );
              })()}
            </AnimatePresence>

            {/* Main Background with Parallax */}
            <motion.div 
              style={{ x: smoothX, y: smoothY }}
              className="absolute -inset-10"
            >
              <motion.div
                initial={{ clipPath: "inset(100% 0 0 0)", scale: 1.1, filter: "brightness(1.2)" }}
                animate={{ clipPath: "inset(0% 0 0 0)", scale: 1, filter: "brightness(1)" }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full"
              >
                <img 
                  src={currentSpread.image} 
                  alt={currentSpread.title} 
                  className="w-full h-full object-cover scale-110"
                />
              </motion.div>
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-black/40 pointer-events-none" />

            {/* Hotspots */}
            {currentSpread.products.map((p) => (
              <Hotspot 
                key={p.id} 
                product={p} 
                onSelect={setSelectedProduct} 
                isActive={selectedProduct?.id === p.id} 
              />
            ))}

            {/* Content Overlay */}
            <motion.div 
              className="absolute bottom-20 md:bottom-24 left-6 md:left-24 max-w-2xl z-20"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.15, delayChildren: 0.4 }
                }
              }}
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
                }}
                className="flex items-center gap-4 mb-6"
              >
                 <span className="text-gold font-bold text-[10px] uppercase tracking-[0.5em]">Artifact Volume 01</span>
                 <motion.div 
                    variants={{
                      hidden: { width: 0 },
                      visible: { width: 48, transition: { duration: 1, ease: "easeOut" } }
                    }}
                    className="h-px bg-gold/30" 
                 />
                 <span className="text-white/40 font-bold text-[10px] uppercase tracking-[0.5em]">Perspective {currentSpread.pageNumber}</span>
              </motion.div>

              <div className="overflow-hidden mb-10">
                <motion.h2 
                  variants={{
                    hidden: { opacity: 0, y: 80, rotateX: 20 },
                    visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
                  }}
                  style={{ transformOrigin: "bottom" }}
                  className="text-4xl md:text-[9vw] font-chubbo text-white tracking-tighter leading-none hover:tracking-tight transition-all duration-1000 cursor-default"
                >
                  {currentSpread.title}
                </motion.h2>
              </div>

              <motion.p 
                variants={{
                  hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
                  visible: { opacity: 0.7, clipPath: "inset(0 0% 0 0)", transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
                }}
                className="text-white text-sm md:text-xl font-light leading-relaxed mb-4 max-w-md"
              >
                {currentSpread.description}
              </motion.p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. LAYER: NAVIGATION HUD */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        <div className="p-6 md:p-12 flex justify-between items-start pointer-events-auto">
          <Link href="/" className="text-lg md:text-2xl font-chubbo text-white tracking-[0.2em] md:tracking-[0.3em] hover:text-gold transition-all active:scale-95">AURELIAN</Link>
          <div className="flex flex-col items-end text-right">
             <span className="text-[8px] md:text-[10px] text-white/40 uppercase tracking-[0.3em] md:tracking-[0.5em] font-bold mb-1 md:mb-2">Digital Archive</span>
             <span className="text-3xl md:text-5xl font-chubbo text-white italic transition-all duration-700">{currentSpread.pageNumber}</span>
          </div>
        </div>

        <div className="absolute bottom-6 md:bottom-12 right-6 md:right-24 flex items-center gap-6 md:gap-12 pointer-events-auto">
          <div className="flex flex-col items-end gap-3">
             <div className="flex items-center gap-4">
                <button 
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                  className="w-11 h-11 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all active:scale-90 group disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} className="md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={nextSlide}
                  disabled={currentIndex === totalPages - 1}
                  className="w-11 h-11 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all active:scale-90 group disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} className="md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
          </div>
          
          <div className="h-16 w-px bg-white/10 mx-6 hidden md:block" />
          
          <div className="flex items-center gap-4 text-white italic text-4xl hidden md:flex">
             <span className="text-gold">{String(currentIndex + 1).padStart(2, '0')}</span>
             <span className="text-white/20 font-light">/</span>
             <span className="text-white/40">{String(totalPages).padStart(2, '0')}</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5">
           <motion.div 
             animate={{ width: `${((currentIndex + 1) / totalPages) * 100}%` }}
             className="h-full bg-gold shadow-[0_0_10px_rgba(197,160,89,0.5)] transition-all duration-700"
           />
        </div>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <ProductPanel 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)}
            allProductsInSpread={currentSpread.products}
            onSelectProduct={setSelectedProduct}
            onEnquire={(p) => { setEnquireProduct(p); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {enquireProduct && (
          <EnquireModal
            product={enquireProduct}
            onClose={() => setEnquireProduct(null)}
          />
        )}
      </AnimatePresence>

      {!selectedProduct && (
        <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 flex items-center gap-3 md:gap-4 z-40 text-white/30 select-none hidden md:flex">
           <Info size={14} className="animate-pulse" />
           <span className="text-[10px] uppercase tracking-[0.5em] font-bold">Select artifact to explore specifications</span>
        </div>
      )}

      </div>
    </main>
  );
}
