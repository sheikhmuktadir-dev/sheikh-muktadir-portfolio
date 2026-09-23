"use client";

import { useCallback, useRef } from "react";

/**
 * Pointer-reactive 3D tilt for a card.
 *
 * Returns props to spread on the element. It writes CSS custom properties
 * (--tx / --ty / --gx / --gy) straight to the node rather than going through
 * React state — a tilt that re-rendered on every pointermove would be the
 * most expensive thing on the page.
 *
 * Mouse only: a touch "hover" would leave the card stuck at an angle after the
 * finger lifts, and coarse pointers get the marquee treatment instead anyway.
 */
export default function useTilt({ max = 9 } = {}) {
  const raf = useRef(0);

  const onPointerMove = useCallback(
    (event) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      const node = event.currentTarget;
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;

      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        node.style.setProperty("--ty", `${(px - 0.5) * 2 * max}deg`);
        node.style.setProperty("--tx", `${(0.5 - py) * 2 * max}deg`);
        node.style.setProperty("--gx", `${px * 100}%`);
        node.style.setProperty("--gy", `${py * 100}%`);
      });
    },
    [max]
  );

  const onPointerLeave = useCallback((event) => {
    const node = event.currentTarget;
    cancelAnimationFrame(raf.current);
    node.style.setProperty("--tx", "0deg");
    node.style.setProperty("--ty", "0deg");
  }, []);

  return { onPointerMove, onPointerLeave, className: "fx-tilt" };
}
