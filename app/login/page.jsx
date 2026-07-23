'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SITE } from '../../lib/site';

export default function LoginPage() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [state, setState] = useState({ status: 'idle', message: '' });

  const updateValue = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (state.status === 'error') setState({ status: 'idle', message: '' });
  };

  const submit = async (event) => {
    event.preventDefault();
    if (state.status === 'submitting') return;

    setState({ status: 'submitting', message: '' });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok || !body.ok) {
        setState({ status: 'error', message: body.message || 'Sign-in failed. Try again.' });
        return;
      }

      const next = new URLSearchParams(window.location.search).get('next');
      window.location.href = next && next.startsWith('/') ? next : body.redirectTo || '/dashboard';
    } catch {
      setState({ status: 'error', message: 'Could not reach the server. Check your connection and try again.' });
    }
  };

  const isSubmitting = state.status === 'submitting';

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <p className="auth-eyebrow">{SITE.name}</p>
        <h1 className="auth-title">Client &amp; team sign-in</h1>
        <p className="auth-sub">Sign in to view your project status or manage the pipeline.</p>

        <form className="auth-form" onSubmit={submit} noValidate>
          <div className="auth-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={updateValue}
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={values.password}
              onChange={updateValue}
              required
            />
          </div>

          <button className="btn btn-solid auth-submit" type="submit" aria-disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>

          {state.message ? (
            <p className="auth-status" role="alert">{state.message}</p>
          ) : null}
        </form>

        <p className="auth-footnote">
          Don&apos;t have an account yet? <Link href="/signup">Create one</Link>, or ask your project
          contact at {SITE.name} to set one up — <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </div>
    </main>
  );
}
