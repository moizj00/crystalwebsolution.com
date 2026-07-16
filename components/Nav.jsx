'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SITE } from '../lib/site';
import Magnetic from './Magnetic';
import Menu from './Menu';

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="nav">
        <Link href="/" className="nav-logo" data-cursor="Home">
          <svg className="nav-logo-mark" viewBox="0 0 40 40" aria-hidden="true">
            <polygon points="20,2 36,14 30,38 10,38 4,14" fill="none" stroke="var(--cyan)" strokeWidth="1.5" />
            <polygon points="20,2 36,14 20,20" fill="var(--cyan)" fillOpacity="0.4" />
            <polygon points="4,14 20,20 10,38" fill="var(--blue)" fillOpacity="0.35" />
            <polygon points="36,14 30,38 20,20" fill="var(--violet)" fillOpacity="0.3" />
          </svg>
          <span className="nav-logo-text">
            <strong>{SITE.short}</strong>
            <span className="nav-logo-sub">{SITE.name}</span>
          </span>
        </Link>
        <div className="nav-right">
          <Magnetic>
            <a href="/#contact" className="btn btn-ghost" data-cursor="Say hi">
              let&apos;s talk
            </a>
          </Magnetic>
          <Magnetic>
            <button
              className={`nav-burger ${open ? 'is-open' : ''}`}
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              data-cursor={open ? 'Close' : 'Menu'}
            >
              <span />
              <span />
            </button>
          </Magnetic>
        </div>
      </header>
      <Menu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
