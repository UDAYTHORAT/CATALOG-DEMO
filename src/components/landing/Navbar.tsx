'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex-shrink-0 relative group-hover:scale-105 transition-transform duration-200">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-white p-0.5 flex items-center justify-center border border-slate-200 shadow-sm">
                <img src="/logo.jpeg" alt="FunnelLink Logo" className="max-w-full max-h-full object-contain" />
              </div>
            </div>
            <span className={`text-xl font-extrabold transition-colors duration-300 ${
              scrolled ? 'text-[#1a1a2e]' : 'text-white'
            }`}>
              Funnel<span className={scrolled ? 'text-indigo-600' : 'text-indigo-400'}>Link</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-[15px] font-medium transition-colors duration-200 hover:opacity-100 ${
                  scrolled
                    ? 'text-[#1a1a2e]/70 hover:text-[#1a1a2e]'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className={`text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 ${
                scrolled
                  ? 'text-[#1a1a2e]/80 hover:text-[#1a1a2e] hover:bg-gray-100'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="btn-lime px-6 py-2.5 text-sm"
            >
              Sign up free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-[#1a1a2e]' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden shadow-xl"
          >
            <div className="px-6 py-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-[15px] font-medium text-[#1a1a2e] py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <hr className="border-gray-100 my-3" />
              <Link
                href="/login"
                className="block text-[15px] font-medium text-[#1a1a2e]/70 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="block btn-lime text-center text-[15px] px-6 py-3.5 mt-2"
              >
                Sign up free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
