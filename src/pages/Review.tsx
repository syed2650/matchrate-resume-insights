import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Feedback } from "./review/types";
import { useAuthUser } from "@/hooks/useAuthUser";
import ResumeAnalyzer from "./review/components/ResumeAnalyzer";
import AnalysisResults from "./review/components/AnalysisResults";
import { canUseFeedback, trackFeedbackUsage, getUsageStats } from "./review/utils";
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

  const [selectedTheme, setSelectedTheme] = useState<"teal" | "modern" | "minimal">("teal");

  const { toast } = useToast();
  const { user } = useAuthUser();

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Usage stats:", getUsageStats());
    }
  }, []);

  useEffect(() => {
    if (!canUseFeedback() && !feedback) {
      setShowLimitModal(true);
    }
  }, [feedback]);

  const handleAnalysisComplete = async (data: Feedback) => {
    setIsLoading(false);
    setFeedback(data);
    setHelpfulFeedback(null);

    trackFeedbackUsage();

    try {
      const feedbackResultsForDb = {
        score: data.score,
        missingKeywords: data.missingKeywords || [],
        sectionFeedback: data.sectionFeedback || {},
        weakBullets: data.weakBullets || [],
        toneSuggestions: data.toneSuggestions || "",
        wouldInterview: data.wouldInterview || "",
        rewrittenResume: data.rewrittenResume || "",
        atsScores: data.atsScores || {},
        jobContext: data.jobContext
          ? {
              keywords: data.jobContext.keywords || [],
              responsibilities: data.jobContext.responsibilities || [],
              industry: data.jobContext.industry || "",
              tone: data.jobContext.tone || "",
            }
          : null,
      };

      let selectedRole: JobRole | null = null;
      if (data.jobTitle) {
        const matchedRole = validRoles.find((role) => role.toLowerCase() === data.jobTitle?.toLowerCase());
        if (matchedRole) {
          selectedRole = matchedRole;
        }
      }

      const { data: submissionData, error: submissionError } = await supabase
        .from("submissions")
        .insert({
          resume_text: data.resume || "",
          job_description: data.jobDescription || "",
          job_url: data.jobUrl || null,
          selected_role: selectedRole,
          feedback_results: feedbackResultsForDb,
          user_id: user?.id || null,
        })
        .select("id")
        .single();

      if (submissionError) {
        console.error("Error storing submission:", submissionError);
        toast({
          title: "Error storing feedback",
          description: "Your feedback was generated but couldn't be saved",
          variant: "destructive",
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
        variant: "destructive",
      });
    }
  };

  const handleFeedbackSubmit = async (isHelpful: boolean) => {
    setHelpfulFeedback(isHelpful);

    if (submissionId) {
      try {
        await supabase
          .from("submissions")
          .update({
            helpful: isHelpful,
          })
          .eq("id", submissionId);
      } catch (error) {
        console.error("Error storing feedback:", error);
        toast({
          title: "Feedback Error",
          description: "Could not store feedback",
          variant: "destructive",
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

      {/* Theme Selector UI */}
      <div className="text-center mb-6">
        <label className="mr-2 font-medium">Choose Resume Style:</label>
        <select
          value={selectedTheme}
          onChange={(e) => setSelectedTheme(e.target.value as "teal" | "modern" | "minimal")}
          className="border border-slate-300 rounded px-2 py-1"
        >
          <option value="teal">TealHQ Style</option>
          <option value="modern">Modern</option>
          <option value="minimal">Minimalist</option>
        </select>
      </div>

      {!feedback ? (
        canUseFeedback() ? (
          <ResumeAnalyzer
            onAnalysisComplete={handleAnalysisComplete}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            isDisabled={!canUseFeedback()}
          />
        ) : null
      ) : (
        <AnalysisResults
          feedback={feedback}
          selectedTheme={selectedTheme}
          onReset={() => {
            setFeedback(null);
            setSubmissionId(null);
            setHelpfulFeedback(null);
          }}
          helpfulFeedback={helpfulFeedback}
          onFeedbackSubmit={handleFeedbackSubmit}
        />
      )}

      <UsageLimitModal isOpen={showLimitModal} onClose={handleCloseLimitModal} />
    </div>
  );
};

export default Review;
