
import React from "react";
import { Card } from "@/components/ui/card";
import { ResumeData } from "../utils/parseResumeIntoData";

interface ResumePreviewProps {
  data: ResumeData;
  isPremiumBlurred?: boolean;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ 
  data, 
  isPremiumBlurred = false 
}) => {
  if (!data) return null;
  
  return (
    <div className={`p-6 max-h-[600px] overflow-auto font-sans text-sm ${isPremiumBlurred ? 'blur-sm opacity-60' : ''}`}>
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold">{data.name}</h1>
        <p className="text-slate-600">{data.contact}</p>
      </div>
      
      {/* Summary */}
      {data.summary && data.summary.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-slate-200 pb-1 mb-2">Summary</h2>
          {data.summary.map((paragraph, i) => (
            <p key={i} className="mb-2">{paragraph}</p>
          ))}
        </div>
      )}
      
      {/* Experience */}
      {data.experiences && data.experiences.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-slate-200 pb-1 mb-2">Experience</h2>
          {data.experiences.map((exp, i) => (
            <div key={i} className="mb-4">
              <p className="font-bold text-base">{exp.title}</p>
              <p className="font-bold">{exp.company}</p>
              <p className="text-sm text-slate-600 mb-1">{exp.dates}</p>
              {exp.location && <p className="text-sm text-slate-600 mb-1">{exp.location}</p>}
              <ul className="list-disc pl-5 mt-1">
                {exp.bullets && exp.bullets.map((bullet, j) => (
                  <li key={j} className="mb-1">{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      
      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-slate-200 pb-1 mb-2">Education</h2>
          <ul className="list-none">
            {data.education.map((edu, i) => (
              <li key={i} className="mb-2">{edu}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-slate-200 pb-1 mb-2">Skills</h2>
          <ul className="list-disc pl-5 grid grid-cols-1 md:grid-cols-2 gap-x-4">
            {data.skills.map((skill, i) => (
              <li key={i} className="mb-1">{skill}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Recognition/Awards */}
      {data.recognition && data.recognition.length > 0 && (
        <div>
          <h2 className="text-lg font-bold uppercase border-b border-slate-200 pb-1 mb-2">Recognition</h2>
          <ul className="list-disc pl-5">
            {data.recognition.map((item, i) => (
              <li key={i} className="mb-1">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
