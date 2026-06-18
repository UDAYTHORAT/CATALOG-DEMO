'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';
import Navbar from './Navbar';

export default function HeroTransitionZone() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scale1 = useTransform(scrollYProgress, [0, 1], isMobile ? [1, 1] : [1, 0.85]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, -4]);
  const opacity1 = useTransform(scrollYProgress, [0, 1], isMobile ? [1, 0.5] : [1, 0.3]);
  const borderRadius1 = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, 40]);
  
  const scale2 = useTransform(scrollYProgress, [0, 1], isMobile ? [1, 1] : [0.9, 1]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [4, 0]);
  const borderRadius2 = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [40, 0]);

  return (
    <div ref={container} className="relative h-[200vh] bg-[#0A0A0A] satoshi-hero">
      <style>{`
        @font-face {
          font-family: 'Satoshi';
          src: url('/fonts/Satoshi-Variable.woff2') format('woff2'),
               url('/fonts/Satoshi-Variable.ttf') format('truetype');
          font-weight: 300 900;
          font-display: swap;
          font-style: normal;
        }
        .satoshi-hero, .satoshi-hero * {
          font-family: 'Satoshi', system-ui, sans-serif !important;
        }
      `}</style>
      {/* SECTION 1: HERO */}
      <motion.div 
        style={{ scale: scale1, rotate: rotate1, opacity: opacity1, borderRadius: borderRadius1 }}
        className="sticky top-0 h-screen w-full bg-white flex flex-col overflow-hidden transform-gpu origin-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-0"
      >
        <Navbar />
        
        <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#2A5BEA]/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-violet-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

          <motion.h1 
            initial={{ opacity: 0, y: 30, filter: "blur(10px)", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-[38px] sm:text-[54px] leading-[1.05] md:text-[96px] font-extrabold tracking-[-0.04em] text-[#0A0A0A]"
          >
            Turn Traffic <br />
            <span className="brand-gradient-text">Into Customers.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mt-8 text-lg md:text-2xl text-slate-500 max-w-3xl font-medium leading-relaxed tracking-tight"
          >
            Customers arrive with questions. FunnelLink gives them answers before they reach WhatsApp.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="mt-12 flex flex-col sm:flex-row items-center gap-4 relative z-10"
          >
            <Link href="/signup">
              <button className="bg-[#0A0A0A] text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] hover:-translate-y-1 flex items-center gap-2 group">
                Create Free Funnel
                <ArrowDown size={18} className="text-slate-400 group-hover:text-white transition-colors group-hover:translate-x-1 -rotate-90" />
              </button>
            </Link>
            <button 
              onClick={() => document.getElementById('flow-engine')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white border border-slate-200 text-[#0A0A0A] px-8 py-4 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center gap-2 hover:-translate-y-1 group"
            >
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowDown size={12} className="text-slate-600" />
              </div>
              See How It Works
            </button>
          </motion.div>
        </section>
      </motion.div>

      {/* SECTION 2: ONE LINER (Slides up over the hero) */}
      <motion.div 
        style={{ scale: scale2, rotate: rotate2, borderTopLeftRadius: borderRadius2, borderTopRightRadius: borderRadius2 }}
        className="relative h-screen bg-slate-50 z-10 flex flex-col justify-center items-center transform-gpu origin-top shadow-[0_-20px_50px_rgba(0,0,0,0.3)]"
      >
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-6xl lg:text-[72px] font-extrabold tracking-tight text-[#0A0A0A] leading-[1.1]">
            Customers Don't Buy When They <span className="underline decoration-slate-300 underline-offset-[6px] md:underline-offset-[12px] decoration-[3px] md:decoration-[6px]">Discover</span> You.<br />
            <span className="text-slate-400">They Buy When They <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent font-black">Understand</span> You.</span>
          </h2>
        </div>
      </motion.div>
    </div>
  );
}
