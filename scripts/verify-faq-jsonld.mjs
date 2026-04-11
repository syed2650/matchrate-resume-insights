/**
 * Validates FAQPage JSON-LD shape for sample job roles (mirrors JobRolePage).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const text = readFileSync(join(__dirname, "../src/data/jobRoles.ts"), "utf8");

const roleRe =
  /slug:\s*"([^"]+)",\s*\r?\n\s*title:\s*"([^"]+)",\s*\r?\n\s*industry:\s*"([^"]+)"/g;
const roles = [];
let rm;
while ((rm = roleRe.exec(text)) !== null) {
  roles.push({ slug: rm[1], title: rm[2], industry: rm[3] });
}
if (roles.length !== 50) {
  console.error("Expected 50 roles, got", roles.length);
  process.exit(1);
}

function buildFaqs(role) {
  const { title, industry } = role;
  return [
    {
      question: `What should a ${title} resume include for ATS?`,
      answer: `Use standard headings, mirror keywords from each posting (especially tools and methods common in ${industry}), and quantify outcomes. Avoid graphics that hide text from parsers.`,
    },
    {
      question: `How do employers filter ${title} applications?`,
      answer: `Most large employers run resumes through ATS that match your text to the requisition’s required skills, titles, and locations—often before a recruiter opens your file.`,
    },
    {
      question: `Is a ${title} resume different from a generic resume?`,
      answer: `Yes. Reviewers and parsers expect domain-specific terms and proof of relevant tools. A generic resume under-matches the keyword model the ATS uses for ${title} reqs.`,
    },
    {
      question: `How can I check my ${title} resume against a job description?`,
      answer: `Upload your resume and paste the job description into MatchRate. You’ll get a match-style analysis, missing keywords, and improvement suggestions tailored to that posting.`,
    },
  ];
}

function faqPageLd(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

function validateFaqPage(obj) {
  if (obj["@context"] !== "https://schema.org") throw new Error("bad @context");
  if (obj["@type"] !== "FAQPage") throw new Error("bad @type");
  if (!Array.isArray(obj.mainEntity) || obj.mainEntity.length < 1)
    throw new Error("mainEntity");
  for (const q of obj.mainEntity) {
    if (q["@type"] !== "Question") throw new Error("Question type");
    if (typeof q.name !== "string" || !q.name.trim()) throw new Error("name");
    const a = q.acceptedAnswer;
    if (!a || a["@type"] !== "Answer") throw new Error("acceptedAnswer type");
    if (typeof a.text !== "string" || !a.text.trim()) throw new Error("text");
  }
  return true;
}

const samples = ["software-engineer", "data-analyst", "pharmacist"];
for (const s of samples) {
  const role = roles.find((r) => r.slug === s);
  if (!role) throw new Error(`missing role ${s}`);
  const faqs = buildFaqs(role);
  const ld = faqPageLd(faqs);
  validateFaqPage(ld);
  JSON.stringify(ld); // must serialize
  console.log("OK FAQ JSON-LD:", s, `(${faqs.length} Q&A)`);
}
