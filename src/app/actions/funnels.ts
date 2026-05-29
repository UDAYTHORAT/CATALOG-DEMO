'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getOrCreateStore } from './stores';

export interface Funnel {
  id: string;
  store_id: string;
  name: string;
  slug: string;
  theme: string;
  leads_count: number;
  is_active: boolean;
  welcome_title: string | null;
  welcome_description: string | null;
  questions: any[];
  story_mode_data: any[];
  created_at: string;
}

export async function getFunnels() {
  const store = await getOrCreateStore();
  if (!store) return [];

  const supabase = await createClient();
  const { data: funnels, error } = await supabase
    .from('funnels')
    .select('*')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching funnels:', error);
    return [];
  }

  return funnels as Funnel[];
}

export async function createFunnel(formData: FormData) {
  const store = await getOrCreateStore();
  if (!store) return { error: 'No store found' };

  const name = formData.get('name') as string;
  const rawSlug = formData.get('slug') as string;
  const slug = rawSlug?.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/(^-|-$)+/g, '');
  const theme = formData.get('theme') as string || 'bubbly';
  const productIds = formData.getAll('product_ids') as string[];
  
  const welcomeTitle = formData.get('welcome_title') as string || 'The Art of Discovery.';
  const welcomeDescription = formData.get('welcome_description') as string || 'Find your perfect piece. We guide you through a deliberate selection of our finest artifacts.';
  
  const rawQuestions = formData.get('questions') as string;
  const questions = rawQuestions ? JSON.parse(rawQuestions) : [];
  
  const rawStoryData = formData.get('story_mode_data') as string;
  const storyModeData = rawStoryData ? JSON.parse(rawStoryData) : [];

  if (!name || !slug) {
    return { error: 'Name and unique link (slug) are required' };
  }

  const supabase = await createClient();
  
  // 1. Check if slug exists
  const { data: existing } = await supabase.from('funnels').select('id').eq('slug', slug).single();
  if (existing) {
    return { error: 'This link is already taken. Please try another.' };
  }

  // 2. Create Funnel with pre-filled content
  const { data: funnel, error: funnelError } = await supabase
    .from('funnels')
    .insert([
      {
        store_id: store.id,
        name,
        slug,
        theme,
        welcome_title: welcomeTitle,
        welcome_description: welcomeDescription,
        questions: questions,
        story_mode_data: storyModeData
      }
    ])
    .select()
    .single();

  if (funnelError) {
    return { error: funnelError.message };
  }

  // 3. Link products to funnel
  if (productIds.length > 0) {
    const funnelProducts = productIds.map((productId, index) => ({
      funnel_id: funnel.id,
      product_id: productId,
      display_order: index,
    }));

    const { error: linkError } = await supabase
      .from('funnel_products')
      .insert(funnelProducts);

    if (linkError) {
      console.error('Error linking products:', linkError);
    }
  }

  revalidatePath('/dashboard/funnels');
  return { success: true, funnel };
}

export async function updateFunnel(funnelId: string, updates: Partial<Funnel> & { product_ids?: string[] }) {
  const store = await getOrCreateStore();
  if (!store) return { error: 'No store found' };

  const supabase = await createClient();
  
  const { product_ids, ...funnelUpdates } = updates;

  // 1. Update Funnel details
  if (Object.keys(funnelUpdates).length > 0) {
    const { error: updateError } = await supabase
      .from('funnels')
      .update(funnelUpdates)
      .eq('id', funnelId)
      .eq('store_id', store.id);

    if (updateError) return { error: updateError.message };
  }

  // 2. Update linked products if provided
  if (product_ids) {
    // Delete existing links
    await supabase.from('funnel_products').delete().eq('funnel_id', funnelId);
    
    // Insert new links
    if (product_ids.length > 0) {
      const funnelProducts = product_ids.map((productId, index) => ({
        funnel_id: funnelId,
        product_id: productId,
        display_order: index,
      }));

      await supabase.from('funnel_products').insert(funnelProducts);
    }
  }

  revalidatePath('/dashboard/funnels');
  revalidatePath(`/dashboard/funnels/${funnelId}`);
  return { success: true };
}

export async function deleteFunnel(funnelId: string) {
  const store = await getOrCreateStore();
  if (!store) return { error: 'No store found' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('funnels')
    .delete()
    .eq('id', funnelId)
    .eq('store_id', store.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/funnels');
  return { success: true };
}

export async function resolveMapUrl(shortUrl: string): Promise<string | null> {
  try {
    // Send a fetch request following redirects to resolve short maps URL on the server (bypassing CORS)
    const res = await fetch(shortUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    return res.url;
  } catch (err) {
    console.error('Failed to resolve map URL:', err);
    return null;
  }
}

