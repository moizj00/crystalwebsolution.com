import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// Server Component / Route Handler / Server Action Supabase client — reads
// the session from request cookies and is subject to RLS as that user.
// Writing cookies only succeeds from a Server Action or Route Handler;
// Server Components are read-only, which is fine since middleware.js is
// what actually keeps the session refreshed.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component render — no-op.
          }
        },
      },
    },
  );
}
