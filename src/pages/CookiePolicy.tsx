
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

         <h2 className="text-2xl font-semibold mt-8 mb-4">2. Why We Use Cookies</h2>
        <p className="text-slate-600">
          We use cookies for several reasons:

- Essential Cookies: Necessary for our Website to function properly (e.g., login authentication).

- Analytics Cookies: Help us understand how visitors interact with our Website (e.g., page views, traffic patterns).

- Performance and Functionality Cookies: Enhance the performance and functionality of our Website (e.g., remembering your preferences).

- Advertising Cookies (future feature): Help us deliver relevant advertisements if we decide to run ads in the future.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Managing Cookies</h2>
        <p className="text-slate-600">
          You can control and/or delete cookies as you wish.

Most browsers allow you to:

- Delete cookies

- Block cookies

- Warn before cookies are stored

Please refer to your browser’s Help section to learn how to manage your cookies settings.

Note: Disabling cookies may affect the functionality of certain parts of the Website.
        </p>

  <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Cookies</h2>
        <p className="text-slate-600">
          We may allow select partners (like Google Analytics) to set cookies on our Website to help us better understand visitor behavior.
          Third-party cookies are subject to the privacy policies of these external services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Updates to This Cookies Policy</h2>
        <p className="text-slate-600">
         We may update this Cookies Policy occasionally to reflect changes in technology, regulations, or practices.
         We encourage you to review this page periodically for the latest information.
        </p>
        

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Us</h2>
        <p className="text-slate-600">
          If you have questions about our use of cookies or other tracking technologies:<br/>
          📧 support@matchrate.co
        </p>
      </div>
    </div>
  );
}
