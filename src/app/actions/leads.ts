'use server';

import { createClient } from '@/lib/supabase/server';

export async function createLead(
  funnelId: string, 
  storeId: string, 
  name: string, 
  phone: string = '',
  budgetRange: string = '',
  productId: string = '',
  answers: any = {}
) {
  const supabase = await createClient();
  
  // We don't check for auth here because this is a public action
  // triggered by the buyer when they click the WhatsApp button.
  
  const { error } = await supabase
    .from('leads')
    .insert([
      {
        store_id: storeId,
        funnel_id: funnelId,
        visitor_name: name,
        whatsapp_number: phone,
        budget_range: budgetRange,
        product_interest: productId || null,
        answers
      }
    ]);

  if (error) {
    console.error('Error tracking lead:', error);
    return { error: error.message };
  }

  return { success: true };
}
