'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Plus, Trash2,
  ChevronDown, ChevronUp,
  Home, DoorOpen, Zap, Clock,
  LayoutList, X, Ruler, MapPin,
  Lock, Unlock
} from 'lucide-react';
import { Field, IconButton, PanelTitle, subtleInputClass } from '../ui';
import type { ProductItem, ProductsData } from '../types';
import { ImageUpload } from '@/components/dashboard/ImageUpload';
import BlueprintLayoutEditor from './BlueprintLayoutEditor';

// ═══════════════════════════════════════════════════════════════════════════
// ROOM EDITOR — Ultra-minimal: just name + area
// ═══════════════════════════════════════════════════════════════════════════

function RoomEditor({
  room,
  index,
  onUpdate,
  onRemove,
  isSelected,
  onSelect,
}: {
  room: any;
  index: number;
  onUpdate: (updates: any) => void;
  onRemove: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
}) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div
      className={`group rounded-lg border transition-all ${
        isSelected ? 'border-indigo-300 bg-indigo-50/30' : 'border-slate-100 bg-white hover:border-slate-200'
      }`}
      onClick={onSelect}
    >
      {/* Single row: Name + Area + Delete */}
      <div className="flex items-center gap-2 px-3 py-2">
        <input
          value={room.name || ''}
          onChange={(e) => onUpdate({ name: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 min-w-0 border-0 bg-transparent p-0 text-[12px] font-semibold text-slate-800 outline-none focus:ring-0 placeholder:text-slate-300 truncate"
          placeholder="Room name"
        />
        <input
          value={room.area || ''}
          onChange={(e) => onUpdate({ area: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          className="w-[72px] shrink-0 border-0 bg-transparent p-0 text-[11px] text-slate-400 outline-none focus:ring-0 placeholder:text-slate-300 text-right"
          placeholder="sqft"
        />
        <button
          onClick={(e) => { e.stopPropagation(); onUpdate({ locked: !room.locked }); }}
          className={`h-6 w-6 shrink-0 flex items-center justify-center rounded transition-colors ${room.locked ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100'}`}
          title={room.locked ? 'Unlock position' : 'Lock position'}
        >
          {room.locked ? <Lock size={11} /> : <Unlock size={11} />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setShowMore(!showMore); }}
          className={`h-6 w-6 shrink-0 flex items-center justify-center rounded transition-colors ${showMore ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100'}`}
        >
          {showMore ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="h-6 w-6 shrink-0 flex items-center justify-center rounded text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={11} />
        </button>
      </div>

      {/* Expandable: image, features, atmosphere (rarely needed) */}
      {showMore && (
        <div className="px-3 pb-3 space-y-2 border-t border-slate-50 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Field label="Blueprint Label">
              <input value={room.label || ''} onChange={(e) => onUpdate({ label: e.target.value })} className={`${subtleInputClass} text-[11px]`} placeholder="Living" />
            </Field>
            <Field label="Vibe">
              <input value={room.atmosphere || ''} onChange={(e) => onUpdate({ atmosphere: e.target.value })} className={`${subtleInputClass} text-[11px]`} placeholder="Sea-facing" />
            </Field>
          </div>
          <Field label="Room Image">
            <ImageUpload defaultImage={room.img || room.images?.[0]} onUploadComplete={(url) => onUpdate({ img: url, images: [url] })} />
          </Field>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Features</p>
              <button onClick={() => onUpdate({ details: [...(room.details || []), ''] })} className="text-[9px] font-bold text-indigo-500 hover:text-indigo-700 uppercase tracking-wider">+ Add</button>
            </div>
            {(room.details || []).map((d: string, i: number) => (
              <div key={i} className="flex items-center gap-1.5">
                <input value={d} onChange={(e) => { const nd = [...(room.details || [])]; nd[i] = e.target.value; onUpdate({ details: nd }); }} className={`${subtleInputClass} flex-1 text-[10px]`} placeholder="Feature" />
                <button onClick={() => onUpdate({ details: (room.details || []).filter((_: any, j: number) => j !== i) })} className="h-5 w-5 flex items-center justify-center rounded text-slate-300 hover:text-rose-500"><X size={10} /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PANEL
// ═══════════════════════════════════════════════════════════════════════════

export default React.memo(function RealEstateProductsPanel({
  data,
  onAddCustomProduct,
  onUpdate,
  onRemove,
}: {
  data: ProductsData;
  onAddCustomProduct: () => void;
  onUpdate: (index: number, updates: Partial<ProductItem>) => void;
  onRemove: (id: string) => void;
}) {
  const products = data.products;
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(() => {
    if (products.length > 0) return { [products[0].id]: true };
    return {};
  });
  const [selectedRoomIds, setSelectedRoomIds] = useState<Record<string, string>>({});

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddRoom = (productIndex: number) => {
    const product = products[productIndex];
    const rooms = product.rooms || [];
    const newRoom = {
      id: `room-${Date.now()}`,
      name: 'New Room',
      area: '200 sqft',
      atmosphere: 'Peaceful space',
      note: 'A beautifully designed space.',
      details: ['Premium finish', 'Natural light'],
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80',
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80'],
      label: 'Room',
      direction: { x: 0, y: 0, scale: 1 },
    };
    onUpdate(productIndex, { rooms: [...rooms, newRoom] } as any);
  };

  const handleUpdateRoom = (productIndex: number, roomIndex: number, updates: any) => {
    const product = products[productIndex];
    const rooms = [...(product.rooms || [])];
    rooms[roomIndex] = { ...rooms[roomIndex], ...updates };
    onUpdate(productIndex, { rooms } as any);
  };

  const handleRemoveRoom = (productIndex: number, roomIndex: number) => {
    const product = products[productIndex];
    const rooms = (product.rooms || []).filter((_: any, i: number) => i !== roomIndex);
    onUpdate(productIndex, { rooms } as any);
  };

  return (
    <div className="space-y-8 pb-20">
      <PanelTitle
        icon={Building2}
        label="Residence Layouts"
        meta={`${products.length} configurations`}
        action={
          <button
            onClick={onAddCustomProduct}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 shadow-lg shadow-slate-900/20 bg-slate-900 text-white hover:bg-slate-800"
          >
            <Plus size={14} />
            Add BHK
          </button>
        }
      />

      {/* Residence List */}
      <div className="space-y-4">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 py-16 px-6 text-center">
            <Building2 className="mb-4 text-slate-300" size={40} />
            <p className="text-sm font-black text-slate-500">No residences added</p>
            <p className="mt-1 text-[11px] text-slate-400 max-w-[200px]">Add your BHK configurations to showcase in the funnel.</p>
          </div>
        ) : (
          products.map((product, index) => {
            const isExpanded = expandedItems[product.id];
            const rooms = product.rooms || [];
            return (
              <div key={product.id} className={`group relative rounded-[2rem] border transition-all ${isExpanded ? 'border-slate-300 bg-white shadow-xl' : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'}`}>
                {/* Residence Header */}
                <div className="flex items-center gap-4 p-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-100 shadow-inner bg-slate-50 flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Home size={24} className="text-slate-300" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <input
                      value={product.name}
                      onChange={(e) => onUpdate(index, { name: e.target.value })}
                      className="w-full truncate rounded-md border-0 bg-transparent p-0 text-sm font-black text-slate-900 outline-none focus:ring-0 placeholder:text-slate-300"
                      placeholder="e.g. 3 BHK Signature"
                    />
                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-[10px] font-bold text-emerald-500 tracking-wider">{product.priceLabel}</span>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.dimensions || '—'}</span>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">{rooms.length} rooms</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconButton label="Delete Residence" onClick={() => onRemove(product.id)}>
                      <Trash2 size={16} className="text-slate-300 hover:text-rose-500" />
                    </IconButton>
                    <button
                      onClick={() => toggleExpand(product.id)}
                      className={`h-8 w-8 flex items-center justify-center rounded-lg transition-colors ${isExpanded ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Residence Details */}
                {isExpanded && (
                  <div className="p-6 pt-0 space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="h-px bg-slate-50 w-full" />

                    {/* Section 1: Identity */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Residence Identity</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Price Label">
                          <input
                            value={product.priceLabel}
                            onChange={(e) => onUpdate(index, { priceLabel: e.target.value })}
                            className={subtleInputClass}
                            placeholder="₹ 6.2 Cr"
                          />
                        </Field>
                        <Field label="Total Area">
                          <input
                            value={product.dimensions || ''}
                            onChange={(e) => onUpdate(index, { dimensions: e.target.value })}
                            className={subtleInputClass}
                            placeholder="1,850 sqft"
                          />
                        </Field>
                      </div>

                      <div>
                        <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Hero Image</label>
                        <ImageUpload
                          defaultImage={product.image}
                          onUploadComplete={(url) => onUpdate(index, { image: url })}
                        />
                      </div>

                      <Field label="Description">
                        <textarea
                          value={product.description ?? ''}
                          onChange={(e) => onUpdate(index, { description: e.target.value })}
                          className={`${subtleInputClass} min-h-[80px] resize-none`}
                          placeholder="Sea-facing living volume with private deck..."
                        />
                      </Field>
                    </div>

                    {/* Section 2: Conversion Hooks */}
                    <div className="space-y-4 rounded-[2rem] bg-amber-50/30 p-5 border border-amber-100/50">
                      <div className="flex items-center gap-2">
                        <Zap size={14} className="text-amber-500 fill-amber-500/20" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-900/60">Conversion Hooks</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Urgency Badge">
                          <input
                            value={product.urgency}
                            onChange={(e) => onUpdate(index, { urgency: e.target.value })}
                            className={`${subtleInputClass} bg-white border-amber-100/50`}
                            placeholder="3 Units Remaining"
                          />
                        </Field>
                        <Field label="Possession">
                          <input
                            value={product.delivery}
                            onChange={(e) => onUpdate(index, { delivery: e.target.value })}
                            className={`${subtleInputClass} bg-white border-amber-100/50`}
                            placeholder="Possession: Q4 2025"
                          />
                        </Field>
                      </div>
                    </div>

                    {/* Section 3: Rooms */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DoorOpen size={14} className="text-indigo-500" />
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-900/60">Rooms & Spaces</p>
                        </div>
                        <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">{rooms.length} rooms</span>
                      </div>

                      {/* Interactive Blueprint Layout Editor */}
                      {rooms.length > 0 && (
                        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/20 p-4">
                          <BlueprintLayoutEditor
                            rooms={rooms}
                            selectedRoomId={selectedRoomIds[product.id]}
                            onSelectRoom={(roomId) => setSelectedRoomIds(prev => ({ ...prev, [product.id]: roomId }))}
                            onUpdateRoom={(roomIndex, coords) => handleUpdateRoom(index, roomIndex, coords)}
                          />
                        </div>
                      )}

                      <div className="space-y-1.5">
                        {rooms.map((room: any, rIdx: number) => (
                          <RoomEditor
                            key={room.id || rIdx}
                            room={room}
                            index={rIdx}
                            onUpdate={(updates) => handleUpdateRoom(index, rIdx, updates)}
                            onRemove={() => handleRemoveRoom(index, rIdx)}
                            isSelected={selectedRoomIds[product.id] === room.id}
                            onSelect={() => setSelectedRoomIds(prev => ({ ...prev, [product.id]: room.id }))}
                          />
                        ))}
                      </div>

                      {/* Quick-add — clean text-only chips */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[9px] text-slate-300 font-bold uppercase tracking-wider mr-0.5">Add:</span>
                        {[
                          { name: 'Living Room', area: '320 sqft', type: 'living', label: 'Living', w: 56, h: 44 },
                          { name: 'Kitchen', area: '140 sqft', type: 'kitchen', label: 'Kitchen', w: 36, h: 36 },
                          { name: 'Bedroom', area: '200 sqft', type: 'bedroom', label: 'Bedroom', w: 34, h: 34 },
                          { name: 'Bathroom', area: '45 sqft', type: 'bathroom', label: 'Bath', w: 14, h: 16 },
                          { name: 'Balcony', area: '60 sqft', type: 'balcony', label: 'Balcony', w: 22, h: 10 },
                          { name: 'Entrance', area: '40 sqft', type: 'entrance', label: 'Entrance', w: 15, h: 12 },
                        ].map((p) => (
                          <button
                            key={p.type}
                            onClick={() => {
                              const newRoom = {
                                id: `${p.type}-${Date.now()}`,
                                name: p.name, type: p.type, area: p.area,
                                atmosphere: '', note: '', details: [],
                                img: '', images: [],
                                label: p.label, w: p.w, h: p.h,
                                direction: { x: 0, y: 0, scale: 1 },
                              };
                              const currentRooms = products[index].rooms || [];
                              onUpdate(index, { rooms: [...currentRooms, newRoom] } as any);
                            }}
                            className="px-2 py-0.5 rounded text-[10px] font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            + {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});
