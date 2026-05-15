'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Share2, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight
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
  { name: 'Products', href: '/dashboard/products', icon: Package, shortcut: '2' },
  { name: 'Funnels', href: '/dashboard/funnels', icon: Share2, shortcut: '3' },
  { name: 'Leads', href: '/dashboard/leads', icon: Users, shortcut: '4' },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, shortcut: '5' },
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

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-5 left-5 z-50 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-sm"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        ${collapsed ? 'w-[80px]' : 'w-[280px]'}
        flex flex-col bg-[#0A0A0A] border-r border-white/5
        transition-all duration-300 ease-in-out shadow-2xl shadow-black/50
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className={`h-20 flex items-center border-b border-white/5 ${collapsed ? 'px-4 justify-center' : 'px-8'}`}>
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-y-[-50%] skew-y-12"></div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            {!collapsed && (
              <span className="text-xl font-black text-white tracking-tight">
                Novex<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">iq</span>
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-8 overflow-y-auto no-scrollbar">
          {!collapsed && (
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-8">Workspace</p>
          )}
          <nav className={`space-y-1 ${collapsed ? 'px-3' : 'px-4'}`}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={`group relative flex items-center ${collapsed ? 'justify-center' : ''} gap-4 ${
                    collapsed ? 'px-0 py-3.5' : 'px-4 py-3.5'
                  } rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden ${
                    isActive 
                    ? 'bg-indigo-500/10 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {/* Active Background Glow */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-transparent opacity-50" />
                  )}

                  <Icon size={20} className={`flex-shrink-0 relative z-10 transition-colors ${isActive ? 'text-indigo-400' : 'group-hover:text-slate-300'}`} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 relative z-10">{item.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-1.5 py-0.5 rounded border border-white/10 relative z-10">
                        ⌘{item.shortcut}
                      </span>
                    </>
                  )}

                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
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
        <div className={`hidden lg:flex ${collapsed ? 'justify-center' : 'justify-end px-6'} py-4 border-t border-white/5`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition-all active:scale-95"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </button>
        </div>

        {/* User Area */}
        <div className={`border-t border-white/5 bg-black/20 ${collapsed ? 'p-4' : 'p-6'}`}>
          {collapsed ? (
            <Link
              href="/dashboard/settings"
              className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-lg hover:shadow-indigo-500/25 transition-all"
              title={displayName}
            >
              {displayName.charAt(0).toUpperCase()}
            </Link>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-lg shadow-indigo-500/25 border border-white/10">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{displayName}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate">Pro Plan</p>
                  </div>
                </div>
              </div>
              
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 border border-transparent transition-all group"
                >
                  <LogOut size={16} className="group-hover:text-red-400 transition-colors" />
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
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
