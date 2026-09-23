"use client";

import { site } from "@/data/site";
import CtaButton from "./CtaButton";
import { Reveal, RevealWords } from "./Reveal";

/**
 * Full-width centred statement with the CTA pair beneath it. Same type spec as
 * the banner headline — it is the second big typographic moment on the page,
 * not a subheading.
 */
export default function Statement() {
  return (
    <section className="section statement">
      <div className="shell">
        <RevealWords className="statement__text" text={site.statement} />

        <Reveal delay={0.12}>
          <div className="statement__cta">
            <CtaButton />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
