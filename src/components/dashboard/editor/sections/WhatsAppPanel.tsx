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
  Layout,
  Sparkles,
  MapPin,
  Plus,
  Trash2,
  LayoutDashboard,
  X,
  HelpCircle,
  Pencil
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Field, PanelTitle, subtleInputClass } from '../ui';
import type { WhatsAppData } from '../types';

const DEFAULT_CONCIERGE_OPTIONS: { label: string; action: string; message?: string }[] = [
  { 
    label: 'Explore Availability', 
    action: 'explore current availability',
    message: 'Hello {company_name},\n\nI would like to explore current availability for the {residence}.\n\nPlease share the next steps.' 
  },
  { 
    label: 'Request Floorplans', 
    action: 'request detailed floorplans',
    message: 'Hello {company_name},\n\nI would like to request detailed floorplans for the {residence}.\n\nPlease share the next steps.' 
  },
  { 
    label: 'Arrange Viewing', 
    action: 'arrange a private viewing',
    message: 'Hello {company_name},\n\nI would like to arrange a private viewing for the {residence}.\n\nPlease share the next steps.' 
  },
  { 
    label: 'Investment Details', 
    action: 'discuss investment details',
    message: 'Hello {company_name},\n\nI would like to discuss investment details for the {residence}.\n\nPlease share the next steps.' 
  },
];

const DEFAULT_VISIT_OPTIONS = ['Morning Tour', 'Sunset Viewing', 'Weekend Visit'];

const DEFAULT_CONCIERGE_MSG = 'Hello {company_name},\n\nI would like to {intent} for the {residence}.\n\nPlease share the next steps.';
const DEFAULT_VISIT_MSG = 'Hello {company_name},\n\nI would like to arrange a {tour_type} for the {residence}.\n\nPlease let me know your availability.';
const DEFAULT_ROOM_INQUIRY_CTA = 'Enquire About This Residence';
const DEFAULT_ROOM_INQUIRY_MSG = 'Hello {company_name},\n\nI am currently exploring the {room_name} inside the {residence_name}.\n\nPlease share the detailed floorplans, pricing, and availability for this residence.';

