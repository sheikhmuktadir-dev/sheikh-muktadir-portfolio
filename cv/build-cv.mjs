// Builds the CV from cv/cv-data.mjs.
//
//   npm run cv
//
// Outputs
//   public/cv.pdf               — what the site's "Download CV" serves
//   cv/Sheikh-Muktadir-CV.tex   — the same CV in Sheikh's original LaTeX
//                                 template, for Overleaf
//
// The PDF reproduces that LaTeX template (Times 10pt, 0.5in / 0.4in margins,
// bold uppercase section titles over a thin blue rule, charcoal text, blue
// links) and is printed by Microsoft Edge (or Chrome) headless — real,
// selectable, ATS-parseable text with clickable links. Two pages maximum.

import { cv } from "./cv-data.mjs";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const PDF_OUT = join(root, "public", "cv.pdf");
const TEX_OUT = join(here, "Sheikh-Muktadir-CV.tex");
const MAX_PAGES = 2;

const BLUE = "#2C5B8E";      // primaryBlue
const CHARCOAL = "#333333";  // bodyCharcoal

/* ------------------------------------------------------------------ HTML */

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/--/g, "\u2013"); // LaTeX "--" -> en dash

const list = (items) => `<ul>${items.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`;

function html() {
  const c = cv.contact;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(cv.name)} — CV</title>
