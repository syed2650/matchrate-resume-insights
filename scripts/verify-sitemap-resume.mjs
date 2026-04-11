import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const sm = readFileSync(join(root, "../public/sitemap.xml"), "utf8");
const jr = readFileSync(join(root, "../src/data/jobRoles.ts"), "utf8");

const smUrls = [...sm.matchAll(/<loc>(https:\/\/www\.matchrate\.co\/resume\/[^<]+)<\/loc>/g)].map(
  (m) => m[1]
);
const slugs = [...jr.matchAll(/^\s*slug:\s*"([^"]+)"/gm)]
  .map((m) => m[1])
  .filter((s) => s !== "string");

const expected = new Set(slugs.map((s) => `https://www.matchrate.co/resume/${s}`));
const got = new Set(smUrls);
const missing = [...expected].filter((u) => !got.has(u));
const extra = [...got].filter((u) => !expected.has(u));

console.log("sitemap resume URLs:", smUrls.length, "jobRoles slugs:", slugs.length);
console.log("missing:", missing);
console.log("extra:", extra);
process.exit(missing.length || extra.length || smUrls.length !== 50 ? 1 : 0);
