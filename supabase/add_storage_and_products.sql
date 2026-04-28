-- ============================================
-- 1. JUNCTION TABLES (For linking multiple products to one funnel)
-- ============================================
CREATE TABLE IF NOT EXISTS public.funnel_products (
    funnel_id UUID REFERENCES public.funnels(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (funnel_id, product_id)
);

ALTER TABLE public.funnel_products ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

ALTER TABLE public.funnel_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their funnel products" ON public.funnel_products;
CREATE POLICY "Users can manage their funnel products" ON public.funnel_products FOR ALL USING (
    funnel_id IN (SELECT id FROM public.funnels WHERE store_id IN (SELECT id FROM public.stores WHERE user_id = auth.uid()))
);

DROP POLICY IF EXISTS "Public can view funnel products" ON public.funnel_products;
CREATE POLICY "Public can view funnel products" ON public.funnel_products FOR SELECT USING (true);



-- ============================================
-- 2. STORAGE BUCKETS (For product image uploads)
-- ============================================

-- Create a new bucket for product images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can view product images
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- Policy: Authenticated users can upload images
DROP POLICY IF EXISTS "Auth Upload" ON storage.objects;
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'product-images' AND auth.role() = 'authenticated'
);

-- Policy: Users can update their own images
DROP POLICY IF EXISTS "Auth Update" ON storage.objects;
CREATE POLICY "Auth Update" ON storage.objects FOR UPDATE USING (
  bucket_id = 'product-images' AND auth.uid() = owner
);

-- Policy: Users can delete their own images
DROP POLICY IF EXISTS "Auth Delete" ON storage.objects;
CREATE POLICY "Auth Delete" ON storage.objects FOR DELETE USING (
  bucket_id = 'product-images' AND auth.uid() = owner
);
