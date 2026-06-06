'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User, Loader2, Check } from 'lucide-react';

interface ProfileSettingsFormProps {
  initialName: string;
  email: string;
}

export default function ProfileSettingsForm({ initialName, email }: ProfileSettingsFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: name.trim() }
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/40">
      <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600 flex items-center justify-center shadow-inner border border-indigo-100/50">
          <User size={20} />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Profile Settings</h2>
          <p className="text-xs text-slate-400 font-medium">Update your account display name</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-500/30 border-2 border-white/20 relative overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-white/10 translate-y-[-50%] skew-y-12" />
            <span className="relative z-10">{(name || initialName || 'U').charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 tracking-tight">{name || initialName || 'User'}</p>
            <p className="text-sm text-slate-400 font-medium mt-0.5">{email}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Active</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-semibold text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              title="Email address cannot be changed"
              className="w-full px-4 py-3 rounded-xl bg-slate-50/55 border border-slate-200/50 text-slate-400 font-medium text-sm cursor-not-allowed"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs font-bold text-red-500 bg-red-50 px-4 py-2.5 rounded-xl border border-red-100">{error}</p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          {success && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl">
              <Check size={14} />
              Saved changes successfully
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-600 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
