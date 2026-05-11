import React from 'react';
import { LayoutGrid, Plus, Trash2 } from 'lucide-react';
import { ImageUpload } from '@/components/dashboard/ImageUpload';
import { Field, IconButton, PanelTitle, subtleInputClass } from '../ui';
import type { CategoryItem, CategoriesData } from '../types';
import { FALLBACK_PRODUCT_IMAGE } from '../utils';

export default React.memo(function CategoriesPanel({
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
  const categories = data.categories;

  return (
    <div className="space-y-8">
      <PanelTitle
        icon={LayoutGrid}
        label="Collections"
        meta={`${categories.length} segments`}
        action={
          <button
            onClick={onAdd}
            disabled={categories.length >= 3}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 shadow-lg ${
              categories.length >= 3 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
              : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20'
            }`}
          >
            <Plus size={14} />
            {categories.length >= 3 ? 'Limit Reached' : 'Add New'}
          </button>
        }
      />

      {/* Step Settings Card */}
      {categories.length >= 3 && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex gap-3 items-start mb-6">
          <div className="p-1 rounded-full bg-amber-100 text-amber-600">
            <LayoutGrid size={16} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-amber-900">Conversion Limit Reached</p>
            <p className="text-[10px] text-amber-700 leading-relaxed mt-0.5">
              High-conversion templates work best with exactly 3 collections. Excess categories will be hidden.
            </p>
          </div>
        </div>
      )}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Step Global Settings</p>
        <div className="space-y-5">
          <Field label="Main Selection Title">
            <input
              value={data.title || ''}
              onChange={(e) => onUpdate(-1, { title: e.target.value } as any)}
              placeholder="What Piece Are You Looking For?"
              className={subtleInputClass}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Help Label">
              <input
                value={data.helpTitle || ''}
                onChange={(e) => onUpdate(-1, { helpTitle: e.target.value } as any)}
                className={subtleInputClass}
              />
            </Field>
            <Field label="Help Action">
              <input
                value={data.helpSubTitle || ''}
                onChange={(e) => onUpdate(-1, { helpSubTitle: e.target.value } as any)}
                className={subtleInputClass}
              />
            </Field>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Defined Collections</p>
          <span className="text-[10px] font-bold text-slate-400">Drag sidebar to reorder</span>
        </div>

        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-12 px-6 text-center">
            <LayoutGrid className="mb-3 text-slate-300" size={32} />
            <p className="text-sm font-bold text-slate-400">No collections added yet</p>
            <p className="mt-1 text-[11px] text-slate-400">Start by adding your first product category.</p>
          </div>
        ) : (
          categories.map((category, index) => (
            <div key={category.id} className="group relative rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-md">
              <div className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 text-[10px] font-black text-white shadow-lg">
                {index + 1}
              </div>
              
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-xl border border-slate-100 shadow-sm">
                    <ImageUpload
                      defaultImage={category.image || FALLBACK_PRODUCT_IMAGE}
                      onUploadComplete={(url) => onUpdate(index, { image: url })}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{category.label || 'Untitled'}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{category.tagline || 'No tagline'}</p>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(category.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                <Field label="Display Name">
                  <input
                    value={category.label}
                    onChange={(event) => onUpdate(index, { label: event.target.value })}
                    className={subtleInputClass}
                    placeholder="e.g. Luxury Sofas"
                  />
                </Field>
                <Field label="Catchy Tagline">
                  <input
                    value={category.tagline}
                    onChange={(event) => onUpdate(index, { tagline: event.target.value })}
                    className={subtleInputClass}
                    placeholder="e.g. Curated Pieces"
                  />
                </Field>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});
