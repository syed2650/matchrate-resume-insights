
import React from "react";
import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";

export const ExportInfo = () => {
  return (
    <Card className="bg-blue-50 p-4 space-y-3 text-sm text-blue-700">
      <div className="flex items-start gap-2">
        <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <p>
          <strong>About ATS Scores:</strong> Scores are locked to this version of your resume and won't change unless you update your input. They reflect structure, keywords, and formatting compatibility.
        </p>
      </div>
      
      <div className="flex items-start gap-2">
        <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <p>
          <strong>Resume Suggestions:</strong> Bullet point improvements are tailored to this specific job description. Replace your original bullets with these for better alignment with the role.
        </p>
      </div>
      
      <div className="flex items-start gap-2">
        <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <p>
          <strong>Export Options:</strong> Download your resume in ATS-friendly formats (.docx recommended). Our templates ensure compatibility with major applicant tracking systems.
        </p>
      </div>
    </Card>
  );
};
