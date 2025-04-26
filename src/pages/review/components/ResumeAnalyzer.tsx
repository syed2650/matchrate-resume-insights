
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Feedback } from "../types";
import ReviewForm from "../ReviewForm";
import { canUseFeedback } from "../utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ResumeAnalyzerProps {
  onAnalysisComplete: (feedback: Feedback) => void;
  isLoading: boolean;
  isDisabled?: boolean;
}

const ResumeAnalyzer = ({ onAnalysisComplete, isLoading, isDisabled = false }: ResumeAnalyzerProps) => {
  const { toast } = useToast();
  const [showLimitWarning, setShowLimitWarning] = useState(!canUseFeedback());

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
      setShowLimitWarning(true);
      return;
    }

    try {
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
      
      // Add required properties for storage
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
    }
  };

  return (
    <Card className="p-6">
      {showLimitWarning && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
          <h3 className="text-lg font-medium mb-2">Usage Limit Reached</h3>
          <p className="mb-4">
            You've reached your usage limit for resume reviews. Free plan users get 1 review per day.
          </p>
          <Button asChild>
            <Link to="/pricing">Upgrade to Paid Plan</Link>
          </Button>
        </div>
      )}
      
      <ReviewForm 
        onSubmit={handleFormSubmit} 
        isLoading={isLoading}
        isDisabled={isDisabled}
      />
    </Card>
  );
};

export default ResumeAnalyzer;
