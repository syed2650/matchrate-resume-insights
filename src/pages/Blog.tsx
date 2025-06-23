import { ScrollText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Blog() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <ScrollText className="h-8 w-8" />
        Resume Success Blog
      </h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}
