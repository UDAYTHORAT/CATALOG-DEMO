'use client';

import { Bell, Search, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export function TopBar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ⌘K keyboard shortcut
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Auto-focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Build breadcrumbs from pathname
  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean);
    const crumbs: { label: string; href: string }[] = [];
    
    parts.forEach((part, i) => {
      const href = '/' + parts.slice(0, i + 1).join('/');
      const label = part.charAt(0).toUpperCase() + part.slice(1);
      crumbs.push({ label, href });
    });

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <>
      <header className="h-16 px-6 lg:px-10 flex items-center justify-between relative z-30 border-b border-slate-100/80 bg-white/60 backdrop-blur-xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={12} className="text-slate-300" />}
              {i === breadcrumbs.length - 1 ? (
                <span className="font-black text-slate-900 tracking-tight">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-slate-400 hover:text-slate-600 transition-colors font-medium">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-600 hover:border-slate-200 hover:bg-white transition-all text-sm group"
          >
            <Search size={14} className="group-hover:text-indigo-500 transition-colors" />
            <span className="text-xs font-medium">Search...</span>
            <kbd className="text-[10px] bg-white px-1.5 py-0.5 rounded-md border border-slate-200 font-mono text-slate-400 ml-6">⌘K</kbd>
          </button>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all active:scale-95">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 border-2 border-white shadow-[0_0_6px_rgba(99,102,241,0.6)]" />
          </button>
        </div>
      </header>

      {/* Search Modal (⌘K Spotlight) */}
      {searchOpen && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
          />
          <div className="fixed top-[12%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[101] animate-counter-up px-4">
            <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
                <Search size={20} className="text-indigo-500 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, funnels, leads..."
                  className="flex-1 outline-none text-base font-medium text-slate-900 placeholder:text-slate-300"
                />
                <kbd className="text-[10px] bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 font-mono text-slate-400 font-bold">ESC</kbd>
              </div>

              {/* Quick links */}
              <div className="p-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-3 mb-3">Quick Navigation</p>
                {navQuickLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-all font-medium group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <link.icon size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <span className="flex-1 font-bold group-hover:text-slate-900 transition-colors">{link.label}</span>
                    <ChevronRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// Quick navigation links for the search modal
import { LayoutDashboard, Package, Share2, Users, Settings } from 'lucide-react';

const navQuickLinks = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/dashboard/products', icon: Package },
  { label: 'Funnels', href: '/dashboard/funnels', icon: Share2 },
  { label: 'Leads', href: '/dashboard/leads', icon: Users },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];
