
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateFormattedDocx } from "../utils/resumeDocGenerator";
import { Progress } from "@/components/ui/progress";
import { trackRewriteUsage } from "../utils";
import { templates } from "@/templates";

interface ResumeDownloadButtonProps {
  currentResume: string;
  roleSummary: string;
  templateId?: string;
  disabled?: boolean;
}

const ResumeDownloadButton: React.FC<ResumeDownloadButtonProps> = ({
  currentResume,
  roleSummary,
  templateId = "modern",
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
      // Get template
      const template = templates.find(t => t.id === templateId) || templates[0];
      
      const docBlob = await generateFormattedDocx(currentResume, template);
      if (!docBlob) {
        throw new Error("Failed to generate document");
      }
      
      // Create a download link
      const url = URL.createObjectURL(docBlob);
      const a = document.createElement("a");
      a.href = url;
      
      // Set filename - with date and role if available
      const dateStr = new Date().toISOString().split('T')[0];
      const roleStr = roleSummary ? `-${roleSummary.replace(/\s+/g, '-').substring(0, 30)}` : '';
      // Include template name in the filename
      const templateStr = template ? `-${template.name}` : '';
      a.download = `optimized-resume${roleStr}${templateStr}-${dateStr}.docx`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      trackRewriteUsage();
      toast({ title: "Success", description: "Resume downloaded successfully" });
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
