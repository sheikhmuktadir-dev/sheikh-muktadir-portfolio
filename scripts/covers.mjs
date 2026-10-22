// Generates a 780px-wide WebP sibling for every project cover in public/media
// (not the gallery), e.g. chesscurve-review.webp -> chesscurve-review-780.webp,
// and writes lib/covers.json ({ file: originalWidth }) which lib/media.js reads
// to build srcset. On a phone the cover is ~330 CSS px wide, so the 1170px
// capture was 3x more bytes than needed (Lighthouse: "331 KiB savings").
// Run after adding or replacing a cover:  npm run covers
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const dir = fileURLToPath(new URL("../public/media/", import.meta.url));
const manifestPath = fileURLToPath(new URL("../lib/covers.json", import.meta.url));
const WIDTH = 780;
const manifest = {};

for (const name of readdirSync(dir)) {
  const file = join(dir, name);
  if (!statSync(file).isFile()) continue;
  if (!/\.(webp|jpe?g|png)$/i.test(name) || /-780\.webp$/i.test(name)) continue;
  const meta = await sharp(file).metadata();
  if (!meta.width || meta.width <= WIDTH) {
    console.log(`skip ${name} (${meta.width}px)`);
    continue;
  }
  const out = join(dir, `${basename(name, extname(name))}-780.webp`);
  await sharp(file).resize({ width: WIDTH }).webp({ quality: 82 }).toFile(out);
  manifest[name] = meta.width;
  console.log(`${name} -> ${basename(out)} (${statSync(out).size} B)`);
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`manifest: ${Object.keys(manifest).length} covers -> ${manifestPath}`);
