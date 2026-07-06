'use client';

import { useRef, useEffect, createElement } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01';

// Headlines resolve from cipher to clarity, locking left-to-right.
export default function DecodeText({
  text,
  as = 'h2',
  className = '',
  speed = 0.035,
  delay = 0,
  start = 'top 85%',
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const split = new SplitType(el, { types: 'chars' });
    const chars = split.chars || [];
    const finals = chars.map((c) => c.textContent);
    let raf = 0;
    let trigger;

    const run = () => {
      gsap.fromTo(
        chars,
        { opacity: 0, yPercent: 40 },
        { opacity: 1, yPercent: 0, duration: 0.5, stagger: speed, delay, ease: 'power2.out' }
      );
      const startTime = performance.now() + delay * 1000;
      const perChar = speed * 1000;
      const scramble = (now) => {
        const elapsed = now - startTime;
        let done = true;
        for (let i = 0; i < chars.length; i++) {
          const lockAt = i * perChar + 220;
          if (elapsed < lockAt) {
            done = false;
            if (elapsed > 0 && finals[i].trim()) {
              chars[i].textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0];
            }
          } else {
            chars[i].textContent = finals[i];
          }
        }
        if (!done) raf = requestAnimationFrame(scramble);
      };
      raf = requestAnimationFrame(scramble);
    };

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      run();
    } else {
      trigger = ScrollTrigger.create({ trigger: el, start, once: true, onEnter: run });
    }

    return () => {
      cancelAnimationFrame(raf);
      if (trigger) trigger.kill();
      split.revert();
    };
  }, [text, speed, delay, start]);

  return createElement(as, { ref, className: `decode ${className}` }, text);
}
