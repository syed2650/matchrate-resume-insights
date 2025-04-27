
import { Key } from "lucide-react";
import ResultSection from "../ResultSection";

interface MissingKeywordsProps {
  keywords: string[];
}

const MissingKeywords = ({ keywords }: MissingKeywordsProps) => {
  return (
    <ResultSection
      title="Missing Keywords & Skills"
      icon={<Key className="h-6 w-6 text-blue-600" />}
      content={
        keywords && keywords.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {keywords.map((keyword: string, i: number) => (
              <div key={i} className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-lg">
                <span className="text-2xl text-red-600">❌</span>
                <span className="text-slate-700 font-semibold">{keyword}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-600">No critical keywords missing. Great job!</p>
        )
      }
    />
  );
};

export default MissingKeywords;
