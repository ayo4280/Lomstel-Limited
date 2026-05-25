-- AI AGENT TABLES - Run this in your Supabase SQL Editor
-- Project: https://supabase.com/dashboard/project/ejmaotssmwjslvpuseny/editor

-- 1. Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  contact_info TEXT,
  location TEXT,
  source_url TEXT,
  status TEXT DEFAULT 'New',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all" ON public.leads;
CREATE POLICY "Allow all" ON public.leads FOR ALL USING (true) WITH CHECK (true);

-- 2. Create ai_tasks table
CREATE TABLE IF NOT EXISTS public.ai_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_name TEXT NOT NULL,
  status TEXT NOT NULL,
  leads_found INTEGER DEFAULT 0,
  logs TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.ai_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all" ON public.ai_tasks;
CREATE POLICY "Allow all" ON public.ai_tasks FOR ALL USING (true) WITH CHECK (true);

-- 3. Reload schema cache
NOTIFY pgrst, 'reload schema';
