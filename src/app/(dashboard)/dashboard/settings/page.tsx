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
    <div className="space-y-6 animate-counter-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your profile and store configuration.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Profile Section */}
          <section className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <User size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Profile</h2>
                <p className="text-xs text-slate-400">Your account information</p>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {(user?.user_metadata?.full_name || 'U').charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{user?.user_metadata?.full_name || 'User'}</p>
                  <p className="text-sm text-slate-400">{user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">Full Name</label>
                  <input type="text" defaultValue={user?.user_metadata?.full_name} disabled className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 font-medium text-sm cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">Email</label>
                  <input type="email" defaultValue={user?.email} disabled className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 font-medium text-sm cursor-not-allowed" />
                </div>
              </div>
            </div>
          </section>

          {/* Store Section */}
          <StoreSettingsForm store={store} />
        </div>

        <div className="space-y-6">
           {/* Help Card */}
           <div className="bg-slate-900 rounded-[1.5rem] p-6 text-white">
              <h3 className="text-base font-bold mb-2">Need help?</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-5">Our team is ready to assist with advanced configurations.</p>
              <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold transition-all">
                Contact Support
              </button>
           </div>

           {/* Danger Zone */}
           <section className="bg-white rounded-[1.5rem] border border-red-100 overflow-hidden">
             <div className="p-6">
               <h2 className="text-sm font-bold text-red-500 mb-2">Danger Zone</h2>
               <p className="text-xs text-slate-400 mb-4 leading-relaxed">Logging out will end your current session. Your data is safe.</p>
               
               <form action={logout}>
                 <button className="w-full py-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-500 hover:text-white transition-all">
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
