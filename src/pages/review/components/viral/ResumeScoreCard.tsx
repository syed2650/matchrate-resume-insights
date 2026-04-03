import { useState } from "react";
import { Download, Linkedin, Twitter, TrendingDown, TrendingUp, Skull, Trophy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { track } from "@/lib/mixpanel";

interface ResumeScoreCardProps {
  score: number;
  atsScore?: number;
  jdMatchScore?: number;
  roleLabel?: string;
}

const getPercentile = (score: number) => {
  if (score >= 90) return { rank: "Top 5%", worse: 95, isTop: true };
  if (score >= 80) return { rank: "Top 20%", worse: 80, isTop: true };
  if (score >= 70) return { rank: "Top 35%", worse: 65, isTop: true };
  if (score >= 60) return { rank: "Bottom 40%", worse: 60, isTop: false };
  if (score >= 50) return { rank: "Bottom 50%", worse: 50, isTop: false };
  return { rank: "Bottom 63%", worse: 37, isTop: false };
};

const getEmotionalHeadline = (score: number) => {
  if (score < 60) return "This resume is getting filtered out before recruiters even see it.";
  if (score <= 80) return "You're losing interviews due to weak optimization.";
  return "Strong resume — but top candidates still outperform you.";
};

const getInsight = (score: number) => {
  if (score < 40) return {
    icon: Skull,
    gradient: "from-red-600 to-rose-700",
    bg: "from-[#1a0a0a] via-[#1a0505] to-[#0a0a14]",
    glowColor: "rgba(239,68,68,0.15)",
  };
  if (score < 60) return {
    icon: TrendingDown,
    gradient: "from-red-500 to-orange-600",
    bg: "from-[#1a0a0a] via-[#1a0808] to-[#0a0a14]",
    glowColor: "rgba(239,68,68,0.1)",
  };
  if (score < 80) return {
    icon: TrendingUp,
    gradient: "from-amber-500 to-orange-500",
    bg: "from-[#1a1508] via-[#1a1005] to-[#0a0a14]",
    glowColor: "rgba(245,158,11,0.1)",
  };
  return {
    icon: Trophy,
    gradient: "from-emerald-500 to-teal-500",
    bg: "from-[#0a1a12] via-[#081510] to-[#0a0a14]",
    glowColor: "rgba(16,185,129,0.1)",
  };
};

export const ResumeScoreCard = ({ score, atsScore, jdMatchScore, roleLabel }: ResumeScoreCardProps) => {
  const percentile = getPercentile(score);
  const headline = getEmotionalHeadline(score);
  const insight = getInsight(score);
  const InsightIcon = insight.icon;

  const comparisonText = percentile.isTop
    ? `You're better than ${percentile.worse}% of applicants`
    : `You are behind ${percentile.worse}% of applicants`;

  const topCandidateText = score < 80
    ? `Top candidates score 80+ — you're not there yet.`
    : `You're ahead of most — fine-tune to dominate.`;

  const shareCaption = score < 60
    ? `Only ${score}% ATS score… no wonder I get rejected 😭`
    : score < 80
    ? `I thought my resume was good… turns out I was wrong 😭`
    : `My resume scored ${score}/100! 💪 Check yours →`;

  const shareText = encodeURIComponent(
    `${shareCaption}\n\nCheck yours at matchrate.co`
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
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, 1080, 1080);

    const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
    grad.addColorStop(0, score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444");
    grad.addColorStop(1, "#1e1b4b");
    ctx.fillStyle = grad;
    ctx.globalAlpha = 0.15;
    ctx.fillRect(0, 0, 1080, 1080);
    ctx.globalAlpha = 1;

    ctx.fillStyle = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
    ctx.font = "bold 220px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${score}`, 540, 440);

    ctx.fillStyle = "#64748b";
    ctx.font = "bold 48px sans-serif";
    ctx.fillText("/100", 540, 510);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 36px sans-serif";
    ctx.fillText(comparisonText, 540, 600);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "24px sans-serif";
    ctx.fillText(headline, 540, 700);

    ctx.fillStyle = "#7c3aed";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText("matchrate.co", 540, 1020);

    const link = document.createElement("a");
    link.download = "resume-score-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Main Score Card — Spotify Wrapped style */}
      <div className={cn(
        "relative overflow-hidden rounded-2xl shadow-2xl border border-white/10",
        `bg-gradient-to-br ${insight.bg}`
      )}>
        {/* Decorative glows */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br from-white/5 to-transparent" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-white/5 to-transparent" />

        <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 text-center space-y-6">
          {/* Role label */}
          {roleLabel && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-slate-300 border border-white/10">
              {roleLabel} Resume Score
            </div>
          )}

          {/* Giant Score */}
          <div>
            <span className={cn(
              "text-[9rem] sm:text-[10rem] leading-none font-black tracking-tight bg-gradient-to-b bg-clip-text text-transparent",
              `${insight.gradient}`
            )}>
              {score}
            </span>
            <span className="text-4xl sm:text-5xl text-slate-500 font-bold">/100</span>
          </div>

          {/* Emotional headline */}
          <p className="text-xl sm:text-2xl text-white font-bold max-w-lg mx-auto leading-snug">
            {headline}
          </p>

          {/* Comparison badge */}
          <div className={cn(
            "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold",
            percentile.isTop
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          )}>
            <InsightIcon className="h-4 w-4" />
            {comparisonText}
          </div>

          {/* Top candidate comparison */}
          <p className="text-sm text-slate-400 font-medium">
            {topCandidateText}
          </p>

          {/* 6-second line */}
          <p className="text-xs text-slate-500 italic">
            Most recruiters spend less than 6 seconds on a resume.
          </p>

          {/* Mini stats */}
          {(atsScore !== undefined || jdMatchScore !== undefined) && (
            <div className="flex justify-center gap-8 pt-2">
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

          {/* PROMINENT Share Buttons */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Button
              onClick={() => handleShare("linkedin")}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Linkedin className="h-4 w-4" />
              Share on LinkedIn
            </Button>
            <Button
              onClick={() => handleShare("twitter")}
              className="gap-2 bg-sky-500 hover:bg-sky-600 text-white"
              size="lg"
            >
              <Twitter className="h-4 w-4" />
              Share on Twitter
            </Button>
            <Button
              variant="outline"
              onClick={handleDownload}
              className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-800"
              size="lg"
            >
              <Download className="h-4 w-4" />
              Download Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
