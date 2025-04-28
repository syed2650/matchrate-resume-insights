
import { Cookie } from "lucide-react";

export default function CookiePolicy() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Cookie className="h-8 w-8" />
        Cookie Policy
      </h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="text-sm text-slate-500">Last updated: April 27, 2025</p>
        
        <p className="text-lg text-slate-600 mb-6">
          This Cookies Policy explains how Matchrate.co ("we," "us," and "our") uses cookies and similar technologies to recognize you when you visit our website matchrate.co ("Website"). It explains what these technologies are, why we use them, and your rights to control our use of them.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. What Are Cookies?</h2>
        <p className="text-slate-600">
          Cookies are small text files that are stored on your computer or mobile device when you visit a website.
          They are widely used to make websites work, or to work more efficiently, as well as to provide reporting information.
        </p>

        {/* ... continue with other sections ... */}

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Us</h2>
        <p className="text-slate-600">
          If you have questions about our use of cookies or other tracking technologies:<br/>
          📧 support@matchrate.co
        </p>
      </div>
    </div>
  );
}
