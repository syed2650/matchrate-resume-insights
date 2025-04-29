
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/sections/Footer";
import Header from "@/components/sections/Header";

export default function ImproveResume() {
  return (
    <div className="min-h-screen bg-warm-bg font-sans">
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-50">
        <Header />
      </div>
      
      <div className="container max-w-screen-lg mx-auto px-4 py-12">
        <article className="prose prose-slate max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            How to Instantly Improve Your Resume for Any Job Application 
            <span className="block text-xl md:text-2xl text-slate-500 font-normal mt-2">
              (Without Hiring a Career Coach)
            </span>
          </h1>
          
          <p className="text-lg text-slate-700 mb-8">
            The job market is tougher than ever. With hundreds of resumes flooding every posting, 
            you need a resume that stands out instantly — without spending thousands of dollars on a professional coach.
            Good news: You can do it yourself.
            In this guide, you'll learn proven strategies to upgrade your resume today — using tactics hiring managers actually care about.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Understand the Purpose of Your Resume</h2>
          <p className="text-slate-700">
            Your resume isn't a biography — it's a marketing document.
            Its only job? Win you an interview.
          </p>
          <p className="text-slate-700 ml-6">
            🔹 Focus on your achievements, not your duties.<br />
            🔹 Quantify your impact ("Increased sales by 25%", "Reduced project timeline by 30%").
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Customize It for Every Job</h2>
          <p className="text-slate-700">
            No more sending the same resume to 100 companies.
          </p>
          <p className="text-slate-700 ml-6">
            ✅ Mirror the job description keywords.<br />
            ✅ Highlight directly relevant experiences.<br />
            ✅ Use role-specific language (e.g., "campaign optimization" for marketing, "data-driven decisions" for analysts).
          </p>
          <p className="text-slate-700">
            Tip: Matchrate.co makes this easier by analyzing JD vs Resume.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Optimize for ATS Systems</h2>
          <p className="text-slate-700">
            If a robot can't read your resume, a human never will.
          </p>
          <p className="text-slate-700 ml-6">
            🚫 No fancy tables, graphics, or columns.<br />
            🚫 No weird fonts.<br />
            ✅ Use simple headings (Experience, Skills, Education).
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Start with a Strong Professional Summary</h2>
          <p className="text-slate-700">
            Forget the "Objective Statements" of the past.
            Write a 3-4 line summary that shows:
          </p>
          <p className="text-slate-700 ml-6">
            🔸 Your title ("Experienced Product Manager")<br />
            🔸 Your unique value ("driving revenue growth through innovative strategies")<br />
            🔸 Your career goal ("seeking to leverage expertise at a fast-paced SaaS company")
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. List Key Skills</h2>
          <p className="text-slate-700">
            Most hiring managers skim.
          </p>
          <p className="text-slate-700 ml-6">
            ✅ Create a bullet list of 6–8 core skills right below your summary.
          </p>
          <p className="text-slate-700">
            Examples:
          </p>
          <ul className="grid grid-cols-2 gap-2 ml-6">
            <li className="text-slate-700">Project Management</li>
            <li className="text-slate-700">SQL & Data Visualization</li>
            <li className="text-slate-700">Budget Forecasting</li>
            <li className="text-slate-700">B2B Marketing Strategies</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Turn Responsibilities into Achievements</h2>
          <p className="text-slate-700">
            Boring:<br />
            <em className="text-slate-500">Responsible for managing social media accounts.</em>
          </p>
          <p className="text-slate-700">
            Better:<br />
            <em className="text-slate-500">Increased Instagram engagement by 40% in six months through targeted content strategies.</em>
          </p>
          <p className="text-slate-700">
            Always ask yourself:<br />
            ➔ What did I achieve?<br />
            ➔ How did it help the company?
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Use Action Verbs</h2>
          <p className="text-slate-700">
            Start every bullet point with a strong verb.
          </p>
          <p className="text-slate-700">
            Examples:
          </p>
          <ul className="grid grid-cols-3 gap-2 ml-6">
            <li className="text-slate-700">Spearheaded</li>
            <li className="text-slate-700">Designed</li>
            <li className="text-slate-700">Analyzed</li>
            <li className="text-slate-700">Implemented</li>
            <li className="text-slate-700">Optimized</li>
            <li className="text-slate-700">Negotiated</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Include Metrics Everywhere</h2>
          <p className="text-slate-700">
            Numbers = Credibility.
          </p>
          <p className="text-slate-700">
            Instead of:<br />
            <em className="text-slate-500">Managed email marketing campaigns.</em>
          </p>
          <p className="text-slate-700">
            Write:<br />
            <em className="text-slate-500">Launched targeted email campaigns, resulting in a 15% boost in conversion rates.</em>
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Keep It Concise</h2>
          <p className="text-slate-700">
            One-page resumes are the standard in 2025 — unless you're a senior executive (then 2 pages maximum).
          </p>
          <p className="text-slate-700 ml-6">
            🔹 Trim old jobs (>10 years ago) unless relevant.<br />
            🔹 Focus on the last 5–7 years of experience.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Proofread Like Your Life Depends on It</h2>
          <p className="text-slate-700">
            Typos = 🚩 🚩 🚩
          </p>
          <p className="text-slate-700 ml-6">
            ✅ Run spelling and grammar checks.<br />
            ✅ Read it aloud.<br />
            ✅ Ask a trusted friend (or use Matchrate.co's feedback tool).
          </p>

          <div className="bg-warm-bg border border-slate-200 rounded-lg p-6 my-8">
            <h3 className="text-xl font-semibold mb-2">Bonus: Use Matchrate.co to Instantly Improve</h3>
            <p className="text-slate-700">
              Matchrate.co's AI-powered resume checker:
            </p>
            <ul className="space-y-2 mt-2">
              <li className="flex items-start">
                <span className="mr-2">📋</span>
                <span>Compares your resume to the job description</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🏆</span>
                <span>Gives you a Relevance Score</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🚀</span>
                <span>Suggests keywords and missing sections</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✍️</span>
                <span>Rewrites resume sections automatically</span>
              </li>
            </ul>
            <p className="mt-4 font-medium">Get 10x feedback in minutes — no career coach required.</p>
            
            <div className="mt-6">
              <Link to="/review">
                <Button className="bg-warm-accent hover:bg-warm-accent/90 text-white">
                  Start Improving Your Resume Today <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Conclusion</h2>
          <p className="text-slate-700">
            You don't need a $500/hr career coach.<br />
            You need a smart strategy, a modern resume, and the right tools.<br />
            Start applying these tips today — and let Matchrate.co help you land your next dream role faster.
          </p>
        </article>
      </div>
      
      <Footer />
    </div>
  );
}
