'use client';

import React from 'react';
import { Building2, Plus, Trash2, X } from 'lucide-react';
import { Field, PanelTitle, inputClass, subtleInputClass } from '../ui';
import type { HeroData } from '../types';
import { ImageUpload } from '@/components/dashboard/ImageUpload';

/**
 * Real Estate Hero Panel
 * Complete editor for the template's Home screen:
 *   heroData.tagline        → Property Name (e.g. "The Glasshouse")
 *   heroData.subTagline     → Property Description
 *   heroData.heroImage      → Hero background image
 *   heroData.heroBadge      → Badge on hero image (e.g. "Superstructure Complete")
 *   heroData.trustBadges    → Trust bar items (e.g. "Freehold", "EV Parking")
 *   heroData.ownership      → Ownership type (e.g. "Freehold")
 *   heroData.possession     → Possession timeline (e.g. "Q4 2025")
 *   heroData.heroCtaText    → CTA button text
 *   heroData.heroCtaSubtext → CTA subline
 */
export default React.memo(function RealEstateHeroPanel({
  data,
  onChange,
  hideCtaSection,
}: {
  data: HeroData;
  onChange: (updates: Partial<HeroData>) => void;
  hideCtaSection?: boolean;
}) {
  const trustBadges = data.trustBadges || [];

  return (
    <div className="space-y-8">
      <PanelTitle icon={Building2} label="Property Hero" meta="Landing screen" />

      <div className="space-y-6">
        {/* ── Section 1: Property Identity ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Property Identity</p>
          <div className="space-y-5">
            <Field label="Property Name">
              <div className="relative">
                <textarea
                  value={data.tagline}
                  onChange={(e) => onChange({ tagline: e.target.value })}
                  rows={2}
                  maxLength={60}
                  className={`${inputClass} resize-none leading-tight pb-8`}
                  placeholder="e.g. The Glasshouse"
                />
                <div className="absolute bottom-2.5 right-3 text-[10px] font-bold text-slate-400">
                  {data.tagline.length}/60
                </div>
              </div>
            </Field>
            
            <Field label="Property Tagline">
              <div className="relative">
                <textarea
                  value={data.subTagline}
                  onChange={(e) => onChange({ subTagline: e.target.value })}
                  rows={3}
                  maxLength={150}
                  className={`${inputClass} resize-none leading-relaxed pb-8`}
                  placeholder="e.g. Sea-facing residences designed for privacy, light and skyline views."
                />
                <div className="absolute bottom-2.5 right-3 text-[10px] font-bold text-slate-400">
                  {data.subTagline.length}/150
                </div>
              </div>
            </Field>
          </div>
        </div>

        {/* ── Section 2: Hero Visual ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Hero Visual</p>
          <Field label="Hero Image">
            <ImageUpload
              defaultImage={data.heroImage}
              onUploadComplete={(url) => onChange({ heroImage: url })}
            />
          </Field>
          <div className="mt-4">
            <Field label="Image Badge">
              <input
                value={data.heroBadge || ''}
                onChange={(e) => onChange({ heroBadge: e.target.value })}
                className={inputClass}
                placeholder="e.g. Superstructure Complete"
              />
            </Field>
            <p className="mt-1 text-[9px] font-medium text-slate-400">Shown as a tag over the hero image</p>
          </div>
        </div>

        {/* ── Section 3: Key Details ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Key Details</p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Starting Price">
              <input
                value={data.startingPrice || ''}
                onChange={(e) => onChange({ startingPrice: e.target.value })}
                className={inputClass}
                placeholder="e.g. ₹ 6.2 Cr"
              />
            </Field>
            <Field label="Property Status">
              <input
                value={data.status || ''}
                onChange={(e) => onChange({ status: e.target.value })}
                className={inputClass}
                placeholder="e.g. Ready to Move"
              />
            </Field>
            <Field label="Ownership Type">
              <input
                value={data.ownership || ''}
                onChange={(e) => onChange({ ownership: e.target.value })}
                className={inputClass}
                placeholder="e.g. Freehold"
              />
            </Field>
            <Field label="Possession Timeline">
              <input
                value={data.possession || ''}
                onChange={(e) => onChange({ possession: e.target.value })}
                className={inputClass}
                placeholder="e.g. Q4 2025"
              />
            </Field>
          </div>
          <p className="mt-2 text-[9px] font-medium text-slate-400">Displayed in the property details panel on the landing page</p>
        </div>

        {/* ── Section 5: CTA ── */}
        {!hideCtaSection && (
          <div className="rounded-2xl border border-slate-900/5 bg-slate-900/[0.02] p-6">
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Call to Action</p>
            <div className="grid grid-cols-1 gap-5">
              <Field label="CTA Button Text">
                <input
                  value={data.heroCtaText}
                  onChange={(e) => onChange({ heroCtaText: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. Explore Residences"
                />
              </Field>
              <Field label="CTA Subtext">
                <input
                  value={data.heroCtaSubtext}
                  onChange={(e) => onChange({ heroCtaSubtext: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. Get floor plan on WhatsApp"
                />
              </Field>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
