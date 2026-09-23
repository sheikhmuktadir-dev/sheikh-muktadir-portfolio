"use client";

import { site } from "@/data/site";
import { Reveal } from "./Reveal";

/**
 * Footer — dark surface, rounded at the top against the page behind it.
 *
 * Two columns: a contact block on the left and a links list on the right. The
 * links are set at display size (32px / wght 666) with the same roll-up hover
 * as the nav, not as small print.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  const links = [
    ...site.nav,
    { label: site.cta.label, href: site.cta.href },
  ];

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__cols">
          {/* Contact */}
          <Reveal>
            <div className="footer__col">
              <span className="footer__col-label">Get in touch</span>
              <p className="footer__lead">
                Available now for full-time front-end roles across web and
                mobile. If you're hiring, let's talk.
              </p>
              <a className="footer__email" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <span className="footer__note">{site.location}</span>
            </div>
          </Reveal>

          {/* Links */}
          <Reveal delay={0.08}>
            <div className="footer__col">
              <span className="footer__col-label">Links</span>
              <ul className="footer__links">
                {links.map((link) => (
                  <li key={link.label}>
                    <a className="footer__link" href={link.href}>
                      <span>{link.label}</span>
                      <span aria-hidden="true">{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="footer__bar">
          <ul className="footer__socials">
            {site.socials.map((social) => (
              <li key={social.label}>
                <a
                  className="footer__social"
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="footer__meta">
            <span>
              &copy; {year} {site.name}
            </span>
            <span>{site.role}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
