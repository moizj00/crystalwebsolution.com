'use client';

import { useEffect, useState } from 'react';
import { readRenderQuality } from './renderQuality.mjs';

export function useRenderQuality() {
  const [quality, setQuality] = useState(() => readRenderQuality());

  useEffect(() => {
    const compact = window.matchMedia('(max-width: 767.5px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    let resizeTimeout;
    const update = () => {
      const next = readRenderQuality();
      setQuality((current) => (current === next ? current : next));
    };

    // Debounce resize events to avoid thrashing re-renders during window drag
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(update, 250);
    };

    update();
    compact.addEventListener('change', update);
    reduced.addEventListener('change', update);
    connection?.addEventListener?.('change', update);
    window.addEventListener('resize', debouncedResize, { passive: true });
    
    return () => {
      clearTimeout(resizeTimeout);
      compact.removeEventListener('change', update);
      reduced.removeEventListener('change', update);
      connection?.removeEventListener?.('change', update);
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  return quality;
}
