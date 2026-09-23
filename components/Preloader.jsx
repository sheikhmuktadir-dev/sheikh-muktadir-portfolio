"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { INTRO_MS } from "@/lib/config";

const EASE = [0.76, 0, 0.24, 1];

/**
 * Intro counter. Locks scroll, counts 0 -> 100, then wipes away upward.
 * Timing lives in lib/config.js so the hero can wait for it.
 */
export default function Preloader({ name = "Portfolio" }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }

    document.body.style.overflow = "hidden";
    const runway = INTRO_MS - 400;
    const start = performance.now();
    let frame;

    // rAF drives the smooth count — but it does not fire at all in a tab that
    // is backgrounded or not compositing, so it can never be what dismisses
    // the overlay. It only animates the number.
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / runway);
      // ease-out so the number decelerates into 100
      const eased = 1 - Math.pow(1 - progress, 2.2);
      setCount(Math.round(eased * 100));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    // Timers keep running when rAF does not, so dismissal is guaranteed here.
    // Without this the intro hangs forever in a background tab.
    const finish = window.setTimeout(() => {
      setCount(100);
      setDone(true);
    }, INTRO_MS);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(finish);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  // The wrapper stays mounted for the life of the page so React always has a
  // stable parent to remove the overlay from. Unmounting straight out of
  // <body> races with anything else that injects there (the Next dev error
  // overlay, browser extensions) and throws "removeChild of null".
  return (
    <div className="preloader-layer">
      <AnimatePresence>
        {!done && (
          <motion.div
            key="preloader"
            className="preloader"
            // The panel itself no longer slides — the SLATS below carry the
            // exit. It only needs to stay mounted long enough for the last
            // column to clear, so it holds and fades on the tail end.
            exit={{ opacity: 1 }}
            transition={{ duration: 0.95, ease: EASE }}
          >
          {/* Five columns that pull up in sequence on exit, so the intro peels
              away like a set of shutters rather than one flat panel. They sit
              behind the counter and wordmark (z-index in fx.css), so the intro
              composition is unchanged — only how it leaves. */}
          <div className="fx-slats" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.span
                key={i}
                className="fx-slat"
                initial={{ y: "0%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-105%" }}
                transition={{
                  duration: 0.8,
                  ease: EASE,
                  delay: 0.05 + i * 0.07,
                }}
              />
            ))}
          </div>

          <motion.div className="preloader__mark" exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
            <span className="preloader__word">
              <motion.span
                style={{ display: "block" }}
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
              >
                {name}
              </motion.span>
            </span>
          </motion.div>

          <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
            <div className="preloader__bar-row">
              <span>Loading</span>
              <span className="preloader__count">{String(count).padStart(3, "0")}</span>
            </div>
            <div className="preloader__track">
              <motion.div
                className="preloader__fill"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: count / 100 }}
                transition={{ duration: 0.15, ease: "linear" }}
              />
            </div>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
