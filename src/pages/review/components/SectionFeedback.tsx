
import { FileText } from "lucide-react";
import ResultSection from "../ResultSection";

interface SectionFeedbackProps {
  feedback: Record<string, string>;
}

const SectionFeedback = ({ feedback }: SectionFeedbackProps) => {
  return (
    <ResultSection
      title="Section-by-Section Feedback"
      icon={<FileText className="h-6 w-6 text-blue-600" />}
      content={
        <div className="space-y-6">
          {Object.entries(feedback).map(([section, feedbackText]: [string, string]) => (
            <div key={section} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-slate-900 capitalize mb-2">{section}</h4>
              <p className="text-slate-600">{feedbackText}</p>
            </div>
          ))}
        </div>
      }
    />
  );
};

export default SectionFeedback;
