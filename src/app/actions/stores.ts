'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Interface for a Store
export interface Store {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  whatsapp_number: string | null;
  bio: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

// Ensure the user has a store, if not, create one automatically
export async function getOrCreateStore(): Promise<Store | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // 1. Check if store exists
  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (store) {
    return store;
  }

  // 2. If no store, create a default one
  const defaultStoreName = user.user_metadata?.full_name ? `${user.user_metadata.full_name}'s Store` : 'My Store';
  
  // Generate a random unique slug to ensure it doesn't conflict
  const baseSlug = defaultStoreName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  const uniqueSlug = `${baseSlug}-${randomSuffix}`;
  
  const { data: newStore, error: insertError } = await supabase
    .from('stores')
    .insert([
      { 
        user_id: user.id, 
        name: defaultStoreName,
        slug: uniqueSlug
      }
    ])
    .select()
    .single();

  if (insertError) {
    console.error('Error creating store:', insertError);
    return null;
  }

  return newStore;
}

export async function updateStoreSettings(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const name = formData.get('name') as string;
  const whatsapp_number = formData.get('whatsapp_number') as string;
  const bio = formData.get('bio') as string;

  const { error } = await supabase
    .from('stores')
    .update({ name, whatsapp_number, bio })
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/settings');
  revalidatePath('/dashboard');
  return { success: true };
}
