export const motionFlight = {
  progress: 0,
  active: false,
  enabled: false,
  ready: false,
};

export function resetMotionFlight() {
  motionFlight.progress = 0;
  motionFlight.active = false;
  motionFlight.enabled = false;
  motionFlight.ready = false;
}
