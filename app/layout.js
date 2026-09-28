import localFont from "next/font/local";
import "./styles/globals.css";

import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import FxLayer from "@/components/fx/FxLayer";
import ThemePicker from "@/components/ThemePicker";
import { site } from "@/data/site";

// Applies the saved theme to <html> BEFORE first paint, so a reload never
// flashes the default palette before React hydrates. Kept tiny and inline.
const themeBootstrap = `(function(){try{var a=localStorage.getItem('pf-accent')||'mono';var m=localStorage.getItem('pf-mode')||'light';document.documentElement.setAttribute('data-theme',m==='dark'?a+'-dark':a);}catch(e){}})();`;

// Fonts are self-hosted from ./fonts rather than fetched via next/font/google.
// The Google loader downloads the woff2 files at BUILD time, and that fetch is
// not reliable from CI build machines -- it failed the first Vercel deploy.
// These are the exact latin-subset files Google was serving, so rendering is
// unchanged; the build now makes no network call.

// Headings and body -- tight tracking, sub-1 line height on display sizes.
// The VARIABLE file: the reference sets the wght axis to 666, which a static
// 400/500/600 file cannot express.
const schibsted = localFont({
  src: "./fonts/SchibstedGrotesk-Variable.woff2",
  weight: "400 900",
  style: "normal",
  variable: "--font-schibsted",
  display: "swap",
  adjustFontFallback: "Arial",
});

// Small UI labels, tags and buttons -- the reference uses DM Mono for all of
// these, which is what gives the nav and pills their monospaced look.
const dmMono = localFont({
  src: [
    { path: "./fonts/DMMono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/DMMono-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-dm-mono",
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

// The oversized condensed wordmark.
const bigShoulders = localFont({
  src: [
    { path: "./fonts/BigShoulders-Variable.woff2", weight: "300", style: "normal" },
    { path: "./fonts/BigShoulders-Variable.woff2", weight: "600", style: "normal" },
    { path: "./fonts/BigShoulders-Variable.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-big-shoulders",
  display: "swap",
  // Next has no fallback metrics for this family; computing a size-adjust
  // override fails noisily. We supply our own condensed fallback instead.
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "Impact", "sans-serif"],
});

export const metadata = {
  title: `${site.name} — ${site.role} · React, Next.js & React Native · Hyderabad`,
  description: site.intro,
};

export const viewport = {
  themeColor: "#f5f5f5",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      // The theme bootstrap sets data-theme on <html> before hydration, so the
      // attribute intentionally differs from the server markup.
      suppressHydrationWarning
      className={`${schibsted.variable} ${dmMono.variable} ${bigShoulders.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        <Preloader name={site.wordmark} />
        <FxLayer />
        <Cursor />
        {/* Outside SmoothScroll: its transform would trap this fixed element. */}
        <ThemePicker />
        <SmoothScroll>
          <Nav />
          <main>{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
