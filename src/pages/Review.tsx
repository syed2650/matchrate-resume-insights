
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Feedback } from "./review/types";
import { useAuthUser } from "@/hooks/useAuthUser";
import ResumeAnalyzer from "./review/components/ResumeAnalyzer";
import AnalysisResults from "./review/components/AnalysisResults";

const Review = () => {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [helpfulFeedback, setHelpfulFeedback] = useState<null | boolean>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuthUser();

  const handleAnalysisComplete = async (data: Feedback) => {
    setFeedback(data);
    setIsLoading(false);
    setHelpfulFeedback(null);

    try {
      // Convert the feedback results to a format compatible with JSON
      // This helps solve the TypeScript error with complex objects
      const feedbackResultsForDb = {
        score: data.score,
        missingKeywords: data.missingKeywords,
        sectionFeedback: data.sectionFeedback,
        weakBullets: data.weakBullets,
        toneSuggestions: data.toneSuggestions,
        wouldInterview: data.wouldInterview,
        rewrittenResume: data.rewrittenResume,
        atsScores: data.atsScores,
        // Convert JobContext to a plain object
        jobContext: data.jobContext ? {
          keywords: data.jobContext.keywords,
          responsibilities: data.jobContext.responsibilities,
          industry: data.jobContext.industry,
          tone: data.jobContext.tone
        } : undefined
      };

      const { data: submissionData, error: submissionError } = await supabase
        .from('submissions')
        .insert({
          resume_text: data.resume || "",
          job_description: data.jobDescription || "",
          job_url: data.jobUrl || null,
          selected_role: data.jobTitle as any || null,
          feedback_results: feedbackResultsForDb,
          user_id: user?.id ?? null
        })
        .select('id')
        .single();

      if (submissionError) {
        console.error("Error storing submission:", submissionError);
      } else if (submissionData) {
        setSubmissionId(submissionData.id);
      }
    } catch (error) {
      console.error("Error storing submission:", error);
    }
  };

  const handleFeedbackSubmit = async (isHelpful: boolean) => {
    setHelpfulFeedback(isHelpful);
    
    if (submissionId) {
      try {
        await supabase
          .from('submissions')
          .update({
            helpful: isHelpful
          })
          .eq('id', submissionId);
      } catch (error) {
        console.error("Error storing feedback:", error);
        toast({
          title: "Feedback Error",
          description: "Could not store feedback",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <h1 className="text-4xl font-bold text-slate-900 mb-8 text-center">
        Resume Analysis & Optimization
      </h1>

      {!feedback ? (
        <ResumeAnalyzer 
          onAnalysisComplete={handleAnalysisComplete}
          isLoading={isLoading}
        />
      ) : (
        <AnalysisResults 
          feedback={feedback}
          onReset={() => setFeedback(null)}
          helpfulFeedback={helpfulFeedback}
          onFeedbackSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
};

export default Review;
