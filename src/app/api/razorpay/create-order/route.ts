import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@/lib/supabase/server';
import { getTemplatePrice } from '@/data/templatePricing';

export async function POST(req: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId.startsWith('YOUR_') || keySecret.startsWith('YOUR_')) {
      return NextResponse.json({ error: 'Payment gateway not configured. Please add Razorpay keys to .env.local' }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { templateId, templateName, funnelId } = body;

    if (!templateId) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }

    const pricing = getTemplatePrice(templateId);

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: pricing.price,
      currency: 'INR',
      receipt: `rcpt_${Date.now().toString().slice(-8)}_${Math.floor(Math.random() * 1000)}`,
      notes: {
        user_id: user.id,
        template_id: templateId,
        template_name: templateName || templateId,
        funnel_id: funnelId || '',
        type: funnelId ? 'renewal' : 'purchase',
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: keyId,
    });
  } catch (error: any) {
    console.error('Razorpay create order error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
