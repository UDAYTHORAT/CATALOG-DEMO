import React from 'react';
import { 
  MessageCircle, 
  Phone, 
  Video, 
  MoreVertical, 
  CheckCheck, 
  Zap, 
  ArrowDown,
  MessageSquare,
  Layout
} from 'lucide-react';
import { Field, PanelTitle, subtleInputClass } from '../ui';
import type { WhatsAppData } from '../types';

export default React.memo(function WhatsAppPanel({
  data,
  storeName,
  whatsappNumber,
  onChange,
}: {
  data: WhatsAppData;
  storeName: string;
  whatsappNumber: string;
  onChange: (updates: Partial<WhatsAppData>) => void;
}) {
  // AUTO-MIGRATION: Detect legacy "Urban Living" and swap for dynamic "{store_name}"
  React.useEffect(() => {
    const updates: Partial<WhatsAppData> = {};
    
    if (data.welcomeMessage?.includes('Urban Living')) {
      updates.welcomeMessage = data.welcomeMessage.replaceAll('Urban Living', '{store_name}');
    }
    
    if (data.productInquiryText?.includes('Urban Living')) {
      updates.productInquiryText = data.productInquiryText.replaceAll('Urban Living', '{store_name}');
    }
    
    if (Object.keys(updates).length > 0) {
      onChange(updates);
    }
  }, [data.welcomeMessage, data.productInquiryText, onChange]);

  return (
    <div className="space-y-12 pb-20">
      <PanelTitle icon={MessageCircle} label="WhatsApp Strategy" meta="Sales Automation" />

      {/* 1. BRANDING & BUTTON IDENTITY */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white shadow-lg">
            <Layout size={14} />
          </div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">1. Button Appearance</h3>
        </div>

        <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <Field label="Help Title (Trust Hook)">
            <input 
              value={data.title} 
              onChange={(e) => onChange({ title: e.target.value })} 
              className={subtleInputClass} 
              placeholder="e.g. Get Best Price Instantly" 
            />
          </Field>
          
          <div className="h-px bg-slate-50" />

          <Field label="Support Tagline">
            <input 
              value={data.subTitle} 
              onChange={(e) => onChange({ subTitle: e.target.value })} 
              className={subtleInputClass} 
              placeholder="e.g. Chat directly with factory & save more" 
            />
          </Field>

          <div className="h-px bg-slate-50" />

          <Field label="Button CTA Text">
            <input 
              value={data.ctaText} 
              onChange={(e) => onChange({ ctaText: e.target.value })} 
              className={subtleInputClass} 
              placeholder="e.g. Get Best Deal on WhatsApp" 
            />
          </Field>
        </div>
      </section>

      <div className="flex justify-center text-slate-200">
        <ArrowDown size={24} strokeWidth={1} />
      </div>

      {/* 2. LIVE VISUAL PREVIEW SECTION */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Zap size={14} />
          </div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">2. Live Chat Preview</h3>
        </div>

        <div className="rounded-[2.5rem] border border-slate-200 bg-[#E5DDD5] overflow-hidden shadow-2xl">
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-[#075E54] font-black text-xs uppercase border-2 border-white/20">
                {storeName ? storeName.charAt(0) : 'S'}
              </div>
              <div>
                <p className="text-[12px] font-black tracking-tight leading-none">{storeName || 'Store Identity'}</p>
                <p className="mt-1 text-[8px] font-bold opacity-70 uppercase tracking-widest">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-4 opacity-70">
              <Video size={16} />
              <Phone size={14} />
              <MoreVertical size={16} />
            </div>
          </div>

          <div className="p-6 space-y-8 min-h-[300px]">
            <div className="space-y-2">
              <p className="text-center text-[8px] font-black uppercase tracking-widest text-slate-400">3.1 General Inquiry (Elite Structure)</p>
              <div className="bg-[#DCF8C6] ml-auto max-w-[85%] rounded-2xl rounded-tr-none p-4 shadow-sm relative">
                <p className="text-[11px] leading-relaxed text-slate-800 font-medium whitespace-pre-wrap">
                  {(data.welcomeMessage || 'Hi {store_name}, I’m planning to buy furniture...')
                    .replace('{store_name}', storeName || 'Store Identity')
                    .replace('Urban Living', storeName || 'Store Identity')}
                </p>
                <div className="mt-2 flex items-center justify-end gap-1 opacity-40">
                  <CheckCheck size={12} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-center text-[8px] font-black uppercase tracking-widest text-slate-400">3.2 Product Intent (Elite Structure)</p>
              <div className="bg-[#DCF8C6] ml-auto max-w-[85%] rounded-2xl rounded-tr-none p-4 shadow-sm relative">
                <p className="text-[11px] leading-relaxed text-slate-800 font-medium whitespace-pre-wrap">
                  {(data.productInquiryText || '')
                    .replace('{product_name}', 'Royal Oak Sofa')
                    .replace('{store_name}', storeName || 'Store Identity')
                    .replace('Urban Living', storeName || 'Store Identity')}
                </p>
                <div className="mt-2 flex items-center justify-end gap-1 opacity-40">
                  <CheckCheck size={12} className="text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-md p-3 flex items-center gap-3 px-6">
            <div className="flex-1 text-[11px] text-slate-400 font-bold uppercase tracking-widest italic">Type your message...</div>
            <div className="h-9 w-9 rounded-full bg-[#128C7E] flex items-center justify-center text-white shadow-lg">
              <MessageCircle size={18} fill="currentColor" />
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-center text-slate-200">
        <ArrowDown size={24} strokeWidth={1} />
      </div>

      {/* 3. AUTOMATION TEMPLATES */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
            <MessageSquare size={14} />
          </div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">3. Lead Automation</h3>
        </div>

        <div className="space-y-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">3.1 General Inquiry Message</span>
            <textarea
              value={data.welcomeMessage}
              onChange={(e) => onChange({ welcomeMessage: e.target.value })}
              rows={8}
              className={`${subtleInputClass} resize-none text-[12px] leading-relaxed py-4 bg-slate-50/50`}
              placeholder="Write a conversion-focused welcome message..."
            />
          </div>

          <div className="h-px bg-slate-100" />

          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">3.2 Product Intent Template</span>
            <textarea
              value={data.productInquiryText}
              onChange={(e) => onChange({ productInquiryText: e.target.value })}
              rows={8}
              className={`${subtleInputClass} resize-none text-[12px] leading-relaxed py-4 border-emerald-100 bg-emerald-50/10`}
              placeholder="Write a conversion-focused product inquiry..."
            />
            <div className="flex items-center gap-2 text-[10px] text-slate-400 italic">
              <span>Use</span>
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-black text-slate-600">{"{store_name}"}</code>
              <span>,</span>
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-black text-slate-600">{"{product_name}"}</code>
              <span>or</span>
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-black text-slate-600">{"{category}"}</code>
              <span>for dynamic text.</span>
            </div>
          </div>
        </div>
      </section>

      {/* STRATEGIC CONVERSION TIP */}
      <div className="rounded-[2rem] border border-emerald-900/5 bg-emerald-50/30 p-6 flex items-start gap-4">
        <div className="h-10 w-10 shrink-0 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
          <MessageCircle size={18} />
        </div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-wider text-emerald-900 mb-1">Elite Sales Engine</p>
          <p className="text-[10px] leading-relaxed text-emerald-800/80 font-medium">Structure your messages: Context → Request → Questions. Every message should feel like a buyer, not a browser.</p>
        </div>
      </div>
    </div>
  );
});
