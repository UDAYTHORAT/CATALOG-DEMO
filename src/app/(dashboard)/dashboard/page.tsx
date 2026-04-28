import { createClient } from '@/lib/supabase/server';
import { StatCard } from '@/components/dashboard/StatCard';
import { ChartArea } from '@/components/dashboard/ChartArea';
import { Package, Layers, Users, TrendingUp, ArrowRight, Check, Plus } from 'lucide-react';
import Link from 'next/link';

type LeadRecord = {
  id: string;
  visitor_name: string | null;
  created_at: string;
  funnels?: {
    name: string | null;
  } | null;
};

type RecentLead = {
  id: string;
  name: string;
  funnel: string;
  date: string;
  timeAgo: string;
};

type StoreSummary = {
  id: string;
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

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const displayName = user?.user_metadata?.full_name?.split(' ')[0] || 'User';

  // Get Store
  const { data: store } = await supabase
    .from('stores')
    .select('id, whatsapp_number, bio')
    .eq('user_id', user?.id)
    .single<StoreSummary>();
  
  let totalProducts = 0;
  let activeFunnels = 0;
  let totalLeads = 0;
  let recentLeads: RecentLead[] = [];
  let chartData: { label: string; value: number }[] = [];

  if (store) {
    const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('store_id', store.id);
    const { count: funnelsCount } = await supabase.from('funnels').select('*', { count: 'exact', head: true }).eq('store_id', store.id);
    const { count: leadsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('store_id', store.id);
    
    totalProducts = productsCount || 0;
    activeFunnels = funnelsCount || 0;
    totalLeads = leadsCount || 0;

    // Recent leads
    const { data: leadsData } = await supabase.from('leads')
      .select('*, funnels(name)')
      .eq('store_id', store.id)
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (leadsData) {
      recentLeads = (leadsData as LeadRecord[]).map((lead) => ({
        id: lead.id,
        name: lead.visitor_name || 'Anonymous',
        funnel: lead.funnels?.name || 'Direct',
        date: new Date(lead.created_at).toLocaleDateString(),
        timeAgo: getTimeAgo(lead.created_at),
      }));
    }

    // Chart data: leads per day for last 7 days (real Supabase data)
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {displayName}
          </h1>
          <p className="text-sm text-slate-400 mt-1">Here&apos;s what&apos;s happening with your funnels.</p>
        </div>
        
        <div className="flex gap-2">
          <Link href="/dashboard/products" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">
            <Package size={16} />
            Products
          </Link>
          <Link href="/dashboard/funnels" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm">
            <Plus size={16} />
            New Funnel
          </Link>
        </div>
      </div>

      {/* Setup Progress (only show if not all done) */}
      {completedSteps < 4 && (
        <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Setup Progress</h3>
              <p className="text-xs text-slate-400 mt-0.5">{completedSteps} of 4 steps completed</p>
            </div>
            <span className="text-sm font-bold text-indigo-600">{Math.round(completedSteps / 4 * 100)}%</span>
          </div>
          
          {/* Progress bar */}
          <div className="h-1.5 bg-slate-100 rounded-full mb-5 overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-700"
              style={{ width: `${(completedSteps / 4) * 100}%` }}
            />
          </div>

          {/* Horizontal steps */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {steps.map((step) => (
              <Link
                key={step.label}
                href={step.href}
                className={`group flex items-center gap-3 rounded-xl p-3 transition-all border ${
                  step.done
                    ? 'bg-emerald-50/50 border-emerald-100 opacity-75'
                    : 'bg-white border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  step.done ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                }`}>
                  {step.done ? <Check size={14} strokeWidth={3} /> : <ArrowRight size={14} />}
                </div>
                <span className={`text-sm font-medium ${step.done ? 'text-emerald-700 line-through' : 'text-slate-700'}`}>
                  {step.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-slate-900">Recent Leads</h3>
            <Link href="/dashboard/leads" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          
          <div className="flex-1 space-y-4">
            {recentLeads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 text-sm font-bold group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    {lead.name[0] || 'A'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{lead.name}</p>
                    <p className="text-[11px] text-slate-400">{lead.funnel}</p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-300 font-medium">{lead.timeAgo}</span>
              </div>
            ))}

            {recentLeads.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-300">No leads yet</p>
                <p className="text-xs text-slate-300 mt-1">Share your funnels to start capturing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
