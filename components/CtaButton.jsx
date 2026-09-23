"use client";

import { site } from "@/data/site";

/** Download glyph — arrow into a tray. Used when the CTA is a file. */
const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M8 2v8m0 0L4.8 6.8M8 10l3.2-3.2M2.5 13h11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Diagonal arrow — used when the CTA navigates somewhere. */
const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M4 12L12 4M12 4H6M12 4V10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * The CTA pair — label button plus its square icon box. Returns a fragment so
 * the caller owns the flex container (the nav and the statement space it
 * differently, but the buttons themselves are identical in both).
 *
 * The icon follows the action: a download glyph for a file, a diagonal arrow
 * for navigation.
 */
export default function CtaButton() {
  const { label, href, download } = site.cta;

  // `download` also hints the saved filename; a bare attribute is enough here.
  const fileProps = download ? { download: "" } : {};

  // Wrapped in .cta-group so hovering EITHER the label or the icon box animates
  // both together — otherwise they react independently and read as two separate
  // buttons rather than one unit, as in the reference.
  return (
    <span className="cta-group">
      <a className="btn btn--square btn--roll" href={href} {...fileProps}>
        <span className="btn__roll">
          <span>{label}</span>
          <span aria-hidden="true">{label}</span>
        </span>
      </a>
      <a
        className="btn-round btn-round--square"
        href={href}
        aria-label={label}
        {...fileProps}
      >
        {download ? <DownloadIcon /> : <ArrowIcon />}
      </a>
    </span>
  );
}
