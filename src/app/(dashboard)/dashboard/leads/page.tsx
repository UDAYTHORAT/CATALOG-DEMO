import { createClient } from '@/lib/supabase/server';
import { Users, MessageCircle, Layers, Zap, Crown, Package, ChevronDown, MousePointerClick } from 'lucide-react';
import { EmptyState } from '@/components/dashboard/EmptyState';
import Link from 'next/link';
import LeadsToolbar from './LeadsToolbar';

type LeadRecord = {
  id: string;
  visitor_name: string | null;
  whatsapp_number: string | null;
  budget_range: string | null;
  created_at: string;
  funnel_id: string | null;
  products?: {
    name: string | null;
  }[] | {
    name: string | null;
  } | null;
};

type FunnelRecord = {
  id: string;
  name: string;
  slug: string;
  theme: string;
  is_active: boolean;
  leads_count: number;
  created_at: string;
};

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let leads: LeadRecord[] = [];
  let funnels: FunnelRecord[] = [];

  if (user) {
    const { data: store } = await supabase.from('stores').select('id').eq('user_id', user.id).single();
    if (store) {
      const [leadsResult, funnelsResult] = await Promise.all([
        supabase
          .from('leads')
          .select(`id, visitor_name, whatsapp_number, budget_range, created_at, funnel_id, products(name)`)
          .eq('store_id', store.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('funnels')
          .select('id, name, slug, theme, is_active, leads_count, created_at')
          .eq('store_id', store.id)
          .order('created_at', { ascending: false }),
      ]);

      leads = (leadsResult.data || []) as LeadRecord[];
      funnels = (funnelsResult.data || []) as FunnelRecord[];
    }
  }

  // Group leads by funnel
  const funnelLeadMap = new Map<string, LeadRecord[]>();
  funnels.forEach(f => funnelLeadMap.set(f.id, []));
  leads.forEach(lead => {
    const bucket = lead.funnel_id ? funnelLeadMap.get(lead.funnel_id) : null;
    if (bucket) bucket.push(lead);
  });

  // Sort funnels: most leads first
  const sortedFunnels = [...funnels].sort(
    (a, b) => (funnelLeadMap.get(b.id)?.length || 0) - (funnelLeadMap.get(a.id)?.length || 0)
  );

  // CSV export
  const csvData = leads.map(lead => {
    const prodName = Array.isArray(lead.products)
      ? lead.products[0]?.name
      : lead.products?.name;
    return {
      Name: lead.visitor_name || 'Anonymous',
      WhatsApp: lead.whatsapp_number || '',
      Product: prodName || 'General',
      Funnel: funnels.find(f => f.id === lead.funnel_id)?.name || 'Direct',
      Date: new Date(lead.created_at).toLocaleDateString(),
    };
  });

  // Theme color helper
  function themeAccent(theme: string) {
    switch (theme) {
      case 'minimal': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', label: 'Elite Furniture' };
      case 'dark':
      case 'onyx': return { bg: 'bg-slate-800', text: 'text-white', border: 'border-slate-700', label: 'Onyx Dark' };
      case 'kinetic': return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100', label: 'Kinetic' };
      case 'bubbly': return { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-100', label: 'Bubbly' };
      case 'ethereal': return { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-100', label: 'Ethereal' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100', label: theme.charAt(0).toUpperCase() + theme.slice(1) };
    }
  }

  return (
    <div className="space-y-8 animate-counter-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Funnels Performance</h1>
          <p className="text-base text-slate-500 font-medium mt-1">
            Click on a funnel to see clicks and product interest
          </p>
        </div>
        <LeadsToolbar csvData={csvData} />
      </div>

      {/* No leads state */}
      {leads.length === 0 && funnels.length === 0 ? (
        <EmptyState
          icon={<Users className="text-indigo-500" size={28} />}
          title="No funnels created yet"
          description="Create a funnel to start tracking clicks and leads."
          actionLabel="View Funnels"
          actionHref="/dashboard/funnels"
        />
      ) : (
        <div className="space-y-4">
          {sortedFunnels.map((funnel) => {
            const funnelLeads = funnelLeadMap.get(funnel.id) || [];
            const accent = themeAccent(funnel.theme);
            const whatsappCount = funnelLeads.filter(l => l.whatsapp_number).length;

            // Calculate product breakdown
            const productCounts: Record<string, number> = {};
            funnelLeads.forEach(lead => {
              const prodName = Array.isArray(lead.products)
                ? lead.products[0]?.name
                : lead.products?.name;
              const finalProdName = prodName || 'General Inquiry';
              productCounts[finalProdName] = (productCounts[finalProdName] || 0) + 1;
            });
            
            const productEntries = Object.entries(productCounts).sort((a, b) => b[1] - a[1]);
            const topProduct = productEntries.length > 0 ? productEntries[0][0] : null;

            return (
              <details key={funnel.id} className="group bg-white rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                <summary className="px-7 py-5 cursor-pointer list-none flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.text} flex items-center justify-center border ${accent.border} shadow-sm flex-shrink-0`}>
                      <Layers size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-base font-bold text-slate-900 tracking-tight">{funnel.name}</h2>
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${accent.bg} ${accent.text} border ${accent.border}`}>
                          {accent.label}
                        </span>
                        {funnel.is_active && (
                          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-emerald-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">/s/{funnel.slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5 text-sm">
                      <MousePointerClick size={16} className="text-indigo-500" />
                      <span className="font-black text-slate-900">{funnelLeads.length}</span>
                      <span className="text-slate-400 text-xs font-medium">clicks</span>
                    </div>
                    <ChevronDown size={18} className="text-slate-400 transition-transform duration-300 group-open:rotate-180" />
                  </div>
                </summary>

                <div className="px-7 py-6 border-t border-slate-100 bg-slate-50/30">
                  {/* Product Breakdown */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Product Interest Breakdown</h3>
                    {productEntries.length === 0 ? (
                      <p className="text-sm text-slate-400 font-medium">No product interactions recorded yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {productEntries.map(([prodName, count]) => {
                          const percentage = Math.round((count / funnelLeads.length) * 100);
                          return (
                            <div key={prodName} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2 min-w-0">
                                <Package size={14} className="text-slate-400 flex-shrink-0" />
                                <span className="text-sm font-medium text-slate-700 truncate">{prodName}</span>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${percentage}%` }} />
                                </div>
                                <span className="text-sm font-bold text-slate-900">{count}</span>
                                <span className="text-xs text-slate-400 font-medium">{percentage}%</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
