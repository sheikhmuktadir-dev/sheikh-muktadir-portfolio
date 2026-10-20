"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";
import { closeProject, useProjectIndex } from "@/lib/projectModal";
import { lockScroll } from "@/lib/scroll";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Project preview modal.
 *
 * Opened from the "View project" link, the mobile cover image, or the pinned
 * phone (see lib/projectModal.js). Left: the project's real screens in a
 * device frame — swipe, arrow buttons, thumbnails or ← / → keys. Right: the
 * write-up, stats, stack and a "Visit live site" button.
 *
 * Phones get a bottom sheet with the gallery on top and the details below.
 *
 * Accessibility: role="dialog" + aria-modal, focus moves to Close on open,
 * Tab is trapped inside, Esc closes, focus returns to the trigger on close.
 * Page scroll (Lenis and native) is frozen while it is open.
 */
export default function ProjectModal() {
  const index = useProjectIndex();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Scroll lock follows the OPEN STATE, not a Dialog's lifetime. A closing
  // Dialog stays mounted for its exit animation; if it owned the lock, closing
  // one project and opening another within that half-second would let the old
  // cleanup unlock the page underneath the new one.
  const open = index >= 0;
  useEffect(() => {
    if (!open) return undefined;
    lockScroll(true);
    document.documentElement.classList.add("pm-open");
    return () => {
      lockScroll(false);
      document.documentElement.classList.remove("pm-open");
    };
  }, [open]);

  if (!mounted) return null;

  const item = open ? site.work[index] : null;

  return createPortal(
    <AnimatePresence>
      {item ? <Dialog key={index} item={item} index={index} /> : null}
    </AnimatePresence>,
    document.body
  );
}

