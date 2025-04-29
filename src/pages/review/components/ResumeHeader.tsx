
import React from "react";

interface ResumeHeaderProps {
  currentAtsScore: number;
  roleSummary: string;
  generatedTimestamp: string;
  isInterviewReady: boolean;
  onCopy: () => void;
  onDownload?: () => void;
  isPremiumLocked?: boolean;
}

const ResumeHeader: React.FC<ResumeHeaderProps> = ({
  currentAtsScore,
  roleSummary,
  generatedTimestamp,
  isInterviewReady,
  isPremiumLocked = false
}) => {
  const scoreColorClass = 
    currentAtsScore >= 80 ? "text-emerald-600" :
    currentAtsScore >= 70 ? "text-amber-600" : "text-red-600";

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-800">
            Optimized Resume
          </h3>
          {isInterviewReady && (
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
              Interview Ready
            </span>
          )}
        </div>
        
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600">ATS Score:</span> 
            <span className={`font-medium ${scoreColorClass}`}>{currentAtsScore}/100</span>
          </div>
          
          {roleSummary && (
            <>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">{roleSummary}</span>
            </>
          )}
          
          {generatedTimestamp && (
            <>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 text-xs">Generated: {generatedTimestamp}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeHeader;
