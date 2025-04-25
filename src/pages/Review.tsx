
import { useState, useEffect } from "react";
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
import { 
  generateHash, 
  getATSScoreFromCache, 
  saveATSScoreToCache,
  getATSScoresFromCache,
  storeActiveResumeATSScore
} from "./review/utils";

interface CachedATSScore {
  hash: string;
  scores: Record<string, number>;
  timestamp: string;
}

const Review = () => {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [helpfulFeedback, setHelpfulFeedback] = useState<null | boolean>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'rewrite'>('analysis');
  const [cachedAtsScores, setCachedAtsScores] = useState<CachedATSScore[]>([]);
  const [currentScoreHash, setCurrentScoreHash] = useState<string | null>(null);
  const [jobSector, setJobSector] = useState<"saas" | "enterprise" | "public" | "startup" | "consulting" | "general">("general");
  const { toast } = useToast();
  const { user } = useAuthUser();
  const [exportError, setExportError] = useState<string | null>(null);

  useEffect(() => {
    setCachedAtsScores(getATSScoresFromCache());
  }, []);

  useEffect(() => {
    if (cachedAtsScores.length > 0) {
      localStorage.setItem('cachedATSScores', JSON.stringify(cachedAtsScores));
    }
  }, [cachedAtsScores]);

  const handleFormSubmit = async (
    resume: string, 
    jobDescription: string, 
    jobUrl?: string, 
    jobTitle?: string,
    companyType?: string,
    generateRewrite?: boolean,
    multiVersion?: boolean
  ) => {
    setIsLoading(true);
    setExportError(null);
    console.log("🚀 Processing review request with inputs:", { 
      resumeLength: resume?.length, 
      jobDescriptionLength: jobDescription?.length,
      jobUrl, 
      jobTitle,
      companyType: companyType || jobSector,
      generateRewrite,
      multiVersion
    });

    try {
      const inputHash = generateHash(resume, jobDescription);
      setCurrentScoreHash(inputHash);
      storeActiveResumeATSScore(inputHash);
      
      const cachedScore = getATSScoreFromCache(inputHash);
      console.log("Cached score found:", !!cachedScore);

      //const { data, error } = await supabase.functions.invoke("analyze-resume", {
       // body: { 
         // resume, 
         // jobDescription, 
         // jobUrl, 
         // selectedRole: jobTitle || "General",
         // companyType: companyType || jobSector,
         // generateRewrite,
         // multiVersion,
         // skipATSCalculation: !!cachedScore,
         // scoreHash: inputHash
      //  }
      // });

      const response = await fetch('https://<your-supabase-project-id>.functions.supabase.co/analyze-resume', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZGtycGVxeGdxaXpuZ2R5cGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNDY5ODEsImV4cCI6MjA2MDcyMjk4MX0.ECPKii1lST8GcNt0M8SGXKLeeyJSL6vtIpoXVH5SZYA', // Replace with your real anon key
  },
  body: JSON.stringify({
    resume,
    jobDescription,
    jobUrl,
    selectedRole: jobTitle || "General",
    companyType: companyType || jobSector,
    generateRewrite,
    multiVersion,
    skipATSCalculation: !!cachedScore,
    scoreHash: inputHash,
  }),
});

const data = await response.json();

      if (!response.ok) {
  throw new Error(`Error from Supabase Function: ${data.error || 'Unknown error'}`);
}
      //if (error) {
        //throw new Error(error.message);
      //}

      console.log("Received analysis result:", data);

      if (cachedScore) {
        console.log("Using cached ATS score from:", cachedScore.timestamp);
        data.atsScores = cachedScore.scores;
      } else if (data.atsScores) {
        console.log("Caching new ATS scores");
        saveATSScoreToCache(inputHash, data.atsScores);
        setCachedAtsScores(getATSScoresFromCache());
      }

      const { data: submissionData, error: submissionError } = await supabase
        .from('submissions')
        .insert({
          resume_text: resume,
          job_description: jobDescription,
          job_url: jobUrl,
          selected_role: jobTitle as any,
          feedback_results: data,
          user_id: user?.id ?? null,
          job_sector: jobSector
        })
        .select('id')
        .single();

      if (submissionError) {
        console.error("Error storing submission:", submissionError);
      } else if (submissionData) {
        setSubmissionId(submissionData.id);
      }

      setFeedback(data);
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
    if (!feedback) {
      toast({
        title: "Error",
        description: "No feedback to export",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setExportError(null);
      console.log("Generating PDF...");
      const doc = generatePDF(feedback);
      doc.save("matchrate-feedback-report.pdf");
      
      toast({
        title: "Success",
        description: "Feedback report downloaded successfully",
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      setExportError("Failed to generate PDF: " + (error.message || "Unknown error"));
      toast({
        title: "Export Failed",
        description: "Could not generate PDF report. Try again or contact support.",
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
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <h1 className="text-4xl font-bold text-slate-900 mb-8 text-center">
        Resume Analysis & Optimization
      </h1>

      {!feedback ? (
        <ReviewForm 
          onSubmit={handleFormSubmit} 
          isLoading={isLoading}
          jobSector={jobSector}
          setJobSector={setJobSector} 
        />
      ) : (
        <Card className="p-6 shadow-md rounded-xl">
          <div className="space-y-8">
            <AnalysisHeader 
              onReset={() => setFeedback(null)} 
              onExportPDF={handleExportPDF}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              hasRewrite={!!feedback.rewrittenResume}
            />

            {exportError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4">
                {exportError}
              </div>
            )}

            {activeTab === 'analysis' ? (
              <>
                <ResultList feedback={feedback} />
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-600">
                  <p>
                    <strong>About Our Analysis:</strong> AI analysis is based on your most recent inputs. 
                    ATS compatibility reflects structure, keywords, and formatting. 
                    Score won't change unless your resume does.
                  </p>
                </div>
              </>
            ) : (
              <ResumeRewrite 
                rewrittenResume={feedback.rewrittenResume} 
                atsScores={feedback.atsScores}
                scoreHash={currentScoreHash}
                jobContext={feedback.jobContext}
                jobSector={jobSector}
              />
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
