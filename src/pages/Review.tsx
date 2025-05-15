
import React, { useState } from "react";
import ResumeAnalyzer from "./review/ResumeAnalyzer";
import AnalysisResults from "./review/components/AnalysisResults";

const Review = () => {
  const [feedback, setFeedback] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState<"teal" | "modern" | "minimal">("teal");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Resume Optimizer</h1>
      <div className="mb-4">
        <label className="mr-2 font-medium">Choose Theme:</label>
        <select 
          value={selectedTheme} 
          onChange={e => setSelectedTheme(e.target.value as "teal" | "modern" | "minimal")}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="teal">Teal</option>
          <option value="modern">Modern</option>
          <option value="minimal">Minimal</option>
        </select>
      </div>

      {!feedback ? (
        <ResumeAnalyzer 
          onAnalysisComplete={setFeedback} 
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      ) : (
        <AnalysisResults
          feedback={feedback}
          onReset={() => setFeedback(null)}
          helpfulFeedback={null}
          onFeedbackSubmit={() => {}}
          selectedTheme={selectedTheme}
        />
      )}
    </div>
  );
};

export default Review;
