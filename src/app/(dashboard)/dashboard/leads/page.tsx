import { createClient } from '@/lib/supabase/server';
import { Users, MessageCircle, Layers, Zap, Crown, Package, ChevronDown, MousePointerClick, Eye } from 'lucide-react';
import { EmptyState } from '@/components/dashboard/EmptyState';
import Link from 'next/link';
import LiveRefresh from './LiveRefresh';

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
  views_count?: number;
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
          .select('id, name, slug, theme, is_active, leads_count, views_count, created_at')
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


  function extractProductName(lead: LeadRecord): string {
    let prodName = Array.isArray(lead.products) ? lead.products[0]?.name : lead.products?.name;
    if (!prodName && lead.budget_range) {
      try {
        const parsed = JSON.parse(lead.budget_range);
        if (parsed.productName) prodName = parsed.productName;
      } catch (e) {}
    }
    return prodName || 'General Inquiry';
  }

  function extractTrafficSource(lead: LeadRecord): string {
    let source = 'Direct / Organic';
    let referrerHost = '';
    
    if (lead.budget_range) {
      try {
        const parsed = JSON.parse(lead.budget_range);
        if (parsed.traffic_source) {
          source = parsed.traffic_source;
        } else if (parsed.traffic_referrer) {
          try {
            const url = new URL(parsed.traffic_referrer);
            referrerHost = url.hostname.replace('www.', '');
            source = referrerHost;
          } catch (e) {
            source = parsed.traffic_referrer;
          }
        }
      } catch (e) {}
    }
    return source.charAt(0).toUpperCase() + source.slice(1);
  }

  function getSourceBadgeStyle(source: string): string {
    const s = source.toLowerCase();
    if (s.includes('instagram')) {
      return 'bg-pink-50 text-pink-700 border-pink-100';
    }
    if (s.includes('facebook') || s.includes('fb')) {
      return 'bg-blue-50 text-blue-700 border-blue-100';
    }
    if (s.includes('whatsapp') || s.includes('wa')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }
    if (s.includes('google')) {
      return 'bg-red-50 text-red-700 border-red-100';
    }
    if (s.includes('twitter') || s.includes('t.co') || s.includes('x.com')) {
      return 'bg-sky-50 text-sky-700 border-sky-100';
    }
    if (s.includes('direct') || s.includes('organic')) {
      return 'bg-slate-50 text-slate-600 border-slate-200/60';
    }
    return 'bg-indigo-50 text-indigo-700 border-indigo-100';
  }

  function getSourceProgressBarColor(source: string): string {
    const s = source.toLowerCase();
    if (s.includes('instagram')) return 'bg-pink-500';
    if (s.includes('facebook') || s.includes('fb')) return 'bg-blue-600';
    if (s.includes('whatsapp') || s.includes('wa')) return 'bg-emerald-500';
    if (s.includes('google')) return 'bg-red-500';
    if (s.includes('twitter') || s.includes('t.co') || s.includes('x.com')) return 'bg-sky-500';
    if (s.includes('direct') || s.includes('organic')) return 'bg-slate-400';
    return 'bg-indigo-500';
  }

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
    <div className="space-y-7 animate-counter-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Funnel Analytics</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Click on a funnel to see detailed performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LiveRefresh />
        </div>
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
            // Calculate traffic source breakdown
            const sourceCounts: Record<string, number> = {};
            
            funnelLeads.forEach(lead => {
              const finalProdName = extractProductName(lead);
              productCounts[finalProdName] = (productCounts[finalProdName] || 0) + 1;
              
              const src = extractTrafficSource(lead);
              sourceCounts[src] = (sourceCounts[src] || 0) + 1;
            });
            
            const productEntries = Object.entries(productCounts).sort((a, b) => b[1] - a[1]);
            const sourceEntries = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]);
            const topProduct = productEntries.length > 0 ? productEntries[0][0] : null;
            const uniqueProductsCount = Object.keys(productCounts).length;
            const realViews = funnel.views_count || 0;
            const clickRate = realViews > 0 ? Math.round((funnelLeads.length / realViews) * 100) : 0;

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
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">/{funnel.slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Eye size={16} className="text-indigo-500" />
                      <span className="font-black text-slate-900">{realViews}</span>
                      <span className="text-slate-400 text-xs font-medium">views</span>
                    </div>
                    <ChevronDown size={18} className="text-slate-400 transition-transform duration-300 group-open:rotate-180" />
                  </div>
                </summary>

                <div className="px-7 py-6 border-t border-slate-100 bg-slate-50/30">
                  {/* The Core Snapshot */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><Zap size={40} /></div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 relative z-10">Total Views</p>
                      <p className="text-2xl font-black text-slate-900 relative z-10">{realViews}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity text-emerald-500"><MessageCircle size={40} /></div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 relative z-10">WhatsApp Clicks</p>
                      <p className="text-2xl font-black text-slate-900 relative z-10">{funnelLeads.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity text-indigo-500"><MousePointerClick size={40} /></div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 relative z-10">Click Rate</p>
                      <p className="text-2xl font-black text-slate-900 relative z-10">{clickRate}%</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity text-amber-500"><Layers size={40} /></div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 relative z-10">Unique Products</p>
                      <p className="text-2xl font-black text-slate-900 relative z-10">{uniqueProductsCount}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Most Popular Items */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Crown size={14} className="text-amber-500" />
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Most Popular Items</h3>
                      </div>
                      {productEntries.length === 0 ? (
                        <p className="text-sm text-slate-400 font-medium">No product interactions recorded yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {productEntries.map(([prodName, count]) => {
                            return (
                              <div key={prodName} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between gap-4 transition-all hover:border-indigo-100 hover:shadow-md">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                    <Package size={14} className="text-indigo-500" />
                                  </div>
                                  <span className="text-sm font-bold text-slate-700 truncate">{prodName}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                  <span className="text-sm font-black text-slate-900">{count}</span>
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-0.5">Clicks</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Traffic Sources Breakdown */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Users size={14} className="text-indigo-500" />
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Traffic Sources</h3>
                      </div>
                      {sourceEntries.length === 0 ? (
                        <p className="text-sm text-slate-400 font-medium">No traffic source data recorded yet.</p>
                      ) : (
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                          {sourceEntries.map(([source, count]) => {
                            const percentage = funnelLeads.length > 0 ? Math.round((count / funnelLeads.length) * 100) : 0;
                            const barColor = getSourceProgressBarColor(source);
                            const style = getSourceBadgeStyle(source);
                            return (
                              <div key={source} className="space-y-1.5">
                                <div className="flex justify-between items-center text-xs font-bold">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style}`}>
                                    {source}
                                  </span>
                                  <span className="text-slate-500 font-mono text-[10px]">{count} clicks ({percentage}%)</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percentage}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Recent Activity Feed */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Zap size={14} className="text-indigo-500" />
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Activity</h3>
                      </div>
                      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 relative">
                        <div className="space-y-1 max-h-[260px] overflow-y-auto scrollbar-thin relative pr-1 pl-1">
                          {funnelLeads.length > 1 && (
                            <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-200/60 z-0" />
                          )}
                          <div className="relative z-10 space-y-1">
                            {funnelLeads.slice(0, 10).map((lead, idx) => {
                              const finalProdName = extractProductName(lead);
                              const date = new Date(lead.created_at);
                              
                              const today = new Date();
                              const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
                              const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                              const dateStr = isToday ? 'Today' : date.toLocaleDateString([], { month: 'short', day: 'numeric' });

                              const source = extractTrafficSource(lead);
                              const style = getSourceBadgeStyle(source);

                              return (
                                <div key={lead.id} className="relative py-2.5 pl-8 pr-3 rounded-lg hover:bg-slate-50 transition-colors flex flex-col group">
                                  {/* Timeline Dot (Green Light) */}
                                  <div className="absolute left-2 top-[15px] w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] group-hover:scale-125 transition-transform z-10" />
                                  
                                  <div>
                                    <p className="text-xs font-semibold text-slate-700 leading-snug">
                                      Someone clicked WhatsApp for <span className="font-extrabold text-slate-900">"{finalProdName}"</span>
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{dateStr} at {timeStr}</span>
                                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${style}`}>
                                        {source}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {funnelLeads.length === 0 && (
                            <div className="p-8 text-center">
                              <p className="text-sm text-slate-400 font-medium italic">No recent activity.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
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
