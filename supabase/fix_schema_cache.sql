-- ============================================
-- FIX MISSING COLUMN AND RELOAD CACHE
-- ============================================

-- Add the display_order column if it was missing from an older schema version
ALTER TABLE public.funnel_products ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Force Supabase to reload its schema cache so the API recognizes the new column
NOTIFY pgrst, 'reload schema';
