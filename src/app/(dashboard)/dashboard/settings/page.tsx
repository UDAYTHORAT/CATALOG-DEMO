import { createClient } from '@/lib/supabase/server';
import { User } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import { getOrCreateStore } from '@/app/actions/stores';
import StoreSettingsForm from '@/components/dashboard/StoreSettingsForm';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const store = await getOrCreateStore();

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
          <section className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/40">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600 flex items-center justify-center shadow-inner border border-indigo-100/50">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Profile</h2>
                <p className="text-xs text-slate-400 font-medium">Your account information</p>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-500/30 border-2 border-white/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 translate-y-[-50%] skew-y-12" />
                  <span className="relative z-10">{(user?.user_metadata?.full_name || 'U').charAt(0)}</span>
                </div>
                <div>
                  <p className="text-xl font-black text-slate-900 tracking-tight">{user?.user_metadata?.full_name || 'User'}</p>
                  <p className="text-sm text-slate-400 font-medium mt-0.5">{user?.email}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Active</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Full Name</label>
                  <input type="text" defaultValue={user?.user_metadata?.full_name} disabled className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 font-medium text-sm cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Email</label>
                  <input type="email" defaultValue={user?.email} disabled className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 font-medium text-sm cursor-not-allowed" />
                </div>
              </div>
            </div>
          </section>

          {/* Store Section */}
          <StoreSettingsForm store={store} />
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
