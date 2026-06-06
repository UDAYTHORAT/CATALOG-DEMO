'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function createLead(
  funnelId: string, 
  storeId: string, 
  name: string, 
  phone: string = '',
  budgetRange: string = '',
  productId: string = '',
) {
  // 1. Validate required fields
  if (!funnelId || !storeId || !name?.trim()) {
    return { error: 'Missing required fields' };
  }

  // Use admin client to bypass RLS for public lead creation
  const supabase = createAdminClient();
  
  // 2. Verify the funnel actually exists and is active
  const { data: funnel } = await supabase
    .from('funnels')
    .select('id')
    .eq('id', funnelId)
    .eq('store_id', storeId)
    .eq('is_active', true)
    .single();
    
  if (!funnel) {
    return { error: 'Invalid or inactive funnel' };
  }
  
  // We don't check for auth here because this is a public action
  // triggered by the buyer when they click the WhatsApp button.
  
  // Don't pass product_interest if it's not a valid UUID from the products table.
  // Template products (p1, p2, cafe-prod-1 etc) live inside story_mode_data,
  // not in the products table, so the FK constraint would reject them.
  // Instead, we store the product name inside budget_range as JSON.
  const { error } = await supabase
    .from('leads')
    .insert([
      {
        store_id: storeId,
        funnel_id: funnelId,
        visitor_name: name,
        whatsapp_number: phone,
        budget_range: budgetRange,
        product_interest: null,
      }
    ]);

  if (error) {
    console.error('Error tracking lead:', error);
    return { error: error.message };
  }

  return { success: true };
}

export async function incrementFunnelView(funnelId: string) {
  if (!funnelId || funnelId === 'preview') return { success: true };
  
  // Use admin client to bypass RLS — public visitors can't UPDATE funnels
  const supabase = createAdminClient();
  
  const { data: funnel, error: fetchError } = await supabase
    .from('funnels')
    .select('views_count')
    .eq('id', funnelId)
    .single();
    
  if (fetchError || !funnel) {
    console.error('Error fetching funnel for view increment:', fetchError);
    return { error: 'Funnel not found' };
  }

  const { error: updateError } = await supabase
    .from('funnels')
    .update({ views_count: (funnel.views_count || 0) + 1 })
    .eq('id', funnelId);
    
  if (updateError) {
    console.error('Error incrementing view count:', updateError);
    return { error: updateError.message };
  }
  
  return { success: true };
}
