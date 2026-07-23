'use client';

import { useState } from 'react';

export default function LogoutButton() {
  const [pending, setPending] = useState(false);

  const signOut = async () => {
    if (pending) return;
    setPending(true);
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    window.location.href = '/login';
  };

  return (
    <button type="button" className="dash-logout" onClick={signOut} disabled={pending}>
      {pending ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
