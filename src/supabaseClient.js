import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cbfbgsmsvfmpfhdmgpyo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_allHunqunLZpq7--x5rsEg_t3ZY8Yse';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
