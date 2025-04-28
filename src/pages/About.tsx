
import { Info } from "lucide-react";

export default function About() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Info className="h-8 w-8" />
        About Matchrate.co
      </h1>
      
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">Revolutionizing Resume Reviews and Job Matching</h2>
        <p className="text-lg text-slate-600 mb-6">
          At Matchrate.co, we believe that landing your dream job shouldn't be a guessing game.
          We are here to empower job seekers by providing honest, actionable, and professional feedback on their resumes — using cutting-edge AI technology, fine-tuned specifically for resume optimization, ATS compatibility, and real-world hiring practices.
        </p>
        
        <p className="text-slate-600 mb-6">
          Every resume you upload isn't just "analyzed" — it is optimized against modern recruiter expectations and applicant tracking systems (ATS).
          Our mission is simple: help you match better, faster, and smarter with the roles you deserve.
        </p>
        
        <p className="text-slate-600 mb-8">
          We've built Matchrate.co because job seekers deserve clarity, fairness, and tools that actually work — not just another vague "score" or gimmicky advice.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Why Matchrate.co?</h2>
        <ul className="space-y-2 text-slate-600 mb-8">
          <li>✅ Real feedback from AI trained on thousands of hiring patterns.</li>
          <li>✅ Personalized action plans to fix your resume immediately.</li>
          <li>✅ ATS Readiness checks to boost your interview chances.</li>
          <li>✅ Professional resume rewrites to maximize your application success.</li>
        </ul>

        <p className="text-slate-600 mb-8">
          Whether you're a fresh graduate, a career switcher, or an experienced executive —<br/>
          Matchrate.co is your secret weapon to stand out.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Our Promise</h2>
        <p className="text-slate-600">
          No jargon. No fake scores. Just actionable results.<br/><br/>
          Transparent. Professional. Built for real-world hiring.<br/><br/>
          Your success is our mission.<br/><br/>
          Welcome to Matchrate.co —<br/>
          Where Resumes Get Smarter.
        </p>
      </div>
    </div>
  );
}
