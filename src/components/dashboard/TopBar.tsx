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
      <header className="h-14 px-6 lg:px-8 flex items-center justify-between relative z-30 border-b border-slate-50">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={12} className="text-slate-300" />}
              {i === breadcrumbs.length - 1 ? (
                <span className="font-semibold text-slate-900">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-slate-400 hover:text-slate-600 transition-colors">
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
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-600 hover:border-slate-200 transition-all text-sm"
          >
            <Search size={14} />
            <span className="text-xs">Search...</span>
            <kbd className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-slate-400 ml-4">⌘K</kbd>
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 border border-white" />
          </button>
        </div>
      </header>

      {/* Search Modal (⌘K Spotlight) */}
      {searchOpen && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[100]"
            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
          />
          <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg z-[101] animate-counter-up">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
                <Search size={18} className="text-slate-400 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, funnels, leads..."
                  className="flex-1 outline-none text-sm font-medium text-slate-900 placeholder:text-slate-300"
                />
                <kbd className="text-[10px] bg-slate-50 px-2 py-1 rounded border border-slate-200 font-mono text-slate-400">ESC</kbd>
              </div>

              {/* Quick links */}
              <div className="p-3">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">Quick Navigation</p>
                {navQuickLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors font-medium"
                  >
                    <link.icon size={16} className="text-slate-400" />
                    {link.label}
                    <ChevronRight size={12} className="text-slate-300 ml-auto" />
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
