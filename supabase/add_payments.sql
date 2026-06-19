-- ============================================
-- TEMPLATE PURCHASES & PAYMENTS
-- ============================================
-- Tracks template purchases with 30-day validity
-- and Razorpay payment details

CREATE TABLE IF NOT EXISTS public.template_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    funnel_id UUID REFERENCES public.funnels(id) ON DELETE SET NULL,
    
    -- Template info
    template_id TEXT NOT NULL,  -- e.g. 'funnelad-elite-furniture'
    template_name TEXT NOT NULL,
    
    -- Pricing
    amount_paid INTEGER NOT NULL, -- in paise (e.g. 69900 for Rs 699)
    currency TEXT DEFAULT 'INR',
    
    -- Razorpay
    razorpay_order_id TEXT NOT NULL,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    payment_status TEXT DEFAULT 'pending', -- pending | paid | failed | refunded
    
    -- Validity
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Renewal tracking
    is_renewal BOOLEAN DEFAULT false,
    parent_purchase_id UUID REFERENCES public.template_purchases(id) ON DELETE SET NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.template_purchases ENABLE ROW LEVEL SECURITY;

-- Users can view their own purchases
CREATE POLICY "Users can view own purchases" 
    ON public.template_purchases FOR SELECT 
    USING (auth.uid() = user_id);

-- Users can insert their own purchases (created during payment flow)
CREATE POLICY "Users can insert own purchases" 
    ON public.template_purchases FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own purchases (for payment verification)
CREATE POLICY "Users can update own purchases" 
    ON public.template_purchases FOR UPDATE 
    USING (auth.uid() = user_id);

-- Service role can do anything (for webhook/server verification)
-- Note: Service role bypasses RLS anyway, this is for documentation

-- Add expires_at column to funnels table if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'funnels' AND column_name = 'expires_at'
    ) THEN
        ALTER TABLE public.funnels ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Add purchase_id column to funnels table if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'funnels' AND column_name = 'purchase_id'
    ) THEN
        ALTER TABLE public.funnels ADD COLUMN purchase_id UUID REFERENCES public.template_purchases(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Trigger for updated_at
CREATE TRIGGER update_template_purchases_updated_at 
    BEFORE UPDATE ON public.template_purchases 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_template_purchases_user_id ON public.template_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_template_purchases_funnel_id ON public.template_purchases(funnel_id);
CREATE INDEX IF NOT EXISTS idx_template_purchases_payment_status ON public.template_purchases(payment_status);
CREATE INDEX IF NOT EXISTS idx_template_purchases_expires_at ON public.template_purchases(expires_at);
CREATE INDEX IF NOT EXISTS idx_funnels_expires_at ON public.funnels(expires_at);
