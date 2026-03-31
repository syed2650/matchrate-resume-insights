import { useState } from "react";
import { Download, Linkedin, Twitter, TrendingDown, TrendingUp, Skull, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { track } from "@/lib/mixpanel";

interface ResumeScoreCardProps {
  score: number;
  atsScore?: number;
  jdMatchScore?: number;
}

const getPercentile = (score: number) => {
  if (score >= 90) return { rank: "Top 5%", isTop: true };
  if (score >= 80) return { rank: "Top 20%", isTop: true };
  if (score >= 70) return { rank: "Top 35%", isTop: true };
  if (score >= 60) return { rank: "Bottom 40%", isTop: false };
  if (score >= 50) return { rank: "Bottom 50%", isTop: false };
  return { rank: "Bottom 63%", isTop: false };
};

const getBrutalInsight = (score: number) => {
  if (score < 40) return {
    text: "This resume will get auto-rejected before a human ever sees it.",
    icon: Skull,
    gradient: "from-red-600 to-rose-700",
    bg: "from-red-950 to-slate-950",
  };
  if (score < 60) return {
    text: "This resume will likely get rejected before a human sees it.",
    icon: TrendingDown,
    gradient: "from-red-500 to-orange-600",
    bg: "from-red-950 to-slate-950",
  };
  if (score < 80) return {
    text: "Decent, but you're losing interviews due to weak optimization.",
    icon: TrendingUp,
    gradient: "from-amber-500 to-orange-500",
    bg: "from-amber-950 to-slate-950",
  };
  return {
    text: "Strong resume, but still missing competitive edge against top applicants.",
    icon: Trophy,
    gradient: "from-emerald-500 to-teal-500",
    bg: "from-emerald-950 to-slate-950",
  };
};

export const ResumeScoreCard = ({ score, atsScore, jdMatchScore }: ResumeScoreCardProps) => {
  const [showShareCard, setShowShareCard] = useState(false);
  const percentile = getPercentile(score);
  const insight = getBrutalInsight(score);
  const InsightIcon = insight.icon;

  const shareText = encodeURIComponent(
    `I thought my resume was good… I was wrong. 💀\nMy resume score: ${score}/100 (${percentile.rank})\n\nCheck yours at matchrate.co`
  );

  const handleShare = (platform: "twitter" | "linkedin") => {
    track("Score Card Shared", { platform, score });
    if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${shareText}`, "_blank");
    } else {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://matchrate.co")}`, "_blank");
    }
  };

  const handleDownload = async () => {
    track("Score Card Downloaded", { score });
    // Create a canvas-based image for download
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dark background
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, 1080, 1080);

    // Gradient accent
    const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
    grad.addColorStop(0, score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444");
    grad.addColorStop(1, "#1e1b4b");
    ctx.fillStyle = grad;
    ctx.globalAlpha = 0.15;
    ctx.fillRect(0, 0, 1080, 1080);
    ctx.globalAlpha = 1;

    // Score
    ctx.fillStyle = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
    ctx.font = "bold 220px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${score}`, 540, 440);

    // /100
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 48px 'Space Grotesk', sans-serif";
    ctx.fillText("/100", 540, 510);

    // Percentile
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 36px 'Satoshi', sans-serif";
    ctx.fillText(percentile.rank + " of applicants", 540, 600);

    // Tagline
    ctx.fillStyle = "#94a3b8";
    ctx.font = "24px 'Satoshi', sans-serif";
    ctx.fillText("I thought my resume was good… I was wrong.", 540, 700);

    // Branding
    ctx.fillStyle = "#7c3aed";
    ctx.font = "bold 28px 'Space Grotesk', sans-serif";
    ctx.fillText("matchrate.co", 540, 1020);

    const link = document.createElement("a");
    link.download = "resume-score-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Main Score Card */}
      <div className={cn(
        "relative overflow-hidden rounded-2xl p-8 shadow-2xl border border-white/10",
        `bg-gradient-to-br ${insight.bg}`
      )}>
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br from-white/5 to-transparent" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-white/5 to-transparent" />

        <div className="relative z-10 text-center space-y-6">
          {/* Badge */}
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold",
            percentile.isTop
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          )}>
            <InsightIcon className="h-4 w-4" />
            {percentile.rank} of applicants
          </div>

          {/* Giant Score */}
          <div>
            <span className={cn(
              "text-[8rem] leading-none font-black tracking-tight bg-gradient-to-b bg-clip-text text-transparent",
              `${insight.gradient}`
            )}>
              {score}
            </span>
            <span className="text-4xl text-slate-500 font-bold">/100</span>
          </div>

          {/* Brutal insight */}
          <p className="text-lg text-slate-300 max-w-md mx-auto font-medium">
            {insight.text}
          </p>

          {/* Mini stats */}
          {(atsScore !== undefined || jdMatchScore !== undefined) && (
            <div className="flex justify-center gap-6 pt-2">
              {atsScore !== undefined && (
                <div className="text-center">
                  <div className={cn("text-2xl font-bold", atsScore >= 70 ? "text-emerald-400" : atsScore >= 45 ? "text-amber-400" : "text-red-400")}>
                    {atsScore}%
                  </div>
                  <div className="text-xs text-slate-500">ATS Safe</div>
                </div>
              )}
              {jdMatchScore !== undefined && (
                <div className="text-center">
                  <div className={cn("text-2xl font-bold", jdMatchScore >= 70 ? "text-emerald-400" : jdMatchScore >= 45 ? "text-amber-400" : "text-red-400")}>
                    {jdMatchScore}%
                  </div>
                  <div className="text-xs text-slate-500">Job Fit</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Share Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare("linkedin")}
          className="gap-2 border-blue-400/50 text-blue-600 hover:bg-blue-50"
        >
          <Linkedin className="h-4 w-4" />
          Share on LinkedIn
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare("twitter")}
          className="gap-2 border-sky-400/50 text-sky-600 hover:bg-sky-50"
        >
          <Twitter className="h-4 w-4" />
          Share on Twitter
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Download Image
        </Button>
      </div>
    </div>
  );
};
