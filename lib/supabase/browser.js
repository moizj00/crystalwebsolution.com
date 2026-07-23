import { createBrowserClient } from '@supabase/ssr';

// Client-component Supabase client — subject to RLS as the signed-in user.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
