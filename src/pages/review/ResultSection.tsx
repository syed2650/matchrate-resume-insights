
import React from "react";

type ResultSectionProps = {
  title: string;
  content: React.ReactNode;
};

const ResultSection = ({ title, content }: ResultSectionProps) => (
  <div>
    <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
    <div className="text-slate-600">{content}</div>
  </div>
);

export default ResultSection;
