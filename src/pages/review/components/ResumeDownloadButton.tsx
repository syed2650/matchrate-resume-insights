
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateFormattedDocx } from "../utils/resumeDocGenerator";
import { Progress } from "@/components/ui/progress";
import { trackRewriteUsage } from "../utils";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

interface ResumeDownloadButtonProps {
  currentResume: string;
  roleSummary: string;
  disabled?: boolean;
  roleId?: string; 
}

type RoleTemplate = Database["public"]["Tables"]["role_templates"]["Row"];

const ResumeDownloadButton: React.FC<ResumeDownloadButtonProps> = ({
  currentResume,
  roleSummary,
  disabled = false,
  roleId
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
      // Fetch role template if roleId is provided
      let formattingStyle = null;
      
      if (roleId) {
        try {
          setProgress(20);
          const { data: templateData } = await supabase
            .from('role_templates')
            .select('formatting_style')
            .eq('role_name', roleId)
            .single();
            
          if (templateData) {
            formattingStyle = templateData.formatting_style;
          }
          setProgress(40);
        } catch (error) {
          console.error("Error fetching role template:", error);
          // Continue with default formatting if template fetch fails
        }
      }
      
      setProgress(50);
      const docBlob = await generateFormattedDocx(currentResume, formattingStyle);
      if (!docBlob) {
        throw new Error("Failed to generate document");
      }
      
      setProgress(80);
      
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
      
      trackRewriteUsage();
      toast({ title: "Success", description: "Resume downloaded successfully" });
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast({ title: "Error", description: "Failed to download resume", variant: "destructive" });
    } finally {
      setProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
      }, 1000);
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
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-blue-700 text-sm">Please wait while we prepare your document...</p>
        </div>
      )}
    </>
  );
};

export default ResumeDownloadButton;
