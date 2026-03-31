import { AlertTriangle, XCircle, AlertCircle, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { track } from "@/lib/mixpanel";

type Severity = "high" | "medium" | "low";

interface RejectionReason {
  reason: string;
  detail: string;
  severity: Severity;
}

interface RejectionInsightReportProps {
  missingKeywords?: string[];
  atsScore?: number;
  jdMatchScore?: number;
  weakBullets?: { original: string; improved: string }[];
  issues?: string[];
  onFix?: (index: number) => void;
  onNavigate?: (tab: string) => void;
}

const severityConfig = {
  high: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700",
    label: "High Risk",
  },
  medium: {
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    label: "Medium Risk",
  },
  low: {
    icon: AlertCircle,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    label: "Low Risk",
  },
};

export const RejectionInsightReport = ({
  missingKeywords = [],
  atsScore = 50,
  jdMatchScore = 50,
  weakBullets = [],
  issues = [],
  onFix,
  onNavigate,
}: RejectionInsightReportProps) => {
  // Build rejection reasons dynamically from actual data
  const reasons: RejectionReason[] = [];

  if (missingKeywords.length >= 5) {
    reasons.push({
      reason: `Keyword mismatch: Missing ${missingKeywords.length} critical terms`,
      detail: `Your resume is missing: ${missingKeywords.slice(0, 5).join(", ")}${missingKeywords.length > 5 ? "…" : ""}`,
      severity: "high",
    });
  } else if (missingKeywords.length > 0) {
    reasons.push({
      reason: `Missing ${missingKeywords.length} keywords from job description`,
      detail: `Add these terms: ${missingKeywords.join(", ")}`,
      severity: "medium",
    });
  }

  if (atsScore < 50) {
    reasons.push({
      reason: "Your resume is invisible to ATS systems",
      detail: "ATS software will likely reject this before a recruiter sees it. Critical formatting or keyword issues detected.",
      severity: "high",
    });
  } else if (atsScore < 70) {
    reasons.push({
      reason: "ATS compatibility needs improvement",
      detail: "Some ATS systems may struggle to parse your resume correctly, reducing your chances.",
      severity: "medium",
    });
  }

  if (weakBullets.length >= 3) {
    reasons.push({
      reason: `Weak impact: ${weakBullets.length} bullets lack measurable achievements`,
      detail: "Recruiters scan for numbers and results. Your bullets read like job descriptions, not accomplishments.",
      severity: "high",
    });
  } else if (weakBullets.length > 0) {
    reasons.push({
      reason: `${weakBullets.length} bullet points need stronger impact`,
      detail: "Add metrics, outcomes, or specific results to make these stand out.",
      severity: "medium",
    });
  }

  if (jdMatchScore < 50) {
    reasons.push({
      reason: "Poor alignment with job requirements",
      detail: "Your experience doesn't clearly map to what this role needs. Restructure to highlight relevant skills.",
      severity: "high",
    });
  } else if (jdMatchScore < 70) {
    reasons.push({
      reason: "Partial job fit — gaps in key areas",
      detail: "You match some requirements but miss others. Targeted adjustments can close the gap.",
      severity: "medium",
    });
  }

  issues.slice(0, 2).forEach((issue) => {
    reasons.push({
      reason: issue,
      detail: "Detected during ATS analysis. Fix this to improve your pass rate.",
      severity: "medium",
    });
  });

  // Cap at 5 and sort by severity
  const sortedReasons = reasons
    .slice(0, 5)
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.severity] - order[b.severity];
    });

  const highCount = sortedReasons.filter((r) => r.severity === "high").length;

  return (
    <div className="rounded-2xl border border-border/60 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 px-6 py-5">
        <div className="flex items-center gap-3 text-white">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Why You're Getting Rejected</h3>
            <p className="text-white/70 text-sm">
              {highCount > 0
                ? `${highCount} critical issue${highCount > 1 ? "s" : ""} found`
                : "Areas to address for better results"}
            </p>
          </div>
        </div>
      </div>

      {/* Reasons */}
      <div className="bg-card p-4 space-y-3">
        {sortedReasons.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No major rejection risks found. Your resume is in good shape!</p>
          </div>
        ) : (
          sortedReasons.map((item, i) => {
            const config = severityConfig[item.severity];
            const Icon = config.icon;
            return (
              <div
                key={i}
                className={cn(
                  "rounded-xl p-4 border transition-all hover:shadow-md",
                  config.bg,
                  config.border
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", config.color)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-semibold text-foreground text-sm">{item.reason}</h4>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", config.badge)}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                  {onNavigate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        track("Rejection Fix Clicked", { reason: item.reason });
                        onNavigate("resume");
                      }}
                      className="shrink-0 gap-1 text-xs"
                    >
                      Fix <ChevronRight className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CTA */}
      {sortedReasons.length > 0 && onNavigate && (
        <div className="bg-card px-6 py-4 border-t border-border/40">
          <Button
            onClick={() => {
              track("Fix All Rejections Clicked");
              onNavigate("resume");
            }}
            className="w-full gap-2"
            size="lg"
          >
            <Zap className="h-4 w-4" />
            Fix All Issues & Recheck
          </Button>
        </div>
      )}
    </div>
  );
};
