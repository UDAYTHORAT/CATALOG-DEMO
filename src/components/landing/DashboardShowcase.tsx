'use client';

import React from 'react';
import { ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';

interface DashboardShowcaseProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  brandColor?: string;
  accentColor?: string;
  showMockups?: boolean;
}

export function DashboardShowcase({
  title = "Manage everything from a unified workspace",
  description = "Get detailed analytics, customize template components, handle buyer responses, and configure live products all from one dashboard.",
  primaryButtonText = "Explore the Dashboard",
  showMockups = true,
}: DashboardShowcaseProps) {
  return (
    <div className="bg-[#0b0f19] text-white py-20 lg:py-28 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 flex flex-col lg:flex-row gap-16 items-center">
        {/* Left Side Info */}
        <div className="space-y-6 max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Owner Dashboard</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
            {title}
          </h2>

          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed font-normal">
            {description}
          </p>

          <div className="pt-4 flex justify-center lg:justify-start">
            <Link
              href="/signup"
              className="cursor-pointer text-sm font-bold bg-white text-[#0f172a] hover:bg-neutral-100 transition-colors px-6 py-3.5 rounded-full flex items-center gap-2.5 shadow-lg shadow-white/5"
            >
              {primaryButtonText}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Right Side - Product Mockups */}
        {showMockups && (
          <div className="relative max-w-lg w-full mx-auto lg:mx-0 mt-8 lg:mt-0 flex-1">
            {/* Desktop Application Window */}
            <div className="relative bg-[#0d1321] rounded-2xl shadow-2xl border border-white/5 overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
              {/* Application Header */}
              <div className="bg-[#121a2e] px-4 py-3 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1.5">
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full opacity-80" />
                      <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full opacity-80" />
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full opacity-80" />
                    </div>
                    <div className="flex items-center space-x-2.5 opacity-50">
                      <svg className="w-3.5 h-3.5 text-neutral-400" viewBox="0 0 24 24" fill="none">
                        <path d="M10 19l-7-7m0 0l7-7m-7 7h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <svg className="w-3.5 h-3.5 text-neutral-400" viewBox="0 0 24 24" fill="none">
                        <path d="m14 5 7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 max-w-[180px] sm:max-w-xs mx-4">
                    <div className="bg-[#050914] rounded-full px-3 py-1.5 text-xs text-neutral-500 border border-white/5 flex items-center gap-1.5">
                      <Search size={11} />
                      <span className="truncate">funnellink.com/dashboard</span>
                    </div>
                  </div>
                  <div className="w-6 h-6 bg-white/5 rounded flex items-center justify-center">
                    <span className="text-neutral-400 text-[10px]">⭐</span>
                  </div>
                </div>
              </div>

              {/* Application Content */}
              <div className="p-6 bg-[#0a0f1d] min-h-[260px] text-left">
                <div className="flex items-center space-x-2.5 mb-6">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <span className="text-white font-extrabold text-sm">FL</span>
                  </div>
                  <span className="font-bold text-white text-base">FunnelLink Workspace</span>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-400 font-medium">Monthly Lead Quota</span>
                      <span className="text-emerald-400 font-bold">75% Used</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 w-3/4 rounded-full" />
                    </div>
                  </div>

                  {/* Feature Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {[
                      { name: 'Overview', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: '📊' },
                      { name: 'Funnels', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: '⚡' },
                      { name: 'Analytics', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: '📈' },
                      { name: 'Settings', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', icon: '⚙️' },
                      { name: 'Products', color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: '🛋️' },
                      { name: 'Support', color: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20', icon: '💬' }
                    ].map((item, index) => (
                      <div key={index} className="flex flex-col items-center space-y-1.5 group cursor-pointer">
                        <div className={`w-10 h-10 ${item.color} rounded-xl border flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200`}>
                          <span className="text-base">{item.icon}</span>
                        </div>
                        <span className="text-[10px] text-neutral-400 text-center font-medium truncate w-full">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Stacked Windows Behind */}
            <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl shadow-xl transform rotate-3 -z-10 opacity-40" />
            <div className="absolute -top-8 -left-8 w-full h-full bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl shadow-xl transform rotate-6 -z-20 opacity-30" />

            {/* Mobile App Mockup */}
            <div className="absolute -bottom-6 -right-12 sm:-bottom-8 sm:-right-8 w-44 h-80 bg-slate-950 rounded-[2.2rem] p-2 shadow-2xl border border-white/10 transform -rotate-6 hover:-rotate-3 transition-transform duration-500">
              <div className="w-full h-full bg-[#050914] rounded-[1.8rem] overflow-hidden border border-white/5 flex flex-col text-left">
                {/* Phone Header */}
                <div className="bg-[#0d1321] px-4 py-2 flex justify-between items-center text-[8px] border-b border-white/5 text-neutral-400">
                  <span className="font-semibold text-white">9:41</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-3.5 h-1.5 bg-[#25d366] rounded-sm" />
                    <span>5G</span>
                  </div>
                </div>

                {/* Phone Content */}
                <div className="p-3.5 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-[#25d366]/20 border border-[#25d366]/20 rounded-lg flex items-center justify-center">
                      <span className="text-xs">🛋️</span>
                    </div>
                    <span className="text-xs font-bold text-white">Urban Living</span>
                  </div>

                  <div className="flex-1 flex flex-col justify-center space-y-2">
                    <div className="h-14 bg-white/5 rounded-xl border border-white/5 p-2 flex flex-col justify-center">
                      <div className="w-16 h-2 bg-neutral-400 rounded mb-1.5" />
                      <div className="w-24 h-1.5 bg-neutral-600 rounded" />
                    </div>
                    <div className="h-14 bg-white/5 rounded-xl border border-white/5 p-2 flex flex-col justify-center">
                      <div className="w-12 h-2 bg-neutral-400 rounded mb-1.5" />
                      <div className="w-20 h-1.5 bg-neutral-600 rounded" />
                    </div>
                  </div>

                  <div className="w-full py-2 bg-[#25d366] text-white text-[9px] font-bold uppercase tracking-wider text-center rounded-xl">
                    Get Price on WhatsApp
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
