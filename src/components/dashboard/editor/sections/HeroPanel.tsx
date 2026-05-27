import React from 'react';
import { Type } from 'lucide-react';
import { Field, PanelTitle, inputClass } from '../ui';
import type { HeroData } from '../types';

export default React.memo(function HeroPanel({
  data,
  onChange,
  hideCtaSection,
}: {
  data: HeroData;
  onChange: (updates: Partial<HeroData>) => void;
  hideCtaSection?: boolean;
}) {
  return (
    <div className="space-y-8">
      <PanelTitle icon={Type} label="Hero Messaging" meta="Landing screen" />

      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Content Strategy</p>
          <div className="space-y-5">
            <div id="tour-content-headline">
              <Field label="Main Headline">
                <div className="relative">
                  <textarea
                    value={data.tagline}
                    onChange={(event) => onChange({ tagline: event.target.value })}
                    rows={2}
                    maxLength={60}
                    className={`${inputClass} resize-none leading-tight pb-8`}
                    placeholder="e.g. Premium Furniture for Modern Living"
                  />
                  <div className="absolute bottom-2.5 right-3 text-[10px] font-bold text-slate-400">
                    {data.tagline.length}/60
                  </div>
                </div>
              </Field>
            </div>
            
            <div id="tour-content-subheadline">
              <Field label="Supporting Subline">
                <div className="relative">
                  <textarea
                    value={data.subTagline}
                    onChange={(event) => onChange({ subTagline: event.target.value })}
                    rows={3}
                    maxLength={150}
                    className={`${inputClass} resize-none leading-relaxed pb-8`}
                    placeholder="Describe your value proposition..."
                  />
                  <div className="absolute bottom-2.5 right-3 text-[10px] font-bold text-slate-400">
                    {data.subTagline.length}/150
                  </div>
                </div>
              </Field>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Trust Bar</p>
          
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Trust Metric 1</p>
              <div className="grid grid-cols-2 gap-3">
                <input value={data.trustBarTop1 ?? ''} onChange={(e) => onChange({ trustBarTop1: e.target.value })} className={inputClass} placeholder="Metric (e.g. 1200+ Homes)" />
                <input value={data.trustBarBottom1 ?? ''} onChange={(e) => onChange({ trustBarBottom1: e.target.value })} className={inputClass} placeholder="Label (e.g. Delivered)" />
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Trust Metric 2</p>
              <div className="grid grid-cols-2 gap-3">
                <input value={data.trustBarTop2 ?? ''} onChange={(e) => onChange({ trustBarTop2: e.target.value })} className={inputClass} placeholder="Metric (e.g. 4.9★)" />
                <input value={data.trustBarBottom2 ?? ''} onChange={(e) => onChange({ trustBarBottom2: e.target.value })} className={inputClass} placeholder="Label (e.g. Client Rating)" />
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Trust Metric 3</p>
              <div className="grid grid-cols-2 gap-3">
                <input value={data.trustBarTop3 ?? ''} onChange={(e) => onChange({ trustBarTop3: e.target.value })} className={inputClass} placeholder="Metric (e.g. Factory Direct)" />
                <input value={data.trustBarBottom3 ?? ''} onChange={(e) => onChange({ trustBarBottom3: e.target.value })} className={inputClass} placeholder="Label (e.g. Pricing)" />
              </div>
            </div>
          </div>
        </div>

        {!hideCtaSection && (
        <div className="rounded-2xl border border-slate-900/5 bg-slate-900/[0.02] p-6">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Call to Action</p>
          <div className="grid grid-cols-1 gap-5">
            <Field label="Primary Button Text">
              <input
                value={data.heroCtaText}
                onChange={(event) => onChange({ heroCtaText: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Trust Hook (Helper Text)">
              <input
                value={data.heroCtaSubtext}
                onChange={(event) => onChange({ heroCtaSubtext: event.target.value })}
                className={inputClass}
                placeholder="e.g. Tap to explore collections"
              />
            </Field>
          </div>
        </div>
        )}
      </div>
    </div>
  );
});
