import { createClient } from '@/lib/supabase/server';
import { StatCard } from '@/components/dashboard/StatCard';
import { ChartArea } from '@/components/dashboard/ChartArea';
import { Package, Layers, Users, TrendingUp, ArrowRight, Check, Plus, Zap, Target, Sparkles, MousePointerClick, Clock } from 'lucide-react';
import Link from 'next/link';

type LeadRecord = {
  id: string;
  visitor_name: string | null;
  budget_range: string | null;
  whatsapp_number: string | null;
  created_at: string;
  products?: {
    name: string | null;
  } | null;
  funnels?: {
    name: string | null;
  } | null;
};

type RecentLead = {
  id: string;
  name: string;
  funnel: string;
  intent: string;
  product: string;
  hasWhatsapp: boolean;
  date: string;
  timeAgo: string;
};

type StoreSummary = {
  id: string;
  name: string | null;
  whatsapp_number: string | null;
  bio: string | null;
};

function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const displayName = user?.user_metadata?.full_name?.split(' ')[0] || 'User';

  // Get Store
  const { data: store } = await supabase
    .from('stores')
    .select('id, name, whatsapp_number, bio')
    .eq('user_id', user?.id)
    .single<StoreSummary>();
  
  let totalProducts = 0;
  let activeFunnels = 0;
  let totalLeads = 0;
  let recentLeads: RecentLead[] = [];
  let chartData: { label: string; value: number }[] = [];
  let whatsappLeads = 0;
  let ctaClicks = 0;
  let topProductName = '';

  if (store) {
    const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('store_id', store.id);
    const { count: funnelsCount } = await supabase.from('funnels').select('*', { count: 'exact', head: true }).eq('store_id', store.id);
    const { count: leadsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('store_id', store.id);
    
    totalProducts = productsCount || 0;
    activeFunnels = funnelsCount || 0;
    totalLeads = leadsCount || 0;

    // Recent leads with product data
    const { data: leadsData } = await supabase.from('leads')
      .select('*, products(name), funnels(name)')
      .eq('store_id', store.id)
      .order('created_at', { ascending: false })
      .limit(6);
      
    if (leadsData) {
      const productCounts: Record<string, number> = {};
      
      recentLeads = (leadsData as LeadRecord[]).map((lead) => {
        let intentLabel = 'General';
        if (lead.budget_range) {
          try {
            const parsed = JSON.parse(lead.budget_range);
            if (parsed.type === 'cta_click') { intentLabel = 'CTA Click'; ctaClicks++; }
            else if (parsed.type === 'funnel_completion') intentLabel = 'Quiz Done';
            else if (parsed.type === 'direct_linktree_enquiry') intentLabel = 'Link Bio';
            else if (parsed.budget) intentLabel = parsed.budget;
            else intentLabel = 'Tracked';
          } catch(e) {
            intentLabel = 'Budget';
          }
        }

        if (lead.whatsapp_number) whatsappLeads++;
        
        const pName = lead.products?.name || '';
        if (pName) {
          productCounts[pName] = (productCounts[pName] || 0) + 1;
        }

        return {
          id: lead.id,
          name: lead.visitor_name || 'Anonymous',
          funnel: lead.funnels?.name || 'Storefront',
          intent: intentLabel,
          product: pName || 'General',
          hasWhatsapp: Boolean(lead.whatsapp_number),
          date: new Date(lead.created_at).toLocaleDateString(),
          timeAgo: getTimeAgo(lead.created_at),
        };
      });

      const sorted = Object.entries(productCounts).sort((a, b) => b[1] - a[1]);
      topProductName = sorted.length > 0 ? sorted[0][0] : '';
    }

    // Chart data: leads per day for last 7 days
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const { data: recentLeadsForChart } = await supabase.from('leads')
      .select('created_at')
      .eq('store_id', store.id)
      .gte('created_at', sevenDaysAgo.toISOString());

    chartData = last7.map(date => {
      const dayLeads = (recentLeadsForChart || []).filter(l => {
        const ld = new Date(l.created_at);
        return ld.toDateString() === date.toDateString();
      });
      return {
        label: days[date.getDay()],
        value: dayLeads.length,
      };
    });
  }

  const conversionRate = activeFunnels > 0 ? Math.min(100, Math.round((totalLeads / Math.max(activeFunnels * 50, 1)) * 100)) : 0;
  const engagementRate = totalLeads > 0 ? Math.round((ctaClicks / totalLeads) * 100) : 0;

  // Setup steps
  const steps = [
    { label: 'Add products', done: totalProducts > 0, href: '/dashboard/products' },
    { label: 'Create a funnel', done: activeFunnels > 0, href: '/dashboard/funnels' },
    { label: 'Connect WhatsApp', done: Boolean(store?.whatsapp_number), href: '/dashboard/settings' },
    { label: 'Capture leads', done: totalLeads > 0, href: '/dashboard/leads' },
  ];
  const completedSteps = steps.filter(s => s.done).length;

  return (
    <div className="space-y-8 animate-counter-up">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-500 mb-2">{getGreeting()}</p>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
            {displayName}&apos;s<br className="sm:hidden" /> Dashboard
          </h1>
          {store?.name && (
            <p className="text-base text-slate-400 font-medium mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              {store.name} — Live
            </p>
          )}
        </div>
        
        <div className="flex gap-3 flex-shrink-0">
          <Link href="/dashboard/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95">
            <Package size={18} />
            Products
          </Link>
          <Link href="/dashboard/funnels" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-black uppercase tracking-wider hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 active:scale-95">
            <Plus size={18} strokeWidth={3} />
            New Funnel
          </Link>
        </div>
      </div>

      {/* Setup Progress (only show if not all done) */}
      {completedSteps < 4 && (
        <div className="bg-[#0A0A0A] rounded-[2rem] border border-white/10 p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">System Setup</h3>
              <p className="text-sm font-medium text-slate-400 mt-1">{completedSteps} of 4 core modules activated</p>
            </div>
            <div className="w-16 h-16 rounded-full border-[4px] border-white/5 flex items-center justify-center relative bg-[#0A0A0A]">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="26" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                <circle 
                  cx="30" cy="30" r="26" fill="none" stroke="currentColor" strokeWidth="4" 
                  className="text-indigo-500 transition-all duration-1000 ease-out" 
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={2 * Math.PI * 26 * (1 - completedSteps / 4)}
                  strokeLinecap="round" 
                />
              </svg>
              <span className="text-base font-black text-white relative z-10">{Math.round(completedSteps / 4 * 100)}%</span>
            </div>
          </div>

          {/* Horizontal steps */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {steps.map((step) => (
              <Link
                key={step.label}
                href={step.href}
                className={`group/step flex items-center gap-3 rounded-2xl p-4 transition-all duration-300 border ${
                  step.done
                    ? 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20'
                    : 'bg-white/5 border-white/5 hover:border-indigo-500/30 hover:bg-white/10'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black shadow-inner transition-all duration-300 ${
                  step.done ? 'bg-emerald-500 text-white shadow-emerald-500/50' : 'bg-white/10 text-slate-400 group-hover/step:bg-indigo-500 group-hover/step:text-white group-hover/step:shadow-indigo-500/50'
                }`}>
                  {step.done ? <Check size={14} strokeWidth={4} /> : <ArrowRight size={14} strokeWidth={3} />}
                </div>
                <span className={`text-sm font-black tracking-wide ${step.done ? 'text-emerald-400 line-through decoration-emerald-500/50' : 'text-slate-200'}`}>
                  {step.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          label="Products" 
          value={totalProducts} 
          icon={<Package size={18} />} 
          sparkData={[2, 3, 5, 4, 6, totalProducts]}
        />
        <StatCard 
          label="Active Funnels" 
          value={activeFunnels} 
          icon={<Layers size={18} />} 
          trend={{ value: 12, isPositive: true }}
          sparkData={[1, 1, 2, 2, 3, activeFunnels]}
        />
        <StatCard 
          label="Total Leads" 
          value={totalLeads} 
          icon={<Users size={18} />} 
          trend={{ value: 24, isPositive: true }}
          sparkData={[0, 2, 1, 4, 3, totalLeads]}
        />
        <StatCard 
          label="Conversion" 
          value={`${conversionRate}%`} 
          icon={<TrendingUp size={18} />} 
          sparkData={[10, 15, 12, 20, 18, conversionRate]}
        />
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartArea 
            data={chartData.length > 0 ? chartData : undefined}
            title="Lead Acquisition"
            subtitle="New leads per day over the last 7 days"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-8 flex flex-col transition-shadow duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Leads</h3>
            <Link href="/dashboard/leads" className="text-xs font-black uppercase tracking-wider text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-xl hover:bg-indigo-50">
              All <ArrowRight size={12} />
            </Link>
          </div>
          
          <div className="flex-1 space-y-1">
            {recentLeads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between group p-3 -mx-3 rounded-2xl hover:bg-slate-50/80 transition-all duration-200 cursor-default">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center text-indigo-600 text-sm font-black shadow-inner border border-indigo-100/50 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    {lead.name[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900 truncate">{lead.name}</p>
                      {lead.hasWhatsapp && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" title="WhatsApp connected" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{lead.product}</span>
                      <span className="text-slate-200">·</span>
                      <span className="text-[10px] font-bold text-indigo-400">{lead.intent}</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.08em] flex-shrink-0 ml-3">{lead.timeAgo}</span>
              </div>
            ))}

            {recentLeads.length === 0 && (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                  <Users size={24} className="text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-400">No leads yet</p>
                <p className="text-xs text-slate-300 mt-1">Share your funnels to start capturing</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Insights Row */}
      {totalLeads > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Engagement Rate */}
          <div className="bg-white rounded-[2rem] p-7 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-0.5 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <MousePointerClick size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Engagement Rate</span>
            </div>
            <p className="text-3xl font-black text-slate-900">{engagementRate}%</p>
            <p className="text-xs text-slate-400 font-medium mt-1">of leads clicked a CTA button</p>
          </div>

          {/* Top Performing Product */}
          <div className="bg-white rounded-[2rem] p-7 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-0.5 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Top Product</span>
            </div>
            <p className="text-xl font-black text-slate-900 truncate" title={topProductName || 'N/A'}>{topProductName || 'N/A'}</p>
            <p className="text-xs text-slate-400 font-medium mt-1">highest engagement from leads</p>
          </div>

          {/* WhatsApp Reach */}
          <div className="bg-white rounded-[2rem] p-7 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-0.5 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Target size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">WhatsApp Reach</span>
            </div>
            <p className="text-3xl font-black text-slate-900">{whatsappLeads}</p>
            <p className="text-xs text-slate-400 font-medium mt-1">leads with verified contact</p>
          </div>
        </div>
      )}
    </div>
  );
}
