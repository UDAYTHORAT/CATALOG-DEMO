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
        ${collapsed ? 'w-[72px]' : 'w-[260px]'}
        flex flex-col bg-white border-r border-slate-100
        transition-all duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className={`h-16 flex items-center border-b border-slate-50 ${collapsed ? 'px-4 justify-center' : 'px-6'}`}>
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            {!collapsed && (
              <span className="text-base font-bold text-slate-900 tracking-tight">
                Funnel<span className="text-indigo-600">Link</span>
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 overflow-y-auto no-scrollbar">
          {!collapsed && (
            <p className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest mb-3 px-6">Workspace</p>
          )}
          <nav className={`space-y-0.5 ${collapsed ? 'px-2' : 'px-3'}`}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={`group relative flex items-center ${collapsed ? 'justify-center' : ''} gap-3 ${
                    collapsed ? 'px-0 py-3' : 'px-3 py-2.5'
                  } rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={18} className={`flex-shrink-0 ${isActive ? 'text-indigo-600' : ''}`} />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      <span className="text-[10px] text-slate-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        ⌘{item.shortcut}
                      </span>
                    </>
                  )}

                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-600 rounded-r-full" />
                  )}

                  {/* Collapsed tooltip */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Collapse Toggle (desktop only) */}
        <div className={`hidden lg:flex ${collapsed ? 'justify-center' : 'justify-end px-4'} py-2 border-t border-slate-50`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </button>
        </div>

        {/* User Area */}
        <div className={`border-t border-slate-100 ${collapsed ? 'p-3' : 'p-4'}`}>
          {collapsed ? (
            <Link
              href="/dashboard/settings"
              className="w-10 h-10 mx-auto rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm hover:bg-indigo-100 transition-colors"
              title={displayName}
            >
              {displayName.charAt(0).toUpperCase()}
            </Link>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{displayName}</p>
                  <p className="text-[11px] text-slate-400 truncate">Pro Plan</p>
                </div>
              </div>
              
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut size={14} />
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
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
