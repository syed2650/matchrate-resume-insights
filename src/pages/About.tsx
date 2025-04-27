
import { Info } from "lucide-react";

export default function About() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Info className="h-8 w-8" />
        About Matchrate.ai
      </h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="text-lg text-slate-600 mb-6">
          Matchrate.ai was created to help tech professionals land their dream jobs by optimizing their resumes with AI-powered insights.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
        <p className="text-slate-600 mb-6">
          To empower job seekers with data-driven insights and AI technology that increases their chances of landing interviews at top tech companies.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Why Choose Us</h2>
        <p className="text-slate-600">
          Built specifically for tech roles, our AI understands the nuances of different positions and provides tailored feedback that helps you stand out in the application process.
        </p>
      </div>
    </div>
  );
}
