'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Determine text color based on scroll state or menu open state
  // We use obsidian when scrolled or menu is open, otherwise white
  const headerTextColor = isScrolled || mobileMenuOpen ? 'text-obsidian' : 'text-white';
  const navLinkColor = isScrolled || mobileMenuOpen ? 'text-obsidian/60 hover:text-gold' : 'text-white/80 hover:text-white';

  return (
    <motion.header
      initial={{ y: -100 }} animate={{ y: 0 }}
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-6 py-4 md:px-20 md:py-6 ${isScrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-100' : 'bg-transparent'}`}
    >
      <div className="max-w-[1800px] mx-auto flex justify-between items-center relative z-[110]">
        <Link href="/">
          <h1 className={`text-xl md:text-3xl font-serif tracking-[0.3em] transition-colors duration-500 ${headerTextColor}`}>
            AURELIAN
          </h1>
        </Link>
        
        <nav className="hidden md:flex items-center gap-10">
          <Link href="/collection" className={`text-[10px] font-black uppercase tracking-widest transition-colors ${navLinkColor}`}>Collection</Link>
          <Link href="/catalog" className={`text-[10px] font-black uppercase tracking-widest transition-colors ${navLinkColor}`}>Archive</Link>
          <Link href="/catalog/compare" className={`text-[10px] font-black uppercase tracking-widest transition-colors ${navLinkColor}`}>Compare</Link>
          <Link href="/contact" className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isScrolled ? 'bg-obsidian text-white hover:bg-gold' : 'bg-white text-obsidian hover:bg-gold hover:text-white'}`}>Enquire</Link>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(v => !v)}
          className={`md:hidden flex flex-col gap-[6px] p-2 transition-colors ${headerTextColor}`}
          aria-label="Toggle menu"
        >
          <motion.span 
            animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 8 : 0 }} 
            className="block w-6 h-[1.5px] bg-current transition-all" 
          />
          <motion.span 
            animate={{ opacity: mobileMenuOpen ? 0 : 1, x: mobileMenuOpen ? 10 : 0 }} 
            className="block w-6 h-[1.5px] bg-current transition-all" 
          />
          <motion.span 
            animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -8 : 0 }} 
            className="block w-6 h-[1.5px] bg-current transition-all" 
          />
        </button>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-white z-[105] flex flex-col pt-32 px-8 md:hidden"
          >
            <div className="flex flex-col gap-6">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold mb-2 block">Navigation</span>
              {[
                { href: '/collection', label: 'The Collection' },
                { href: '/catalog', label: 'The Archive' },
                { href: '/catalog/compare', label: 'Compare Pieces' },
                { href: '/contact', label: 'Start an Enquiry' },
              ].map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-4xl font-chubbo tracking-tighter text-obsidian hover:text-gold transition-colors block"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto pb-12">
              <div className="h-[1px] bg-gray-100 w-full mb-8" />
              <div className="flex flex-col gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <span>London — Milan — New York</span>
                <span className="text-gold">© 2024 Aurelian Studio</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