const HelpGuide = ({ title, description, proTip, dos, donts, targetId }: { title: string, description?: string, proTip?: string, dos: string[], donts: string[], targetId?: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [hl, setHl] = React.useState<any>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen || !targetId) {
      setHl(null);
      return;
    }
    const updateHl = () => {
      const el = document.getElementById(targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        const padding = 12;
        setHl({
          top: rect.top - padding,
          left: rect.left - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
        });
      }
    };
    updateHl();
    const interval = setInterval(updateHl, 50);
    return () => clearInterval(interval);
  }, [isOpen, targetId]);

  return (
    <>
      <div className={`relative ml-auto flex items-center justify-center ${isOpen ? 'z-[202]' : 'z-10'}`} ref={dropdownRef}>
        <button 
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${isOpen ? 'bg-indigo-600 text-white border-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.3)] hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]'}`}
        >
          <span className="text-[11px] font-black">?</span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute top-full right-0 mt-3 z-50 w-80 origin-top-right"
            >
              <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col border border-slate-200">
                <div className="h-1 shrink-0 bg-indigo-500" />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-600">
                      <HelpCircle size={10} />
                      Guide
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700">
                      <X size={14} />
                    </button>
                  </div>
                  <h3 className="text-[22px] leading-[1.1] text-slate-900 mb-2" style={{ fontFamily: "'Tanker', serif" }}>{title}</h3>
                  {description && <p className="text-[12px] text-slate-500 leading-relaxed mb-4">{description}</p>}
                  
                  {proTip && (
                    <div className="p-3.5 rounded-xl bg-indigo-50 mb-4">
                      <p className="text-[12px] font-semibold text-slate-700 leading-snug">{proTip}</p>
                    </div>
                  )}

                  <div className="space-y-3 text-[10px] leading-relaxed border-t border-slate-100 pt-4 mt-2">
                    <div>
                      <p className="font-bold text-emerald-600 mb-1 flex items-center gap-1"><CheckCheck size={10} /> DO THIS</p>
                      <ul className="list-disc pl-3 text-slate-600 space-y-1">
                        {dos.map((d, i) => <li key={i}>{d}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold text-rose-500 mb-1 flex items-center gap-1"><Trash2 size={10} /> AVOID</p>
                      <ul className="list-disc pl-3 text-slate-600 space-y-1">
                        {donts.map((d, i) => <li key={i}>{d}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Global Highlight Overlay */}
      <AnimatePresence>
        {isOpen && hl && typeof window !== 'undefined' && (
          <div className="fixed inset-0 z-[200] pointer-events-none">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-auto" onClick={() => setIsOpen(false)}>
              <div className="absolute top-0 left-0 right-0 bg-black/40" style={{ height: hl.top }} />
              <div className="absolute left-0 right-0 bottom-0 bg-black/40" style={{ top: hl.top + hl.height }} />
              <div className="absolute bg-black/40" style={{ top: hl.top, left: 0, width: hl.left, height: hl.height }} />
              <div className="absolute bg-black/40" style={{ top: hl.top, left: hl.left + hl.width, right: 0, height: hl.height }} />
            </motion.div>
            
            <motion.div
              layoutId="help-highlight"
              className="absolute z-[201] pointer-events-none border-2 border-indigo-400 ring-4 ring-indigo-400/30 rounded-3xl"
              style={hl}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default React.memo(function WhatsAppPanel({
  data,
  storeName,
  whatsappNumber,
  onChange,
  isRealEstate,
}: {
  data: WhatsAppData;
  storeName: string;
  whatsappNumber: string;
  onChange: (updates: Partial<WhatsAppData>) => void;
  isRealEstate?: boolean;
}) {
  // AUTO-MIGRATION: Detect legacy placeholders and swap them based on context
  React.useEffect(() => {
    const updates: Partial<WhatsAppData> = {};
    
    let welcomeMsg = data.welcomeMessage || '';
    let productMsg = data.productInquiryText || '';

    // Base migration
    if (welcomeMsg.includes('Urban Living')) {
      welcomeMsg = welcomeMsg.replaceAll('Urban Living', '{store_name}');
    }
    if (productMsg.includes('Urban Living')) {
      productMsg = productMsg.replaceAll('Urban Living', '{store_name}');
    }

    // Real Estate Specific Migration
    if (isRealEstate) {
      if (welcomeMsg.includes('{store_name}')) {
        welcomeMsg = welcomeMsg.replaceAll('{store_name}', '{company_name}');
      }
      if (welcomeMsg.includes('{product_name}')) {
        welcomeMsg = welcomeMsg.replaceAll('{product_name}', '{residence}');
      }

      if (productMsg.includes('{store_name}')) {
        productMsg = productMsg.replaceAll('{store_name}', '{company_name}');
      }
      if (productMsg.includes('{product_name}')) {
        productMsg = productMsg.replaceAll('{product_name}', '{residence}');
      }

      // Migrate legacy Furniture defaults to Action Bar Navigation
      if (['Get Floor Plan Instantly', 'Get Best Price Instantly', 'Get Best Deal Instantly', undefined].includes(data.title)) {
        updates.title = 'Chat';
      }
      if (['Luxury advisors reply within minutes', 'Chat directly with factory & save more', undefined].includes(data.subTitle)) {
        updates.subTitle = 'Visit';
      }
      if (['Get Floor Plan on WhatsApp', 'Get Best Deal on WhatsApp', undefined].includes(data.ctaText)) {
        updates.ctaText = 'Explore';
      }
    }

    if (welcomeMsg !== (data.welcomeMessage || '')) {
      updates.welcomeMessage = welcomeMsg;
    }
    if (productMsg !== (data.productInquiryText || '')) {
      updates.productInquiryText = productMsg;
    }

    if (isRealEstate) {
      if (!data.roomInquiryCtaText) {
        updates.roomInquiryCtaText = DEFAULT_ROOM_INQUIRY_CTA;
      }
      if (!data.roomInquiryMessageTemplate) {
        updates.roomInquiryMessageTemplate = DEFAULT_ROOM_INQUIRY_MSG;
      }
    }
    
    if (Object.keys(updates).length > 0) {
      onChange(updates);
    }
  }, [
    data.welcomeMessage, 
    data.productInquiryText, 
    data.title, 
    data.subTitle, 
    data.ctaText, 
    data.roomInquiryCtaText,
    data.roomInquiryMessageTemplate,
    onChange, 
    isRealEstate
  ]);

  const conciergeOptions = data.conciergeOptions || DEFAULT_CONCIERGE_OPTIONS;
  const visitOptions = data.visitOptions || DEFAULT_VISIT_OPTIONS;

  return (
    <div className="space-y-12 pb-20">
      <PanelTitle icon={MessageCircle} label={isRealEstate ? "Concierge & WhatsApp" : "WhatsApp Strategy"} meta={isRealEstate ? "Buyer Communication" : "Sales Automation"} />

      {/* 1. BRANDING & BUTTON IDENTITY */}
      <section id="tour-whatsapp-button" className="space-y-6">
        <div className="flex items-center gap-3 px-1 relative z-10">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white shadow-lg">
            <Layout size={14} />
          </div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">
            {isRealEstate ? "1. Action Bar Navigation" : "1. Button Appearance"}
          </h3>
          <HelpGuide 
            targetId="tour-whatsapp-button"
            title={isRealEstate ? "Action Bar Labels" : "Button Appearance"}
            description={isRealEstate ? "Customize the labels for the sticky Action Bar at the bottom of the screen." : "Customize the floating WhatsApp button title, tagline, and call-to-action text."}
            proTip={isRealEstate ? "Use clear, punchy actions like 'Explore', 'Chat', or 'Visit'." : "Make it irresistible. Instead of 'Contact Us', use 'Get Floor Plan Instantly'."}
            dos={isRealEstate ? ["Keep labels under 8 characters.", "Use direct verbs."] : ["Use clear action verbs (e.g., Get, View, Explore).", "Focus on immediate value for the buyer."]}
            donts={isRealEstate ? ["Don't use long sentences.", "Avoid confusing terminology."] : ["Don't use generic text like 'Contact Us'.", "Avoid long, wordy descriptions."]}
          />
        </div>

        <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <Field label={isRealEstate ? "Primary Action (Chat)" : "Help Title (Trust Hook)"}>
            <input 
              value={data.title === undefined ? (isRealEstate ? 'Chat' : '') : data.title} 
              onChange={(e) => onChange({ title: e.target.value })} 
              className={subtleInputClass} 
              placeholder={isRealEstate ? "e.g. Chat" : "e.g. Get Best Price Instantly"} 
            />
          </Field>
          
          <div className="h-px bg-slate-50" />

          <Field label={isRealEstate ? "Secondary Action (Visit)" : "Support Tagline"}>
            <input 
              value={data.subTitle === undefined ? (isRealEstate ? 'Visit' : '') : data.subTitle} 
              onChange={(e) => onChange({ subTitle: e.target.value })} 
              className={subtleInputClass} 
              placeholder={isRealEstate ? "e.g. Visit" : "e.g. Chat directly with factory & save more"} 
            />
          </Field>

          <div className="h-px bg-slate-50" />

          <Field label={isRealEstate ? "Tertiary Action (Explore)" : "Button CTA Text"}>
            <input 
              value={data.ctaText === undefined ? (isRealEstate ? 'Explore' : '') : data.ctaText} 
              onChange={(e) => onChange({ ctaText: e.target.value })} 
              className={subtleInputClass} 
              placeholder={isRealEstate ? "e.g. Explore" : "e.g. Get Best Deal on WhatsApp"} 
            />
          </Field>
        </div>
      </section>

      {isRealEstate && (
        <>
          <div className="flex justify-center text-slate-200">
            <ArrowDown size={24} strokeWidth={1} />
          </div>

          {/* 2. CONCIERGE CHAT OPTIONS */}
          <section id="tour-whatsapp-concierge" className="space-y-6">
            <div className="flex items-center gap-3 px-1 relative z-10">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Sparkles size={14} />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">2. Concierge Chat Options</h3>
              <HelpGuide 
                targetId="tour-whatsapp-concierge"
                title="Concierge Chat Options"
                description="Define the intent-based options buyers see when they click the WhatsApp button."
                proTip="Provide exactly 3-4 distinct intent options and keep the {residence} placeholder to maintain context."
                dos={["Provide exactly 3-4 distinct intent options.", "Use {residence} to keep the message highly contextual."]}
                donts={["Don't create overlapping or confusing options.", "Don't remove the {company_name} placeholder."]}
              />
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <p className="text-[10px] text-slate-400 leading-relaxed">
                These options appear in the <strong className="text-slate-600">Chat</strong> popup. Each guides the buyer through a focused intent flow.
              </p>
              
              <div id="tour-whatsapp-concierge" className="space-y-3">
                {conciergeOptions.map((opt, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden relative group transition-all hover:shadow-md">
                    {/* Header: Label Input */}
                    <div className="bg-slate-50 border-b border-slate-100 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 w-full max-w-[80%] group/input relative">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-black text-white shadow-sm">{i + 1}</span>
                        <div className="relative w-full flex items-center">
                          <input
                            value={opt.label}
                            onChange={(e) => {
                              const updated = [...conciergeOptions];
                              updated[i] = { ...updated[i], label: e.target.value };
                              onChange({ conciergeOptions: updated });
                            }}
                            className="bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white px-1.5 py-1 text-sm font-bold text-slate-800 placeholder-slate-400 focus:ring-0 w-full transition-all outline-none"
                            placeholder="e.g. Explore Availability"
                            title="Edit this chat option label"
                          />
                          <Pencil size={12} className="absolute right-2 text-slate-400 opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                      </div>
                      {conciergeOptions.length > 1 && (
                        <button
                          onClick={() => {
                            const updated = conciergeOptions.filter((_, idx) => idx !== i);
                            onChange({ conciergeOptions: updated });
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                          title="Remove option"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    
                    {/* Body: Pre-filled Message */}
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-2 flex items-center gap-2">
                          <MessageSquare size={12} />
                          Pre-filled Chat Message
                        </label>
                        <textarea
                          value={opt.message || ''}
                          onChange={(e) => {
                            const updated = [...conciergeOptions];
                            updated[i] = { ...updated[i], message: e.target.value };
                            onChange({ conciergeOptions: updated });
                          }}
                          rows={3}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-[12px] leading-relaxed text-slate-700 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all resize-none"
                          placeholder={`Hello {company_name},\n\nI would like to ${opt.action || 'explore details'} for the {residence}.\n\nPlease share the next steps.`}
                        />
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className="text-[9px] text-slate-400 italic mr-1">Placeholders:</span>
                          <code className="rounded bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 not-italic">{"{company_name}"}</code>
                          <code className="rounded bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 not-italic">{"{residence}"}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {conciergeOptions.length < 6 && (
                <button
                  onClick={() => {
                    onChange({ conciergeOptions: [...conciergeOptions, { label: '', action: '', message: 'Hello {company_name},\n\nI would like to explore details for the {residence}.\n\nPlease share the next steps.' }] });
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all text-[10px] font-bold uppercase tracking-wider"
                >
                  <Plus size={14} />
                  Add Chat Option
                </button>
              )}


            </div>
          </section>

          <div className="flex justify-center text-slate-200">
            <ArrowDown size={24} strokeWidth={1} />
          </div>

          {/* 3. VISIT / TOUR OPTIONS */}
          <section id="tour-whatsapp-visit" className="space-y-6">
            <div className="flex items-center gap-3 px-1 relative z-10">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                <MapPin size={14} />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">3. Site Visit Options</h3>
              <HelpGuide 
                targetId="tour-whatsapp-visit"
                title="Site Visit Options"
                description="Set up curated tour experiences for the property (e.g. Morning Tour, Sunset Viewing)."
                proTip="Keep the options punchy and experiential to encourage bookings."
                dos={["Offer curated time slots or tour experiences.", "Keep the options punchy (e.g., Sunset Viewing)."]}
                donts={["Don't ask them to type their own time.", "Avoid using more than 4 visit options."]}
              />
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <p className="text-[10px] text-slate-400 leading-relaxed">
                These appear in the <strong className="text-slate-600">Visit</strong> popup. Buyers pick a tour type after selecting a residence.
              </p>

              <div id="tour-whatsapp-visit" className="space-y-3">
                {visitOptions.map((tour, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-[9px] font-black text-emerald-600">{i + 1}</span>
                    <input
                      value={tour}
                      onChange={(e) => {
                        const updated = [...visitOptions];
                        updated[i] = e.target.value;
                        onChange({ visitOptions: updated });
                      }}
                      className={`${subtleInputClass} flex-1`}
                      placeholder={`e.g. ${DEFAULT_VISIT_OPTIONS[i] || 'Custom Tour'}`}
                    />
                    {visitOptions.length > 1 && (
                      <button
                        onClick={() => {
                          const updated = visitOptions.filter((_, idx) => idx !== i);
                          onChange({ visitOptions: updated });
                        }}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                        title="Remove option"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {visitOptions.length < 5 && (
                <button
                  onClick={() => {
                    onChange({ visitOptions: [...visitOptions, ''] });
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50/30 transition-all text-[10px] font-bold uppercase tracking-wider"
                >
                  <Plus size={14} />
                  Add Visit Option
                </button>
              )}

              {/* Visit Message Template */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare size={13} className="text-emerald-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Pre-filled Visit Message</span>
                </div>
                <textarea
                  value={data.visitMessageTemplate || DEFAULT_VISIT_MSG}
                  onChange={(e) => onChange({ visitMessageTemplate: e.target.value })}
                  rows={4}
                  className={`${subtleInputClass} resize-none text-[12px] leading-relaxed py-3 bg-emerald-50/10 border-emerald-100`}
                  placeholder={DEFAULT_VISIT_MSG}
                />
                <div className="flex flex-wrap items-center gap-1.5 text-[9px] text-slate-400 italic">
                  <span>Placeholders:</span>
                  <code className="rounded bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 font-bold text-emerald-700 not-italic">{"{company_name}"}</code>
                  <code className="rounded bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 font-bold text-emerald-700 not-italic">{"{tour_type}"}</code>
                  <code className="rounded bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 font-bold text-emerald-700 not-italic">{"{residence}"}</code>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* 4. ROOM EXPLORER INQUIRY */}
      {isRealEstate && (
        <>
          <div className="flex justify-center text-slate-200">
            <ArrowDown size={24} strokeWidth={1} />
          </div>

          <section id="tour-whatsapp-room" className="space-y-6">
            <div className="flex items-center gap-3 px-1 relative z-10">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                <LayoutDashboard size={14} />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">4. Room Explorer Inquiry</h3>
              <HelpGuide 
                targetId="tour-whatsapp-room"
                title="Room Explorer Inquiry"
                description="Configure the specific button and pre-filled message used when buyers explore the 3D floorplans."
                proTip="Keep the {room_name} and {residence_name} placeholders intact so your sales team knows exactly what they are looking at."
                dos={["Keep the button action-oriented (e.g. Enquire About This Residence).", "Ask for detailed pricing and floorplans in the pre-filled message."]}
                donts={["Don't remove the {room_name} placeholder, it provides critical context.", "Avoid making the button text too long."]}
              />
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Customize the CTA button and the pre-filled WhatsApp message used inside the 3D room/floorplan viewer.
              </p>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                  Button Text
                </label>
                <input
                  type="text"
                  value={data.roomInquiryCtaText || ''}
                  onChange={(e) => onChange({ roomInquiryCtaText: e.target.value })}
                  placeholder={DEFAULT_ROOM_INQUIRY_CTA}
                  className={`${subtleInputClass} bg-slate-50/50`}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                  Pre-filled Chat Message
                </label>
                <textarea
                  value={data.roomInquiryMessageTemplate || ''}
                  onChange={(e) => onChange({ roomInquiryMessageTemplate: e.target.value })}
                  rows={4}
                  className={`${subtleInputClass} resize-none text-[12px] leading-relaxed py-3 bg-slate-50/50`}
                  placeholder={DEFAULT_ROOM_INQUIRY_MSG}
                />
                <div className="flex flex-wrap items-center gap-1.5 text-[9px] text-slate-400 italic">
                  <span>Placeholders:</span>
                  <code className="rounded bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 font-bold text-emerald-700 not-italic">{"{company_name}"}</code>
                  <code className="rounded bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 font-bold text-emerald-700 not-italic">{"{room_name}"}</code>
                  <code className="rounded bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 font-bold text-emerald-700 not-italic">{"{residence_name}"}</code>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <div className="flex justify-center text-slate-200">
        <ArrowDown size={24} strokeWidth={1} />
      </div>

      {/* LIVE VISUAL PREVIEW SECTION */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Zap size={14} />
          </div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">{isRealEstate ? '5' : '2'}. Live Chat Preview</h3>
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

          <div className="p-5 space-y-5 min-h-[320px]">
            {/* Generic Previews (Only for non-real-estate) */}
            {!isRealEstate && (
              <>
                {/* General Inquiry */}
                <div className="space-y-1.5">
                  <p className="text-center text-[8px] font-black uppercase tracking-widest text-slate-400">3.1 General Inquiry</p>
                  <div className="bg-[#DCF8C6] ml-auto max-w-[85%] rounded-2xl rounded-tr-none p-3.5 shadow-sm">
                    <p className="text-[10px] leading-relaxed text-slate-800 font-medium whitespace-pre-wrap">
                      {(data.welcomeMessage || "Hi {company_name}, I'm interested...")
                        .replaceAll('{company_name}', storeName || 'Company Identity')
                        .replaceAll('{store_name}', storeName || 'Company Identity')
                        .replaceAll('{category}', 'SOFA')
                        .replaceAll('Urban Living', storeName || 'Company Identity')}
                    </p>
                    <div className="mt-1.5 flex items-center justify-end gap-1 opacity-40">
                      <CheckCheck size={11} className="text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Product Inquiry */}
                <div className="space-y-1.5">
                  <p className="text-center text-[8px] font-black uppercase tracking-widest text-slate-400">3.2 Product Intent</p>
                  <div className="bg-[#DCF8C6] ml-auto max-w-[85%] rounded-2xl rounded-tr-none p-3.5 shadow-sm">
                    <p className="text-[10px] leading-relaxed text-slate-800 font-medium whitespace-pre-wrap">
                      {(data.productInquiryText || '')
                        .replaceAll('{company_name}', storeName || 'Company Identity')
                        .replaceAll('{store_name}', storeName || 'Company Identity')
                        .replaceAll('{residence}', 'Royal Oak Sofa')
                        .replaceAll('{product_name}', 'Royal Oak Sofa')
                        .replaceAll('{category}', 'SOFA')
                        .replaceAll('Urban Living', storeName || 'Company Identity')}
                    </p>
                    <div className="mt-1.5 flex items-center justify-end gap-1 opacity-40">
                      <CheckCheck size={11} className="text-blue-600" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Concierge Complete Flow Preview */}
            {isRealEstate && (
              <div className="space-y-3">
                <p className="text-center text-[8px] font-black uppercase tracking-widest text-slate-400">Concierge Flow</p>

                {/* Concierge options as chips */}
                <div className="bg-white max-w-[90%] rounded-2xl rounded-tl-none p-3 shadow-sm">
                  <p className="text-[9px] font-bold text-[#075E54] mb-2">How may we assist you?</p>
                  <div className="flex flex-wrap gap-1.5">
                    {conciergeOptions.map((opt, i) => (
                      <span key={i} className={`text-[8px] px-2.5 py-1 rounded-full font-bold ${i === 0 ? 'bg-[#DCF8C6] text-slate-700' : 'bg-slate-100 text-slate-500'}`}>
                        {opt.label || `Option ${i + 1}`}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Final concierge message */}
                <div className="bg-[#DCF8C6] ml-auto max-w-[85%] rounded-2xl rounded-tr-none p-3.5 shadow-sm">
                  <p className="text-[10px] leading-relaxed text-slate-800 font-medium whitespace-pre-wrap">
                    {(conciergeOptions[0]?.message || data.conciergeMessageTemplate || DEFAULT_CONCIERGE_MSG)
                      .replaceAll('{company_name}', storeName || 'Company Identity')
                      .replaceAll('{store_name}', storeName || 'Company Identity')
                      .replaceAll('{intent}', conciergeOptions[0]?.action || 'explore availability')
                      .replaceAll('{residence}', '3 BHK Signature')
                      .replaceAll('{product_name}', '3 BHK Signature')}
                  </p>
                  <div className="mt-1.5 flex items-center justify-end gap-1 opacity-40">
                    <CheckCheck size={11} className="text-blue-600" />
                  </div>
                </div>

                {/* Visit options */}
                <div className="bg-white max-w-[90%] rounded-2xl rounded-tl-none p-3 shadow-sm">
                  <p className="text-[9px] font-bold text-[#075E54] mb-2">Preferred Experience</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(data.visitOptions || DEFAULT_VISIT_OPTIONS).map((tour, i) => (
                      <span key={i} className={`text-[8px] px-2.5 py-1 rounded-full font-bold ${i === 0 ? 'bg-[#DCF8C6] text-slate-700' : 'bg-slate-100 text-slate-500'}`}>
                        {tour || `Tour ${i + 1}`}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Final visit message */}
                <div className="bg-[#DCF8C6] ml-auto max-w-[85%] rounded-2xl rounded-tr-none p-3.5 shadow-sm">
                  <p className="text-[10px] leading-relaxed text-slate-800 font-medium whitespace-pre-wrap">
                    {(data.visitMessageTemplate || DEFAULT_VISIT_MSG)
                      .replaceAll('{company_name}', storeName || 'Company Identity')
                      .replaceAll('{store_name}', storeName || 'Company Identity')
                      .replaceAll('{tour_type}', (data.visitOptions || DEFAULT_VISIT_OPTIONS)[0] || 'Morning Tour')
                      .replaceAll('{residence}', '3 BHK Signature')
                      .replaceAll('{product_name}', '3 BHK Signature')}
                  </p>
                  <div className="mt-1.5 flex items-center justify-end gap-1 opacity-40">
                    <CheckCheck size={11} className="text-blue-600" />
                  </div>
                </div>

                {/* Final room explorer inquiry message */}
                <p className="text-center text-[8px] font-black uppercase tracking-widest text-slate-400 pt-4 border-t border-slate-200/50">Room Explorer Inquiry</p>
                <div className="bg-[#DCF8C6] ml-auto max-w-[85%] rounded-2xl rounded-tr-none p-3.5 shadow-sm">
                  <p className="text-[10px] leading-relaxed text-slate-800 font-medium whitespace-pre-wrap">
                    {(data.roomInquiryMessageTemplate || `Hello {company_name},\n\nI am currently exploring the {room_name} inside the {residence_name}.\n\nPlease share the detailed floorplans, pricing, and availability for this residence.`)
                      .replaceAll('{company_name}', storeName || 'Company Identity')
                      .replaceAll('{room_name}', 'Master Suite')
                      .replaceAll('{residence_name}', '3 BHK Signature')}
                  </p>
                  <div className="mt-1.5 flex items-center justify-end gap-1 opacity-40">
                    <CheckCheck size={11} className="text-blue-600" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white/40 backdrop-blur-md p-3 flex items-center gap-3 px-6">
            <div className="flex-1 text-[11px] text-slate-400 font-bold uppercase tracking-widest italic">Type your message...</div>
            <div className="h-9 w-9 rounded-full bg-[#128C7E] flex items-center justify-center text-white shadow-lg">
              <MessageCircle size={18} fill="currentColor" />
            </div>
          </div>
        </div>
      </section>

      {!isRealEstate && (
        <>
          <div className="flex justify-center text-slate-200">
            <ArrowDown size={24} strokeWidth={1} />
          </div>

          {/* AUTOMATION TEMPLATES */}
          <section id="tour-whatsapp-automation" className="space-y-6">
            <div className="flex items-center gap-3 px-1 relative z-10">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                <MessageSquare size={14} />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">3. Lead Automation</h3>
              <HelpGuide 
                targetId="tour-whatsapp-automation"
                title="Lead Automation"
                description="Configure automated WhatsApp messaging to capture intent instantly."
                proTip="Structure your message: Context -> Request -> Next Steps."
                dos={["Structure your message: Context -> Request -> Next Steps.", "Use the {product_name} placeholder to know what the buyer is looking at."]}
                donts={["Don't write paragraphs of text, keep it skimmable.", "Avoid asking questions the buyer won't know the answer to."]}
              />
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
                <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 italic leading-loose">
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
        </>
      )}

      {/* STRATEGIC CONVERSION TIP */}
      <div className="rounded-[2rem] border border-emerald-900/5 bg-emerald-50/30 p-6 flex items-start gap-4">
        <div className="h-10 w-10 shrink-0 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
          <MessageCircle size={18} />
        </div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-wider text-emerald-900 mb-1">{isRealEstate ? 'Concierge Strategy' : 'Elite Sales Engine'}</p>
          <p className="text-[10px] leading-relaxed text-emerald-800/80 font-medium">
            {isRealEstate
              ? "Each concierge option creates a focused buyer journey. Keep labels short and action-specific — buyers should instantly understand what they'll get."
              : "Structure your messages: Context \u2192 Request \u2192 Questions. Every message should feel like a buyer, not a browser."}
          </p>
        </div>
      </div>
    </div>
  );
});
