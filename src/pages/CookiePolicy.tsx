
import { Cookie } from "lucide-react";

export default function CookiePolicy() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Cookie className="h-8 w-8" />
        Cookie Policy
      </h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="text-lg text-slate-600 mb-6">
          This policy explains how Matchrate.ai uses cookies and similar technologies to provide our services.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">What Are Cookies</h2>
        <p className="text-slate-600 mb-6">
          Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Cookies</h2>
        <p className="text-slate-600 mb-6">
          We use cookies to remember your preferences, understand how you use our website, and improve our services.
        </p>
      </div>
    </div>
  );
}
