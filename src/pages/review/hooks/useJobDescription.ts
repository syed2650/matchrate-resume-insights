
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExtractionStatus } from "../types";

export const useJobDescription = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [extractionStatus, setExtractionStatus] = useState<ExtractionStatus>({ status: 'idle' });
  const { toast } = useToast();

  useEffect(() => {
    if (jobUrl === '') {
      setExtractionStatus({ status: 'idle' });
    }
  }, [jobUrl]);

  const handleUrlPaste = async () => {
    if (!jobUrl) return;
    
    setExtractionStatus({ status: 'loading', message: 'Attempting to extract job description...' });
    
    try {
      const { data, error } = await supabase.functions.invoke("extract-job-description", {
        body: { url: jobUrl }
      });
      
      if (error) throw error;
      
      if (data?.description) {
        setJobDescription(data.description);
        setExtractionStatus({ status: 'success', message: 'Job description extracted successfully!' });
        
        toast({
          title: "Job description extracted",
          description: "Successfully extracted job details from the URL",
        });
      } else {
        setExtractionStatus({ 
          status: 'error', 
          message: 'Could not extract job description. Please paste it manually.' 
        });
      }
    } catch (error) {
      console.error("Error in extraction process:", error);
      setExtractionStatus({ 
        status: 'error', 
        message: 'An error occurred during extraction. Please paste job description manually.' 
      });
    }
  };

  return {
    jobDescription,
    setJobDescription,
    jobUrl,
    setJobUrl,
    extractionStatus,
    handleUrlPaste
  };
};
