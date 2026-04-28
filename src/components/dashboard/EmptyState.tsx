import Link from 'next/link';
import { ReactNode } from 'react';

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  actionLabel,
  actionHref,
}: { 
  icon: ReactNode; 
  title: string; 
  description: string; 
  action?: ReactNode;
  actionLabel?: string;
  actionHref?: string;
}) {
  const defaultAction = actionLabel && actionHref ? (
    <Link href={actionHref} className="btn-dash px-8 py-3 text-sm font-bold inline-flex items-center gap-2">
      {actionLabel}
    </Link>
  ) : null;

  return (
    <div className="relative flex flex-col items-center justify-center p-20 text-center bg-white rounded-[1.5rem] border border-slate-100 min-h-[480px] overflow-hidden">
      {/* Ghost placeholder cards behind the main content */}
      <div className="absolute inset-0 flex items-center justify-center gap-6 opacity-[0.04] pointer-events-none scale-90">
        <div className="w-48 h-64 bg-slate-400 rounded-2xl" />
        <div className="w-48 h-64 bg-slate-400 rounded-2xl translate-y-8" />
        <div className="w-48 h-64 bg-slate-400 rounded-2xl" />
      </div>

      {/* Icon with float animation */}
      <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-8 animate-float-icon">
        {icon}
      </div>
      
      <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">{title}</h3>
      <p className="text-base text-slate-400 max-w-md mb-10 font-medium leading-relaxed">
        {description}
      </p>
      
      {(action || defaultAction) && (
        <div className="animate-counter-up">{action || defaultAction}</div>
      )}
    </div>
  );
}
