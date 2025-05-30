
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { trackRewriteUsage } from "../utils";
import { downloadResumeAsPdf } from "../utils/downloadResumeAsPdf";
import { generateDocument } from "../utils/docGenerator";
import { parseResumeIntoData } from "../utils/parseResumeIntoData";

interface ResumeDownloadButtonProps {
  currentResume: string;
  roleSummary: string;
  disabled?: boolean;
  downloadType?: "pdf" | "docx";
}

const ResumeDownloadButton: React.FC<ResumeDownloadButtonProps> = ({
  currentResume,
  roleSummary,
  disabled = false,
  downloadType = "docx"
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (disabled || !currentResume) {
      toast({ title: "Error", description: "No resume content available to download", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    
    try {
      if (downloadType === "pdf") {
        // Download as PDF
        await downloadResumeAsPdf(currentResume);
      } else {
        // Download as DOCX - now using the same parser as the preview
        const parsedResume = parseResumeIntoData(currentResume);
        const docBlob = await generateDocument(parsedResume);
        if (!docBlob) {
          throw new Error("Failed to generate document");
        }
        
        // Create a download link
        const url = URL.createObjectURL(docBlob);
        const a = document.createElement("a");
        a.href = url;
        
        // Set filename - with date and role if available
        const dateStr = new Date().toISOString().split('T')[0];
        const roleStr = roleSummary ? `-${roleSummary.replace(/\s+/g, '-')}` : '';
        a.download = `optimized-resume${roleStr}-${dateStr}.docx`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      trackRewriteUsage();
      toast({ title: "Success", description: `Resume downloaded successfully as ${downloadType.toUpperCase()}` });
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast({ title: "Error", description: "Failed to download resume", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleDownload}
        disabled={disabled}
        className="flex-1 sm:flex-none"
      >
        <Download className="mr-1.5 h-4 w-4" /> Download {downloadType.toUpperCase()}
      </Button>
      {isProcessing && (
        <div className="mt-3 bg-blue-50 p-4 border border-blue-100 rounded-lg">
          <h4 className="text-blue-800 font-medium mb-2">Processing Your Resume</h4>
          <Progress value={50} className="h-2 mb-2" />
          <p className="text-blue-700 text-sm">Please wait while we prepare your document...</p>
        </div>
      )}
    </>
  );
};

export default ResumeDownloadButton;
