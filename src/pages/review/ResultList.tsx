
import React, { useState, useEffect } from "react";
import { FileSearch, MessageSquare, CheckCheck, Target } from "lucide-react";
import { Feedback } from "./types";
import { calculateATSScore, getATSScoreExplanation } from "./utils/atsScoring";
import ResultSection from "./ResultSection";
import ScoreCard from "./components/ScoreCard";
import MissingKeywords from "./components/MissingKeywords";
import SectionFeedback from "./components/SectionFeedback";
import BulletImprovements from "./components/BulletImprovements";

interface ResultListProps {
  feedback: Feedback;
}

const ResultList = ({ feedback }: ResultListProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedATSScore, setAnimatedATSScore] = useState(0);

  const resumeText = feedback?.resume || "";
  const jobDescriptionText = feedback?.jobDescription || "";
  const atsScore = calculateATSScore(resumeText, jobDescriptionText);
  
  // Ensure score has a default value if feedback.score is undefined
  const score = feedback?.score !== undefined ? feedback.score : 0;

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
        />

        <ScoreCard
          title="ATS Readiness"
          score={animatedATSScore}
          icon={FileSearch}
          explanation={getATSScoreExplanation(atsScore)}
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
    </div>
  );
};

export default ResultList;
