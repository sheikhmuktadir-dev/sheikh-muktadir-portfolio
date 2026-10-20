"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { site } from "@/data/site";
import { INTRO_MS } from "@/lib/config";
import { subscribeScroll } from "@/lib/scroll";
import { openProject } from "@/lib/projectModal";

import Hero from "./Hero";
import Statement from "./Statement";
import CaseStudyBlocks from "./CaseStudyBlocks";

const EASE = [0.22, 1, 0.36, 1];
const BANNER_TILT = 6;   // deg — reference: rotate(6deg)
const BANNER_SHIFT = 130; // px — reference: translateX(130px); eases to 0 at the lock

// Phone top as a fraction of viewport height at each stage of the scroll.
// Tune the sequence here rather than in the measure loop.
// Banner phone top, in px. Anchors the stage BOTTOM at 90% of the viewport so
// the whole phone (its rounded bottom clears the fold) stays visible on every
// screen height, while staying as large as the height cap allows.
// Banner phone bottom sits a FIXED ~12px above the fold, whatever the screen
// height. The 6deg tilt makes the rotated phone overhang the stage box by ~13px,
// so total offset from the viewport bottom is 12 + 13 = 25px.
const BOTTOM_GAP = 12;
const TILT_OVERHANG = 13;
const bannerTopPx = (vh, stageH) =>
  Math.max(40, vh - BOTTOM_GAP - TILT_OVERHANG - stageH);
const TOP_STATEMENT = 0.62; // drops below the statement text to clear it
const TOP_LOCKED = 0.08;    // locks here at the button and never moves again

// 3D pass for the banner -> button journey. All three unwind to zero at the
// lock point, so the phone is perfectly flat once the case studies begin.
// The reference banner phone is a FLAT 6deg tilt (transform: rotate(6deg)) —
// no perspective, no Y/X rotation, no scale-down. An earlier "3D swing" turned
// it -22deg away and tipped it back, which read as a narrower, skewed phone
// that did not match. Zeroed so the resting pose is a clean 2D tilt.
const PERSPECTIVE = 1400;   // px (harmless with the axes at 0)
const START_ROT_Y = 0;
const START_ROT_X = 0;
const START_SCALE = 1;

/**
 * One phone for the whole run. It is a single sticky element spanning the
 * banner, the statement and every case study, so it never unmounts — it just
 * stays pinned while the content scrolls past it.
 *
 * Two things change as you scroll:
 *   - tilt   5deg in the banner, reaching upright at the button
 *   - drift  banner -> below the statement -> locked position
 *   - media  the banner visual, then one per case study (crossfade)
 *
 * Past the button nothing about the phone changes: it holds its position and
 * the case studies travel to it.
 *
 * `active` is -1 while in the banner and 0..n once a case study owns the view.
 */
