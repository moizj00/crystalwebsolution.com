import test from 'node:test';
import assert from 'node:assert/strict';

const featureModule = await import('../lib/experienceFeatures.mjs').catch(() => ({}));
const layoutModule = await import('../lib/flyingCarouselLayout.mjs').catch(() => ({}));
const motionModule = await import('../lib/motionFlight.mjs').catch(() => ({}));
const studiesModule = await import('../lib/motionStudies.mjs').catch(() => ({}));

test('latest experience features default to the additive WebGL paths', () => {
  assert.equal(typeof featureModule.resolveExperienceFeatures, 'function');
  if (!featureModule.resolveExperienceFeatures) return;

  assert.deepEqual(
    featureModule.resolveExperienceFeatures({
      search: '',
      compact: false,
      reducedMotion: false,
      webgl: true,
    }),
    { heroMascot: true, flyingCarousel: true },
  );
});

test('legacy query mode restores both preserved implementations', () => {
  assert.equal(typeof featureModule.resolveExperienceFeatures, 'function');
  if (!featureModule.resolveExperienceFeatures) return;

  assert.deepEqual(
    featureModule.resolveExperienceFeatures({
      search: '?features=legacy',
      compact: false,
      reducedMotion: false,
      webgl: true,
    }),
    { heroMascot: false, flyingCarousel: false },
  );
});

test('compact and reduced-motion modes retain the SVG carousel fallback', () => {
  assert.equal(typeof featureModule.resolveExperienceFeatures, 'function');
  if (!featureModule.resolveExperienceFeatures) return;

  const compact = featureModule.resolveExperienceFeatures({
    search: '',
    compact: true,
    reducedMotion: false,
    webgl: true,
  });
  const reduced = featureModule.resolveExperienceFeatures({
    search: '',
    compact: false,
    reducedMotion: true,
    webgl: true,
  });

  assert.equal(compact.heroMascot, true);
  assert.equal(compact.flyingCarousel, false);
  assert.equal(reduced.heroMascot, true);
  assert.equal(reduced.flyingCarousel, false);
});

test('feature-specific query switches and missing WebGL fail closed', () => {
  assert.equal(typeof featureModule.resolveExperienceFeatures, 'function');
  if (!featureModule.resolveExperienceFeatures) return;

  assert.deepEqual(
    featureModule.resolveExperienceFeatures({
      search: '?hero=legacy',
      compact: false,
      reducedMotion: false,
      webgl: true,
    }),
    { heroMascot: false, flyingCarousel: true },
  );
  assert.deepEqual(
    featureModule.resolveExperienceFeatures({
      search: '',
      compact: false,
      reducedMotion: false,
      webgl: false,
    }),
    { heroMascot: false, flyingCarousel: false },
  );
});

test('carousel layout is deterministic and lands six 3:4 cards in a 3 by 2 grid', () => {
  assert.equal(typeof layoutModule.createFlyingCarouselLayout, 'function');
  if (!layoutModule.createFlyingCarouselLayout) return;

  const first = layoutModule.createFlyingCarouselLayout({ viewportWidth: 10 });
  const second = layoutModule.createFlyingCarouselLayout({ viewportWidth: 10 });

  assert.deepEqual(first, second);
  assert.equal(first.length, 6);
  assert.equal(layoutModule.CARD_WIDTH / layoutModule.CARD_HEIGHT, 3 / 4);
  assert.deepEqual([...new Set(first.map((card) => card.target.position[0]))].sort((a, b) => a - b).length, 3);
  assert.deepEqual([...new Set(first.map((card) => card.target.position[1]))].sort((a, b) => a - b).length, 2);
  for (const card of first) {
    assert.equal(card.target.position[2], 0);
    assert.deepEqual(card.target.rotation, [0, 0, 0]);
  }
  assert.ok(first.some((card) => Math.abs(card.scatter.position[2]) >= 4));
});

test('carousel transform sampling preserves exact scatter and grid endpoints', () => {
  assert.equal(typeof layoutModule.createFlyingCarouselLayout, 'function');
  assert.equal(typeof layoutModule.sampleFlyingCard, 'function');
  if (!layoutModule.createFlyingCarouselLayout || !layoutModule.sampleFlyingCard) return;

  const [card] = layoutModule.createFlyingCarouselLayout({ viewportWidth: 10 });

  assert.deepEqual(layoutModule.sampleFlyingCard(card, 0), card.scatter);
  assert.deepEqual(layoutModule.sampleFlyingCard(card, 1), card.target);

  const middle = layoutModule.sampleFlyingCard(card, 0.5);
  assert.ok(middle.position.every(Number.isFinite));
  assert.ok(middle.rotation.every(Number.isFinite));
  assert.ok(middle.scale > card.scatter.scale);
  assert.ok(middle.scale < card.target.scale);
});

test('shared motion studies preserve the six legacy study identities', () => {
  assert.ok(Array.isArray(studiesModule.MOTION_STUDIES));
  if (!Array.isArray(studiesModule.MOTION_STUDIES)) return;

  assert.equal(studiesModule.MOTION_STUDIES.length, 6);
  assert.deepEqual(
    studiesModule.MOTION_STUDIES.map((study) => study.id),
    ['signal', 'field', 'type', 'commerce', 'layers', 'motion'],
  );
});

test('motion flight state can be reset to the preserved SVG fallback', () => {
  assert.equal(typeof motionModule.resetMotionFlight, 'function');
  assert.ok(motionModule.motionFlight);
  if (!motionModule.resetMotionFlight || !motionModule.motionFlight) return;

  Object.assign(motionModule.motionFlight, {
    progress: 0.72,
    active: true,
    enabled: true,
    ready: true,
  });
  motionModule.resetMotionFlight();

  assert.deepEqual(motionModule.motionFlight, {
    progress: 0,
    active: false,
    enabled: false,
    ready: false,
  });
});
