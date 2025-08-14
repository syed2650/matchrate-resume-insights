import { ScrollText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { InternalLinkNav } from "@/components/InternalLinkNav";

export default function Blog() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "MatchRate Resume Success Blog",
    "description": "Expert career advice, resume optimization tips, and job search strategies to help you land more interviews and advance your career.",
    "url": "https://www.matchrate.co/blog",
    "publisher": {
      "@type": "Organization",
      "name": "MatchRate",
      "logo": "https://www.matchrate.co/lovable-uploads/1995df7f-73f3-4583-9980-04dc5569cd1d.png"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.matchrate.co/blog"
    }
  };

  return (
    <>
      <SEOHead
        title="Resume Success Blog - Expert Career Advice & Job Search Tips"
        description="Expert career advice, resume optimization tips, and job search strategies. Learn from data-driven insights to improve your resume and land more interviews."
        keywords="resume tips, career advice, job search strategies, ATS optimization, resume writing, interview tips, career development"
        canonicalUrl="https://www.matchrate.co/blog"
        structuredData={structuredData}
      />
      <div className="container max-w-screen-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <ScrollText className="h-8 w-8" />
        Resume Success Blog
      </h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">LinkedIn Profile Optimization: How to Get Recruiters to Find YOU (Data from 8,000+ Profiles)</h2>
          <p className="text-slate-600 mb-4">Your resume gets you past ATS systems, but your LinkedIn profile gets recruiters to chase YOU. We analyzed 8,247 LinkedIn profiles across 15 industries to reveal the shocking truth: 93% of professionals have profiles that recruiters will never find.</p>
          <p className="text-sm text-slate-400 mb-4">July 2025</p>
          <Button asChild className="w-full">
            <Link to="/blog/linkedin-profile-optimization">Read More</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Resume Templates That Pass Every ATS: Visual Analysis of 5,000+ Successful Formats (2025 Study)</h2>
          <p className="text-slate-600 mb-4">Beautiful resume templates are everywhere. ATS-compatible templates that actually work? Almost impossible to find. We analyzed 5,247 successful resume formats that not only passed ATS screening but generated interview requests across 12 major platforms.</p>
          <p className="text-sm text-slate-400 mb-4">June 2025</p>
          <Button asChild className="w-full">
            <Link to="/blog/resume-templates-ats">Read More</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Resume Keywords That Actually Work: Data from 10,000+ ATS Scans (2025 Analysis)</h2>
          <p className="text-slate-600 mb-4">After reverse-engineering 15+ major ATS platforms and analyzing 10,247 resume scans, discover exactly which keywords lead to interview requests and which send resumes to the digital graveyard. This data contradicts popular advice 73% of the time.</p>
          <p className="text-sm text-slate-400 mb-4">June 2025</p>
          <Button asChild className="w-full">
            <Link to="/blog/resume-keywords-data">Read More</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">The ATS Algorithm Exposed: How Resume Scanners Actually Work in 2025 (And How to Beat Them)</h2>
          <p className="text-slate-600 mb-4">After reverse-engineering 15+ major ATS platforms and analyzing thousands of resume processing logs, discover exactly how these systems evaluate your resume and the advanced strategies to systematically optimize for algorithmic logic.</p>
          <p className="text-sm text-slate-400 mb-4">December 2024</p>
          <Button asChild className="w-full">
            <Link to="/blog/ats-algorithm-exposed">Read More</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Resume Psychology: What Hiring Managers Actually Think When They Read Your Resume (Industry Insider Secrets)</h2>
          <p className="text-slate-600 mb-4">Ever wondered what's really going through a hiring manager's mind when they scan your resume? Uncover the 7 psychological triggers that control hiring decisions and learn exactly how to leverage human psychology to make your resume irresistible.</p>
          <p className="text-sm text-slate-400 mb-4">January 2025</p>
          <Button asChild className="w-full">
            <Link to="/blog/resume-psychology">Read More</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Resume Format That Actually Gets Interviews: 2025 ATS-Friendly Templates</h2>
          <p className="text-slate-600 mb-4">The difference between a resume that gets noticed and one that gets rejected often comes down to format. Here's exactly how to structure your resume for both ATS systems and human recruiters in 2025.</p>
          <p className="text-sm text-slate-400 mb-4">February 2025</p>
          <Button asChild className="w-full">
            <Link to="/blog/resume-format-guide">Read More</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">10 Resume Mistakes That Guarantee Rejection (And How to Fix Them in 2025)</h2>
          <p className="text-slate-600 mb-4">Complete guide to the most common resume mistakes that lead to instant rejection, with actionable fixes for each one.</p>
          <p className="text-sm text-slate-400 mb-4">March 2025</p>
          <Button asChild className="w-full">
            <Link to="/blog/resume-rejection-mistakes">Read More</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Resume Keywords That Actually Work: The Complete Guide to Resume Keyword Optimization in 2025</h2>
          <p className="text-slate-600 mb-4">Discover the exact keywords that hiring managers and ATS systems are looking for, plus proven strategies to incorporate them naturally into your resume.</p>
          <p className="text-sm text-slate-400 mb-4">April 2025</p>
          <Button asChild className="w-full">
            <Link to="/blog/resume-keywords">Read More</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Why 95% of Resumes Get Rejected (And How to Fix Yours) in 2025</h2>
          <p className="text-slate-600 mb-4">The harsh reality of resume rejection and a step-by-step action plan to dramatically increase your interview success rate.</p>
          <p className="text-sm text-slate-400 mb-4">May 2025</p>
          <Button asChild className="w-full">
            <Link to="/blog/resume-rejection">Read More</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">How to Beat ATS Systems in 2025: The Complete Guide to Getting Past Resume Robots</h2>
          <p className="text-slate-600 mb-4">Learn exactly how to optimize your resume to consistently pass ATS filters and land more interviews with the latest strategies that actually work.</p>
          <p className="text-sm text-slate-400 mb-4">June 2025</p>
          <Button asChild className="w-full">
            <Link to="/blog/beat-ats">Read More</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Free vs Paid Resume Checkers: Complete Comparison Guide (2025)</h2>
          <p className="text-slate-600 mb-4">Wondering whether free resume checkers are good enough, or if you need to invest in a paid service? Complete analysis of 15+ tools to help you choose.</p>
          <p className="text-sm text-slate-400 mb-4">July 2025</p>
          <Button asChild className="w-full">
            <Link to="/blog/free-vs-paid-checkers">Read More</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">How to Instantly Improve Your Resume for Any Job Application</h2>
          <p className="text-slate-600 mb-4">Learn proven strategies to upgrade your resume today — using tactics hiring managers actually care about.</p>
          <p className="text-sm text-slate-400 mb-4">August 2025</p>
          <Button asChild className="w-full">
            <Link to="/blog/improve-resume">Read More</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">ATS Systems Explained: How to Beat the Resume Robots in 2025</h2>
          <p className="text-slate-600 mb-4">Understanding ATS systems and how to optimize your resume to pass automated screenings.</p>
          <p className="text-sm text-slate-400 mb-4">September 2025</p>
          <Button asChild className="w-full">
            <Link to="/blog/ats-systems">Read More</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Top 10 Resume Mistakes to Avoid</h2>
          <p className="text-slate-600 mb-4">Real insights from hiring managers on what makes them reject resumes instantly.</p>
          <p className="text-sm text-slate-400 mb-4">October 2025</p>
          <Button asChild className="w-full">
            <Link to="/blog/resume-mistakes">Read More</Link>
          </Button>
        </Card>
      </div>
      
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to put these tips into action?</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Get personalized feedback on your resume with our AI-powered analysis
        </p>
        <Button asChild size="lg">
          <Link to="/review">Analyze Your Resume Now</Link>
        </Button>
      </div>
      </div>
      
      <InternalLinkNav currentPage="blog" />
    </>
  );
}
