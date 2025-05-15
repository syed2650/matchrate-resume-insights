
import React, { useState } from "react";
import AnalysisResults from "./review/components/AnalysisResults";
import ResumeAnalyzer from "./components/ResumeAnalyzer";

const Review = () => {
  const [feedback, setFeedback] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState("teal");

  return (
    <div>
      <h1>Resume Optimizer</h1>
      <div className="mb-4">
        <label className="mr-2">Choose Theme:</label>
        <select value={selectedTheme} onChange={e => setSelectedTheme(e.target.value)}>
          <option value="teal">Teal</option>
          <option value="modern">Modern</option>
          <option value="minimal">Minimal</option>
        </select>
      </div>

      {!feedback ? (
        <ResumeAnalyzer onAnalysisComplete={setFeedback} />
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
