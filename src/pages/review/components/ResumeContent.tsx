// src/components/ResumeContent.tsx

import React from "react";
import { Card } from "@/components/ui/card";

interface ResumeContentProps {
  currentResume: string;
}

const ResumeContent: React.FC<ResumeContentProps> = ({ currentResume }) => {
  if (!currentResume) return null;

  const parseSections = (text: string): Record<string, string[]> => {
    const lines = text.split("\n").map(l => l.trim());
    const sections: Record<string, string[]> = {};
    let current = "Header";
    lines.forEach(line => {
      if (/^(SUMMARY|EXPERIENCE|EDUCATION|SKILLS|PROJECTS|RECOGNITION|CERTIFICATIONS)$/i.test(line)) {
        current = line.toUpperCase();
        sections[current] = [];
      } else {
        if (!sections[current]) sections[current] = [];
        if (line) sections[current].push(line);
      }
    });
    return sections;
  };

  const renderSection = (title: string, content: string[]) => (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-300 mb-2">{title}</h2>
      <div className="space-y-1 text-sm text-slate-700">
        {content.map((line, i) =>
          line.startsWith("•") || line.startsWith("-") ? (
            <li key={i} className="ml-4 list-disc list-outside">{line.replace(/^[-•]\s*/, "")}</li>
          ) : (
            <p key={i}>{line}</p>
          )
        )}
      </div>
    </div>
  );

  const parsed = parseSections(currentResume);
  const order = ["Header", "SUMMARY", "EXPERIENCE", "EDUCATION", "SKILLS", "RECOGNITION", "CERTIFICATIONS"];

  return (
    <Card className="p-6 max-w-4xl mx-auto overflow-auto">
      {order.map(section => parsed[section] && renderSection(section, parsed[section]))}
    </Card>
  );
};

export default ResumeContent;
