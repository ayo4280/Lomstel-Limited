import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY!;
const flutterwaveEncKey = process.env.FLUTTERWAVE_ENCRYPTION_KEY!;
const appUrl = 'http://localhost:3000';

if (!supabaseUrl || !supabaseAnonKey || !paystackSecretKey) {
  console.error('❌ Missing environment variables in .env.local');
  console.error('  Need: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, PAYSTACK_SECRET_KEY');
  process.exit(1);
}

// All DB access goes through SECURITY DEFINER RPCs — no service role key needed
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false }
});

// ─── DB helpers (all via SECURITY DEFINER RPCs, callable by anon) ─────────────

async function createTestOrder(provider: 'paystack' | 'flutterwave'): Promise<string> {
  const { data, error } = await supabase.rpc('create_payment_order', {
    p_buyer_name: `E2E Test Buyer (${provider})`,
    p_buyer_email: `e2e-${provider}@lomstel-test.com`,
    p_product_type: 'WET',
    p_quantity_kg: 35.5,
    p_price_per_kg: 3500.0,
    p_total_amount: 124250.0,
    p_currency: 'NGN',
    p_payment_provider: provider,
    p_notes: `Automated E2E test - ${new Date().toISOString()}`,
  });
  if (error) throw new Error(`create_payment_order RPC failed: ${error.message}`);
  if (!data?.success) throw new Error(`create_payment_order returned: ${JSON.stringify(data)}`);
  return data.id as string;
}

async function verifyOrderStatus(orderId: string, expectedStatus: string) {
  const { data, error } = await supabase.rpc('get_payment_order', { p_order_id: orderId });
  if (error) throw new Error(`get_payment_order RPC failed: ${error.message}`);
  if (!data?.success) throw new Error(`Order not found: ${orderId}`);
  if (data.payment_status !== expectedStatus) {
    throw new Error(`Order status is "${data.payment_status}", expected "${expectedStatus}"`);
  }
  return data;
}

async function verifyInventoryDeduction(quantityKg: number) {
  await new Promise(r => setTimeout(r, 1500)); // wait for DB trigger
  const { data, error } = await supabase.rpc('get_recent_deduction', { p_quantity_kg: quantityKg });
  if (error) throw new Error(`get_recent_deduction RPC failed: ${error.message}`);
  if (!data?.success) throw new Error(`No deduction found for -${quantityKg}kg`);
  return data;
}

async function cleanupRecords(orderId: string, deductionId: string | null) {
  const { error } = await supabase.rpc('delete_test_records', {
    p_order_id: orderId,
    p_deduction_id: deductionId,
  });
  if (error) console.warn(`  ⚠️  Cleanup warning: ${error.message}`);
}

// ─── Test 1: Paystack Webhook ─────────────────────────────────────────────────

