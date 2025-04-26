
import React from "react";
import { JobContext } from "../types";
import { Badge } from "@/components/ui/badge";

interface ResumeContentProps {
  currentResume: string;
  jobContext?: JobContext;
}

const ResumeContent = ({ currentResume, jobContext }: ResumeContentProps) => {
  const renderJobContext = () => {
    if (!jobContext || (!jobContext.keywords?.length && !jobContext.industry)) {
      return null;
    }
    
    return (
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">Job Context Used to Optimize Resume</h4>
        {jobContext.industry && (
          <div className="mb-2">
            <span className="text-xs font-medium text-blue-700">Industry:</span> 
            <span className="text-xs ml-1">{jobContext.industry}</span>
          </div>
        )}
        {jobContext.tone && (
          <div className="mb-2">
            <span className="text-xs font-medium text-blue-700">Tone:</span> 
            <span className="text-xs ml-1">{jobContext.tone}</span>
          </div>
        )}
        {jobContext.keywords?.length > 0 && (
          <div className="mb-2">
            <span className="text-xs font-medium text-blue-700">Key Skills:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {jobContext.keywords.map((keyword, idx) => (
                <Badge key={idx} variant="outline" className="text-xs bg-white">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {jobContext.responsibilities?.length > 0 && (
          <div>
            <span className="text-xs font-medium text-blue-700">Core Responsibilities:</span>
            <ul className="text-xs mt-1 list-disc list-inside">
              {jobContext.responsibilities.map((resp, idx) => (
                <li key={idx}>{resp}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {renderJobContext()}
      <div className="border rounded-xl p-6 bg-white shadow-md overflow-auto max-h-[600px]">
        <pre className="whitespace-pre-wrap text-slate-700 font-sans text-sm leading-relaxed">
          {currentResume}
        </pre>
      </div>
    </>
  );
};

export default ResumeContent;
