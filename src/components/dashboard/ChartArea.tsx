'use client';

import { useState, useRef, useCallback } from 'react';

interface ChartDataPoint {
  label: string;
  value: number;
}

interface ChartAreaProps {
  data?: ChartDataPoint[];
  title?: string;
  subtitle?: string;
}

const DEFAULT_DATA: ChartDataPoint[] = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 8 },
  { label: 'Wed', value: 15 },
  { label: 'Thu', value: 10 },
  { label: 'Fri', value: 22 },
  { label: 'Sat', value: 18 },
  { label: 'Sun', value: 25 },
];

export function ChartArea({ data, title = 'Lead Acquisition', subtitle = 'Tracking visitor-to-lead conversion' }: ChartAreaProps) {
  const [activeRange, setActiveRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number; label: string } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const chartData = data || DEFAULT_DATA;
  const max = Math.max(...chartData.map(d => d.value));
  const min = Math.min(...chartData.map(d => d.value));
  const range = max - min || 1;
  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  const padTop = 12;
  const padBottom = 12;
  const chartH = 100 - padTop - padBottom;

  const getY = (val: number) => padTop + chartH - ((val - min) / range) * chartH;

  const points = chartData.map((d, i) => {
    const x = (i / Math.max(chartData.length - 1, 1)) * 100;
    const y = getY(d.value);
    return { x, y, ...d };
  });

  const linePoints = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaPoints = `0,${100 - padBottom} ${linePoints} 100,${100 - padBottom}`;

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    
    // Find closest point
    let closest = points[0];
    let minDist = Infinity;
    for (const p of points) {
      const dist = Math.abs(p.x - xPercent);
      if (dist < minDist) {
        minDist = dist;
        closest = p;
      }
    }

    setTooltip({ x: closest.x, y: closest.y, value: closest.value, label: closest.label });
  }, [points]);

  const ranges = ['7d', '30d', '90d'] as const;

  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden transition-shadow duration-300 hover:shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-8 pt-8 pb-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
          <p className="text-sm font-medium text-slate-400 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Time range tabs */}
          <div className="flex p-1.5 bg-slate-900/5 rounded-xl border border-slate-900/5">
            {ranges.map(r => (
              <button
                key={r}
                onClick={() => setActiveRange(r)}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                  activeRange === r
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-white/50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          {/* Total badge */}
          <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100/50 text-indigo-600 text-xs font-black tracking-wide shadow-sm">
            <span className="text-indigo-400 mr-1">TOTAL</span>
            {total}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-[250px] w-full px-8 pb-12 mt-4">
        {/* Container for SVG and Dots that respects the parent padding */}
        <div className="relative w-full h-full">
          <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full overflow-visible cursor-crosshair"
            preserveAspectRatio="none"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTooltip(null)}
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = padTop + chartH * (1 - pct);
              return (
                <line
                  key={i}
                  x1="0" y1={y} x2="100" y2={y}
                  stroke="#e2e8f0" strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}

            {/* Area fill */}
            <polygon points={areaPoints} fill="url(#areaGrad)" />

            {/* Line */}
            <polyline
              points={linePoints}
              fill="none"
              stroke="#4f46e5"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              className="animate-line-draw drop-shadow-sm"
            />

            {/* Data dots are moved to HTML overlay to prevent stretching */}

            {/* Tooltip tracking line */}
            {tooltip && (
              <>
                <line
                  x1={tooltip.x} y1={padTop}
                  x2={tooltip.x} y2={100 - padBottom}
                  stroke="#4f46e5" strokeWidth="2" strokeDasharray="4 4" opacity="0.3"
                  vectorEffect="non-scaling-stroke"
                />
              </>
            )}
          </svg>

          {/* HTML Data Dots Overlay (Prevents SVG Oval Distortion) */}
          {points.map((p, i) => (
            <div
              key={i}
              className={`absolute w-3.5 h-3.5 bg-white border-[3px] border-indigo-600 rounded-full transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 ${
                tooltip?.label === p.label ? 'scale-[1.7] shadow-lg shadow-indigo-500/40 bg-indigo-50' : 'scale-100 shadow-sm'
              }`}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
              }}
            />
          ))}

          {/* Tooltip label (HTML overlay) */}
          {tooltip && (
            <div
              className="absolute pointer-events-none z-20 transition-all duration-200 ease-out"
              style={{
                left: `${tooltip.x}%`,
                top: `${(tooltip.y / 100) * 202 - 40}px`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div className="bg-[#0A0A0A] text-white px-4 py-2.5 rounded-xl text-[13px] font-black shadow-2xl shadow-black/40 whitespace-nowrap flex items-center gap-2 border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-violet-500/20" />
                <span className="text-indigo-300 relative z-10 uppercase tracking-wider text-[10px]">{tooltip.label}</span>
                <span className="relative z-10 flex items-center gap-1">
                  <span className="text-base text-white">{tooltip.value}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Leads</span>
                </span>
                
                {/* Tooltip Arrow */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0A0A0A] border-b border-r border-white/10 rotate-45" />
              </div>
            </div>
          )}

          {/* X-axis labels */}
          <div className="absolute -bottom-8 left-0 right-0 flex justify-between pointer-events-none">
            {chartData.map((d, i) => (
              <span
                key={i}
                className={`text-[10px] font-black uppercase tracking-wider transition-colors transform -translate-x-1/2 ${
                  tooltip?.label === d.label ? 'text-indigo-600' : 'text-slate-400'
                }`}
                style={{
                  position: 'absolute',
                  left: `${(i / Math.max(chartData.length - 1, 1)) * 100}%`
                }}
              >
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
