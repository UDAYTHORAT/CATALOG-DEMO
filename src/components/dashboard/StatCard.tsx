'use client';

import { ReactNode, useEffect, useState, useRef } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  sparkData?: number[];
}

function Sparkline({ data, color = '#4f46e5' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((val - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#spark-${color.replace('#', '')})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot */}
      <circle
        cx={(data.length - 1) / (data.length - 1) * w}
        cy={h - ((data[data.length - 1] - min) / range) * (h - 4) - 2}
        r="2.5"
        fill={color}
      />
    </svg>
  );
}

function AnimatedValue({ value }: { value: string | number }) {
  const [display, setDisplay] = useState<string | number>(typeof value === 'number' ? 0 : value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof value !== 'number') {
      setDisplay(value);
      return;
    }

    const target = value;
    const duration = 800;
    const start = performance.now();

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

export function StatCard({ label, value, icon, trend, sparkData }: StatCardProps) {
  const defaultSpark = sparkData || [3, 5, 4, 7, 6, 8, 9, 7, 10, 12];
  const sparkColor = trend?.isPositive !== false ? '#10b981' : '#ef4444';

  return (
    <div className="bg-white rounded-[1.5rem] p-6 border border-slate-100 relative overflow-hidden group hover:border-indigo-200/60 transition-all duration-300">
      <div className="relative z-10">
        {/* Top row: label + icon */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-300">
            {icon}
          </div>
        </div>

        {/* Value row */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none animate-counter-up">
              <AnimatedValue value={value} />
            </h3>
            {trend && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md mb-0.5 ${
                trend.isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'
              }`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}%
              </span>
            )}
          </div>

          {/* Sparkline */}
          <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-300">
            <Sparkline data={defaultSpark} color={sparkColor} />
          </div>
        </div>
      </div>
    </div>
  );
}
