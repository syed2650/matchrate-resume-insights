
import React from "react";
import ResultSection from "./ResultSection";
import { Feedback } from "./types";

interface ResultListProps {
  feedback: Feedback;
}

const ResultList = ({ feedback }: ResultListProps) => {
  return (
    <div className="grid gap-6">
      <ResultSection title="Relevance Score" content={`${feedback.score}/100`} />

      <ResultSection
        title="Missing Keywords"
        content={
          <ul className="list-disc pl-5">
            {feedback.missingKeywords.map((keyword: string, i: number) => (
              <li key={i} className="text-slate-600">{keyword}</li>
            ))}
          </ul>
        }
      />

      <ResultSection
        title="Section-by-Section Feedback"
        content={
          <div className="space-y-3">
            {Object.entries(feedback.sectionFeedback).map(([section, feedbackText]: [string, any]) => (
              <div key={section}>
                <h4 className="font-medium text-slate-900 capitalize">{section}</h4>
                <p className="text-slate-600">{feedbackText}</p>
              </div>
            ))}
          </div>
        }
      />

      <ResultSection
        title="Weak Bullet Improvements"
        content={
          <ul className="space-y-3">
            {feedback.weakBullets.map((bullet: any, i: number) => (
              <li key={i} className="text-slate-600">
                {typeof bullet === "object" && bullet.original && bullet.improved ? (
                  <div>
                    <p className="font-medium">Original:</p>
                    <p className="ml-4 mb-2">{bullet.original}</p>
                    <p className="font-medium">Improved:</p>
                    <p className="ml-4">{bullet.improved}</p>
                  </div>
                ) : (
                  typeof bullet === "string" ? bullet : null
                )}
              </li>
            ))}
          </ul>
        }
      />

      <ResultSection
        title="Tone & Clarity Suggestions"
        content={feedback.toneSuggestions}
      />

      <ResultSection
        title="Would I Interview?"
        content={feedback.wouldInterview}
      />
    </div>
  );
};

export default ResultList;
