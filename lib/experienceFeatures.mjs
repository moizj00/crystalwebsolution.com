export function resolveExperienceFeatures({
  search = '',
  compact = false,
  reducedMotion = false,
  webgl = true,
} = {}) {
  const params = new URLSearchParams(search);
  const legacyAll =
    params.get('features') === 'legacy' ||
    params.get('latestFeatures') === 'off';

  if (!webgl || legacyAll) {
    return { heroMascot: false, flyingCarousel: false };
  }

  const heroMascot = params.get('hero') !== 'legacy';
  const flyingCarousel =
    params.get('motion') !== 'legacy' &&
    !compact &&
    !reducedMotion;

  return { heroMascot, flyingCarousel };
}

export function readExperienceFeatures() {
  if (typeof window === 'undefined') {
    return { heroMascot: true, flyingCarousel: false };
  }

  return resolveExperienceFeatures({
    search: window.location.search,
    compact: window.matchMedia('(max-width: 767px)').matches,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    webgl: typeof window.WebGLRenderingContext !== 'undefined',
  });
}
