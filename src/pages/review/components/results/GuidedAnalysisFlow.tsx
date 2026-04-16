import { useState, useEffect, useRef } from "react";
import { 
  ChevronLeft, ChevronRight, Target, Shield, Sparkles, 
  Flame, ArrowRight, TrendingUp, Zap, SkipForward,
  Check, Lock, Trophy, RefreshCw, Download, Share2,
  Linkedin, Star, Crown, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ResumeScoreCard } from "../viral/ResumeScoreCard";
import { ResumeRoastLines } from "../viral/ResumeRoastLines";
import { BeforeAfterComparison } from "../viral/BeforeAfterComparison";
import { track } from "@/lib/mixpanel";

interface GuidedAnalysisFlowProps {
  resumeScore?: number;
  atsScore?: number;
  atsVerdict?: string;
  jdMatchScore?: number;
  jdMatchVerdict?: string;
  roastPreview?: string;
  topActions?: string[];
  isLoading?: boolean;
  onUnlock?: () => void;
  onNavigate: (tab: string) => void;
  onRecheck?: () => void;
  missingKeywords?: string[];
  matchedSkills?: string[];
  weakBullets?: { original: string; improved: string }[];
  atsIssues?: string[];
  roastLines?: string[];
  onRegenerateRoast?: () => void;
  isRegenerating?: boolean;
  roleLabel?: string;
}

const STEPS = [
  { id: "score", label: "Score", icon: Zap },
  { id: "issues", label: "Issues", icon: Target },
  { id: "ats", label: "ATS", icon: Shield },
  { id: "match", label: "Job Match", icon: Sparkles },
  { id: "upgrade", label: "Upgrade", icon: TrendingUp },
  { id: "roast", label: "Roast", icon: Flame },
] as const;

