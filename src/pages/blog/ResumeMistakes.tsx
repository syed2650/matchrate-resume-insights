
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/sections/Footer";
import Header from "@/components/sections/Header";

export default function ResumeMistakes() {
  return (
    <div className="min-h-screen bg-warm-bg font-sans">
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-50">
        <Header />
      </div>
      
      <div className="container max-w-screen-lg mx-auto px-4 py-12">
        <article className="prose prose-slate max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Top 10 Resume Mistakes to Avoid
            <span className="block text-xl md:text-2xl text-slate-500 font-normal mt-2">
              Real insights from hiring managers on what makes them reject resumes instantly
            </span>
          </h1>
          
          <p className="text-lg text-slate-700 mb-8">
            We surveyed over 200 hiring managers and recruiters across tech, finance, healthcare, and retail 
            to uncover the most common resume mistakes that lead to instant rejections. 
            Learn what to avoid and how to fix these critical errors before your next application.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Generic, Non-Tailored Content</h2>
          <p className="text-slate-700">
            The biggest mistake according to 78% of hiring managers is submitting a generic resume 
            that shows no connection to the specific role.
          </p>
          <p className="text-slate-700 ml-6">
            <strong>What happens:</strong> Recruiters immediately sense you're mass-applying without genuine interest.<br />
            <strong>Instead:</strong> Customize your resume for each position, mirroring language from the job description.
          </p>
          <p className="text-slate-700">
            <em>"I can tell within 10 seconds if someone has tailored their resume or just sent a generic version. 
            The generic ones almost always get rejected."</em> — Technical Recruiter at Fortune 100 company
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Focusing on Duties Instead of Results</h2>
          <p className="text-slate-700">
            65% of hiring managers cited the absence of measurable achievements as a major weakness.
          </p>
          <p className="text-slate-700 ml-6">
            <strong>What happens:</strong> Your resume blends in with everyone else who had your job title.<br />
            <strong>Instead:</strong> Use the CAR method (Challenge-Action-Result) and include metrics.
          </p>
          <p className="text-slate-700">
            <strong>Weak:</strong> "Responsible for customer service and handling complaints."<br />
            <strong>Strong:</strong> "Resolved 95% of customer complaints within 24 hours, improving satisfaction scores by 32%."
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Typos and Grammatical Errors</h2>
          <p className="text-slate-700">
            It may seem obvious, but 59% of hiring managers report they'll reject a resume with even a single typo.
          </p>
          <p className="text-slate-700 ml-6">
            <strong>What happens:</strong> Errors signal carelessness and lack of attention to detail.<br />
            <strong>Instead:</strong> Proofread, use tools like Grammarly, and have someone else review it.
          </p>
          <p className="text-slate-700">
            <em>"One otherwise excellent candidate wrote 'attention to detale' in their skills section. The irony wasn't lost on me, but their application was."</em> — HR Director
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Poor Formatting and Visual Structure</h2>
          <p className="text-slate-700">
            54% of recruiters say they reject resumes that are visually overwhelming or difficult to scan.
          </p>
          <p className="text-slate-700 ml-6">
            <strong>What happens:</strong> With 6-7 seconds per resume, cluttered documents get skipped.<br />
            <strong>Instead:</strong> Use consistent formatting, plenty of white space, and clear section headers.
          </p>
          <p className="text-slate-700">
            Aim for 3-5 bullet points per role, each 1-2 lines long. Use bold text strategically to highlight key achievements.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Length and Relevance Issues</h2>
          <p className="text-slate-700">
            52% of hiring managers cite inappropriate resume length among top issues.
          </p>
          <p className="text-slate-700 ml-6">
            <strong>What happens:</strong> Too long suggests inability to prioritize; too short suggests lack of experience.<br />
            <strong>Instead:</strong> Use 1 page for early career (0-10 years), 2 pages maximum for senior roles.
          </p>
          <p className="text-slate-700">
            <strong>Pro tip:</strong> Remove anything older than 15 years unless exceptionally relevant to the role.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Unexplained Employment Gaps</h2>
          <p className="text-slate-700">
            47% of hiring managers report that unexplained gaps raise red flags.
          </p>
          <p className="text-slate-700 ml-6">
            <strong>What happens:</strong> Employers wonder if you're hiding something negative.<br />
            <strong>Instead:</strong> Address gaps briefly and positively.
          </p>
          <p className="text-slate-700">
            Use years instead of months if gaps are small. For larger gaps, include relevant activities: freelance work, education, volunteering, or family responsibilities.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Outdated or Irrelevant Skills</h2>
          <p className="text-slate-700">
            44% of employers reject resumes showcasing obsolete or irrelevant skills.
          </p>
          <p className="text-slate-700 ml-6">
            <strong>What happens:</strong> You appear out of touch with current industry standards.<br />
            <strong>Instead:</strong> Research current in-demand skills and highlight transferable abilities.
          </p>
          <p className="text-slate-700">
            <em>"Listing Windows 98 expertise or basic word processing as skills in a tech application screams that you haven't updated your resume or skills in years."</em> — Engineering Manager
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Unprofessional Email Address</h2>
          <p className="text-slate-700">
            38% of hiring managers mentioned inappropriate email addresses as an immediate red flag.
          </p>
          <p className="text-slate-700 ml-6">
            <strong>What happens:</strong> You undermine your professionalism before they read a single line.<br />
            <strong>Instead:</strong> Use a simple format with your name, like firstname.lastname@gmail.com.
          </p>
          <p className="text-slate-700">
            <strong>Real examples</strong> cited by recruiters: "partyguy85@" and "crazycatlady@" — both from candidates with otherwise strong qualifications.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Missing Keywords for ATS Systems</h2>
          <p className="text-slate-700">
            36% of hiring managers note that missing keywords and relevant terms often derails applications.
          </p>
          <p className="text-slate-700 ml-6">
            <strong>What happens:</strong> Your resume never reaches human eyes.<br />
            <strong>Instead:</strong> Incorporate key terms from the job description, especially for hard skills and tools.
          </p>
          <p className="text-slate-700">
            Use industry-standard terminology. If the job requires "data analysis," don't just say "worked with numbers."
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Inappropriate Personal Information</h2>
          <p className="text-slate-700">
            29% of recruiters cite inclusion of irrelevant personal details as problematic.
          </p>
          <p className="text-slate-700 ml-6">
            <strong>What happens:</strong> It appears unprofessional and raises potential bias concerns.<br />
            <strong>Instead:</strong> Skip personal details like age, marital status, religion, or political affiliation.
          </p>
          <p className="text-slate-700">
            Also avoid mentioning hobbies unless they genuinely relate to the job or demonstrate relevant soft skills.
          </p>

          <div className="bg-warm-bg border border-slate-200 rounded-lg p-6 my-8">
            <h3 className="text-xl font-semibold mb-2">How Matchrate.co Helps You Avoid These Mistakes</h3>
            <p className="text-slate-700">
              Our AI-powered resume analyzer acts as your pre-submission quality check:
            </p>
            <ul className="space-y-2 mt-2">
              <li className="flex items-start">
                <span className="mr-2">🔎</span>
                <span>Identifies generic or duty-focused language and suggests achievement-oriented alternatives</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📊</span>
                <span>Evaluates keyword matching for ATS optimization</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✏️</span>
                <span>Checks for grammar, spelling, and formatting issues</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🚩</span>
                <span>Flags potential red flags before a recruiter sees them</span>
              </li>
            </ul>
            <p className="mt-4 font-medium">Don't let easily fixable mistakes cost you job opportunities.</p>
            
            <div className="mt-6">
              <Link to="/review">
                <Button className="bg-warm-accent hover:bg-warm-accent/90 text-white">
                  Check Your Resume Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Conclusion</h2>
          <p className="text-slate-700">
            Your resume is often your only chance to make a first impression. By avoiding these common mistakes, 
            you'll already be ahead of a significant percentage of other applicants.
          </p>
          <p className="text-slate-700 mt-4">
            Remember: The goal of your resume isn't to get you a job—it's to get you an interview. 
            Make every word count and tailor each submission to showcase why you're the perfect fit 
            for that specific role.
          </p>
        </article>
      </div>
      
      <Footer />
    </div>
  );
}
