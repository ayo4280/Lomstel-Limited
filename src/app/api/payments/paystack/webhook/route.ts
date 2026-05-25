import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Use anon key (correct project) + SECURITY DEFINER RPC to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// POST /api/payments/paystack/webhook
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    // Verify the webhook is from Paystack
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === 'charge.success') {
      const { reference, amount, currency } = event.data;

      // Call SECURITY DEFINER RPC — bypasses RLS without needing the service role key
      const { data, error } = await supabase.rpc('process_payment_webhook', {
        p_order_id: reference,
        p_status: 'paid',
        p_provider: 'paystack',
        p_reference: reference,
      });

      if (error) {
        console.error('Failed to update order via RPC:', error);
        return NextResponse.json({ error: 'DB update failed' }, { status: 500 });
      }

      if (data && !data.success) {
        console.error('RPC returned failure:', data.error);
        return NextResponse.json({ error: data.error }, { status: 404 });
      }

      console.log(`✅ Paystack payment verified: ${reference} - ${currency} ${amount / 100}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Paystack webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

