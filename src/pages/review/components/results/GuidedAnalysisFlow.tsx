import { useState, useEffect } from "react";
import { 
  ChevronLeft, ChevronRight, Target, Shield, Sparkles, 
  Flame, ArrowRight, TrendingUp, Zap, SkipForward,
  Check, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ResumeScoreCard } from "../viral/ResumeScoreCard";
import { ResumeRoastLines } from "../viral/ResumeRoastLines";
import { BeforeAfterComparison } from "../viral/BeforeAfterComparison";

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

export const GuidedAnalysisFlow = (props: GuidedAnalysisFlowProps) => {
  const {
    resumeScore = 0, atsScore, jdMatchScore, atsVerdict,
    jdMatchVerdict, topActions = [], isLoading, onUnlock, onNavigate,
    onRecheck, missingKeywords = [], matchedSkills = [], weakBullets = [],
    atsIssues = [], roastLines = [], onRegenerateRoast, isRegenerating,
    roleLabel, roastPreview,
  } = props;

  const [currentStep, setCurrentStep] = useState(0);

  const overallScore = Math.round(
    ((resumeScore || 0) * 0.3 + (atsScore || 0) * 0.35 + (jdMatchScore || 0) * 0.35)
  );

  const progressPercent = isLoading ? 0 : Math.round(((currentStep + 1) / STEPS.length) * 100);

  const goNext = () => setCurrentStep(s => Math.min(s + 1, STEPS.length - 1));
  const goPrev = () => setCurrentStep(s => Math.max(s - 1, 0));

  // Auto-advance from loading to step 0 when done
  useEffect(() => {
    if (!isLoading && currentStep === 0) {
      // Stay on step 0, score just revealed
    }
  }, [isLoading]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="space-y-0">
      {/* Sticky Progress Bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 -mx-4 px-4 py-3 sm:-mx-0 sm:px-0 sm:rounded-t-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground">
            Step {currentStep + 1} of {STEPS.length} — {STEPS[currentStep].label}
          </span>
          {!isLoading && (
            <span className="text-xs font-medium text-muted-foreground">
              {progressPercent}% complete
            </span>
          )}
        </div>
        <Progress value={progressPercent} className="h-2" />

        {/* Step dots */}
        <div className="flex items-center gap-1.5 mt-3">
          {STEPS.map((step, i) => {
            const StepIcon = step.icon;
            const isActive = i === currentStep;
            const isComplete = i < currentStep;
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(i)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : isComplete
                    ? "bg-emerald-100 text-emerald-700"
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

      {/* Step Content */}
      <div className="min-h-[60vh] py-6">
        {currentStep === 0 && (
          <StepScore
            score={overallScore}
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
            onNext={goNext}
            onUnlock={onUnlock}
          />
        )}
        {currentStep === 5 && (
          <StepRoast
            roastLines={roastLines}
            onRegenerateRoast={onRegenerateRoast}
            isRegenerating={isRegenerating}
            onUnlock={onUnlock}
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
            <Button onClick={onUnlock} className="gap-2">
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
  score, atsScore, jdMatchScore, roleLabel, isLoading, onNext,
}: {
  score: number; atsScore?: number; jdMatchScore?: number;
  roleLabel?: string; isLoading?: boolean; onNext: () => void;
}) => (
  <div className="space-y-6 max-w-2xl mx-auto">
    <ResumeScoreCard
      score={isLoading ? 0 : score}
      atsScore={atsScore}
      jdMatchScore={jdMatchScore}
      roleLabel={roleLabel}
      isLoading={isLoading}
    />
    {!isLoading && (
      <div className="text-center pt-4">
        <Button size="lg" onClick={onNext} className="gap-2 text-lg px-8 py-6">
          Fix My Resume
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    )}
  </div>
);

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
  topActions, atsIssues, missingKeywords, score, onNext,
}: {
  topActions: string[]; atsIssues: string[]; missingKeywords: string[];
  score: number; onNext: () => void;
}) => {
  const issues: { text: string; severity: "High" | "Medium" }[] = [];

  // Build top 3 issues from available data
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

  const estimatedGain = score < 60 ? 20 : score < 80 ? 12 : 5;

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

      <div className="space-y-4">
        {issues.slice(0, 3).map((issue, i) => (
          <div key={i} className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border/50 shadow-sm">
            <span className={cn(
              "shrink-0 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide",
              issue.severity === "High" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
            )}>
              {issue.severity}
            </span>
            <p className="text-foreground font-medium leading-relaxed">{issue.text}</p>
          </div>
        ))}
      </div>

      <div className="text-center p-4 rounded-xl bg-emerald-50 border border-emerald-200/50">
        <p className="text-emerald-700 font-semibold">
          ✨ Fixing these can increase your score by +{estimatedGain} points
        </p>
      </div>

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

    {/* ATS Score */}
    {atsScore !== undefined && (
      <div className="text-center">
        <div className={cn(
          "inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-5xl font-black",
          atsScore >= 80 ? "bg-emerald-50 text-emerald-600" :
          atsScore >= 60 ? "bg-amber-50 text-amber-600" :
          "bg-red-50 text-red-600"
        )}>
          <Shield className="h-8 w-8" />
          {atsScore}%
        </div>
      </div>
    )}

    {/* Missing Keywords */}
    {missingKeywords.length > 0 && (
      <div className="space-y-3">
        <h3 className="font-bold text-foreground text-lg">Missing Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.slice(0, 8).map((kw, i) => (
            <span key={i} className="px-3 py-1.5 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-200/50">
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

    {/* Formatting Issues */}
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

    {/* Match Score */}
    {jdMatchScore !== undefined && (
      <div className="text-center">
        <div className={cn(
          "inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-5xl font-black",
          jdMatchScore >= 70 ? "bg-emerald-50 text-emerald-600" :
          jdMatchScore >= 45 ? "bg-amber-50 text-amber-600" :
          "bg-red-50 text-red-600"
        )}>
          <Target className="h-8 w-8" />
          {jdMatchScore}%
        </div>
        <p className="text-sm text-muted-foreground mt-2">match to job requirements</p>
      </div>
    )}

    {/* Gap Analysis */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {missingKeywords.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200/50">
          <h3 className="font-bold text-red-700 mb-3">Missing Skills</h3>
          <div className="space-y-1.5">
            {missingKeywords.slice(0, 5).map((skill, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-red-600">
                <span className="text-red-400">✕</span> {skill}
              </div>
            ))}
          </div>
        </div>
      )}
      {matchedSkills.length > 0 && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/50">
          <h3 className="font-bold text-emerald-700 mb-3">Matched Skills</h3>
          <div className="space-y-1.5">
            {matchedSkills.slice(0, 5).map((skill, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-emerald-600">
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
  weakBullets, onNext, onUnlock,
}: {
  weakBullets: { original: string; improved: string }[];
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

// ──────────────────── STEP 6: ROAST ────────────────────

const StepRoast = ({
  roastLines, onRegenerateRoast, isRegenerating, onUnlock,
}: {
  roastLines: string[]; onRegenerateRoast?: () => void;
  isRegenerating?: boolean; onUnlock?: () => void;
}) => (
  <div className="max-w-2xl mx-auto space-y-8">
    <div className="text-center space-y-2">
      <h2 className="text-3xl sm:text-4xl font-black text-foreground">
        Brutally honest. Slightly painful.
      </h2>
      <p className="text-muted-foreground text-lg">
        100% accurate. Don't shoot the messenger.
      </p>
    </div>

    <ResumeRoastLines
      roastLines={roastLines}
      onRegenerate={onRegenerateRoast}
      isRegenerating={isRegenerating}
    />

    <div className="text-center pt-4">
      <Button size="lg" onClick={onUnlock} className="gap-2 text-lg px-8 py-6">
        <Lock className="h-5 w-5" />
        Fix My Resume Before My Next Rejection
      </Button>
    </div>
  </div>
);
