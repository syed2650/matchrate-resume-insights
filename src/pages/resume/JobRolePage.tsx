import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Target,
  Lightbulb,
  Briefcase,
  HelpCircle,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { jobRoleBySlug, type JobRole } from "@/data/jobRoles";

/** Rotating card shells for keyword grid — matches blog green/blue/amber/purple pattern */
const KEYWORD_CARD_STYLES = [
  "bg-green-50 border border-green-200",
  "bg-blue-50 border border-blue-200",
  "bg-amber-50 border border-amber-200",
  "bg-purple-50 border border-purple-200",
  "bg-red-50 border border-red-200",
];

const TIP_BORDER_ACCENT = [
  "border-l-blue-500",
  "border-l-green-500",
  "border-l-amber-500",
  "border-l-purple-500",
  "border-l-red-500",
];

function explainKeyword(keyword: string, jobTitle: string, index: number): string {
  const k = keyword.trim();
  const templates = [
    `Applicant tracking systems tokenize "${k}" and match it against the ${jobTitle} job description—missing it often drops your relevance score before a human reads your file.`,
    `Recruiter-facing ATS dashboards surface candidates when "${k}" appears in skills or experience in the same form employers use in their reqs for ${jobTitle} roles.`,
    `For ${jobTitle} pipelines, "${k}" is a high-signal term: parsers weight exact matches in your summary, skills block, and role bullets over generic synonyms.`,
    `Greenhouse, Workday, and similar parsers compare "${k}" to the posting’s required skills—paste the JD into MatchRate to see if your resume actually lines up.`,
    `When "${k}" maps to tools or credentials in this field, ATS may require the string verbatim—mirror the employer’s spelling and casing for ${jobTitle} applications.`,
  ];
  return templates[index % templates.length];
}

function jobBoardAtsLine(board: string, jobTitle: string): string {
  const b = board.toLowerCase();
  if (b.includes("linkedin"))
    return `LinkedIn’s search and Recruiter products rank ${jobTitle} candidates by headline, skills, and keyword overlap with the role—treat it like an ATS with a public profile.`;
  if (b.includes("indeed"))
    return `Indeed applies filters and employer-sponsored keywords before your ${jobTitle} resume is seen—alignment with the posting’s terms still matters after the click.`;
  if (b.includes("greenhouse"))
    return `Greenhouse parses resumes into structured fields and scores ${jobTitle} applicants against the hiring team’s must-have criteria from the req.`;
  if (b.includes("lever"))
    return `Lever extracts text from uploads and matches ${jobTitle} applicants to the requisition’s skill and experience tokens recruiters set.`;
  if (b.includes("glassdoor"))
    return `Glassdoor feeds into employer ATS workflows; your ${jobTitle} application still lands in the same parser-driven queue as other boards.`;
  if (b.includes("dice") || b.includes("cyber"))
    return `Niche boards often push ${jobTitle} applications straight into specialized ATS queues—keyword discipline stays the same.`;
  if (b.includes("wellfound") || b.includes("angel"))
    return `Startup boards still run your ${jobTitle} profile and resume through ATS or CRM matching before founder interviews.`;
  if (b.includes("ashby"))
    return `Ashby combines sourcing and ATS—${jobTitle} applicants are scored against structured fields tied to the job’s keyword model.`;
  return `${board} routes ${jobTitle} applications into employer ATS tools that scan for exact skills and role titles from the posting.`;
}

export type ResumeTip = { title: string; body: string };

function buildFiveTips(role: JobRole): ResumeTip[] {
  const { title, industry, atsKeywords } = role;
  const top = atsKeywords.slice(0, 3).join(", ");

  return [
    {
      title: `Mirror the posting’s ${industry} vocabulary`,
      body: `Hiring teams configure ATS keyword lists around this ${title} role. Work phrases like ${top} into your summary and bullets where they reflect real experience—not as a block of tags.`,
    },
    {
      title: `Standard section labels beat creative headings`,
      body: `Parsing engines expect “Experience,” “Education,” and “Skills” for ${title} applicants. Fancy section names split content across fields and weaken keyword proximity.`,
    },
    {
      title: `Tie tools and methods to outcomes`,
      body: `For ${industry} roles, ATS and recruiters reward ${title} bullets that pair domain terms (${top}) with scope and results (team size, revenue, cycle time, accuracy).`,
    },
    {
      title: `Keep one column and simple file formats`,
      body: `Tables, icons, and multi-column layouts break extraction for ${title} resumes. A single-column PDF or DOCx with clear headings parses cleanly into Greenhouse, Workday, and Taleo.`,
    },
    {
      title: `Score your resume against a real JD before you apply`,
      body: `Paste a target ${title} job description into MatchRate with your resume to see match gaps, ATS-style feedback, and rewrites—under a minute, no card required for the free check.`,
    },
  ];
}

function buildFaqs(role: JobRole): { question: string; answer: string }[] {
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

function buildStructuredData(
  role: JobRole,
  canonicalUrl: string,
  tips: ResumeTip[],
  faqs: { question: string; answer: string }[]
) {
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `Five resume tips for ${role.title} applications`,
    description: `Actionable steps to improve ATS compatibility for ${role.title} roles in ${role.industry}.`,
    totalTime: "PT10M",
    tool: {
      "@type": "HowToTool",
      name: "matchrate.co resume analyzer",
    },
    step: tips.map((t, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: t.title,
      text: t.body,
    })),
  };

  const faqPage = {
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

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `ATS-optimised resume for ${role.title}`,
    url: canonicalUrl,
    description: role.metaDescription,
    isPartOf: {
      "@type": "WebSite",
      name: "matchrate.co",
      url: "https://www.matchrate.co",
    },
  };

  return [webPage, howTo, faqPage];
}

