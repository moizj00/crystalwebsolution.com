// Per-frame scroll state. Written by SmoothScroll (Lenis tick),
// read every frame by CameraRig, Particles, Marquee, etc.
// Never lift this into React state — it changes dozens of times a second.
export const scrollState = { progress: 0, velocity: 0 };
