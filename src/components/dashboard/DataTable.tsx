'use client';

import { ReactNode, useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Check } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: ReactNode, row: TableRow) => ReactNode;
}

type TableRow = Record<string, ReactNode> & {
  id?: string | number;
};

interface DataTableProps {
  columns: Column[];
  data: TableRow[];
  selectable?: boolean;
  onSelectionChange?: (ids: (string | number)[]) => void;
}

export function DataTable({ columns, data, selectable = false, onSelectionChange }: DataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [data, sortKey, sortDir]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleSelect = (id: string | number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
    onSelectionChange?.(Array.from(next));
  };

  const toggleAll = () => {
    if (selectedIds.size === data.length) {
      setSelectedIds(new Set());
      onSelectionChange?.([]);
    } else {
      const all = new Set(data.map((r, i) => r.id ?? i));
      setSelectedIds(all);
      onSelectionChange?.(Array.from(all));
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="p-16 text-center text-slate-400 font-medium bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
        No records found in this view.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
      {/* Bulk action bar */}
      {selectable && selectedIds.size > 0 && (
        <div className="px-8 py-4 bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-indigo-100 flex items-center justify-between animate-counter-up">
          <span className="text-sm font-black tracking-wider uppercase text-indigo-700">
            {selectedIds.size} selected
          </span>
          <div className="flex gap-3">
            <button className="text-xs font-black uppercase tracking-wider text-indigo-600 hover:text-white px-5 py-2.5 rounded-xl border border-indigo-200 hover:bg-indigo-600 hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
              Export CSV
            </button>
            <button className="text-xs font-black uppercase tracking-wider text-red-500 hover:text-white px-5 py-2.5 rounded-xl border border-red-200 hover:bg-red-500 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/30 transition-all">
              Delete
            </button>
          </div>
        </div>
      )}

      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="bg-slate-50/50">
            {selectable && (
              <th className="w-16 px-6 py-5">
                <button
                  onClick={toggleAll}
                  className={`w-6 h-6 rounded-lg border-[3px] flex items-center justify-center transition-all ${
                    selectedIds.size === data.length
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/30'
                      : 'border-slate-300 hover:border-indigo-400 bg-white'
                  }`}
                >
                  {selectedIds.size === data.length && <Check size={14} strokeWidth={4} />}
                </button>
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-5 font-black text-[11px] uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100"
              >
                {col.sortable !== false ? (
                  <button
                    onClick={() => handleSort(col.key)}
                    className="flex items-center gap-2 hover:text-indigo-600 transition-colors group"
                  >
                    {col.label}
                    {sortKey === col.key ? (
                      sortDir === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    ) : (
                      <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100 text-slate-300 group-hover:text-indigo-400 transition-all" />
                    )}
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => {
            const rowId = row.id ?? rowIndex;
            const isSelected = selectedIds.has(rowId);

            return (
              <tr
                key={rowId}
                className={`group transition-all duration-300 border-b border-slate-50/50 last:border-0 ${
                  isSelected ? 'bg-indigo-50/50' : 'hover:bg-slate-50/80 hover:shadow-[0_0_15px_rgba(0,0,0,0.03)] relative z-10 hover:z-20'
                }`}
              >
                {selectable && (
                  <td className="w-16 px-6 py-5">
                    <button
                      onClick={() => toggleSelect(rowId)}
                      className={`w-6 h-6 rounded-lg border-[3px] flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/30'
                          : 'border-slate-200 group-hover:border-slate-400 bg-white'
                      }`}
                    >
                      {isSelected && <Check size={14} strokeWidth={4} />}
                    </button>
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={`${rowId}-${col.key}`}
                    className="px-6 py-5 whitespace-nowrap text-slate-700 font-medium"
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
