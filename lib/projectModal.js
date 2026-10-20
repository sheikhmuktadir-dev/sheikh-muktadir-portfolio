"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny store for the project preview modal.
 *
 * Any trigger (the "View project" link, the mobile cover image, the pinned
 * phone) calls `openProject(index, triggerEl)`. <ProjectModal /> reads the
 * index with `useProjectIndex()` and hands focus back to the trigger on close.
 */

let index = -1;
let opener = null;
const subs = new Set();

const emit = () => subs.forEach((fn) => fn());

export function openProject(i, triggerEl = null) {
  index = i;
  opener = triggerEl;
  emit();
}

export function closeProject() {
  if (index === -1) return;
  index = -1;
  emit();
  const el = opener;
  opener = null;
  // Back to whatever opened it, so keyboard users keep their place.
  if (el && typeof el.focus === "function") {
    setTimeout(() => el.focus({ preventScroll: true }), 0);
  }
}

function subscribe(fn) {
  subs.add(fn);
  return () => subs.delete(fn);
}

const getSnapshot = () => index;
const getServerSnapshot = () => -1;

/** -1 when closed, otherwise the index into site.work. */
export function useProjectIndex() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
