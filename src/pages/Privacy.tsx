
import { ShieldCheck } from "lucide-react";

export default function Privacy() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <ShieldCheck className="h-8 w-8" />
        Privacy Policy
      </h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="text-sm text-slate-500">Last updated: April 27, 2025</p>
        
        <p className="text-lg text-slate-600 mb-6">
          Welcome to Matchrate.co!<br/>
          Your privacy is critically important to us. This Privacy Policy explains how we collect, use, and protect your information.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Who We Are</h2>
        <p className="text-slate-600">
          Matchrate.co ("we", "us", or "our") operates an online resume analysis and optimization platform.
          We are committed to protecting your personal data and your right to privacy.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
        <p className="text-slate-600 mb-4">We collect information to provide better services to our users, including:</p>
        <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
          <li><strong>Personal Information:</strong> Name, email address (only if provided)</li>
          <li><strong>Resume Data:</strong> The resume you upload for analysis</li>
          <li><strong>Job Description Data:</strong> If you submit a job description for matching</li>
          <li><strong>Usage Data:</strong> Browser type, device information, IP address, and pages visited</li>
        </ul>
        <p className="text-slate-600">We do not collect sensitive information like social security numbers, banking details, or government IDs.</p>

        {/* ... continue with other sections ... */}
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
        <p className="text-slate-600">
          If you have any questions about this Privacy Policy, please contact us at:<br/>
          📧 privacy@matchrate.co
        </p>
      </div>
    </div>
  );
}
