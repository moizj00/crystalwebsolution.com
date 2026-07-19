export const CARD_WIDTH = 1.125;
export const CARD_HEIGHT = 1.5;

const SCATTER = [
  { position: [-5.8, 3.4, -7.5], rotation: [-0.72, 0.58, -0.48], scale: 0.48 },
  { position: [4.9, 2.8, 4.8], rotation: [0.54, -0.8, 0.62], scale: 0.62 },
  { position: [-4.4, -3.8, 2.9], rotation: [0.84, 0.4, -0.76], scale: 0.54 },
  { position: [5.6, -3.1, -5.6], rotation: [-0.48, -0.64, 0.88], scale: 0.5 },
  { position: [-1.9, 4.7, 5.4], rotation: [0.66, 0.72, 0.36], scale: 0.58 },
  { position: [2.4, -4.6, -8.2], rotation: [-0.86, 0.52, -0.42], scale: 0.46 },
];

const clamp01 = (value) => Math.min(1, Math.max(0, value));

export function power4Out(value) {
  const t = clamp01(value);
  return 1 - (1 - t) ** 4;
}

export function createFlyingCarouselLayout({ viewportWidth = 10 } = {}) {
  const fit = Math.min(1, Math.max(0.72, viewportWidth / 10));
  const xGap = 1.56 * fit;
  const yGap = 1.94 * fit;

  return SCATTER.map((scatter, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);

    return {
      id: index,
      delay: index * 0.022,
      scatter: {
        position: [...scatter.position],
        rotation: [...scatter.rotation],
        scale: scatter.scale * fit,
      },
      target: {
        position: [(column - 1) * xGap, (0.5 - row) * yGap, 0],
        rotation: [0, 0, 0],
        scale: fit,
      },
    };
  });
}

function mix(a, b, progress) {
  return a + (b - a) * progress;
}

export function sampleFlyingCard(card, progress) {
  if (progress <= 0) return card.scatter;
  if (progress >= 1) return card.target;

  const delayed = clamp01((progress - card.delay) / (1 - card.delay));
  const eased = power4Out(delayed);

  return {
    position: card.scatter.position.map((value, index) =>
      mix(value, card.target.position[index], eased),
    ),
    rotation: card.scatter.rotation.map((value, index) =>
      mix(value, card.target.rotation[index], eased),
    ),
    scale: mix(card.scatter.scale, card.target.scale, eased),
  };
}
