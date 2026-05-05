'use client';

import { usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';

function isEditorRoute(pathname: string | null) {
  if (!pathname) return false;
  return pathname.includes('/dashboard/funnels/') && pathname.endsWith('/edit');
}

export default function DashboardShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const fullScreenEditor = isEditorRoute(pathname);

  if (fullScreenEditor) {
    return (
      <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
        <main className="flex-1 min-w-0 overflow-hidden">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10 lg:py-10">
          <div className="max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
