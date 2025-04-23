
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
    <div className={`rounded-xl ${isHighlighted ? 'border-2 border-blue-200 bg-blue-50' : 'border border-gray-100 shadow-sm'}`}>
      <div className={`p-6 ${isHighlighted ? 'bg-blue-50' : 'bg-white'}`}>
        <div className="flex items-center gap-3 mb-4">
          {icon && (
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
              {icon}
            </div>
          )}
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        </div>
        <div className="ml-0 text-slate-700">{content}</div>
      </div>
    </div>
  );
};

export default ResultSection;
