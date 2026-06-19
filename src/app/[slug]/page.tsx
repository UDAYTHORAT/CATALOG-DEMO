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

  // 2. Check if funnel has expired (paid template with expiry)
  if (funnel.expires_at) {
    const now = new Date();
    const expiresAt = new Date(funnel.expires_at);
    if (now > expiresAt) {
      const storeName = (funnel.stores as any)?.name || 'Store';
      return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                Page Not Available
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                This page from <span className="font-bold text-slate-700">{storeName}</span> is currently inactive. 
                The subscription period has ended.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">What happened?</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                The 30-day access period for this funnel has expired. 
                The owner can renew it from their dashboard to make it live again.
              </p>
            </div>
            <p className="text-xs text-slate-400">
              Powered by <span className="font-bold">FunnelLink</span>
            </p>
          </div>
        </main>
      );
    }
  }

  // 3. Extract products from story_mode_data (Source of truth for Elite Funnels)
  const storyModeContent = funnel.story_mode_data?.[0]?.content;
  const storyModeSections = storyModeContent?.sections || [];
  const storyModeProductsData = storyModeSections.find((s: any) => s.id === 'products')?.data;
  const storyModeProducts = storyModeProductsData?.products || [];

  // 4. Fallback: Fetch linked products via funnel_products junction (Legacy/Secondary)
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
