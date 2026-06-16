'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import HeroTransitionZone from '@/components/landing/HeroTransitionZone';
import StorySection from '@/components/landing/StorySection';
import FunnelEngine from '@/components/landing/FunnelEngine';
import SplitTransition from '@/components/landing/SplitTransition';

function SmoothScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-slate-900/10 origin-left z-50"
      style={{ scaleX }}
    />
  );
}

export default function AttioLandingPage() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen text-[#111] font-sans selection:bg-blue-100 relative">
      <div className="film-grain pointer-events-none" />
      <SmoothScrollProgress />
      
      <HeroTransitionZone />
      
      <div className="bg-slate-50 relative z-20">
        {/* THE TRADITIONAL WAY (STICKY MOCKUP SCROLL WITH PHONE MOCKUP) */}
        <StorySection />

        {/* HUB AND SPOKE ARCHITECTURE FLOW (ATTIO STYLE) */}
        <FunnelEngine />

        {/* CINEMATIC SPLIT REVEAL TRANSITION */}
        <SplitTransition />
      </div>
    </div>
  );
}
