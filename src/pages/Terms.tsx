
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

         <h2 className="text-2xl font-semibold mt-8 mb-4">2. Eligibility</h2>
        <p className="text-slate-600">
          You must be at least 16 years old to use our platform.
By using Matchrate.co, you represent and warrant that you meet this age requirement.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Services Provided</h2>
        <p className="text-slate-600">
          - Resume review and feedback
          - Resume rewriting (for eligible plans)
          - Job match insights and ATS readiness analysis
We strive for high accuracy but cannot guarantee specific results (such as interview calls or job offers).
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Account Usage</h2>
        <p className="text-slate-600">
          If you create an account:
          - Keep your login credentials secure.
          - You are responsible for all activity under your account.
          - Notify us immediately if you suspect unauthorized use.
        </p>

        
        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Payment and Billing</h2>
        <p className="text-slate-600">
          - Some features are free; others require payment.
          - Paid plans are billed in advance on a monthly or annual basis.
          - All prices are listed in USD unless otherwise stated.
        </p>

           <h2 className="text-2xl font-semibold mt-8 mb-4">6. No Refund Policy</h2>
        <p className="text-slate-600">
         All purchases, whether for resume analysis credits, subscription fees, or additional services, are final and non-refundable.
          ❗ We do not provide refunds under any circumstances, including (but not limited to):
          - User dissatisfaction with resume feedback or rewritten resumes.
         - Accidental purchases or unused credits.
          - Subscription cancellations mid-cycle.
          Please review your choices carefully before purchasing.
   </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Intellectual Property</h2>
        <p className="text-slate-600">
         All content, including software, branding, and service content, is the property of Matchrate.co and protected by copyright and intellectual property laws.
Users retain ownership of their uploaded resumes and job descriptions.
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
