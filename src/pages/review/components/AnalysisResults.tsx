
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileSearch, CheckCheck, FileText } from "lucide-react";
import ScoreCard from './ScoreCard';
import MissingKeywords from './MissingKeywords';
import SectionFeedback from './SectionFeedback';
import SuggestedBullets from './SuggestedBullets';
import { Feedback } from '../types';
import InterviewReadyIndicator from './InterviewReadyIndicator';
import BulletImprovements from './BulletImprovements';
import BulletRewriteSuggestions from './BulletRewriteSuggestions';
import ResumePdfTemplate from './ResumePdfTemplate';
import { useToast } from "@/hooks/use-toast";
import { canUseRewrite, calculateATSScore } from '../utils';
import AnalysisHeader from '../AnalysisHeader';
import ResultList from '../ResultList';
import ResumeRewrite from '../ResumeRewrite';
import FeedbackForm from '../FeedbackForm';
import PremiumFeatureModal from './PremiumFeatureModal';
import { useResumeVersion } from '../hooks/useResumeVersion';

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
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { toast } = useToast();

  const handleExportFeedback = async () => {
    try {
      // Import the DOCX generator and necessary helper functions
      const { generateFeedbackDocx } = await import("../utils/feedbackDocxGenerator");
      
      // Generate the document blob - this now returns a Promise<Blob>
      const blob = await generateFeedbackDocx(feedback);
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "matchrate-feedback-report.docx";
      link.click();
      URL.revokeObjectURL(url);
      
      setExportError(null);
      toast({
        title: "Success",
        description: "Feedback report downloaded as DOCX",
      });
    } catch (error) {
      console.error("Error exporting feedback report:", error);
      setExportError("Failed to generate feedback report: " + (error instanceof Error ? error.message : "Unknown error"));
      toast({
        title: "Error",
        description: "Failed to generate feedback report",
        variant: "destructive"
      });
    }
  };

  const handleRewriteRequest = () => {
    // Check if user is allowed to use the rewrite feature
    const canUse = canUseRewrite();
    
    if (!canUse) {
      // User is on free plan, show premium modal
      setShowPremiumModal(true);
      return;
    }
    
    // User can use the rewrite feature
    setRewriteLoading(true);
    
    // Process the resume using our ResumeRewriter
    try {
      // This is a simulation of using the ResumeRewriter
      // In a real implementation, you would parse the feedback.resume into a structured ResumeData object
      // and then use the ResumeRewriter to enhance it
      
      // Give time for the UI to show loading state
      setTimeout(() => {
        setActiveTab('rewrite');
        setIsRewriteRequested(true);
        setRewriteLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error rewriting resume:", error);
      toast({
        title: "Error",
        description: "Failed to rewrite resume",
        variant: "destructive"
      });
      setRewriteLoading(false);
    }
  };

  // Calculate the current step
  let currentStep = 1;
  if (activeTab === 'rewrite' && isRewriteRequested) {
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
          onExportPDF={handleExportFeedback}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            // Only allow switching to rewrite tab if it has been requested and user can access it
            if (tab === 'rewrite') {
              if (!isRewriteRequested) {
                return;
              }
              
              if (!canUseRewrite()) {
                setShowPremiumModal(true);
                return;
              }
            }
            setActiveTab(tab);
          }}
          hasRewrite={isRewriteRequested && !!feedback.rewrittenResume && canUseRewrite()}
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
          isRewriteRequested && canUseRewrite() && (
            <ResumeRewrite 
              rewrittenResume={feedback.rewrittenResume} 
              atsScores={feedback.atsScores}
              jobContext={feedback.jobContext}
              originalResume={feedback.resume}
              jobDescription={feedback.jobDescription}
              originalATSScore={calculateATSScore(feedback.resume || '', feedback.jobDescription || '')}
            />
          )
        )}

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
