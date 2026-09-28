"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Two-part cursor: a dot that tracks 1:1 and a ring that lags on a spring.
 *
 * Any element can drive it:
 *   <a data-cursor>            -> ring grows
 *   <a data-cursor="View">     -> ring grows and shows the label
 */
export default function Cursor() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  const ring = { stiffness: 240, damping: 26, mass: 0.6 };
  const ringX = useSpring(x, ring);
  const ringY = useSpring(y, ring);

  const [label, setLabel] = useState("");
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  // The scroll-progress arc rides the same spring position as the ring, but
  // is drawn on its own element so the ring can scale/label independently.
  // Written straight to the SVG's stroke-dashoffset (no React state) so it
  // never re-renders the cursor tree while scrolling.
  const progRef = useRef(null);
  const arcRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // Circumference of the r=29 arc below; kept in sync with the SVG markup.
    const CIRC = 2 * Math.PI * 29;
    const prog = progRef.current;
    const arc = arcRef.current;
    let progRaf = 0;
    // Shared with the movement handlers below: true once the pointer has been
    // seen, false again on the way out. The arc reads it so it vanishes with
    // the ring rather than lingering after the cursor has left the window.
    let shown = false;

    const paintProgress = () => {
      progRaf = 0;
      if (!prog || !arc) return;
      const p = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--fx-progress")
      ) || 0;
      arc.style.strokeDasharray = `${CIRC}`;
      arc.style.strokeDashoffset = `${CIRC * (1 - p)}`;
      // The arc only earns its place once the visitor is actually moving down
      // the page AND the cursor is on screen — hidden at the very top so it
      // doesn't clutter the hero, and gone whenever the ring is gone.
      prog.classList.toggle("is-on", p > 0.01 && shown);
    };

    const onProgScroll = () => {
      if (!progRaf) progRaf = requestAnimationFrame(paintProgress);
    };

    paintProgress();
    window.addEventListener("scroll", onProgScroll, { passive: true });
    window.addEventListener("resize", onProgScroll);

    // Last known pointer position, kept in a ref-like local so the scroll
    // handler can re-test what is under the cursor without an event.
    const pos = { x: -200, y: -200 };

    const applyHit = (hit) => {
      setHovering(!!hit);
      setLabel(hit?.getAttribute("data-cursor") || "");
    };

    const onMove = (event) => {
      pos.x = event.clientX;
      pos.y = event.clientY;
      x.set(event.clientX);
      y.set(event.clientY);
      // Tracked in a local, not state: putting `visible` in the dep array
      // rebuilt every listener on each flip.
      if (!shown) {
        shown = true;
        setVisible(true);
        paintProgress(); // bring the arc back the instant the pointer returns
      }
    };

    const onOver = (event) => {
      const target = event.target instanceof Element ? event.target : null;
      applyHit(target?.closest("[data-cursor], a, button") || null);
    };

    // The pointer can sit still while content moves beneath it — scrolling,
    // the case-study swap, the sticky phone. No pointerover fires, so without
    // this the ring stays enlarged and labelled after the element has gone.
    const onScroll = () => {
      if (!shown) return;
      const el = document.elementFromPoint(pos.x, pos.y);
      applyHit(el?.closest?.("[data-cursor], a, button") || null);
    };

    // Reset everything on the way out, or the cursor returns mid-hover.
    const reset = () => {
      shown = false;
      setVisible(false);
      applyHit(null);
      paintProgress(); // drop the arc with the ring
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onProgScroll);
      window.removeEventListener("resize", onProgScroll);
      cancelAnimationFrame(progRaf);
      document.documentElement.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
    };
  }, [x, y]);

  // Labelled state is a pill sized by CSS (not a scaled-up circle), so it keeps
  // its natural scale; plain hover still swells the ring.
  const ringScale = label ? 1 : hovering ? 1.65 : 1;

  return (
    <>
      <motion.div
        className="cursor-dot"
        style={{ x, y }}
        animate={{ opacity: visible && !hovering ? 1 : 0, scale: hovering ? 0.4 : 1 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      />
      <motion.div
        className={`cursor-ring${label ? " is-labelled" : ""}`}
        style={{ x: ringX, y: ringY }}
        animate={{ opacity: visible ? 1 : 0, scale: ringScale }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        <span className="cursor-ring__label" style={{ fontSize: `${0.62 / ringScale}rem` }}>
          {label}
        </span>
      </motion.div>

      {/* Scroll-progress arc — same spring position as the ring, but its own
          layer so the ring's hover scale never distorts the circle. */}
      <motion.svg
        ref={progRef}
        className="fx-cursor-prog"
        viewBox="0 0 62 62"
        style={{ x: ringX, y: ringY }}
        aria-hidden="true"
      >
        <circle className="fx-cursor-prog__track" cx="31" cy="31" r="29" />
        <circle ref={arcRef} className="fx-cursor-prog__arc" cx="31" cy="31" r="29" />
      </motion.svg>
    </>
  );
}
