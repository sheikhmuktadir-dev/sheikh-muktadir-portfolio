"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { site } from "@/data/site";
import CtaButton from "./CtaButton";
import { INTRO_MS } from "@/lib/config";

/**
 * Header. On desktop it is the right-aligned links + CTA (the banner headline
 * owns the top-left, so no brand mark is shown). On phones it collapses to the
 * name on the left and a MENU button on the right that opens a full-screen
 * overlay with the links and CTA — the td-noise mobile pattern.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);

  const enter = (delay) => ({
    initial: { opacity: 0, y: -12 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.8,
      delay: INTRO_MS / 1000 + delay,
      ease: [0.22, 1, 0.36, 1],
    },
  });

  // Lock page scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="nav nav--end">
      {/* Brand — mobile only */}
      <a className="nav__brand" href="#top" onClick={close}>
        {site.name}
      </a>

      {/* Links — desktop only */}
      <motion.nav className="nav__links" {...enter(0.07)} aria-label="Primary">
        {site.nav.map((item) => (
          <a key={item.href} href={item.href} className="nav__link">
            <span>{item.label}</span>
            <span aria-hidden="true">{item.label}</span>
          </a>
        ))}
      </motion.nav>

      {/* CTA — desktop only */}
      <motion.div className="nav__actions" {...enter(0.14)}>
        <CtaButton />
      </motion.div>

      {/* Menu toggle — mobile only */}
      <button
        type="button"
        className="nav__menu-btn"
        aria-expanded={open}
        aria-controls="nav-overlay"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close" : "Menu"}
      </button>

      {/* Full-screen overlay menu — mobile only */}
      <div
        id="nav-overlay"
        className={`nav__overlay${open ? " is-open" : ""}`}
        aria-hidden={!open}
      >
        <nav className="nav__overlay-links" aria-label="Primary mobile">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav__overlay-link"
              onClick={close}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="nav__overlay-cta" onClick={close}>
          <CtaButton />
        </div>
      </div>
    </header>
  );
}