function Dialog({ item, index }) {
  const reduce = useReducedMotion();
  // False while this copy plays its exit animation after closing.
  const isPresent = useIsPresent();
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  const slides =
    item.gallery && item.gallery.length
      ? item.gallery
      : [{ src: item.image, label: item.title }];
  const count = slides.length;
  const isLive = typeof item.href === "string" && item.href.startsWith("http");
  const host = isLive ? item.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") : "";

  // [slide index, direction] — direction drives which way the image slides.
  const [[slide, dir], setSlide] = useState([0, 0]);
  const go = useCallback(
    (step) =>
      setSlide(([s]) => [(s + step + count) % count, step]),
    [count]
  );
  const goTo = (i) => setSlide(([s]) => [i, i > s ? 1 : -1]);

  // Warm the other screens and focus Close.
  useEffect(() => {
    slides.forEach((s) => {
      const img = new Image();
      img.src = s.src;
    });
    // Focus straight away (the node exists once effects run) — not on the
    // next frame, which a background tab may never deliver.
    closeRef.current?.focus({ preventScroll: true });
    // Runs once: `slides` comes from `item`, which is fixed for this Dialog's
    // whole life (a different project mounts a fresh Dialog via its key).
  }, []);

  // Esc closes, arrows page the gallery, Tab stays inside the dialog.
  useEffect(() => {
    const onKey = (e) => {
      // An exiting copy (still mounted for its fade-out) ignores keys.
      if (!isPresent) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeProject();
      } else if (e.key === "ArrowRight" && count > 1) {
        go(1);
      } else if (e.key === "ArrowLeft" && count > 1) {
        go(-1);
      } else if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [count, go, isPresent]);

  const dur = (d) => (reduce ? 0 : d);
  const titleId = `pm-title-${index}`;
  const current = slides[slide];

  const shotVariants = {
    enter: (d) => ({ x: reduce ? 0 : d >= 0 ? 70 : -70, opacity: 0, scale: reduce ? 1 : 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d) => ({ x: reduce ? 0 : d >= 0 ? -70 : 70, opacity: 0, scale: reduce ? 1 : 0.97 }),
  };

  const info = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.06, delayChildren: dur(0.18) } },
  };
  const rise = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: dur(0.6), ease: EASE } },
  };

  return (
    <motion.div
      className="pm"
      style={isPresent ? undefined : { pointerEvents: "none" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: dur(0.35), ease: EASE }}
      // Click on the dim backdrop (not inside the panel) closes.
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeProject();
      }}
    >
      <motion.div
        ref={panelRef}
        className="pm__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-lenis-prevent
        initial={{ opacity: 0, y: reduce ? 0 : 48, scale: reduce ? 1 : 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduce ? 0 : 32, scale: reduce ? 1 : 0.98 }}
        transition={{ duration: dur(0.55), ease: EASE }}
      >
        <button
          ref={closeRef}
          type="button"
          className="pm__close"
          aria-label="Close preview"
          data-cursor
          onClick={closeProject}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>

        {/* ---------------------------------------------------------- gallery */}
        <div className="pm__stage">
          <div className="pm__glow" aria-hidden="true" />

          <div className="pm__device">
            <span className="pm__notch" aria-hidden="true" />
            <div className="pm__screen">
              <AnimatePresence initial={false} custom={dir}>
                <motion.img
                  key={slide}
                  className="pm__shot"
                  src={current.src}
                  alt={`${item.title} — ${current.label}`}
                  custom={dir}
                  variants={shotVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: dur(0.5), ease: EASE }}
                  draggable={false}
                  drag={count > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.22}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60 || info.velocity.x < -400) go(1);
                    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
                  }}
                />
              </AnimatePresence>
            </div>
          </div>

          {count > 1 ? (
            <>
              <button
                type="button"
                className="pm__nav pm__nav--prev"
                aria-label="Previous screen"
                data-cursor
                onClick={() => go(-1)}
              >
                <Chevron />
              </button>
              <button
                type="button"
                className="pm__nav pm__nav--next"
                aria-label="Next screen"
                data-cursor
                onClick={() => go(1)}
              >
                <Chevron />
              </button>
            </>
          ) : null}

          <div className="pm__strip">
            {count > 1 ? (
              <div className="pm__thumbs" role="group" aria-label="Screens">
                {slides.map((s, i) => (
                  <button
                    type="button"
                    key={s.src}
                    className="pm__thumb"
                    data-active={i === slide}
                    aria-label={`Show ${s.label}`}
                    aria-current={i === slide ? "true" : undefined}
                    data-cursor
                    onClick={() => goTo(i)}
                  >
                    <img src={s.src} alt="" loading="lazy" draggable={false} />
                    {i === slide ? (
                      <motion.span
                        layoutId="pm-thumb-ring"
                        className="pm__thumb-ring"
                        transition={{ duration: dur(0.45), ease: EASE }}
                      />
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
            <span className="pm__counter" aria-live="polite">
              <span>{String(slide + 1).padStart(2, "0")}</span>
              <span className="pm__counter-sep">/</span>
              <span>{String(count).padStart(2, "0")}</span>
              <span className="pm__counter-label">{current.label}</span>
            </span>
          </div>
        </div>

        {/* ------------------------------------------------------------ info */}
        <div className="pm__info">
          <motion.div className="pm__info-inner" variants={info} initial="hidden" animate="show">
            <motion.span className="pm__eyebrow" variants={rise}>
              <span className="pm__square" />
              Project {String(index + 1).padStart(2, "0")}
              <span className="pm__dot" />
              {item.year}
            </motion.span>

            <motion.h2 id={titleId} className="pm__title" variants={rise}>
              {item.title}
            </motion.h2>

            <motion.p className="pm__desc" variants={rise}>
              {item.description}
            </motion.p>

            {item.stats?.length ? (
              <motion.ul className="pm__stats" variants={rise}>
                {item.stats.map((s) => (
                  <li className="pm__stat" key={s.label}>
                    <span className="pm__stat-value">{s.value}</span>
                    <span className="pm__stat-label">{s.label}</span>
                  </li>
                ))}
              </motion.ul>
            ) : null}

            {item.categories?.length ? (
              <motion.div className="pm__cats" variants={rise}>
                {item.categories.map((c) => (
                  <span className="pm__cat" key={c}>
                    {c}
                  </span>
                ))}
              </motion.div>
            ) : null}

            <motion.div className="pm__actions" variants={rise}>
              {isLive ? (
                <>
                  <a
                    className="pm__live"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor
                  >
                    <span>Visit live site</span>
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M7 17L17 7M9 7h8v8"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                  <span className="pm__host">
                    <span className="pm__pulse" aria-hidden="true" />
                    {host}
                  </span>
                </>
              ) : (
                <span className="pm__host pm__host--muted">Live link not public</span>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
