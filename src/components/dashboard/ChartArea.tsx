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
    <div className="bg-white rounded-[1.5rem] border border-slate-100 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-8 pt-8 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
          <p className="text-sm text-slate-400 font-medium">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Time range tabs */}
          <div className="flex bg-slate-50 p-1 rounded-lg">
            {ranges.map(r => (
              <button
                key={r}
                onClick={() => setActiveRange(r)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                  activeRange === r
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          {/* Total badge */}
          <div className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold">
            {total} total
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-[220px] w-full px-8 pb-8">
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
                stroke="#e2e8f0" strokeWidth="0.3"
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
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-line-draw"
          />

          {/* Data dots */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x} cy={p.y}
              r={tooltip?.label === p.label ? '3' : '2'}
              fill="white"
              stroke="#4f46e5"
              strokeWidth="1.5"
              className="transition-all duration-150"
            />
          ))}

          {/* Tooltip tracking line */}
          {tooltip && (
            <>
              <line
                x1={tooltip.x} y1={padTop}
                x2={tooltip.x} y2={100 - padBottom}
                stroke="#4f46e5" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4"
              />
              <circle
                cx={tooltip.x} cy={tooltip.y}
                r="4" fill="#4f46e5" stroke="white" strokeWidth="2"
              />
            </>
          )}
        </svg>

        {/* Tooltip label (HTML overlay) */}
        {tooltip && (
          <div
            className="absolute pointer-events-none z-20 transition-all duration-100"
            style={{
              left: `${tooltip.x}%`,
              top: `${(tooltip.y / 100) * 220 - 44}px`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl whitespace-nowrap">
              <span className="text-slate-400 mr-1">{tooltip.label}</span>
              {tooltip.value} leads
            </div>
          </div>
        )}

        {/* X-axis labels */}
        <div className="absolute bottom-2 left-8 right-8 flex justify-between pointer-events-none">
          {chartData.map((d, i) => (
            <span
              key={i}
              className={`text-[10px] font-medium transition-colors ${
                tooltip?.label === d.label ? 'text-slate-900' : 'text-slate-300'
              }`}
            >
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
