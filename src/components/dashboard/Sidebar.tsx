'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Share2, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
  Sparkles
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { logout } from '@/app/actions/auth';

type SidebarUser = {
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
};

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, shortcut: '1' },
  { name: 'Funnels', href: '/dashboard/funnels', icon: Share2, shortcut: '2' },
  { name: 'Analytics', href: '/dashboard/leads', icon: Users, shortcut: '3' },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, shortcut: '4' },
];

export function Sidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const displayName = user?.user_metadata?.full_name || user?.email || 'User';

  // Auto-collapse on tablet-sized screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
        setCollapsed(true);
      } else if (window.innerWidth >= 1280) {
        setCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcut navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        const item = navItems.find(n => n.shortcut === e.key);
        if (item) {
          e.preventDefault();
          window.location.href = item.href;
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-5 left-5 z-50 p-2.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/60 text-slate-700 shadow-lg shadow-slate-200/50 active:scale-95 transition-all"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        ${collapsed ? 'w-[80px]' : 'w-[260px]'}
        flex flex-col bg-[#09090B] border-r border-white/[0.04]
        transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className={`h-[72px] flex items-center border-b border-white/[0.04] ${collapsed ? 'px-4 justify-center' : 'px-7'}`}>
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex-shrink-0 relative group-hover:scale-105 transition-transform duration-200">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-white p-0.5 flex items-center justify-center border border-white/10">
                <img src="/logo.jpeg" alt="FunnelLink Logo" className="max-w-full max-h-full object-contain" />
              </div>
            </div>
            {!collapsed && (
              <span className="text-[1.15rem] font-black text-white tracking-tight">
                Funnel<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Link</span>
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 overflow-y-auto no-scrollbar">
          {!collapsed && (
            <p className="text-[9px] font-extrabold text-white/20 uppercase tracking-[0.25em] mb-3 px-7">Workspace</p>
          )}
          <nav className={`space-y-0.5 ${collapsed ? 'px-3' : 'px-3'}`}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={`group relative flex items-center ${collapsed ? 'justify-center' : ''} gap-3.5 ${
                    collapsed ? 'px-0 py-3' : 'px-4 py-3'
                  } rounded-xl text-[13px] font-semibold transition-all duration-200 overflow-hidden ${
                    isActive 
                    ? 'bg-white/[0.08] text-white' 
                    : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-500 rounded-r-full shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
                  )}

                  <Icon size={18} className={`flex-shrink-0 relative z-10 transition-colors ${isActive ? 'text-indigo-400' : ''}`} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 relative z-10">{item.name}</span>
                      <kbd className="text-[9px] text-white/15 font-mono opacity-0 group-hover:opacity-100 transition-opacity px-1.5 py-0.5 rounded-md border border-white/[0.06] bg-white/[0.03] relative z-10">
                        ⌘{item.shortcut}
                      </kbd>
                    </>
                  )}

                  {/* Collapsed tooltip */}
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-slate-100">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Collapse Toggle (desktop only) */}
        <div className={`hidden lg:flex ${collapsed ? 'justify-center' : 'justify-end px-5'} py-3 border-t border-white/[0.04]`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl text-white/20 hover:text-white/60 hover:bg-white/[0.06] transition-all active:scale-95"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </button>
        </div>

        {/* User Area */}
        <div className={`border-t border-white/[0.04] ${collapsed ? 'p-3' : 'p-5'}`}>
          {collapsed ? (
            <Link
              href="/dashboard/settings"
              className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-lg hover:shadow-indigo-500/25 transition-all"
              title={displayName}
            >
              {displayName.charAt(0).toUpperCase()}
            </Link>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-indigo-500/20 border border-white/10">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate leading-tight">{displayName}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Sparkles size={10} className="text-amber-400" />
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-white/25">Pro Plan</p>
                  </div>
                </div>
              </div>
              
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[11px] font-bold text-white/25 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 transition-all group"
                >
                  <LogOut size={14} className="group-hover:text-red-400 transition-colors" />
                  Log out
                </button>
              </form>
            </>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
