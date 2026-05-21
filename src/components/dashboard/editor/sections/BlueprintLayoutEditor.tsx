'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Move, Maximize2, GripVertical, ZoomIn, ZoomOut, RotateCw, Lock, Unlock } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// ROOM TYPE SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

export const ROOM_TYPES = [
  { value: 'living',    label: 'Living Room',  icon: '🛋️', color: 'indigo' },
  { value: 'bedroom',   label: 'Bedroom',      icon: '🛏️', color: 'violet' },
  { value: 'kitchen',   label: 'Kitchen',      icon: '🍳', color: 'amber' },
  { value: 'bathroom',  label: 'Bathroom',     icon: '🚿', color: 'cyan' },
  { value: 'balcony',   label: 'Balcony',      icon: '🌿', color: 'emerald' },
  { value: 'entrance',  label: 'Entrance',     icon: '🚪', color: 'rose' },
  { value: 'corridor',  label: 'Corridor',     icon: '↔️', color: 'slate' },
  { value: 'utility',   label: 'Utility',      icon: '⚡', color: 'orange' },
  { value: 'dining',    label: 'Dining',       icon: '🍽️', color: 'teal' },
  { value: 'pooja',     label: 'Pooja Room',   icon: '🪔', color: 'yellow' },
  { value: 'study',     label: 'Study',        icon: '📚', color: 'blue' },
  { value: 'store',     label: 'Store Room',   icon: '📦', color: 'stone' },
] as const;

export const QUICK_ADD_PRESETS = [
  { type: 'entrance',  label: 'Entrance',  name: 'Entrance',  area: '40 sqft',  w: 15, h: 12, icon: '🚪' },
  { type: 'bathroom',  label: 'Bath',      name: 'Bathroom',  area: '45 sqft',  w: 14, h: 16, icon: '🚿' },
  { type: 'balcony',   label: 'Balcony',   name: 'Balcony',   area: '60 sqft',  w: 22, h: 10, icon: '🌿' },
  { type: 'utility',   label: 'Utility',   name: 'Utility',   area: '30 sqft',  w: 12, h: 12, icon: '⚡' },
  { type: 'pooja',     label: 'Pooja',     name: 'Pooja Room', area: '25 sqft', w: 10, h: 10, icon: '🪔' },
  { type: 'corridor',  label: 'Passage',   name: 'Passage',   area: '35 sqft',  w: 8,  h: 30, icon: '↔️' },
] as const;

const TYPE_COLORS: Record<string, { border: string; bg: string; bgSelected: string; text: string; fill: string }> = {
  living:   { border: '#6366f1', bg: 'rgba(99,102,241,0.06)',  bgSelected: 'rgba(99,102,241,0.15)',  text: '#4f46e5', fill: '#6366f1' },
  bedroom:  { border: '#8b5cf6', bg: 'rgba(139,92,246,0.06)',  bgSelected: 'rgba(139,92,246,0.15)',  text: '#7c3aed', fill: '#8b5cf6' },
  kitchen:  { border: '#f59e0b', bg: 'rgba(245,158,11,0.06)',  bgSelected: 'rgba(245,158,11,0.15)',  text: '#d97706', fill: '#f59e0b' },
  bathroom: { border: '#06b6d4', bg: 'rgba(6,182,212,0.06)',   bgSelected: 'rgba(6,182,212,0.15)',   text: '#0891b2', fill: '#06b6d4' },
  balcony:  { border: '#10b981', bg: 'rgba(16,185,129,0.06)',  bgSelected: 'rgba(16,185,129,0.15)',  text: '#059669', fill: '#10b981' },
  entrance: { border: '#f43f5e', bg: 'rgba(244,63,94,0.06)',   bgSelected: 'rgba(244,63,94,0.15)',   text: '#e11d48', fill: '#f43f5e' },
  corridor: { border: '#94a3b8', bg: 'rgba(148,163,184,0.06)', bgSelected: 'rgba(148,163,184,0.15)', text: '#64748b', fill: '#94a3b8' },
  utility:  { border: '#f97316', bg: 'rgba(249,115,22,0.06)',  bgSelected: 'rgba(249,115,22,0.15)',  text: '#ea580c', fill: '#f97316' },
  dining:   { border: '#14b8a6', bg: 'rgba(20,184,166,0.06)',  bgSelected: 'rgba(20,184,166,0.15)',  text: '#0d9488', fill: '#14b8a6' },
  pooja:    { border: '#eab308', bg: 'rgba(234,179,8,0.06)',   bgSelected: 'rgba(234,179,8,0.15)',   text: '#ca8a04', fill: '#eab308' },
  study:    { border: '#3b82f6', bg: 'rgba(59,130,246,0.06)',  bgSelected: 'rgba(59,130,246,0.15)',  text: '#2563eb', fill: '#3b82f6' },
  store:    { border: '#a8a29e', bg: 'rgba(168,162,158,0.06)', bgSelected: 'rgba(168,162,158,0.15)', text: '#78716c', fill: '#a8a29e' },
};

