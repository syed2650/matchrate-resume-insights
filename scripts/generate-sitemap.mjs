/**
 * Writes public/sitemap.xml from the canonical list of indexable routes.
 * Run via: npm run generate:sitemap (also runs before production build).
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outPath = join(root, "public", "sitemap.xml");

const SITE = "https://www.matchrate.co";

/** Paths to include (static marketing + blog). No /dashboard, /auth, etc. */
const PATHS = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/review", priority: "0.9", changefreq: "weekly" },
  { path: "/blog", priority: "0.8", changefreq: "weekly" },
  { path: "/free-ats-check", priority: "0.8", changefreq: "weekly" },
  { path: "/resume-feedback", priority: "0.7", changefreq: "weekly" },
  { path: "/contact", priority: "0.6", changefreq: "monthly" },
  { path: "/faq", priority: "0.7", changefreq: "monthly" },
  { path: "/privacy", priority: "0.4", changefreq: "yearly" },
  { path: "/terms", priority: "0.4", changefreq: "yearly" },
  { path: "/cookie-policy", priority: "0.3", changefreq: "yearly" },
  { path: "/lovable", priority: "0.6", changefreq: "monthly" },
  { path: "/lovable-jobs", priority: "0.6", changefreq: "monthly" },
  { path: "/blog/linkedin-profile-optimization", priority: "0.7", changefreq: "monthly" },
  { path: "/blog/cover-letters-that-work", priority: "0.7", changefreq: "monthly" },
  { path: "/blog/salary-negotiation-psychology", priority: "0.7", changefreq: "monthly" },
  { path: "/blog/resume-templates-ats", priority: "0.7", changefreq: "monthly" },
  { path: "/blog/resume-keywords-data", priority: "0.7", changefreq: "monthly" },
  { path: "/blog/ats-algorithm-exposed", priority: "0.7", changefreq: "monthly" },
  { path: "/blog/resume-psychology", priority: "0.7", changefreq: "monthly" },
  { path: "/blog/resume-format-guide", priority: "0.7", changefreq: "monthly" },
  { path: "/blog/resume-rejection-mistakes", priority: "0.7", changefreq: "monthly" },
  { path: "/blog/resume-keywords", priority: "0.7", changefreq: "monthly" },
  { path: "/blog/resume-rejection", priority: "0.7", changefreq: "monthly" },
  { path: "/blog/beat-ats", priority: "0.7", changefreq: "monthly" },
  { path: "/blog/free-vs-paid-checkers", priority: "0.7", changefreq: "monthly" },
  { path: "/blog/improve-resume", priority: "0.7", changefreq: "monthly" },
  { path: "/blog/ats-systems", priority: "0.7", changefreq: "monthly" },
  { path: "/blog/resume-mistakes", priority: "0.7", changefreq: "monthly" },
  { path: "/blog/remote-job-resume-optimization", priority: "0.7", changefreq: "monthly" },
  { path: "/blog/ai-resume-writers-vs-ats", priority: "0.7", changefreq: "monthly" },
];

const lastmod = new Date().toISOString().slice(0, 10);

const urlEntries = PATHS.map(
  ({ path, priority, changefreq }) => `
<url>
  <loc>${SITE}${path === "/" ? "/" : path}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>${changefreq}</changefreq>
  <priority>${priority}</priority>
</url>`
).join("");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

writeFileSync(outPath, xml.trim() + "\n", "utf8");
console.log(`Wrote ${PATHS.length} URLs to public/sitemap.xml (lastmod ${lastmod})`);
