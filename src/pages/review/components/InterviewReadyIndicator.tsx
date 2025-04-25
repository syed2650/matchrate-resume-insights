
import React from "react";
import { Check, X } from "lucide-react";

interface InterviewReadyIndicatorProps {
  isReady: boolean;
  score: number;
}

const InterviewReadyIndicator: React.FC<InterviewReadyIndicatorProps> = ({ 
  isReady, 
  score 
}) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        Interview Readiness
      </h3>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isReady ? (
            <div className="bg-green-100 text-green-800 p-1 rounded-full">
              <Check className="h-5 w-5" />
            </div>
          ) : (
            <div className="bg-red-100 text-red-800 p-1 rounded-full">
              <X className="h-5 w-5" />
            </div>
          )}
          
          <span className={`font-medium ${isReady ? 'text-green-700' : 'text-red-700'}`}>
            {isReady ? 'Interview-Ready' : 'Needs Improvement'}
          </span>
        </div>
        
        <div className="text-sm text-slate-500">
          Based on your ATS score of {score}/100
        </div>
      </div>
      
      <p className="mt-3 text-sm text-slate-600">
        {isReady 
          ? 'Your resume is well-optimized for this position and likely to pass through ATS systems. Focus on preparing for the interview!' 
          : 'Consider implementing the suggested improvements to increase your chances of getting an interview.'}
      </p>
    </div>
  );
};

export default InterviewReadyIndicator;
