import { createClient } from '@/lib/supabase/server';
import { logout } from '@/app/actions/auth';
import ProfileSettingsForm from '@/components/dashboard/ProfileSettingsForm';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const initialName = user?.user_metadata?.full_name || '';
  const email = user?.email || '';

  return (
    <div className="space-y-8 animate-counter-up">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-base text-slate-500 font-medium mt-1">Manage your account, store branding, and integrations.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Profile Section */}
          <ProfileSettingsForm initialName={initialName} email={email} />
        </div>

        <div className="space-y-6">
           {/* Danger Zone */}
           <section className="bg-white rounded-[2rem] border border-red-100/50 overflow-hidden shadow-xl shadow-slate-200/40">
             <div className="p-7">
               <h2 className="text-sm font-black text-red-500 uppercase tracking-wider mb-2">Danger Zone</h2>
               <p className="text-xs text-slate-400 mb-5 leading-relaxed font-medium">Logging out will end your current session. Your data is safe and encrypted.</p>
               
               <form action={logout}>
                 <button className="w-full py-3 rounded-2xl bg-red-50 text-red-600 text-xs font-black uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 active:scale-95">
                   Log Out
                 </button>
               </form>
             </div>
           </section>
        </div>
      </div>
    </div>
  );
}
