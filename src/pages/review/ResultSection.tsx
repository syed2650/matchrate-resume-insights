
import React, { ReactNode } from "react";

interface ResultSectionProps {
  title: string;
  content: ReactNode;
  icon?: ReactNode;
  isHighlighted?: boolean;
}

const ResultSection: React.FC<ResultSectionProps> = ({ 
  title, 
  content, 
  icon,
  isHighlighted = false 
}) => {
  return (
    <div className={`rounded-xl ${isHighlighted ? 'border-2 border-blue-200 bg-blue-50' : ''}`}>
      <div className={`p-5 ${isHighlighted ? 'bg-blue-50' : ''}`}>
        <div className="flex items-center gap-3 mb-4">
          {icon}
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <div className="ml-0">{content}</div>
      </div>
    </div>
  );
};

export default ResultSection;
