
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateFormattedDocx } from "../utils/resumeDocGenerator";
import { Progress } from "@/components/ui/progress";
import { trackRewriteUsage } from "../utils";

interface ResumeDownloadButtonProps {
  currentResume: string;
  roleSummary: string;
  disabled?: boolean;
}

const ResumeDownloadButton: React.FC<ResumeDownloadButtonProps> = ({
  currentResume,
  roleSummary,
  disabled = false
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (disabled || !currentResume) {
      toast({ title: "Error", description: "No resume content available to download", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setProgress(10);
    
    try {
      // Start processing animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Generate the document
      const docBlob = await generateFormattedDocx(currentResume);
      if (!docBlob) {
        throw new Error("Failed to generate document");
      }
      
      setProgress(95);
      
      // Create a download link
      const url = URL.createObjectURL(docBlob);
      const a = document.createElement("a");
      a.href = url;
      
      // Set filename - with date and role if available
      const dateStr = new Date().toISOString().split('T')[0];
      const roleStr = roleSummary ? `-${roleSummary.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}` : '';
      a.download = `optimized-resume${roleStr}-${dateStr}.docx`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      trackRewriteUsage();
      toast({ title: "Success", description: "Resume downloaded successfully" });
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast({ title: "Error", description: "Failed to download resume", variant: "destructive" });
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleDownload}
        disabled={disabled || isProcessing}
        className="flex-1 sm:flex-none"
      >
        <Download className="mr-1.5 h-4 w-4" /> 
        {isProcessing ? "Processing..." : "Download"}
      </Button>
      {isProcessing && (
        <div className="mt-3 bg-blue-50 p-4 border border-blue-100 rounded-lg">
          <h4 className="text-blue-800 font-medium mb-2">Processing Your Resume</h4>
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-blue-700 text-sm">
            {progress < 50 
              ? "Formatting document..." 
              : progress < 90 
                ? "Applying professional styling..." 
                : "Preparing download..."}
          </p>
        </div>
      )}
    </>
  );
};

export default ResumeDownloadButton;
