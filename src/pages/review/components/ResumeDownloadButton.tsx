
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateFormattedDocx } from "../utils/generateFormattedDocx";

interface ResumeDownloadButtonProps {
  currentResume: string;
  roleSummary: string;
  selectedTheme: "teal" | "modern" | "minimal";
  disabled?: boolean;
}

const ResumeDownloadButton: React.FC<ResumeDownloadButtonProps> = ({ currentResume, roleSummary, selectedTheme, disabled = false }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (disabled || !currentResume) return;
    setIsProcessing(true);

    try {
      const blob = await generateFormattedDocx(currentResume, selectedTheme);
      if (!blob) throw new Error("Generation failed");

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `resume-${roleSummary || "optimized"}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch (e) {
      toast({ title: "Download error", description: "Could not generate document", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={disabled || isProcessing}>
      <Download className="mr-2 h-4 w-4" /> Download
    </Button>
  );
};

export default ResumeDownloadButton;
