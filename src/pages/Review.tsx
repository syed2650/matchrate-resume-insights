
import React, { useState } from "react";
import ResumeAnalyzer from "./review/ResumeAnalyzer";
import AnalysisResults from "./review/components/AnalysisResults";

const Review = () => {
  const [feedback, setFeedback] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState<"teal" | "modern" | "minimal">("teal");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <h1>Resume Optimizer</h1>
      <div className="mb-4">
        <label className="mr-2">Choose Theme:</label>
        <select 
          value={selectedTheme} 
          onChange={e => setSelectedTheme(e.target.value as "teal" | "modern" | "minimal")}
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
