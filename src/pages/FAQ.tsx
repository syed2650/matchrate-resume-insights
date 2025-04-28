
import { Card } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export default function FAQ() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <HelpCircle className="h-8 w-8" />
        Frequently Asked Questions
      </h1>
      
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">What is Matchrate.co?</h3>
          <p className="text-slate-600">Matchrate.co is an AI-powered platform that analyzes your resume, evaluates your ATS readiness, identifies missing keywords, and provides actionable feedback — helping you significantly improve your chances of getting interviews.</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">How does the resume analysis work?</h3>
          <p className="text-slate-600 mb-4">We use a combination of professional resume standards, recruiter best practices, and AI-driven analysis to:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>Assess the relevance of your resume to a job description</li>
            <li>Check your resume's ATS compatibility</li>
            <li>Identify missing keywords and skills gaps</li>
            <li>Suggest section-by-section improvements</li>
            <li>Rewrite resume bullets using the STAR method (Action + Result)</li>
            <li>Provide a final "Would I Interview You?" verdict</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">What is an ATS, and why does it matter?</h3>
          <p className="text-slate-600">An ATS (Applicant Tracking System) is software used by companies to automatically scan, filter, and rank resumes. If your resume isn't ATS-optimized, it may never even reach a human recruiter. We make sure your resume is formatted and keyworded correctly to pass these systems.</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">How accurate are the scores?</h3>
          <p className="text-slate-600">Our scoring models are built using real-world data from hiring managers, recruiters, and ATS parsing patterns. While no tool can guarantee a job, Matchrate.co gives you the clearest possible picture of your resume's strengths and weaknesses.</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">What do I get after analysis?</h3>
          <p className="text-slate-600">
            • A full feedback report<br/>
            • Relevance Score and ATS Readiness Score<br/>
            • Actionable fixes to improve your resume immediately<br/>
            • Optionally, a professionally rewritten resume (for premium users)
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">Is my data safe?</h3>
          <p className="text-slate-600">✅ 100%. We do NOT sell, share, or store your resumes longer than necessary. Our platform is built with privacy and security as top priorities.</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">How much does Matchrate.co cost?</h3>
          <p className="text-slate-600">
            We offer:<br/>
            • Free Plan: 1 resume review per day<br/>
            • Paid Plans: Unlock 30 reviews and 15 professional rewrites monthly<br/>
            (Full pricing details on our Pricing Page)
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">Do you offer refunds?</h3>
          <p className="text-slate-600">We do not offer refunds, as resume analysis and rewriting are instant digital services. However, we are committed to customer satisfaction, and if you face any issues, please contact our support team.</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">Can Matchrate.co guarantee a job offer?</h3>
          <p className="text-slate-600">While we significantly improve your chances by strengthening your resume, we cannot guarantee job placements. We provide you the best possible tools to maximize your success.</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">How can I contact support?</h3>
          <p className="text-slate-600">You can reach us anytime at support@matchrate.co. We usually respond within 24 hours!</p>
        </Card>
      </div>
    </div>
  );
}
