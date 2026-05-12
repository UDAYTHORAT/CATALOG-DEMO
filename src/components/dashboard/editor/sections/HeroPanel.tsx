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
