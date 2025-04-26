
import { Card } from "@/components/ui/card";
import { Feedback } from "../types";
import AnalysisHeader from "../AnalysisHeader";
import ResultList from "../ResultList";
import FeedbackForm from "../FeedbackForm";
import ResumeRewrite from "../ResumeRewrite";
import { useState } from "react";

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

  return (
    <Card className="p-6 shadow-md rounded-xl">
      <div className="space-y-8">
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
          <ResultList feedback={feedback} />
        ) : (
          <ResumeRewrite 
            rewrittenResume={feedback.rewrittenResume} 
            atsScores={feedback.atsScores}
            jobContext={feedback.jobContext}
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
