"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { Reveal } from "./Reveal";

/**
 * Process — a pinned numeral beside steps that scroll past it.
 *
 * The number is a vertical strip of numerals inside a clipping window; whenever
 * the active step changes the strip slides by one cell, so the digit rolls
 * rather than swapping. The reference does this with an image strip behind an
 * `overflow: clip` box — rendering it as type needs no assets and stays sharp
 * at any size.
 *
 * Layout notes: the numeral sits on the RIGHT with the steps on the left, and
 * the heading block is offset toward the middle rather than aligned with the
 * steps. The rotated section label runs up the far-left edge.
 */
export default function Process() {
  const stepRefs = useRef([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    // Scroll-driven rather than IntersectionObserver: resolves correctly on
    // first paint instead of waiting for an initial callback.
    const measure = () => {
      const nodes = stepRefs.current.filter(Boolean);
      if (!nodes.length) return;
      const middle = window.innerHeight / 2;
      let next = 0;
      for (let i = 0; i < nodes.length; i += 1) {
        const { top, bottom } = nodes[i].getBoundingClientRect();
        if (top <= middle && bottom > middle) {
          next = i;
          break;
        }
        if (bottom <= middle) next = i;
      }
      setActive((prev) => (prev === next ? prev : next));
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { label, heading, intro, steps } = site.process;

  return (
    <section className="section proc" id="about" data-active={active}>
      <div className="shell">
        {/* Rotated label at the far edge, heading offset toward the middle */}
        <div className="proc__head">
          <div className="proc__vlabel" aria-hidden="true">
            <span className="proc__vlabel-text">{label}</span>
            <span className="proc__vlabel-square" />
          </div>

          <Reveal>
            <div className="proc__intro-col">
              <h2 className="proc__heading">{heading}</h2>
              <p className="proc__intro">{intro}</p>
            </div>
          </Reveal>
        </div>

        <div className="proc__layout">
          {/* Steps — left */}
          <ol className="proc__steps">
            {steps.map((step, i) => (
              <li
                className={`proc__step${i === active ? " is-active" : ""}`}
                key={i}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
              >
                <span className="proc__rule" aria-hidden="true">
                  <span className="proc__rule-dot" />
                </span>

                <h3 className="proc__step-title">{step.title}</h3>
                <span className="proc__duration">{step.duration}</span>

                <ul className="proc__items">
                  {step.items.map((item) => (
                    <li className="proc__item" key={item.label}>
                      <span className="proc__item-label">
                        <span className="proc__item-square" />
                        {item.label}
                      </span>
                      <p className="proc__item-body">{item.body}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          {/* Pinned numeral — right */}
          <div className="proc__numcol" aria-hidden="true">
            <div className="proc__sticky">
              <div className="proc__window">
                {/* 3D drum: the numerals are the faces of a rotating cylinder.
                    Each face is turned by `angle` around the X axis and pushed
                    out along Z by the drum radius; rotating the whole strip by
                    -active*angle brings the active numeral to the front, so the
                    digit rolls over in 3D (like td-noise) instead of sliding
                    flat. Radius for an N-face drum whose cell is 1em tall:
                    (0.5em) / tan(pi / N). */}
                {(() => {
                  const n = steps.length;
                  const angle = 360 / n;
                  const radius = 0.5 / Math.tan(Math.PI / n);
                  return (
                    <div
                      className="proc__strip"
                      style={{ transform: `rotateX(${-active * angle}deg)` }}
                    >
                      {steps.map((step, i) => (
                        <span
                          className="proc__num"
                          key={i}
                          style={{
                            transform: `rotateX(${i * angle}deg) translateZ(${radius.toFixed(
                              4
                            )}em)`,
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
