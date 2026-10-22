import { ImageResponse } from "next/og";
import { site } from "@/data/site";

/**
 * Open Graph / Twitter card image, generated at build time by Next from the
 * same facts as the page (data/site.js). This is what WhatsApp, LinkedIn,
 * Slack and iMessage show next to the link — a recruiter's first impression
 * before the site even loads. 1200x630 is the standard card size.
 */
export const runtime = "nodejs";
export const alt = `${site.name} — ${site.role}, Hyderabad`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#141414",
          color: "#f5f5f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              opacity: 0.7,
            }}
          >
            <div style={{ width: 12, height: 12, background: "#f5f5f5" }} />
            {site.role}
          </div>
          <div style={{ fontSize: 22, letterSpacing: 4, textTransform: "uppercase", opacity: 0.7 }}>
            Hyderabad, IN
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 108, fontWeight: 800, letterSpacing: -5, lineHeight: 1 }}>
            {site.name}
          </div>
          <div style={{ fontSize: 40, lineHeight: 1.25, opacity: 0.85, maxWidth: 1000 }}>
            {site.headline.join(" ")}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {["React", "Next.js", "React Native", "Team Lead", "Open to full-time"].map((t) => (
            <div
              key={t}
              style={{
                padding: "12px 20px",
                border: "2px solid rgba(245,245,245,0.35)",
                borderRadius: 999,
                fontSize: 24,
                letterSpacing: 1,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
