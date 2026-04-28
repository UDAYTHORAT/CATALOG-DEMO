import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { getProducts } from '@/app/actions/products';
import FunnelEditor from './FunnelEditor';

export default async function EditFunnelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  // Fetch funnel
  const { data: funnel } = await supabase
    .from('funnels')
    .select('*, funnel_products(product_id)')
    .eq('id', id)
    .single();

  if (!funnel) {
    notFound();
  }

  // Fetch all available products for selection
  const products = await getProducts();

  // Extract linked product IDs
  const linkedProductIds = funnel.funnel_products?.map((fp: any) => fp.product_id) || [];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <FunnelEditor 
        funnel={funnel} 
        allProducts={products} 
        initialLinkedProductIds={linkedProductIds} 
      />
    </div>
  );
}
