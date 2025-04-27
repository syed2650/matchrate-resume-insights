
import { ShieldCheck } from "lucide-react";

export default function Privacy() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <ShieldCheck className="h-8 w-8" />
        Privacy Policy
      </h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="text-lg text-slate-600 mb-6">
          At Matchrate.ai, we take your privacy seriously. This policy outlines how we collect, use, and protect your data.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Collection</h2>
        <p className="text-slate-600 mb-6">
          We collect information that you provide directly to us, including your resume content and job descriptions. This data is used solely for providing our resume analysis service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
        <p className="text-slate-600 mb-6">
          We implement appropriate security measures to protect your personal information from unauthorized access or disclosure.
        </p>
      </div>
    </div>
  );
}
