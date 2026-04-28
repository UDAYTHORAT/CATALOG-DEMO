import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import FunnelClient, { type FunnelProduct } from './FunnelClient';

type FunnelProductJoin = {
  products: FunnelProduct | null;
};

export default async function PublicFunnelPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = await createClient();

  // 1. Fetch Funnel with Store details
  const { data: funnel } = await supabase
    .from('funnels')
    .select(`
      *,
      stores (
        id,
        name,
        bio,
        logo_url,
        whatsapp_number
      )
    `)
    .eq('slug', slug)
    .single();

  if (!funnel || !funnel.is_active) {
    notFound();
  }

  // 2. Fetch linked products via funnel_products junction
  const { data: funnelProducts } = await supabase
    .from('funnel_products')
    .select(`
      display_order,
      products (
        id,
        name,
        description,
        price,
        image_url,
        image_url_2,
        category,
        dimensions
      )
    `)
    .eq('funnel_id', funnel.id)
    .order('display_order', { ascending: true });

  const products = ((funnelProducts as any[] | null)?.map((fp) => fp.products).filter(Boolean) || []) as FunnelProduct[];

  return (
    <main className="min-h-screen">
      <FunnelClient 
        funnel={funnel} 
        store={funnel.stores} 
        products={products} 
      />
    </main>
  );
}
