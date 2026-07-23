import { NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: 'The sign-up request could not be read.' }, { status: 400 });
  }

  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!fullName) {
    return NextResponse.json({ ok: false, message: 'Enter your full name.' }, { status: 400 });
  }
  if (!email || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ ok: false, message: 'Enter a valid email address.' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ ok: false, message: 'Password must be at least 8 characters.' }, { status: 400 });
  }

  const supabase = createClient();

  // Public self-signup always lands as role 'client' (the handle_new_user
  // trigger defaults to it) with no company_id in metadata — the trigger
  // separately tries to auto-link the account to a company by matching this
  // email against an existing contacts row, but only once the address is
  // confirmed, so nobody can claim a company by typing an email they don't
  // control.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    const message = error.message === 'User already registered'
      ? 'An account with this email may already exist. Try signing in instead.'
      : 'Could not create the account. Check your details and try again.';
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }

  if (data.session) {
    // Email confirmation is disabled on this project — the session is
    // already usable, so route straight in like the login flow does.
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();
    const redirectTo = profile?.role === 'admin' || profile?.role === 'staff' ? '/admin' : '/dashboard';
    return NextResponse.json({ ok: true, confirmed: true, redirectTo });
  }

  return NextResponse.json({ ok: true, confirmed: false });
}
