'use client';

import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
      <footer className="font-sans flex flex-col items-center justify-center w-full py-20 bg-gradient-to-b from-[#5524B7] to-[#380B60] text-white/70 satoshi-footer">
        <style>{`
          @font-face {
            font-family: 'Satoshi';
            src: url('/fonts/Satoshi-Variable.woff2') format('woff2'),
                 url('/fonts/Satoshi-Variable.ttf') format('truetype');
            font-weight: 300 900;
            font-display: swap;
            font-style: normal;
          }
          .satoshi-footer, .satoshi-footer * {
            font-family: 'Satoshi', system-ui, sans-serif !important;
          }
        `}</style>
        {/* FunnelLink Logo and Name */}
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-white/20 shadow-lg">
            <img alt="FunnelLink Logo" className="h-full w-full object-contain" src="/logo.jpeg" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight uppercase">
            Funnel<span className="text-blue-300">Link</span>
          </span>
        </div>

        <p className="mt-4 text-center text-sm">
          Copyright © {currentYear} <span className="text-white font-semibold">FunnelLink</span>. All rights reserved.
        </p>

        {/* Social Links Row */}
        <div className="flex items-center gap-4 mt-5">
          {/* Facebook */}
          <a href="#" className="hover:-translate-y-0.5 transition-all duration-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          {/* Instagram */}
          <a href="#" className="hover:-translate-y-0.5 transition-all duration-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5" stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 11.37a4 4 0 1 1-7.914 1.173A4 4 0 0 1 16 11.37m1.5-4.87h.01" stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          {/* LinkedIn */}
          <a href="#" className="hover:-translate-y-0.5 transition-all duration-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6M6 9H2v12h4zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4" stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          {/* Twitter */}
          <a href="#" className="hover:-translate-y-0.5 transition-all duration-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2" stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          {/* GitHub */}
          <a href="#" className="hover:-translate-y-0.5 transition-all duration-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 18c-4.51 2-5-2-7-2" stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </footer>
  );
}
