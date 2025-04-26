
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, FileText, FileType, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import InterviewReadyIndicator from "./InterviewReadyIndicator";

interface ResumeHeaderProps {
  currentAtsScore: number;
  roleSummary: string;
  generatedTimestamp: string;
  isInterviewReady: boolean;
  onCopy: () => void;
  onDownloadDocx: () => void;
  onDownloadPdf: () => void;
}

const ResumeHeader = ({
  currentAtsScore,
  roleSummary,
  generatedTimestamp,
  isInterviewReady,
  onCopy,
  onDownloadDocx,
  onDownloadPdf
}: ResumeHeaderProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    onCopy();
    setCopied(true);
    toast({
      title: "Success",
      description: "Resume copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const getAtsScoreBadge = (score: number) => {
    if (score >= 80) {
      return <Badge className="bg-green-600 hover:bg-green-700 ml-2">ATS Score: {score}</Badge>;
    } else if (score >= 60) {
      return <Badge className="bg-amber-600 hover:bg-amber-700 ml-2">ATS Score: {score}</Badge>;
    } else {
      return <Badge className="bg-red-600 hover:bg-red-700 ml-2">ATS Score: {score}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 flex items-center">
            ATS-Optimized Resume
            {currentAtsScore > 0 && getAtsScoreBadge(currentAtsScore)}
          </h3>
          
          {roleSummary && (
            <div className="mt-1 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-3 py-1 inline-block">
              {roleSummary}
            </div>
          )}

          {generatedTimestamp && (
            <div className="mt-1 text-xs text-slate-500">
              Generated on {generatedTimestamp}
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onDownloadDocx}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <FileText className="h-4 w-4 mr-2" />
            Download .docx
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onDownloadPdf}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <FileType className="h-4 w-4 mr-2" />
            Download .pdf
          </Button>
        </div>
      </div>
      
      <InterviewReadyIndicator isReady={isInterviewReady} score={currentAtsScore} />
    </div>
  );
};

export default ResumeHeader;
