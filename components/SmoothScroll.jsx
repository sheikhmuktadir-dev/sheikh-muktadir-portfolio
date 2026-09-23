"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Wraps the app in Lenis smooth scrolling.
 * Bails out entirely when the visitor prefers reduced motion.
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    // Dev escape hatch: ?nosmooth disables Lenis. Useful when screenshotting
    // or debugging scroll-position issues.
    if (new URLSearchParams(window.location.search).has("nosmooth")) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    let frame = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    });

    // Anchor links (#work, #about…) route through Lenis so they ease instead of jump.
    const onAnchorClick = (event) => {
      const link = event.target.closest?.('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -20 });
    };

    document.addEventListener("click", onAnchorClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
    };
  }, []);

  return children;
}