async function testPaystackWebhook() {
  console.log('\n━━━ TEST 1: Paystack Webhook ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  let orderId: string | null = null;
  let deductionId: string | null = null;

  try {
    // Step 1: Create pending order
    console.log('  1️⃣  Creating pending order via RPC...');
    orderId = await createTestOrder('paystack');
    console.log(`  ✅  Order ID: ${orderId}`);

    // Step 2: Build signed webhook payload
    console.log('  2️⃣  Building signed Paystack webhook payload...');
    const payload = JSON.stringify({
      event: 'charge.success',
      data: { reference: orderId, status: 'success', amount: 12425000, currency: 'NGN' },
    });
    const signature = crypto.createHmac('sha512', paystackSecretKey).update(payload).digest('hex');

    // Step 3: POST to webhook endpoint
    console.log(`  3️⃣  POST → ${appUrl}/api/payments/paystack/webhook`);
    const res = await fetch(`${appUrl}/api/payments/paystack/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-paystack-signature': signature },
      body: payload,
    });
    if (!res.ok) throw new Error(`Webhook HTTP ${res.status}: ${await res.text()}`);
    const result = await res.json();
    console.log(`  ✅  Response: ${JSON.stringify(result)}`);

    // Step 4: Verify order is marked paid
    console.log('  4️⃣  Verifying order status = "paid"...');
    await new Promise(r => setTimeout(r, 800));
    const order = await verifyOrderStatus(orderId, 'paid');
    console.log(`  ✅  Status: ${order.payment_status} | Ref: ${order.payment_reference}`);

    // Step 5: Verify inventory deduction
    console.log('  5️⃣  Verifying automatic inventory deduction (-35.5kg)...');
    const deduction = await verifyInventoryDeduction(35.5);
    deductionId = deduction.id;
    console.log(`  ✅  Deduction: id=${deduction.id}, qty=${deduction.quantity_kg}kg`);

    return { orderId, deductionId, passed: true };
  } catch (err: any) {
    console.error(`  ❌  FAILED: ${err.message}`);
    return { orderId, deductionId, passed: false };
  } finally {
    if (orderId) await cleanupRecords(orderId, deductionId);
  }
}

// ─── Test 2: Flutterwave Webhook ──────────────────────────────────────────────

async function testFlutterwaveWebhook() {
  console.log('\n━━━ TEST 2: Flutterwave Webhook ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  let orderId: string | null = null;
  let deductionId: string | null = null;

  try {
    // Step 1: Create pending order
    console.log('  1️⃣  Creating pending order via RPC...');
    orderId = await createTestOrder('flutterwave');
    console.log(`  ✅  Order ID: ${orderId}`);

    // Step 2: Build webhook payload (Flutterwave uses a static secret hash header)
    console.log('  2️⃣  Building Flutterwave webhook payload...');
    const flwRef = `FLW-E2E-${Date.now()}`;
    const payload = JSON.stringify({
      event: 'charge.completed',
      data: { tx_ref: orderId, flw_ref: flwRef, status: 'successful', amount: 124250, currency: 'NGN' },
    });

    // Step 3: POST to webhook endpoint
    console.log(`  3️⃣  POST → ${appUrl}/api/payments/flutterwave/webhook`);
    const res = await fetch(`${appUrl}/api/payments/flutterwave/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'verif-hash': flutterwaveEncKey },
      body: payload,
    });
    if (!res.ok) throw new Error(`Webhook HTTP ${res.status}: ${await res.text()}`);
    const result = await res.json();
    console.log(`  ✅  Response: ${JSON.stringify(result)}`);

    // Step 4: Verify order is marked paid
    console.log('  4️⃣  Verifying order status = "paid"...');
    await new Promise(r => setTimeout(r, 800));
    const order = await verifyOrderStatus(orderId, 'paid');
    console.log(`  ✅  Status: ${order.payment_status} | Ref: ${order.payment_reference}`);

    // Step 5: Verify inventory deduction
    console.log('  5️⃣  Verifying automatic inventory deduction (-35.5kg)...');
    const deduction = await verifyInventoryDeduction(35.5);
    deductionId = deduction.id;
    console.log(`  ✅  Deduction: id=${deduction.id}, qty=${deduction.quantity_kg}kg`);

    return { orderId, deductionId, passed: true };
  } catch (err: any) {
    console.error(`  ❌  FAILED: ${err.message}`);
    return { orderId, deductionId, passed: false };
  } finally {
    if (orderId) await cleanupRecords(orderId, deductionId);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  Lomstel E2E Payment Integration Test                        ║');
  console.log('║  Paystack + Flutterwave → DB update → Inventory deduction    ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');

  const t1 = await testPaystackWebhook();
  const t2 = await testFlutterwaveWebhook();

  console.log('\n═══════════════════════ RESULTS ════════════════════════════════');
  console.log(`  Paystack webhook:    ${t1.passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Flutterwave webhook: ${t2.passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log('═══════════════════════════════════════════════════════════════');

  if (t1.passed && t2.passed) {
    console.log('\n🏆 ALL TESTS PASSED — purchase → payment → inventory pipeline is verified!\n');
  } else {
    console.log('\n💥 Some tests failed. See errors above.\n');
    process.exit(1);
  }
}

main();
