
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Feedback } from "../types";
import ReviewForm from "../ReviewForm";
import { canUseFeedback } from "../utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface ResumeAnalyzerProps {
  onAnalysisComplete: (feedback: Feedback) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isDisabled?: boolean;
}

const ResumeAnalyzer = ({ onAnalysisComplete, isLoading, setIsLoading, isDisabled = false }: ResumeAnalyzerProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  useEffect(() => {
    const listener = () => {
      setIsSubmitting(true);
    };
    window.addEventListener("set-loading-true", listener);

    return () => {
      window.removeEventListener("set-loading-true", listener);
    };
  }, []);

  // Reset submitting state when isLoading changes to false
  useEffect(() => {
    if (!isLoading && isSubmitting) {
      setIsSubmitting(false);
      setAnalysisProgress(0);
    }
  }, [isLoading]);
  
  // Simulate progress updates while analysis is running
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isSubmitting) {
      setAnalysisProgress(10); // Start at 10%
      
      interval = setInterval(() => {
        setAnalysisProgress(prev => {
          // Gradually increase but never reach 100%
          if (prev < 20) return prev + 5;
          if (prev < 50) return prev + 3;
          if (prev < 70) return prev + 1;
          if (prev < 85) return prev + 0.5;
          return prev;
        });
      }, 800);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSubmitting]);

  const handleFormSubmit = async (
    resume: string,
    jobDescription: string,
    jobUrl?: string,
    jobTitle?: string
  ) => {
    // Check if user can use the feature
    if (!canUseFeedback()) {
      toast({
        title: "Usage Limit Reached",
        description: "You've reached your usage limit for the day. Please try again tomorrow or upgrade your plan.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setIsLoading(true);

      const response = await fetch('https://rodkrpeqxgqizngdypbl.functions.supabase.co/analyze-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZGtycGVxeGdxaXpuZ2R5cGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNDY5ODEsImV4cCI6MjA2MDcyMjk4MX0.ECPKii1lST8GcNt0M8SGXKLeeyJSL6vtIpoXVH5SZYA',
        },
        body: JSON.stringify({
          resume,
          jobDescription,
          jobUrl,
          selectedRole: jobTitle || "General",
          generateRewrite: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      
      // Add required properties for storage
      const enhancedData = {
        ...data,
        resume,
        jobDescription,
        jobUrl,
        jobTitle
      };
      
      // Set analysis progress to 100% to indicate success before calling onAnalysisComplete
      setAnalysisProgress(100);
      
      // Small delay to allow user to see 100% completion
      setTimeout(() => {
        onAnalysisComplete(enhancedData);
      }, 500);
      
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze resume",
        variant: "destructive"
      });
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const showOverlay = isLoading || isSubmitting;

  return (
    <Card className="p-6 relative">
      {showOverlay && (
        <div className="absolute inset-0 bg-slate-50/80 flex flex-col items-center justify-center z-10 rounded-lg">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="text-lg font-medium text-slate-800">Analyzing your resume...</p>
          
          <div className="w-64 mt-4 mb-2 bg-slate-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{width: `${analysisProgress}%`}}
            ></div>
          </div>
          
          <p className="text-sm text-slate-600">
            {analysisProgress < 30 && "Extracting job requirements..."}
            {analysisProgress >= 30 && analysisProgress < 60 && "Analyzing resume content..."}
            {analysisProgress >= 60 && analysisProgress < 90 && "Generating recommendations..."}
            {analysisProgress >= 90 && "Finalizing results..."}
          </p>
        </div>
      )}
      
      <ReviewForm 
        onSubmit={handleFormSubmit} 
        isLoading={showOverlay}
        isDisabled={isDisabled}
      />
    </Card>
  );
};

export default ResumeAnalyzer;
