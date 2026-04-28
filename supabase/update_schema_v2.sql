-- ============================================
-- Million Dollar SaaS Expansion: Schema Update
-- ============================================

-- 1. Add customization columns to funnels
ALTER TABLE public.funnels 
ADD COLUMN IF NOT EXISTS questions JSONB DEFAULT '[{"id": "budget", "question": "What is your budget range?", "type": "budget"}]'::jsonb,
ADD COLUMN IF NOT EXISTS welcome_title TEXT,
ADD COLUMN IF NOT EXISTS welcome_description TEXT;

-- 2. Add customization columns to products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS story_mode_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS dimensions TEXT,
ADD COLUMN IF NOT EXISTS image_url_2 TEXT;

-- 3. Add answers column to leads
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS answers JSONB DEFAULT '{}'::jsonb;

-- 4. Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- 5. Set default welcome text for existing funnels
UPDATE public.funnels 
SET welcome_title = 'The Art of Discovery.', 
    welcome_description = 'Find your perfect piece. We guide you through a deliberate selection of our finest artifacts.'
WHERE welcome_title IS NULL;
