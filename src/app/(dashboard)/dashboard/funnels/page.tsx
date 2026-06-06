import { getFunnels } from '@/app/actions/funnels';
import { getProducts } from '@/app/actions/products';
import { FunnelsClient } from './FunnelsClient';
import { createClient } from '@/lib/supabase/server';
import { getOrCreateStore } from '@/app/actions/stores';

export default async function FunnelsPage() {
  const [funnels, products, store] = await Promise.all([
    getFunnels(),
    getProducts(),
    getOrCreateStore()
  ]);

  let leads: any[] = [];
  if (store) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('leads')
      .select('id, funnel_id, visitor_name, budget_range, created_at')
      .eq('store_id', store.id)
      .order('created_at', { ascending: false });
    if (data) {
      leads = data;
    }
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-12">
      <FunnelsClient 
        initialFunnels={funnels} 
        availableProducts={products} 
        initialLeads={leads} 
      />
    </div>
  );
}
