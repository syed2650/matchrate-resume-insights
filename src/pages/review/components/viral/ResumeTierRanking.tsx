import { Crown, Star, TrendingUp, User, Download, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { track } from "@/lib/mixpanel";

interface ResumeTierRankingProps {
  score: number;
}

interface TierInfo {
  name: string;
  emoji: string;
  color: string;
  textColor: string;
  borderColor: string;
  gradientBg: string;
  icon: typeof Crown;
  description: string;
  percentile: string;
  badgeBg: string;
}

const tiers: Record<string, TierInfo> = {
  elite: {
    name: "Top 10% Candidate",
    emoji: "🟪",
    color: "from-violet-600 to-purple-700",
    textColor: "text-violet-400",
    borderColor: "border-violet-500/50",
    gradientBg: "from-violet-950 via-purple-950 to-slate-950",
    icon: Crown,
    description: "Recruiters will fight over this resume. You're in the elite tier — but staying here requires constant optimization.",
    percentile: "Top 10%",
    badgeBg: "bg-gradient-to-r from-violet-500 to-purple-600",
  },
  strong: {
    name: "Competitive Candidate",
    emoji: "🟩",
    color: "from-emerald-500 to-teal-600",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/50",
    gradientBg: "from-emerald-950 via-teal-950 to-slate-950",
    icon: Star,
    description: "You'll get interviews, but you're not winning them all. A few targeted fixes could push you into the elite tier.",
    percentile: "Top 30%",
    badgeBg: "bg-gradient-to-r from-emerald-500 to-teal-600",
  },
  average: {
    name: "Blending Into The Crowd",
    emoji: "🟧",
    color: "from-amber-500 to-orange-600",
    textColor: "text-amber-400",
    borderColor: "border-amber-500/50",
    gradientBg: "from-amber-950 via-orange-950 to-slate-950",
    icon: TrendingUp,
    description: "Recruiters won't remember this resume. You look like every other applicant — and that's the problem.",
    percentile: "Middle 40%",
    badgeBg: "bg-gradient-to-r from-amber-500 to-orange-600",
  },
  beginner: {
    name: "Invisible Candidate",
    emoji: "🟥",
    color: "from-red-500 to-rose-600",
    textColor: "text-red-400",
    borderColor: "border-red-500/50",
    gradientBg: "from-red-950 via-rose-950 to-slate-950",
    icon: User,
    description: "This resume is invisible to ATS and recruiters. It's getting auto-rejected before anyone reads it.",
    percentile: "Bottom 50%",
    badgeBg: "bg-gradient-to-r from-red-500 to-rose-600",
  },
};

const getTier = (score: number): TierInfo => {
  if (score >= 85) return tiers.elite;
  if (score >= 70) return tiers.strong;
  if (score >= 50) return tiers.average;
  return tiers.beginner;
};

export const ResumeTierRanking = ({ score }: ResumeTierRankingProps) => {
  const tier = getTier(score);
  const TierIcon = tier.icon;

  const shareText = encodeURIComponent(
    `${tier.emoji} I'm ranked "${tier.name}" on Matchrate!\n\nMy resume tier: ${tier.percentile}\n\nFind your tier → matchrate.co`
  );

  const handleDownloadBadge = () => {
    track("Tier Badge Downloaded", { tier: tier.name, score });
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0a0a14";
    ctx.fillRect(0, 0, 800, 800);

    const glow = ctx.createRadialGradient(400, 350, 50, 400, 350, 350);
    const glowColor = score >= 85 ? "#7c3aed" : score >= 70 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
    glow.addColorStop(0, glowColor + "40");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 800, 800);

    ctx.beginPath();
    ctx.arc(400, 300, 120, 0, Math.PI * 2);
    ctx.fillStyle = glowColor + "30";
    ctx.fill();
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = glowColor;
    ctx.font = "bold 80px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${score}`, 400, 325);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 44px sans-serif";
    ctx.fillText(tier.name, 400, 510);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "28px sans-serif";
    ctx.fillText(tier.percentile, 400, 565);

    ctx.fillStyle = "#64748b";
    ctx.font = "20px sans-serif";
    const words = tier.description.split(" ");
    let line = "";
    let y = 630;
    words.forEach((word) => {
      const test = line + word + " ";
      if (ctx.measureText(test).width > 600) {
        ctx.fillText(line.trim(), 400, y);
        line = word + " ";
        y += 30;
      } else {
        line = test;
      }
    });
    ctx.fillText(line.trim(), 400, y);

    ctx.fillStyle = "#7c3aed";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("matchrate.co", 400, 760);

    const link = document.createElement("a");
    link.download = `resume-tier-${tier.name.toLowerCase().replace(/ /g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className={cn(
        "relative overflow-hidden rounded-2xl border shadow-2xl",
        tier.borderColor,
        `bg-gradient-to-br ${tier.gradientBg}`
      )}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full" />

        <div className="relative p-8 text-center space-y-5">
          {/* Badge */}
          <div className={cn("inline-flex items-center justify-center w-20 h-20 rounded-full shadow-lg", tier.badgeBg)}>
            <TierIcon className="h-10 w-10 text-white" />
          </div>

          {/* Tier Name */}
          <div>
            <h3 className={cn("text-2xl sm:text-3xl font-black tracking-tight", tier.textColor)}>
              {tier.name}
            </h3>
            <p className="text-slate-400 text-base font-medium mt-1">{tier.percentile}</p>
          </div>

          {/* Description */}
          <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            {tier.description}
          </p>

          {/* All tiers preview */}
          <div className="flex justify-center gap-3 pt-1">
            {Object.entries(tiers).map(([key, t]) => (
              <div
                key={key}
                className={cn(
                  "w-3 h-3 rounded-full transition-all",
                  t.name === tier.name ? "scale-150 ring-2 ring-white/30" : "opacity-40"
                )}
                style={{
                  background: key === "elite" ? "#7c3aed" : key === "strong" ? "#10b981" : key === "average" ? "#f59e0b" : "#ef4444",
                }}
                title={t.name}
              />
            ))}
          </div>

          {/* Share buttons inside the card */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadBadge}
              className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <Download className="h-4 w-4" />
              Download Badge
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                track("Tier Shared", { platform: "twitter", tier: tier.name });
                window.open(`https://twitter.com/intent/tweet?text=${shareText}`, "_blank");
              }}
              className="gap-2 border-sky-700 text-sky-400 hover:bg-sky-950"
            >
              <Twitter className="h-4 w-4" />
              Share Tier
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                track("Tier Shared", { platform: "linkedin", tier: tier.name });
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://matchrate.co")}`, "_blank");
              }}
              className="gap-2 border-blue-700 text-blue-400 hover:bg-blue-950"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
