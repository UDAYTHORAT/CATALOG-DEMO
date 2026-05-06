import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { getProducts } from '@/app/actions/products';
import FunnelAdFurnitureEditor from '@/components/dashboard/templates/FunnelAdFurnitureEditor';

type FunnelProductLink = {
  product_id: string | null;
};

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
  const linkedProductIds = (funnel.funnel_products as FunnelProductLink[] | null | undefined)?.flatMap((link) =>
    link.product_id ? [link.product_id] : []
  ) || [];

  return (
    <FunnelAdFurnitureEditor
      funnel={funnel}
      allProducts={products}
    />
  );
}
