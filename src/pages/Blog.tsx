
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
          <h2 className="text-xl font-semibold mb-2">Why 95% of Resumes Get Rejected (And How to Fix Yours) in 2025</h2>
          <p className="text-slate-600 mb-4">The harsh reality of resume rejection and a step-by-step action plan to dramatically increase your interview success rate.</p>
          <p className="text-sm text-slate-400 mb-4">January 2025</p>
          <Button asChild className="w-full">
            <Link to="/blog/resume-rejection">Read More</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">How to Beat ATS Systems in 2025: The Complete Guide to Getting Past Resume Robots</h2>
          <p className="text-slate-600 mb-4">Learn exactly how to optimize your resume to consistently pass ATS filters and land more interviews with the latest strategies that actually work.</p>
          <p className="text-sm text-slate-400 mb-4">January 2025</p>
          <Button asChild className="w-full">
            <Link to="/blog/beat-ats">Read More</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">How to Instantly Improve Your Resume for Any Job Application</h2>
          <p className="text-slate-600 mb-4">Learn proven strategies to upgrade your resume today — using tactics hiring managers actually care about.</p>
          <p className="text-sm text-slate-400 mb-4">April 27, 2025</p>
          <Button asChild className="w-full">
            <Link to="/blog/improve-resume">Read More</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">ATS Systems Explained: How to Beat the Resume Robots in 2025</h2>
          <p className="text-slate-600 mb-4">Understanding ATS systems and how to optimize your resume to pass automated screenings.</p>
          <p className="text-sm text-slate-400 mb-4">April 27, 2025</p>
          <Button asChild className="w-full">
            <Link to="/blog/ats-systems">Read More</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Top 10 Resume Mistakes to Avoid</h2>
          <p className="text-slate-600 mb-4">Real insights from hiring managers on what makes them reject resumes instantly.</p>
          <p className="text-sm text-slate-400 mb-4">April 27, 2025</p>
          <Button asChild className="w-full">
            <Link to="/blog/resume-mistakes">Read More</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
