
import React from "react";
import { Card } from "@/components/ui/card";
import { LockIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { parseResumeText } from "../utils/resumeParser";
import ResumePreview from "./ResumePreview";
import { parseResumeIntoData } from "../utils/parseResumeIntoData";

interface ResumeContentProps {
  currentResume: string;
  jobContext?: {
    keywords: string[];
    responsibilities: string[];
    industry: string;
    tone: string;
  };
  isPremiumBlurred?: boolean;
}

const ResumeContent: React.FC<ResumeContentProps> = ({ currentResume, jobContext, isPremiumBlurred = false }) => {
  if (!currentResume) return null;
  
  // Parse the resume content into structured data using the more robust parser
  const resumeData = parseResumeIntoData(currentResume);
  
  const renderContent = () => {
    if (isPremiumBlurred) {
      return (
        <div className="relative">
          <div 
            className="absolute inset-0 flex items-center justify-center z-10 bg-white/80 backdrop-blur-[2px]"
          >
            <div className="text-center p-6 max-w-md">
              <div className="mx-auto bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <LockIcon className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
              <p className="text-slate-600 mb-4">
                Resume rewriting is available on our paid plan.
                Upgrade now to access this feature.
              </p>
              <Button asChild>
                <Link to="/pricing">Upgrade to Paid Plan</Link>
              </Button>
            </div>
          </div>
          <ResumePreview data={resumeData} isPremiumBlurred={true} />
        </div>
      );
    }
    
    return <ResumePreview data={resumeData} />;
  };

  return (
    <Card className="overflow-hidden">
      {jobContext && (
        <div className="bg-slate-50 p-3 border-b border-slate-100 text-xs text-slate-600 flex flex-wrap gap-2">
          <span className="font-semibold">Industry:</span> {jobContext.industry}
          <span className="mx-1">•</span>
          <span className="font-semibold">Tone:</span> {jobContext.tone}
        </div>
      )}
      {renderContent()}
    </Card>
  );
};

export default ResumeContent;
