
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Feedback } from "../types";
import ReviewForm from "../ReviewForm";
import AnalysisResults from "./AnalysisResults";

interface ResumeAnalyzerProps {
  onAnalysisComplete: (feedback: Feedback) => void;
  isLoading: boolean;
}

const ResumeAnalyzer = ({ onAnalysisComplete, isLoading }: ResumeAnalyzerProps) => {
  const { toast } = useToast();

  const handleFormSubmit = async (
    resume: string,
    jobDescription: string,
    jobUrl?: string,
    jobTitle?: string
  ) => {
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
      <ReviewForm 
        onSubmit={handleFormSubmit} 
        isLoading={isLoading}
      />
    </Card>
  );
};

export default ResumeAnalyzer;
