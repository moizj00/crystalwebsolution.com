import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Service-role client — bypasses RLS entirely. Server-only: never import
// this from a Client Component or expose SUPABASE_SERVICE_ROLE_KEY to the
// browser. Used for the public contact form (no session to attach a lead
// to) and for admin-side client-account creation.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
