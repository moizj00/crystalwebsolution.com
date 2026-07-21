import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { BEAT_IDS } from '../lib/beatProgress.js';
import { CLUSTERS, STOPS } from '../lib/journey.js';

const experienceSource = readFileSync(
  new URL('../components/Experience.jsx', import.meta.url),
  'utf8',
);
const sceneSource = readFileSync(
  new URL('../components/Scene.jsx', import.meta.url),
  'utf8',
);
const lightsSource = readFileSync(
  new URL('../components/three/Lights.jsx', import.meta.url),
  'utf8',
);

test('removed showcase section has no DOM, camera, or WebGL beat', () => {
  assert.doesNotMatch(experienceSource, /Showcase/);
  assert.doesNotMatch(sceneSource, /ShowcaseBoxes/);
  assert.doesNotMatch(lightsSource, /CLUSTERS\.showcase/);
  assert.equal(BEAT_IDS.includes('work'), false);
  assert.equal(Object.hasOwn(CLUSTERS, 'showcase'), false);
  assert.equal(STOPS.length, BEAT_IDS.length);
});
