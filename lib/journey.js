// Camera stops and WebGL cluster depths follow the DOM section order.
export const CLUSTERS = {
  crystal: 0,
  about: -18,
  facts: -34,
  services: -50,
  approach: -66,
  stories: -82,
  mark: -98,
  recognition: -114,
  motion: -130,
  contact: -146,
};

export const STOPS = [
  { pos: [0, 0.25, 7.5], look: [0.9, 0, CLUSTERS.crystal] },
  { pos: [1.2, -0.3, -10], look: [0.7, 0, CLUSTERS.about] },
  { pos: [-1, 0.4, -26], look: [0.6, 0, CLUSTERS.facts] },
  { pos: [1.6, 0.5, -42], look: [0.6, 0, CLUSTERS.services] },
  { pos: [1.3, 0.4, -58], look: [0.5, 0, CLUSTERS.approach] },
  { pos: [1, 0.35, -74], look: [0.3, 0, CLUSTERS.stories] },
  { pos: [0, 0.7, -90], look: [0, 0.2, CLUSTERS.mark] },
  { pos: [1, 0.3, -106], look: [0.5, 0, CLUSTERS.recognition] },
  { pos: [-0.6, -0.15, -122], look: [0, 0, CLUSTERS.motion] },
  { pos: [0, 0, -138], look: [0, 0, CLUSTERS.contact] },
];

export const VOLUME = { near: 14, far: -162 };
