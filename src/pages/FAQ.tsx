
import { Card } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export default function FAQ() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <HelpCircle className="h-8 w-8" />
        Frequently Asked Questions
      </h1>
      
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">What is Matchrate.ai?</h3>
          <p className="text-slate-600">Matchrate.ai is an AI-powered resume feedback tool that helps tech professionals optimize their resumes for specific job descriptions.</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">How does it work?</h3>
          <p className="text-slate-600">Simply upload your resume and the job description you're targeting. Our AI will analyze the match rate and provide detailed feedback to improve your chances.</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">What makes Matchrate.ai different?</h3>
          <p className="text-slate-600">We focus specifically on tech roles and provide actionable, role-specific feedback that helps you stand out in the application process.</p>
        </Card>
      </div>
    </div>
  );
}
