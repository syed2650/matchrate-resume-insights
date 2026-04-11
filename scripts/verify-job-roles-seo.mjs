/**
 * One-off verification: unique SEO fields across JOB_ROLES.
 * Run: node scripts/verify-job-roles-seo.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Dynamic import of compiled data — use regex parse from source to avoid TS build
const file = join(root, "src", "data", "jobRoles.ts");
const text = readFileSync(file, "utf8");

const slugRe = /^\s*slug:\s*"([^"]+)"/gm;
const titleRe = /^\s*title:\s*"([^"]+)"/gm;
const metaRe =
  /metaDescription:\s*\n\s*"([^"]*(?:\\.[^"]*)*)"/gm;

const slugs = [...text.matchAll(slugRe)].map((m) => m[1]).filter((s) => s !== "string");
const titles = [...text.matchAll(titleRe)].map((m) => m[1]);

const metas = [];
let m;
const metaBlock = /metaDescription:\s*\n\s*"((?:[^"\\]|\\.)*)"/gs;
while ((m = metaBlock.exec(text)) !== null) {
  metas.push(m[1].replace(/\\n/g, "\n"));
}

function dup(arr) {
  const map = new Map();
  arr.forEach((x) => map.set(x, (map.get(x) || 0) + 1));
  return [...map.entries()].filter(([, c]) => c > 1);
}

const h1s = titles.map((t) => `Get Your ${t} Resume Past ATS Filters`);
const docTitles = titles.map(
  (t) => `ATS-Optimised Resume for ${t} — Free Checker | MatchRate`
);

console.log("slug count", slugs.length);
console.log("title count", titles.length);
console.log("meta count", metas.length);

console.log("dup slugs", dup(slugs));
console.log("dup titles", dup(titles));
console.log("dup meta", dup(metas));
console.log("dup h1", dup(h1s));
console.log("dup docTitle", dup(docTitles));

const bad =
  slugs.length !== 50 ||
  dup(slugs).length ||
  dup(titles).length ||
  dup(metas).length ||
  dup(h1s).length ||
  dup(docTitles).length;

process.exit(bad ? 1 : 0);
