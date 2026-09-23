"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Counter from "./fx/Counter";
import { site } from "@/data/site";
import { Reveal } from "./Reveal";
import Scramble from "./fx/Scramble";

const EASE = [0.22, 1, 0.36, 1];

const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

/**
 * Testimonials — a carousel styled after td-noise: a vertical star rating and a
 * big quote on the left (name, role and prev/next arrows below), a tall portrait
 * on the right with two floating stat cards. Prev/next cycles the list.
 *
 * Keyed motion swaps (not AnimatePresence) so a throttled tab can't strand an
 * exiting item on top of the new one — same reasoning as PhoneTrack.
 */
export default function Testimonials() {
  const items = site.testimonials || [];
  const [active, setActive] = useState(0);

  if (!items.length) return null;

  const t = items[active];
  const go = (d) => setActive((a) => (a + d + items.length) % items.length);

  return (
    <section className="section testi" id="testimonials">
      <div className="shell">
        <Reveal>
          <span className="label testi__label">
            <span className="testi__square" />
            <Scramble text={site.testimonialsLabel} />
          </span>
        </Reveal>

        <div className="testi__grid">
          {/* Desktop quote mark — a direct grid child so its right edge sits
              flush with the grid's right edge (= the container content edge),
              reaching the edge like td-noise without ever spilling past it at
              any width. The aside-scoped copy below handles the stacked phone
              layout, where it must track the portrait instead. */}
          <svg
            className="testi__quotemark testi__quotemark--edge"
            viewBox="0 0 250.726 184.874"
            aria-hidden="true"
          >
            <path d="M 250.726 184.874 L 141.948 184.874 L 141.948 104.388 L 188.776 0 L 231.702 0 L 193.654 96.583 L 250.726 96.583 Z M 109.266 184.874 L 0 184.874 L 0 104.388 L 47.316 0 L 90.242 0 L 52.194 96.583 L 109.266 96.583 Z" />
          </svg>

          {/* Left — rating, quote, author, arrows */}
          <div className="testi__main">
            <div
              className="testi__stars"
              role="img"
              aria-label={`${t.rating} out of 5 stars`}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.svg
                  key={i}
                  className={`testi__star${i < t.rating ? " is-on" : ""}`}
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08, ease: EASE }}
                >
                  <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7L12 2z" />
                </motion.svg>
              ))}
            </div>

            <motion.div
              key={`q-${active}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <blockquote className="testi__quote">{t.quote}</blockquote>
              <div className="testi__author">
                <span className="testi__name">{t.name}</span>
                <span className="testi__role">{t.role}</span>
              </div>
            </motion.div>

            <div className="testi__nav">
              <button
                className="testi__arrow"
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
              >
                <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
                  <path d="M20 7H2M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                className="testi__arrow"
                type="button"
                onClick={() => go(1)}
                aria-label="Next testimonial"
              >
                <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
                  <path d="M0 7h18M13 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right — portrait with floating stat cards */}
          <div className="testi__aside" aria-hidden="true">
            {/* Phone copy — scoped to the aside so it tracks the stacked portrait. */}
            <svg className="testi__quotemark testi__quotemark--stack" viewBox="0 0 250.726 184.874" aria-hidden="true">
              <path d="M 250.726 184.874 L 141.948 184.874 L 141.948 104.388 L 188.776 0 L 231.702 0 L 193.654 96.583 L 250.726 96.583 Z M 109.266 184.874 L 0 184.874 L 0 104.388 L 47.316 0 L 90.242 0 L 52.194 96.583 L 109.266 96.583 Z" />
            </svg>
            <motion.div
              key={`m-${active}`}
              className="testi__media"
              style={{ background: t.image ? undefined : "#1b1b1d" }}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              {t.image ? (
                <img src={t.image} alt="" />
              ) : (
                <span className="testi__initials">{initials(t.name)}</span>
              )}
            </motion.div>

            <div className="testi__stats" key={`s-${active}`}>
              {t.stats.map((s, i) => (
                <motion.div
                  className="testi__stat"
                  key={`${active}-${s.label}`}
                  initial={{ opacity: 0, y: 12, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: EASE }}
                >
                  <Counter className="testi__stat-value" value={s.value} />
                  <span className="testi__stat-label">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
