-- ============================================
-- ADD PUBLIC READ POLICY FOR FUNNEL PRODUCTS
-- ============================================

-- This allows the public funnel pages to fetch the linked products

DROP POLICY IF EXISTS "Public can view funnel products" ON public.funnel_products;
CREATE POLICY "Public can view funnel products" ON public.funnel_products FOR SELECT USING (true);