<style>
  @page { size: A4; margin: 0.4in 0.5in; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  /* --k (0..3) is the fill factor set by the script at the end: it grows
     the line spacing and the gaps between blocks until the content reaches
     the bottom margin, so the page is full with no empty band at the foot.
     Type sizes, fonts, colours and margins never change. */
  html {
    --k: 0;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  body {
    /* Same width on screen as on the printed page, so the script measures
       exactly what will print: A4 210mm minus 0.5in either side. */
    width: calc(210mm - 1in);
    font-family: "Times New Roman", Times, "Nimbus Roman", serif;
    font-size: 10pt; line-height: calc(1.2 + 0.07 * var(--k)); color: ${CHARCOAL};
  }
  a { color: ${BLUE}; text-decoration: none; }
  b, strong { font-weight: 700; }

  /* Header — \\Huge name, \\large bold headline, contact + links */
  .head { text-align: center; }
  .name { font-size: 24.9pt; font-weight: 700; line-height: 1.15; }
  .headline { margin-top: 3pt; font-size: 12pt; font-weight: 700; }
  .contact { margin-top: calc(3pt + 1pt * var(--k)); }

  /* \\section — bold \\large uppercase, then a blue \\titlerule */
  h2 {
    break-after: avoid;   /* never strand a heading at the foot of a page */
    margin: calc(7pt + 4pt * var(--k)) 0 calc(3pt + 1.5pt * var(--k));   /* titlespacing 6pt + rule */
    padding-bottom: 1.5pt;
    font-size: 12pt; font-weight: 700; text-transform: uppercase;
    border-bottom: 0.5pt solid ${BLUE};
  }
  p { text-align: justify; }

  /* itemize: noitemsep, topsep=1pt, leftmargin=12pt, labelsep=5pt */
  /* Text starts 12pt in (leftmargin=12pt); the 9pt bullet box hangs left. */
  ul { margin: calc(1pt + 1pt * var(--k)) 0 0 3pt; list-style: none; }
  /* Bullet stays IN the text flow (hanging indent, no positioning): a
     positioned bullet is painted last, so the PDF text — what an ATS reads —
     would list every bullet after all the headings. */
  li { padding-left: 9pt; text-indent: -9pt; }
  li + li { margin-top: calc(0.6pt * var(--k)); }
  li::before {
    content: "\\2022"; display: inline-block; width: 9pt; text-indent: 0;
    font-size: 9pt;
  }

  .entry { margin-top: calc(4pt + 3pt * var(--k)); break-inside: avoid; }
  .row { display: flex; justify-content: space-between; align-items: baseline; gap: 12pt; }
  .row > :last-child { white-space: nowrap; }
  .sub { font-style: italic; }
</style></head>
<body>
<div class="head">
  <div class="name">${esc(cv.name.toUpperCase())}</div>
  <div class="headline">${esc(cv.headline)}</div>
  <div class="contact">
    <a href="mailto:${c.email}">${esc(c.email)}</a> | ${esc(c.phone)} | ${esc(c.location)} | ${esc(c.availability)}
  </div>
  <div>${cv.links.map((l) => `<a href="${l.href}">${esc(l.label)}</a>`).join(" | ")}</div>
</div>

<h2>Professional Summary</h2>
<p>${esc(cv.summary)}</p>

<h2>Technical Skills</h2>
<ul>
  ${cv.skills.map(([k, v]) => `<li><b>${esc(k)}:</b> ${esc(v)}</li>`).join("\n  ")}
</ul>

<h2>Professional Experience</h2>
${cv.experience
  .map(
    (j) => `<div class="entry">
  <div class="row"><b>${esc(j.role)} | ${esc(j.company)}</b><b>${esc(j.dates)}</b></div>
  <div class="sub">${esc(j.location)}</div>
  ${list(j.bullets)}
</div>`
  )
  .join("\n")}

<h2>Key Projects</h2>
${cv.projects
  .map(
    (p) => `<div class="entry">
  <div class="row"><b>${esc(p.name)}</b><a href="${p.live}"><b>Live Demo</b></a></div>
  <div class="sub">Tech: ${esc(p.tech)}</div>
  ${list(p.bullets)}
</div>`
  )
  .join("\n")}

${(cv.mentorship || []).length ? "<h2>Technical Mentorship</h2>" : ""}
${(cv.mentorship || [])
  .map(
    (m) => `<div class="entry">
  <div class="row"><b>${esc(m.role)} | ${esc(m.company)}</b><b>${esc(m.dates)}</b></div>
  ${list(m.bullets)}
</div>`
  )
  .join("\n")}

<h2>Education</h2>
<div class="entry">
  <div class="row"><b>${esc(cv.education.degree)}</b><b>${esc(cv.education.dates)}</b></div>
  <div>${esc(cv.education.school)}</div>
</div>
<script>
/* Fill the page: binary-search the largest --k (0..3) that still fits one A4
   page (297mm minus the 0.4in top and bottom margins, less 1mm of safety).
   If the content is already longer than a page, --k stays 0 and the CV
   simply flows onto page two. */
(function () {
  var MM = 96 / 25.4;
  var avail = (297 - 2 * 10.16 - 1) * MM;
  var root = document.documentElement;
  var height = function () { return document.body.getBoundingClientRect().height; };
  var set = function (k) { root.style.setProperty("--k", String(k)); };
  set(0);
  if (height() > avail) return;
  var lo = 0, hi = 3;
  for (var i = 0; i < 24; i++) {
    var mid = (lo + hi) / 2;
    set(mid);
    if (height() <= avail) lo = mid; else hi = mid;
  }
  set(lo);
})();
</script>
</body></html>`;
}

/* ----------------------------------------------------------------- LaTeX */

// Data already uses LaTeX dashes ("--"); only escape the special characters.
const tex = (s) =>
  String(s)
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/([&%$#_{}])/g, "\\$1")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");

const items = (arr) =>
  `\\begin{itemize}\n${arr.map((b) => `    \\item ${tex(b)}`).join("\n")}\n\\end{itemize}`;

function latex() {
  const c = cv.contact;
  return `% Generated by cv/build-cv.mjs from cv/cv-data.mjs — edit the data file,
% then run \`npm run cv\`. Compiles on Overleaf with pdfLaTeX.
\\documentclass[a4paper,10pt]{article}

\\usepackage[T1]{fontenc}
\\usepackage{mathptmx}
\\usepackage{xcolor}

\\definecolor{primaryBlue}{HTML}{2C5B8E}
\\definecolor{bodyCharcoal}{HTML}{333333}

\\usepackage[left=0.5in, top=0.4in, right=0.5in, bottom=0.4in]{geometry}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage[hidelinks]{hyperref}
\\pagenumbering{gobble}

\\titleformat{\\section}{\\bfseries\\large\\uppercase}{}{0pt}{}[{\\color{primaryBlue}\\titlerule}]
\\titlespacing*{\\section}{0pt}{6pt}{3pt}

\\setlist[itemize]{noitemsep, topsep=1pt, leftmargin=12pt, labelsep=5pt}

\\color{bodyCharcoal}

\\begin{document}

\\begin{center}
    {\\Huge \\textbf{${tex(cv.name.toUpperCase())}}} \\\\
    \\vspace{3pt}
    {\\large \\textbf{${tex(cv.headline)}}} \\\\
    \\vspace{3pt}
    \\href{mailto:${c.email}}{\\color{primaryBlue}${tex(c.email)}} $|$ ${tex(c.phone)} $|$ ${tex(c.location)} $|$ ${tex(c.availability)} \\\\
    ${cv.links.map((l) => `\\href{${l.href}}{\\color{primaryBlue}${tex(l.label)}}`).join(" $|$\n    ")}\\\\
\\end{center}

\\section{Professional Summary}
${tex(cv.summary)}

\\section{Technical Skills}
\\begin{itemize}
${cv.skills.map(([k, v]) => `    \\item \\textbf{${tex(k)}:} ${tex(v)}`).join("\n")}
\\end{itemize}

\\section{Professional Experience}

${cv.experience
  .map(
    (j) => `\\noindent\\textbf{${tex(j.role)} | ${tex(j.company)}} \\hfill \\textbf{${tex(j.dates)}} \\\\
\\textit{${tex(j.location)}}
${items(j.bullets)}`
  )
  .join("\n\n\\vspace{2pt}\n\n")}

\\section{KEY PROJECTS}

${cv.projects
  .map(
    (p) => `\\noindent\\textbf{${tex(p.name)}} \\hfill \\href{${p.live}}{\\color{primaryBlue}\\textbf{Live Demo}} \\\\
\\textit{Tech: ${tex(p.tech)}}
${items(p.bullets)}`
  )
  .join("\n\n\\vspace{2pt}\n\n")}

${(cv.mentorship || []).length ? "\\section{TECHNICAL MENTORSHIP}" : ""}
${(cv.mentorship || [])
  .map(
    (m) => `\\noindent\\textbf{${tex(m.role)} | ${tex(m.company)}} \\hfill \\textbf{${tex(m.dates)}}
${items(m.bullets)}`
  )
  .join("\n\n")}

\\section{EDUCATION}
\\noindent\\textbf{${tex(cv.education.degree)}} \\hfill \\textbf{${tex(cv.education.dates)}} \\\\
${tex(cv.education.school)}

\\end{document}
`;
}

/* ----------------------------------------------------------------- build */

const browsers = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];
const browser = browsers.find((p) => existsSync(p));
if (!browser) {
  console.error("No Edge/Chrome found to print the PDF.");
  process.exit(1);
}

