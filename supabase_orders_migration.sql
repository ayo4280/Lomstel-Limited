-- Orders table for payment tracking
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES auth.users(id),
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  product_type TEXT NOT NULL CHECK (product_type IN ('WET', 'DRY')),
  quantity_kg NUMERIC NOT NULL,
  price_per_kg NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  payment_provider TEXT CHECK (payment_provider IN ('paystack', 'flutterwave')),
  payment_reference TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Buyers can create orders and view their own
CREATE POLICY "Buyers can create orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can view own orders"
ON public.orders FOR SELECT
USING (auth.uid() = buyer_id);

-- Admins can see and update all orders
CREATE POLICY "Admins can manage all orders"
ON public.orders FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('ADMIN', 'FARM_WORKER')
  )
);

-- Allow service role to update orders (for webhook verification)
CREATE POLICY "Service role can update orders"
ON public.orders FOR UPDATE
USING (true);

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
