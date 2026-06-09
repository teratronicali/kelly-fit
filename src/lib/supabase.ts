import { createClient } from '@supabase/supabase-js'

// Cliente compartido — usa una storageKey distinta al CRM para no pisar la sesión
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  { auth: { persistSession: true, storageKey: 'fitkelly-auth' } }
)
