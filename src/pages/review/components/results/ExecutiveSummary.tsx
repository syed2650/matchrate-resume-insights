import { 
  TrendingUp, 
  Shield, 
  Target, 
  Flame,
  Lock,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Sparkles,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
}

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
  onNavigate
}: ExecutiveSummaryProps) => {
  
  // Calculate overall match score (weighted average)
  const overallScore = Math.round(
    ((resumeScore || 0) * 0.3 + (atsScore || 0) * 0.35 + (jdMatchScore || 0) * 0.35)
  );
  
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-600";
    if (score >= 45) return "text-amber-600";
    return "text-red-600";
  };
  
  const getScoreBg = (score: number) => {
    if (score >= 70) return "from-emerald-50 to-teal-50";
    if (score >= 45) return "from-amber-50 to-yellow-50";
    return "from-red-50 to-rose-50";
  };
  
  const getInterpretation = () => {
    if (overallScore >= 70) return "Strong fit, interview-ready with minor tweaks";
    if (overallScore >= 45) return "Good potential, but needs targeted improvements";
    return "Significant gaps - focus on critical fixes first";
  };
  
  // Resume Strength: labels only, no numbers
  const getResumeVerdict = () => {
    if (!resumeScore) return { label: "Pending", color: "bg-slate-100 text-slate-600" };
    if (resumeScore >= 70) return { label: "Strong", color: "bg-emerald-100 text-emerald-700" };
    if (resumeScore >= 45) return { label: "Fair", color: "bg-amber-100 text-amber-700" };
    return { label: "Weak", color: "bg-red-100 text-red-700" };
  };
  
  // ATS Safety: labels only
  const getATSVerdict = () => {
    if (!atsScore) return { label: "Pending", color: "bg-slate-100 text-slate-600", icon: Shield };
    if (atsVerdict?.toLowerCase().includes("safe") || atsScore >= 70) {
      return { label: "Safe", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle };
    }
    if (atsVerdict?.toLowerCase().includes("high") || atsScore < 45) {
      return { label: "High Risk", color: "bg-red-100 text-red-700", icon: XCircle };
    }
    return { label: "Minor Risk", color: "bg-amber-100 text-amber-700", icon: AlertTriangle };
  };
  
  // Job Fit: labels only
  const getJDVerdict = () => {
    if (!jdMatchScore) return { label: "Pending", color: "bg-slate-100 text-slate-600" };
    if (jdMatchVerdict?.toLowerCase().includes("strong") || jdMatchScore >= 70) {
      return { label: "Strong Match", color: "bg-emerald-100 text-emerald-700" };
    }
    if (jdMatchVerdict?.toLowerCase().includes("weak") || jdMatchScore < 45) {
      return { label: "Weak Match", color: "bg-red-100 text-red-700" };
    }
    return { label: "Medium Match", color: "bg-amber-100 text-amber-700" };
  };
  
  const resumeVerdict = getResumeVerdict();
  const atsVerdictData = getATSVerdict();
  const jdVerdict = getJDVerdict();
  
  return (
    <div className="space-y-6">
      {/* Hero Score Card - ONLY large numeric score */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${getScoreBg(overallScore)} rounded-2xl p-8 shadow-sm border border-border/40`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-white/30 to-transparent rounded-bl-full" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          {/* Score Circle - THE ONLY large score */}
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-200"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${(overallScore / 100) * 352} 352`}
                strokeLinecap="round"
                className={getScoreColor(overallScore)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                {isLoading ? "..." : overallScore}
              </span>
            </div>
          </div>
          
          {/* Interpretation */}
          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-2">Overall Match Score</h2>
            <p className="text-muted-foreground text-lg">{getInterpretation()}</p>
          </div>
        </div>
      </div>
      
      {/* 3 Verdict Cards - LABELS ONLY, no numbers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Resume Strength */}
        <button 
          onClick={() => onNavigate("resume")}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200/50 hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${resumeVerdict.color}`}>
              {resumeVerdict.label}
            </span>
          </div>
          <h3 className="font-semibold text-foreground mb-1">Resume Strength</h3>
          <p className="text-sm text-muted-foreground">Clarity, impact & structure</p>
          <div className="mt-3 flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View details <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </button>
        
        {/* ATS Safety */}
        <button 
          onClick={() => onNavigate("ats")}
          className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200/50 hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Shield className="h-5 w-5 text-emerald-600" />
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${atsVerdictData.color}`}>
              {atsVerdictData.label}
            </span>
          </div>
          <h3 className="font-semibold text-foreground mb-1">ATS Safety</h3>
          <p className="text-sm text-muted-foreground">Will robots accept you?</p>
          <div className="mt-3 flex items-center text-emerald-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View details <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </button>
        
        {/* Job Fit */}
        <button 
          onClick={() => onNavigate("jdmatch")}
          className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-200/50 hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${jdVerdict.color}`}>
              {jdVerdict.label}
            </span>
          </div>
          <h3 className="font-semibold text-foreground mb-1">Job Fit</h3>
          <p className="text-sm text-muted-foreground">Fit for this specific role</p>
          <div className="mt-3 flex items-center text-purple-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View details <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </button>
      </div>
      
      {/* Roast Teaser - 2 lines max */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200/50">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Flame className="h-5 w-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">🔥 Roast Review</h3>
            {roastPreview ? (
              <p className="text-muted-foreground italic text-sm line-clamp-2">"{roastPreview}"</p>
            ) : (
              <p className="text-muted-foreground text-sm">Brutally honest feedback loading...</p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("roast")}
            className="shrink-0 gap-2 border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            See full roast <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Top 3 Actions */}
      {topActions.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-border/50 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Top 3 Actions to Improve Your Chances
          </h3>
          <div className="space-y-3">
            {topActions.slice(0, 3).map((action, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </span>
                <p className="text-foreground">{action}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* CTAs - Outcome-driven copy */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button 
          size="lg" 
          className="flex-1 gap-2"
          onClick={onUnlock}
        >
          <Lock className="h-4 w-4" />
          Unlock Resume Fixes for This Job
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="flex-1 gap-2"
          onClick={() => onNavigate("jdmatch")}
        >
          <Eye className="h-4 w-4" />
          See Why You Might Get Rejected
        </Button>
      </div>
    </div>
  );
};
