
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
      
      // For PDF files, we would need a PDF.js implementation
      // For now, we'll handle basic text and DOCX as text
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          
          // Clean up text if needed (remove binary artifacts)
          const cleanText = text.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
          setResume(cleanText || "");
          
          toast({
            title: "Resume parsed successfully",
            description: `Extracted content from ${file.name}`,
          });
        } catch (parseError) {
          console.error("Error parsing file content:", parseError);
          toast({
            title: "Error parsing resume",
            description: "Failed to extract text from the uploaded file. Please paste your resume text manually.",
            variant: "destructive"
          });
        } finally {
          setIsParsingResume(false);
        }
      };
      
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        toast({
          title: "Error parsing resume",
          description: "Failed to read the uploaded file. Please paste your resume text manually.",
          variant: "destructive"
        });
        setIsParsingResume(false);
      };
      
      // Read the file as text
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
