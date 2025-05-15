
import React from "react";
import { Info } from "lucide-react";

export const ExportInfo: React.FC = () => {
  return (
    <div className="bg-white border border-blue-100 rounded-lg p-4 text-sm text-slate-700 space-y-3">
      <div className="flex gap-2 items-center">
        <Info className="h-4 w-4 text-blue-500" />
        <h4 className="font-medium">About Resume Exports</h4>
      </div>
      
      <div className="space-y-2 pl-6">
        <p>
          <span className="font-medium text-blue-700">🧠 ATS Compatibility:</span> Scores are locked to this version of your resume and won't change unless you modify your input.
        </p>
        
        <p>
          <span className="font-medium text-blue-700">🎯 Bullet Points:</span> Suggested rewrites are tailored to this specific job description and follow the STAR format for better impact.
        </p>
        
        <p>
          <span className="font-medium text-blue-700">📎 Document Format:</span> The .docx export is job-ready and compatible with all major ATS platforms. It preserves proper formatting while keeping a clean structure.
        </p>
      </div>
    </div>
  );
};

// Not adding a default export, we'll use the named export
