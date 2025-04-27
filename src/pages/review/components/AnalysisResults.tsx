
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

interface AnalysisResultsProps {
  feedback: Feedback;
  onReset: () => void;
  helpfulFeedback: boolean | null;
  onFeedbackSubmit: (isHelpful: boolean) => void;
}

const AnalysisResults = ({ 
  feedback, 
  onReset, 
  helpfulFeedback, 
  onFeedbackSubmit 
}: AnalysisResultsProps) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'rewrite'>('analysis');
  const [exportError, setExportError] = useState<string | null>(null);
  const [isRewriteRequested, setIsRewriteRequested] = useState(false);
  const [rewriteLoading, setRewriteLoading] = useState(false);

  const handleExportPDF = async () => {
    try {
      const { generatePDF } = await import("../PDFGenerator");
      const doc = generatePDF(feedback);
      doc.save("matchrate-feedback-report.pdf");
      setExportError(null);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      setExportError("Failed to generate PDF: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  const handleRewriteRequest = () => {
    setRewriteLoading(true);
    // This simulates the transition to rewrite tab
    // In a real implementation, you might want to trigger the rewrite here
    setTimeout(() => {
      setActiveTab('rewrite');
      setIsRewriteRequested(true);
      setRewriteLoading(false);
    }, 500);
  };

  // Calculate the current step
  let currentStep = 1;
  if (activeTab === 'rewrite') {
    currentStep = 3;
  } else if (isRewriteRequested || feedback.rewrittenResume) {
    currentStep = 2;
  }

  return (
    <Card className="p-6 shadow-md rounded-xl">
      <div className="space-y-8">
        {/* Progress steps */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}>
                <FileSearch className="h-4 w-4" />
              </div>
              <span className="text-xs mt-1">Analysis</span>
            </div>
            <div className="relative flex-1 mt-4">
              <div className="absolute top-1/2 w-full h-1 bg-gray-200 transform -translate-y-1/2"></div>
              <div 
                className="absolute top-1/2 h-1 bg-blue-600 transform -translate-y-1/2 transition-all duration-500" 
                style={{ width: currentStep >= 2 ? '100%' : '0%' }}
              ></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}>
                <CheckCheck className="h-4 w-4" />
              </div>
              <span className="text-xs mt-1">Review</span>
            </div>
            <div className="relative flex-1 mt-4">
              <div className="absolute top-1/2 w-full h-1 bg-gray-200 transform -translate-y-1/2"></div>
              <div 
                className="absolute top-1/2 h-1 bg-blue-600 transform -translate-y-1/2 transition-all duration-500" 
                style={{ width: currentStep >= 3 ? '100%' : '0%' }}
              ></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}>
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-xs mt-1">Optimize</span>
            </div>
          </div>
          {rewriteLoading && (
            <div className="mt-2">
              <Progress value={50} className="h-2" />
              <p className="text-sm text-center text-slate-600 mt-1">Rewriting your resume...</p>
            </div>
          )}
        </div>

        <AnalysisHeader 
          onReset={onReset} 
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
          <ResultList 
            feedback={feedback} 
            onRequestRewrite={!isRewriteRequested ? handleRewriteRequest : undefined} 
          />
        ) : (
          <ResumeRewrite 
            rewrittenResume={feedback.rewrittenResume} 
            atsScores={feedback.atsScores}
            jobContext={feedback.jobContext}
            originalResume={feedback.resume}
            jobDescription={feedback.jobDescription}
            originalATSScore={calculateATSScore(feedback.resume || '', feedback.jobDescription || '')}
          />
        )}

        <FeedbackForm 
          helpfulFeedback={helpfulFeedback} 
          onFeedbackSubmit={onFeedbackSubmit}
        />
      </div>
    </Card>
  );
};

export default AnalysisResults;
