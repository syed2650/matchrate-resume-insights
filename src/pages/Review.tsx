
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
      const { data: submissionData, error: submissionError } = await supabase
        .from('submissions')
        .insert({
          resume_text: data.resume,
          job_description: data.jobDescription,
          job_url: data.jobUrl,
          selected_role: data.jobTitle as any,
          feedback_results: data,
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
