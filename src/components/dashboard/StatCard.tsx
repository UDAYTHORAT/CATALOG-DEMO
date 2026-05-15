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

  const gradientMap: Record<string, { bg: string, shadow: string, text: string, light: string }> = {
    'Products': { bg: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20', text: 'text-blue-600', light: 'bg-blue-50' },
    'Active Funnels': { bg: 'from-indigo-500 to-violet-600', shadow: 'shadow-indigo-500/20', text: 'text-indigo-600', light: 'bg-indigo-50' },
    'Total Leads': { bg: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/20', text: 'text-emerald-600', light: 'bg-emerald-50' },
    'Conversion': { bg: 'from-amber-400 to-orange-500', shadow: 'shadow-orange-500/20', text: 'text-amber-600', light: 'bg-amber-50' },
  };

  const theme = gradientMap[label] || gradientMap['Active Funnels'];

  return (
    <div className="relative bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
      {/* Subtle Background Glow */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${theme.bg} opacity-[0.03] group-hover:opacity-[0.08] blur-2xl rounded-full transition-opacity duration-500`} />
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Top row: label + icon */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</span>
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${theme.bg} flex items-center justify-center text-white shadow-lg ${theme.shadow} transform group-hover:scale-110 transition-transform duration-500`}>
            {icon}
          </div>
        </div>

        {/* Value row */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none animate-counter-up">
              <AnimatedValue value={value} />
            </h3>
            {trend && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg w-fit ${
                trend.isPositive ? 'text-emerald-700 bg-emerald-100/50' : 'text-red-600 bg-red-100/50'
              }`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}%
              </span>
            )}
          </div>

          {/* Sparkline */}
          <div className="opacity-50 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:-translate-y-1">
            <Sparkline data={defaultSpark} color={sparkColor} />
          </div>
        </div>
      </div>
    </div>
  );
}
