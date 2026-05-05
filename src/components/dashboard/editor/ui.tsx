import React from 'react';

export const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 placeholder:text-slate-400';

export const subtleInputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-900 outline-none transition-all focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 placeholder:text-slate-400';

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2.5">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{label}</span>
      {children}
    </label>
  );
}

export function PanelTitle({
  icon: Icon,
  label,
  meta,
  action,
}: {
  icon: React.ElementType;
  label: string;
  meta: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
          <Icon size={20} />
        </div>
        <div>
          <h2 className="text-base font-black tracking-tight text-slate-900">{label}</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{meta}</p>
        </div>
      </div>
      {action && (
        <div className="flex items-center gap-2">
          {action}
        </div>
      )}
    </div>
  );
}

export function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-950 disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  );
}
