
import React, { useState, useEffect } from "react";
import { FileSearch, MessageSquare, CheckCheck, Target, FileText, ArrowUp, AlertTriangle } from "lucide-react";
import { Feedback } from "./types";
import { calculateATSScore, getATSScoreExplanation } from "./utils/atsScoring";
import ResultSection from "./ResultSection";
import ScoreCard from "./components/ScoreCard";
import MissingKeywords from "./components/MissingKeywords";
import SectionFeedback from "./components/SectionFeedback";
import BulletImprovements from "./components/BulletImprovements";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ResultListProps {
  feedback: Feedback;
  onRequestRewrite?: () => void;
}

const ResultList = ({ feedback, onRequestRewrite }: ResultListProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedATSScore, setAnimatedATSScore] = useState(0);
  const [isIncompleteData, setIsIncompleteData] = useState(false);

  const resumeText = feedback?.resume || "";
  const jobDescriptionText = feedback?.jobDescription || "";
  const atsScore = calculateATSScore(resumeText, jobDescriptionText);
  
  // Ensure score has a default value if feedback.score is undefined
  const score = feedback?.score !== undefined ? feedback.score : 0;

  // Check for data completeness
  useEffect(() => {
    // Check if we have all the expected data
    const incompleteData = !feedback || 
      feedback.score === undefined || 
      !Array.isArray(feedback.missingKeywords) || 
      !feedback.sectionFeedback || 
      !Array.isArray(feedback.weakBullets) || 
      !feedback.toneSuggestions ||
      !feedback.wouldInterview;
    
    setIsIncompleteData(incompleteData);
  }, [feedback]);

  const atsScoreLow = atsScore < 75;
  const relevanceScoreLow = score < 80;
  const hasMissingKeywords = Array.isArray(feedback.missingKeywords) && feedback.missingKeywords.length > 0;
  const needsImprovement = atsScoreLow || relevanceScoreLow || hasMissingKeywords;

  useEffect(() => {
    if (score) {
      let current = 0;
      const interval = setInterval(() => {
        if (current < score) {
          current += 1;
          setAnimatedScore(current);
        } else {
          clearInterval(interval);
        }
      }, 15);
      return () => clearInterval(interval);
    }
  }, [score]);

  useEffect(() => {
    if (atsScore > 0) {
      let currentATS = 0;
      const atsInterval = setInterval(() => {
        if (currentATS < atsScore) {
          currentATS += 1;
          setAnimatedATSScore(currentATS);
        } else {
          clearInterval(atsInterval);
        }
      }, 15);
      return () => clearInterval(atsInterval);
    }
  }, [atsScore]);

  // Check if there was an API error
  const hasError = feedback.error !== undefined;
  const errorMessage = feedback.error || "An unknown error occurred during analysis.";

  if (hasError) {
    return (
      <div className="grid gap-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-md">
          <h3 className="text-xl font-bold text-red-700 mb-2">Analysis Error</h3>
          <p className="text-red-600">{errorMessage}</p>
          <p className="mt-4 text-slate-700">
            Please try again later or contact support if this issue persists.
          </p>
        </div>
      </div>
    );
  }
  
  if (isIncompleteData) {
    return (
      <div className="grid gap-8">
        <Alert variant="warning" className="bg-amber-50 border-amber-300">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800">Incomplete Analysis Results</AlertTitle>
          <AlertDescription className="text-amber-700">
            We received incomplete data from our analysis engine. Some parts of your report may be missing or inaccurate.
            You might want to try submitting your resume again.
          </AlertDescription>
        </Alert>
        
        {/* Still show whatever data we have */}
        <div className="grid md:grid-cols-2 gap-6">
          <ScoreCard
            title="Relevance Score"
            score={animatedScore}
            icon={Target}
            explanation={
              score >= 80
                ? "Great match! Your resume aligns well with this position."
                : score >= 60
                ? "Moderate match. Consider tailoring your resume further."
                : "Low match. Significant changes recommended to align with this role."
            }
            isLow={relevanceScoreLow}
          />

          <ScoreCard
            title="ATS Readiness"
            score={animatedATSScore}
            icon={FileSearch}
            explanation={getATSScoreExplanation(atsScore)}
            isLow={atsScoreLow}
          />
        </div>
        
        {Array.isArray(feedback.missingKeywords) && feedback.missingKeywords.length > 0 && (
          <MissingKeywords keywords={feedback.missingKeywords} />
        )}
        
        {feedback.sectionFeedback && Object.keys(feedback.sectionFeedback || {}).length > 0 && (
          <SectionFeedback feedback={feedback.sectionFeedback} />
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <div className="grid md:grid-cols-2 gap-6">
        <ScoreCard
          title="Relevance Score"
          score={animatedScore}
          icon={Target}
          explanation={
            score >= 80
              ? "Great match! Your resume aligns well with this position."
              : score >= 60
              ? "Moderate match. Consider tailoring your resume further."
              : "Low match. Significant changes recommended to align with this role."
          }
          isLow={relevanceScoreLow}
        />

        <ScoreCard
          title="ATS Readiness"
          score={animatedATSScore}
          icon={FileSearch}
          explanation={getATSScoreExplanation(atsScore)}
          isLow={atsScoreLow}
        />
      </div>

      <MissingKeywords 
        keywords={Array.isArray(feedback.missingKeywords) ? feedback.missingKeywords : []} 
      />
      
      {feedback.sectionFeedback && Object.keys(feedback.sectionFeedback || {}).length > 0 ? (
        <SectionFeedback feedback={feedback.sectionFeedback} />
      ) : (
        <ResultSection
          title="Section-by-Section Feedback"
          icon={<FileSearch className="h-6 w-6 text-blue-600" />}
          content={
            <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
              <p className="text-slate-600">No section feedback available.</p>
            </div>
          }
        />
      )}
      
      <BulletImprovements 
        bullets={Array.isArray(feedback.weakBullets) ? feedback.weakBullets : []} 
      />

      <ResultSection
        title="Tone & Clarity Suggestions"
        icon={<MessageSquare className="h-6 w-6 text-blue-600" />}
        content={
          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
            <p className="text-slate-600 whitespace-pre-line">
              {feedback.toneSuggestions || "No tone suggestions available."}
            </p>
          </div>
        }
      />

      <ResultSection
        title="Final Verdict: Would I Interview?"
        icon={<CheckCheck className="h-6 w-6 text-blue-600" />}
        content={
          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
            <p className="text-slate-800 font-medium whitespace-pre-line">
              {feedback.wouldInterview || "No interview recommendation available."}
            </p>
          </div>
        }
        isHighlighted={true}
      />

      {needsImprovement && onRequestRewrite && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
            <div>
              <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                <ArrowUp className="h-5 w-5" />
                Optimize Your Resume
              </h3>
              <p className="text-blue-700 mt-2">
                Your resume could use improvements to increase your chances of getting an interview. 
                Our AI can rewrite your resume to address the issues above, incorporate missing keywords, 
                and improve your ATS compatibility score.
              </p>
              
              {atsScoreLow && (
                <div className="mt-2 text-sm text-blue-600">
                  • Increase your ATS compatibility score (currently {atsScore}/100)
                </div>
              )}
              
              {relevanceScoreLow && (
                <div className="text-sm text-blue-600">
                  • Improve your relevance score (currently {score}/100)
                </div>
              )}
              
              {hasMissingKeywords && (
                <div className="text-sm text-blue-600">
                  • Incorporate {feedback.missingKeywords.length} missing keywords
                </div>
              )}
            </div>
            
            <Button 
              onClick={onRequestRewrite} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium flex items-center gap-2"
              size="lg"
            >
              <FileText className="h-5 w-5" />
              Rewrite My Resume
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultList;
