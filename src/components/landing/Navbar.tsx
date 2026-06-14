import React from 'react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div className="font-bold text-xl tracking-tighter flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-md flex items-center justify-center overflow-hidden">
              <img src="/logo.jpeg" alt="FunnelLink Logo" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            FunnelLink
          </div>
          <div className="hidden md:flex items-center gap-7 text-sm font-bold text-slate-600">
            <span className="hover:text-black cursor-pointer transition-colors">Platform</span>
            <span className="hover:text-black cursor-pointer transition-colors">Resources</span>
            <span className="hover:text-black cursor-pointer transition-colors">Customers</span>
            <span className="hover:text-black cursor-pointer transition-colors">Pricing</span>
          </div>
        </div>
        <div className="flex items-center gap-5 text-sm font-bold">
          <button className="text-slate-600 hover:text-black transition-colors hidden sm:block">Sign in</button>
          <button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-sm shadow-blue-500/20">
            Start for free
          </button>
        </div>
      </div>
    </nav>
  );
}
