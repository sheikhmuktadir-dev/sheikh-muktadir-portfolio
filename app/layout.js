import {
  Schibsted_Grotesk,
  DM_Mono,
  Big_Shoulders,
} from "next/font/google";
import "./styles/globals.css";

import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import FxLayer from "@/components/fx/FxLayer";
import { site } from "@/data/site";

// Headings and body — tight tracking, sub-1 line height on display sizes.
const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  // No weight array -> the VARIABLE font. Required: the reference sets the
  // wght axis to 666, which a static 400/500/600 file cannot express.
  variable: "--font-schibsted",
  display: "swap",
});

// Small UI labels, tags and buttons — the reference uses DM Mono for all of
// these, which is what gives the nav and pills their monospaced look.
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

// The oversized condensed wordmark.
const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: ["300", "600", "900"],
  variable: "--font-big-shoulders",
  display: "swap",
  // Next has no fallback metrics for this family; computing a size-adjust
  // override fails noisily. We supply our own condensed fallback instead.
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "Impact", "sans-serif"],
});

export const metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.intro,
};

export const viewport = {
  themeColor: "#f5f5f5",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${schibsted.variable} ${dmMono.variable} ${bigShoulders.variable}`}
    >
      <body>
        <Preloader name={site.wordmark} />
        <FxLayer />
        <Cursor />
        <SmoothScroll>
          <Nav />
          <main>{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
