import { Flame, Twitter, Linkedin, Quote, Trophy, TrendingDown, AlertCircle, MessageCircle } from "lucide-react";
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
  
  // Clean roast text - remove markdown
  const cleanRoast = stripMarkdownLine(roast);
  
  // Parse additional sections from rawContent (clean version)
  const parseWhySection = (content: string) => {
    const match = content.match(/Why Your Resume Looks Like This[\s\S]*?(?=###|📘|🧩|$)/i);
    if (match) {
      return stripMarkdown(match[0].replace(/^.*Why Your Resume Looks Like This[:\s]*/i, '').trim());
    }
    return null;
  };
  
  const parseWhatSection = (content: string) => {
    const match = content.match(/What This Says About You[\s\S]*?(?=###|📘|$)/i);
    if (match) {
      return stripMarkdown(match[0].replace(/^.*What This Says About You[:\s]*/i, '').trim());
    }
    return null;
  };
  
  const parseRealReview = (content: string) => {
    const match = content.match(/Real Review[\s\S]*?(?=###\s*Scores|$)/i);
    if (match) {
      return stripMarkdown(match[0].replace(/^.*Real Review[:\s]*/i, '').trim());
    }
    return null;
  };
  
  const whySection = rawContent ? parseWhySection(rawContent) : null;
  const whatSection = rawContent ? parseWhatSection(rawContent) : null;
  const realReview = rawContent ? parseRealReview(rawContent) : null;
  
  const getScoreConfig = (score: number) => {
    if (score >= 80) return { 
      bg: "bg-gradient-to-br from-emerald-50 to-green-50", 
      border: "border-emerald-300",
      text: "text-emerald-600",
      icon: <Trophy className="h-3 w-3" />
    };
    if (score >= 60) return { 
      bg: "bg-gradient-to-br from-amber-50 to-yellow-50", 
      border: "border-amber-300",
      text: "text-amber-600",
      icon: <TrendingDown className="h-3 w-3" />
    };
    return { 
      bg: "bg-gradient-to-br from-rose-50 to-red-50", 
      border: "border-rose-300",
      text: "text-rose-600",
      icon: <AlertCircle className="h-3 w-3" />
    };
  };
  
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
  const exportContent = cleanRawContent || `${cleanRoast}\n\nScores:\nFormatting: ${scores.formatting}\nClarity: ${scores.clarity}\nImpact: ${scores.impact}\nATS: ${scores.ats}\nOverall: ${scores.overall}`;
  
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
            <span className="font-bold text-xl">Resume Roast</span>
            <p className="text-sm text-white/80">Brutally honest feedback</p>
          </div>
        </div>
      </div>
      
      <div className="relative p-6 space-y-6">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <CopyButton text={cleanRoast} label="Copy Roast" />
          <CopyButton text={exportContent} label="Copy All" />
          <DownloadPDFButton 
            content={exportContent} 
            filename="resume-roast" 
            title="Resume Roast Card" 
          />
        </div>
        
        {/* Main Roast - Premium Speech Bubble */}
        <div className="relative">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200/60 relative">
            <div className="absolute -top-4 left-6">
              <div className="bg-gradient-to-br from-orange-400 to-red-400 p-2 rounded-xl shadow-md">
                <Quote className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="text-lg font-medium text-foreground italic leading-relaxed pt-2">
              "{cleanRoast}"
            </p>
          </div>
          {/* Speech bubble tail */}
          <div className="absolute -bottom-2 left-12 w-4 h-4 bg-white border-r border-b border-orange-200/60 transform rotate-45 shadow-sm"></div>
        </div>
        
        {/* Why Section */}
        {whySection && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <h4 className="font-semibold text-amber-900">Why Your Resume Looks Like This</h4>
            </div>
            <p className="text-sm text-amber-800 leading-relaxed pl-12">{whySection}</p>
          </div>
        )}
        
        {/* What Section */}
        {whatSection && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-5 border border-orange-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <MessageCircle className="h-5 w-5 text-orange-600" />
              </div>
              <h4 className="font-semibold text-orange-900">What This Says About You</h4>
            </div>
            <p className="text-sm text-orange-800 leading-relaxed pl-12">{whatSection}</p>
          </div>
        )}
        
        {/* Real Review */}
        {realReview && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-slate-100 rounded-xl">
                <Quote className="h-5 w-5 text-slate-600" />
              </div>
              <h4 className="font-semibold text-foreground">Real Review</h4>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed pl-12">
              {realReview.split('\n').map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return null;
                if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
                  return (
                    <div key={i} className="flex gap-3 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0"></span>
                      <span>{trimmed.replace(/^[-•]\s*/, '')}</span>
                    </div>
                  );
                }
                return <p key={i} className="py-0.5">{trimmed}</p>;
              })}
            </div>
          </div>
        )}
        
        {/* Premium Score Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(scores).map(([key, value]) => {
            const config = getScoreConfig(value);
            return (
              <div 
                key={key} 
                className={`text-center p-4 rounded-2xl shadow-sm border ${config.bg} ${config.border} transition-transform hover:scale-105`}
              >
                <div className={`text-3xl font-bold ${config.text}`}>{value}</div>
                <div className="text-xs font-medium text-muted-foreground capitalize mt-1">{key}</div>
              </div>
            );
          })}
        </div>
        
        {/* Social Share Row */}
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
        
        {/* Share URL */}
        {shareUrl && (
          <div className="text-center text-sm bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-orange-100">
            <a 
              href={shareUrl} 
              className="text-orange-600 hover:text-orange-700 underline font-medium" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {shareUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
