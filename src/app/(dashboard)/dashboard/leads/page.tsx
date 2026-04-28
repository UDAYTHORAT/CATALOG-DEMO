import { createClient } from '@/lib/supabase/server';
import { DataTable } from '@/components/dashboard/DataTable';
import { Users, Download } from 'lucide-react';
import { EmptyState } from '@/components/dashboard/EmptyState';
import LeadsToolbar from './LeadsToolbar';

type LeadRecord = {
  id: string;
  visitor_name: string | null;
  whatsapp_number: string | null;
  budget_range: string | null;
  created_at: string;
  products?: {
    name: string | null;
  } | null;
  funnels?: {
    name: string | null;
  } | null;
};

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let leads: LeadRecord[] = [];
  if (user) {
    const { data: store } = await supabase.from('stores').select('id').eq('user_id', user.id).single();
    if (store) {
      const { data } = await supabase
        .from('leads')
        .select(`
          *,
          products(name),
          funnels(name)
        `)
        .eq('store_id', store.id)
        .order('created_at', { ascending: false });
      
      leads = (data || []) as LeadRecord[];
    }
  }

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'whatsapp', label: 'WhatsApp', sortable: false },
    { key: 'budget', label: 'Budget', sortable: true },
    { key: 'product', label: 'Product Interest', sortable: true },
    { key: 'funnel', label: 'Funnel Source', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
  ];

  const formattedLeads = leads.map(lead => {
    const daysSince = Math.floor((Date.now() - new Date(lead.created_at).getTime()) / 86400000);
    const status = daysSince < 1 ? 'New' : daysSince < 7 ? 'Follow Up' : 'Aging';

    return {
      id: lead.id,
      name: lead.visitor_name || 'Anonymous',
      whatsapp: lead.whatsapp_number ? (
        <span className="font-mono text-xs bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{lead.whatsapp_number}</span>
      ) : <span className="text-slate-300">—</span>,
      budget: lead.budget_range ? (
        <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md text-xs">
          {lead.budget_range}
        </span>
      ) : <span className="text-slate-300">—</span>,
      product: lead.products?.name || 'General',
      funnel: lead.funnels?.name || 'Direct',
      status: (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md ${
          status === 'New' ? 'text-emerald-700 bg-emerald-50' :
          status === 'Follow Up' ? 'text-amber-700 bg-amber-50' :
          'text-slate-500 bg-slate-50'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${
            status === 'New' ? 'bg-emerald-500' :
            status === 'Follow Up' ? 'bg-amber-500' :
            'bg-slate-400'
          }`} />
          {status}
        </span>
      ),
      date: new Date(lead.created_at).toLocaleDateString(),
    };
  });

  // Prepare CSV data for client-side export
  const csvData = leads.map(lead => ({
    Name: lead.visitor_name || 'Anonymous',
    WhatsApp: lead.whatsapp_number || '',
    Budget: lead.budget_range || '',
    Product: lead.products?.name || 'General',
    Funnel: lead.funnels?.name || 'Direct',
    Date: new Date(lead.created_at).toLocaleDateString(),
  }));

  return (
    <div className="space-y-6 animate-counter-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leads</h1>
          <p className="text-sm text-slate-400 mt-1">
            {leads.length > 0 ? `${leads.length} qualified prospects captured` : 'Track visitors from your funnels'}
          </p>
        </div>
        
        <LeadsToolbar csvData={csvData} />
      </div>

      {/* Table */}
      {formattedLeads.length === 0 ? (
        <EmptyState 
          icon={<Users className="text-indigo-500" size={28} />}
          title="No leads captured yet"
          description="Share your funnels to start capturing visitor intelligence. Every qualified prospect will appear here."
          actionLabel="View Funnels"
          actionHref="/dashboard/funnels"
        />
      ) : (
        <DataTable columns={columns} data={formattedLeads} selectable />
      )}
    </div>
  );
}
