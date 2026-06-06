import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client using the SERVICE_ROLE key.
 * This bypasses RLS completely — use ONLY in server actions
 * for operations that public visitors need to trigger
 * (e.g. incrementing views_count on a funnel).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    // Fallback to anon key if service role not configured
    // This will still be subject to RLS policies
    return createSupabaseClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