export default function PhoneTrack() {
  const blockRefs = useRef([]);
  const stageRef = useRef(null);
  const tiltRef = useRef(null);
  const tagsRef = useRef(null);
  const statementRef = useRef(null);
  const [active, setActive] = useState(-1);

  // Tilt and drift are written straight to the element's transform rather
  // than through motion values. Motion values only reach the DOM on an
  // animation frame, so in a throttled tab the phone freezes part-way through
  // the choreography. A direct style write always lands, and avoids
  // re-rendering the tree on every scroll event.

  useEffect(() => {
    // Viewport-only values (CSS padding of the sticky wrapper, the stage's own
    // height) only change on resize, so they are cached per viewport size
    // instead of being re-read — and forcing a style pass — on every frame.
    let cacheW = -1;
    let cacheH = -1;
    let bannerTop = 0;
    let stageH = 0;

    // Runs in the same frame Lenis moves the page (lib/scroll.js). Ordered as
    // READ everything -> compute -> WRITE everything, so a frame costs at most
    // one layout pass instead of one per style write.
    const measure = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const middle = vh / 2;
      const isPhone = vw <= 767.98;
      const stage = stageRef.current;
      const tilt = tiltRef.current;
      const tags = tagsRef.current;
      const stmt = statementRef.current;

      /* ------------------------------------------------------------ READ */
      if (stage && (vw !== cacheW || vh !== cacheH)) {
        cacheW = vw;
        cacheH = vh;
        bannerTop = parseFloat(getComputedStyle(stage.parentElement).paddingTop) || 0;
        stageH = stage.getBoundingClientRect().height;
      }
      const y = window.scrollY;
      const stmtRect = stmt ? stmt.getBoundingClientRect() : null;
      const nodes = blockRefs.current.filter(Boolean);
      const rects = nodes.map((n) => n.getBoundingClientRect());

      /* --------------------------------------------------------- COMPUTE */
      // On phones the banner stacks, so the phone sits centred rather than
      // pushed to the side — no horizontal shift.
      const bannerShift = isPhone ? 0 : BANNER_SHIFT;

      // Progress along the sequence:
      //   0    banner
      //   0.5  statement centred
      //   1    statement + button fully passed  -> LOCKED from here on
      // The end anchor is the BUTTON, not the first case study: everything
      // finishes here and then holds, so the phone is locked in place and the
      // case studies travel to it rather than it moving to them.
      let p = 0;
      if (stmtRect) {
        const centreAt = stmtRect.top + y + stmtRect.height / 2 - vh / 2;
        const lockAt = stmtRect.bottom + y;
        p =
          y <= centreAt
            ? 0.5 * (y / Math.max(1, centreAt))
            : 0.5 + 0.5 * Math.min(1, (y - centreAt) / Math.max(1, lockAt - centreAt));
        p = Math.min(1, Math.max(0, p));
      }

      // Banner pills fade out as the phone leaves the banner (0.05 -> 0.25),
      // well before the statement centres.
      const fade = Math.min(1, Math.max(0, (p - 0.05) / 0.2));

      // Tilt reaches upright exactly at the lock point, then holds. No tilt on
      // phones — the banner is a straight, full-width image there.
      const deg = (isPhone ? 0 : BANNER_TILT) * (1 - p);

      // Vertical drift is NOT a straight line: measured off the reference it
      // goes 17% -> 50% -> 8% of the viewport — it drops to clear the
      // statement text, then rises to sit high for the case studies.
      const lerp = (a, b, t) => a + (b - a) * t;
      const topPx =
        p < 0.5
          ? lerp(bannerTopPx(vh, stageH), TOP_STATEMENT * vh, p / 0.5)
          : lerp(TOP_STATEMENT * vh, TOP_LOCKED * vh, (p - 0.5) / 0.5);
      const drift = topPx - bannerTop;

      // Eased so most of the settle happens early (axes are zeroed, see the
      // constants, but the curve still shapes the tilt unwind).
      const e = 1 - Math.pow(1 - p, 3);
      const rotY = START_ROT_Y * (1 - e);
      const rotX = START_ROT_X * (1 - e);
      const scale = START_SCALE + (1 - START_SCALE) * e;
      const shift = bannerShift * (1 - p);

      // Which case study owns the view (-1 = still in the banner).
      let next = -1;
      for (let i = 0; i < rects.length; i += 1) {
        const { top, bottom } = rects[i];
        if (top <= middle && bottom > middle) {
          next = i;
          break;
        }
        if (bottom <= middle) next = i;
      }

      /* ----------------------------------------------------------- WRITE */
      if (tags) {
        tags.style.opacity = (1 - fade).toFixed(3);
        tags.style.transform = `translate3d(0, ${(-18 * fade).toFixed(1)}px, 0)`;
      }
      if (stage) {
        // Split deliberately: the stage only moves, the inner wrapper does the
        // tilt — anything on the stage (pills, stat cards) would otherwise be
        // foreshortened along with the device.
        stage.style.transform =
          `translate3d(${shift.toFixed(1)}px, ${drift.toFixed(1)}px, 0)`;
        // On phones the shared phone fades out once a project owns the view —
        // each project shows its own inline cover instead.
        stage.style.opacity = isPhone && next >= 0 ? "0" : "1";
      }
      if (tilt) {
        tilt.style.transform =
          `perspective(${PERSPECTIVE}px) ` +
          `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) ` +
          `rotate(${deg.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      }

      setActive((prev) => (prev === next ? prev : next));
    };

    return subscribeScroll(measure);
  }, []);

  // Guard the index: if `active` ever points past the end of work (e.g. the
  // list shrank), fall back to the banner rather than reading `.image` off
  // undefined and crashing.
  const inBanner = active < 0 || active >= site.work.length;
  const current = inBanner ? null : site.work[active];
  const mediaSrc = inBanner ? site.heroVisual : current.image;
  const mediaKey = inBanner ? "banner" : `case-${active}`;
  const mediaLabel = inBanner ? null : current.title;

  return (
    <div className="phone-track">
      {/* Dots on a separate layer so the overlay blend applies to them alone */}
      <div className="dot-tile" aria-hidden="true" />
      <Hero />
      <div ref={statementRef}>
        <Statement />
      </div>

      <CaseStudyBlocks blockRefs={blockRefs} />

      {/* The single phone, pinned across all of the above */}
      <div className="phone-layer" aria-hidden="true">
        <div className="phone-sticky">
          <div className="phone-stage" ref={stageRef}>
            {/* The whole device is a link once a project owns the view. The
                phone layer is pointer-events:none, so this re-enables it. */}
            {!inBanner && (
              <button
                type="button"
                className="phone-link"
                aria-label={"Preview " + current.title}
                aria-haspopup="dialog"
                data-cursor="View"
                onClick={(e) => openProject(active, e.currentTarget)}
              />
            )}
            <div className="phone-3d" ref={tiltRef}>
            <motion.div
              className="phone"
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.15, delay: INTRO_MS / 1000 + 0.25, ease: EASE }}
            >
              <span className="phone__notch" />
              {/* Keyed swap rather than AnimatePresence, for the same reason
                  as the pills below: a stalled exit would leave every previous
                  image stacked inside the frame. The new one fades up over the
                  tinted background, which reads as a crossfade anyway. The
                  stat cards do NOT fade with it — they live in each block. */}
              <motion.div
                key={mediaKey}
                className="phone__media"
                style={{ background: current?.tint || "#1b1b1d" }}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                {mediaSrc ? (
                  <img src={mediaSrc} alt="" />
                ) : (
                  <span className="phone__empty">
                    {mediaLabel || (
                      <>
                        Add a visual
                        <br />
                        site.heroVisual
                      </>
                    )}
                  </span>
                )}
              </motion.div>
            </motion.div>
            </div>

            {/* Banner: capability pills. Deliberately NOT wrapped in
                AnimatePresence — an exiting set stays mounted until its exit
                animation finishes, so whenever rAF is throttled the old pills
                pile up instead of leaving. Keying the wrapper lets React swap
                them outright. The case-study stat cards are NOT here: they
                live in each block (CaseStudyBlocks) and scroll with the page
                over the pinned phone, like the reference. */}
            {inBanner ? (
              <div className="phone-tags" key="tags" ref={tagsRef}>
                {site.heroTags.map((tag, i) => (
                  <motion.div
                    className="phone-tag"
                    key={tag}
                    initial={{ opacity: 0, y: 16, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.7,
                      delay: INTRO_MS / 1000 + 0.5 + i * 0.1,
                      ease: EASE,
                    }}
                  >
                    <span className="tag">{tag}</span>
                  </motion.div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
