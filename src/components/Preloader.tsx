'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            y: '-100%',
            transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[999] bg-obsidian flex flex-col items-center justify-center"
        >
          {/* Logo Animation */}
          <div className="relative overflow-hidden mb-12">
            <motion.h1 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
              className="text-4xl md:text-6xl font-serif text-white tracking-[0.4em]"
            >
              AURELIAN
            </motion.h1>
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              className="absolute bottom-0 left-0 w-full h-[1px] bg-gold origin-left"
            />
          </div>

          {/* Progress Info */}
          <div className="flex flex-col items-center gap-4">
             <div className="flex items-baseline gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Calibrating Artifacts</span>
                <span className="text-gold font-chubbo italic text-xl w-12 text-right">{progress}%</span>
             </div>
             
             {/* Subtle Loading Text */}
             <motion.p 
               animate={{ opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20"
             >
               {progress < 40 ? 'Synchronizing Archive...' : 
                progress < 80 ? 'Materializing Craft...' : 
                'Finalizing Perspective...'}
             </motion.p>
          </div>

          {/* Decorative Corner Elements */}
          <div className="absolute top-12 left-12 w-8 h-8 border-t border-l border-white/10" />
          <div className="absolute top-12 right-12 w-8 h-8 border-t border-r border-white/10" />
          <div className="absolute bottom-12 left-12 w-8 h-8 border-b border-l border-white/10" />
          <div className="absolute bottom-12 right-12 w-8 h-8 border-b border-r border-white/10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
