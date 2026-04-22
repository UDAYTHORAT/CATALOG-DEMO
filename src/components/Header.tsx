'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }} animate={{ y: 0 }}
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-8 py-6 md:px-20 ${isScrolled ? 'bg-white/90 backdrop-blur-md py-4 border-b border-gray-100' : 'bg-transparent'}`}
    >
      <div className="max-w-[1800px] mx-auto flex justify-between items-center">
        <Link href="/"><h1 className="text-xl md:text-3xl font-serif tracking-widest text-obsidian tracking-[0.3em]">AURELIAN</h1></Link>
        <nav className="hidden md:flex items-center gap-10">
          <Link href="/catalog" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gold transition-colors">Catalog</Link>
          <Link href="/catalog/compare" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gold transition-colors">Compare</Link>
          <Link href="/bespoke" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gold transition-colors">Bespoke</Link>
          <Link href="/contact" className="px-8 py-3 bg-obsidian text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gold transition-all">Enquire</Link>
        </nav>
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(v => !v)}
          className="md:hidden flex flex-col gap-[5px] p-2 z-[110]"
          aria-label="Toggle menu"
        >
          <motion.span animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 7 : 0 }} className="block w-6 h-[2px] bg-current transition-colors" />
          <motion.span animate={{ opacity: mobileMenuOpen ? 0 : 1 }} className="block w-6 h-[2px] bg-current" />
          <motion.span animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -7 : 0 }} className="block w-6 h-[2px] bg-current transition-colors" />
        </button>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white z-[105] flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {[
              { href: '/catalog', label: 'Catalog' },
              { href: '/catalog/compare', label: 'Compare' },
              { href: '/bespoke', label: 'Bespoke' },
              { href: '/contact', label: 'Enquire' },
            ].map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-chubbo tracking-tight text-obsidian hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
