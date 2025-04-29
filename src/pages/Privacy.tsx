
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

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
        <p className="text-slate-600 mb-4">We use your information to:</p>
        <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
          <li>Provide feedback, recommendations, and resume rewriting (if selected).</li>
          <li>Improve and personalize our services.</li>
          <li>Respond to inquiries and customer support requests.</li>
          <li>Send important account or service-related notices.</li>
        </ul>
        <p className="text-slate-600">We do NOT sell, rent, or share your personal information with third parties for marketing purposes.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Retention</h2>
        <p className="text-slate-600">
          - Uploaded resumes and job descriptions are deleted automatically after a short retention period unless you explicitly choose to save them.<br/>
          - Analytics and usage data may be stored longer for service improvement.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Cookies</h2>
        <p className="text-slate-600">
          We use cookies to:<br/>
          - Maintain session information.<br/>
          - Improve your experience on our platform.<br/>
          - Analyze traffic anonymously.<br/>
          You can manage or disable cookies through your browser settings.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. How We Protect Your Data</h2>
        <p className="text-slate-600">
          - Industry-standard encryption (HTTPS) is used for all communications.<br/>
          - Resume and job description files are securely handled and deleted.<br/>
          - Access to your personal data is limited to authorized personnel only.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Your Data Protection Rights</h2>
        <p className="text-slate-600">
          Depending on your location, you may have rights under GDPR and other data protection laws, including:<br/>
          - Right to access<br/>
          - Right to rectify<br/>
          - Right to erase<br/>
          - Right to restrict processing<br/>
          - Right to object to processing<br/>
          - Right to data portability<br/>
          <br/>
          To exercise any of these rights, contact us at support@matchrate.co.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Children's Privacy</h2>
        <p className="text-slate-600">
          Our services are not intended for individuals under the age of 16.<br/>
          We do not knowingly collect data from children.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to This Privacy Policy</h2>
        <p className="text-slate-600">
          We may update this Privacy Policy from time to time.<br/>
          If significant changes are made, we will notify users by posting an updated notice on the platform.<br/>
          Last updated: April 27, 2025
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
        <p className="text-slate-600">
          If you have any questions about this Privacy Policy, please contact us at:<br/>
          📧 privacy@matchrate.co
        </p>
      </div>
    </div>
  );
}
