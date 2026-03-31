import { Target, CheckCircle, XCircle, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { track } from "@/lib/mixpanel";

interface JobMatchCardProps {
  matchScore: number;
  missingSkills?: string[];
  matchedSkills?: string[];
  onFixResume?: () => void;
}

export const JobMatchCard = ({
  matchScore,
  missingSkills = [],
  matchedSkills = [],
  onFixResume,
}: JobMatchCardProps) => {
  const getScoreColor = (s: number) => {
    if (s >= 70) return "text-emerald-500";
    if (s >= 45) return "text-amber-500";
    return "text-red-500";
  };

  const getBarColor = (s: number) => {
    if (s >= 70) return "bg-emerald-500";
    if (s >= 45) return "bg-amber-500";
    return "bg-red-500";
  };

  const getVerdict = (s: number) => {
    if (s >= 80) return "Strong fit — you're competitive for this role";
    if (s >= 60) return "Decent match — but you're leaving opportunities on the table";
    if (s >= 40) return "Weak match — significant gaps will hurt your chances";
    return "Poor fit — this resume won't make the cut for this role";
  };

  return (
    <div className="rounded-2xl border border-border/50 overflow-hidden shadow-lg bg-card">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-6 py-5">
        <div className="flex items-center gap-3 text-white">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Resume vs Job Match</h3>
            <p className="text-white/70 text-sm">How well your resume fits this role</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Score Display */}
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Match Score</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className={cn("text-7xl font-black", getScoreColor(matchScore))}>
              {matchScore}
            </span>
            <span className="text-3xl text-muted-foreground font-bold">%</span>
          </div>
          <p className="text-muted-foreground">{getVerdict(matchScore)}</p>

          {/* Progress Bar */}
          <div className="w-full h-4 bg-secondary rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-1000 ease-out", getBarColor(matchScore))}
              style={{ width: `${matchScore}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            You are <strong>{matchScore}% fit</strong> for this role
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Matched */}
          {matchedSkills.length > 0 && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200/60 p-4">
              <h4 className="font-semibold text-emerald-800 flex items-center gap-2 mb-3 text-sm">
                <CheckCircle className="h-4 w-4" />
                Skills You Have ({matchedSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.slice(0, 8).map((skill, i) => (
                  <span
                    key={i}
                    className="bg-emerald-100 text-emerald-800 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing */}
          {missingSkills.length > 0 && (
            <div className="rounded-xl bg-red-50 border border-red-200/60 p-4">
              <h4 className="font-semibold text-red-800 flex items-center gap-2 mb-3 text-sm">
                <XCircle className="h-4 w-4" />
                Missing Skills ({missingSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {missingSkills.slice(0, 10).map((skill, i) => (
                  <span
                    key={i}
                    className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        {onFixResume && missingSkills.length > 0 && (
          <Button
            onClick={() => {
              track("Fix Resume For Job Clicked", { matchScore });
              onFixResume();
            }}
            className="w-full gap-2"
            size="lg"
          >
            <Sparkles className="h-4 w-4" />
            Fix Resume for This Job
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
