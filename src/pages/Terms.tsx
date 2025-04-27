
import { Scale } from "lucide-react";

export default function Terms() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Scale className="h-8 w-8" />
        Terms of Service
      </h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="text-lg text-slate-600 mb-6">
          By using Matchrate.ai, you agree to these terms of service. Please read them carefully.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Usage Terms</h2>
        <p className="text-slate-600 mb-6">
          Our service is provided "as is" and is intended to be used for resume optimization purposes only. You agree to use the service in compliance with all applicable laws.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Account Terms</h2>
        <p className="text-slate-600 mb-6">
          You are responsible for maintaining the security of your account and for all activities that occur under your account.
        </p>
      </div>
    </div>
  );
}
