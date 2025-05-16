
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import ScoreCard from "./ScoreCard";
import MissingKeywords from "./MissingKeywords";
import SectionFeedback from "./SectionFeedback";
import SuggestedBullets from "./SuggestedBullets";
import BulletImprovements from "./BulletImprovements";
import ResumeRewrite from "../ResumeRewrite";
import { Feedback } from "../types";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResultsProps {
  feedback: Feedback;
  onReset: () => void;
  helpfulFeedback: boolean | null;
  onFeedbackSubmit: (isHelpful: boolean) => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  feedback,
  onReset,
  helpfulFeedback,
  onFeedbackSubmit,
}) => {
  const [activeTab, setActiveTab] = useState("results");
  const { toast } = useToast();

  if (!feedback) {
    return null;
  }

  const handleFeedback = (isHelpful: boolean) => {
    onFeedbackSubmit(isHelpful);
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback. It helps us improve our service.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header with back button */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-slate-600"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Start New Analysis
        </Button>

        {/* Feedback buttons */}
        {helpfulFeedback === null ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Was this helpful?</span>
            <Button
              size="sm"
              variant="outline"
              className="text-green-600"
              onClick={() => handleFeedback(true)}
            >
              <CheckCircle className="h-4 w-4 mr-1" /> Yes
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600"
              onClick={() => handleFeedback(false)}
            >
              <XCircle className="h-4 w-4 mr-1" /> No
            </Button>
          </div>
        ) : (
          <div className="text-sm text-slate-600">
            {helpfulFeedback
              ? "Thank you for your positive feedback!"
              : "Thank you for your feedback. We'll work to improve."}
          </div>
        )}
      </div>

      {/* Main content with tabs */}
      <Tabs defaultValue="results" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:w-[400px] mb-4">
          <TabsTrigger value="results">Analysis Results</TabsTrigger>
          <TabsTrigger value="rewrite">Optimized Resume</TabsTrigger>
        </TabsList>

        {/* Analysis Results Tab */}
        <TabsContent value="results" className="space-y-8">
          <ScoreCard
            score={feedback.score}
            verdict={feedback.wouldInterview}
            fullAnalysis={true}
          />

          {feedback.missingKeywords && feedback.missingKeywords.length > 0 && (
            <MissingKeywords
              keywords={feedback.missingKeywords}
              description="These keywords appear in the job description but are missing from your resume."
            />
          )}

          {feedback.sectionFeedback && Object.keys(feedback.sectionFeedback).length > 0 && (
            <SectionFeedback feedback={feedback.sectionFeedback} />
          )}

          {feedback.weakBullets && feedback.weakBullets.length > 0 && (
            <BulletImprovements items={feedback.weakBullets} />
          )}

          {/* Only show if property exists - removed bulletSuggestions references */}

          {/* Switch to rewrite tab button */}
          <div className="flex justify-center pt-4">
            <Button onClick={() => setActiveTab("rewrite")}>
              View Optimized Resume
            </Button>
          </div>
        </TabsContent>

        {/* Rewritten Resume Tab */}
        <TabsContent value="rewrite">
          <ResumeRewrite
            rewrittenResume={feedback.rewrittenResume}
            atsScores={feedback.atsScores}
            jobContext={feedback.jobContext}
            originalResume={feedback.resume}
            jobDescription={feedback.jobDescription}
            originalATSScore={feedback.score}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisResults;
