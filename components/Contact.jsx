"use client";

import { useEffect, useRef } from "react";
import { site } from "@/data/site";
import { MaskLine } from "./Reveal";

export default function Contact() {
  const wordmarkRef = useRef(null);

  // Fill the section width with the name, edge to edge — the same canvas
  // measure-and-scale the banner uses.
  useEffect(() => {
    const el = wordmarkRef.current;
    if (!el) return;

    const fit = () => {
      // Fit against the .shell — the container-capped box (max-width: --container
      // + gutter), exactly like the banner fits to .hero. Using the full-bleed
      // .contact section instead made the name size to the whole viewport and
      // overflow the container on screens wider than --container.
      const box = el.closest(".shell");
      if (!box) return;
      // Safety margin like the banner: glyph ink can extend past the layout
      // box, so leave room or the name spills outside the container.
      const avail = box.clientWidth - 40;
      const es = getComputedStyle(el);
      const ctx = document.createElement("canvas").getContext("2d");
      ctx.font = es.fontWeight + " 100px " + es.fontFamily;
      const w = ctx.measureText(el.textContent || "").width;
      if (w <= 0 || avail <= 0) return;
      el.style.fontSize = (avail / w) * 100 + "px";
      for (let i = 0; i < 3; i += 1) {
        const actual = el.getBoundingClientRect().width;
        if (actual <= 0) break;
        el.style.fontSize =
          parseFloat(el.style.fontSize) * (avail / actual) + "px";
      }
      const finalW = el.getBoundingClientRect().width;
      if (finalW > avail) {
        el.style.fontSize =
          parseFloat(el.style.fontSize) * (avail / finalW) + "px";
      }
    };

    fit();
    document.fonts.ready.then(fit);
    window.addEventListener("resize", fit);
    let ro;
    const box = el.closest(".shell");
    if (box && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(fit);
      ro.observe(box);
    }
    return () => {
      window.removeEventListener("resize", fit);
      ro?.disconnect();
    };
  }, []);

  return (
    <section className="section contact" id="contact">
      <div className="shell">
        <h2 className="contact__lead">
          <MaskLine>Let&rsquo;s make something worth noticing</MaskLine>
        </h2>

        <div>
          <MaskLine delay={0.08}>
            <a className="contact__mail fx-underline" href={`mailto:${site.email}`} data-cursor="Email">
              {site.email}
            </a>
          </MaskLine>
        </div>

        {/* Oversized name filling the section, edge to edge — like the banner.
            The wrapper owns the spacing and centring; the name itself stays
            inline (as in the banner) so the JS fit measures the real glyph
            width and it lands centred inside the container. */}
        <div className="contact__wordmark-wrap">
          <a
            className="wordmark contact__wordmark"
            href={`mailto:${site.email}`}
            ref={wordmarkRef}
            aria-label="Email me"
          >
            {site.wordmark}
          </a>
        </div>
      </div>
    </section>
  );
}
