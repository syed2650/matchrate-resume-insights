
import { ArrowLeft, Target, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function ResumeRejection() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-16">
      <Link to="/blog" className="inline-flex items-center gap-2 text-warm-accent hover:text-warm-accent/80 mb-8">
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      <article className="prose prose-lg max-w-none">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-warm-text mb-4">
            Why 95% of Resumes Get Rejected (And How to Fix Yours) in 2025
          </h1>
          <p className="text-slate-600 text-lg">Last updated: January 2025</p>
        </header>

        <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-400 mr-3 mt-1" />
            <div>
              <p className="text-red-800 font-semibold">The harsh reality:</p>
              <p className="text-red-700">95% of resumes are rejected before a human ever sees them. That's not a typo—it's a documented fact that should terrify every job seeker in 2025.</p>
            </div>
          </div>
        </div>

        <p className="text-xl text-slate-700 leading-relaxed mb-8">
          Your resume is perfect. Your experience is solid. Your skills match the job requirements. So why aren't you getting interviews?
        </p>

        <p className="text-lg text-slate-600 mb-8">
          But here's the good news: once you understand exactly why resumes get rejected, you can fix these issues and dramatically increase your interview success rate. In this comprehensive guide, we'll expose the real reasons behind resume rejection and give you a step-by-step action plan to fix every single one.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            The Shocking Statistics Behind Resume Rejection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-blue-800 mb-3">The Numbers Don't Lie</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• 250 resumes submitted for every corporate job opening</li>
                <li>• 95% rejection rate across all industries and experience levels</li>
                <li>• 6 seconds average time recruiters spend reviewing resumes</li>
                <li>• 75% of resumes never reach human eyes (filtered by ATS)</li>
                <li>• 98% of Fortune 500 companies use automated screening systems</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-3">What This Means for You</h3>
              <p className="text-blue-700">
                If you're applying to jobs and not getting responses, you're not alone. But you also can't afford to keep making the same mistakes that are costing you opportunities.
              </p>
              <div className="bg-blue-100 p-4 rounded-lg mt-4">
                <p className="text-blue-800 font-medium">
                  The average job seeker sends 152 applications before landing an interview. With proper optimization, that number drops to just 15-20 applications.
                </p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-warm-text mb-6">The 12 Fatal Resume Mistakes That Guarantee Rejection</h2>

        <div className="space-y-8">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-red-600 mb-3">1. ATS Incompatibility (Responsible for 75% of Rejections)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">The Problem:</h4>
                <p className="text-slate-600 mb-4">Your resume can't be read by Applicant Tracking Systems</p>
                <h4 className="font-semibold text-slate-800 mb-2">Why It Happens:</h4>
                <ul className="text-slate-600 space-y-1">
                  <li>• Complex formatting with tables, columns, or graphics</li>
                  <li>• Headers and footers containing crucial information</li>
                  <li>• Non-standard fonts or excessive styling</li>
                  <li>• Wrong file format (.pages, .txt, or image files)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">The Fix:</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• Use simple, single-column layouts</li>
                  <li>• Save as .docx or .pdf only</li>
                  <li>• Place all information in the main document body</li>
                  <li>• Stick to standard fonts (Arial, Calibri, Times New Roman)</li>
                  <li>• Test your resume by copying and pasting into plain text</li>
                </ul>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <p className="text-green-800">
                <strong>Real Example:</strong> Sarah, a graphic designer, had a beautifully designed resume with creative layouts and custom fonts. Despite 200+ applications, she got zero responses. After switching to a simple, ATS-friendly format, she landed 3 interviews in two weeks.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-red-600 mb-3">2. Keyword Deficiency (Responsible for 68% of Rejections)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">The Problem:</h4>
                <p className="text-slate-600 mb-4">Your resume doesn't contain the specific keywords employers are searching for</p>
                <h4 className="font-semibold text-slate-800 mb-2">Why It Happens:</h4>
                <ul className="text-slate-600 space-y-1">
                  <li>• Using generic language instead of industry-specific terms</li>
                  <li>• Missing technical skills mentioned in job descriptions</li>
                  <li>• Outdated terminology that's no longer relevant</li>
                  <li>• Failure to include exact job title variations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">The Fix:</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• Analyze 5-10 target job descriptions for common keywords</li>
                  <li>• Include both spelled-out terms and acronyms (e.g., "Search Engine Optimization (SEO)")</li>
                  <li>• Use exact phrases from job postings when relevant</li>
                  <li>• Maintain 2-3% keyword density throughout your resume</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-red-600 mb-3">3. Lack of Quantified Achievements (Responsible for 62% of Rejections)</h3>
            <div className="mb-4">
              <h4 className="font-semibold text-slate-800 mb-2">The Problem:</h4>
              <p className="text-slate-600">Your resume lists responsibilities instead of demonstrating impact</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-800 mb-3">Before and After Examples:</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-red-500 font-bold">❌</span>
                    <span className="text-red-700">Weak: "Responsible for managing social media accounts"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✅</span>
                    <span className="text-green-700">Strong: "Managed 5 social media accounts with 100K+ followers, increasing engagement by 150% and generating 500+ qualified leads monthly"</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-red-500 font-bold">❌</span>
                    <span className="text-red-700">Weak: "Worked on software development projects"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✅</span>
                    <span className="text-green-700">Strong: "Led development of 3 customer-facing features using React and Node.js, reducing page load time by 40% and improving user satisfaction scores by 25%"</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-8">
          <h3 className="text-xl font-bold text-yellow-900 mb-4">The Cost of Resume Rejection</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Financial Impact</h4>
              <ul className="text-yellow-700 space-y-1 text-sm">
                <li>• Average unemployment: 5-6 months</li>
                <li>• Lost income: $50,000-$100,000+</li>
                <li>• Job search expenses: $3,000-$5,000</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Career Impact</h4>
              <ul className="text-yellow-700 space-y-1 text-sm">
                <li>• Skill atrophy during unemployment</li>
                <li>• Confidence erosion from rejections</li>
                <li>• Network deterioration</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Psychological Impact</h4>
              <ul className="text-yellow-700 space-y-1 text-sm">
                <li>• Stress and anxiety</li>
                <li>• Depression risk</li>
                <li>• Relationship strain</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-8">
          <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
            <CheckCircle className="h-6 w-6" />
            Your Resume Rescue Action Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Week 1: Diagnosis</h4>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Run ATS compatibility tests</li>
                <li>• Compare against job descriptions</li>
                <li>• Get professional feedback</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Week 2: Content</h4>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Rewrite professional summary</li>
                <li>• Overhaul experience section</li>
                <li>• Optimize skills and education</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Week 3: Testing</h4>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Refine format and design</li>
                <li>• Test ATS compatibility</li>
                <li>• Complete quality assurance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Week 4: Launch</h4>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Strategic application launch</li>
                <li>• Analyze performance</li>
                <li>• Set up continuous improvement</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-warm-bg border border-warm-accent/20 rounded-lg p-6 my-8">
          <h3 className="text-xl font-bold text-warm-text mb-4">Measuring Your Resume's Success</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-warm-text mb-2">Key Performance Indicators (KPIs)</h4>
              <ul className="text-slate-700 space-y-1">
                <li>• Application-to-response ratio: Target 15-20%</li>
                <li>• Response-to-interview ratio: Target 30-40%</li>
                <li>• Interview-to-offer ratio: Target 20-25%</li>
                <li>• Time to first response: Target under 1 week</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-warm-text mb-2">Quality Metrics</h4>
              <ul className="text-slate-700 space-y-1">
                <li>• Company tier responses: Track Fortune 500 interest</li>
                <li>• Role level responses: Monitor seniority matching</li>
                <li>• Compensation discussions: Salary negotiation %</li>
                <li>• Multiple offer scenarios: Competing offers frequency</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-warm-text mb-4">Conclusion: From Rejection to Interview Success</h2>
          <p className="text-lg text-slate-700 mb-6">
            The statistics are sobering: 95% of resumes get rejected. But now you understand exactly why this happens and, more importantly, how to fix it.
          </p>
          <p className="text-slate-700 mb-6">
            Resume rejection isn't about your qualifications or worth as a professional—it's about communication, optimization, and understanding the system. Every rejection reason we've covered has a concrete solution that you can implement immediately.
          </p>
          
          <div className="bg-warm-accent/10 border border-warm-accent/20 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-warm-text mb-3">Your resume rejection rescue plan:</h3>
            <ul className="text-slate-700 space-y-2">
              <li>• <strong>Audit ruthlessly:</strong> Identify and eliminate all rejection triggers</li>
              <li>• <strong>Optimize strategically:</strong> Implement ATS-friendly formatting and keyword optimization</li>
              <li>• <strong>Quantify everything:</strong> Transform responsibilities into achievement statements</li>
              <li>• <strong>Customize consistently:</strong> Tailor each application to specific job requirements</li>
              <li>• <strong>Test continuously:</strong> Monitor performance and refine based on results</li>
            </ul>
          </div>

          <p className="text-lg text-slate-700 mb-8">
            Remember: the goal isn't just to avoid rejection—it's to create a resume so compelling that hiring managers can't wait to meet you.
          </p>

          <div className="bg-gradient-to-r from-warm-accent/10 to-blue-500/10 border border-warm-accent/30 rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold text-warm-text mb-4">Ready to rescue your resume from the 95% rejection pile?</h3>
            <p className="text-slate-700 mb-6">
              Our AI-powered analysis tool can identify specific rejection risks in your resume and provide personalized optimization recommendations to dramatically improve your success rate.
            </p>
            <div className="space-y-4">
              <Button 
                size="lg"
                className="cta-gradient text-white px-8 py-3"
                onClick={() => window.location.href = '/review'}
              >
                <Target className="mr-2 h-5 w-5" />
                Get Your Free Resume Analysis
              </Button>
              <p className="text-sm text-slate-600">
                Stop the rejection cycle today. Get instant feedback on why your resume might be getting rejected and receive specific recommendations to fix every issue.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
