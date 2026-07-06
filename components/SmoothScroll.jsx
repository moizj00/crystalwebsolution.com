'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollState } from '../lib/scrollState';

gsap.registerPlugin(ScrollTrigger);

// The conductor: one Lenis instance, driven by gsap.ticker (one RAF clock).
// Every Lenis scroll event updates ScrollTrigger AND the scrollState singleton.
export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      lerp: 0.1,
      smoothWheel: true,
    });

    const onScroll = ({ progress, velocity }) => {
      scrollState.progress = progress;
      scrollState.velocity = velocity * 1000;
      ScrollTrigger.update();
    };
    lenis.on('scroll', onScroll);

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Upgrade in-page anchors to animated scrolls.
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"], a[href^="/#"]');
      if (!a) return;
      const hash = a.getAttribute('href').replace('/', '');
      const el = document.querySelector(hash);
      if (el && window.location.pathname === '/') {
        e.preventDefault();
        lenis.scrollTo(el, { offset: 0, duration: 1.6 });
      }
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(tick);
      lenis.off('scroll', onScroll);
      lenis.destroy();
    };
  }, []);

  return children;
}
