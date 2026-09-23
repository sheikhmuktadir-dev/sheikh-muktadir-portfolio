"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\<>*+=_";

/**
 * Decodes its text in, one character at a time, like a terminal resolving.
 *
 * Deliberately only used on the MONOSPACE UI type (DM Mono labels, eyebrows,
 * indices, nav links). Every substituted glyph is exactly as wide as the one
 * it replaces there, so the line cannot reflow mid-animation — running this on
 * the proportional display type would jitter the layout while it resolved.
 *
 * `on="view"` decodes once when scrolled to; `on="hover"` replays on pointer
 * enter. The final string is always the real text, and the real text is what
 * assistive tech is given throughout.
 */
export default function Scramble({
  text = "",
  on = "view",
  className,
  speed = 34,
}) {
  const ref = useRef(null);
  const rafRef = useRef(0);
  const timerRef = useRef(0);
  const [out, setOut] = useState(text);

  // Keep the rendered string honest if the source text changes.
  useEffect(() => setOut(text), [text]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const stop = () => {
      window.clearInterval(timerRef.current);
      cancelAnimationFrame(rafRef.current);
    };

    const run = () => {
      stop();
      let frame = 0;
      const chars = [...text];
      // Each character gets its own settle frame, so the string resolves left
      // to right with a soft edge rather than all at once.
      const settle = chars.map((_, i) => i * 1.6 + Math.random() * 6);

      timerRef.current = window.setInterval(() => {
        frame += 1;
        let pending = false;
        const next = chars
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (frame >= settle[i]) return ch;
            pending = true;
            return GLYPHS[(Math.random() * GLYPHS.length) | 0];
          })
          .join("");
        setOut(next);
        if (!pending) {
          stop();
          setOut(text);
        }
      }, speed);
    };

    if (on === "hover") {
      const parent = el.closest("a, button") || el;
      parent.addEventListener("pointerenter", run);
      return () => {
        parent.removeEventListener("pointerenter", run);
        stop();
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        run();
      },
      { threshold: 0.6 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      stop();
    };
  }, [text, on, speed]);

  return (
    <span className={className} ref={ref}>
      {/* The scrambling copy is decorative; screen readers get the real word. */}
      <span aria-hidden="true">{out}</span>
      <span className="fx-sr">{text}</span>
    </span>
  );
}
