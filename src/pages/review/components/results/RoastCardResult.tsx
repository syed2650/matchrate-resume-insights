import { useState } from "react";
import { Flame, Twitter, Linkedin, Quote, AlertCircle, MessageCircle, Zap, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "../ui/CopyButton";
import { DownloadPDFButton } from "../ui/DownloadPDFButton";
import { stripMarkdown, stripMarkdownLine } from "../../utils/stripMarkdown";

interface RoastScores {
  formatting: number;
  clarity: number;
  impact: number;
  ats: number;
  overall: number;
}

interface RoastResult {
  roast: string;
  scores: RoastScores;
  shareText: string;
  shareUrl: string;
  rawContent?: string;
}

interface RoastCardResultProps {
  result: RoastResult;
}

export const RoastCardResult = ({ result }: RoastCardResultProps) => {
  const { roast, scores, shareText, shareUrl, rawContent } = result;
  const [showScores, setShowScores] = useState(false);
  
  // Clean roast text - remove markdown
  const cleanRoast = stripMarkdownLine(roast);
  
  // Parse sections from rawContent
  const parseWhySection = (content: string) => {
    const match = content.match(/Why Your Resume Looks Like This[\s\S]*?(?=###|📘|🧩|$)/i);
    if (match) {
      return stripMarkdown(match[0].replace(/^.*Why Your Resume Looks Like This[:\s]*/i, '').trim());
    }
    return null;
  };
  
  const parseTruthBombs = (content: string): string[] => {
    const match = content.match(/Truth Bombs[\s\S]*?(?=###|Fix Prescription|$)/i);
    if (match) {
      const text = match[0].replace(/^.*Truth Bombs[:\s]*/i, '').trim();
      const bullets = text.split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
        .slice(0, 3) // Exactly 3 truth bombs
        .map(line => stripMarkdownLine(line.replace(/^[-•]\s*/, '')));
      return bullets;
    }
    return [];
  };
  
  const parseFixPrescription = (content: string): string[] => {
    const match = content.match(/Fix Prescription[\s\S]*?(?=###|Scores|Share|$)/i);
    if (match) {
      const text = match[0].replace(/^.*Fix Prescription[:\s]*/i, '').trim();
      const bullets = text.split('\n')
        .filter(line => line.trim().match(/^[-•\d]/))
        .slice(0, 5) // Top 5 actions
        .map(line => stripMarkdownLine(line.replace(/^[-•\d.)\s]+/, '')));
      return bullets;
    }
    return [];
  };
  
  const whySection = rawContent ? parseWhySection(rawContent) : null;
  const truthBombs = rawContent ? parseTruthBombs(rawContent) : [];
  const fixPrescription = rawContent ? parseFixPrescription(rawContent) : [];
  
  const handleTwitterShare = () => {
    const text = encodeURIComponent(stripMarkdownLine(shareText) + (shareUrl ? '\n' + shareUrl : ''));
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };
  
  const handleLinkedInShare = () => {
    const url = encodeURIComponent(shareUrl || window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };
  
  // Clean content for export
  const cleanRawContent = rawContent ? stripMarkdown(rawContent) : '';
  const exportContent = cleanRawContent || cleanRoast;
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 rounded-2xl border-2 border-orange-300 shadow-lg">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-orange-200/30 to-transparent rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-red-200/30 to-transparent rounded-tr-full" />
      
      {/* Header */}
      <div className="relative bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 px-6 py-4">
        <div className="flex items-center gap-3 text-white">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <span className="font-bold text-xl">Roast Review</span>
            <p className="text-sm text-white/80">Brutally honest, professionally useful</p>
          </div>
        </div>
      </div>
      
      <div className="relative p-6 space-y-6">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <CopyButton text={cleanRoast} label="Copy Roast" />
          <DownloadPDFButton 
            content={exportContent} 
            filename="roast-review" 
            title="Roast Review" 
          />
        </div>
        
        {/* Main Roast - 2-3 lines max, speech bubble */}
        <div className="relative">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200/60 relative">
            <div className="absolute -top-4 left-6">
              <div className="bg-gradient-to-br from-orange-400 to-red-400 p-2 rounded-xl shadow-md">
                <Quote className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="text-lg font-medium text-foreground italic leading-relaxed pt-2 line-clamp-3">
              "{cleanRoast}"
            </p>
          </div>
          <div className="absolute -bottom-2 left-12 w-4 h-4 bg-white border-r border-b border-orange-200/60 transform rotate-45 shadow-sm"></div>
        </div>
        
        {/* Why it reads like this - 1 line */}
        {whySection && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200/60">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-800 line-clamp-1">{whySection}</p>
            </div>
          </div>
        )}
        
        {/* Truth Bombs - Exactly 3 bullets */}
        {truthBombs.length > 0 && (
          <div className="bg-white rounded-xl p-5 border border-orange-200/50 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="h-5 w-5 text-orange-600" />
              <h4 className="font-semibold text-foreground">Truth Bombs</h4>
            </div>
            <div className="space-y-2">
              {truthBombs.map((bomb, i) => (
                <div key={i} className="flex items-start gap-3 p-2 bg-orange-50/50 rounded-lg">
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-foreground">{bomb}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Fix Prescription - Top 5 prioritised actions */}
        {fixPrescription.length > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200/60 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-emerald-600" />
              <h4 className="font-semibold text-foreground">Fix Prescription</h4>
            </div>
            <div className="space-y-2">
              {fixPrescription.map((fix, i) => (
                <div key={i} className="flex items-start gap-3 p-2 bg-white/70 rounded-lg">
                  <span className="w-5 h-5 rounded border-2 border-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs text-emerald-600 font-bold">{i + 1}</span>
                  </span>
                  <p className="text-sm text-foreground">{fix}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Scores - Hidden by default behind toggle */}
        <div className="bg-white/60 rounded-xl border border-slate-200/60">
          <button
            onClick={() => setShowScores(!showScores)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50/50 transition-colors"
          >
            <span className="text-sm font-medium text-muted-foreground">Show score breakdown</span>
            {showScores ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>
          {showScores && (
            <div className="px-4 pb-4">
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(scores).map(([key, value]) => (
                  <div key={key} className="text-center p-2 bg-slate-50 rounded-lg">
                    <div className={`text-lg font-bold ${value >= 70 ? 'text-emerald-600' : value >= 45 ? 'text-amber-600' : 'text-red-600'}`}>
                      {value}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">{key}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Social Share */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-orange-200/60">
          <span className="text-sm text-muted-foreground font-medium">Share your roast:</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleTwitterShare}
            className="gap-2 border-sky-300 text-sky-600 hover:bg-sky-50 hover:border-sky-400"
          >
            <Twitter className="h-4 w-4" />
            Twitter
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLinkedInShare}
            className="gap-2 border-blue-400 text-blue-700 hover:bg-blue-50 hover:border-blue-500"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </Button>
        </div>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button className="flex-1 gap-2">
            Apply These Fixes & Recheck Match
            <ArrowRight className="h-4 w-4" />
          </Button>
          <DownloadPDFButton 
            content={exportContent} 
            filename="roast-review" 
            title="Roast Review"
            buttonText="Download Roast PDF"
            variant="outline"
          />
        </div>
      </div>
    </div>
  );
};
