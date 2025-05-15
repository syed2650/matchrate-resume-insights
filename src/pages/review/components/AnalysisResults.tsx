
import React, { useState } from "react";
import ResumeRewrite from "../ResumeRewrite";
import { Feedback } from "../types";
import AnalysisHeader from "../AnalysisHeader";
import SectionFeedback from "./SectionFeedback";
import ScoreCard from "./ScoreCard";
import MissingKeywords from "./MissingKeywords";
import BulletImprovements from "./BulletImprovements";
import { ExportInfo } from "./ExportInfo"; // Use named import
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, ChartBar } from "lucide-react"; // Import ChartBar for icon
import { jsPDF } from "jspdf";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import InterviewReadyIndicator from "./InterviewReadyIndicator";
import { Database } from "@/integrations/supabase/types";

// Import the PDF generator function
import { generatePDF } from "../PDFGenerator";

interface AnalysisResultsProps {
  feedback: Feedback;
  onReset: () => void;
  helpfulFeedback: boolean | null;
  onFeedbackSubmit: (isHelpful: boolean) => void;
  roleTemplates?: any[];
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  feedback, 
  onReset, 
  helpfulFeedback, 
  onFeedbackSubmit,
  roleTemplates = []
}) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'rewrite'>('analysis');

  const handleExportPDF = async () => {
    const doc = new jsPDF();
    await generatePDF(doc, feedback);
    doc.save("resume-analysis-report.pdf");
  };

  // Find the role template matching the selected role (if any)
  const findRoleTemplate = () => {
    if (!feedback.jobTitle || !roleTemplates || roleTemplates.length === 0) return null;
    
    return roleTemplates.find(
      template => template.role_name.toLowerCase() === feedback.jobTitle?.toLowerCase()
    );
  };
  
  const roleTemplate = findRoleTemplate();
  
  // Determine if the resume is interview-ready based on score
  const isInterviewReady = feedback.score >= 70;

  return (
    <div className="space-y-6">
      <AnalysisHeader 
        onReset={onReset} 
        onExportPDF={handleExportPDF}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasRewrite={!!feedback.rewrittenResume}
        selectedRole={feedback.jobTitle}
      />
      
      {activeTab === 'analysis' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScoreCard 
              score={feedback.score}
              title="ATS Matching Score" 
              icon={ChartBar} // Pass the actual Lucide component, not a string
              explanation="How well your resume matches the job description"
            />
            {feedback.missingKeywords && feedback.missingKeywords.length > 0 && (
              <MissingKeywords keywords={feedback.missingKeywords} />
            )}
            <InterviewReadyIndicator 
              isReady={isInterviewReady}
              score={feedback.score} 
            />
          </div>
          
          {feedback.sectionFeedback && Object.keys(feedback.sectionFeedback).length > 0 && (
            <SectionFeedback 
              feedback={feedback.sectionFeedback} 
            />
          )}
          
          {feedback.weakBullets && feedback.weakBullets.length > 0 && (
            <BulletImprovements 
              bullets={feedback.weakBullets} 
            />
          )}
          
          {feedback.toneSuggestions && (
            <div className="bg-white rounded-lg border p-4">
              <h2 className="text-lg font-semibold mb-2">Tone & Style Suggestions</h2>
              <p className="text-slate-700 whitespace-pre-line">{feedback.toneSuggestions}</p>
            </div>
          )}
          
          <ExportInfo />
          
          {helpfulFeedback === null && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-center font-medium mb-3">Was this feedback helpful?</h3>
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 border-green-200 text-green-600 hover:bg-green-50"
                  onClick={() => onFeedbackSubmit(true)}
                >
                  <ThumbsUp size={16} />
                  <span>Yes, helpful</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => onFeedbackSubmit(false)}
                >
                  <ThumbsDown size={16} />
                  <span>No, not useful</span>
                </Button>
              </div>
            </div>
          )}
          
          {helpfulFeedback !== null && (
            <Alert className="mt-6 bg-blue-50 border-blue-200">
              <AlertTitle>Thank you for your feedback!</AlertTitle>
              <AlertDescription>
                We appreciate your input and will use it to improve our analysis system.
              </AlertDescription>
            </Alert>
          )}
        </>
      ) : (
        <ResumeRewrite 
          rewrittenResume={feedback.rewrittenResume || ""} 
          jobRole={feedback.jobTitle || ""} 
          roleTemplate={roleTemplate}
        />
      )}
    </div>
  );
};

export default AnalysisResults;
