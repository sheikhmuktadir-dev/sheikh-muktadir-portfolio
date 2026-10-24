// Length of the intro/preloader sequence in ms.
// Hero animations wait for this so they don't play behind the loader.
export const INTRO_MS = 2000;

// The intro plays once per tab session. The head script in layout.js sets
// <html data-intro="seen"> before first paint on later loads, which hides the
// overlay in CSS (no flash) and lets the entrances start straight away.
export const INTRO_SEEN_KEY = "pf-intro";

let introDone = false;

/** Preloader calls this as it leaves, so anything that mounts later
 *  (the banner pills when you scroll back up) doesn't wait out a 2s intro
 *  that has already finished. */
export function markIntroDone() {
  introDone = true;
}

/** Delay the entrance animations should wait for: INTRO_MS, or 0 once over. */
export function introMs() {
  if (typeof document === "undefined") return INTRO_MS;
  if (introDone || document.documentElement.dataset.intro === "seen") return 0;
  return INTRO_MS;
}
