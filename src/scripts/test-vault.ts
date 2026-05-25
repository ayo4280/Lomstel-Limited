import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false }
});

async function runTest() {
  console.log('🚀 Starting Certificate Vault Storage Test...\n');

  try {
    // 1. Create a dummy file
    const dummyContent = 'This is a dummy certificate file generated for E2E testing.';
    const buffer = Buffer.from(dummyContent, 'utf-8');
    const fileName = `test_cert_${Date.now()}.txt`;
    const filePath = `documents/${fileName}`;

    console.log(`1️⃣  Uploading dummy file ${fileName} to 'certificates' bucket...`);
    const { error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(filePath, buffer, {
        contentType: 'text/plain',
        upsert: false
      });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
    console.log('✅ Upload successful!');

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('certificates')
      .getPublicUrl(filePath);
    
    console.log(`2️⃣  Public URL retrieved: ${publicUrl}`);

    // 3. Insert into Database
    console.log('3️⃣  Saving metadata to certificates table...');
    const { data, error: dbError } = await supabase
      .from('certificates')
      .insert({
        title: 'E2E Automated Test Certificate',
        type: 'Test',
        issued: new Date().toLocaleDateString(),
        expiry: 'Never',
        result: 'PASSED',
        file_url: publicUrl
      })
      .select()
      .single();

    if (dbError) throw new Error(`DB Insert failed: ${dbError.message}`);
    console.log(`✅ DB Record created! ID: ${data.id}`);
    
    console.log('\n🏆 Vault Storage Test Passed Successfully!');
  } catch (error: any) {
    console.error('\n❌ Test Failed:', error.message);
    process.exitCode = 1;
  }
}

runTest();
