'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

// Custom cursor: instant dot + trailing ring. Ring grows over
// links/buttons/[data-hover] and shows an optional label.
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const xDot = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power2.out' });
    const yDot = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power2.out' });
    const xRing = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3.out' });
    const yRing = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3.out' });

    const onMove = (e) => {
      xDot(e.clientX); yDot(e.clientY);
      xRing(e.clientX); yRing(e.clientY);
    };

    const onOver = (e) => {
      const t = e.target.closest('a, button, [data-hover]');
      const hoverLabel = t ? t.getAttribute('data-cursor') : null;
      if (t) {
        ring.current.classList.add('is-hover');
        if (hoverLabel && label.current) {
          label.current.textContent = hoverLabel;
          ring.current.classList.add('has-label');
        }
      } else {
        ring.current.classList.remove('is-hover', 'has-label');
        if (label.current) label.current.textContent = '';
      }
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerover', onOver);
    document.documentElement.classList.add('has-cursor');

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
      <div ref={ring} className="cursor-ring" aria-hidden="true">
        <span ref={label} className="cursor-label" />
      </div>
    </>
  );
}