// Animated counter hook
const useAnimatedCounter = (target: number, duration = 1500, enabled = true) => {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const animRef = useRef<number>();

  useEffect(() => {
    if (!enabled || target === 0) { setCount(0); return; }
    startTime.current = null;
    const animate = (ts: number) => {
      if (!startTime.current) startTime.current = ts;
      const progress = Math.min((ts - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(eased * target));
      if (progress < 1) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [target, enabled, duration]);

  return count;
};

// Score improvement estimator per step
const getStepImprovement = (step: number, score: number): number => {
  if (score >= 85) return [0, 2, 3, 2, 3, 0][step] || 0;
  if (score >= 60) return [0, 5, 6, 5, 8, 0][step] || 0;
  return [0, 8, 10, 7, 12, 0][step] || 0;
};

const getPotentialScore = (score: number): number => Math.min(95, score + (score < 60 ? 25 : score < 80 ? 18 : 8));

const getTierForScore = (score: number) => {
  if (score >= 85) return { name: "Top 10% Candidate", icon: Crown, color: "text-violet-400", bg: "bg-violet-500/20" };
  if (score >= 70) return { name: "Competitive Candidate", icon: Star, color: "text-emerald-400", bg: "bg-emerald-500/20" };
  if (score >= 50) return { name: "Blending Into The Crowd", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/20" };
  return { name: "Invisible Candidate", icon: User, color: "text-red-400", bg: "bg-red-500/20" };
};

export const GuidedAnalysisFlow = (props: GuidedAnalysisFlowProps) => {
  const {
    resumeScore = 0, atsScore, jdMatchScore, atsVerdict,
    jdMatchVerdict, topActions = [], isLoading, onUnlock, onNavigate,
    onRecheck, missingKeywords = [], matchedSkills = [], weakBullets = [],
    atsIssues = [], roastLines = [], onRegenerateRoast, isRegenerating,
    roleLabel, roastPreview,
  } = props;

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showStepReward, setShowStepReward] = useState(false);
  const [lastGain, setLastGain] = useState(0);

  const overallScore = Math.round(
    ((resumeScore || 0) * 0.3 + (atsScore || 0) * 0.35 + (jdMatchScore || 0) * 0.35)
  );
  const potentialScore = getPotentialScore(overallScore);
  const cumulativeGain = Array.from(completedSteps).reduce(
    (sum, s) => sum + getStepImprovement(s, overallScore), 0
  );
  const optimizedPercent = isLoading ? 0 : Math.round((completedSteps.size / (STEPS.length - 1)) * 100);

  const goNext = () => {
    // Mark current step as complete & show micro-reward
    const gain = getStepImprovement(currentStep, overallScore);
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    setLastGain(gain);
    setShowStepReward(true);
    setTimeout(() => setShowStepReward(false), 2000);
    setCurrentStep(s => Math.min(s + 1, STEPS.length - 1));
    track("Step Completed", { step: STEPS[currentStep].id, gain });
  };
  const goPrev = () => setCurrentStep(s => Math.max(s - 1, 0));

  useEffect(() => {
    if (!isLoading && currentStep === 0) {
      // Score just revealed
    }
  }, [isLoading]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === STEPS.length - 1;
  const stepsLeft = STEPS.length - 1 - completedSteps.size;
  const currentTier = getTierForScore(overallScore);
  const potentialTier = getTierForScore(potentialScore);

  return (
    <div className="space-y-0">
      {/* Sticky Progress Bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 -mx-4 px-4 py-3 sm:-mx-0 sm:px-0 sm:rounded-t-xl">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-semibold text-foreground">
            Step {currentStep + 1} of {STEPS.length} — {STEPS[currentStep].label}
          </span>
          {!isLoading && (
            <span className="text-xs font-bold text-primary">
              {optimizedPercent}% optimized
            </span>
          )}
        </div>
        <Progress value={isLoading ? 5 : Math.round(((currentStep + 1) / STEPS.length) * 100)} className="h-2.5" />

        {/* Score trajectory */}
        {!isLoading && overallScore > 0 && (
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Score:</span>
              <span className="font-bold text-foreground">{overallScore}</span>
              <ArrowRight className="h-3 w-3 text-primary" />
              <span className="font-bold text-primary">{potentialScore} possible</span>
            </div>
            {stepsLeft > 0 && (
              <span className="text-xs text-muted-foreground">
                {stepsLeft} step{stepsLeft > 1 ? "s" : ""} to Top Candidate
              </span>
            )}
          </div>
        )}

        {/* Step dots */}
        <div className="flex items-center gap-1.5 mt-2.5">
          {STEPS.map((step, i) => {
            const StepIcon = step.icon;
            const isActive = i === currentStep;
            const isComplete = completedSteps.has(i);
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(i)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : isComplete
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                )}
              >
                {isComplete ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <StepIcon className="h-3 w-3" />
                )}
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Micro-reward toast */}
      {showStepReward && lastGain > 0 && (
        <div className="animate-fade-in text-center py-3">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <Check className="h-4 w-4" />
            Step completed 🔥 +{lastGain} score improvement unlocked
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="min-h-[60vh] py-6">
        {currentStep === 0 && (
          <StepScore
            score={overallScore}
            potentialScore={potentialScore}
            atsScore={atsScore}
            jdMatchScore={jdMatchScore}
            roleLabel={roleLabel}
            isLoading={isLoading}
            onNext={goNext}
          />
        )}
        {currentStep === 1 && (
          <StepIssues
            topActions={topActions}
            atsIssues={atsIssues}
            missingKeywords={missingKeywords}
            score={overallScore}
            potentialScore={potentialScore}
            onNext={goNext}
          />
        )}
        {currentStep === 2 && (
          <StepATS
            atsScore={atsScore}
            atsIssues={atsIssues}
            missingKeywords={missingKeywords}
            onNext={goNext}
            onNavigate={onNavigate}
          />
        )}
        {currentStep === 3 && (
          <StepJobMatch
            jdMatchScore={jdMatchScore}
            missingKeywords={missingKeywords}
            matchedSkills={matchedSkills}
            onNext={goNext}
            onNavigate={onNavigate}
          />
        )}
        {currentStep === 4 && (
          <StepUpgrade
            weakBullets={weakBullets}
            score={overallScore}
            potentialScore={potentialScore}
            onNext={goNext}
            onUnlock={onUnlock}
          />
        )}
        {currentStep === 5 && (
          <StepEndScreen
            score={overallScore}
            potentialScore={potentialScore}
            completedSteps={completedSteps.size}
            totalSteps={STEPS.length}
            roastLines={roastLines}
            onRegenerateRoast={onRegenerateRoast}
            isRegenerating={isRegenerating}
            onUnlock={onUnlock}
            onRecheck={onRecheck}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <Button
          variant="ghost"
          onClick={goPrev}
          disabled={isFirstStep}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        {/* Social proof */}
        <p className="hidden sm:block text-xs text-muted-foreground">
          10,000+ resumes improved
        </p>

        <div className="flex gap-2">
          {!isLastStep && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentStep(STEPS.length - 1)}
              className="gap-1 text-muted-foreground text-xs"
            >
              <SkipForward className="h-3 w-3" />
              Skip to end
            </Button>
          )}
          {!isLastStep ? (
            <Button onClick={goNext} className="gap-2">
              Next Step
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={onUnlock} className="gap-2 bg-primary hover:bg-primary/90">
              <Lock className="h-4 w-4" />
              Fix My Resume Before My Next Rejection
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// ──────────────────── STEP 1: SCORE ────────────────────

const StepScore = ({
  score, potentialScore, atsScore, jdMatchScore, roleLabel, isLoading, onNext,
}: {
  score: number; potentialScore: number; atsScore?: number; jdMatchScore?: number;
  roleLabel?: string; isLoading?: boolean; onNext: () => void;
}) => {
  const animatedScore = useAnimatedCounter(score, 1800, !isLoading);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <ResumeScoreCard
        score={isLoading ? 0 : animatedScore}
        atsScore={atsScore}
        jdMatchScore={jdMatchScore}
        roleLabel={roleLabel}
        isLoading={isLoading}
      />

      {/* Potential score teaser */}
      {!isLoading && (
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary/10 border border-primary/20">
            <span className="text-2xl font-black text-foreground">{score}</span>
            <ArrowRight className="h-5 w-5 text-primary" />
            <span className="text-2xl font-black text-primary">{potentialScore}</span>
            <span className="text-sm text-muted-foreground">possible</span>
          </div>
          <p className="text-sm text-muted-foreground">
            You're getting closer to top 10% — let's fix what's holding you back.
          </p>
        </div>
      )}

      {/* Urgency stats */}
      {!isLoading && (
        <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
          <span className="px-3 py-1.5 rounded-full bg-secondary">⏱ Most recruiters spend &lt;6 seconds</span>
          <span className="px-3 py-1.5 rounded-full bg-secondary">📊 Top candidates score 80+</span>
          <span className="px-3 py-1.5 rounded-full bg-secondary">🔥 Most users improve by 15–25 pts</span>
        </div>
      )}

      {!isLoading && (
        <div className="text-center pt-4">
          <Button size="lg" onClick={onNext} className="gap-2 text-lg px-8 py-6">
            Fix My Resume
            <ArrowRight className="h-5 w-5" />
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            You're leaving interviews on the table. Let's fix that.
          </p>
        </div>
      )}
    </div>
  );
};

// ──────────────────── STEP 2: ISSUES ────────────────────

const getIssueDescription = (issue: string): string => {
  const lower = issue.toLowerCase();
  if (lower.includes("bullet") || lower.includes("impact"))
    return "Your bullets sound busy — not impactful. Recruiters want results, not responsibilities.";
  if (lower.includes("keyword") || lower.includes("missing"))
    return "You're missing keywords recruiters are filtering for — so your resume never shows up.";
  if (lower.includes("format") || lower.includes("ats"))
    return "Your formatting is breaking ATS parsers. Your resume might never reach a human.";
  if (lower.includes("generic") || lower.includes("blend"))
    return "Your resume reads like everyone else's — and that's why it gets ignored.";
  return issue;
};

const StepIssues = ({
  topActions, atsIssues, missingKeywords, score, potentialScore, onNext,
}: {
  topActions: string[]; atsIssues: string[]; missingKeywords: string[];
  score: number; potentialScore: number; onNext: () => void;
}) => {
  const issues: { text: string; severity: "High" | "Medium" }[] = [];

  if (topActions.length > 0) {
    topActions.slice(0, 2).forEach(a => issues.push({ text: getIssueDescription(a), severity: "High" }));
  }
  if (missingKeywords.length > 0 && issues.length < 3) {
    issues.push({ text: `You're missing ${missingKeywords.length} keywords recruiters filter for — your resume never shows up.`, severity: "High" });
  }
  if (atsIssues.length > 0 && issues.length < 3) {
    issues.push({ text: getIssueDescription(atsIssues[0]), severity: "Medium" });
  }
  if (issues.length === 0) {
    issues.push(
      { text: "Your bullets show tasks, not impact — recruiters want results.", severity: "High" },
      { text: "You're missing keywords recruiters filter for.", severity: "High" },
      { text: "Your resume blends in with hundreds of others.", severity: "Medium" },
    );
  }

  const estimatedGain = potentialScore - score;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl font-black text-foreground">
          This is why you're not getting interviews
        </h2>
        <p className="text-muted-foreground text-lg">
          These issues are actively hurting your chances.
        </p>
      </div>

      {/* Fix these first or keep getting ignored */}
      <div className="space-y-4">
        {issues.slice(0, 3).map((issue, i) => (
          <div key={i} className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border/50 shadow-sm animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
            <span className={cn(
              "shrink-0 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide",
              issue.severity === "High" ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
            )}>
              {issue.severity}
            </span>
            <p className="text-foreground font-medium leading-relaxed">{issue.text}</p>
          </div>
        ))}
      </div>

      {/* Score improvement preview */}
      <div className="text-center p-5 rounded-xl bg-primary/5 border border-primary/20">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-2xl font-black text-foreground">{score}</span>
          <ArrowRight className="h-5 w-5 text-primary" />
          <span className="text-2xl font-black text-primary">{potentialScore}</span>
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          ✨ Fixing these can boost your score by +{estimatedGain} points
        </p>
      </div>

      {/* Urgency */}
      <p className="text-center text-sm text-muted-foreground italic">
        Recruiters are skipping resumes like this right now.
      </p>

      <div className="text-center">
        <Button size="lg" onClick={onNext} className="gap-2 text-lg px-8 py-6">
          Fix These Issues
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

// ──────────────────── STEP 3: ATS ────────────────────

const StepATS = ({
  atsScore, atsIssues, missingKeywords, onNext, onNavigate,
}: {
  atsScore?: number; atsIssues: string[]; missingKeywords: string[];
  onNext: () => void; onNavigate: (tab: string) => void;
}) => (
  <div className="max-w-2xl mx-auto space-y-8">
    <div className="text-center space-y-2">
      <h2 className="text-3xl sm:text-4xl font-black text-foreground">
        Your resume is failing ATS filters
      </h2>
      <p className="text-muted-foreground text-lg">
        {atsScore !== undefined && atsScore < 70
          ? `Your ATS score is ${atsScore}% — most resumes need 80%+ to pass.`
          : "Here's what automated systems are flagging."}
      </p>
    </div>

    {atsScore !== undefined && (
      <div className="text-center">
        <div className={cn(
          "inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-5xl font-black",
          atsScore >= 80 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
          atsScore >= 60 ? "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
          "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        )}>
          <Shield className="h-8 w-8" />
          {atsScore}%
        </div>
      </div>
    )}

    {missingKeywords.length > 0 && (
      <div className="space-y-3">
        <h3 className="font-bold text-foreground text-lg">Missing Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.slice(0, 8).map((kw, i) => (
            <span key={i} className="px-3 py-1.5 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-200/50 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50">
              {kw}
            </span>
          ))}
          {missingKeywords.length > 8 && (
            <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-secondary text-muted-foreground">
              +{missingKeywords.length - 8} more
            </span>
          )}
        </div>
      </div>
    )}

    {atsIssues.length > 0 && (
      <div className="space-y-3">
        <h3 className="font-bold text-foreground text-lg">Formatting Issues</h3>
        <div className="space-y-2">
          {atsIssues.slice(0, 3).map((issue, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border/50">
              <span className="text-red-500 mt-0.5">✕</span>
              <p className="text-foreground text-sm">{issue}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Button size="lg" onClick={onNext} className="gap-2">
        Optimize for ATS
        <ArrowRight className="h-5 w-5" />
      </Button>
      <Button variant="outline" size="lg" onClick={() => onNavigate("ats")} className="gap-2">
        See Full ATS Report
      </Button>
    </div>
  </div>
);

// ──────────────────── STEP 4: JOB MATCH ────────────────────

const StepJobMatch = ({
  jdMatchScore, missingKeywords, matchedSkills, onNext, onNavigate,
}: {
  jdMatchScore?: number; missingKeywords: string[]; matchedSkills: string[];
  onNext: () => void; onNavigate: (tab: string) => void;
}) => (
  <div className="max-w-2xl mx-auto space-y-8">
    <div className="text-center space-y-2">
      <h2 className="text-3xl sm:text-4xl font-black text-foreground">
        You're missing what recruiters are hiring for
      </h2>
      <p className="text-muted-foreground text-lg">
        This is why you're getting filtered out.
      </p>
    </div>

    {jdMatchScore !== undefined && (
      <div className="text-center">
        <div className={cn(
          "inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-5xl font-black",
          jdMatchScore >= 70 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
          jdMatchScore >= 45 ? "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
          "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        )}>
          <Target className="h-8 w-8" />
          {jdMatchScore}%
        </div>
        <p className="text-sm text-muted-foreground mt-2">match to job requirements</p>
      </div>
    )}

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {missingKeywords.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200/50 dark:bg-red-900/20 dark:border-red-800/50">
          <h3 className="font-bold text-red-700 dark:text-red-400 mb-3">Missing Skills</h3>
          <div className="space-y-1.5">
            {missingKeywords.slice(0, 5).map((skill, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <span className="text-red-400">✕</span> {skill}
              </div>
            ))}
          </div>
        </div>
      )}
      {matchedSkills.length > 0 && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/50 dark:bg-emerald-900/20 dark:border-emerald-800/50">
          <h3 className="font-bold text-emerald-700 dark:text-emerald-400 mb-3">Matched Skills</h3>
          <div className="space-y-1.5">
            {matchedSkills.slice(0, 5).map((skill, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                <Check className="h-3 w-3" /> {skill}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Button size="lg" onClick={onNext} className="gap-2">
        Tailor for This Job
        <ArrowRight className="h-5 w-5" />
      </Button>
      <Button variant="outline" size="lg" onClick={() => onNavigate("jdmatch")} className="gap-2">
        See Full Match Report
      </Button>
    </div>
  </div>
);

// ──────────────────── STEP 5: UPGRADE ────────────────────

const StepUpgrade = ({
  weakBullets, score, potentialScore, onNext, onUnlock,
}: {
  weakBullets: { original: string; improved: string }[];
  score: number; potentialScore: number;
  onNext: () => void; onUnlock?: () => void;
}) => (
  <div className="max-w-2xl mx-auto space-y-8">
    <div className="text-center space-y-2">
      <h2 className="text-3xl sm:text-4xl font-black text-foreground">
        This is how top candidates write resumes
      </h2>
      <p className="text-muted-foreground text-lg">
        Same experience. Better positioning. More interviews.
      </p>
    </div>

    {weakBullets.length > 0 ? (
      <BeforeAfterComparison
        bullets={weakBullets.slice(0, 3)}
        onOptimize={onUnlock || (() => {})}
      />
    ) : (
      <div className="text-center py-12 text-muted-foreground">
        <p>No bullet transformations available yet.</p>
      </div>
    )}

    {/* Score trajectory */}
    <div className="text-center p-5 rounded-xl bg-primary/5 border border-primary/20">
      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="text-2xl font-black text-foreground">{score}</span>
        <ArrowRight className="h-5 w-5 text-primary" />
        <span className="text-2xl font-black text-primary">{potentialScore}</span>
      </div>
      <p className="text-sm text-muted-foreground font-medium">
        Apply these changes and you'll stand out instantly.
      </p>
    </div>

    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Button size="lg" onClick={onUnlock} className="gap-2">
        Apply These Changes
        <ArrowRight className="h-5 w-5" />
      </Button>
      <Button variant="outline" size="lg" onClick={onNext} className="gap-2">
        Next: Roast 🔥
      </Button>
    </div>
  </div>
);

// ──────────────────── STEP 6: END SCREEN + ROAST ────────────────────

const StepEndScreen = ({
  score, potentialScore, completedSteps, totalSteps,
  roastLines, onRegenerateRoast, isRegenerating, onUnlock, onRecheck,
}: {
  score: number; potentialScore: number;
  completedSteps: number; totalSteps: number;
  roastLines: string[]; onRegenerateRoast?: () => void;
  isRegenerating?: boolean; onUnlock?: () => void; onRecheck?: () => void;
}) => {
  const currentTier = getTierForScore(score);
  const potentialTier = getTierForScore(potentialScore);
  const CurrentIcon = currentTier.icon;
  const PotentialIcon = potentialTier.icon;

  const shareCaption = `I just improved my resume score from ${score} → ${potentialScore} on @matchrate_co! 🚀\n\nCheck yours →`;
  const shareText = encodeURIComponent(`${shareCaption}\nhttps://matchrate.co`);

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      {/* Celebration header */}
      <div className="text-center space-y-4">
        <div className="text-5xl">🎉</div>
        <h2 className="text-3xl sm:text-4xl font-black text-foreground">
          You're now ahead of {Math.min(95, 50 + Math.round(potentialScore * 0.5))}% of applicants
        </h2>
        <p className="text-muted-foreground text-lg">
          You've reviewed all {totalSteps} steps. Here's your transformation:
        </p>
      </div>

      {/* Before vs After */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-card border border-border/50 text-center space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Before</p>
          <div className="text-4xl font-black text-foreground">{score}</div>
          <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold", currentTier.bg, currentTier.color)}>
            <CurrentIcon className="h-3 w-3" />
            {currentTier.name}
          </div>
        </div>
        <div className="p-5 rounded-xl bg-primary/5 border border-primary/20 text-center space-y-3">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide">After</p>
          <div className="text-4xl font-black text-primary">{potentialScore}</div>
          <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold", potentialTier.bg, potentialTier.color)}>
            <PotentialIcon className="h-3 w-3" />
            {potentialTier.name}
          </div>
        </div>
      </div>

      {/* Challenge */}
      <div className="text-center p-5 rounded-xl border-2 border-primary/30 bg-primary/5">
        <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
        <h3 className="text-xl font-black text-foreground">Can you beat 85?</h3>
        <p className="text-sm text-muted-foreground mt-1">Only 12% of users reach this level.</p>
        {onRecheck && (
          <Button onClick={onRecheck} variant="outline" className="gap-2 mt-3">
            <RefreshCw className="h-4 w-4" />
            Try to Beat It
          </Button>
        )}
      </div>

      {/* Roast section */}
      {roastLines.length > 0 && (
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-black text-foreground">
              Brutally honest. Slightly painful.
            </h3>
            <p className="text-muted-foreground text-sm">100% accurate. Don't shoot the messenger.</p>
          </div>
          <ResumeRoastLines
            roastLines={roastLines}
            onRegenerate={onRegenerateRoast}
            isRegenerating={isRegenerating}
          />
        </div>
      )}

      {/* Share buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://matchrate.co")}`, "_blank")}
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          <Linkedin className="h-4 w-4" />
          Share on LinkedIn
        </Button>
        <Button
          onClick={() => window.open(`https://twitter.com/intent/tweet?text=${shareText}`, "_blank")}
          className="gap-2 bg-sky-500 hover:bg-sky-600 text-white"
          size="lg"
        >
          <Share2 className="h-4 w-4" />
          Share My Score 😭
        </Button>
      </div>

      {/* Final CTA */}
      <div className="text-center pt-2">
        <Button size="lg" onClick={onUnlock} className="gap-2 text-lg px-8 py-6">
          <Lock className="h-5 w-5" />
          Fix My Resume Before My Next Rejection
        </Button>
        <p className="text-xs text-muted-foreground mt-3">
          Most users improve by 15–25 points after one recheck.
        </p>
      </div>
    </div>
  );
};
