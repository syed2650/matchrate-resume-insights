import { RefreshCw, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { track } from "@/lib/mixpanel";

interface ChallengeLoopProps {
  score: number;
  onRecheck: () => void;
}

export const ChallengeLoop = ({ score, onRecheck }: ChallengeLoopProps) => {
  const targetScore = score < 60 ? 70 : score < 80 ? 85 : 95;

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-background to-primary/10 p-6 sm:p-8 shadow-lg">
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/10" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-primary/5" />
      
      <div className="relative z-10 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15">
          <Trophy className="h-8 w-8 text-primary" />
        </div>
        
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-foreground">
            Can you beat {targetScore}?
          </h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Only 12% of users reach 85+. Most improve by 10–20 points after one optimization.
          </p>
        </div>

        <Button 
          onClick={() => {
            track("Challenge Loop Clicked", { currentScore: score, targetScore });
            onRecheck();
          }}
          className="gap-2"
          size="lg"
        >
          <RefreshCw className="h-4 w-4" />
          Improve My Resume
        </Button>
      </div>
    </div>
  );
};
