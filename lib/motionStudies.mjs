export const MOTION_STUDIES = [
  {
    id: 'web-design',
    title: 'WEB / 01',
    subtitle: 'Responsive web design',
    color: '#ff5b35',
    path: 'M -240 690 C 80 650 180 150 520 235 S 980 120 1180 245 C 920 360 610 260 330 275',
  },
  {
    id: 'development',
    title: 'BUILD / 02',
    subtitle: 'Next.js development',
    color: '#b9ff42',
    path: 'M -180 760 C 150 720 290 230 610 310 S 1050 180 1260 315 C 980 420 790 300 720 275',
  },
  {
    id: 'brand',
    title: 'BRAND / 03',
    subtitle: 'Identity systems',
    color: '#ff8dd1',
    path: 'M -100 820 C 240 770 380 300 720 390 S 1140 240 1340 375 C 1190 430 1130 330 1110 275',
  },
  {
    id: 'motion',
    title: 'MOTION / 04',
    subtitle: 'Scroll interactions',
    color: '#63d9ff',
    path: 'M -300 880 C 90 810 260 380 620 470 S 1020 300 1260 455 C 940 540 580 500 330 590',
  },
  {
    id: 'ai-automation',
    title: 'AI / 05',
    subtitle: 'Task automation',
    color: '#9678ff',
    path: 'M -210 940 C 170 860 360 430 730 520 S 1120 360 1370 525 C 1080 620 830 530 720 590',
  },
  {
    id: 'workflow-automation',
    title: 'FLOW / 06',
    subtitle: 'Connected workflows',
    color: '#ffc64a',
    path: 'M -100 990 C 260 900 430 500 820 595 S 1220 420 1450 610 C 1310 690 1180 600 1110 590',
  },
];

const REVEAL_START = 0.08;
const REVEAL_STAGGER = 0.018;
const REVEAL_DURATION = 0.07;
const ORBIT_END = 0.55;
const ORBIT_STAGGER = 0.01;
const SETTLE_START = 0.72;
const SETTLE_STAGGER = 0.018;
const SETTLE_DURATION = 0.1;

// Keep every study on the same scroll-controlled clock, but offset its
// readable entrance and landing. Fixed per-card windows prevent later cards
// from accelerating just because they start later in the sequence.
export function createMotionStudyTiming(index) {
  const revealStart = REVEAL_START + index * REVEAL_STAGGER;
  const revealEnd = revealStart + REVEAL_DURATION;
  const orbitEnd = ORBIT_END + index * ORBIT_STAGGER;
  const settleStart = SETTLE_START + index * SETTLE_STAGGER;
  const settleEnd = settleStart + SETTLE_DURATION;

  return {
    revealStart,
    revealEnd,
    orbitEnd,
    settleStart,
    settleEnd,
    motionKeyTimes: [0, revealStart, orbitEnd, settleStart, settleEnd, 1].join(';'),
    opacityKeyTimes: [0, revealStart, revealEnd, settleStart, settleEnd, 1].join(';'),
  };
}
