import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

console.log('Connecting to:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function applyMigration() {
  console.log('Applying migration via REST API...');

  const sql = `
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

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'Allow all for service role') THEN
        CREATE POLICY "Allow all for service role" ON public.leads FOR ALL USING (true) WITH CHECK (true);
      END IF;
    END $$;

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

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_tasks' AND policyname = 'Allow all for service role') THEN
        CREATE POLICY "Allow all for service role" ON public.ai_tasks FOR ALL USING (true) WITH CHECK (true);
      END IF;
    END $$;
  `;

  // Use the Supabase REST API to run raw SQL via the service role key
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({ query: sql })
  });

  // Alternative: try inserting a test row to check if table exists
  console.log('\nChecking if leads table is accessible...');
  const { data, error } = await supabase.from('leads').select('count').limit(1);
  
  if (error && error.code === 'PGRST205') {
    console.log('Table not found via REST. Trying direct SQL via Supabase client...');
    // The service role key should have full access. If PGRST205 persists, the table simply doesnt exist in THIS project.
    console.log('\n❌ The leads table does NOT exist in your app\'s Supabase project.');
    console.log('Project URL:', supabaseUrl);
    console.log('\nYou need to run the SQL migration manually in the Supabase SQL Editor for this project.');
    console.log('Go to: ', supabaseUrl.replace('https://', 'https://app.supabase.com/project/').replace('.supabase.co', '') + '/editor');
  } else if (error) {
    console.log('Error:', error.message);
  } else {
    console.log('✅ leads table is accessible! Count:', data);
  }
}

applyMigration();