export default function JobRolePage() {
  const { slug } = useParams<{ slug: string }>();

  const role = slug ? jobRoleBySlug.get(slug) : undefined;

  const tips = useMemo(() => (role ? buildFiveTips(role) : []), [role]);
  const faqs = useMemo(() => (role ? buildFaqs(role) : []), [role]);

  if (!slug || !role) {
    return <Navigate to="/blog" replace />;
  }

  const canonicalUrl = `https://www.matchrate.co/resume/${role.slug}`;
  /** Include "MatchRate" so SEOHead does not append a duplicate brand suffix */
  const pageTitle = `ATS-Optimised Resume for ${role.title} — Free Checker | MatchRate`;
  const structuredData = buildStructuredData(role, canonicalUrl, tips, faqs);

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={role.metaDescription}
        keywords={`${role.title} resume, ATS resume, ${role.industry} resume keywords, job description match`}
        canonicalUrl={canonicalUrl}
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-warm-bg font-sans">
        <main className="container max-w-4xl mx-auto px-4 py-10 md:py-14">
          {/* Hero */}
          <section className="mb-12 md:mb-16">
            <div className="flex items-center gap-2 text-primary mb-4">
              <Target className="h-5 w-5" />
              <span className="text-sm font-medium">
                {role.industry} · {role.searchVolume === "high" ? "High-demand role" : "Active hiring"}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-warm-text mb-4 leading-tight">
              Get Your {role.title} Resume Past ATS Filters
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-3xl">
              Most {role.title} applications are rejected by ATS before a human reads them. Here&apos;s
              exactly what to fix.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <div className="flex items-start gap-3">
                <BarChart3 className="h-8 w-8 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">75%</p>
                  <p className="text-slate-700 font-medium">
                    of resumes are rejected by ATS before a recruiter sees them
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    Typical enterprise hiring funnel — your {role.title} CV has to survive automated
                    screening first.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ATS keywords */}
          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-warm-text mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-7 w-7 text-green-600" />
              What ATS Systems Look For in {role.title} Resumes
            </h2>
            <p className="text-slate-600 mb-8">
              These terms show up in real {role.title} job descriptions—parsers and recruiter
              filters use them to rank applicants.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {role.atsKeywords.map((keyword, i) => (
                <div
                  key={`${keyword}-${i}`}
                  className={`rounded-xl p-5 ${KEYWORD_CARD_STYLES[i % KEYWORD_CARD_STYLES.length]}`}
                >
                  <h3 className="font-bold text-slate-900 mb-2">{keyword}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {explainKeyword(keyword, role.title, i)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 5 tips */}
          <section className="mb-14" id="resume-tips">
            <h2 className="text-2xl md:text-3xl font-bold text-warm-text mb-2 flex items-center gap-2">
              <Lightbulb className="h-7 w-7 text-amber-500" />
              5 Resume Tips for {role.title} Applications
            </h2>
            <p className="text-slate-600 mb-8">
              Specific to {role.industry} and the keywords employers scan for.
            </p>
            <ol className="space-y-6 list-none pl-0">
              {tips.map((tip, i) => (
                <li
                  key={tip.title}
                  className={`bg-white border border-slate-200 rounded-r-xl rounded-l-none border-l-4 ${TIP_BORDER_ACCENT[i % TIP_BORDER_ACCENT.length]} pl-5 py-5 shadow-sm`}
                >
                  <span className="text-sm font-semibold text-slate-500 mb-1 block">
                    {i + 1}.
                  </span>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{tip.title}</h3>
                  <p className="text-slate-700 leading-relaxed text-sm md:text-base">{tip.body}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Job boards */}
          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-warm-text mb-2 flex items-center gap-2">
              <Briefcase className="h-7 w-7 text-primary" />
              Common Job Boards for {role.title} Roles
            </h2>
            <p className="text-slate-600 mb-8">
              Where {role.title} roles are posted—and what happens after you hit apply.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {role.commonJobBoards.map((board, i) => (
                <div
                  key={board}
                  className={`rounded-xl p-5 ${
                    i % 3 === 0
                      ? "bg-green-50 border border-green-200"
                      : i % 3 === 1
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-amber-50 border border-amber-200"
                  }`}
                >
                  <h3 className="font-bold text-slate-900 mb-2">{board}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {jobBoardAtsLine(board, role.title)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA — matches AIResumeWritersVsATS bottom CTA */}
          <section className="mb-14">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-3 text-warm-text">
                See exactly how your {role.title} resume scores
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Free analysis in under 60 seconds. No card required.
              </p>
              <Button asChild size="lg" className="cta-gradient">
                <Link to="/review">Analyse My Resume →</Link>
              </Button>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-warm-text mb-6 flex items-center gap-2">
              <HelpCircle className="h-7 w-7 text-slate-600" />
              {role.title} resume & ATS FAQ
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border border-slate-200 rounded-lg px-4 bg-white"
                >
                  <AccordionTrigger className="text-left font-semibold text-warm-text hover:no-underline py-4">
                    {f.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 pb-4 leading-relaxed">
                    {f.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <p className="text-sm text-slate-500 text-center">
            Typical salary band for reference: <strong>{role.salaryRange}</strong> (varies by
            market).
          </p>
        </main>

        <Footer />
      </div>
    </>
  );
}
