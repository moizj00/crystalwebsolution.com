import { createClient } from './server';

// Shared by the admin and client dashboard layouts: resolves the signed-in
// user's profile (role + company) alongside a request-scoped Supabase
// client so pages don't each re-derive it.
export async function getCurrentProfile() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null, supabase };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, full_name, company_id')
    .eq('id', user.id)
    .single();

  return { user, profile, supabase };
}
