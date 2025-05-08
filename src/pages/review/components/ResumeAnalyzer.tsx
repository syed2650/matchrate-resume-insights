
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Feedback } from "../types";
import ReviewForm from "../ReviewForm";
import { Loader2 } from "lucide-react";
import UsageLimitModal from "./UsageLimitModal";
import { canUseFeedback, trackFeedbackUsage } from "../utils";

interface ResumeAnalyzerProps {
  onAnalysisComplete: (feedback: Feedback) => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isDisabled?: boolean;
}

const ResumeAnalyzer = ({ onAnalysisComplete, isLoading, setIsLoading, isDisabled = false }: ResumeAnalyzerProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  
  useEffect(() => {
    const listener = () => {
      setIsSubmitting(true); // 🔥 Set loading TRUE immediately on click
    };
    window.addEventListener("set-loading-true", listener);

    return () => {
      window.removeEventListener("set-loading-true", listener);
    };
  }, []);

  const handleFormSubmit = async (
    resume: string,
    jobDescription: string,
    jobUrl?: string,
    jobTitle?: string
  ) => {
    // Check if user has reached their limit
    try {
      const canUse = await canUseFeedback();
      if (!canUse) {
        setShowLimitModal(true);
        return;
      }
      
      // Track usage if we're allowed to proceed
      await trackFeedbackUsage();
      
      setIsSubmitting(true);

      // Use the API endpoint
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        // Get error text without trying to parse as JSON first
        const errorText = await response.text();
        let errorData;
        
        // Try to parse as JSON if possible
        try {
          errorData = JSON.parse(errorText);
        } catch (parseError) {
          // If it's not valid JSON, use the text directly
          errorData = { message: errorText };
        }
        
        throw new Error(`API error (${response.status}): ${errorData.message || errorText}`);
      }

      // Parse the JSON response
      const data = await response.json();
      
      // Check for API error
      if (data.error) {
        throw new Error(data.error);
      }
      
      const enhancedData = {
        ...data,
        resume,
        jobDescription,
        jobUrl,
        jobTitle
      };
      
      onAnalysisComplete(enhancedData);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze resume",
        variant: "destructive"
      });
      
      // Send empty feedback object with error to still navigate to results view
      // but show error state instead of loading forever
      onAnalysisComplete({
        error: error instanceof Error ? error.message : "Failed to analyze resume",
        resume,
        jobDescription,
        jobUrl,
        jobTitle,
        score: 0,
        missingKeywords: [],
        sectionFeedback: {},
        weakBullets: [],
        toneSuggestions: "Error occurred during analysis",
        wouldInterview: "Unable to provide recommendation due to error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseLimitModal = () => {
    setShowLimitModal(false);
  };

  return (
    <Card className="p-6 relative">
      {isSubmitting && (
        <div className="absolute inset-0 bg-slate-50/80 flex flex-col items-center justify-center z-10 rounded-lg">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="text-lg font-medium text-slate-800">Analyzing your resume...</p>
          <p className="text-sm text-slate-600 mt-2">This may take up to 30 seconds</p>
        </div>
      )}
      
      <ReviewForm 
        onSubmit={handleFormSubmit} 
        isLoading={isLoading || isSubmitting}
        isDisabled={isDisabled}
      />

      <UsageLimitModal 
        isOpen={showLimitModal} 
        onClose={handleCloseLimitModal} 
      />
    </Card>
  );
};

export default ResumeAnalyzer;
