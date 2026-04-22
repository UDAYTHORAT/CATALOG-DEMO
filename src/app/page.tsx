'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isNight, setIsNight] = useState(false);

  // Intentional Day-to-Night Sequence
  useEffect(() => {
    // Start at Day, wait 3 seconds for the user to take in the light, then transition to Night.
    const timer = setTimeout(() => {
      setIsNight(true);
    }, 3000); 

    // Optional: Slow return to day after a long period of stillness (60s) for continuity
    // but the primary instruction is Day to Night.
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative h-screen w-full bg-obsidian overflow-hidden selection:bg-gold/20">
      
      {/* 1. ATMOSPHERIC TRANSITION (Starting at Day) */}
      <div className="absolute inset-0">
        {/* DAY LAYER (Permanent Base) */}
        <div className="absolute inset-0">
          <img 
            src="/images/hero-day.jpeg" 
            alt="Study in Light" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* NIGHT LAYER (Revealing Over Time) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isNight ? 1 : 0 }}
          transition={{ duration: 8, ease: [0.4, 0, 0.2, 1] }} // 8s slow sunset transition
          className="absolute inset-0 z-10"
        >
          <img 
            src="/images/hero-night.jpeg" 
            alt="Study in Stillness" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        {/* CINEMATIC OVERLAYS */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-20 pointer-events-none" />
      </div>

      {/* 2. MINIMALIST BRANDING */}
      <div className="relative h-full flex flex-col items-center justify-center z-30">
        <Link href="/catalog" className="group cursor-pointer flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[12vw] md:text-[8vw] font-stardom text-white tracking-widest leading-none drop-shadow-2xl text-center">
              AURELIAN STUDIO
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 1, duration: 2.5 }}
            className="h-[1px] bg-gold/50 mt-8"
          />

          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 0.2 }}
             whileHover={{ opacity: 1, letterSpacing: "1.2em" }}
             transition={{ duration: 1.5 }}
             className="text-[10px] text-white uppercase tracking-[0.8em] font-sans mt-12 text-center transition-all cursor-pointer"
          >
             Enter Archive
          </motion.div>

        </Link>
      </div>

      {/* PHASE MARKER (Minimal) */}
      <div className="absolute bottom-12 left-12 overflow-hidden h-4">
         <motion.p 
           animate={{ y: isNight ? -20 : 0 }}
           transition={{ duration: 8 }}
           className="text-[8px] uppercase tracking-[0.3em] text-white/30 font-black"
         >
            Morning Light <br />
            Midnight Stillness
         </motion.p>
      </div>

    </main>
  );
}
