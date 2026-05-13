import React from 'react';
import { LayoutGrid, Package, Settings, Star, ChevronDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ImageUpload } from '@/components/dashboard/ImageUpload';
import { Field, PanelTitle, inputClass } from '../ui';
import type { TabId } from '../types';

export default React.memo(function StorePanel({
  storeName,
  whatsappNumber,
  logoUrl,
  readiness,
  counts,
  isWizard = false,
  onChangeStoreName,
  onChangeWhatsApp,
  onChangeLogo,
  onJumpTo,
}: {
  storeName: string;
  whatsappNumber: string;
  logoUrl: string;
  readiness: { score: number; missingItems: Array<{ id: string; label: string }> };
  counts: { collections: number; products: number; reviews: number };
  isWizard?: boolean;
  onChangeStoreName: (value: string) => void;
  onChangeWhatsApp: (value: string) => void;
  onChangeLogo: (value: string) => void;
  onJumpTo: (tab: TabId) => void;
}) {
  const { score, missingItems } = readiness;

  return (
    <div className="space-y-8">
      <PanelTitle icon={Settings} label="Store Profile" meta="General Settings" />

      {/* Business Identity Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="absolute top-0 h-1.5 w-full bg-slate-900" />
        <div className="p-6">
          <div className="flex flex-col items-center gap-6 text-center">
            <div id="tour-store-logo" className="relative group">
              <div className="absolute -inset-2 rounded-3xl bg-slate-100 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-slate-200 shadow-inner">
                <ImageUpload defaultImage={logoUrl} onUploadComplete={onChangeLogo} />
              </div>
            </div>
            
            <div className="w-full space-y-5 text-left">
              <div id="tour-store-name">
                <Field label="Business Name">
                  <input
                    value={storeName}
                    onChange={(event) => onChangeStoreName(event.target.value)}
                    className={inputClass}
                    placeholder="e.g. Urban Living Furniture"
                  />
                </Field>
              </div>
              
              <div id="tour-store-whatsapp">
                <Field label="WhatsApp Lead Capture">
                <div className="flex gap-2">
                  <div className="relative w-32 shrink-0">
                    <select
                      value={(() => {
                        const commonCodes = ['91', '1', '44', '971', '65', '61', '966', '20'];
                        const found = commonCodes.find(code => whatsappNumber.startsWith(code));
                        return found || '91';
                      })()}
                      onChange={(e) => {
                        const newCode = e.target.value;
                        const oldCode = ['91', '1', '44', '971', '65', '61', '966', '20'].find(c => whatsappNumber.startsWith(c)) || '';
                        const rest = whatsappNumber.startsWith(oldCode) ? whatsappNumber.slice(oldCode.length) : whatsappNumber;
                        onChangeWhatsApp(newCode + rest);
                      }}
                      className={`${inputClass} appearance-none pr-8 text-xs font-bold`}
                    >
                      <option value="91">🇮🇳 +91</option>
                      <option value="1">🇺🇸 +1</option>
                      <option value="44">🇬🇧 +44</option>
                      <option value="971">🇦🇪 +971</option>
                      <option value="65">🇸🇬 +65</option>
                      <option value="61">🇦🇺 +61</option>
                      <option value="966">🇸🇦 +966</option>
                      <option value="20">🇪🇬 +20</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <ChevronDown size={12} />
                    </div>
                  </div>
                  <div className="relative flex-1">
                    <input
                      value={(() => {
                        const commonCodes = ['91', '1', '44', '971', '65', '61', '966', '20'];
                        const code = commonCodes.find(c => whatsappNumber.startsWith(c)) || '';
                        return whatsappNumber.startsWith(code) ? whatsappNumber.slice(code.length) : whatsappNumber;
                      })()}
                      onChange={(event) => {
                        const commonCodes = ['91', '1', '44', '971', '65', '61', '966', '20'];
                        const code = commonCodes.find(c => whatsappNumber.startsWith(c)) || '91';
                        const val = event.target.value.replace(/\D/g, ''); // Keep only digits
                        onChangeWhatsApp(code + val);
                      }}
                      className={inputClass}
                      placeholder="98765 43210"
                    />
                  </div>
                </div>
                <p className="mt-2 text-[10px] font-medium text-slate-400">
                  Leads will be sent to this number. Includes country code.
                </p>
              </Field>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isWizard && (
        <>
          {/* Funnel Readiness */}
          <div className="rounded-2xl border border-slate-900/5 bg-slate-900/[0.02] p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-900">Launch Readiness</p>
                <p className="text-[10px] font-medium text-slate-500">
                  {score === 100 ? 'Your funnel is perfectly optimized for launch.' : 'Complete these steps for maximum conversion.'}
                </p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-black shadow-sm border ${
                score === 100 ? 'border-emerald-200 text-emerald-600' : 'border-slate-200 text-slate-900'
              }`}>
                {score}%
              </div>
            </div>
            
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div 
                className={`absolute h-full rounded-full transition-all duration-700 ease-out ${
                  score === 100 ? 'bg-emerald-500' : 'bg-slate-900'
                }`} 
                style={{ width: `${score}%` }} 
              />
            </div>

            {missingItems.length > 0 && (
              <div className="mt-6 space-y-2">
                <p className="mb-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Action Needed</p>
                {missingItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => onJumpTo(item.id as TabId)}
                    className="flex w-full items-center justify-between rounded-xl bg-white p-3 text-left border border-slate-100 shadow-sm transition-all hover:border-slate-300 active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle size={14} className="text-amber-500" />
                      <span className="text-[11px] font-bold text-slate-700">{item.label}</span>
                    </div>
                    <div className="rounded-md bg-slate-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-tight text-slate-400">
                      Fix Now
                    </div>
                  </button>
                ))}
              </div>
            )}

            {score === 100 && (
              <div className="mt-6 flex items-center gap-3 rounded-xl bg-emerald-50 p-3 border border-emerald-100">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <p className="text-[11px] font-bold text-emerald-700">Ready for traffic. You're good to go!</p>
              </div>
            )}
          </div>

          {/* Quick Status */}
          <div>
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Inventory</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Collections', value: counts.collections, icon: LayoutGrid, tab: 'categories' as TabId, color: 'bg-blue-50 text-blue-600' },
                { label: 'Products', value: counts.products, icon: Package, tab: 'products' as TabId, color: 'bg-purple-50 text-purple-600' },
                { label: 'Reviews', value: counts.reviews, icon: Star, tab: 'testimonials' as TabId, color: 'bg-amber-50 text-amber-600' },
              ].map((metric) => (
                <button
                  key={metric.label}
                  onClick={() => onJumpTo(metric.tab)}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-slate-900 hover:shadow-lg hover:shadow-slate-900/5"
                >
                  <div className={`mb-4 flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${metric.color}`}>
                    <metric.icon size={16} />
                  </div>
                  <p className="text-2xl font-black tracking-tight text-slate-900">{metric.value}</p>
                  <p className="mt-1 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{metric.label}</p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
});
