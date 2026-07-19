'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Magnetic from './Magnetic';
import Menu from './Menu';

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="nav">
        <Link href="/" className="nav-logo" data-cursor="Home">
          <Image
            className="nav-logo-image"
            src="/cws-header-logo.png"
            alt="CWS — Crystal Web Solutions. Empower your vision through technology."
            width={1000}
            height={382}
            sizes="(max-width: 767px) 64vw, (max-width: 1260px) 31vw, 390px"
            priority
          />
        </Link>
        <div className="nav-right">
          <Magnetic>
            <a href="/#contact" className="btn btn-ghost" data-cursor="Say hi">
              Start a project
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
