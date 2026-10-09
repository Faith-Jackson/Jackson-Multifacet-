import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);

// Provide dummy values to prevent 'supabaseUrl is required' error during initialization
// It won't actually be used to make requests unless hasSupabase is true.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
