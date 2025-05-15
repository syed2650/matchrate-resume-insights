
import React from "react";

interface ResumeContentProps {
  currentResume: string;
  jobContext?: {
    keywords: string[];
    responsibilities: string[];
    industry: string;
    tone: string;
  };
  isPremiumBlurred?: boolean;
  selectedTheme?: "teal" | "modern" | "minimal";
}

const ResumeContent: React.FC<ResumeContentProps> = ({ 
  currentResume, 
  jobContext,
  isPremiumBlurred = false,
  selectedTheme = "teal"
}) => {
  // Add blur effect if premium feature is locked
  const contentClass = isPremiumBlurred 
    ? "filter blur-sm select-none" 
    : "";

  return (
    <div className={`${selectedTheme === "teal" ? "bg-slate-50" : "bg-white"} p-6 border border-slate-200 rounded-lg`}>
      <pre className={`whitespace-pre-wrap font-sans text-sm ${contentClass}`}>{currentResume}</pre>
      
      {isPremiumBlurred && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/80 p-4 rounded-lg shadow text-center">
            <p className="font-medium text-slate-800">Unlock Premium to View</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeContent;
