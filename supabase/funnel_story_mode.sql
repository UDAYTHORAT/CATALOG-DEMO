-- ============================================
-- Funnel Story Mode & Premium Templates
-- ============================================

ALTER TABLE public.funnels 
ADD COLUMN IF NOT EXISTS story_mode_data JSONB DEFAULT '[]'::jsonb;

-- Ensure templates can be stored (using existing theme column)
-- bubbly, dark, minimal are defaults. 
-- We'll add: onyx, ethereal, kinetic.
