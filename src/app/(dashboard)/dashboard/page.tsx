import { createClient } from '@/lib/supabase/server';
import DashboardClient from './DashboardClient';

type StoreSummary = {
  id: string;
  name: string | null;
  whatsapp_number: string | null;
  bio: string | null;
};

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
  
  let initialFunnels: any[] = [];
  let initialLeads: any[] = [];

  if (store) {
    const [funnelsDataRes, leadsDataRes] = await Promise.all([
      supabase.from('funnels').select('id, name, slug, views_count, is_active').eq('store_id', store.id),
      supabase.from('leads').select('*, funnels(name, slug)').eq('store_id', store.id).order('created_at', { ascending: false })
    ]);

    initialFunnels = funnelsDataRes.data || [];
    initialLeads = leadsDataRes.data || [];
  }

  return (
    <DashboardClient 
      displayName={displayName}
      storeName={store?.name || null}
      initialFunnels={initialFunnels}
      initialLeads={initialLeads}
    />
  );
}
