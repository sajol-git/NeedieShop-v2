import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  const missing = [];
  if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  throw new Error(`Supabase credentials are missing: ${missing.join(', ')}. Please check your environment variables in AI Studio Secrets.`);
}

// Ensure createClient is called with non-empty strings to avoid immediate errors
// but requests will still fail if keys are invalid.
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
