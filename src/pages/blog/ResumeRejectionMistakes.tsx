
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/sections/Footer";
import Header from "@/components/sections/Header";

export default function ResumeRejectionMistakes() {
  return (
    <div className="min-h-screen bg-warm-bg font-sans">
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-50">
        <Header />
      </div>
      
      <div className="container max-w-screen-lg mx-auto px-4 py-12">
        <article className="prose prose-slate max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            10 Resume Mistakes That Guarantee Rejection (And How to Fix Them in 2025)
          </h1>
          
          <p className="text-sm text-slate-500 mb-6 italic">Last updated: January 2025</p>
          
          <p className="text-lg text-slate-700 mb-8">
            Sending out dozens of resumes but hearing nothing back? You're probably making one (or more) of these critical resume mistakes that instantly disqualify you from consideration.
          </p>

          <p className="text-slate-700 mb-6">
            The harsh reality: <strong>hiring managers and ATS systems reject 95% of resumes</strong> within the first 10 seconds of review. But here's the good news—most rejections aren't due to lack of qualifications. They're caused by easily fixable mistakes that most job seekers don't even realize they're making.
          </p>

          <p className="text-slate-700 mb-8">
            In this comprehensive guide, we'll expose the 10 most common resume mistakes that guarantee rejection and show you exactly how to fix each one. By the end, you'll know how to craft a resume that consistently lands interviews instead of ending up in the digital trash bin.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">The Cost of Resume Mistakes in 2025</h2>
          
          <p className="text-slate-700 mb-4">
            Before diving into specific mistakes, let's understand what's at stake:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">The Numbers Don't Lie</h3>
          <ul className="text-slate-700 mb-4">
            <li><strong>Average hiring manager spends 7.4 seconds</strong> reviewing a resume initially</li>
            <li><strong>75% of resumes are rejected by ATS systems</strong> before human review</li>
            <li><strong>1 in 250 resumes</strong> receives a callback on average</li>
            <li><strong>Job seekers send an average of 152 applications</strong> before landing an interview</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">The Hidden Cost of Resume Mistakes</h3>
          <ul className="text-slate-700 mb-4">
            <li><strong>Extended unemployment</strong>: Average job search duration of 5-6 months</li>
            <li><strong>Lost income potential</strong>: $50,000-$100,000+ in salary during extended search</li>
            <li><strong>Opportunity cost</strong>: Missing out on career advancement and skill development</li>
            <li><strong>Psychological impact</strong>: Decreased confidence and motivation from repeated rejections</li>
          </ul>

          <p className="text-slate-700 mb-8 font-semibold">
            The bottom line: Every resume mistake potentially costs you thousands of dollars and months of your career.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Mistake #1: Using a Generic, One-Size-Fits-All Resume</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Why This Kills Your Chances</h3>
          <p className="text-slate-700 mb-4">
            <strong>87% of hiring managers can spot a generic resume</strong> within seconds. Using the same resume for every application signals that you haven't taken time to understand the specific role or company.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">The Problem in Action</h3>
          <ul className="text-slate-700 mb-4">
            <li>Your resume says "seeking opportunities in marketing" for a "Senior Digital Marketing Manager" position</li>
            <li>You list every skill you've ever used instead of highlighting relevant ones</li>
            <li>Your professional summary could apply to anyone in your field</li>
            <li>No mention of company-specific keywords or requirements</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">The Fix: Customization Strategy</h3>
          <p className="text-slate-700 mb-4">
            <strong>Create 2-3 master resume versions</strong> for different role types, then customize 25-30% for each application:
          </p>

          <div className="bg-slate-50 border-l-4 border-blue-500 p-4 mb-6">
            <h4 className="font-semibold mb-2">Step 1: Analyze the Job Description</h4>
            <ul className="text-slate-700">
              <li>Identify 5-8 key requirements</li>
              <li>Note specific keywords and phrases used</li>
              <li>Understand the company culture and values</li>
              <li>Look for "must-have" vs. "nice-to-have" qualifications</li>
            </ul>
          </div>

          <div className="bg-slate-50 border-l-4 border-blue-500 p-4 mb-6">
            <h4 className="font-semibold mb-2">Step 2: Customize Your Professional Summary</h4>
            <div className="mb-4">
              <p className="text-red-600 font-medium">❌ Generic:</p>
              <p className="italic">"Marketing professional with 5+ years of experience seeking growth opportunities"</p>
            </div>
            <div>
              <p className="text-green-600 font-medium">✅ Customized:</p>
              <p className="italic">"Digital Marketing Manager with 5+ years driving growth for B2B SaaS companies. Expert in demand generation, marketing automation, and data-driven campaign optimization—directly aligned with [Company]'s focus on scalable customer acquisition."</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Mistake #2: Terrible Professional Summary (Or Missing One Entirely)</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Why This Is Career Suicide</h3>
          <p className="text-slate-700 mb-4">
            <strong>Your professional summary is prime real estate</strong>—the first thing hiring managers read. A weak or missing summary means you've wasted your most important 3-4 lines of text.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">The Fix: Professional Summary Formula</h3>
          <div className="bg-blue-50 border border-blue-200 p-4 mb-6">
            <p className="font-semibold mb-2">Use this proven 3-line structure:</p>
            <p><strong>Line 1</strong>: [Job title] with [X years] experience in [specific industry/function]</p>
            <p><strong>Line 2</strong>: Expert in [2-3 key skills] with proven track record of [biggest achievement with metrics]</p>
            <p><strong>Line 3</strong>: Seeking to leverage [relevant strength] to [specific value for employer]</p>
          </div>

          <div className="bg-slate-50 border-l-4 border-green-500 p-4 mb-6">
            <h4 className="font-semibold mb-2">Before (Weak):</h4>
            <p className="italic mb-4">"Experienced marketing professional seeking opportunities to utilize my skills in a challenging environment where I can contribute to company growth and advance my career."</p>
            
            <h4 className="font-semibold mb-2">After (Strong):</h4>
            <p className="italic">"Digital Marketing Manager with 7+ years driving growth for B2B technology companies. Expert in demand generation and marketing automation with proven track record of increasing qualified leads by 250% and reducing cost-per-acquisition by 40%. Seeking to leverage data-driven marketing expertise to accelerate revenue growth for venture-backed SaaS startups."</p>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Mistake #3: Weak, Responsibility-Focused Bullet Points</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Why This Doesn't Work</h3>
          <p className="text-slate-700 mb-4">
            <strong>Listing job duties instead of achievements</strong> makes you sound like every other candidate. Hiring managers want to know what you accomplished, not what you were supposed to do.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">The Fix: Achievement-Driven Bullet Points</h3>
          <div className="bg-blue-50 border border-blue-200 p-4 mb-6">
            <p className="font-semibold mb-2">Use the CAR Method:</p>
            <ul>
              <li><strong>C</strong>hallenge: What problem did you solve?</li>
              <li><strong>A</strong>ction: What specific steps did you take?</li>
              <li><strong>R</strong>esult: What measurable outcome did you achieve?</li>
            </ul>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-slate-50 border-l-4 border-green-500 p-4">
              <h4 className="font-semibold mb-2">Marketing Role:</h4>
              <p className="text-red-600 mb-2">❌ Before: "Managed company social media accounts and created content"</p>
              <p className="text-green-600">✅ After: "Grew company social media following by 300% (5K to 20K followers) through strategic content creation and community engagement, resulting in 150% increase in website traffic and 40+ qualified leads monthly"</p>
            </div>

            <div className="bg-slate-50 border-l-4 border-green-500 p-4">
              <h4 className="font-semibold mb-2">Project Management:</h4>
              <p className="text-red-600 mb-2">❌ Before: "Coordinated cross-functional teams and managed project timelines"</p>
              <p className="text-green-600">✅ After: "Led cross-functional teams of 12+ members across engineering, design, and marketing to deliver 3 major product launches on time and 15% under budget, resulting in $2.3M revenue in first quarter"</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Mistake #4: ATS-Unfriendly Formatting That Blocks Your Resume</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Why Formatting Matters More Than Ever</h3>
          <p className="text-slate-700 mb-4">
            <strong>Modern ATS systems are smarter but still limited</strong>. Poor formatting can cause your resume to be parsed incorrectly or rejected entirely, regardless of your qualifications.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Common ATS-Killing Formatting Mistakes</h3>
          <ul className="text-slate-700 mb-4">
            <li><strong>Tables and columns</strong>: ATS systems read left-to-right, top-to-bottom</li>
            <li><strong>Headers and footers</strong>: Contact information gets lost</li>
            <li><strong>Graphics and images</strong>: Cannot be parsed by most systems</li>
            <li><strong>Creative fonts</strong>: Stick to Arial, Calibri, Times New Roman</li>
            <li><strong>Text boxes</strong>: Content often ignored completely</li>
            <li><strong>Multiple columns</strong>: Confuses reading order</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">The Fix: ATS-Friendly Formatting Rules</h3>
          <div className="bg-blue-50 border border-blue-200 p-4 mb-6">
            <h4 className="font-semibold mb-2">Document Structure:</h4>
            <ul className="text-slate-700">
              <li>Use simple, single-column layout</li>
              <li>Standard margins (0.5" to 1")</li>
              <li>Consistent font throughout (10-12pt size)</li>
              <li>Clear section headers with white space</li>
              <li>Reverse chronological order for experience</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Mistake #5: Missing or Irrelevant Keywords</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Why Keywords Determine Your Fate</h3>
          <p className="text-slate-700 mb-4">
            <strong>ATS systems rank resumes based on keyword matches</strong> with job descriptions. Missing key terms means automatic rejection, regardless of your qualifications.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">The Fix: Strategic Keyword Integration</h3>
          <div className="bg-blue-50 border border-blue-200 p-4 mb-6">
            <h4 className="font-semibold mb-2">Step 1: Job Description Analysis</h4>
            <p className="mb-2">For each application, identify:</p>
            <ul className="text-slate-700">
              <li>Required technical skills and software</li>
              <li>Industry-specific terminology</li>
              <li>Job title variations</li>
              <li>Certification and education requirements</li>
              <li>Soft skills and methodologies mentioned</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Mistake #6: Poor Contact Information and Unprofessional Details</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">The Fix: Professional Contact Standards</h3>
          <div className="bg-slate-50 border-l-4 border-green-500 p-4 mb-6">
            <h4 className="font-semibold mb-2">Essential Contact Elements:</h4>
            <div className="font-mono text-sm bg-white p-3 rounded border">
              <p>John Smith</p>
              <p>Email: john.smith@email.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>LinkedIn: linkedin.com/in/johnsmith</p>
              <p>Location: San Francisco, CA</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Mistake #7: Inconsistent or Confusing Employment Dates</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">The Fix: Date Formatting Standards</h3>
          <div className="bg-blue-50 border border-blue-200 p-4 mb-6">
            <h4 className="font-semibold mb-2">Recommended Format: Month Year - Month Year</h4>
            <div className="text-green-600">
              <p>✅ "January 2020 - March 2023"</p>
              <p>✅ "Jan 2020 - Mar 2023"</p>
              <p>✅ "01/2020 - 03/2023"</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Mistake #8: Overloading with Irrelevant Information</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Why Less Is More</h3>
          <p className="text-slate-700 mb-4">
            <strong>Hiring managers spend 7.4 seconds on initial resume review</strong>. Including irrelevant information wastes precious space and dilutes your strongest qualifications.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">The Fix: Strategic Information Curation</h3>
          <div className="bg-blue-50 border border-blue-200 p-4 mb-6">
            <h4 className="font-semibold mb-2">The 10-Year Rule:</h4>
            <ul className="text-slate-700">
              <li>Focus on last 10 years of relevant experience</li>
              <li>Earlier positions: Brief mentions or combine under "Early Career Experience"</li>
              <li>Exception: Highly relevant experience that directly matches target role</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Mistake #9: Grammar, Spelling, and Formatting Inconsistencies</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Why Perfect Execution Matters</h3>
          <p className="text-slate-700 mb-4">
            <strong>A single typo can eliminate you from consideration</strong>. Studies show that 77% of hiring managers automatically reject resumes with spelling or grammar errors, regardless of qualifications.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">The Fix: Systematic Quality Control</h3>
          <div className="bg-blue-50 border border-blue-200 p-4 mb-6">
            <h4 className="font-semibold mb-2">The 4-Stage Proofreading Process:</h4>
            <ol className="text-slate-700">
              <li><strong>Stage 1: Content Review</strong> - Read for overall flow and logic</li>
              <li><strong>Stage 2: Grammar and Spelling</strong> - Use spell-check and read carefully</li>
              <li><strong>Stage 3: Formatting Consistency</strong> - Check fonts, spacing, alignment</li>
              <li><strong>Stage 4: Final Read-Through</strong> - Print and review on paper</li>
            </ol>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Mistake #10: Weak or Missing Skills Section</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Why Your Skills Section Is Critical</h3>
          <p className="text-slate-700 mb-4">
            <strong>ATS systems and hiring managers scan the skills section first</strong> to quickly assess candidate fit. A weak skills section means missing out on keyword matches and failing to showcase your technical capabilities.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">The Fix: Strategic Skills Architecture</h3>
          <div className="bg-blue-50 border border-blue-200 p-4 mb-6">
            <h4 className="font-semibold mb-2">The Three-Tier Skills Framework:</h4>
            <ul className="text-slate-700">
              <li><strong>Tier 1: Core Technical Skills</strong> - Software and platforms from job descriptions</li>
              <li><strong>Tier 2: Functional Skills</strong> - Job-specific methodologies and processes</li>
              <li><strong>Tier 3: Transferable Skills</strong> - Leadership and communication capabilities</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Taking Action: Your Resume Transformation Checklist</h2>

          <p className="text-slate-700 mb-4">
            Now that you understand the 10 critical mistakes that guarantee resume rejection, it's time to audit and fix your own resume. Use this comprehensive checklist to ensure your resume stands out for all the right reasons.
          </p>

          <div className="bg-slate-50 border border-slate-200 p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Resume Audit Checklist</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Customization (Mistake #1):</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>□ Resume tailored to specific job description</li>
                  <li>□ Keywords from job posting included naturally</li>
                  <li>□ Professional summary mentions company or role specifically</li>
                  <li>□ Skills section prioritizes requirements from job description</li>
                  <li>□ Experience section highlights most relevant achievements first</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Professional Summary (Mistake #2):</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>□ Professional summary present (not objective statement)</li>
                  <li>□ Includes years of experience and specific industry</li>
                  <li>□ Mentions 2-3 key skills with quantified achievements</li>
                  <li>□ Focuses on value to employer, not personal goals</li>
                  <li>□ Aligns with target role and company needs</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Achievement-Focused Content (Mistake #3):</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>□ Each bullet point shows results, not just responsibilities</li>
                  <li>□ Quantified achievements with specific numbers and percentages</li>
                  <li>□ Uses CAR method (Challenge, Action, Result) structure</li>
                  <li>□ Varied action verbs throughout</li>
                  <li>□ Impact clearly connected to business outcomes</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">The Results You Can Expect</h2>

          <p className="text-slate-700 mb-4">
            By fixing these 10 critical resume mistakes, our clients typically see:
          </p>

          <div className="bg-green-50 border border-green-200 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">Immediate Improvements:</h3>
            <ul className="text-slate-700 space-y-2">
              <li><strong>300-500% increase</strong> in initial phone screens and interviews</li>
              <li><strong>50-75% reduction</strong> in time between application and response</li>
              <li><strong>Significantly higher response rates</strong> from target companies</li>
              <li><strong>More relevant job opportunities</strong> reaching out proactively</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">Long-term Career Benefits:</h3>
            <ul className="text-slate-700 space-y-2">
              <li><strong>Higher starting salaries</strong> due to stronger negotiating position</li>
              <li><strong>Better company and role fits</strong> through strategic targeting</li>
              <li><strong>Increased confidence</strong> in job search and interview process</li>
              <li><strong>Shorter overall job search duration</strong> (average 2-3 months vs. 6+ months)</li>
            </ul>
          </div>

          <div className="bg-warm-bg border border-slate-200 rounded-lg p-6 my-8">
            <h3 className="text-xl font-semibold mb-2">How Matchrate.co Helps You Avoid These Mistakes</h3>
            <p className="text-slate-700 mb-4">
              Our AI-powered resume analyzer acts as your pre-submission quality check:
            </p>
            <ul className="space-y-2 mb-4">
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
            <p className="mb-4 font-medium">Don't let easily fixable mistakes cost you job opportunities.</p>
            
            <div className="mt-6">
              <Link to="/review">
                <Button className="bg-warm-accent hover:bg-warm-accent/90 text-white">
                  Check Your Resume Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Your Next Steps</h2>

          <p className="text-slate-700 mb-4">
            Your resume is your career's most important document. Don't let easily fixable mistakes cost you thousands of dollars in lost opportunities and extended job searches.
          </p>

          <div className="bg-blue-50 border border-blue-200 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">Take action today:</h3>
            <ol className="text-slate-700 space-y-2">
              <li><strong>1. Audit your current resume</strong> using the checklist above</li>
              <li><strong>2. Identify your top 3 problem areas</strong> from the 10 mistakes covered</li>
              <li><strong>3. Implement fixes systematically</strong> rather than trying to change everything at once</li>
              <li><strong>4. Test your improved resume</strong> with 5-10 applications to measure results</li>
              <li><strong>5. Continuously optimize</strong> based on response rates and feedback</li>
            </ol>
          </div>

          <p className="text-slate-700 mb-6">
            Remember: The job market is competitive, but a strategically crafted, mistake-free resume gives you a significant advantage over 95% of other candidates who haven't taken the time to optimize properly.
          </p>

          <p className="text-slate-700 text-lg font-semibold mb-8">
            Your dream job is waiting—make sure your resume doesn't stand in the way of reaching it.
          </p>

          <hr className="my-8" />
          
          <p className="text-slate-600 italic text-center">
            Ready to give your resume the professional edge it needs? Our ATS-optimized resume checker analyzes your resume against these 10 critical mistakes and provides specific recommendations for improvement. Try it free today and see how your resume measures up.
          </p>
        </article>
      </div>
      
      <Footer />
    </div>
  );
}
