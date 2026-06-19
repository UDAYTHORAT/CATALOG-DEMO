import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { getTemplatePrice } from '@/data/templatePricing';
import { MASTER_TEMPLATES } from '@/data/funnelTemplates';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      templateId,
      templateName,
      funnelName,
      funnelSlug,
      funnelId, // If renewal
    } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret || keySecret.startsWith('YOUR_')) {
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    // 1. Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    // 2. Get store
    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 400 });
    }

    const pricing = getTemplatePrice(templateId);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + pricing.validity * 24 * 60 * 60 * 1000);

    // 3. Handle renewal vs new purchase
    if (funnelId) {
      // RENEWAL: Extend existing funnel
      // Check if there's an existing active purchase to extend from
      const { data: existingPurchase } = await supabase
        .from('template_purchases')
        .select('expires_at')
        .eq('funnel_id', funnelId)
        .eq('payment_status', 'paid')
        .order('expires_at', { ascending: false })
        .limit(1)
        .single();

      // If existing purchase hasn't expired yet, extend from its expiry
      let renewExpiresAt = expiresAt;
      if (existingPurchase && new Date(existingPurchase.expires_at) > now) {
        renewExpiresAt = new Date(new Date(existingPurchase.expires_at).getTime() + pricing.validity * 24 * 60 * 60 * 1000);
      }

      // Create renewal purchase record
      const { error: purchaseError } = await supabase
        .from('template_purchases')
        .insert({
          user_id: user.id,
          store_id: store.id,
          funnel_id: funnelId,
          template_id: templateId,
          template_name: templateName || templateId,
          amount_paid: pricing.price,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          payment_status: 'paid',
          purchased_at: now.toISOString(),
          expires_at: renewExpiresAt.toISOString(),
          is_renewal: true,
        });

      if (purchaseError) {
        console.error('Purchase record error:', purchaseError);
        return NextResponse.json({ error: 'Failed to record purchase' }, { status: 500 });
      }

      // Update funnel expiry
      await supabase
        .from('funnels')
        .update({
          expires_at: renewExpiresAt.toISOString(),
          is_active: true,
        })
        .eq('id', funnelId);

      return NextResponse.json({
        success: true,
        type: 'renewal',
        funnelId,
        expiresAt: renewExpiresAt.toISOString(),
      });
    }

    // NEW PURCHASE: Create funnel + purchase record
    const template = MASTER_TEMPLATES.find(t => t.id === templateId);
    
    // Build story_mode_data from template
    let storyModeData: any[] = [];
    if (template?.funnelad) {
      storyModeData = [{
        templateId: template.id,
        landing: template.funnelad.landing,
        products: template.funnelad.products,
        whatsapp: template.funnelad.whatsapp,
        theme: template.funnelad.theme,
      }];
    }

    // Create the funnel
    const { data: funnel, error: funnelError } = await supabase
      .from('funnels')
      .insert({
        store_id: store.id,
        name: funnelName || template?.name || 'New Funnel',
        slug: funnelSlug || `funnel-${Date.now()}`,
        theme: template?.theme || 'minimal',
        welcome_title: template?.funnelad?.landing?.title || template?.hero?.headline || '',
        welcome_description: template?.funnelad?.landing?.subtitle || template?.hero?.subheadline || '',
        questions: [],
        story_mode_data: storyModeData,
        expires_at: expiresAt.toISOString(),
        is_active: true,
      })
      .select()
      .single();

    if (funnelError) {
      console.error('Funnel creation error:', funnelError);
      return NextResponse.json({ error: funnelError.message }, { status: 500 });
    }

    // Create purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from('template_purchases')
      .insert({
        user_id: user.id,
        store_id: store.id,
        funnel_id: funnel.id,
        template_id: templateId,
        template_name: templateName || template?.name || templateId,
        amount_paid: pricing.price,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        payment_status: 'paid',
        purchased_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        is_renewal: false,
      })
      .select()
      .single();

    if (purchaseError) {
      console.error('Purchase record error:', purchaseError);
      // Funnel was created but purchase record failed - still return success
    }

    // Link purchase to funnel
    if (purchase) {
      await supabase
        .from('funnels')
        .update({ purchase_id: purchase.id })
        .eq('id', funnel.id);
    }

    return NextResponse.json({
      success: true,
      type: 'purchase',
      funnelId: funnel.id,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
