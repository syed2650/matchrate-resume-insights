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
import ResumeRewrite from "./review/ResumeRewrite";
import { useAuthUser } from "@/hooks/useAuthUser";

const Review = () => {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [helpfulFeedback, setHelpfulFeedback] = useState<null | boolean>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'rewrite'>('analysis');
  const { toast } = useToast();
  const { user } = useAuthUser();

  const handleFormSubmit = async (
    resume: string, 
    jobDescription: string, 
    jobUrl?: string, 
    selectedRole?: string,
    companyType?: string,
    generateRewrite?: boolean
  ) => {
    setIsLoading(true);
    console.log("🚀 Processing review request with inputs:", { 
      resumeLength: resume?.length, 
      jobDescriptionLength: jobDescription?.length,
      jobUrl, 
      selectedRole,
      companyType,
      generateRewrite
    });

    try {
      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: { 
          resume, 
          jobDescription, 
          jobUrl, 
          selectedRole,
          companyType,
          generateRewrite
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log("Received analysis result:", data);

      // Store submission in database and associate with user if exists
      const { data: submissionData, error: submissionError } = await supabase
        .from('submissions')
        .insert({
          resume_text: resume,
          job_description: jobDescription,
          job_url: jobUrl,
          selected_role: selectedRole as any,
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

      setFeedback(data);
      // If there's a rewrite, switch to that tab
      if (data.rewrittenResume) {
        setActiveTab('rewrite');
      }
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

  const handleFeedbackSubmit = async (isHelpful: boolean) => {
    setHelpfulFeedback(isHelpful);
    
    // Store feedback in the submissions table
    if (submissionId) {
      try {
        await supabase
          .from('submissions')
          .update({
            helpful: isHelpful
          })
          .eq('id', submissionId);
        
        console.log("Feedback stored successfully");
      } catch (error) {
        console.error("Error storing feedback:", error);
        toast({
          title: "Feedback Error",
          description: "Could not store feedback",
          variant: "destructive"
        });
      }
    } else {
      console.log("Cannot store feedback: No submission ID available");
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
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              hasRewrite={!!feedback.rewrittenResume}
            />

            {activeTab === 'analysis' ? (
              <ResultList feedback={feedback} />
            ) : (
              <ResumeRewrite rewrittenResume={feedback.rewrittenResume} />
            )}

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
