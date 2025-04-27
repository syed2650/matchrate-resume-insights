
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreCardProps {
  title: string;
  score: number;
  icon: LucideIcon;
  explanation: string;
  isLow?: boolean;
}

const ScoreCard = ({ title, score, icon: Icon, explanation, isLow = false }: ScoreCardProps) => {
  const getScoreClass = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className={cn(
      "bg-white rounded-xl border p-6 shadow-sm transition-all duration-300",
      isLow ? "border-red-200" : "border-gray-100"
    )}>
      <div className="flex items-center gap-3 mb-4">
        <Icon className={cn("h-6 w-6", isLow ? "text-red-500" : "text-blue-600")} />
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        {isLow && (
          <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
            Needs Improvement
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-5xl font-bold ${getScoreClass(score)}`}>
          {score}
        </span>
        <span className="text-2xl text-gray-500">/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mt-3">
        <div
          className={cn(
            "h-full transition-all duration-700 ease-out rounded-full",
            score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-400" : "bg-red-500"
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-3 text-gray-600">{explanation}</p>
    </div>
  );
};

export default ScoreCard;