const DEFAULT_COLORS = TYPE_COLORS.living;

function getTypeFromRoom(room: RoomLayout): string {
  if (room.type) return room.type;
  const id = String(room.id).toLowerCase();
  if (id.includes('living')) return 'living';
  if (id.includes('kitchen')) return 'kitchen';
  if (id.includes('master') || id.includes('bed') || id.includes('guest')) return 'bedroom';
  if (id.includes('bath') || id.includes('toilet') || id.includes('wc')) return 'bathroom';
  if (id.includes('balcony') || id.includes('deck') || id.includes('terrace')) return 'balcony';
  if (id.includes('entrance') || id.includes('foyer') || id.includes('lobby')) return 'entrance';
  if (id.includes('corridor') || id.includes('passage') || id.includes('hall')) return 'corridor';
  if (id.includes('utility') || id.includes('wash')) return 'utility';
  if (id.includes('dining')) return 'dining';
  if (id.includes('pooja') || id.includes('prayer') || id.includes('mandir')) return 'pooja';
  if (id.includes('study') || id.includes('office')) return 'study';
  if (id.includes('store')) return 'store';
  return 'living';
}

function getColors(room: RoomLayout) {
  return TYPE_COLORS[getTypeFromRoom(room)] || DEFAULT_COLORS;
}

interface RoomLayout {
  id: string;
  label?: string;
  name?: string;
  area?: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  type?: string;
  locked?: boolean;
  [key: string]: any;
}

interface BlueprintLayoutEditorProps {
  rooms: RoomLayout[];
  onUpdateRoom: (roomIndex: number, updates: { x: number; y: number; w: number; h: number }) => void;
  selectedRoomId?: string;
  onSelectRoom?: (roomId: string) => void;
}

function getFallbackCoords(index: number, totalRooms: number) {
  const columns = Math.ceil(Math.sqrt(totalRooms));
  const rows = Math.ceil(totalRooms / columns);
  const colIndex = index % columns;
  const rowIndex = Math.floor(index / columns);
  const w = Math.max(20, Math.floor(88 / columns));
  const h = Math.max(20, Math.floor(88 / rows));
  const x = 6 + colIndex * (w + 4);
  const y = 6 + rowIndex * (h + 4);
  return { x, y, w, h };
}

const KNOWN_COORDS: Record<string, { x: number; y: number; w: number; h: number }> = {
  living: { x: 6, y: 8, w: 56, h: 44 },
  kitchen: { x: 6, y: 56, w: 36, h: 36 },
  master: { x: 46, y: 56, w: 48, h: 36 },
  deck: { x: 66, y: 8, w: 28, h: 44 },
  guest: { x: 54, y: 48, w: 22, h: 44 },
};

