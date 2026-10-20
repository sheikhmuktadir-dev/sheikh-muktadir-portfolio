/**
 * One scroll channel for the whole site.
 *
 * Why this exists: Lenis moves the page inside its own requestAnimationFrame
 * callback. The browser only fires the native `scroll` event at the START of
 * the NEXT frame, so anything listening on `window` updates one frame late —
 * the page paints at the new position while the sticky phone, the cursor arc
 * etc. still show the old one. On a 120Hz trackpad that reads as a faint
 * judder on everything scroll-linked.
 *
 * SmoothScroll calls `emitScroll()` synchronously from Lenis's own `scroll`
 * callback, so every subscriber runs in the SAME frame Lenis moved the page.
 * When Lenis is off (reduced motion, `?nosmooth`) the native listener below
 * carries it instead. Emits are de-duplicated by position, so the late native
 * event that follows a Lenis emit is ignored rather than doing the work twice.
 *
 * Subscribers should READ all geometry first and WRITE styles after, so one
 * emit costs at most one style/layout pass instead of one per write.
 */

const subscribers = new Set();
let lenisInstance = null;

/** SmoothScroll registers its Lenis instance here (null when disabled). */
export function setLenis(lenis) {
  lenisInstance = lenis;
}

/**
 * Freeze / release page scroll — used by overlays such as the project modal.
 * Stops Lenis when it is running and locks native overflow either way, so
 * wheel AND touch scrolling stay on the overlay.
 */
export function lockScroll(locked) {
  if (typeof document === "undefined") return;
  if (lenisInstance) {
    if (locked) lenisInstance.stop();
    else lenisInstance.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
let lastY = -1;
let nativeBound = false;

function run(force) {
  const y = window.scrollY;
  if (!force && y === lastY) return;
  lastY = y;
  subscribers.forEach((fn) => fn(y));
}

function onNative() {
  run(false);
}

function onResize() {
  // Geometry changed even though scrollY may not have: always run.
  run(true);
}

/** Called by SmoothScroll from inside Lenis's scroll callback. */
export function emitScroll() {
  run(false);
}

/**
 * Subscribe to scroll. `fn(scrollY)` runs once immediately, then on every
 * scroll position change and on resize. Returns an unsubscribe function.
 */
export function subscribeScroll(fn) {
  if (typeof window === "undefined") return () => {};
  if (!nativeBound) {
    nativeBound = true;
    window.addEventListener("scroll", onNative, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
  }
  subscribers.add(fn);
  fn(window.scrollY);
  return () => {
    subscribers.delete(fn);
  };
}
