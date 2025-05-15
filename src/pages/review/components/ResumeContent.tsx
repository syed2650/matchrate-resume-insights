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
  return (
    <div className={selectedTheme === "teal" ? "bg-slate-50 p-6" : "p-4"}>
      <pre className="whitespace-pre-wrap font-sans text-sm">{currentResume}</pre>
    </div>
  );
};

export default ResumeContent;
