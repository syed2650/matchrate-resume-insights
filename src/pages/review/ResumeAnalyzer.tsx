
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Feedback } from "./types";
import ReviewForm from "./ReviewForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import UsageLimitModal from "./components/UsageLimitModal";
import { canUseFeedback } from "./utils";
import { useEmailService } from "@/hooks/useEmailService";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useResumeAutosave } from "./hooks/useResumeAutosave";

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
  const { user } = useAuthUser();
  const { sendFeedbackNotification } = useEmailService();
  const { saveFormData, loadFormData, clearSavedFormData, lastSaved } = useResumeAutosave();
  const [hasSavedData, setHasSavedData] = useState(false);
  
  // Check for saved form data on initial load
  useEffect(() => {
    const savedData = loadFormData();
    if (savedData && savedData.resume) {
      setHasSavedData(true);
    }
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
    // Check if user has reached their limit
    if (!canUseFeedback()) {
      setShowLimitModal(true);
      return;
    }
    
    try {
      setIsSubmitting(true);

      // Save form data in case of page refresh
      saveFormData({ resume, jobDescription, jobUrl, jobTitle });

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

      // Clear saved data after successful analysis
      clearSavedFormData();

      // Send notification email if user is logged in
      if (user?.email) {
        try {
          // Assuming we save submission ID somewhere, otherwise generate a random one
          const submissionId = data.id || crypto.randomUUID();
          
          await sendFeedbackNotification({
            submissionId,
            userId: user.id,
            score: data.score,
            jobTitle,
            recipientEmail: user.email
          });
        } catch (emailError) {
          // Don't fail the whole process if email fails
        }
      }
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast({
        title: "Error",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseLimitModal = () => {
    setShowLimitModal(false);
  };

  // Function to handle restoring saved data
  const handleRestoreSavedData = () => {
    const savedData = loadFormData();
    if (savedData) {
      // We'll pass this data to the ReviewForm component
      return savedData;
    }
    return null;
  };

  // Function to discard saved data
  const handleDiscardSavedData = () => {
    clearSavedFormData();
    setHasSavedData(false);
    toast({
      title: "Saved data discarded",
      description: "Starting with a clean form",
    });
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
      
      {hasSavedData && !isSubmitting && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800">Resume Analysis in Progress</h3>
          <p className="text-sm text-blue-700 mt-1">
            We found your previous resume analysis data. Would you like to continue where you left off?
          </p>
          <div className="mt-3 flex space-x-3">
            <Button 
              variant="default" 
              size="sm"
              onClick={() => setHasSavedData(false)}
            >
              Continue
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDiscardSavedData}
            >
              Start Fresh
            </Button>
          </div>
        </div>
      )}
      
      <ReviewForm 
        onSubmit={handleFormSubmit} 
        isLoading={isLoading || isSubmitting}
        isDisabled={isDisabled}
        savedData={hasSavedData ? handleRestoreSavedData() : undefined}
      />

      <UsageLimitModal 
        isOpen={showLimitModal} 
        onClose={handleCloseLimitModal} 
      />
    </Card>
  );
};

export default ResumeAnalyzer;
