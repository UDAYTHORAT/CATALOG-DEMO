'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface VideoScrollHeroProps {
  videoSrc?: string;
  enableAnimations?: boolean;
  className?: string;
  startScale?: number;
}

export function VideoScrollHero({
  videoSrc = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  enableAnimations = true,
  className = '',
  startScale = 0.6,
}: VideoScrollHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [scrollScale, setScrollScale] = useState(startScale);

  useEffect(() => {
    if (!enableAnimations || shouldReduceMotion) return;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress based on container position relative to viewport
      const scrolled = Math.max(0, -rect.top);
      const maxScroll = containerHeight - windowHeight;
      const progress = maxScroll > 0 ? Math.min(scrolled / maxScroll, 1) : 0;
      
      // Scale from startScale to 1
      const newScale = startScale + (progress * (1.1 - startScale));
      setScrollScale(Math.min(newScale, 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [enableAnimations, shouldReduceMotion, startScale]);

  const shouldAnimate = enableAnimations && !shouldReduceMotion;

  return (
    <div className={`relative bg-[#070b14] py-16 lg:py-24 overflow-hidden border-t border-white/5 ${className}`}>
      
      {/* Title & Description Header (Now outside the video and fully readable) */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 text-center mb-10 lg:mb-14 relative z-20">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Product Demo</span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4">
          Interactive Funnel Builder
        </h2>
        
        <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
          Watch how easy it is to upload catalog items, adjust budget selectors, and deploy your live Link in minutes.
        </p>
      </div>

      {/* Video Scroll Pin Area */}
      <div
        ref={containerRef}
        className="relative h-[110vh] w-full"
      >
        {/* Sticky Video Container - offset from top to avoid overlapping fixed Navbar */}
        <div className="sticky top-[100px] w-full h-[65vh] flex items-center justify-center z-10 overflow-hidden px-4">
          <div
            className="relative w-full max-w-4xl flex items-center justify-center will-change-transform"
            style={{
              transform: shouldAnimate ? `scale(${scrollScale})` : 'scale(1)',
              transformOrigin: 'center center',
              transition: 'transform 0.1s ease-out',
            }}
          >
            {/* The Video Display Player */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/40">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Subtle gradient vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
