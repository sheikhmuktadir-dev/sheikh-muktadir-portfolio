"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Block-level scroll reveal — fades and lifts its children into place once.
 */
export function Reveal({ children, delay = 0, y = 28, className, once = true }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A single masked line: the wrapper clips, the inner span slides up from below.
 * Use for headlines where you want the type to "arrive" rather than fade.
 */
export function MaskLine({
  children,
  delay = 0,
  duration = 0.95,
  className,
  inView = true,
  play = true,
}) {
  const inner = {
    hidden: { y: "110%" },
    show: { y: "0%", transition: { duration, delay, ease: EASE } },
  };

  const viewProps = inView
    ? { whileInView: "show", viewport: { once: true, margin: "-10% 0px" } }
    : { animate: play ? "show" : "hidden" };

  return (
    <span className={["line-mask", className].filter(Boolean).join(" ")}>
      <motion.span
        style={{ display: "block", willChange: "transform" }}
        variants={inner}
        initial="hidden"
        {...viewProps}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Splits a paragraph into words and staggers them in — heavier than MaskLine,
 * so keep it for short, important copy.
 */
export function RevealWords({ text, delay = 0, className }) {
  const words = text.split(" ");

  return (
    <motion.p
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ staggerChildren: 0.022, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}
        >
          <motion.span
            style={{ display: "inline-block", willChange: "transform" }}
            variants={{
              hidden: { y: "105%", opacity: 0 },
              show: { y: "0%", opacity: 1, transition: { duration: 0.7, ease: EASE } },
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.p>
  );
}
