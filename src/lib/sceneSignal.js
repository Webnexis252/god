// Shared load state of the hero 3D scene, so the entrance preloader can track
// the real thing instead of running on a timer.

let progress = 0;
let settled = false;
const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener({ progress, settled }));
}

export function reportSceneProgress(value) {
  if (settled) {
    return;
  }

  progress = Math.max(progress, Math.min(value, 1));
  emit();
}

// Settled means the hero is in its final state: the scene is on screen, or it
// was skipped or failed and the poster is standing in for it.
export function reportSceneSettled() {
  settled = true;
  progress = 1;
  emit();
}

export function subscribeToScene(listener) {
  listeners.add(listener);
  listener({ progress, settled });

  return () => {
    listeners.delete(listener);
  };
}
