
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

  const resumeText = feedback.resume || "";
  const jobDescriptionText = feedback.jobDescription || "";
  const atsScore = calculateATSScore(resumeText, jobDescriptionText);

  useEffect(() => {
    if (feedback?.score) {
      let current = 0;
      const interval = setInterval(() => {
        if (current < feedback.score) {
          current += 1;
          setAnimatedScore(current);
        } else {
          clearInterval(interval);
        }
      }, 15);
      return () => clearInterval(interval);
    }
  }, [feedback?.score]);

  useEffect(() => {
    if (atsScore) {
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

  return (
    <div className="grid gap-8">
      <div className="grid md:grid-cols-2 gap-6">
        <ScoreCard
          title="Relevance Score"
          score={animatedScore}
          icon={Target}
          explanation={
            feedback.score >= 80
              ? "Great match! Your resume aligns well with this position."
              : feedback.score >= 60
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

      <MissingKeywords keywords={feedback.missingKeywords} />
      <SectionFeedback feedback={feedback.sectionFeedback} />
      <BulletImprovements bullets={feedback.weakBullets} />

      <ResultSection
        title="Tone & Clarity Suggestions"
        icon={<MessageSquare className="h-6 w-6 text-blue-600" />}
        content={
          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
            <p className="text-slate-600 whitespace-pre-line">{feedback.toneSuggestions}</p>
          </div>
        }
      />

      <ResultSection
        title="Final Verdict: Would I Interview?"
        icon={<CheckCheck className="h-6 w-6 text-blue-600" />}
        content={
          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
            <p className="text-slate-800 font-medium whitespace-pre-line">
              {feedback.wouldInterview}
            </p>
          </div>
        }
        isHighlighted={true}
      />
    </div>
  );
};

export default ResultList;
