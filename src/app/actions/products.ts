'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getOrCreateStore } from './stores';

export interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  image_url_2: string | null;
  category: string | null;
  dimensions: string | null;
  story_mode_data: any;
  created_at: string;
}

export async function getProducts() {
  const store = await getOrCreateStore();
  if (!store) return [];

  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return products as Product[];
}

export async function createProduct(formData: FormData) {
  const store = await getOrCreateStore();
  if (!store) return { error: 'No store found' };

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const image_url = formData.get('image_url') as string;
  const image_url_2 = formData.get('image_url_2') as string;
  const category = formData.get('category') as string;
  const dimensions = formData.get('dimensions') as string;

  if (!name || isNaN(price)) {
    return { error: 'Name and valid price are required' };
  }

  let story_mode_data = {};
  if (formData.has('story_mode_data')) {
    try {
      story_mode_data = JSON.parse(formData.get('story_mode_data') as string);
    } catch (e) {
      console.error('Error parsing story_mode_data:', e);
    }
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        store_id: store.id,
        name,
        description,
        price,
        image_url,
        image_url_2,
        dimensions,
        category: category || 'Uncategorized',
        story_mode_data
      }
    ])
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/products');
  return { success: true, product: data };
}

export async function updateProduct(productId: string, formData: FormData) {
  const store = await getOrCreateStore();
  if (!store) return { error: 'No store found' };

  const updates: any = {};
  if (formData.has('name')) updates.name = formData.get('name');
  if (formData.has('description')) updates.description = formData.get('description');
  if (formData.has('price')) updates.price = parseFloat(formData.get('price') as string);
  if (formData.has('image_url')) updates.image_url = formData.get('image_url');
  if (formData.has('image_url_2')) updates.image_url_2 = formData.get('image_url_2');
  if (formData.has('category')) updates.category = formData.get('category');
  if (formData.has('dimensions')) updates.dimensions = formData.get('dimensions');
  if (formData.has('story_mode_data')) {
    try {
      updates.story_mode_data = JSON.parse(formData.get('story_mode_data') as string);
    } catch (e) {
      console.error('Error parsing story_mode_data:', e);
    }
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId)
    .eq('store_id', store.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/products');
  return { success: true };
}

export async function deleteProduct(productId: string) {
  const store = await getOrCreateStore();
  if (!store) return { error: 'No store found' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
    .eq('store_id', store.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/products');
  return { success: true };
}
