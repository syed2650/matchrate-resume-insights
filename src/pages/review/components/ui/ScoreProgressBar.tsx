import { Progress } from "@/components/ui/progress";

interface ScoreProgressBarProps {
  score: number;
  label?: string;
  colorClass?: string;
}

export const ScoreProgressBar = ({ 
  score, 
  label = "Score",
  colorClass = "text-primary"
}: ScoreProgressBarProps) => {
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-base font-semibold text-foreground">{label}</span>
        <span className={`text-3xl font-bold ${colorClass}`}>{score}/100</span>
      </div>
      <div className="h-4 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full ${getProgressColor(score)} transition-all duration-500 rounded-full`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};
