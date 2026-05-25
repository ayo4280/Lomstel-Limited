-- ======================================================
-- LOMSTEL DATABASE SETUP (PROFILES + CERTIFICATES)
-- ======================================================

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT CHECK (role IN ('ADMIN', 'FARM_WORKER', 'BUYER')) DEFAULT 'BUYER',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- 2. Create certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on certificates
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Certificates Policies
CREATE POLICY "Everyone can view certificates" 
ON public.certificates FOR SELECT 
USING (true);

CREATE POLICY "Admins and Farm Workers can insert certificates" 
ON public.certificates FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('ADMIN', 'FARM_WORKER')
  )
);

-- 3. Create the storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Storage Policies for 'certificates' bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'certificates' );

CREATE POLICY "Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'certificates' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('ADMIN', 'FARM_WORKER')
  )
);
