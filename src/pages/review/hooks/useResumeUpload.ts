
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ResumeFile } from "../types";

export const useResumeUpload = () => {
  const [resume, setResume] = useState("");
  const [resumeFile, setResumeFile] = useState<ResumeFile | null>(null);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (file: File) => {
    setIsParsingResume(true);
    try {
      setResumeFile({
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setResume(text);
        
        toast({
          title: "Resume parsed successfully",
          description: `Extracted ${text.length} characters from ${file.name}`,
        });
        setIsParsingResume(false);
      };
      
      reader.onerror = () => {
        toast({
          title: "Error parsing resume",
          description: "Failed to extract text from the uploaded file. Please paste your resume text manually.",
          variant: "destructive"
        });
        setIsParsingResume(false);
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error("Error parsing resume:", error);
      toast({
        title: "Error parsing resume",
        description: "Failed to extract text from the uploaded file. Please paste your resume text manually.",
        variant: "destructive"
      });
      setIsParsingResume(false);
    }
  };

  const clearResume = () => {
    setResumeFile(null);
    setResume("");
  };

  return {
    resume,
    setResume,
    resumeFile,
    isParsingResume,
    handleFileUpload,
    clearResume
  };
};
