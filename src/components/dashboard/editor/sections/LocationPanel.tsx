import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { ImageUpload } from '@/components/dashboard/ImageUpload';
import { Field, PanelTitle, inputClass } from '../ui';
import type { LocationData } from '../types';

function extractCoordinatesOrPlace(val: string): string | null {
  // 1. We want to preserve the exact raw Google Maps URL in the database to retain
  // the CID, Place ID, and exact coordinates. The templates will handle formatting
  // this into an embed URL (using exact coordinates) while using the raw URL for directions.
  if (
    val.includes('pb=') || 
    val.includes('/embed') || 
    val.includes('output=embed') || 
    val.includes('/place/') || 
    val.includes('cid=') || 
    val.includes('q=')
  ) {
    return val;
  }

  // 2. If it contains raw coordinates but no standard parameters, still preserve the raw URL.
  // (The templates' buildDirectionsUrl and buildMapEmbedUrl will extract what they need).
  const atMatch = val.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch) {
    return val;
  }

  // Return null if we don't recognize it, which triggers the server-side shortlink resolver
  return null;
}


export default React.memo(function LocationPanel({
  data,
  onChange,
  isRealEstate,
  templateId,
}: {
  data: LocationData;
  onChange: (updates: Partial<LocationData>) => void;
  isRealEstate?: boolean;
  templateId?: string;
}) {
  const [isResolving, setIsResolving] = React.useState(false);
  const [resolveError, setResolveError] = React.useState<string | null>(null);
  const isCafe = templateId === 'funnelad-elite-cafe';

  return (
    <div className="space-y-8">
      <PanelTitle 
        icon={MapPin} 
        label={isRealEstate ? "Project Site & Gallery" : (isCafe ? "Cafe Location" : "Experience Center")} 
        meta={isRealEstate ? "Project Location" : (isCafe ? "Location Details" : "Studio Location")} 
      />

      <div className="rounded-2xl border border-amber-900/5 bg-amber-50/30 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <MapPin size={16} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-amber-900">Conversion Tip</p>
            <p className="text-[10px] leading-relaxed text-amber-800/80">
              {isRealEstate 
                ? "Providing a clear physical building address and maps link builds significant trust with premium property buyers and drives site visits."
                : (isCafe
                  ? "Providing a clear physical address and map link builds significant trust with hungry diners and drives foot traffic."
                  : "Providing a clear physical address and map link builds significant trust with premium furniture buyers.")}
            </p>
          </div>
        </div>
      </div>

      {isCafe && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Section Text & Hours</p>
          <div className="space-y-5">
            <Field label="Section Kicker">
              <input
                value={data.kicker || 'Visit Us'}
                onChange={(event) => onChange({ kicker: event.target.value })}
                className={inputClass}
                placeholder="e.g. Visit Us"
              />
            </Field>

            <Field label="Section Heading">
              <input
                value={data.title || 'Come Say Hi'}
                onChange={(event) => onChange({ title: event.target.value })}
                className={inputClass}
                placeholder="e.g. Come Say Hi"
              />
            </Field>

            <Field label="Section Subtitle">
              <textarea
                value={data.subTitle || 'We would love to serve you. Located right in the heart of Røros.'}
                onChange={(event) => onChange({ subTitle: event.target.value })}
                rows={2}
                className={`${inputClass} resize-none`}
                placeholder="e.g. We would love to serve you. Located right in the heart of Røros."
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Hours (Mon - Fri)">
                <input
                  value={data.hoursMonFri || '07:00 - 18:00'}
                  onChange={(event) => onChange({ hoursMonFri: event.target.value })}
                  className={inputClass}
                  placeholder="e.g. 07:00 - 18:00"
                />
              </Field>

              <Field label="Hours (Sat - Sun)">
                <input
                  value={data.hoursSatSun || '08:00 - 19:00'}
                  onChange={(event) => onChange({ hoursSatSun: event.target.value })}
                  className={inputClass}
                  placeholder="e.g. 08:00 - 19:00"
                />
              </Field>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Location Details</p>
        <div id="tour-location-fields" className="space-y-5">
          <div id="tour-location-name">
            <Field label={isRealEstate ? "Building / Project Name" : (isCafe ? "Cafe Name" : "Studio/Center Name")}>
              <input
                value={data.experienceCenterName}
                onChange={(event) => onChange({ experienceCenterName: event.target.value })}
                className={inputClass}
                placeholder={isRealEstate ? "e.g. The Aurelia Residences" : (isCafe ? "e.g. Kaffestuggu Cafe" : "e.g. Modohouz Experience Center")}
              />
            </Field>
          </div>
          
          <div id="tour-location-link">
            <Field label="Google Maps URL">
              <div className="relative">
                <input
                  value={data.mapLink}
                  onChange={async (event) => {
                    let val = event.target.value;
                    onChange({ mapLink: val });
                    setResolveError(null);

                    if (!val.trim()) {
                      return;
                    }

                    // Extract from iframe src if user pasted iframe code
                    const srcMatch = val.match(/src="([^"]+)"/);
                    if (srcMatch && srcMatch[1]) {
                      val = srcMatch[1];
                    }

                    val = val
                      .replace(/&#39;/g, "'")
                      .replace(/&#x27;/g, "'")
                      .replace(/&amp;/g, '&')
                      .replace(/&lt;/g, '<')
                      .replace(/&gt;/g, '>')
                      .replace(/&quot;/g, '"');

                    // Check if we can parse it synchronously
                    const parsed = extractCoordinatesOrPlace(val);
                    if (parsed) {
                      onChange({ mapLink: parsed });
                      return;
                    }

                    // If it is a short link or unknown URL, resolve it on server
                    const isShortLink = val.includes('maps.app.goo.gl') || val.includes('goo.gl/maps');
                    const isUnknownHttp = val.startsWith('http') && !val.includes('pb=') && !val.includes('embed');

                    if (isShortLink || isUnknownHttp) {
                      setIsResolving(true);
                      try {
                        const { resolveMapUrl } = await import('@/app/actions/funnels');
                        const resolved = await resolveMapUrl(val);
                        if (resolved) {
                          const parsedResolved = extractCoordinatesOrPlace(resolved);
                          if (parsedResolved) {
                            onChange({ mapLink: parsedResolved });
                          } else {
                            onChange({ mapLink: resolved });
                          }
                        } else {
                          setResolveError('Could not resolve link location. Please ensure it is a valid Google Maps link.');
                        }
                      } catch (err) {
                        console.error('Failed to resolve maps link:', err);
                        setResolveError('Failed to connect to map resolver. Please check your link.');
                      } finally {
                        setIsResolving(false);
                      }
                    }
                  }}
                  className={`${inputClass} ${isResolving ? 'pr-24' : ''}`}
                  placeholder="Paste your maps.google.com link here"
                />
                {isResolving && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[11px] font-medium text-slate-400 bg-white/90 backdrop-blur-sm pl-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-orange-500" />
                    <span>Resolving...</span>
                  </div>
                )}
              </div>
              {resolveError && (
                <p className="mt-1.5 text-[11px] font-medium text-rose-500">{resolveError}</p>
              )}
              <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 p-3.5 space-y-2">
                <p className="text-[11px] font-bold text-slate-800">How to get your Map Link:</p>
                <ol className="list-decimal pl-4 text-[10px] text-slate-500 leading-relaxed space-y-1">
                  <li>Search for your property/building on <b>Google Maps</b>.</li>
                  <li>Click the <b>Share</b> button under the property name.</li>
                  <li>Select the <b>Embed a map</b> tab.</li>
                  <li>Click <b>COPY HTML</b>.</li>
                  <li>Paste it exactly here! (We will automatically extract the link for you).</li>
                </ol>
              </div>
            </Field>
          </div>

          <div id="tour-location-address">
            <Field label={isRealEstate ? "Building/Site Address" : (isCafe ? "Cafe Address" : "Complete Address")}>
              <textarea
                value={data.experienceCenterAddress}
                onChange={(event) => onChange({ experienceCenterAddress: event.target.value })}
                rows={4}
                className={`${inputClass} resize-none leading-relaxed`}
                placeholder={isRealEstate ? "Enter the full physical building or site address..." : (isCafe ? "Enter the full physical cafe address..." : "Enter the full physical address...")}
              />
            </Field>
          </div>
        </div>
      </div>


      {isRealEstate && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Strategic Connectivity</p>
          <div id="tour-location-connectivity" className="space-y-4">
            {(data.connectivity || [
              { label: "Highway", time: "3 min" },
              { label: "Hospital", time: "5 min" },
              { label: "Airport", time: "25 min" },
              { label: "Metro", time: "8 min" },
            ]).map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex-1">
                  <input
                    value={item.label}
                    onChange={(e) => {
                      const newConn = [...(data.connectivity || [
                        { label: "Highway", time: "3 min" },
                        { label: "Hospital", time: "5 min" },
                        { label: "Airport", time: "25 min" },
                        { label: "Metro", time: "8 min" },
                      ])];
                      newConn[i] = { ...newConn[i], label: e.target.value };
                      onChange({ connectivity: newConn });
                    }}
                    className={inputClass}
                    placeholder="e.g. Highway"
                  />
                </div>
                <div className="flex-1">
                  <input
                    value={item.time}
                    onChange={(e) => {
                      const newConn = [...(data.connectivity || [
                        { label: "Highway", time: "3 min" },
                        { label: "Hospital", time: "5 min" },
                        { label: "Airport", time: "25 min" },
                        { label: "Metro", time: "8 min" },
                      ])];
                      newConn[i] = { ...newConn[i], time: e.target.value };
                      onChange({ connectivity: newConn });
                    }}
                    className={inputClass}
                    placeholder="e.g. 5 min"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
});
