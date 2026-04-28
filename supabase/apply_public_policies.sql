-- ============================================
-- MASTER PUBLIC READ POLICIES
-- Run this file once to allow public access to the funnel pages!
-- ============================================

-- 1. Allow public to view stores
DROP POLICY IF EXISTS "Public can view stores" ON public.stores;
CREATE POLICY "Public can view stores" ON public.stores FOR SELECT USING (true);

-- 2. Allow public to view active funnels
DROP POLICY IF EXISTS "Public can view active funnels" ON public.funnels;
CREATE POLICY "Public can view active funnels" ON public.funnels FOR SELECT USING (is_active = true);

-- 3. Allow public to view active products
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" ON public.products FOR SELECT USING (is_active = true);

-- 4. Allow public to view the junction table (funnel_products)
DROP POLICY IF EXISTS "Public can view funnel products" ON public.funnel_products;
CREATE POLICY "Public can view funnel products" ON public.funnel_products FOR SELECT USING (true);
