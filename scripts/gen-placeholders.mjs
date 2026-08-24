// One-off generator for launch placeholder imagery. Real event photography
// replaces these files later (see src/lib/images.ts) without touching layout
// code — swap the file, keep the path.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "images", "placeholders");
mkdirSync(outDir, { recursive: true });

const COLORS = {
  navy: "#102238",
  pink: "#F3B6C5",
  green: "#C7D1A7",
  blue: "#3D78A8",
  yellow: "#F4D98B",
  cream: "#F8F2E8",
};

function svg({ w = 1200, h = 900, from, to, label, sub }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
    <pattern id="grain" width="6" height="6" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill="transparent"/>
      <circle cx="1" cy="1" r="0.6" fill="${COLORS.navy}" opacity="0.05"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#grain)"/>
  <g font-family="Arial, sans-serif" text-anchor="middle">
    <text x="${w / 2}" y="${h / 2 - 8}" font-size="${Math.round(w / 22)}" font-weight="700" fill="${COLORS.navy}" opacity="0.55">${label}</text>
    <text x="${w / 2}" y="${h / 2 + 34}" font-size="${Math.round(w / 42)}" fill="${COLORS.navy}" opacity="0.4">${sub}</text>
  </g>
</svg>`;
}

const PLACEHOLDER_SUB = "placeholder — real event photography TBD";

const images = [
  { name: "hero-barbie", from: COLORS.pink, to: COLORS.cream, label: "Hero — Barbie photo", w: 1400, h: 1100 },
  { name: "hero-football", from: COLORS.green, to: COLORS.cream, label: "Hero — football photo", w: 900, h: 700 },
  { name: "barbie-card", from: COLORS.pink, to: "#eaa2b8", label: "Barbie Movie Marathon", w: 1200, h: 900 },
  { name: "match-card", from: COLORS.green, to: "#a9b686", label: "Charity Match", w: 1200, h: 900 },
  { name: "impact", from: COLORS.blue, to: COLORS.cream, label: "Impact — inclusion & joy", w: 1200, h: 1000 },
  { name: "cta-movie-night", from: COLORS.pink, to: COLORS.cream, label: "Movie night", w: 800, h: 600 },
  { name: "cta-football", from: COLORS.green, to: COLORS.cream, label: "Football match", w: 800, h: 600 },
  { name: "cta-together", from: COLORS.yellow, to: COLORS.cream, label: "Students together", w: 800, h: 600 },
  { name: "about", from: COLORS.blue, to: COLORS.pink, label: "About — The Joy Project", w: 1200, h: 900 },
  { name: "get-involved", from: COLORS.green, to: COLORS.yellow, label: "Meet & Shop / RUN Marketplace", w: 1200, h: 900 },
];

for (const img of images) {
  const content = svg({ ...img, sub: PLACEHOLDER_SUB });
  writeFileSync(join(outDir, `${img.name}.svg`), content, "utf8");
  console.log("wrote", img.name + ".svg");
}
