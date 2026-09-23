"use client";

import { useEffect, useRef, useState } from "react";

// Stat values in data/site.js are written the way they should READ —
// "1.4s", "-45%", "120+", "4.7★", "60fps". Split off the number so it can be
// counted up while the prefix and suffix stay exactly as authored.
const PARTS = /^([^\d-]*-?)?([\d]+(?:\.[\d]+)?)(.*)$/;

/**
 * Counts a stat up to its value the first time it scrolls into view.
 *
 * Renders a plain <span> with the SAME final string the data provides, so
 * nothing about the layout or the copy changes — only how it arrives. A value
 * with no number in it (or reduced motion) is printed straight through.
 */
export default function Counter({ value = "", className, duration = 1100 }) {
  const ref = useRef(null);
  const match = typeof value === "string" ? value.match(PARTS) : null;
  const [text, setText] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const [, prefix = "", digits, suffix = ""] = match;
    const target = parseFloat(digits);
    // Count in the same precision the author wrote, so "1.4s" never flickers
    // through "1.37s" and "96" never shows a decimal point.
    const dp = digits.includes(".") ? digits.split(".")[1].length : 0;

    let raf = 0;
    let start = 0;
    let done = false;

    const tick = (now) => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setText(`${prefix}${(target * eased).toFixed(dp)}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setText(value); // land on the authored string, exactly
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || done) return;
        done = true;
        io.disconnect();
        setText(`${prefix}${(0).toFixed(dp)}${suffix}`);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 }
    );

    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // `value` is the whole input; match is derived from it.
  }, [value, duration]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span className={className} ref={ref}>
      {text}
    </span>
  );
}
