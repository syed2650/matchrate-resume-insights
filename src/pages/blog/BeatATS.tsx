
import { ArrowLeft, Target, Shield, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function BeatATS() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-16">
      <Link to="/blog" className="inline-flex items-center gap-2 text-warm-accent hover:text-warm-accent/80 mb-8">
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      <article className="prose prose-lg max-w-none">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-warm-text mb-4">
            How to Beat ATS Systems in 2025: The Complete Guide to Getting Past Resume Robots
          </h1>
          <p className="text-slate-600 text-lg">Last updated: January 2025</p>
        </header>

        <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-red-400 mr-3 mt-1" />
            <div>
              <p className="text-red-800 font-semibold">Getting rejected by companies before a human even sees your resume?</p>
              <p className="text-red-700">You're not alone. 75% of resumes are filtered out by Applicant Tracking Systems (ATS) before reaching hiring managers.</p>
            </div>
          </div>
        </div>

        <p className="text-xl text-slate-700 leading-relaxed mb-8">
          But here's the good news: once you understand how these systems work, you can optimize your resume to consistently pass ATS filters and land more interviews.
        </p>

        <p className="text-lg text-slate-600 mb-8">
          In this comprehensive guide, you'll learn exactly how to beat ATS systems in 2025, including the latest algorithm updates, formatting requirements, and keyword strategies that actually work.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6" />
            What Are ATS Systems and Why Do They Matter?
          </h2>
          <p className="text-blue-800 mb-4">
            An Applicant Tracking System (ATS) is software that companies use to collect, scan, and rank job applications. Think of it as a digital gatekeeper that decides whether your resume deserves human attention.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-blue-800 mb-3">The Reality of ATS Usage in 2025</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• 99% of Fortune 500 companies use ATS software</li>
                <li>• 75% of mid-size companies (50-500 employees) have adopted ATS</li>
                <li>• Over 200 million resumes are processed annually</li>
                <li>• Average ATS scan time: 6-10 seconds per resume</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-3">Popular ATS Platforms</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• Workday (used by 40% of Fortune 500)</li>
                <li>• Taleo (Oracle's ATS solution)</li>
                <li>• BambooHR (popular with smaller companies)</li>
                <li>• Greenhouse (tech companies)</li>
                <li>• iCIMS (healthcare and retail)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-2">
            <Zap className="h-6 w-6" />
            How ATS Systems Actually Work in 2025
          </h2>
          <p className="text-green-800 mb-4">
            Understanding the ATS process is crucial for optimization. Here's what happens when you submit your resume:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Step 1: Initial Parsing</h4>
                <p className="text-green-700 text-sm mb-2">The ATS scans your resume and extracts:</p>
                <ul className="text-green-600 text-sm space-y-1">
                  <li>• Contact information</li>
                  <li>• Work experience (dates, companies, job titles)</li>
                  <li>• Education details</li>
                  <li>• Skills and certifications</li>
                  <li>• Keywords and phrases</li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Step 2: Keyword Matching</h4>
                <p className="text-green-700 text-sm mb-2">The system compares your content against the job description:</p>
                <ul className="text-green-600 text-sm space-y-1">
                  <li>• Exact keyword matches (highest weight)</li>
                  <li>• Semantic variations (related terms)</li>
                  <li>• Required qualifications (must-haves vs. nice-to-haves)</li>
                  <li>• Industry-specific terminology</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Step 3: Scoring and Ranking</h4>
                <p className="text-green-700 text-sm mb-2">Based on the analysis, the ATS assigns your resume a compatibility score, typically ranging from 0-100%.</p>
                <p className="text-green-600 text-sm">Resumes scoring above 70-80% get forwarded to human reviewers.</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Step 4: Human Review</h4>
                <p className="text-green-700 text-sm">Only the top-scoring resumes reach hiring managers, who typically spend just 6 seconds on initial screening.</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-warm-text mb-6">The 12 Most Common ATS Rejection Reasons (and How to Fix Them)</h2>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-red-600 mb-3">1. Incompatible File Format</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Problem:</h4>
                <p className="text-slate-600">ATS can't read certain file types</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Solution:</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• Use .docx or .pdf formats only</li>
                  <li>• Avoid .pages, .txt, or image files</li>
                  <li>• Test compatibility: Can you copy/paste text from your resume?</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-red-600 mb-3">2. Complex Formatting and Design</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Problem:</h4>
                <p className="text-slate-600">Creative designs confuse ATS parsers</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Solution:</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• Use simple, single-column layouts</li>
                  <li>• Avoid tables, text boxes, and graphics</li>
                  <li>• Stick to standard fonts (Arial, Calibri, Times New Roman)</li>
                  <li>• Keep font size between 10-12pt</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-red-600 mb-3">3. Missing Keywords</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Problem:</h4>
                <p className="text-slate-600">Resume doesn't match job description terminology</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Solution:</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• Include 5-10 relevant keywords from the job posting</li>
                  <li>• Use exact phrases where possible</li>
                  <li>• Don't keyword stuff—integrate naturally</li>
                  <li>• Include both spelled-out terms and acronyms</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-red-600 mb-3">4. Incorrect Section Headers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Problem:</h4>
                <p className="text-slate-600">Non-standard headings confuse ATS</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Solution:</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• Use standard headers: "Work Experience," "Education," "Skills"</li>
                  <li>• Avoid creative titles like "My Journey" or "What I Bring"</li>
                  <li>• Keep headers consistent throughout</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-red-600 mb-3">5. Poor Contact Information Placement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Problem:</h4>
                <p className="text-slate-600">Contact details in headers/footers aren't readable</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Solution:</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• Place contact info in the main document body</li>
                  <li>• Include: Full name, phone, email, LinkedIn, city/state</li>
                  <li>• Avoid fancy formatting or symbols</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-red-600 mb-3">6. Inconsistent Date Formatting</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Problem:</h4>
                <p className="text-slate-600">Mixed date formats confuse parsers</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Solution:</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• Use consistent format: "January 2020 – March 2023"</li>
                  <li>• Include months and years</li>
                  <li>• Use clear separators (– or "to")</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-red-600 mb-3">7. Missing Job Titles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Problem:</h4>
                <p className="text-slate-600">ATS can't identify your experience level</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Solution:</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• Include exact job titles from the posting when applicable</li>
                  <li>• Use industry-standard titles</li>
                  <li>• Avoid internal company jargon</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-red-600 mb-3">8. Lack of Quantified Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Problem:</h4>
                <p className="text-slate-600">Vague descriptions don't demonstrate impact</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Solution:</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• Include numbers, percentages, dollar amounts</li>
                  <li>• Use action verbs: managed, developed, increased, implemented</li>
                  <li>• Format: "Increased sales by 25% ($500K revenue) over 18 months"</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-red-600 mb-3">9. Spelling and Grammar Errors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Problem:</h4>
                <p className="text-slate-600">Mistakes indicate lack of attention to detail</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Solution:</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• Use spell-check tools</li>
                  <li>• Have someone else proofread</li>
                  <li>• Read aloud to catch errors</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-red-600 mb-3">10. Too Long or Too Short</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Problem:</h4>
                <p className="text-slate-600">ATS may truncate overly long resumes</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Solution:</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• 1 page for entry-level positions</li>
                  <li>• 2 pages maximum for experienced professionals</li>
                  <li>• Prioritize most relevant information</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-red-600 mb-3">11. Generic Resume Content</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Problem:</h4>
                <p className="text-slate-600">One-size-fits-all resumes don't match specific jobs</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Solution:</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• Customize for each application</li>
                  <li>• Mirror job description language</li>
                  <li>• Highlight relevant experience first</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-red-600 mb-3">12. Missing Required Qualifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Problem:</h4>
                <p className="text-slate-600">Resume doesn't clearly show must-have skills</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Solution:</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• Create a "Core Competencies" section</li>
                  <li>• List technical skills prominently</li>
                  <li>• Include relevant certifications</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        <div className="bg-warm-accent/10 border border-warm-accent/20 rounded-lg p-6 my-8">
          <h2 className="text-2xl font-bold text-warm-text mb-4">ATS-Friendly Resume Format: The 2025 Template</h2>
          <p className="text-slate-700 mb-4">Here's the optimal structure for ATS compatibility:</p>
          
          <div className="bg-white p-6 rounded-lg border border-warm-accent/20 font-mono text-sm">
            <div className="space-y-4">
              <div>
                <p className="font-bold">[Full Name]</p>
                <p>[Phone Number] | [Email Address]</p>
                <p>[LinkedIn Profile] | [City, State]</p>
              </div>
              
              <div>
                <p className="font-bold">Professional Summary (50-75 words)</p>
                <p className="text-slate-600">Include 3-5 relevant keywords</p>
                <p className="text-slate-600">Mention years of experience</p>
                <p className="text-slate-600">Highlight top achievements</p>
              </div>
              
              <div>
                <p className="font-bold">Core Competencies</p>
                <p className="text-slate-600">List 8-12 relevant skills</p>
                <p className="text-slate-600">Use bullet points or simple formatting</p>
                <p className="text-slate-600">Include both hard and soft skills</p>
              </div>
              
              <div>
                <p className="font-bold">Professional Experience</p>
                <p className="text-slate-600">For each role:</p>
                <p className="text-slate-600 ml-4">Job Title</p>
                <p className="text-slate-600 ml-4">Company Name, City, State</p>
                <p className="text-slate-600 ml-4">Employment Dates (Month Year – Month Year)</p>
                <p className="text-slate-600 ml-4">3-5 bullet points with quantified achievements</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Keyword Optimization Strategies That Work</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-3">1. The 80/20 Rule</h3>
              <p className="text-blue-700 mb-3">Focus on the 20% of keywords that appear most frequently in your target job postings. These usually include:</p>
              <ul className="text-blue-600 space-y-1">
                <li>• Job title variations</li>
                <li>• Required technical skills</li>
                <li>• Industry certifications</li>
                <li>• Common software/tools</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-3">2. Keyword Density Sweet Spot</h3>
              <ul className="text-blue-700 space-y-2">
                <li>• Aim for 2-3% keyword density</li>
                <li>• If a job posting mentions "project management" 5 times, include it 2-3 times in your resume</li>
                <li>• Don't exceed 5% to avoid keyword stuffing penalties</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">3. Semantic Keyword Strategy</h3>
            <p className="text-blue-700 mb-3">Include variations and related terms:</p>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <ul className="text-blue-600 space-y-2">
                <li>• "Digital marketing" → "online marketing," "internet marketing"</li>
                <li>• "JavaScript" → "JS," "ECMAScript"</li>
                <li>• "Customer service" → "client relations," "customer support"</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-8">
          <h2 className="text-2xl font-bold text-yellow-900 mb-4">ATS Testing: How to Check Your Resume</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">Free ATS Resume Checker Tools</h3>
              <ul className="text-yellow-700 space-y-2">
                <li>• MatchRate.co - AI-powered analysis against specific job descriptions</li>
                <li>• Jobscan - Compares resume to job postings</li>
                <li>• Resume Worded - Free ATS compatibility check</li>
                <li>• CVViZ - Basic parsing test</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">Manual Testing Methods</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-yellow-700 mb-2">The Copy-Paste Test:</h4>
                  <ul className="text-yellow-600 text-sm space-y-1">
                    <li>• Copy your entire resume</li>
                    <li>• Paste into a plain text editor</li>
                    <li>• If formatting is maintained and all text appears correctly, your resume is likely ATS-friendly</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-yellow-700 mb-2">The Print Preview Test:</h4>
                  <ul className="text-yellow-600 text-sm space-y-1">
                    <li>• Open your resume in different programs</li>
                    <li>• Check if formatting remains consistent</li>
                    <li>• Ensure all text is selectable</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-8">
          <h2 className="text-2xl font-bold text-red-900 mb-4">Common ATS Myths Debunked</h2>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">Myth 1: "White text hidden keywords work"</h4>
              <p className="text-red-700">Reality: Modern ATS detect this tactic and may penalize your resume</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">Myth 2: "PDF files don't work with ATS"</h4>
              <p className="text-red-700">Reality: Most modern ATS handle PDFs well, but .docx is still safest</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">Myth 3: "More keywords always equal better scores"</h4>
              <p className="text-red-700">Reality: Keyword stuffing hurts readability and may trigger spam filters</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">Myth 4: "ATS systems are all the same"</h4>
              <p className="text-red-700">Reality: Different platforms have varying capabilities and requirements</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-8">
          <h2 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-2">
            <CheckCircle className="h-6 w-6" />
            Your ATS Optimization Action Plan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Week 1: Assessment</h4>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Analyze target job postings</li>
                <li>• Test current resume with ATS tools</li>
                <li>• Identify keyword gaps</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Week 2: Restructuring</h4>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Reformat using ATS-friendly template</li>
                <li>• Optimize keywords</li>
                <li>• Quantify achievements</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Week 3: Testing</h4>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Run multiple ATS tests</li>
                <li>• Get professional feedback</li>
                <li>• Create job-specific versions</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Week 4: Strategy</h4>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Apply to test positions</li>
                <li>• Track application outcomes</li>
                <li>• Refine based on results</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-warm-text mb-4">Conclusion: Your Path to ATS Success</h2>
          <p className="text-lg text-slate-700 mb-6">
            Beating ATS systems in 2025 isn't about gaming the system—it's about creating a clear, well-structured resume that effectively communicates your qualifications to both robots and humans.
          </p>
          
          <div className="bg-warm-accent/10 border border-warm-accent/20 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-warm-text mb-3">Remember the key principles:</h3>
            <ul className="text-slate-700 space-y-2">
              <li>• <strong>Format for clarity:</strong> Simple, clean layouts work best</li>
              <li>• <strong>Optimize strategically:</strong> Include relevant keywords naturally</li>
              <li>• <strong>Quantify everything:</strong> Numbers tell your professional story</li>
              <li>• <strong>Test regularly:</strong> Use tools to verify ATS compatibility</li>
              <li>• <strong>Customize always:</strong> Tailor each application to the specific role</li>
            </ul>
          </div>

          <p className="text-lg text-slate-700 mb-8">
            The job market is competitive, but with an ATS-optimized resume, you'll consistently land in the "yes" pile and get the interviews you deserve.
          </p>

          <div className="bg-gradient-to-r from-warm-accent/10 to-blue-500/10 border border-warm-accent/30 rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold text-warm-text mb-4">Ready to test your resume against specific job descriptions?</h3>
            <p className="text-slate-700 mb-6">
              Try our AI-powered analysis tool for instant feedback on your ATS compatibility score and personalized optimization recommendations.
            </p>
            <div className="space-y-4">
              <Button 
                size="lg"
                className="cta-gradient text-white px-8 py-3"
                onClick={() => window.location.href = '/review'}
              >
                <Target className="mr-2 h-5 w-5" />
                Get Your Free ATS Analysis
              </Button>
              <p className="text-sm text-slate-600">
                Our resume analysis tool provides job-specific recommendations and real-time ATS scoring to help you land more interviews.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
