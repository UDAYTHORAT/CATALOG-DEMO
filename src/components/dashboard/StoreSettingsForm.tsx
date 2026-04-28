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
    <section className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Store size={18} />
           </div>
           <div>
              <h2 className="text-base font-bold text-slate-900">Store Settings</h2>
              <p className="text-xs text-slate-400">Public branding & WhatsApp routing</p>
           </div>
        </div>
        {isDirty && (
          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md flex items-center gap-1.5 animate-counter-up">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Unsaved changes
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
            <label className="text-xs font-semibold text-slate-500">Brand Name</label>
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
            <label className="text-xs font-semibold text-slate-500">WhatsApp Number</label>
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

        {/* WhatsApp preview */}
        {whatsapp && (
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100 animate-counter-up">
            <MessageCircle size={16} className="text-emerald-600 flex-shrink-0" />
            <p className="text-xs text-emerald-700">
              <span className="font-medium">Lead preview:</span> "Hi, I found your product on FunnelLink and I&apos;m interested!" → <span className="font-bold">{whatsapp}</span>
            </p>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-500">Store Bio</label>
            <span className="text-[10px] text-slate-300">{(store?.bio || '').length}/180</span>
          </div>
          <textarea
            name="bio"
            defaultValue={store?.bio || ''}
            rows={3}
            maxLength={180}
            onChange={markDirty}
            placeholder="Describe your brand..."
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all resize-none text-sm"
          />
          <p className="text-[10px] text-slate-400">Visible on all public funnel pages.</p>
        </div>
        
        <div className="pt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="relative px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={16} />
            {loading ? 'Saving...' : 'Save Settings'}
            {isDirty && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white" />
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
