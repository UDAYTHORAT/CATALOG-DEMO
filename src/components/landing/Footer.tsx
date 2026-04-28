'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Legal: [
    { label: 'Terms & Conditions', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer>
      {/* Final CTA */}
      <section className="relative py-24 lg:py-32 overflow-hidden" style={{ background: 'linear-gradient(165deg, #1a3a4a 0%, #0f2d3d 100%)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-[#d2e823]/[0.04] blur-[100px]" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6">
              Jumpstart your sales
              <br />
              <span className="text-[#d2e823]">funnel today</span>
            </h2>
            <p className="text-white/55 text-lg mb-10 max-w-lg mx-auto">
              Create your first funnel in 2 minutes. Free forever — no credit card needed.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 btn-lime px-10 py-4 text-base group">
              Get started free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer Links */}
      <div className="bg-[#0f1729]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>
                <span className="text-lg font-extrabold text-white">
                  Funnel<span className="text-[#d2e823]">Link</span>
                </span>
              </Link>
              <p className="text-sm text-white/40 leading-relaxed max-w-xs">
                Turn every visitor into a qualified WhatsApp lead with one smart link.
              </p>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-bold text-white mb-4">{title}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-sm text-white/40 hover:text-white/70 transition-colors">{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} FunnelLink. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {['Twitter', 'Instagram', 'LinkedIn'].map((s) => (
                <a key={s} href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
