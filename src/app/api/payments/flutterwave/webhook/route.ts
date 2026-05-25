import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use anon key (correct project) + SECURITY DEFINER RPC to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// POST /api/payments/flutterwave/webhook
export async function POST(req: NextRequest) {
  try {
    const secretHash = process.env.FLUTTERWAVE_ENCRYPTION_KEY!;
    const signature = req.headers.get('verif-hash');

    if (!signature || signature !== secretHash) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = await req.json();

    if (event.event === 'charge.completed' && event.data.status === 'successful') {
      const { tx_ref, flw_ref, amount, currency } = event.data;

      // Call SECURITY DEFINER RPC — bypasses RLS without needing the service role key
      const { data, error } = await supabase.rpc('process_payment_webhook', {
        p_order_id: tx_ref,
        p_status: 'paid',
        p_provider: 'flutterwave',
        p_reference: flw_ref,
      });

      if (error) {
        console.error('Failed to update order via RPC:', error);
        return NextResponse.json({ error: 'DB update failed' }, { status: 500 });
      }

      if (data && !data.success) {
        console.error('RPC returned failure:', data.error);
        return NextResponse.json({ error: data.error }, { status: 404 });
      }

      console.log(`✅ Flutterwave payment verified: ${tx_ref} - ${currency} ${amount}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Flutterwave webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
