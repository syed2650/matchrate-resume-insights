
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
