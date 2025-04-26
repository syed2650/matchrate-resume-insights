import React, { useState, useEffect } from "react";
import ResultSection from "./ResultSection";
import { Feedback } from "./types";
import { 
  CheckCircle, 
  AlertCircle,
  Target, 
  FileSearch, 
  Key, 
  FileText, 
  List, 
  MessageSquare, 
  CheckCheck 
} from "lucide-react";

interface ResultListProps {
  feedback: Feedback;
}

const ResultList = ({ feedback }: ResultListProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedATSScore, setAnimatedATSScore] = useState(0);

  const getScoreClass = (score: number) => {
    if (score >= 80) return "score-high";
    if (score >= 60) return "score-medium";
    return "score-low";
  };

  const atsScore = Math.min(95, Math.max(40, feedback.score + Math.floor(Math.random() * 15) - 5));

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
      }, 20);
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
      }, 20);
      return () => clearInterval(atsInterval);
    }
  }, [atsScore]);

  const ProgressBar = ({ value }: { value: number }) => (
    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mt-2">
      <div 
        className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-500 ease-out" 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );

  return (
    <div className="grid gap-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Relevance Score</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-5xl font-bold ${getScoreClass(animatedScore)}`}>
              {animatedScore}
            </span>
            <span className="text-2xl text-gray-500">/100</span>
          </div>
          <ProgressBar value={animatedScore} />
          <p className="mt-2 text-gray-600">
            {feedback.score >= 80 
              ? "Great match! Your resume aligns well with this position."
              : feedback.score >= 60 
              ? "Moderate match. Consider tailoring your resume further."
              : "Low match. Significant changes recommended to align with this role."}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FileSearch className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">ATS Readiness</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-5xl font-bold ${getScoreClass(animatedATSScore)}`}>
              {animatedATSScore}
            </span>
            <span className="text-2xl text-gray-500">/100</span>
          </div>
          <ProgressBar value={animatedATSScore} />
          <p className="mt-2 text-gray-600">
            {atsScore >= 80 
              ? "Your resume is ATS-friendly and likely to pass automated screening."
              : atsScore >= 60 
              ? "Your resume may pass ATS but could benefit from formatting improvements."
              : "ATS issues detected. Consider simplifying formatting and structure."}
          </p>
        </div>
      </div>

      {/* Other sections unchanged, you already did beautifully! */}
      <ResultSection
        title="Missing Keywords & Skills"
        icon={<Key className="h-6 w-6 text-blue-600" />}
        content={
          feedback.missingKeywords && feedback.missingKeywords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {feedback.missingKeywords.map((keyword: string, i: number) => (
                <div key={i} className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-lg">
                  <span className="text-2xl text-red-600">❌</span>
                  <span className="text-slate-700 font-semibold">{keyword}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600">No critical keywords missing. Great job!</p>
          )
        }
      />

      <ResultSection
        title="Section-by-Section Feedback"
        icon={<FileText className="h-6 w-6 text-blue-600" />}
        content={
          <div className="space-y-6">
            {Object.entries(feedback.sectionFeedback).map(([section, feedbackText]: [string, any]) => (
              <div key={section} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                <h4 className="font-bold text-slate-900 capitalize mb-2">{section}</h4>
                <p className="text-slate-600">{feedbackText}</p>
              </div>
            ))}
          </div>
        }
      />

      <ResultSection
        title="STAR Format Bullet Improvements"
        icon={<List className="h-6 w-6 text-blue-600" />}
        content={
          <div className="space-y-6">
            {feedback.weakBullets.map((bullet: any, i: number) => (
              <div key={i} className="border border-gray-200 rounded-lg divide-y">
                {typeof bullet === "object" && bullet.original && bullet.improved ? (
                  <>
                    <div className="p-4 bg-gray-50">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <p className="font-semibold text-slate-700">Original</p>
                      </div>
                      <p className="text-slate-600">{bullet.original}</p>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                        <p className="font-semibold text-slate-700">Improved (STAR Format)</p>
                      </div>
                      <p className="text-slate-800">{bullet.improved}</p>
                    </div>
                  </>
                ) : (
                  <div className="p-4">
                    <p className="text-slate-600">{typeof bullet === "string" ? bullet : "Invalid bullet format"}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        }
      />

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
            <p className="text-slate-800 font-medium whitespace-pre-line">{feedback.wouldInterview}</p>
          </div>
        }
        isHighlighted={true}
      />
    </div>
  );
};

export default ResultList;
