import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/schemas';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
