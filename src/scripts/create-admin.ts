import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function createUser() {
  console.log('Creating admin user bypassing rate limits...');
  
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: 'naturewinsfarm@gmail.com',
    password: 'password123', // default password
    email_confirm: true,
    user_metadata: {
      full_name: 'Daniel Sodiya',
      role: 'ADMIN'
    }
  });

  if (error) {
    console.error('Failed to create auth user:', error.message);
    return;
  }
  
  console.log('Auth user created with ID:', data.user.id);
  
  // Ensure profile is created
  const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
    id: data.user.id,
    full_name: 'Daniel Sodiya',
    role: 'ADMIN',
    updated_at: new Date().toISOString()
  });
  
  if (profileError) {
    console.error('Profile creation error:', profileError.message);
  } else {
    console.log('✅ Admin user and profile created successfully!');
  }
}

createUser();
