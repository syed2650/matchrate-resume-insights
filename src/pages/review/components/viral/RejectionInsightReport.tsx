import { AlertTriangle, XCircle, AlertCircle, Zap, ChevronRight, Linkedin, Download } from "lucide-react";
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
  const reasons: RejectionReason[] = [];

  if (missingKeywords.length >= 5) {
    reasons.push({
      reason: `You're missing ${missingKeywords.length} keywords recruiters are filtering for`,
      detail: `Your resume never shows up because it's missing: ${missingKeywords.slice(0, 5).join(", ")}${missingKeywords.length > 5 ? "…" : ""}`,
      severity: "high",
    });
  } else if (missingKeywords.length > 0) {
    reasons.push({
      reason: `Missing ${missingKeywords.length} keywords recruiters are filtering for`,
      detail: `Your resume won't show up without these: ${missingKeywords.join(", ")}`,
      severity: "medium",
    });
  }

  if (atsScore < 50) {
    reasons.push({
      reason: "Your resume is invisible to ATS systems",
      detail: "ATS software will auto-reject this before any recruiter sees it. You're applying into a black hole.",
      severity: "high",
    });
  } else if (atsScore < 70) {
    reasons.push({
      reason: "ATS compatibility is hurting your chances",
      detail: "Some ATS systems will struggle to parse your resume — meaning fewer humans will ever read it.",
      severity: "medium",
    });
  }

  if (weakBullets.length >= 3) {
    reasons.push({
      reason: `Your bullets sound busy — not impactful`,
      detail: "Recruiters want results, not responsibilities. Your bullets read like a job description, not proof of what you achieved.",
      severity: "high",
    });
  } else if (weakBullets.length > 0) {
    reasons.push({
      reason: `${weakBullets.length} bullet points lack real impact`,
      detail: "Add metrics, outcomes, or specific results. Without proof, recruiters won't believe the claims.",
      severity: "medium",
    });
  }

  if (jdMatchScore < 50) {
    reasons.push({
      reason: "Your resume doesn't match what this role needs",
      detail: "Your experience doesn't clearly map to the job requirements. This is why you're getting filtered out.",
      severity: "high",
    });
  } else if (jdMatchScore < 70) {
    reasons.push({
      reason: "Partial job fit — you're close but not close enough",
      detail: "You match some requirements but miss others. Recruiters pick the candidates who tick every box.",
      severity: "medium",
    });
  }

  issues.slice(0, 2).forEach((issue) => {
    reasons.push({
      reason: issue,
      detail: "Detected during ATS analysis. This is actively reducing your pass rate.",
      severity: "medium",
    });
  });

  const sortedReasons = reasons
    .slice(0, 5)
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.severity] - order[b.severity];
    });

  const highCount = sortedReasons.filter((r) => r.severity === "high").length;

  const shareText = encodeURIComponent(
    `My resume has ${highCount} critical issues holding me back 😭\n\nAI just roasted my resume. Fair enough.\n\nFind out why you're not getting interviews → matchrate.co`
  );

  return (
    <div className="rounded-2xl border border-border/60 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 px-6 py-5">
        <div className="flex items-center gap-3 text-white">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Why You're Not Getting Interviews</h3>
            <p className="text-white/80 text-sm font-medium">
              These issues are actively hurting your chances.
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
                      Fix this <ChevronRight className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {sortedReasons.length > 0 && (
        <div className="bg-card px-6 py-4 border-t border-border/40 flex flex-wrap gap-3">
          {onNavigate && (
            <Button
              onClick={() => {
                track("Fix All Rejections Clicked");
                onNavigate("resume");
              }}
              className="gap-2 flex-1"
              size="lg"
            >
              <Zap className="h-4 w-4" />
              Fix All Issues
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              track("Rejection Report Shared", { platform: "linkedin" });
              window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://matchrate.co")}`, "_blank");
            }}
            className="gap-2"
          >
            <Linkedin className="h-4 w-4" />
            Share
          </Button>
        </div>
      )}
    </div>
  );
};
