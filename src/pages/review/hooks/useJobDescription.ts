
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExtractionStatus } from "../types";

export const useJobDescription = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [extractionStatus, setExtractionStatus] = useState<ExtractionStatus>({ status: 'idle' });
  const [jobTitle, setJobTitle] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (jobUrl === '') {
      setExtractionStatus({ status: 'idle' });
    }
  }, [jobUrl]);

  const handleUrlPaste = async () => {
    if (!jobUrl) {
      toast({
        title: "No URL provided",
        description: "Please enter a job URL to extract the description",
        variant: "destructive"
      });
      return;
    }
    
    // Validate URL format
    try {
      new URL(jobUrl); // Will throw if invalid
    } catch (error) {
      toast({
        title: "Invalid URL format",
        description: "Please enter a valid job URL",
        variant: "destructive"
      });
      return;
    }
    
    setExtractionStatus({ status: 'loading', message: 'Attempting to extract job description...' });
    
    try {
      const { data, error } = await supabase.functions.invoke("extract-job-description", {
        body: { url: jobUrl }
      });
      
      if (error) {
        console.error("Function invocation error:", error);
        throw new Error(error.message || "Failed to call extraction function");
      }
      
      console.log("Extract function response:", data);
      
      if (data?.description) {
        // Set job description
        setJobDescription(data.description);
        
        // If we have a title, set it
        if (data.title && data.title !== "Job Position") {
          setJobTitle(data.title);
        }
        
        setExtractionStatus({ 
          status: 'success', 
          message: data.title ? `Successfully extracted: "${data.title}"` : 'Job description extracted successfully!' 
        });
        
        toast({
          title: "Job description extracted",
          description: "Successfully extracted job details from the URL",
        });
      } else {
        setExtractionStatus({ 
          status: 'error', 
          message: 'Could not extract job description. Please paste it manually.' 
        });
        
        toast({
          title: "Extraction failed",
          description: "Could not extract job details from the URL. Please paste the job description manually.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error in extraction process:", error);
      setExtractionStatus({ 
        status: 'error', 
        message: 'An error occurred during extraction. Please paste job description manually.' 
      });
      
      toast({
        title: "Extraction error",
        description: error instanceof Error ? error.message : "Failed to extract job description",
        variant: "destructive"
      });
    }
  };

  return {
    jobDescription,
    setJobDescription,
    jobUrl,
    setJobUrl,
    jobTitle,
    setJobTitle,
    extractionStatus,
    handleUrlPaste
  };
};
