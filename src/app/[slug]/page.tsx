import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import FunnelClient, { type FunnelProduct } from './FunnelClient';

type FunnelProductJoin = {
  products: FunnelProduct | null;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<import('next').Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = await createClient();
  const { data: funnel } = await supabase.from('funnels').select('welcome_title, welcome_description, stores(name, logo_url)').eq('slug', slug).single();

  if (!funnel) return { title: 'Not Found' };

  const storeName = (funnel.stores as any)?.name || 'Exclusive Collection';
  const logoUrl = (funnel.stores as any)?.logo_url;
  const title = funnel.welcome_title || storeName;
  const description = funnel.welcome_description || `Discover factory-direct collections from ${storeName}.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: logoUrl ? [logoUrl] : [],
    },
    twitter: {
      card: 'summary_large_image',
    }
  };
}

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

  // 2. Extract products from story_mode_data (Source of truth for Elite Funnels)
  const storyModeContent = funnel.story_mode_data?.[0]?.content;
  const storyModeSections = storyModeContent?.sections || [];
  const storyModeProductsData = storyModeSections.find((s: any) => s.id === 'products')?.data;
  const storyModeProducts = storyModeProductsData?.products || [];

  // 3. Fallback: Fetch linked products via funnel_products junction (Legacy/Secondary)
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

  const junctionProducts = ((funnelProducts as any[] | null)?.map((fp) => fp.products).filter(Boolean) || []) as FunnelProduct[];

  // Prioritize story mode products, then junction products
  const products = storyModeProducts.length > 0 ? storyModeProducts : junctionProducts;

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
