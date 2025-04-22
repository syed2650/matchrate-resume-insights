
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Feedback } from "./review/types";
import ResultList from "./review/ResultList";
import ReviewForm from "./review/ReviewForm";
import AnalysisHeader from "./review/AnalysisHeader";
import FeedbackForm from "./review/FeedbackForm";
import { generatePDF } from "./review/PDFGenerator";

const Review = () => {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [helpfulFeedback, setHelpfulFeedback] = useState<null | boolean>(null);
  const { toast } = useToast();

  const handleFormSubmit = async (
    resume: string, 
    jobDescription: string, 
    jobUrl?: string, 
    selectedRole?: string
  ) => {
    setIsLoading(true);
    console.log("🚀 Processing review request with inputs:", { 
      resumeLength: resume?.length, 
      jobDescriptionLength: jobDescription?.length,
      jobUrl, 
      selectedRole 
    });

    try {
      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: { 
          resume: resume, 
          jobDescription, 
          jobUrl, 
          selectedRole 
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log("Received analysis result:", data);

      // Store submission in database
      await supabase
        .from('submissions')
        .insert({
          resume_text: resume,
          job_description: jobDescription,
          job_url: jobUrl,
          selected_role: selectedRole as any,
          feedback_results: data
        });

      setFeedback(data);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze resume",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setHelpfulFeedback(null);
    }
  };

  const handleExportPDF = () => {
    if (!feedback) return;
    
    const doc = generatePDF(feedback);
    doc.save("resume-review-feedback.pdf");
  };

  const handleFeedbackSubmit = (isHelpful: boolean) => {
    setHelpfulFeedback(isHelpful);
    
    // Store feedback in the metrics table
    if (feedback) {
      supabase
        .from('submissions')
        .update({
          helpful: isHelpful
        })
        .eq('feedback_results', feedback)
        .then(() => {
          console.log("Feedback stored successfully");
        })
        .catch((error) => {
          console.error("Error storing feedback:", error);
        });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">
        Resume Review
      </h1>

      {!feedback ? (
        <ReviewForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      ) : (
        <Card className="p-6">
          <div className="space-y-6">
            <AnalysisHeader 
              onReset={() => setFeedback(null)} 
              onExportPDF={handleExportPDF} 
            />

            <ResultList feedback={feedback} />

            <FeedbackForm 
              helpfulFeedback={helpfulFeedback} 
              onFeedbackSubmit={handleFeedbackSubmit} 
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default Review;
