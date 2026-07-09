// The camera journey is declarative data.
// STOPS: one per DOM section (Hero, Services, Approach, Showcase, Stories,
// Mark, About, Facts, Recognition, Motion, Contact).
// A stop's scroll progress comes from lib/beatProgress.js (measured DOM
// section positions), not a uniform index/(N-1) share of the page — see
// that file for why.
// CLUSTERS: named anchor depths so 3D objects are authored at the exact z
// the camera flies to. Edit STOPS and CLUSTERS together.

export const CLUSTERS = {
  crystal: 0,
  services: -18,
  approach: -27,
  showcase: -36,
  stories: -52,
  mark: -68,
  about: -84,
  facts: -98,
  recognition: -105,
  motion: -112,
  contact: -128,
};

export const STOPS = [
  // Off-axis: Hero copy moves to a left column (see .hero-off-axis in
  // globals.css); the look target nudges right so the crystal frames
  // beside the text instead of dead behind it.
  { pos: [0, 0.25, 7.5], look: [0.9, 0, CLUSTERS.crystal] },
  // Off-axis: Services text runs left, so the look target nudges right,
  // framing the orbiting crystal beside the copy rather than behind it.
  { pos: [1.6, 0.5, -10], look: [0.6, 0, CLUSTERS.services] },
  // Off-axis, same idiom as Services — Approach is another numbered-row
  // beat, so it gets the same left-text / right-object treatment. Camera
  // trails ~8-9 units ahead of CLUSTERS.approach, matching the offset
  // every other stop uses (it approaches the depth, doesn't sit on it).
  { pos: [1.3, 0.4, -19], look: [0.5, 0, CLUSTERS.approach] },
  { pos: [-1.4, 0.2, -28], look: [0.4, 0, CLUSTERS.showcase] },
  // Stories is a centered beat (testimonial tabs, no two-column text-plate),
  // so the look target stays close to on-axis.
  { pos: [1.0, 0.35, -44], look: [0.3, 0, CLUSTERS.stories] },
  { pos: [0, 0.7, -60], look: [0, 0.2, CLUSTERS.mark] },
  // Off-axis: About's left column of text, object weighted right.
  { pos: [1.2, -0.3, -76], look: [0.7, 0, CLUSTERS.about] },
  // Off-axis: Facts grid reads center-left, nudge object right of the cards.
  { pos: [-1.0, 0.4, -90], look: [0.6, 0, CLUSTERS.facts] },
  // Off-axis, same idiom as Facts/Approach — Recognition is a named list
  // read left, medal ring floats right of the copy.
  { pos: [1.0, 0.3, -97], look: [0.5, 0, CLUSTERS.recognition] },
  // Motion is a centered spectacle beat like Mark — the shearing headline
  // itself is the show, so the camera stays close to on-axis.
  { pos: [-0.6, -0.15, -104], look: [0, 0, CLUSTERS.motion] },
  { pos: [0, 0, -120], look: [0, 0, CLUSTERS.contact] },
];

// Depth span the particle field scatters across.
export const VOLUME = { near: 14, far: -140 };
