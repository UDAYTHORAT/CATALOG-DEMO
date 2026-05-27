import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' });
  }

  // Get store
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Test updating
  const testName = 'Test Update Name ' + Date.now();
  const { data: updateData, error: updateError } = await supabase
    .from('stores')
    .update({ name: testName })
    .eq('user_id', user.id)
    .select();

  // Fetch store again to see if it changed
  const { data: storeAfter } = await supabase
    .from('stores')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return NextResponse.json({
    user,
    storeBefore: store,
    storeError,
    testName,
    updateData,
    updateError,
    storeAfter
  });
}
