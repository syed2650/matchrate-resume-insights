import { Flame, Share2, Twitter, Linkedin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "../ui/CopyButton";
import { DownloadPDFButton } from "../ui/DownloadPDFButton";

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
  
  // Parse additional sections from rawContent
  const parseWhySection = (content: string) => {
    const match = content.match(/Why Your Resume Looks Like This[\s\S]*?(?=###|📘|🧩|$)/i);
    if (match) {
      return match[0].replace(/^.*Why Your Resume Looks Like This[:\s]*/i, '').replace(/^\*\*.*?\*\*\s*/i, '').trim();
    }
    return null;
  };
  
  const parseWhatSection = (content: string) => {
    const match = content.match(/What This Says About You[\s\S]*?(?=###|📘|$)/i);
    if (match) {
      return match[0].replace(/^.*What This Says About You[:\s]*/i, '').replace(/^\*\*.*?\*\*\s*/i, '').trim();
    }
    return null;
  };
  
  const parseRealReview = (content: string) => {
    const match = content.match(/Real Review[\s\S]*?(?=###\s*Scores|$)/i);
    if (match) {
      return match[0].replace(/^.*Real Review[:\s]*/i, '').replace(/^\*\*.*?\*\*\s*/i, '').trim();
    }
    return null;
  };
  
  const whySection = rawContent ? parseWhySection(rawContent) : null;
  const whatSection = rawContent ? parseWhatSection(rawContent) : null;
  const realReview = rawContent ? parseRealReview(rawContent) : null;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };
  
  const handleTwitterShare = () => {
    const text = encodeURIComponent(shareText + (shareUrl ? '\n' + shareUrl : ''));
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };
  
  const handleLinkedInShare = () => {
    const url = encodeURIComponent(shareUrl || window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };
  
  return (
    <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 rounded-xl border-2 border-orange-300 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-5 py-3">
        <div className="flex items-center gap-2 text-white">
          <Flame className="h-6 w-6" />
          <span className="font-bold text-lg">Resume Roast</span>
        </div>
      </div>
      
      <div className="p-5 space-y-5">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <CopyButton text={roast} label="Copy Roast" />
          <CopyButton text={rawContent || shareText} label="Copy All" />
          <DownloadPDFButton 
            content={rawContent || `${roast}\n\nScores:\nFormatting: ${scores.formatting}\nClarity: ${scores.clarity}\nImpact: ${scores.impact}\nATS: ${scores.ats}\nOverall: ${scores.overall}`} 
            filename="resume-roast" 
            title="Resume Roast Card" 
          />
        </div>
        
        {/* Main Roast - Speech Bubble */}
        <div className="relative">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-200">
            <div className="absolute -top-3 left-6">
              <span className="text-3xl">🔥</span>
            </div>
            <p className="text-lg font-medium text-slate-800 italic leading-relaxed pt-2">
              "{roast}"
            </p>
          </div>
          {/* Speech bubble tail */}
          <div className="absolute -bottom-2 left-10 w-4 h-4 bg-white border-r border-b border-orange-200 transform rotate-45"></div>
        </div>
        
        {/* Why Section */}
        {whySection && (
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
              <span>📌</span> Why Your Resume Looks Like This
            </h4>
            <p className="text-sm text-amber-900 leading-relaxed">{whySection}</p>
          </div>
        )}
        
        {/* What Section */}
        {whatSection && (
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
              <span>🧩</span> What This Says About You
            </h4>
            <p className="text-sm text-orange-900 leading-relaxed">{whatSection}</p>
          </div>
        )}
        
        {/* Real Review */}
        {realReview && (
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <span>📘</span> Real Review
            </h4>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{realReview}</div>
          </div>
        )}
        
        {/* Score Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(scores).map(([key, value]) => (
            <div 
              key={key} 
              className={`text-center p-3 rounded-xl shadow-sm border ${getScoreColor(value)}`}
            >
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-xs font-medium capitalize opacity-80">{key}</div>
            </div>
          ))}
        </div>
        
        {/* Social Share Row */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-orange-200">
          <span className="text-sm text-slate-600 font-medium self-center mr-2">Share:</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleTwitterShare}
            className="gap-1.5 border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            <Twitter className="h-4 w-4" />
            Twitter
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLinkedInShare}
            className="gap-1.5 border-blue-600 text-blue-700 hover:bg-blue-50"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </Button>
        </div>
        
        {/* Share URL */}
        {shareUrl && (
          <div className="text-center text-sm text-slate-500 bg-white/50 p-2 rounded-lg">
            <span>🔗 </span>
            <a 
              href={shareUrl} 
              className="text-orange-600 underline font-medium hover:text-orange-700" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {shareUrl}
            </a>
          </div>
        )}
        
        {/* Full Analysis Expandable */}
        {rawContent && (
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground font-medium">
              View Full Analysis
            </summary>
            <div className="bg-white/80 p-4 rounded-xl mt-2 text-sm whitespace-pre-wrap max-h-[400px] overflow-y-auto border border-orange-100">
              {rawContent}
            </div>
          </details>
        )}
      </div>
    </div>
  );
};
