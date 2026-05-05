import React from 'react';
import { MapPin } from 'lucide-react';
import { ImageUpload } from '@/components/dashboard/ImageUpload';
import { Field, PanelTitle, inputClass } from '../ui';
import type { LocationData } from '../types';

export default React.memo(function LocationPanel({
  data,
  onChange,
}: {
  data: LocationData;
  onChange: (updates: Partial<LocationData>) => void;
}) {
  return (
    <div className="space-y-8">
      <PanelTitle icon={MapPin} label="Experience Center" meta="Studio Location" />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Location Details</p>
        <div className="space-y-5">
          <Field label="Studio/Center Name">
            <input
              value={data.experienceCenterName}
              onChange={(event) => onChange({ experienceCenterName: event.target.value })}
              className={inputClass}
              placeholder="e.g. Modohouz Experience Center"
            />
          </Field>
          
          <Field label="Google Maps URL">
            <input
              value={data.mapLink}
              onChange={(event) => onChange({ mapLink: event.target.value })}
              className={inputClass}
              placeholder="Paste your maps.google.com link here"
            />
          </Field>

          <Field label="Complete Address">
            <textarea
              value={data.experienceCenterAddress}
              onChange={(event) => onChange({ experienceCenterAddress: event.target.value })}
              rows={4}
              className={`${inputClass} resize-none leading-relaxed`}
              placeholder="Enter the full physical address..."
            />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-900/5 bg-amber-50/30 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <MapPin size={16} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-amber-900">Conversion Tip</p>
            <p className="text-[10px] leading-relaxed text-amber-800/80">Providing a clear physical address and map link builds significant trust with premium furniture buyers.</p>
          </div>
        </div>
      </div>
    </div>
  );
});
