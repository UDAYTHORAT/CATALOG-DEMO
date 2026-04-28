import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10 lg:py-10">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
