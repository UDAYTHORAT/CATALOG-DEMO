'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Plus, Trash2,
  ChevronDown, ChevronUp,
  Home, DoorOpen, Zap, Clock, Compass,
  LayoutList, X, Ruler, MapPin,
  Lock, Unlock
} from 'lucide-react';
import { Field, IconButton, PanelTitle, subtleInputClass, inputClass } from '../ui';
import type { ProductItem, ProductsData, HeroData } from '../types';
import { ImageUpload } from '@/components/dashboard/ImageUpload';
import BlueprintLayoutEditor from './BlueprintLayoutEditor';

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ROOM EDITOR â€” Ultra-minimal: just name + area
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

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
          <Field label="Architectural Quote / Note">
            <textarea
              value={room.note || ''}
              onChange={(e) => onUpdate({ note: e.target.value })}
              className={`${subtleInputClass} text-[11px] resize-none w-full p-2 border border-slate-100 rounded`}
              rows={2}
              placeholder="e.g. A masterfully designed volume."
            />
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// MAIN PANEL
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export default React.memo(function RealEstateLayoutsPanel({
  data,
  onUpdate,
}: {
  data: ProductsData;
  onUpdate: (index: number, updates: Partial<ProductItem>) => void;
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
        icon={LayoutList}
        label="Blueprint Layout Editor"
        meta={`${products.length} layouts configured`}
      />

      <div className="space-y-4">
        {products.map((product, index) => {
          const isExpanded = expandedItems[product.id];
          const rooms = product.rooms || [];
          return (
            <div 
              key={product.id} 
              id={index === 0 ? "tour-layouts-details" : undefined}
              className={`group relative rounded-[2rem] border transition-all ${isExpanded ? 'border-slate-300 bg-white shadow-xl' : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'}`}
            >
              <div className="flex items-center gap-4 p-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-100 shadow-inner bg-slate-50 flex items-center justify-center">
                  {product.image ? (
                    <img src={product.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Home size={24} className="text-slate-300" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="w-full truncate text-sm font-black text-slate-900">{product.name}</p>
                  <div className="mt-1 flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.dimensions || '—'}</span>
                    <span className="text-[10px] text-slate-300">•</span>
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">{rooms.length} rooms</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleExpand(product.id)}
                    className={`h-8 w-8 flex items-center justify-center rounded-lg transition-colors ${isExpanded ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>
 
              {isExpanded && (
                <div className="p-6 pt-0 space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="h-px bg-slate-50 w-full" />
                  <div className="space-y-4">
                    <div id="tour-layouts-canvas" className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DoorOpen size={14} className="text-indigo-500" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-900/60">Canvas Layout</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {/* Direction / Facing */}
                        <div className="flex items-center gap-2 border-r border-indigo-200/50 pr-3">
                          <Compass size={12} className="text-indigo-400" />
                          <input
                            type="text"
                            placeholder="e.g. East Facing"
                            value={product.facing || ''}
                            onChange={(e) => onUpdate(index, { facing: e.target.value } as any)}
                            className="w-28 bg-transparent text-[9px] font-bold uppercase tracking-wider text-indigo-900 placeholder:text-indigo-300 focus:outline-none border-none p-0"
                          />
                        </div>
                        <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">{rooms.length} rooms</span>
                      </div>
                    </div>
 
                    {rooms.length > 0 && (
                      <div id="tour-layouts-designer" className="rounded-2xl border border-indigo-100 bg-indigo-50/20 p-4">
                        <BlueprintLayoutEditor
                          rooms={rooms}
                          selectedRoomId={selectedRoomIds[product.id]}
                          onSelectRoom={(roomId) => setSelectedRoomIds(prev => ({ ...prev, [product.id]: roomId }))}
                          onUpdateRoom={(roomIndex, coords) => handleUpdateRoom(index, roomIndex, coords)}
                          onAddRoom={(p) => {
                            const newRoom = {
                              id: `${p.type}-${Date.now()}`,
                              name: p.name, type: p.type, area: p.area,
                              atmosphere: '', note: '', details: [],
                              img: '', images: [],
                              label: p.label, w: p.w, h: p.h,
                              direction: { x: 0, y: 0, scale: 1 },
                            };
                            onUpdate(index, { rooms: [...rooms, newRoom] } as any);
                            setSelectedRoomIds(prev => ({ ...prev, [product.id]: newRoom.id }));
                          }}
                          onDeleteRoom={(roomId) => {
                            const rIdx = rooms.findIndex((r: any) => r.id === roomId);
                            if (rIdx >= 0) handleRemoveRoom(index, rIdx);
                          }}
                        />
                      </div>
                    )}
                    <div id="tour-layouts-rooms" className="space-y-1.5 mt-4">
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
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
