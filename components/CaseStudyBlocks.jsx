"use client";

import { motion } from "framer-motion";
import { site } from "@/data/site";
import Counter from "./fx/Counter";
import Scramble from "./fx/Scramble";

const EASE = [0.22, 1, 0.36, 1];

/**
 * The scrolling case-study copy. No phone here — <PhoneTrack /> owns the
 * single shared phone and reads which block is active via `blockRefs`.
 */
export default function CaseStudyBlocks({ blockRefs }) {
  return (
    <section className="cs" id="work">
      <div className="cs__blocks">
        {site.work.map((item, i) => (
          <article
            className="cs__block"
            key={item.title}
            data-index={i}
            /* Block body, not an expression: React 19 treats a returned value
               from a ref callback as a cleanup function. */
            ref={(el) => {
              blockRefs.current[i] = el;
            }}
          >
            <div className="cs__rule-row">
              <span className="cs__eyebrow">
                <span className="cs__square" />
                <Scramble text="Project" />
              </span>
              <span className="cs__rule" />
              <span className="cs__index">
                <Scramble text={String(i + 1).padStart(2, "0")} />
              </span>
            </div>

            {/* Inline cover — mobile only. On phones the shared sticky phone
                fades out in this section (it covers the text), so each project
                shows its own image stacked above the copy, like td-noise. */}
            <div className="cs__cover" aria-hidden="true">
              {/* Slim portrait media (td-noise proportion). Clips its own
                  corners; the stat cards live outside it so they can overhang. */}
              <div className="cs__cover-media">
                {item.image ? <img src={item.image} alt="" loading="lazy" /> : null}
              </div>

              {/* Floating stat cards over the image — the mobile echo of the
                  desktop phone's stat pills, laid out like td-noise: alternating
                  sides, stepped down the image. Staggered pop-in on scroll. */}
              <div className="cs__cover-stats">
                {item.stats.map((stat, s) => (
                  <motion.div
                    className="cs__cover-stat"
                    key={stat.label}
                    initial={{ opacity: 0, y: 16, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-8% 0px" }}
                    transition={{ duration: 0.5, delay: s * 0.09, ease: EASE }}
                  >
                    <Counter className="cs__cover-stat-value" value={stat.value} />
                    <span className="cs__cover-stat-label">{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="cs__copy">
              <span className="cs__year">{item.year}</span>
              <h3 className="cs__title">{item.title}</h3>
              <p className="cs__desc">{item.description}</p>
              <a className="cs__link fx-underline" href={item.href} data-cursor="View">
                View project
                <svg width="20" height="12" viewBox="0 0 20 12" fill="none" aria-hidden="true">
                  <path
                    d="M0 6h18M13 1l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>

            <div className="cs__cats">
              <span className="cs__cats-label">Categories</span>
              <span className="cs__cats-list">
                {item.categories.map((cat) => (
                  <span className="cs__cat" key={cat}>
                    {cat}
                  </span>
                ))}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
