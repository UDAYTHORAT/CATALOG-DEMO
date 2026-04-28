'use client';

import { Download } from 'lucide-react';

interface LeadsToolbarProps {
  csvData: Record<string, string>[];
}

export default function LeadsToolbar({ csvData }: LeadsToolbarProps) {
  const handleExport = () => {
    if (csvData.length === 0) return;

    const headers = Object.keys(csvData[0]);
    const rows = csvData.map(row => 
      headers.map(h => `"${(row[h] || '').replace(/"/g, '""')}"`).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `funnellink-leads-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      disabled={csvData.length === 0}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <Download size={16} />
      Export CSV
    </button>
  );
}
