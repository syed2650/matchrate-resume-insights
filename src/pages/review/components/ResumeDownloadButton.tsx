
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type JobRole = Database["public"]["Enums"]["job_role"];
const validRoles: JobRole[] = ["Product Manager", "UX Designer", "Data Analyst", "Software Engineer", "Consultant"];

interface ResumeDownloadButtonProps {
  currentResume: string;
  roleSummary: string;
  roleId?: string;
}

const ResumeDownloadButton: React.FC<ResumeDownloadButtonProps> = ({
  currentResume,
  roleSummary,
  roleId
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const downloadAsDoc = async () => {
    try {
      setIsLoading(true);

      // Validate roleId if provided
      let validatedRoleId: JobRole | null = null;
      if (roleId) {
        // Check if the roleId matches any of the valid roles (case insensitive)
        const matchedRole = validRoles.find(
          role => role.toLowerCase() === roleId.toLowerCase()
        );
        
        if (matchedRole) {
          validatedRoleId = matchedRole;
        }
      }

      // Determine filename
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `optimized-resume-${roleSummary.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.docx`;
      
      const response = await fetch('https://rodkrpeqxgqizngdypbl.functions.supabase.co/generate-resume-doc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: currentResume,
          roleType: validatedRoleId || null
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate document');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Resume downloaded as DOCX file"
      });
      
    } catch (error) {
      console.error("Error downloading as DOCX:", error);
      toast({
        title: "Error",
        description: "Failed to download resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={downloadAsDoc}
      disabled={isLoading} 
      className="w-full sm:w-auto"
    >
      {isLoading ? (
        "Downloading..."
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Download as DOCX
        </>
      )}
    </Button>
  );
};

export default ResumeDownloadButton;
