import { useState } from "react";
import { Flame, RefreshCw, Share2, Twitter, Linkedin, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { track } from "@/lib/mixpanel";

interface ResumeRoastLinesProps {
  roastLines: string[];
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

const FALLBACK_ROASTS = [
  "Your resume says 'hardworking'… so does everyone else bro 💀",
  "This resume has more buzzwords than actual impact",
  "Recruiters read this and feel nothing",
  "You managed a team… of what? Vibes?",
  "This bullet point means nothing and you know it",
];

export const ResumeRoastLines = ({ roastLines, onRegenerate, isRegenerating }: ResumeRoastLinesProps) => {
  const [copied, setCopied] = useState(false);
  const lines = roastLines.length > 0 ? roastLines.slice(0, 5) : FALLBACK_ROASTS;

  const handleCopy = () => {
    const text = lines.join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    track("Roast Lines Copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = encodeURIComponent(
    `My resume just got roasted 🔥\n\n"${lines[0]}"\n\nGet yours roasted at matchrate.co`
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-orange-400/40 shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
              <Flame className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight">Resume Roast</h3>
              <p className="text-white/70 text-sm">Brutally honest. Painfully accurate.</p>
            </div>
          </div>
          {onRegenerate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="text-white hover:bg-white/20 gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", isRegenerating && "animate-spin")} />
              New Roast
            </Button>
          )}
        </div>
      </div>

      {/* Roast Lines - Meme Style */}
      <div className="bg-gradient-to-b from-slate-950 to-slate-900 p-6 space-y-4">
        {lines.map((line, i) => (
          <div
            key={i}
            className="relative bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 group hover:border-orange-500/40 transition-all"
          >
            <div className="absolute -top-3 -left-1 text-3xl">💀</div>
            <p className="text-white text-lg font-bold leading-relaxed pl-6">
              "{line}"
            </p>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-slate-500">#{i + 1}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="bg-slate-950 px-6 py-4 flex flex-wrap gap-3 border-t border-slate-800">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy All"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            track("Roast Shared", { platform: "twitter" });
            window.open(`https://twitter.com/intent/tweet?text=${shareText}`, "_blank");
          }}
          className="gap-2 border-sky-800 text-sky-400 hover:bg-sky-950"
        >
          <Twitter className="h-4 w-4" />
          Share Roast
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            track("Roast Shared", { platform: "linkedin" });
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://matchrate.co")}`, "_blank");
          }}
          className="gap-2 border-blue-800 text-blue-400 hover:bg-blue-950"
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </Button>
      </div>
    </div>
  );
};
