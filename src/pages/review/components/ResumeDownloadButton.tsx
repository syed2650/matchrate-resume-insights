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
  selectedTheme?: string;
  disabled?: boolean;
}

const ResumeDownloadButton: React.FC<ResumeDownloadButtonProps> = ({
  currentResume,
  roleSummary,
  selectedTheme = "teal",
  disabled = false
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
      const docBlob = await generateFormattedDocx(currentResume, selectedTheme);
      if (!docBlob) throw new Error("Failed to generate document");

      const url = URL.createObjectURL(docBlob);
      const a = document.createElement("a");
      const dateStr = new Date().toISOString().split('T')[0];
      const roleStr = roleSummary ? `-${roleSummary.replace(/\s+/g, '-')}` : '';
      a.href = url;
      a.download = `optimized-resume${roleStr}-${dateStr}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      trackRewriteUsage();
      toast({ title: "Success", description: "Resume downloaded successfully" });
    } catch (error) {
      console.error("Download error:", error);
      toast({ title: "Error", description: "Failed to download resume", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleDownload} disabled={disabled} className="flex-1 sm:flex-none">
        <Download className="mr-1.5 h-4 w-4" /> Download
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
