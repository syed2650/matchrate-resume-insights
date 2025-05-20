
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/sections/Footer";
import Header from "@/components/sections/Header";

export default function ATSSystems() {
  return (
    <div className="min-h-screen bg-warm-bg font-sans">
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-50">
        <Header />
      </div>
      
      <div className="container max-w-screen-lg mx-auto px-4 py-12">
        <article className="prose prose-slate max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            ATS Systems Explained: How to Beat the Resume Robots in 2025 
            <span className="block text-xl md:text-2xl text-slate-500 font-normal mt-2">
              The inside track on getting past automated screening systems
            </span>
          </h1>
          
          <p className="text-lg text-slate-700 mb-8">
            In today's job market, your resume must impress both human recruiters and the AI gatekeepers known as 
            Applicant Tracking Systems (ATS). This comprehensive guide breaks down exactly how ATS systems 
            work in 2025, and the specific techniques needed to ensure your resume gets past these digital filters.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">What Is an ATS (and Why Should You Care)?</h2>
          <p className="text-slate-700">
            An Applicant Tracking System is software that companies use to collect, scan, and rank job applications. 
            In 2025, over 99% of Fortune 500 companies and 75% of mid-sized businesses use some form of ATS.
          </p>
          <p className="text-slate-700">
            Here's why this matters to you:
          </p>
          <p className="text-slate-700 ml-6">
            🔹 75-88% of resumes are rejected before a human ever sees them<br />
            🔹 Most systems rank candidates based on keyword matching<br />
            🔹 Formatting issues can cause your resume to be improperly parsed
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">How Modern ATS Systems Work</h2>
          <p className="text-slate-700">
            The current generation of ATS technology does more than simple keyword matching:
          </p>
          <p className="text-slate-700 ml-6">
            ✅ <strong>Semantic Analysis:</strong> Systems understand related terms (e.g., "project management" and "program coordination")<br />
            ✅ <strong>ML-Based Ranking:</strong> Machine learning models evaluate your resume against job requirements<br />
            ✅ <strong>Contextual Understanding:</strong> Systems can parse skills within the context of your roles
          </p>
          <p className="text-slate-700">
            The most common ATS systems in 2025 include Workday, Greenhouse, Lever, and Taleo, each with different parsing capabilities and algorithms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">ATS-Friendly Resume Formatting</h2>
          <p className="text-slate-700">
            Format matters! To ensure your resume is properly parsed:
          </p>
          <p className="text-slate-700 ml-6">
            ✅ Use simple, standard fonts (Calibri, Arial, Times New Roman)<br />
            ✅ Avoid tables, text boxes, headers/footers, and images<br />
            ✅ Use standard section headings ("Experience," "Education," "Skills")<br />
            ✅ Don't hide keywords by using white text (systems flag this)<br />
            ✅ Submit in PDF or docx format (check job posting for preference)
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Keyword Optimization Techniques</h2>
          <p className="text-slate-700">
            Keywords are the foundation of ATS success:
          </p>
          <p className="text-slate-700 ml-6">
            🔸 <strong>80% Rule:</strong> Include at least 80% of the key skills mentioned in the job description<br />
            🔸 <strong>Use exact phrases</strong> from the job posting when applicable<br />
            🔸 <strong>Include technical skills</strong> relevant to your field<br />
            🔸 <strong>Incorporate industry acronyms</strong> AND spelled-out versions (e.g., "UI/UX (User Interface/User Experience)")
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Creating a Skills Matrix</h2>
          <p className="text-slate-700">
            In 2025, a dedicated skills section is more important than ever:
          </p>
          <p className="text-slate-700">
            Include a concise "Skills" section that clearly lists:
          </p>
          <ul className="grid grid-cols-2 gap-2 ml-6">
            <li className="text-slate-700">Hard skills (technical abilities)</li>
            <li className="text-slate-700">Soft skills (communication, leadership)</li>
            <li className="text-slate-700">Industry-specific knowledge</li>
            <li className="text-slate-700">Tools and platforms</li>
          </ul>
          <p className="text-slate-700 mt-4">
            For technical roles, consider organizing by categories (e.g., Programming Languages, Frameworks, etc.).
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Tailoring for Each Application</h2>
          <p className="text-slate-700">
            One-size-fits-all resumes underperform by 30-50% in ATS ranking:
          </p>
          <p className="text-slate-700 ml-6">
            ✅ Create a master resume with all your experiences and skills<br />
            ✅ Adjust your skills section for each job<br />
            ✅ Reorder bullet points to prioritize most relevant achievements<br />
            ✅ Mirror language from the job description
          </p>
          <p className="text-slate-700">
            <strong>Pro tip:</strong> Keep a spreadsheet of different versions to track which resume got interviews.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">ATS Red Flags to Avoid</h2>
          <p className="text-slate-700">
            These tactics can get your resume flagged or rejected:
          </p>
          <p className="text-slate-700 ml-6">
            🚫 Keyword stuffing (repeating terms unnaturally)<br />
            🚫 "Invisible" text (white text on white background)<br />
            🚫 Excessive formatting or non-standard file types<br />
            🚫 Career gaps without explanation<br />
            🚫 Inconsistent dates or information
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">How to Test Your Resume</h2>
          <p className="text-slate-700">
            Before applying, verify your resume's ATS compatibility:
          </p>
          <p className="text-slate-700 ml-6">
            🔹 Use Matchrate.co to scan against specific job descriptions<br />
            🔹 Check if your resume maintains formatting when copied/pasted into a text document<br />
            🔹 Review how your PDF is parsed by free ATS simulators
          </p>

          <div className="bg-warm-bg border border-slate-200 rounded-lg p-6 my-8">
            <h3 className="text-xl font-semibold mb-2">How Matchrate.co Makes ATS-Optimization Easy</h3>
            <p className="text-slate-700">
              Our tool specifically helps you pass ATS systems by:
            </p>
            <ul className="space-y-2 mt-2">
              <li className="flex items-start">
                <span className="mr-2">🎯</span>
                <span>Comparing your resume to each specific job description</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">💯</span>
                <span>Calculating your keyword match percentage</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔍</span>
                <span>Identifying missing keywords and skills</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✏️</span>
                <span>Suggesting ATS-friendly phrasing for your experience</span>
              </li>
            </ul>
            <p className="mt-4 font-medium">Stop guessing if your resume will make it through — know for sure.</p>
            
            <div className="mt-6">
              <Link to="/review">
                <Button className="bg-warm-accent hover:bg-warm-accent/90 text-white">
                  Check Your ATS Score Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Conclusion</h2>
          <p className="text-slate-700">
            Getting past ATS systems isn't about tricking the algorithm — it's about presenting your qualifications clearly in a machine-readable format. By understanding how these systems work and optimizing accordingly, you can ensure both the robots and human recruiters recognize your potential.
          </p>
          <p className="text-slate-700 mt-4">
            Start implementing these techniques today, and use Matchrate.co to verify your resume is ATS-optimized before you apply.
          </p>
        </article>
      </div>
      
      <Footer />
    </div>
  );
}
