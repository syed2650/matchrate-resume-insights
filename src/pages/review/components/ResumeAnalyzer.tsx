
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Feedback } from "../types";
import ReviewForm from "../ReviewForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import UsageLimitModal from "./UsageLimitModal";
import { canUseFeedback } from "../utils";

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
  const [canUse, setCanUse] = useState<boolean | null>(null);
  
  // Check usage limits when component loads
  useEffect(() => {
    const checkUsageLimits = async () => {
      const allowed = await canUseFeedback();
      setCanUse(allowed);
      
      // Show limit modal if user has reached their limit
      if (!allowed) {
        setShowLimitModal(true);
      }
    };
    
    checkUsageLimits();
  }, []);
  
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
    // Double-check if user has reached their limit
    const allowed = await canUseFeedback();
    if (!allowed) {
      setShowLimitModal(true);
      return;
    }
    
    try {
      setIsSubmitting(true);

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

      const data = await response.json();
      
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
        isDisabled={isDisabled || canUse === false}
      />

      <UsageLimitModal 
        isOpen={showLimitModal} 
        onClose={handleCloseLimitModal} 
      />
    </Card>
  );
};

export default ResumeAnalyzer;
