
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Feedback } from "../types";
import ReviewForm from "../ReviewForm";
import { canUseFeedback } from "../utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2, Brain } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
          // Use the Supabase anon key as bearer token
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZGtycGVxeGdxaXpuZ2R5cGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNDY5ODEsImV4cCI6MjA2MDcyMjk4MX0.ECPKii1lST8GcNt0M8SGXKLeeyJSL6vtIpoXVH5SZYA',
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

  // Analysis phases to show to user
  const getAnalysisPhase = (progress: number) => {
    if (progress < 20) return { text: "Extracting job requirements...", icon: "📋" };
    if (progress < 40) return { text: "Analyzing resume content...", icon: "📄" };
    if (progress < 60) return { text: "Identifying keyword matches...", icon: "🔍" };
    if (progress < 75) return { text: "Generating recommendations...", icon: "💡" };
    if (progress < 90) return { text: "Preparing final assessment...", icon: "⚙️" };
    return { text: "Finalizing results...", icon: "✅" };
  };

  const analysisPhase = getAnalysisPhase(analysisProgress);

  return (
    <Card className="p-6 relative">
      {showOverlay && (
        <div className="absolute inset-0 bg-slate-50/90 dark:bg-slate-900/90 flex flex-col items-center justify-center z-10 rounded-lg"
             aria-live="polite"
             aria-atomic="true">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-12 w-12 text-blue-600 mr-4 animate-pulse" aria-hidden="true" />
            <div>
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
                Analyzing your resume
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                This may take up to 30 seconds
              </p>
            </div>
          </div>
          
          <div className="w-full max-w-md px-4 mb-2">
            <div className="flex justify-between mb-1 text-sm text-slate-600 dark:text-slate-400">
              <span>{analysisPhase.icon} {analysisPhase.text}</span>
              <span aria-hidden="true">{Math.round(analysisProgress)}%</span>
            </div>
            <Progress 
              value={analysisProgress} 
              className="h-2" 
              aria-label="Analysis progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(analysisProgress)}
            />
          </div>
          
          <div className="mt-6 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 max-w-md">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Our AI is thoroughly analyzing your resume against the job description, identifying both strengths and areas for improvement.
            </p>
          </div>
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