const work = mkdtempSync(join(tmpdir(), "cv-build-"));
const htmlPath = join(work, "cv.html");
writeFileSync(htmlPath, html(), "utf8");

const run = spawnSync(
  browser,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--no-pdf-header-footer",
    `--user-data-dir=${join(work, "profile")}`,
    `--print-to-pdf=${PDF_OUT}`,
    pathToFileURL(htmlPath).href,
  ],
  { encoding: "utf8", timeout: 60000 }
);
rmSync(work, { recursive: true, force: true });

if (run.status !== 0 || !existsSync(PDF_OUT)) {
  console.error("PDF print failed:", run.stderr || run.error);
  process.exit(1);
}

const pdf = readFileSync(PDF_OUT, "latin1");
const pages = (pdf.match(/\/Type\s*\/Page(?!s)/g) || []).length;
writeFileSync(TEX_OUT, latex(), "utf8");

console.log(`public/cv.pdf  ${Math.round(pdf.length / 1024)}KB, ${pages} page(s)`);
console.log("cv/Sheikh-Muktadir-CV.tex  written");
if (pages > MAX_PAGES) {
  console.error(`CV runs to ${pages} pages — keep it to ${MAX_PAGES}. Trim cv/cv-data.mjs.`);
  process.exit(1);
}
