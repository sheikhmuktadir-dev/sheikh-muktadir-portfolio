"use client";

import { useEffect, useRef } from "react";
import { subscribeScroll } from "@/lib/scroll";

/**
 * The page-wide effects layer. One fixed, pointer-events:none surface that
 * sits ABOVE the content but BELOW the custom cursor, so nothing it draws can
 * ever intercept a click or push the page wide.
 *
 * It does three jobs:
 *
 *   1. Sheen      — a soft light that trails the pointer, composited in
 *                   `overlay` so it lifts the paper ground and glows on the
 *                   dark footer, without ever painting a visible blob.
 *   2. Burst      — a ring + sparks fired from every click. Drawn in
 *                   `difference` so it reads on light AND dark surfaces.
 *   3. Broadcast  — publishes `--fx-vel` (scroll speed, 0–1) to the elements
 *                   that read it: the RGB split on the giant wordmarks and the
 *                   glare across the phone.
 *
 * PERFORMANCE (2026-10-21): `--fx-vel` used to be written on <html> every
 * scroll frame. A custom property on the root is inherited by every element,
 * so each write invalidated style for the WHOLE document — the biggest single
 * cost on the page. It is now written only to the consumer elements, and only
 * while they are on screen. The old `--fx-progress` / dot-grid drift is gone
 * (it repainted a full-viewport blended layer every frame for ~3% of motion).
 *
 * Everything here is transform/opacity only and lives on its own layer, so it
 * cannot cause layout shift or a horizontal scrollbar at any width.
 */

// Elements that read --fx-vel. Keep in sync with fx.css.
const VEL_TARGETS = ".wordmark, .phone";

export default function FxLayer() {
  const layerRef = useRef(null);
  const sheenRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const layer = layerRef.current;

    /* ---------------------------------------------------------------- sheen */
    // Fine pointers only: on touch there is no cursor to follow, and the
    // blended layer would just cost a full-page composite for nothing.
    const fine = window.matchMedia("(pointer: fine)").matches && !reduced.matches;
    let raf = 0;
    let teardownSheen;

    if (fine) {
      const sheen = sheenRef.current;
      let tx = window.innerWidth / 2;
      let ty = window.innerHeight / 2;
      let cx = tx;
      let cy = ty;
      let seen = false;

      // Lerped rather than pinned to the cursor — the lag is what makes it
      // read as light spilling behind the pointer instead of a sticker. The
      // loop runs only while the light is still catching up, then sleeps;
      // the next pointermove wakes it.
      const loop = () => {
        cx += (tx - cx) * 0.11;
        cy += (ty - cy) * 0.11;
        sheen.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(
          1
        )}px, 0) translate(-50%, -50%)`;
        if (Math.abs(tx - cx) > 0.3 || Math.abs(ty - cy) > 0.3) {
          raf = requestAnimationFrame(loop);
        } else {
          raf = 0;
        }
      };

      const onMove = (event) => {
        tx = event.clientX;
        ty = event.clientY;
        if (!seen) {
          seen = true;
          sheen.style.opacity = "1";
        }
        if (!raf) raf = requestAnimationFrame(loop);
      };

      const hide = () => {
        seen = false;
        sheen.style.opacity = "0";
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", hide);
      window.addEventListener("blur", hide);

      teardownSheen = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", hide);
        window.removeEventListener("blur", hide);
      };
    }

    /* ---------------------------------------------------------------- burst */
    // Hard cap on live bursts. Without it a mashed mouse button can stack
    // hundreds of nodes on the layer.
    const MAX = 6;
    const SPARKS = 7;
    const live = new Set();

    const onDown = (event) => {
      if (reduced.matches) return;
      if (event.button !== undefined && event.button !== 0) return;

      if (live.size >= MAX) {
        const oldest = live.values().next().value;
        oldest.remove();
        live.delete(oldest);
      }

      const burst = document.createElement("span");
      burst.className = "fx-burst";
      burst.style.left = `${event.clientX}px`;
      burst.style.top = `${event.clientY}px`;

      const ring = document.createElement("span");
      ring.className = "fx-burst__ring";
      burst.appendChild(ring);

      for (let i = 0; i < SPARKS; i += 1) {
        const spark = document.createElement("span");
        spark.className = "fx-burst__spark";
        // Jittered so repeated clicks never draw the same star twice.
        const angle = (360 / SPARKS) * i + (Math.random() * 26 - 13);
        spark.style.setProperty("--a", `${angle}deg`);
        spark.style.setProperty("--d", `${26 + Math.random() * 34}px`);
        spark.style.setProperty("--t", `${0.5 + Math.random() * 0.25}s`);
        burst.appendChild(spark);
      }

      layer.appendChild(burst);
      live.add(burst);

      // Timer, not animationend: the longest spark decides the lifetime and a
      // backgrounded tab never fires the event, which would leak the node.
      window.setTimeout(() => {
        burst.remove();
        live.delete(burst);
      }, 900);
    };

    window.addEventListener("pointerdown", onDown, { passive: true });

    /* ------------------------------------------------------------ broadcast */
    // Only on-screen consumers get the variable; off-screen ones would cost a
    // style pass for nothing. They are reset to 0 as they leave, so they come
    // back at rest.
    const visible = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target);
          } else {
            visible.delete(entry.target);
            entry.target.style.removeProperty("--fx-vel");
          }
        }
      },
      { rootMargin: "120px 0px" }
    );
    document.querySelectorAll(VEL_TARGETS).forEach((el) => io.observe(el));

    const write = (value) => {
      visible.forEach((el) => el.style.setProperty("--fx-vel", value));
    };

    let last = window.scrollY;
    let vel = 0;
    let velRaf = 0;
    let lastWritten = "0";

    const settle = () => {
      // Decay toward rest so the value eases back down instead of snapping
      // to 0 the moment the wheel stops.
      vel *= 0.86;
      if (vel > 0.002) {
        const v = vel.toFixed(2);
        if (v !== lastWritten) {
          lastWritten = v;
          write(v);
        }
        velRaf = requestAnimationFrame(settle);
      } else {
        vel = 0;
        velRaf = 0;
        if (lastWritten !== "0") {
          lastWritten = "0";
          write("0");
        }
      }
    };

    const unsubscribe = subscribeScroll((y) => {
      const delta = Math.abs(y - last);
      last = y;
      if (reduced.matches) return;
      // ~90px of travel in one frame is full intensity. Capped at 1 so the
      // effects it drives can never run away on a flung trackpad.
      vel = Math.min(1, Math.max(vel, delta / 90));
      if (!velRaf) velRaf = requestAnimationFrame(settle);
    });

    return () => {
      teardownSheen?.();
      cancelAnimationFrame(velRaf);
      unsubscribe();
      io.disconnect();
      window.removeEventListener("pointerdown", onDown);
      live.forEach((node) => node.remove());
      live.clear();
      document
        .querySelectorAll(VEL_TARGETS)
        .forEach((el) => el.style.removeProperty("--fx-vel"));
    };
  }, []);

  return (
    <div className="fx-layer" ref={layerRef} aria-hidden="true">
      <div className="fx-sheen" ref={sheenRef} />
    </div>
  );
}
