import {createClient} from '@supabase/supabase-js';
import {PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL} from '@env';
import {supabaseSecureAuthStorage} from '../../auth/secureSupabaseStorage';
import {logInfo} from '../api/logger';

const url = PUBLIC_SUPABASE_URL?.trim() ?? '';
const key = PUBLIC_SUPABASE_KEY?.trim() ?? '';

export function isSupabaseConfigured(): boolean {
  return url.length > 0 && key.length > 0;
}

if (!url || !key) {
  logInfo('Supabase env missing', {
    hint: 'Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_KEY in .env.local, then restart Metro with --reset-cache',
  });
}

export const supabase = createClient(url, key, {
  auth: {
    storage: supabaseSecureAuthStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
});
