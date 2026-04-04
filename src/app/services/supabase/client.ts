import {createClient} from '@supabase/supabase-js';
import {PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL} from '@env';
import {logInfo} from '../api/logger';
import {supabaseAuthStorage} from '../../utils/storage/storage';

const url = PUBLIC_SUPABASE_URL?.trim() ?? '';
const key = PUBLIC_SUPABASE_KEY?.trim() ?? '';

if (!url || !key) {
  logInfo('Supabase env missing', {
    hint: 'Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_KEY in .env.local, then restart Metro with --reset-cache',
  });
}

export const supabase = createClient(url, key, {
  auth: {
    storage: supabaseAuthStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
});
