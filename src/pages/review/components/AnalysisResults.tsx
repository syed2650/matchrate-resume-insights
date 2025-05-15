import React from "react";
import ResumeDownloadButton from "./ResumeDownloadButton";
import ResumeContent from "./ResumeContent";

const AnalysisResults = ({ feedback, onReset, helpfulFeedback, onFeedbackSubmit, selectedTheme }) => (
  <div>
    <ResumeContent currentResume={feedback.rewrittenResume} selectedTheme={selectedTheme} />
    <ResumeDownloadButton
      currentResume={feedback.rewrittenResume}
      roleSummary={feedback.jobTitle}
      selectedTheme={selectedTheme}
    />
  </div>
);

export default AnalysisResults;