function resolveCoords(room: RoomLayout, index: number, total: number) {
  if (room.x !== undefined && room.y !== undefined && room.w !== undefined && room.h !== undefined) {
    return { x: room.x, y: room.y, w: room.w, h: room.h };
  }
  const idClean = String(room.id).toLowerCase();
  for (const k of Object.keys(KNOWN_COORDS)) {
    if (idClean.includes(k)) return KNOWN_COORDS[k];
  }
  return getFallbackCoords(index, total);
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

// Smart label font size based on room dimensions
function getLabelSize(w: number, h: number): { fontSize: number; show: boolean } {
  const area = w * h;
  if (area < 150) return { fontSize: 6, show: true };
  if (area < 300) return { fontSize: 7, show: true };
  if (area < 600) return { fontSize: 8, show: true };
  return { fontSize: 9, show: true };
}

export default function BlueprintLayoutEditor({
  rooms,
  onUpdateRoom,
  selectedRoomId,
  onSelectRoom,
}: BlueprintLayoutEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{
    type: 'move' | 'resize';
    roomIndex: number;
    startMouseX: number;
    startMouseY: number;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
    currentX: number;
    currentY: number;
    currentW: number;
    currentH: number;
  } | null>(null);

  const resolved: RoomLayout[] = rooms.map((r, i) => ({
    ...r,
    ...resolveCoords(r, i, rooms.length),
  }));

  const pxToPercent = useCallback((pxX: number, pxY: number) => {
    if (!containerRef.current) return { dx: 0, dy: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      dx: (pxX / rect.width) * 100 / zoom,
      dy: (pxY / rect.height) * 100 / zoom,
    };
  }, [zoom]);

  // Mouse drag
  useEffect(() => {
    if (!dragState) return;
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const { dx, dy } = pxToPercent(e.clientX - dragState.startMouseX, e.clientY - dragState.startMouseY);
      
      setDragState(prev => {
        if (!prev) return null;
        if (prev.type === 'move') {
          return {
            ...prev,
            currentX: clamp(Math.round(prev.startX + dx), 0, 100 - prev.startW),
            currentY: clamp(Math.round(prev.startY + dy), 0, 100 - prev.startH),
          };
        } else {
          return {
            ...prev,
            currentW: clamp(Math.round(prev.startW + dx), 8, 100 - prev.startX),
            currentH: clamp(Math.round(prev.startH + dy), 8, 100 - prev.startY),
          };
        }
      });
    };
    const handleMouseUp = () => {
      onUpdateRoom(dragState.roomIndex, {
        x: dragState.currentX,
        y: dragState.currentY,
        w: dragState.currentW,
        h: dragState.currentH,
      });
      setDragState(null);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
  }, [dragState, pxToPercent, onUpdateRoom]);

  // Touch drag — preventDefault stops parent horizontal scroll from hijacking the gesture
  useEffect(() => {
    if (!dragState) return;
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      const { dx, dy } = pxToPercent(t.clientX - dragState.startMouseX, t.clientY - dragState.startMouseY);
      
      setDragState(prev => {
        if (!prev) return null;
        if (prev.type === 'move') {
          return {
            ...prev,
            currentX: clamp(Math.round(prev.startX + dx), 0, 100 - prev.startW),
            currentY: clamp(Math.round(prev.startY + dy), 0, 100 - prev.startH),
          };
        } else {
          return {
            ...prev,
            currentW: clamp(Math.round(prev.startW + dx), 8, 100 - prev.startX),
            currentH: clamp(Math.round(prev.startH + dy), 8, 100 - prev.startY),
          };
        }
      });
    };
    const handleTouchEnd = () => {
      onUpdateRoom(dragState.roomIndex, {
        x: dragState.currentX,
        y: dragState.currentY,
        w: dragState.currentW,
        h: dragState.currentH,
      });
      setDragState(null);
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    return () => { window.removeEventListener('touchmove', handleTouchMove); window.removeEventListener('touchend', handleTouchEnd); };
  }, [dragState, pxToPercent, onUpdateRoom]);

  const startDrag = (
    e: React.MouseEvent | React.TouchEvent,
    type: 'move' | 'resize',
    roomIndex: number,
    coords: { x: number; y: number; w: number; h: number }
  ) => {
    if (rooms[roomIndex].locked) {
      e.stopPropagation();
      e.preventDefault();
      onSelectRoom?.(rooms[roomIndex].id);
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragState({ 
      type, 
      roomIndex, 
      startMouseX: clientX, 
      startMouseY: clientY, 
      startX: coords.x, 
      startY: coords.y, 
      startW: coords.w, 
      startH: coords.h,
      currentX: coords.x,
      currentY: coords.y,
      currentW: coords.w,
      currentH: coords.h,
    });
    onSelectRoom?.(rooms[roomIndex].id);
  };

  const handleRotate = (idx: number) => {
    const room = resolved[idx];
    const newW = room.h || 10;
    const newH = room.w || 10;
    const clampedX = clamp(room.x || 0, 0, Math.max(0, 100 - newW));
    const clampedY = clamp(room.y || 0, 0, Math.max(0, 100 - newH));
    onUpdateRoom(idx, { x: clampedX, y: clampedY, w: newW, h: newH });
  };

  return (
    <div className="space-y-3">
      {/* Header with zoom controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-slate-100 flex items-center justify-center">
            <Move size={12} className="text-slate-500" />
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Blueprint Layout</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom(z => Math.max(0.6, z - 0.2))} className="h-6 w-6 rounded flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" title="Zoom out">
            <ZoomOut size={12} />
          </button>
          <span className="text-[9px] font-bold text-slate-300 w-8 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(2, z + 0.2))} className="h-6 w-6 rounded flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" title="Zoom in">
            <ZoomIn size={12} />
          </button>
          {zoom !== 1 && (
            <button onClick={() => setZoom(1)} className="text-[8px] font-bold text-indigo-500 hover:text-indigo-700 ml-1">Reset</button>
          )}
        </div>
      </div>

      {/* Zoomable Canvas */}
      <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 overflow-auto" style={{ maxHeight: zoom > 1 ? '400px' : 'none' }}>
        <div
          ref={containerRef}
          className="relative aspect-[16/10] select-none origin-top-left"
          style={{
            width: `${zoom * 100}%`,
            cursor: dragState ? (dragState.type === 'move' ? 'grabbing' : 'nwse-resize') : 'default',
            touchAction: 'none',
          }}
        >
          {/* Grid */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
            <defs>
              <pattern id="blueprint-grid" width="10%" height="10%" patternUnits="userSpaceOnUse" patternContentUnits="objectBoundingBox">
                <path d="M1 0V1 M0 1H1" fill="none" stroke="#e2e0dc" strokeWidth="0.003" />
              </pattern>
              <pattern id="bath-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" stroke="#06b6d4" strokeWidth="0.5" opacity="0.3" />
              </pattern>
              <pattern id="balcony-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#10b981" strokeWidth="0.5" opacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
          </svg>

          {/* Quarter lines */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {[25, 50, 75].map(p => (
              <React.Fragment key={p}>
                <div className="absolute top-0 bottom-0 border-l border-dashed border-slate-200" style={{ left: `${p}%` }} />
                <div className="absolute left-0 right-0 border-t border-dashed border-slate-200" style={{ top: `${p}%` }} />
              </React.Fragment>
            ))}
          </div>

          {/* Room boxes */}
          {resolved.map((room, idx) => {
            const isSelected = room.id === selectedRoomId;
            const isDragging = dragState?.roomIndex === idx;
            const isHovered = hoveredRoom === room.id;
            const label = room.label || room.name || 'Room';
            const roomType = getTypeFromRoom(room);
            const colors = getColors(room);
            const isEntrance = roomType === 'entrance';
            const isBathroom = roomType === 'bathroom';
            const isBalcony = roomType === 'balcony';

            // Smart rotation & character-fit font size calculation
            const isVertical = (room.h || 10) > (room.w || 10) * 1.25;
            const needsRotation = isVertical && (room.w || 10) < 22;
            const availableSpace = needsRotation ? (room.h || 10) : (room.w || 10);
            const labelLength = label.length;
            const charWidthFactor = 0.46; // Sattoshi font letter spacing factor

            let fontSize = 9;
            const requiredSpace = labelLength * fontSize * charWidthFactor;
            if (requiredSpace > availableSpace) {
              fontSize = Math.max(5.5, (availableSpace / (labelLength * charWidthFactor)));
            }

            // Cap for extremely tight bounds
            if ((room.w || 10) < 9 && !needsRotation) fontSize = 5.5;
            if ((room.h || 10) < 9 && needsRotation) fontSize = 5.5;

            const rotateStyle = needsRotation ? { writingMode: 'vertical-rl' as const, transform: 'rotate(180deg)' } : {};

            return (
              <div
                key={room.id}
                className={`absolute group ${isDragging ? '' : 'transition-all duration-150'}`}
                style={{
                  left: `${isDragging ? dragState.currentX : room.x}%`,
                  top: `${isDragging ? dragState.currentY : room.y}%`,
                  width: `${isDragging ? dragState.currentW : room.w}%`,
                  height: `${isDragging ? dragState.currentH : room.h}%`,
                  zIndex: isSelected ? 20 : isHovered ? 10 : 0,
                  pointerEvents: room.locked && !isSelected ? 'none' : 'auto'
                }}
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                {/* Room body */}
                <div
                  className="absolute inset-0 rounded-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-colors duration-150 overflow-hidden"
                  style={{
                    border: `2px ${isBalcony ? 'dashed' : 'solid'} ${isSelected ? colors.border : isDragging ? colors.border : `${colors.border}40`}`,
                    background: isSelected ? colors.bgSelected : colors.bg,
                    boxShadow: isSelected ? `0 2px 12px ${colors.border}30` : 'none',
                    cursor: room.locked ? 'default' : isDragging ? 'grabbing' : 'grab'
                  }}
                  onMouseDown={(e) => startDrag(e, 'move', idx, { x: room.x || 0, y: room.y || 0, w: room.w || 10, h: room.h || 10 })}
                  onTouchStart={(e) => startDrag(e, 'move', idx, { x: room.x || 0, y: room.y || 0, w: room.w || 10, h: room.h || 10 })}
                  onClick={(e) => { e.stopPropagation(); onSelectRoom?.(room.id); }}
                >
                  {isBathroom && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none"><rect width="100%" height="100%" fill="url(#bath-hatch)" /></svg>
                  )}
                  {isBalcony && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none"><rect width="100%" height="100%" fill="url(#balcony-hatch)" /></svg>
                  )}

                  {/* Lock Indicator Badge */}
                  {room.locked && (
                    <div className="absolute top-1.5 right-1.5 opacity-60 pointer-events-none" style={{ color: colors.text }}>
                      <Lock size={8} />
                    </div>
                  )}

                  {/* Smart dynamic auto-fit & rotating label */}
                  <span
                    className="font-black uppercase tracking-[0.08em] leading-none text-center pointer-events-none max-w-full block whitespace-nowrap select-none"
                    style={{
                      fontSize: `${fontSize}px`,
                      color: isSelected ? colors.text : `${colors.text}90`,
                      ...rotateStyle
                    }}
                  >
                    {label}
                  </span>

                  {/* Grip indicator */}
                  {!room.locked && (
                    <div className={`absolute top-0.5 left-0.5 opacity-0 group-hover:opacity-60 transition-opacity ${isSelected ? 'opacity-60' : ''}`}>
                      <GripVertical size={8} style={{ color: colors.border }} />
                    </div>
                  )}
                </div>

                {/* Hover tooltip — shows full name + area */}
                {(isHovered || isSelected) && !isDragging && (
                  <div
                    className="absolute -top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none whitespace-nowrap"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                  >
                    <div className="bg-slate-800 text-white px-2 py-1 rounded text-[9px] font-bold flex items-center gap-1.5">
                      <span>{room.name || label}</span>
                      {room.area && <span className="text-slate-400 font-normal">· {room.area}</span>}
                    </div>
                    <div className="w-2 h-2 bg-slate-800 rotate-45 mx-auto -mt-1" />
                  </div>
                )}

                {/* Rotate button — only visible on selected room */}
                {isSelected && !isDragging && !room.locked && (
                  <button
                    className="absolute -top-2 -right-2 z-20 h-5 w-5 rounded-full bg-white border-2 flex items-center justify-center shadow-md hover:bg-indigo-50 transition-colors cursor-pointer"
                    style={{ borderColor: colors.border }}
                    onClick={(e) => { e.stopPropagation(); handleRotate(idx); }}
                    title="Rotate (swap width ↔ height)"
                  >
                    <RotateCw size={9} style={{ color: colors.border }} />
                  </button>
                )}

                {/* Resize handle */}
                {!room.locked && (
                  <div
                    className={`absolute -bottom-1.5 -right-1.5 h-4 w-4 rounded-full border-2 cursor-nwse-resize z-10 transition-all ${isSelected ? 'shadow-md' : 'opacity-0 group-hover:opacity-100'}`}
                    style={{ borderColor: isSelected ? colors.border : '#cbd5e1', background: isSelected ? colors.fill : '#fff' }}
                    onMouseDown={(e) => startDrag(e, 'resize', idx, { x: room.x || 0, y: room.y || 0, w: room.w || 10, h: room.h || 10 })}
                    onTouchStart={(e) => startDrag(e, 'resize', idx, { x: room.x || 0, y: room.y || 0, w: room.w || 10, h: room.h || 10 })}
                  >
                    <Maximize2 size={8} className="absolute inset-0 m-auto" style={{ color: isSelected ? '#fff' : '#94a3b8' }} />
                  </div>
                )}
              </div>
            );
          })}

          {rooms.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-[11px] font-bold text-slate-300">Add rooms below to build the blueprint</p>
            </div>
          )}
        </div>
      </div>

      {/* Room legend — compact colored dots */}
      {rooms.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {resolved.map((room) => {
            const colors = getColors(room);
            const isActive = room.id === selectedRoomId;
            return (
              <button
                key={room.id}
                onClick={() => onSelectRoom?.(room.id)}
                className="flex items-center gap-1.5 transition-opacity hover:opacity-100"
                style={{ opacity: isActive ? 1 : 0.55 }}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: colors.fill, boxShadow: isActive ? `0 0 0 2px ${colors.fill}30` : 'none' }} />
                <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: isActive ? colors.text : '#94a3b8' }}>
                  {room.label || room.name || 'Room'}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
