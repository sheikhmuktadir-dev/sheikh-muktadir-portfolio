"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Floating theme picker.
 *
 * A fixed FAB (bottom-right, reachable from any section) that opens a panel of
 * accent swatches + a light/dark toggle. The theme is a single `data-theme`
 * attribute on <html> — "<accent>" for light, "<accent>-dark" for dark — which
 * theme.css turns into a full token re-declaration. "mono" light needs no
 * attribute block (it's the base :root design), but we still set the attribute
 * so switching back from a dark/colour theme resets cleanly.
 *
 * The initial value is applied before paint by the inline script in layout.js;
 * this component just mirrors it into React state and writes changes back to
 * <html> + localStorage.
 */

// `swatch` is the true brand colour; `check` is the tick colour that reads on
// top of it (the neon lime needs a dark tick, the rest take white).
const ACCENTS = [
  { id: "mono",   label: "Default", swatch: "#141414", check: "#ffffff" },
  { id: "violet", label: "Violet",  swatch: "#7c5cff", check: "#ffffff" },
  { id: "rose",   label: "Rose",    swatch: "#f43f5e", check: "#ffffff" },
  { id: "gold",   label: "Gold",    swatch: "#cf9a2e", check: "#ffffff" },
];

const themeAttr = (accent, mode) =>
  mode === "dark" ? `${accent}-dark` : accent;

function apply(accent, mode) {
  document.documentElement.setAttribute("data-theme", themeAttr(accent, mode));
  try {
    localStorage.setItem("pf-accent", accent);
    localStorage.setItem("pf-mode", mode);
  } catch {}
}

export default function ThemePicker() {
  const [open, setOpen] = useState(false);
  const [accent, setAccent] = useState("mono");
  const [mode, setMode] = useState("light");
  const rootRef = useRef(null);

  // Adopt whatever the no-flash script already put on <html>.
  useEffect(() => {
    let a = "mono";
    let m = "light";
    try {
      a = localStorage.getItem("pf-accent") || "mono";
      m = localStorage.getItem("pf-mode") || "light";
    } catch {}
    setAccent(a);
    setMode(m);
    // Make sure the attribute matches (covers first-ever visit).
    document.documentElement.setAttribute("data-theme", themeAttr(a, m));
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
    apply(id, mode);
  };
  const pickMode = (m) => {
    setMode(m);
    apply(accent, m);
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
                  aria-pressed={accent === a.id}
                  onClick={() => pickAccent(a.id)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i + 0.04, duration: 0.3 }}
                />
              ))}
            </div>

            <div className="tp-mode" data-mode={mode}>
              <span className="tp-mode__thumb" aria-hidden />
              <button
                type="button"
                className="tp-mode__opt"
                data-on={mode === "light"}
                data-cursor
                onClick={() => pickMode("light")}
              >
                <SunIcon /> Light
              </button>
              <button
                type="button"
                className="tp-mode__opt"
                data-on={mode === "dark"}
                data-cursor
                onClick={() => pickMode("dark")}
              >
                <MoonIcon /> Dark
              </button>
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

/* --- Icons (inherit currentColor) ----------------------------------------- */

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

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
