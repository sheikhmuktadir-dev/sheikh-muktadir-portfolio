"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { subscribeScroll } from "@/lib/scroll";

/**
 * Floating theme picker (light themes only).
 *
 * A fixed FAB (bottom-right, reachable from any section) that opens a panel of
 * accent swatches. The theme is a single `data-theme` attribute on <html> —
 * one of the ACCENTS ids — which theme.css turns into a full token
 * re-declaration. "mono" needs no attribute block (it's the base :root design),
 * but we still set the attribute so switching back from a colour resets cleanly.
 *
 * Dark mode was removed 2026-10-21 at the client's request. Don't re-add the
 * Light/Dark toggle or the `pf-mode` key.
 *
 * The initial value is applied before paint by the inline script in layout.js;
 * this component just mirrors it into React state and writes changes back to
 * <html> + localStorage.
 */

// `swatch` is the true brand colour — it MUST equal theme.css `--accent-ink`
// for that id so the dot and the site headlines match. `check` is the tick
// colour that reads on top of it.
export const ACCENTS = [
  { id: "mono",   label: "Default", swatch: "#141414", check: "#ffffff" },
  { id: "blue",   label: "Blue",    swatch: "#1d4ed8", check: "#ffffff" },
  { id: "green",  label: "Green",   swatch: "#15803d", check: "#ffffff" },
  { id: "orange", label: "Orange",  swatch: "#c2410c", check: "#ffffff" },
];

const VALID = new Set(ACCENTS.map((a) => a.id));

// Anything stored from the old system (violet/rose/gold, or a "-dark" value)
// falls back to the default rather than leaving a stale attribute behind.
const sanitize = (id) => (VALID.has(id) ? id : "mono");

function apply(accent) {
  document.documentElement.setAttribute("data-theme", accent);
  try {
    localStorage.setItem("pf-accent", accent);
    localStorage.removeItem("pf-mode");
  } catch {}
}

export default function ThemePicker() {
  const [open, setOpen] = useState(false);
  const [accent, setAccent] = useState("mono");
  const rootRef = useRef(null);

  // Adopt whatever the no-flash script already put on <html>.
  useEffect(() => {
    let a = "mono";
    try {
      a = sanitize(localStorage.getItem("pf-accent"));
    } catch {}
    setAccent(a);
    // Make sure the attribute matches (covers first-ever visit).
    document.documentElement.setAttribute("data-theme", a);
  }, []);

  // Phones: tuck the FAB away while scrolling down so it never covers the copy
  // being read; any upward scroll (or the top of the page) brings it back.
  // A class toggle on the root, not state, so scrolling never re-renders.
  const openRef = useRef(open);
  openRef.current = open;
  useEffect(() => {
    const phone = window.matchMedia("(max-width: 767px)");
    let last = window.scrollY;
    const unsubscribe = subscribeScroll((y) => {
      const dy = y - last;
      last = y;
      const root = rootRef.current;
      if (!root) return;
      if (!phone.matches || openRef.current || y < 120) {
        root.classList.remove("tp--tucked");
        return;
      }
      // Ignore sub-pixel jitter and momentum tails.
      if (Math.abs(dy) < 4) return;
      root.classList.toggle("tp--tucked", dy > 0);
    });
    return unsubscribe;
  }, []);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pickAccent = (id) => {
    setAccent(id);
    apply(id);
  };

  return (
    <div className="tp" ref={rootRef}>
      <AnimatePresence>
        {open && (
          <motion.div
            className="tp-panel"
            role="dialog"
            aria-label="Theme"
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="tp-panel__title">Theme</div>

            <div className="tp-swatches">
              {ACCENTS.map((a, i) => (
                <motion.button
                  key={a.id}
                  type="button"
                  className="tp-swatch"
                  style={{ "--sw": a.swatch, "--chk": a.check }}
                  data-active={accent === a.id}
                  data-cursor
                  aria-label={a.label}
                  title={a.label}
                  aria-pressed={accent === a.id}
                  onClick={() => pickAccent(a.id)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i + 0.04, duration: 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        className="tp-fab"
        data-cursor
        aria-expanded={open}
        aria-label="Change theme"
        onClick={() => setOpen((v) => !v)}
      >
        <PaletteIcon />
      </button>
    </div>
  );
}

/* --- Icon (inherits currentColor) ----------------------------------------- */

function PaletteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.36-.6-.36-.99 0-.83.67-1.5 1.5-1.5H16a5 5 0 0 0 5-5c0-4.42-4.03-8-9-8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="11" r="1.15" fill="currentColor" />
      <circle cx="10.5" cy="7.5" r="1.15" fill="currentColor" />
      <circle cx="14.5" cy="7.5" r="1.15" fill="currentColor" />
      <circle cx="17" cy="11" r="1.15" fill="currentColor" />
    </svg>
  );
}
