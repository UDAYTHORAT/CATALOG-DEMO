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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 relative overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 pt-6 pb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h3>
          <p className="text-[13px] font-medium text-slate-400 mt-0.5">{subtitle}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-[220px] w-full px-6 pb-10 mt-2">
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
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.08" />
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
                  stroke="#f1f5f9" strokeWidth="1"
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
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              className="animate-line-draw drop-shadow-sm"
            />

            {/* Tooltip tracking line */}
            {tooltip && (
              <line
                x1={tooltip.x} y1={padTop}
                x2={tooltip.x} y2={100 - padBottom}
                stroke="#4f46e5" strokeWidth="1" strokeDasharray="3 3" opacity="0.2"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>

          {/* HTML Data Dots Overlay (Prevents SVG Oval Distortion) */}
          {points.map((p, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 bg-white border-2 border-indigo-500 rounded-full transition-all duration-200 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 ${
                tooltip?.label === p.label ? 'scale-150 shadow-md shadow-indigo-500/30 bg-indigo-50' : 'scale-100'
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
              className="absolute pointer-events-none z-20 transition-all duration-150 ease-out"
              style={{
                left: `${tooltip.x}%`,
                top: `${(tooltip.y / 100) * 180 - 36}px`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div className="bg-slate-900 text-white px-3.5 py-2 rounded-xl text-[12px] font-bold shadow-xl shadow-black/20 whitespace-nowrap flex items-center gap-2 relative">
                <span className="text-indigo-300 uppercase tracking-wider text-[9px]">{tooltip.label}</span>
                <span className="text-white">{tooltip.value}</span>
                <span className="text-slate-400 text-[9px] uppercase tracking-wider">Leads</span>
                
                {/* Tooltip Arrow */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
              </div>
            </div>
          )}

          {/* X-axis labels */}
          <div className="absolute -bottom-7 left-0 right-0 flex justify-between pointer-events-none">
            {chartData.map((d, i) => (
              <span
                key={i}
                className={`text-[10px] font-bold uppercase tracking-wider transition-colors transform -translate-x-1/2 ${
                  tooltip?.label === d.label ? 'text-indigo-600' : 'text-slate-300'
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
