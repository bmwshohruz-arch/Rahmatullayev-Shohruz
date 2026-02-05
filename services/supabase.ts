
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://myzpaqttyapfphzwniqz.supabase.co';
const supabaseAnonKey = 'sb_publishable_OWzjZHyOzCTe_N_eGfkLRQ_MzInCbVd';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
