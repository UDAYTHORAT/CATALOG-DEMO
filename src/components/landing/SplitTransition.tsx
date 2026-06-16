'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { Coffee, Sofa, Home, ArrowRight, Sparkles } from 'lucide-react';
import WhatIsFunnelLink from './WhatIsFunnelLink';

export default function SplitTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Top/Bottom panels split horizontally apart from progress 0.0 to 1.0 (all the way till the end)
  const topPanelY = useTransform(scrollYProgress, [0.0, 1.0], ['0vh', '-100vh']);
  const bottomPanelY = useTransform(scrollYProgress, [0.0, 1.0], ['0vh', '100vh']);
  
  // Reveal content underneath (fade in and scale up dynamically)
  const revealOpacity = useTransform(scrollYProgress, [0.0, 0.9], [0, 1]);
  const revealScale = useTransform(scrollYProgress, [0.0, 0.9], [0.95, 1]);

  return (
    <div ref={containerRef} className="h-[250vh] relative bg-white">
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* UNDERNEATH LAYER: Revealed Solution Headline */}
        <div className="absolute inset-0 z-0 bg-white">
          <WhatIsFunnelLink />
        </div>

        {/* OVERLAY SPLIT LAYER: Top and Bottom panels */}
        {/* Top Panel */}
        <motion.div 
          style={{ y: topPanelY }}
          className="absolute top-0 left-0 w-full h-[50vh] overflow-hidden bg-white z-10 origin-bottom"
        >
          {/* Inner child height matches screen so text sits perfectly in the center */}
          <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
            <h1 className="text-6xl sm:text-8xl md:text-[12rem] lg:text-[15rem] font-tanker tracking-[-0.02em] uppercase select-none whitespace-nowrap text-black">
              Funnel<span className="brand-gradient-text">Link</span>
            </h1>
          </div>
        </motion.div>

        {/* Bottom Panel */}
        <motion.div 
          style={{ y: bottomPanelY }}
          className="absolute bottom-0 left-0 w-full h-[50vh] overflow-hidden bg-white z-10 origin-top"
        >
          {/* Inner child height matches screen so text sits perfectly in the center */}
          <div className="absolute bottom-0 left-0 w-full h-screen flex items-center justify-center">
            <h1 className="text-6xl sm:text-8xl md:text-[12rem] lg:text-[15rem] font-tanker tracking-[-0.02em] uppercase select-none whitespace-nowrap text-black">
              Funnel<span className="brand-gradient-text">Link</span>
            </h1>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
