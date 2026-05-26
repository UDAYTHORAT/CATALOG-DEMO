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
  locationAddress,
  onChangeLocationAddress,
}: {
  data: HeroData;
  onChange: (updates: Partial<HeroData>) => void;
  hideCtaSection?: boolean;
  locationAddress?: string;
  onChangeLocationAddress?: (value: string) => void;
}) {


  return (
    <div className="space-y-8">
      <PanelTitle icon={Building2} label="Property Hero" meta="Landing screen" />

      <div className="space-y-6">
        {/* ── Section 1: Property Identity ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Property Identity</p>
          <div className="space-y-5">
            <Field label="Property Location / Address">
              <input
                value={locationAddress || ''}
                onChange={(e) => onChangeLocationAddress?.(e.target.value)}
                className={inputClass}
                placeholder="e.g. Worli Sea Face · Mumbai"
              />
            </Field>

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
        </div>

        {/* ── Section 3: Hero Action Bar ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Hero Bottom Action Bar</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Property Status">
                <input
                  value={data.status || ''}
                  onChange={(e) => onChange({ status: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. Ready to Move"
                />
              </Field>
              <Field label="Starting Price">
                <input
                  value={data.startingPrice || ''}
                  onChange={(e) => onChange({ startingPrice: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. ₹ 6.2 Cr"
                />
              </Field>
            </div>
            {!hideCtaSection && (
              <Field label="CTA Button Text">
                <input
                  value={data.heroCtaText}
                  onChange={(e) => onChange({ heroCtaText: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. Explore Residences"
                />
              </Field>
            )}
          </div>
          <p className="mt-2 text-[9px] font-medium text-slate-400">Displayed in the bottom action bar overlay on the hero section</p>
        </div>

        {/* ── Section 4: Emotional Storytelling ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Emotional Storytelling</p>
          <div className="space-y-5">
            <Field label="Section Title">
              <input
                value={data.emotionalTitle || ''}
                onChange={(e) => onChange({ emotionalTitle: e.target.value })}
                className={inputClass}
                placeholder="e.g. Wake up above the skyline."
              />
            </Field>

            <Field label="Section Body">
              <div className="relative">
                <textarea
                  value={data.emotionalBody || ''}
                  onChange={(e) => onChange({ emotionalBody: e.target.value })}
                  rows={3}
                  maxLength={250}
                  className={`${inputClass} resize-none leading-relaxed pb-8`}
                  placeholder="e.g. Private decks. Morning light. Quiet elevation above the city..."
                />
                <div className="absolute bottom-2.5 right-3 text-[10px] font-bold text-slate-400">
                  {(data.emotionalBody || '').length}/250
                </div>
              </div>
            </Field>
          </div>
        </div>

        {/* Ownership Specifications moved to Residences section */}
      </div>
    </div>
  );
});
