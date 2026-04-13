import { ArrowRight, Sparkles, TrendingUp, Linkedin, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { track } from "@/lib/mixpanel";

interface BulletTransform {
  original: string;
  improved: string;
  highlights?: string[];
}

interface BeforeAfterComparisonProps {
  bullets: BulletTransform[];
  onOptimize?: () => void;
}

export const BeforeAfterComparison = ({ bullets, onOptimize }: BeforeAfterComparisonProps) => {
  const displayBullets = bullets.slice(0, 5);

  if (displayBullets.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border/50 overflow-hidden shadow-lg bg-card">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 px-6 py-5">
        <div className="flex items-center gap-3 text-white">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">This is how top candidates write their resumes</h3>
            <p className="text-white/80 text-sm font-medium">Same experience. Better positioning. More interviews.</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {displayBullets.map((bullet, i) => (
          <div key={i} className="rounded-xl border border-border/40 overflow-hidden">
            {/* Before */}
            <div className="bg-red-50/80 p-4 border-b border-red-200/40">
              <div className="flex items-start gap-3">
                <span className="shrink-0 mt-1 w-6 h-6 rounded bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">
                  ✗
                </span>
                <div>
                  <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">Before</p>
                  <p className="text-sm text-foreground/80 line-through decoration-red-300">
                    {bullet.original}
                  </p>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center -my-3 relative z-10">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <ArrowRight className="h-4 w-4 rotate-90" />
              </div>
            </div>

            {/* After */}
            <div className="bg-emerald-50/80 p-4">
              <div className="flex items-start gap-3">
                <span className="shrink-0 mt-1 w-6 h-6 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
                <div>
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">After</p>
                  <p className="text-sm text-foreground font-medium">
                    {bullet.improved}
                  </p>
                  {bullet.highlights && bullet.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {bullet.highlights.map((h, j) => (
                        <span key={j} className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">
                          +{h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="flex flex-wrap gap-3 pt-2">
          {onOptimize && (
            <Button
              onClick={() => {
                track("Before After CTA Clicked");
                onOptimize();
              }}
              className="flex-1 gap-2"
              size="lg"
            >
              <Sparkles className="h-4 w-4" />
              Your resume can look like this
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              track("Before After Shared");
              window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://matchrate.co")}`, "_blank");
            }}
            className="gap-2"
          >
            <Linkedin className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};
