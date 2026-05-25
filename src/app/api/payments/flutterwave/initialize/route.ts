import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/payments/flutterwave/initialize
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, amount, currency, orderId, customerName, metadata } = body;

    if (!email || !amount || !orderId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const response = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref: orderId,
        amount,
        currency: currency || 'USD',
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/orders?payment=success`,
        customer: {
          email,
          name: customerName || 'Customer',
        },
        customizations: {
          title: 'Lomstel Limited',
          description: 'Mushroom Order Payment',
          logo: 'https://ejmaotssmwjslvpuseny.supabase.co/storage/v1/object/public/certificates/lomstel-logo.png',
        },
        meta: {
          order_id: orderId,
          ...metadata,
        },
      }),
    });

    const data = await response.json();

    if (data.status !== 'success') {
      return NextResponse.json({ error: data.message || 'Flutterwave initialization failed' }, { status: 400 });
    }

    return NextResponse.json({
      payment_link: data.data.link,
    });
  } catch (error: any) {
    console.error('Flutterwave init error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
