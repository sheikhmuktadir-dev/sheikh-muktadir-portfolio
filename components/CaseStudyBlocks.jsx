"use client";

import { motion } from "framer-motion";
import { site } from "@/data/site";
import { coverSrcSet } from "@/lib/media";
import Counter from "./fx/Counter";
import Scramble from "./fx/Scramble";
import { openProject } from "@/lib/projectModal";

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

            {/* Desktop stat cards. They belong to the BLOCK, not the pinned
                phone, so they scroll with the copy and pass over the phone at
                page speed — exactly like the reference. No entrance fade: they
                are simply there, and the Counter still counts up in view. The
                box is phone-sized and sits where the locked phone sits when
                this block is centred, so the cards line up with it then. */}
            <div className="cs__stats" aria-hidden="true">
              <div className="cs__stats-box">
                {item.stats.map((stat) => (
                  <div className="cs__stat" key={stat.label}>
                    <Counter className="cs__stat-value" value={stat.value} />
                    <span className="cs__stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inline cover — mobile only. On phones the shared sticky phone
                fades out in this section (it covers the text), so each project
                shows its own image stacked above the copy, like td-noise. */}
            <div className="cs__cover" aria-hidden="true">
              {/* Slim portrait media (td-noise proportion). Clips its own
                  corners; the stat cards live outside it so they can overhang. */}
              <div
                className="cs__cover-media"
                data-cursor="View"
                onClick={(e) => openProject(i, e.currentTarget)}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    srcSet={coverSrcSet(item.image)}
                    sizes="(max-width: 767px) 90vw, 420px"
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
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
              <h2 className="cs__title">{item.title}</h2>
              <p className="cs__desc">{item.description}</p>
              {/* Opens the preview modal (gallery + "Visit live site"), so the
                  recruiter never leaves the portfolio by accident. */}
              <button
                type="button"
                className="cs__link fx-underline"
                data-cursor="View"
                aria-haspopup="dialog"
                onClick={(e) => openProject(i, e.currentTarget)}
              >
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
              </button>
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
