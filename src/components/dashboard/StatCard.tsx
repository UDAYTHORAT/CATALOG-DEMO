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
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
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
        r="2"
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

  const gradientMap: Record<string, { bg: string, icon: string, light: string }> = {
    'Views': { bg: 'from-blue-500 to-indigo-600', icon: 'bg-blue-500/10 text-blue-600', light: 'bg-blue-50' },
    'Active Funnels': { bg: 'from-indigo-500 to-violet-600', icon: 'bg-indigo-500/10 text-indigo-600', light: 'bg-indigo-50' },
    'Total Leads': { bg: 'from-emerald-400 to-teal-500', icon: 'bg-emerald-500/10 text-emerald-600', light: 'bg-emerald-50' },
    'Conversion': { bg: 'from-amber-400 to-orange-500', icon: 'bg-amber-500/10 text-amber-600', light: 'bg-amber-50' },
    'WhatsApp Clicks': { bg: 'from-sky-450 to-cyan-550', icon: 'bg-sky-500/10 text-sky-600', light: 'bg-sky-50' },
  };

  const theme = gradientMap[label] || gradientMap['Active Funnels'];

  return (
    <div className="relative bg-white rounded-2xl p-5 border border-slate-100/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group">
      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Top row: label + icon */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</span>
          <div className={`w-9 h-9 rounded-xl ${theme.icon} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
            {icon}
          </div>
        </div>

        {/* Value row */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
              <AnimatedValue value={value} />
            </h3>
            {trend && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md w-fit ${
                trend.isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50'
              }`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}%
              </span>
            )}
          </div>

          {/* Sparkline */}
          <div className="opacity-40 group-hover:opacity-80 transition-opacity duration-300">
            <Sparkline data={defaultSpark} color={sparkColor} />
          </div>
        </div>
      </div>
    </div>
  );
}
