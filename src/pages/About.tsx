import { Info } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { InternalLinkNav } from "@/components/InternalLinkNav";

export default function About() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About MatchRate",
    "description": "Learn about MatchRate.co - AI-powered resume analysis and optimization platform helping job seekers land more interviews through expert feedback and ATS optimization.",
    "url": "https://www.matchrate.co/about",
    "mainEntity": {
      "@type": "Organization",
      "name": "MatchRate",
      "url": "https://www.matchrate.co",
      "logo": "https://www.matchrate.co/lovable-uploads/1995df7f-73f3-4583-9980-04dc5569cd1d.png",
      "description": "AI-powered resume analysis and feedback tailored to specific job descriptions.",
      "foundingDate": "2024",
      "founder": {
        "@type": "Organization",
        "name": "MatchRate Team"
      },
      "serviceArea": "Global",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Resume Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "AI Resume Analysis",
              "description": "Expert AI feedback on resumes tailored to specific job descriptions"
            }
          }
        ]
      }
    }
  };

  return (
    <>
      <SEOHead
        title="About MatchRate - AI Resume Analysis & Career Optimization Platform"
        description="Learn about MatchRate.co - AI-powered resume analysis and optimization platform helping job seekers land more interviews through expert feedback and ATS optimization."
        keywords="about matchrate, resume analysis company, AI career platform, resume optimization service, job application help"
        canonicalUrl="https://www.matchrate.co/about"
        structuredData={structuredData}
      />
      <div className="container max-w-screen-xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Info className="h-8 w-8" />
          About Matchrate.co
        </h1>
        
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">Revolutionizing Resume Reviews and Job Matching</h2>
          <p className="text-lg text-slate-600 mb-6">
            At Matchrate.co, we believe that landing your dream job shouldn't be a guessing game.
            We are here to empower job seekers by providing honest, actionable, and professional feedback on their resumes — using cutting-edge AI technology, fine-tuned specifically for resume optimization, ATS compatibility, and real-world hiring practices.
          </p>
          
          <p className="text-slate-600 mb-6">
            Every resume you upload isn't just "analyzed" — it is optimized against modern recruiter expectations and applicant tracking systems (ATS).
            Our mission is simple: help you match better, faster, and smarter with the roles you deserve.
          </p>
          
          <p className="text-slate-600 mb-8">
            We've built Matchrate.co because job seekers deserve clarity, fairness, and tools that actually work — not just another vague "score" or gimmicky advice.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Why Matchrate.co?</h2>
          <ul className="space-y-2 text-slate-600 mb-8">
            <li>✅ Real feedback from AI trained on thousands of hiring patterns.</li>
            <li>✅ Personalized action plans to fix your resume immediately.</li>
            <li>✅ ATS Readiness checks to boost your interview chances.</li>
            <li>✅ Professional resume rewrites to maximize your application success.</li>
          </ul>

          <p className="text-slate-600 mb-8">
            Whether you're a fresh graduate, a career switcher, or an experienced executive —<br/>
            Matchrate.co is your secret weapon to stand out.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Our Promise</h2>
          <p className="text-slate-600 mb-8">
            No jargon. No fake scores. Just actionable results.<br/><br/>
            Transparent. Professional. Built for real-world hiring.<br/><br/>
            Your success is our mission.<br/><br/>
            Welcome to Matchrate.co —<br/>
            Where Resumes Get Smarter.
          </p>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-semibold mb-3">Ready to optimize your resume?</h3>
            <p className="text-slate-600 mb-4">
              Join thousands of job seekers who have improved their interview rates with our AI-powered resume analysis.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="/review" className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Start Free Analysis
              </a>
              <a href="/blog" className="inline-flex items-center px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors">
                Read Success Stories
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <InternalLinkNav currentPage="about" />
    </>
  );
}