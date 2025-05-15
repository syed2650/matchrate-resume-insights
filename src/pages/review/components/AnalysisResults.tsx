import { Card } from "@/components/ui/card";
import { Feedback } from "../types";
import AnalysisHeader from "../AnalysisHeader";
import ResultList from "../ResultList";
import FeedbackForm from "../FeedbackForm";
import ResumeRewrite from "../ResumeRewrite";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { FileText, CheckCheck, FileSearch } from "lucide-react";
import { calculateATSScore } from "../utils/atsScoring";
import { useToast } from "@/hooks/use-toast";
import PremiumFeatureModal from "./PremiumFeatureModal";
import { canUseRewrite } from "../utils";
import ResumeDownloadButton from "../ResumeDownloadButton";

interface AnalysisResultsProps {
  feedback: Feedback;
  onReset: () => void;
  helpfulFeedback: boolean | null;
  onFeedbackSubmit: (isHelpful: boolean) => void;
  selectedTheme?: "teal" | "modern" | "minimal";
}

const AnalysisResults = ({
  feedback,
  onReset,
  helpfulFeedback,
  onFeedbackSubmit,
  selectedTheme = "teal",
}: AnalysisResultsProps) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'rewrite'>('analysis');
  const [exportError, setExportError] = useState<string | null>(null);
  const [isRewriteRequested, setIsRewriteRequested] = useState(false);
  const [rewriteLoading, setRewriteLoading] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { toast } = useToast();

  const handleRewriteRequest = () => {
    const canUse = canUseRewrite();
    if (!canUse) {
      setShowPremiumModal(true);
      return;
    }

    setRewriteLoading(true);
    setTimeout(() => {
      setActiveTab('rewrite');
      setIsRewriteRequested(true);
      setRewriteLoading(false);
    }, 500);
  };

  let currentStep = 1;
  if (activeTab === 'rewrite' && isRewriteRequested) {
    currentStep = 3;
  } else if (isRewriteRequested || feedback.rewrittenResume) {
    currentStep = 2;
  }

  return (
    <Card className="p-6 shadow-md rounded-xl">
      <div className="space-y-8">
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {["Analysis", "Review", "Optimize"].map((label, index) => (
              <div key={label} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep > index ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}>
                  {index === 0 ? <FileSearch className="h-4 w-4" /> :
                   index === 1 ? <CheckCheck className="h-4 w-4" /> :
                   <FileText className="h-4 w-4" />}
                </div>
                <span className="text-xs mt-1">{label}</span>
              </div>
            ))}
          </div>
          {rewriteLoading && (
            <div className="mt-2">
              <Progress value={50} className="h-2" />
              <p className="text-sm text-center text-slate-600 mt-1">Rewriting your resume...</p>
            </div>
          )}
        </div>

        {/* Header with tab switch */}
        <AnalysisHeader
          onReset={onReset}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === 'rewrite') {
              if (!isRewriteRequested) return;
              if (!canUseRewrite()) {
                setShowPremiumModal(true);
                return;
              }
            }
            setActiveTab(tab);
          }}
          hasRewrite={isRewriteRequested && !!feedback.rewrittenResume && canUseRewrite()}
        />

        {/* Download Button */}
        <ResumeDownloadButton
          currentResume={feedback.rewrittenResume || feedback.resume || ""}
          roleSummary={feedback.jobTitle || "resume"}
          selectedTheme={selectedTheme}
        />

        {/* Tab Content */}
        {activeTab === 'analysis' ? (
          <ResultList
            feedback={feedback}
            onRequestRewrite={!isRewriteRequested ? handleRewriteRequest : undefined}
          />
        ) : (
          isRewriteRequested && canUseRewrite() && (
            <ResumeRewrite
              rewrittenResume={feedback.rewrittenResume}
              atsScores={feedback.atsScores}
              jobContext={feedback.jobContext}
              originalResume={feedback.resume}
              jobDescription={feedback.jobDescription}
              originalATSScore={calculateATSScore(
                feedback.resume || '',
                feedback.jobDescription || ''
              )}
            />
          )
        )}

        {/* Feedback */}
        <FeedbackForm
          helpfulFeedback={helpfulFeedback}
          onFeedbackSubmit={onFeedbackSubmit}
        />
      </div>

      <PremiumFeatureModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        featureName="Resume Rewrite"
      />
    </Card>
  );
};

export default AnalysisResults;
