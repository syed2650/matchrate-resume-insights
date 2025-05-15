import React from "react";

const ResumeContent = ({ currentResume, selectedTheme }) => {
  return (
    <div className={selectedTheme === "teal" ? "bg-slate-50 p-6" : "p-4"}>
      <pre className="whitespace-pre-wrap font-sans text-sm">{currentResume}</pre>
    </div>
  );
};

export default ResumeContent;
