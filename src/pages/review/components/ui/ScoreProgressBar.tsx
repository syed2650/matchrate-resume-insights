import { useEffect, useState } from "react";

interface ScoreProgressBarProps {
  score: number;
  label?: string;
  colorClass?: string;
  size?: "sm" | "md" | "lg";
}

export const ScoreProgressBar = ({ 
  score, 
  label = "Score",
  colorClass,
  size = "md"
}: ScoreProgressBarProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreConfig = (s: number) => {
    if (s >= 80) return { 
      gradient: "from-emerald-500 to-green-400", 
      bg: "bg-emerald-100", 
      text: "text-emerald-600",
      glow: "shadow-emerald-200",
      status: "Excellent"
    };
    if (s >= 60) return { 
      gradient: "from-amber-500 to-yellow-400", 
      bg: "bg-amber-100", 
      text: "text-amber-600",
      glow: "shadow-amber-200",
      status: "Good"
    };
    if (s >= 40) return { 
      gradient: "from-orange-500 to-amber-400", 
      bg: "bg-orange-100", 
      text: "text-orange-600",
      glow: "shadow-orange-200",
      status: "Needs Work"
    };
    return { 
      gradient: "from-red-500 to-rose-400", 
      bg: "bg-red-100", 
      text: "text-red-600",
      glow: "shadow-red-200",
      status: "Critical"
    };
  };

  const config = getScoreConfig(score);
  const textColor = colorClass || config.text;

  const sizeClasses = {
    sm: { bar: "h-2", text: "text-2xl", label: "text-sm" },
    md: { bar: "h-3", text: "text-4xl", label: "text-base" },
    lg: { bar: "h-4", text: "text-5xl", label: "text-lg" }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`font-semibold ${sizeClasses[size].label} text-foreground`}>
            {label}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.text}`}>
            {config.status}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`font-bold ${sizeClasses[size].text} ${textColor} transition-all duration-500`}>
            {animatedScore}
          </span>
          <span className="text-muted-foreground text-lg font-medium">/100</span>
        </div>
      </div>
      
      <div className={`${sizeClasses[size].bar} bg-muted rounded-full overflow-hidden relative`}>
        <div 
          className={`h-full bg-gradient-to-r ${config.gradient} transition-all duration-700 ease-out rounded-full shadow-sm ${config.glow}`}
          style={{ width: `${animatedScore}%` }}
        />
        {/* Shimmer effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 animate-pulse"
          style={{ animationDuration: '2s' }}
        />
      </div>
    </div>
  );
};
