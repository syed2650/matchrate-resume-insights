
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Feedback } from "./review/types";
import { useAuthUser } from "@/hooks/useAuthUser";
import ResumeAnalyzer from "./review/components/ResumeAnalyzer";
import AnalysisResults from "./review/components/AnalysisResults";
import { canUseFeedback, trackFeedbackUsage } from "./review/utils";
import UsageLimitModal from "./review/components/UsageLimitModal";
import { Database } from "@/integrations/supabase/types";

type JobRole = Database["public"]["Enums"]["job_role"];
const validRoles: JobRole[] = ["Product Manager", "UX Designer", "Data Analyst", "Software Engineer", "Consultant"];

const Review = () => {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [helpfulFeedback, setHelpfulFeedback] = useState<null | boolean>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthUser();

  // Check usage limits when component loads - but we'll do this in ResumeAnalyzer
  // to avoid using hooks outside of a component
  
  const handleAnalysisComplete = async (data: Feedback) => {
    setIsLoading(false);
    setFeedback(data);
    setHelpfulFeedback(null);

    try {
      // Skip tracking usage and database storage if there was an error
      if (data.error) {
        return;
      }
      
      // Track feedback usage
      await trackFeedbackUsage();

      // Convert feedback results to a JSON-compatible format
      const feedbackResultsForDb = {
        score: data.score,
        missingKeywords: data.missingKeywords || [],
        sectionFeedback: data.sectionFeedback || {},
        weakBullets: data.weakBullets || [],
        toneSuggestions: data.toneSuggestions || "",
        wouldInterview: data.wouldInterview || "",
        rewrittenResume: data.rewrittenResume || "",
        atsScores: data.atsScores || {},
        jobContext: data.jobContext ? {
          keywords: data.jobContext.keywords || [],
          responsibilities: data.jobContext.responsibilities || [],
          industry: data.jobContext.industry || "",
          tone: data.jobContext.tone || ""
        } : null
      };

      // Convert jobTitle to a valid role enum or null
      let selectedRole: JobRole | null = null;
      if (data.jobTitle) {
        // Check if the jobTitle matches any of the valid roles
        const matchedRole = validRoles.find(
          role => role.toLowerCase() === data.jobTitle?.toLowerCase()
        );
        if (matchedRole) {
          selectedRole = matchedRole;
        }
      }

      // Insert into submissions table
      const { data: submissionData, error: submissionError } = await supabase
        .from('submissions')
        .insert({
          resume_text: data.resume || "",
          job_description: data.jobDescription || "",
          job_url: data.jobUrl || null,
          selected_role: selectedRole,
          feedback_results: feedbackResultsForDb,
          user_id: user?.id || null
        })
        .select('id')
        .single();

      if (submissionError) {
        console.error("Error storing submission:", submissionError);
        
        // More detailed error logging
        if (submissionError.details) {
          console.error("Error details:", submissionError.details);
        }
        if (submissionError.hint) {
          console.error("Error hint:", submissionError.hint);
        }
        
        toast({
          title: "Error storing feedback",
          description: "Your feedback was generated but couldn't be saved",
          variant: "destructive"
        });
      } else if (submissionData) {
        setSubmissionId(submissionData.id);
        toast({
          title: "Analysis complete",
          description: "Your resume has been analyzed successfully",
        });
      }
    } catch (error) {
      console.error("Error storing submission:", error);
      toast({
        title: "Error",
        description: "Failed to store analysis results",
        variant: "destructive"
      });
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

  const handleCloseLimitModal = () => {
    setShowLimitModal(false);
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
          setIsLoading={setIsLoading}
        />
      ) : (
        <AnalysisResults 
          feedback={feedback}
          onReset={() => {
            setFeedback(null);
            setSubmissionId(null);
            setHelpfulFeedback(null);
          }}
          helpfulFeedback={helpfulFeedback}
          onFeedbackSubmit={handleFeedbackSubmit}
        />
      )}

      <UsageLimitModal 
        isOpen={showLimitModal} 
        onClose={handleCloseLimitModal} 
      />
    </div>
  );
};

export default Review;
