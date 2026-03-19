import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', 'shadikulislamsajol@gmail.com');
    
  console.log('User Data:', userData);
  console.log('User Error:', userError);
}

test();
