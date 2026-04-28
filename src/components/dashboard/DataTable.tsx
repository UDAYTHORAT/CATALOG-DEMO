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
      <div className="p-16 text-center text-slate-400 font-medium bg-white rounded-[1.5rem] border border-slate-100">
        No records found in this view.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden">
      {/* Bulk action bar */}
      {selectable && selectedIds.size > 0 && (
        <div className="px-6 py-3 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between animate-counter-up">
          <span className="text-xs font-bold text-indigo-700">
            {selectedIds.size} selected
          </span>
          <div className="flex gap-2">
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-3 py-1 rounded-md hover:bg-indigo-100 transition-colors">
              Export
            </button>
            <button className="text-xs font-bold text-red-500 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50 transition-colors">
              Delete
            </button>
          </div>
        </div>
      )}

      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="bg-slate-50/80">
            {selectable && (
              <th className="w-12 px-4 py-4">
                <button
                  onClick={toggleAll}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    selectedIds.size === data.length
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-300 hover:border-indigo-400'
                  }`}
                >
                  {selectedIds.size === data.length && <Check size={12} strokeWidth={3} />}
                </button>
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100"
              >
                {col.sortable !== false ? (
                  <button
                    onClick={() => handleSort(col.key)}
                    className="flex items-center gap-1.5 hover:text-slate-700 transition-colors group"
                  >
                    {col.label}
                    {sortKey === col.key ? (
                      sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                    ) : (
                      <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-40 transition-opacity" />
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
                className={`group transition-colors border-b border-slate-50 last:border-0 ${
                  isSelected ? 'bg-indigo-50/50' : rowIndex % 2 === 1 ? 'bg-slate-50/30' : 'hover:bg-slate-50/60'
                }`}
              >
                {selectable && (
                  <td className="w-12 px-4 py-4">
                    <button
                      onClick={() => toggleSelect(rowId)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-200 group-hover:border-slate-400'
                      }`}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </button>
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={`${rowId}-${col.key}`}
                    className="px-6 py-4 whitespace-nowrap text-slate-700 font-medium"
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
