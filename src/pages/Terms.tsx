
import { Scale } from "lucide-react";

export default function Terms() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Scale className="h-8 w-8" />
        Terms of Service
      </h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="text-sm text-slate-500">Last updated: April 27, 2025</p>
        
        <p className="text-lg text-slate-600 mb-6">
          Welcome to Matchrate.co!<br/>
          Please read these Terms carefully before using our website and services.
        </p>
        
        <p className="text-slate-600 mb-8">
          By accessing or using Matchrate.co, you agree to be bound by these Terms.
          If you do not agree, you may not use our services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Overview</h2>
        <p className="text-slate-600">
          Matchrate.co offers resume analysis, optimization, and rewriting services using automated tools and AI assistance.<br/><br/>
          These Terms govern your access to and use of our services.
        </p>

        {/* ... continue with other sections ... */}

        <h2 className="text-2xl font-semibold mt-8 mb-4">13. Contact Us</h2>
        <p className="text-slate-600">
          If you have any questions about these Terms, contact:<br/>
          📧 support@matchrate.co
        </p>
      </div>
    </div>
  );
}
