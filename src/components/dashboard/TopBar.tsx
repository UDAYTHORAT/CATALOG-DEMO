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
    
    const labelMap: Record<string, string> = {
      'dashboard': 'Dashboard',
      'funnels': 'Funnels',
      'leads': 'Analytics',
      'products': 'Products',
      'settings': 'Settings',
    };

    parts.forEach((part, i) => {
      const href = '/' + parts.slice(0, i + 1).join('/');
      const label = labelMap[part] || part.charAt(0).toUpperCase() + part.slice(1);
      crumbs.push({ label, href });
    });

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Get current page title for mobile
  const pageTitle = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : 'Dashboard';

  return (
    <>
      <header className="h-[60px] px-6 lg:px-10 flex items-center justify-between relative z-30 border-b border-slate-200/60 bg-white/70 backdrop-blur-2xl">
        {/* Breadcrumbs - hidden on mobile, shown on desktop */}
        <nav className="hidden sm:flex items-center gap-1 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={11} className="text-slate-300 mx-0.5" />}
              {i === breadcrumbs.length - 1 ? (
                <span className="font-bold text-slate-800 tracking-tight">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-slate-400 hover:text-slate-600 transition-colors font-medium text-[13px]">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Mobile title */}
        <h2 className="sm:hidden text-base font-bold text-slate-800 tracking-tight pl-12">{pageTitle}</h2>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50/80 border border-slate-100 text-slate-400 hover:text-slate-600 hover:border-slate-200 hover:bg-white transition-all text-sm group"
          >
            <Search size={14} className="group-hover:text-indigo-500 transition-colors" />
            <span className="text-[12px] font-medium text-slate-400">Search...</span>
            <kbd className="text-[9px] bg-white px-1.5 py-0.5 rounded-md border border-slate-200 font-mono text-slate-400 ml-4">⌘K</kbd>
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all active:scale-95">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 border-2 border-white" />
          </button>
        </div>
      </header>

      {/* Search Modal (⌘K Spotlight) */}
      {searchOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] animate-[fadeIn_0.15s_ease-out]"
            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
          />
          <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg z-[101] px-4 animate-[slideDown_0.2s_ease-out]">
            <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 border border-slate-200/80 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
                <Search size={18} className="text-indigo-500 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search funnels, analytics..."
                  className="flex-1 outline-none text-sm font-medium text-slate-900 placeholder:text-slate-300"
                />
                <kbd className="text-[9px] bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 font-mono text-slate-400 font-bold">ESC</kbd>
              </div>

              {/* Quick links */}
              <div className="p-3">
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.2em] px-3 mb-2">Quick Navigation</p>
                {navQuickLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-all font-medium group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                      <link.icon size={15} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <span className="flex-1 font-semibold text-[13px] group-hover:text-slate-900 transition-colors">{link.label}</span>
                    <ChevronRight size={13} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
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
  { label: 'Funnels', href: '/dashboard/funnels', icon: Share2 },
  { label: 'Analytics', href: '/dashboard/leads', icon: Users },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];
