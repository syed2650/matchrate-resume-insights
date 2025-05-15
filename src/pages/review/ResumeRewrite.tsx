
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ResumeCopyButton from "./components/ResumeCopyButton";
import ResumeDownloadButton from "./components/ResumeDownloadButton";
import ResumeOptimizedAlert from "./components/ResumeOptimizedAlert";

interface ResumeRewriteProps {
  rewrittenResume: string;
  jobRole: string;
  roleTemplate?: any;
}

const ResumeRewrite: React.FC<ResumeRewriteProps> = ({ 
  rewrittenResume,
  jobRole,
  roleTemplate
}) => {
  if (!rewrittenResume) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rewritten Resume</CardTitle>
          <CardDescription>No rewritten content available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Extract template details if available
  const templateTitle = roleTemplate ? roleTemplate.title : jobRole || "Optimized";
  const bulletFormat = roleTemplate?.bullet_structure?.bullet_format || "";
  const toneStyling = roleTemplate?.tone_guidance || "";

  return (
    <div className="space-y-6">
      <ResumeOptimizedAlert />
      
      {(roleTemplate && bulletFormat) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-800 text-lg">Using {templateTitle} Format</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {bulletFormat && (
                <div>
                  <span className="font-medium text-blue-700">Bullet Format:</span>
                  <span className="ml-2 text-blue-600">{bulletFormat}</span>
                </div>
              )}
              {toneStyling && (
                <div>
                  <span className="font-medium text-blue-700">Tone Style:</span>
                  <span className="ml-2 text-blue-600">{toneStyling.substring(0, 100)}...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Your Rewritten Resume</CardTitle>
          <CardDescription>Optimized for {jobRole || "your target role"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <pre className="whitespace-pre-line text-sm font-mono">{rewrittenResume}</pre>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <ResumeCopyButton content={rewrittenResume} />
          <ResumeDownloadButton 
            currentResume={rewrittenResume} 
            roleSummary={jobRole || "optimized"} 
            roleId={jobRole}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResumeRewrite;
