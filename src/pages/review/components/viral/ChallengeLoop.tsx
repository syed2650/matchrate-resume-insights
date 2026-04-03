import { RefreshCw, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { track } from "@/lib/mixpanel";

interface ChallengeLoopProps {
  score: number;
  onRecheck: () => void;
}

export const ChallengeLoop = ({ score, onRecheck }: ChallengeLoopProps) => {
  const targetScore = score < 60 ? 70 : score < 80 ? 85 : 95;
  const gap = targetScore - score;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-background to-primary/5 p-6">
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary/5" />
      
      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 shrink-0">
          <Target className="h-7 w-7 text-primary" />
        </div>
        
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-foreground">
            Can you beat {targetScore}?
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            You're {gap} points away. Most users improve by 10–20 points after one optimization.
          </p>
        </div>

        <Button 
          onClick={() => {
            track("Challenge Loop Clicked", { currentScore: score, targetScore });
            onRecheck();
          }}
          className="gap-2 shrink-0"
          size="lg"
        >
          <RefreshCw className="h-4 w-4" />
          Recheck My Resume
        </Button>
      </div>
    </div>
  );
};
