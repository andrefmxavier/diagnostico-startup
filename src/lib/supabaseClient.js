import { createClient } from '@supabase/supabase-js';

// As credenciais vêm de variáveis de ambiente (veja .env.example).
// Sem elas, `supabase` fica null e os módulos devem funcionar sem persistência.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export const isSupabaseConfigured = Boolean(supabase);
