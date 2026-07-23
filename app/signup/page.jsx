'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SITE } from '../../lib/site';

export default function SignupPage() {
  const [values, setValues] = useState({ fullName: '', email: '', password: '' });
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
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok || !body.ok) {
        setState({ status: 'error', message: body.message || 'Sign-up failed. Try again.' });
        return;
      }

      if (body.confirmed) {
        window.location.href = body.redirectTo || '/dashboard';
        return;
      }

      setState({
        status: 'success',
        message: 'Check your email to confirm your account, then sign in.',
      });
    } catch {
      setState({ status: 'error', message: 'Could not reach the server. Check your connection and try again.' });
    }
  };

  const isSubmitting = state.status === 'submitting';
  const isDone = state.status === 'success';

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <p className="auth-eyebrow">{SITE.name}</p>
        <h1 className="auth-title">Create a client account</h1>
        <p className="auth-sub">
          Already talked to us about a project? Sign up with the same email and we&apos;ll link your
          account to it automatically once you confirm.
        </p>

        {isDone ? (
          <p className="auth-status auth-status--success" role="status">{state.message}</p>
        ) : (
          <form className="auth-form" onSubmit={submit} noValidate>
            <div className="auth-field">
              <label htmlFor="signup-name">Full name</label>
              <input
                id="signup-name"
                name="fullName"
                type="text"
                autoComplete="name"
                value={values.fullName}
                onChange={updateValue}
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={updateValue}
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={values.password}
                onChange={updateValue}
                required
              />
            </div>

            <button className="btn btn-solid auth-submit" type="submit" aria-disabled={isSubmitting}>
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>

            {state.message ? <p className="auth-status" role="alert">{state.message}</p> : null}
          </form>
        )}

        <p className="auth-footnote">
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
