import { useState } from "react";
import { 
  TrendingUp, Shield, Target, Lock, ArrowRight, Sparkles, Eye, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ResumeScoreCard } from "../viral/ResumeScoreCard";
import { ResumeTierRanking } from "../viral/ResumeTierRanking";
import { RejectionInsightReport } from "../viral/RejectionInsightReport";
import { JobMatchCard } from "../viral/JobMatchCard";
import { BeforeAfterComparison } from "../viral/BeforeAfterComparison";
import { ResumeRoastLines } from "../viral/ResumeRoastLines";
import { ChallengeLoop } from "../viral/ChallengeLoop";

interface ExecutiveSummaryProps {
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

// Accordion section wrapper
const CollapsibleSection = ({ 
  title, 
  icon: Icon, 
  defaultOpen = false, 
  children 
}: { 
  title: string; 
  icon: typeof TrendingUp; 
  defaultOpen?: boolean; 
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-border/50 rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-card hover:bg-secondary/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground text-lg">{title}</span>
        </div>
        <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="border-t border-border/30">
          {children}
        </div>
      )}
    </div>
  );
};

export const ExecutiveSummary = ({
  resumeScore,
  atsScore,
  atsVerdict,
  jdMatchScore,
  jdMatchVerdict,
  roastPreview,
  topActions = [],
  isLoading,
  onUnlock,
  onNavigate,
  onRecheck,
  missingKeywords = [],
  matchedSkills = [],
  weakBullets = [],
  atsIssues = [],
  roastLines = [],
  onRegenerateRoast,
  isRegenerating,
  roleLabel,
}: ExecutiveSummaryProps) => {
  
  const overallScore = Math.round(
    ((resumeScore || 0) * 0.3 + (atsScore || 0) * 0.35 + (jdMatchScore || 0) * 0.35)
  );
  
  return (
    <div className="space-y-6">
      {/* SECTION 1: ABOVE THE FOLD — Score + Emotion + Share */}
      <ResumeScoreCard 
        score={isLoading ? 0 : overallScore} 
        atsScore={atsScore} 
        jdMatchScore={jdMatchScore}
        roleLabel={roleLabel}
        isLoading={isLoading}
      />

      {/* SECTION 2: TIER IDENTITY */}
      {!isLoading && <ResumeTierRanking score={overallScore} />}

      {/* SECTION 3: CHALLENGE LOOP */}
      {!isLoading && onRecheck && (
        <ChallengeLoop score={overallScore} onRecheck={onRecheck} />
      )}

      {/* SECTION 4+: DETAILED SECTIONS — Collapsed by default */}

      {/* Rejection Insight Report */}
      <CollapsibleSection title="Why You're Not Getting Interviews" icon={Target}>
        <RejectionInsightReport
          missingKeywords={missingKeywords}
          atsScore={atsScore}
          jdMatchScore={jdMatchScore}
          weakBullets={weakBullets}
          issues={atsIssues}
          onNavigate={onNavigate}
        />
      </CollapsibleSection>

      {/* Job Match */}
      {jdMatchScore !== undefined && (
        <CollapsibleSection title="Resume vs Job Match" icon={Target}>
          <JobMatchCard
            matchScore={jdMatchScore}
            missingSkills={missingKeywords}
            matchedSkills={matchedSkills}
            onFixResume={() => onNavigate("resume")}
          />
        </CollapsibleSection>
      )}

      {/* Before vs After */}
      {weakBullets.length > 0 && (
        <CollapsibleSection title="Before vs After Transformation" icon={TrendingUp}>
          <BeforeAfterComparison
            bullets={weakBullets}
            onOptimize={() => onNavigate("resume")}
          />
        </CollapsibleSection>
      )}

      {/* Roast */}
      {(roastLines.length > 0 || roastPreview) && (
        <CollapsibleSection title="Resume Roast 🔥" icon={Sparkles}>
          <ResumeRoastLines
            roastLines={roastLines}
            onRegenerate={onRegenerateRoast}
            isRegenerating={isRegenerating}
          />
        </CollapsibleSection>
      )}

      {/* Top 3 Actions */}
      {topActions.length > 0 && (
        <CollapsibleSection title="Fix these first or keep getting ignored." icon={TrendingUp}>
          <div className="p-6 space-y-3">
            {topActions.slice(0, 3).map((action, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </span>
                <p className="text-foreground">{action}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Verdict Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <VerdictCard
          icon={Sparkles}
          iconColor="text-blue-600"
          bg="from-blue-50 to-indigo-50"
          border="border-blue-200/50"
          hoverColor="text-blue-600"
          title="Resume Strength"
          subtitle="Clarity, impact & structure"
          verdict={getResumeVerdict(resumeScore)}
          onClick={() => onNavigate("resume")}
        />
        <VerdictCard
          icon={Shield}
          iconColor="text-emerald-600"
          bg="from-emerald-50 to-teal-50"
          border="border-emerald-200/50"
          hoverColor="text-emerald-600"
          title="ATS Safety"
          subtitle="Will robots accept you?"
          verdict={getATSVerdict(atsScore, atsVerdict)}
          onClick={() => onNavigate("ats")}
        />
        <VerdictCard
          icon={Target}
          iconColor="text-purple-600"
          bg="from-purple-50 to-violet-50"
          border="border-purple-200/50"
          hoverColor="text-purple-600"
          title="Job Fit"
          subtitle="Fit for this specific role"
          verdict={getJDVerdict(jdMatchScore, jdMatchVerdict)}
          onClick={() => onNavigate("jdmatch")}
        />
      </div>
      
      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button size="lg" className="flex-1 gap-2" onClick={onUnlock}>
          <Lock className="h-4 w-4" />
          Fix My Resume Before My Next Rejection
        </Button>
        <Button variant="outline" size="lg" className="flex-1 gap-2" onClick={() => onNavigate("jdmatch")}>
          <Eye className="h-4 w-4" />
          See Why You Might Get Rejected
        </Button>
      </div>
    </div>
  );
};

// Helper functions
const getResumeVerdict = (score?: number) => {
  if (!score) return { label: "Pending", color: "bg-slate-100 text-slate-600" };
  if (score >= 70) return { label: "Strong", color: "bg-emerald-100 text-emerald-700" };
  if (score >= 45) return { label: "Fair", color: "bg-amber-100 text-amber-700" };
  return { label: "Weak", color: "bg-red-100 text-red-700" };
};

const getATSVerdict = (score?: number, verdict?: string) => {
  if (!score) return { label: "Pending", color: "bg-slate-100 text-slate-600" };
  if (verdict?.toLowerCase().includes("safe") || score >= 70) return { label: "Safe", color: "bg-emerald-100 text-emerald-700" };
  if (verdict?.toLowerCase().includes("high") || score < 45) return { label: "High Risk", color: "bg-red-100 text-red-700" };
  return { label: "Minor Risk", color: "bg-amber-100 text-amber-700" };
};

const getJDVerdict = (score?: number, verdict?: string) => {
  if (!score) return { label: "Pending", color: "bg-slate-100 text-slate-600" };
  if (verdict?.toLowerCase().includes("strong") || score >= 70) return { label: "Strong Match", color: "bg-emerald-100 text-emerald-700" };
  if (verdict?.toLowerCase().includes("weak") || score < 45) return { label: "Weak Match", color: "bg-red-100 text-red-700" };
  return { label: "Medium Match", color: "bg-amber-100 text-amber-700" };
};

interface VerdictCardProps {
  icon: typeof Sparkles;
  iconColor: string;
  bg: string;
  border: string;
  hoverColor: string;
  title: string;
  subtitle: string;
  verdict: { label: string; color: string };
  onClick: () => void;
}

const VerdictCard = ({ icon: Icon, iconColor, bg, border, hoverColor, title, subtitle, verdict, onClick }: VerdictCardProps) => (
  <button
    onClick={onClick}
    className={`bg-gradient-to-br ${bg} rounded-xl p-5 border ${border} hover:shadow-md transition-all text-left group`}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="p-2 bg-card rounded-lg shadow-sm">
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${verdict.color}`}>
        {verdict.label}
      </span>
    </div>
    <h3 className="font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground">{subtitle}</p>
    <div className={`mt-3 flex items-center ${hoverColor} text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity`}>
      View details <ArrowRight className="h-4 w-4 ml-1" />
    </div>
  </button>
);
