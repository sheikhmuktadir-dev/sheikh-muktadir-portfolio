"use client";

import { motion } from "framer-motion";
import { site } from "@/data/site";
import { Reveal } from "./Reveal";
import useTilt from "./fx/useTilt";
import Scramble from "./fx/Scramble";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Tech grid. Each cell is a 3D "sticker" tile holding the technology's real
 * logo (official brand SVGs in /public/icons/, keyed by `brands[].icon` in
 * data/site.js) with its label underneath. The 3D look — the raised tile,
 * layered shadow and tilt-on-hover — is all in .brands__* CSS.
 */
/** One sticker tile — shared by the desktop grid and the mobile marquee. */
function BrandTile({ item }) {
  return (
    <>
      <span className="brands__icon" aria-hidden="true">
        <img
          src={`/icons/${item.icon}.svg`}
          alt=""
          width="48"
          height="48"
          loading="lazy"
          draggable="false"
        />
      </span>
      <span className="brands__mark">{item.name}</span>
    </>
  );
}

/** One desktop grid cell — its own component so useTilt is called once per
    cell (a hook can't run inside a .map callback). Reveals on scroll, then
    reacts to the pointer with a 3D tilt + glare (see .brands__cell.fx-tilt). */
function BrandGridCell({ item, index }) {
  const tilt = useTilt({ max: 10 });
  // Tilt lives on the CELL (a plain div) so its CSS transform owns the node;
  // the reveal runs on an INNER motion element instead. If both sat on the
  // same node, framer's inline transform for the fade-up would overwrite the
  // pointer tilt and the card would never respond.
  return (
    <div
      className={`brands__cell ${tilt.className}`}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
    >
      <motion.span
        className="brands__reveal"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.6, delay: (index % 6) * 0.06, ease: EASE }}
      >
        <BrandTile item={item} />
      </motion.span>
    </div>
  );
}

/** A single infinite marquee row. The list is rendered twice so the loop is
    seamless — the track slides exactly one copy-width, then repeats. */
function MarqueeRow({ items, direction }) {
  const loop = [...items, ...items];
  return (
    <div className={`brands__row brands__row--${direction}`}>
      <div className="brands__track">
        {loop.map((item, i) => (
          <div className="brands__cell" key={`${item.name}-${i}`}>
            <BrandTile item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Brands() {
  // Split the tech list into two rows for the mobile marquee.
  const half = Math.ceil(site.brands.length / 2);
  const rowA = site.brands.slice(0, half);
  const rowB = site.brands.slice(half);

  return (
    <section className="section brands" id="brands">
      <div className="shell">
        <Reveal>
          <span className="label brands__label">
            <span className="brands__square" />
            <Scramble text={site.brandsLabel} />
          </span>
        </Reveal>

        {/* Desktop / tablet: the static grid. */}
        <div className="brands__grid">
          {site.brands.map((item, i) => (
            <BrandGridCell item={item} index={i} key={item.name} />
          ))}
        </div>

        {/* Mobile: two opposing marquee rows. */}
        <div className="brands__marquee" aria-hidden="true">
          <MarqueeRow items={rowA} direction="ltr" />
          <MarqueeRow items={rowB} direction="rtl" />
        </div>
      </div>
    </section>
  );
}
