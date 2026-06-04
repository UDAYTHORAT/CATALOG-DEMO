import React from 'react';
import { ImageIcon, Plus, Trash2, Sparkles, Type, Images } from 'lucide-react';
import { ImageUpload } from '@/components/dashboard/ImageUpload';
import { PanelTitle, subtleInputClass } from '../ui';
import type { CategoryItem, CategoriesData } from '../types';
import { FALLBACK_PRODUCT_IMAGE } from '../utils';

export default React.memo(function ExperiencePanel({
  data,
  onAdd,
  onUpdate,
  onRemove,
}: {
  data: CategoriesData;
  onAdd: () => void;
  onUpdate: (index: number, updates: Partial<CategoryItem>) => void;
  onRemove: (id: string) => void;
}) {
  const images = data.categories || [];
  const maxImages = 7;

  return (
    <div className="space-y-6">
      <PanelTitle
        icon={ImageIcon}
        label="Experience"
        meta="Cafe atmosphere & vibe"
      />

      {/* ───── STEP 1: Section Text ───── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Step header */}
        <div className="flex items-center gap-3 px-5 py-3.5 bg-slate-50 border-b border-slate-100">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-black text-white">1</div>
          <div className="flex items-center gap-2">
            <Type size={14} className="text-slate-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">Section Text</span>
          </div>
        </div>

        <div className="p-5 space-y-5" id="tour-experience-global-title">
          {/* Kicker — small top text */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Kicker</span>
              <span className="text-[10px] font-medium text-slate-300">Small text above the heading</span>
            </div>
            <input
              value={data.helpTitle ?? 'Experience'}
              onChange={(e) => onUpdate(-1, { helpTitle: e.target.value } as any)}
              placeholder="e.g. Experience"
              maxLength={30}
              className={subtleInputClass}
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100" />

          {/* Main Heading */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Heading</span>
              <span className="text-[10px] font-medium text-slate-300">{(data.title ?? 'Feel the Vibe').length}/40</span>
            </div>
            <input
              value={data.title ?? 'Feel the Vibe'}
              onChange={(e) => onUpdate(-1, { title: e.target.value } as any)}
              placeholder="e.g. Feel the Vibe"
              maxLength={40}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-bold text-slate-900 outline-none transition-all focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 placeholder:text-slate-400"
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100" />

          {/* Subheading */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Subheading</span>
              <span className="text-[10px] font-medium text-slate-300">{(data.subTitle ?? 'More than just coffee').length}/60</span>
            </div>
            <input
              value={data.subTitle ?? 'More than just coffee'}
              onChange={(e) => onUpdate(-1, { subTitle: e.target.value } as any)}
              placeholder="e.g. More than just coffee"
              maxLength={60}
              className={subtleInputClass}
            />
          </div>

          {/* Live Preview */}
          <div className="rounded-xl bg-[#3A2211] p-5 text-center space-y-1.5">
            <p className="text-[#D94A4A] text-sm italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              {data.helpTitle || 'Experience'}
            </p>
            <p className="text-[#C6A68A] text-lg font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {data.title || 'Feel the Vibe'}
            </p>
            <p className="text-[#C6A68A]/80 text-sm tracking-wide font-medium">
              {data.subTitle || 'More than just coffee'}
            </p>
          </div>
        </div>
      </div>

      {/* ───── STEP 2: Gallery Images ───── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Step header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-black text-white">2</div>
            <div className="flex items-center gap-2">
              <Images size={14} className="text-slate-400" />
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
                Atmosphere Photos
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-400">{images.length} / {maxImages}</span>
        </div>

        <div className="p-5">
          {images.length === 0 ? (
            <div id="tour-experience-empty" className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-12 px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 mb-4">
                <ImageIcon className="text-slate-400" size={24} />
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1">No photos yet</p>
              <p className="text-[11px] text-slate-400 max-w-[220px]">
                Upload photos of your cafe interior, seating, food prep — anything that shows the vibe.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img, index) => (
                <div key={img.id} className="group relative aspect-square rounded-xl border border-slate-200 bg-slate-50 overflow-hidden transition-all hover:border-slate-300 hover:shadow-md">
                  <ImageUpload
                    defaultImage={img.image}
                    onUploadComplete={(url) => onUpdate(index, { image: url })}
                  />
                  <button
                    onClick={() => onRemove(img.id)}
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-slate-400 backdrop-blur-sm transition-all hover:bg-rose-500 hover:text-white opacity-0 group-hover:opacity-100 shadow-sm"
                  >
                    <Trash2 size={13} />
                  </button>
                  <div className="absolute top-2 left-2 flex h-5 w-5 items-center justify-center rounded-md bg-slate-900/80 text-[9px] font-black text-white backdrop-blur-sm">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add button */}
          <button
            id="tour-experience-add-btn"
            onClick={onAdd}
            disabled={images.length >= maxImages}
            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[11px] font-bold uppercase tracking-[0.15em] transition-all active:scale-[0.98] ${
              images.length >= maxImages
                ? 'border-2 border-dashed border-slate-200 text-slate-300 cursor-not-allowed'
                : 'border-2 border-dashed border-slate-300 text-slate-500 hover:border-slate-900 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Plus size={14} />
            {images.length >= maxImages ? `Maximum ${maxImages} Reached` : 'Add Photo'}
          </button>

          {/* Helpful tip */}
          {images.length > 0 && images.length < 3 && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2.5">
              <Sparkles size={13} className="text-amber-500 mt-0.5 shrink-0" />
              <p className="text-[10px] font-semibold text-amber-700 leading-relaxed">
                Add at least 3 photos for the best scrolling effect on the live page.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
