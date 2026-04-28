-- ============================================
-- FunnelLink Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. STORES TABLE
-- ============================================
CREATE TABLE public.stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    whatsapp_number TEXT,
    bio TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own stores" ON public.stores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own stores" ON public.stores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own stores" ON public.stores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own stores" ON public.stores FOR DELETE USING (auth.uid() = user_id);
-- Public can view stores by slug (for the landing page)
CREATE POLICY "Public can view stores" ON public.stores FOR SELECT USING (true);


-- ============================================
-- 2. PRODUCTS TABLE
-- ============================================
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2),
    image_url TEXT,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
-- Owners can manage their products
CREATE POLICY "Users can view their own products" ON public.products FOR SELECT USING (
    store_id IN (SELECT id FROM public.stores WHERE user_id = auth.uid())
);
CREATE POLICY "Users can insert their own products" ON public.products FOR INSERT WITH CHECK (
    store_id IN (SELECT id FROM public.stores WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update their own products" ON public.products FOR UPDATE USING (
    store_id IN (SELECT id FROM public.stores WHERE user_id = auth.uid())
);
CREATE POLICY "Users can delete their own products" ON public.products FOR DELETE USING (
    store_id IN (SELECT id FROM public.stores WHERE user_id = auth.uid())
);
-- Public can view active products
CREATE POLICY "Public can view active products" ON public.products FOR SELECT USING (is_active = true);


-- ============================================
-- 3. FUNNELS TABLE
-- ============================================
CREATE TABLE public.funnels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    theme TEXT DEFAULT 'light',
    is_active BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0,
    leads_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own funnels" ON public.funnels FOR SELECT USING (
    store_id IN (SELECT id FROM public.stores WHERE user_id = auth.uid())
);
CREATE POLICY "Users can insert their own funnels" ON public.funnels FOR INSERT WITH CHECK (
    store_id IN (SELECT id FROM public.stores WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update their own funnels" ON public.funnels FOR UPDATE USING (
    store_id IN (SELECT id FROM public.stores WHERE user_id = auth.uid())
);
CREATE POLICY "Users can delete their own funnels" ON public.funnels FOR DELETE USING (
    store_id IN (SELECT id FROM public.stores WHERE user_id = auth.uid())
);
-- Public can view active funnels
CREATE POLICY "Public can view active funnels" ON public.funnels FOR SELECT USING (is_active = true);


-- ============================================
-- 4. FUNNEL_PRODUCTS TABLE (Many-to-Many)
-- ============================================
CREATE TABLE public.funnel_products (
    funnel_id UUID NOT NULL REFERENCES public.funnels(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    PRIMARY KEY (funnel_id, product_id)
);

-- RLS
ALTER TABLE public.funnel_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their funnel products" ON public.funnel_products FOR ALL USING (
    funnel_id IN (SELECT id FROM public.funnels WHERE store_id IN (SELECT id FROM public.stores WHERE user_id = auth.uid()))
);
-- Public can view funnel products
CREATE POLICY "Public can view funnel products" ON public.funnel_products FOR SELECT USING (true);


-- ============================================
-- 5. LEADS TABLE
-- ============================================
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    funnel_id UUID REFERENCES public.funnels(id) ON DELETE SET NULL,
    visitor_name TEXT,
    whatsapp_number TEXT,
    product_interest UUID REFERENCES public.products(id) ON DELETE SET NULL,
    budget_range TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
-- Owners can manage leads
CREATE POLICY "Users can view their own leads" ON public.leads FOR SELECT USING (
    store_id IN (SELECT id FROM public.stores WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update their own leads" ON public.leads FOR UPDATE USING (
    store_id IN (SELECT id FROM public.stores WHERE user_id = auth.uid())
);
CREATE POLICY "Users can delete their own leads" ON public.leads FOR DELETE USING (
    store_id IN (SELECT id FROM public.stores WHERE user_id = auth.uid())
);
-- Public can insert leads (from the funnel)
CREATE POLICY "Public can insert leads" ON public.leads FOR INSERT WITH CHECK (true);


-- ============================================
-- 6. TRIGGERS
-- ============================================
-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON public.stores FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_funnels_updated_at BEFORE UPDATE ON public.funnels FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Increment leads count on funnel when a new lead is created
CREATE OR REPLACE FUNCTION increment_funnel_leads()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.funnel_id IS NOT NULL THEN
        UPDATE public.funnels SET leads_count = leads_count + 1 WHERE id = NEW.funnel_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER increment_funnel_leads_trigger AFTER INSERT ON public.leads FOR EACH ROW EXECUTE PROCEDURE increment_funnel_leads();

-- ============================================
-- 7. STORAGE BUCKETS
-- ============================================

-- Create a new bucket for product images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. JUNCTION TABLES
-- ============================================
CREATE TABLE IF NOT EXISTS public.funnel_products (
    funnel_id UUID REFERENCES public.funnels(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (funnel_id, product_id)
);

ALTER TABLE public.funnel_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their funnel products" ON public.funnel_products;
CREATE POLICY "Users can manage their funnel products" ON public.funnel_products FOR ALL USING (
    funnel_id IN (SELECT id FROM public.funnels WHERE store_id IN (SELECT id FROM public.stores WHERE user_id = auth.uid()))
);

DROP POLICY IF EXISTS "Public can view funnel products" ON public.funnel_products;
CREATE POLICY "Public can view funnel products" ON public.funnel_products FOR SELECT USING (true);


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
