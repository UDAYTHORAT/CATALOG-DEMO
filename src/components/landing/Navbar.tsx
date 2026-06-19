import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset scroll slightly to account for the sticky navbar height (64px / 16rem)
      const offset = 64;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 satoshi-nav">
      <style>{`
        @font-face {
          font-family: 'Satoshi';
          src: url('/fonts/Satoshi-Variable.woff2') format('woff2'),
               url('/fonts/Satoshi-Variable.ttf') format('truetype');
          font-weight: 300 900;
          font-display: swap;
          font-style: normal;
        }
        .satoshi-nav, .satoshi-nav * {
          font-family: 'Satoshi', system-ui, sans-serif !important;
        }
      `}</style>
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="font-bold text-xl tracking-tighter flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-md flex items-center justify-center overflow-hidden">
              <img src="/logo.jpeg" alt="FunnelLink Logo" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <span>
              <span className="text-black">Funnel</span><span className="brand-gradient-text">Link</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-7 text-sm font-bold text-slate-600">
            <button 
              onClick={() => handleScrollTo('trap')} 
              className="hover:text-black transition-colors focus:outline-none"
            >
              The Trap
            </button>
            <button 
              onClick={() => handleScrollTo('flow-engine')} 
              className="hover:text-black transition-colors focus:outline-none"
            >
              How it Works
            </button>
            <button 
              onClick={() => handleScrollTo('simulator')} 
              className="hover:text-black transition-colors focus:outline-none"
            >
              Live Simulator
            </button>
            <button 
              onClick={() => handleScrollTo('editor-demo')} 
              className="hover:text-black transition-colors focus:outline-none"
            >
              Funnel Editor
            </button>
          </div>
        </div>
        <div className="flex items-center gap-5 text-sm font-bold">
          <Link href="/login">
            <button className="text-slate-600 hover:text-black transition-colors hidden sm:block">Sign in</button>
          </Link>
          <Link href="/signup">
            <button className="bg-gradient-to-r from-[#2A5BEA] via-[#4E3BDA] to-[#7A44E8] hover:opacity-90 text-white px-5 py-2.5 rounded-lg transition-all shadow-sm shadow-[#2A5BEA]/20">
              Start for free
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
