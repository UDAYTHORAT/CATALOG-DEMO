'use client';

import { useState, useCallback } from 'react';
import { updateStoreSettings } from '@/app/actions/stores';
import type { Store as StoreRecord } from '@/app/actions/stores';
import { Store, MessageCircle, Save } from 'lucide-react';

export default function StoreSettingsForm({ store }: { store: StoreRecord | null }) {
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [whatsapp, setWhatsapp] = useState(store?.whatsapp_number || '');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const markDirty = useCallback(() => {
    if (!isDirty) setIsDirty(true);
  }, [isDirty]);

  async function handleAction(formData: FormData) {
    setLoading(true);
    setMessage(null);
    const res = await updateStoreSettings(formData);
    setLoading(false);
    
    if (res?.error) {
      setMessage({ type: 'error', text: res.error });
    } else {
      setIsDirty(false);
      setMessage({ type: 'success', text: 'Settings saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    }
  }

  return (
    <section className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/40">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600 flex items-center justify-center shadow-inner border border-amber-100/50">
              <Store size={20} />
           </div>
           <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Store Settings</h2>
              <p className="text-xs text-slate-400 font-medium">Public branding & WhatsApp routing</p>
           </div>
        </div>
        {isDirty && (
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-2 animate-counter-up border border-amber-100">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Unsaved
          </span>
        )}
      </div>
      
      <form action={handleAction} className="p-8 space-y-6">
        {/* Status message */}
        {message && (
          <div className={`p-3 rounded-xl border text-sm font-medium flex items-center gap-2 animate-counter-up ${
            message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Brand Name</label>
            <input 
              type="text" 
              name="name" 
              defaultValue={store?.name || ''} 
              placeholder="e.g. Minimalist Home Pune" 
              required
              onChange={markDirty}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all text-sm" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">WhatsApp Number</label>
            <input 
              type="text" 
              name="whatsapp_number" 
              value={whatsapp}
              onChange={(e) => { setWhatsapp(e.target.value); markDirty(); }}
              placeholder="+91 98765 43210" 
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all text-sm" 
            />
          </div>
        </div>




        <div className="pt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="relative px-7 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-black uppercase tracking-wider hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 disabled:opacity-50 flex items-center gap-2 active:scale-95"
          >
            <Save size={16} />
            {loading ? 'Saving...' : 'Save Settings'}
            {isDirty && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white animate-pulse" />
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
