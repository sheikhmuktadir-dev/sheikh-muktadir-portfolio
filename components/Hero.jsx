"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { site } from "@/data/site";
import { INTRO_MS } from "@/lib/config";

const EASE = [0.22, 1, 0.36, 1];

/**
 * The banner: headline top-left, short intro under it, and the oversized
 * condensed word bleeding off the bottom edge. The phone that overlaps this
 * section lives in <PhoneRail /> so it can stay sticky past the banner.
 */
export default function Hero() {
  const base = INTRO_MS / 1000;
  const wordmarkRef = useRef(null);

  // Size the wordmark so it fills the container exactly.
  //
  // A fixed vw font-size fills a different fraction for every name length —
  // "Robert" reached 91%, a shorter name leaves a gap and a longer one
  // overflows and gets clipped. Measuring the real glyph width and solving for
  // the font-size makes it edge-to-edge whatever the name is.
  useEffect(() => {
    const el = wordmarkRef.current;
    if (!el) return;

    const fit = () => {
      const box = el.closest(".hero");
      if (!box) return;
      // Near-full container width with a real safety margin (20px each side).
      // The glyph ink can extend past the layout box, and browser zoom / load
      // timing can make the fit land a little wide — a firm margin guarantees
      // the wordmark stays inside the container edges on every browser rather
      // than spilling out on the right. Still reads as full-bleed.
      const avail = box.clientWidth - 40;
      const es = getComputedStyle(el);
      const ctx = document.createElement("canvas").getContext("2d");
      // Measure at a known size, then scale by the ratio.
      ctx.font = es.fontWeight + " 100px " + es.fontFamily;
      const w = ctx.measureText(el.textContent || "").width;
      if (w <= 0 || avail <= 0) return;
      el.style.fontSize = (avail / w) * 100 + "px";

      // Canvas ignores letter-spacing and side bearings, so the first guess is
      // off. Re-measure the ACTUAL rendered width and correct — a few passes so
      // it converges tightly rather than overshooting the container edges.
      for (let i = 0; i < 3; i += 1) {
        const actual = el.getBoundingClientRect().width;
        if (actual <= 0) break;
        el.style.fontSize = parseFloat(el.style.fontSize) * (avail / actual) + "px";
      }

      // Final guarantee: if it still exceeds the container by any sub-pixel,
      // nudge down so it never bleeds past the edges.
      const finalW = el.getBoundingClientRect().width;
      if (finalW > avail) {
        el.style.fontSize =
          parseFloat(el.style.fontSize) * (avail / finalW) + "px";
      }
    };

    // Wait for Big Shoulders — measuring against the fallback face gives the
    // wrong width and the wordmark settles at the wrong size.
    // Fit once fonts are ready, then again after the layout fully settles —
    // the scrollbar can appear a frame or two later and narrow the container,
    // and a single fit would leave the wordmark sized to the wider value.
    fit();
    document.fonts.ready.then(fit);

    // The container width changes several times during load — fonts swap, the
    // preloader releases body scroll (a scrollbar appears and narrows it), the
    // layout settles. Rather than guess those moments, just re-fit on a short
    // poll through the whole settle window; a stale, too-wide fit is exactly
    // what spilled the letters past the edges.
    let ticks = 0;
    const poll = setInterval(() => {
      fit();
      if ((ticks += 1) > 40) clearInterval(poll); // ~4s
    }, 100);

    window.addEventListener("resize", fit);

    // And re-fit on any real width change afterwards.
    const box = el.closest(".hero");
    let ro;
    if (box && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(fit);
      ro.observe(box);
    }

    return () => {
      clearInterval(poll);
      window.removeEventListener("resize", fit);
      ro?.disconnect();
    };
  }, []);

  return (
    <section className="hero" id="top">
      <div className="hero__top">
        <h1 className="hero__headline">
          {site.headline.map((line, i) => (
            <span className="hero__line" key={line}>
              <motion.span
                style={{ display: "block", willChange: "transform" }}
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.05, delay: base + i * 0.1, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="hero__intro"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: base + 0.34, ease: EASE }}
        >
          {site.intro}
        </motion.p>
      </div>

      {/* Inline banner image — MOBILE ONLY. On phones the shared sticky phone
          is hidden and the image simply sits below the text in normal flow
          (scrolls with the page, not sticky). */}
      <div className="hero__figure" aria-hidden="true">
        {site.heroVisual ? <img src={site.heroVisual} alt="" /> : null}
      </div>

      <motion.span
        className="wordmark hero__wordmark"
        ref={wordmarkRef}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3, delay: base + 0.18, ease: EASE }}
        aria-hidden="true"
      >
        {site.wordmark}
      </motion.span>
    </section>
  );
}
