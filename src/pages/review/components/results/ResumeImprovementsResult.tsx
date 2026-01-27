import { useState } from "react";
import { 
  AlertCircle,
  Sparkles, 
  TrendingUp, 
  Zap,
  ArrowRight,
  Lightbulb,
  Target,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { ResultSectionCard } from "../ui/ResultSectionCard";
import { DownloadPDFButton } from "../ui/DownloadPDFButton";
import { CopyButton } from "../ui/CopyButton";
import { stripMarkdown, stripMarkdownLine } from "../../utils/stripMarkdown";

interface CriticalFix {
  issue: string;
  why: string;
  fix_example: string;
}

interface QuickWin {
  before: string;
  after: string;
}

interface StructuredData {
  verdict?: string;
  critical_fixes?: CriticalFix[];
  nice_to_have?: CriticalFix[];
  optional_enhancements?: CriticalFix[];
  quick_wins_rewrite_pack?: QuickWin[];
}

interface ResumeImprovementsResultProps {
  content: string;
  structured?: StructuredData | null;
}

// Collapsible fix card with toggle for example
const FixCard = ({ fix, index }: { fix: CriticalFix; index: number }) => {
  const [showExample, setShowExample] = useState(false);
  
  return (
    <div className="bg-white/80 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
          {index + 1}
        </span>
        <div className="flex-1">
          <p className="font-semibold text-foreground">{stripMarkdownLine(fix.issue)}</p>
          <p className="text-sm text-muted-foreground mt-1">{stripMarkdownLine(fix.why)}</p>
          
          {/* Collapsed fix example by default */}
          {fix.fix_example && (
            <div className="mt-3">
              <button 
                onClick={() => setShowExample(!showExample)}
                className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                {showExample ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {showExample ? 'Hide example' : 'View example'}
              </button>
              {showExample && (
                <div className="mt-2 bg-emerald-50/80 rounded-lg p-3 border-l-3 border-emerald-500">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Fix Example</span>
                  <p className="text-sm text-emerald-900 mt-1">{stripMarkdownLine(fix.fix_example)}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ResumeImprovementsResult = ({ content, structured }: ResumeImprovementsResultProps) => {
  const cleanContent = stripMarkdown(content);
  
  // If we have structured data, render the new format
  if (structured && structured.critical_fixes?.length) {
    return (
      <div className="space-y-5">
        {/* Single global Copy Fixes button - reduces UI noise */}
        <div className="flex flex-wrap gap-2">
          <CopyButton text={cleanContent} label="Copy All Fixes" />
          <DownloadPDFButton content={cleanContent} filename="resume-strength" title="Resume Strength Analysis" />
        </div>
        
        {/* Verdict Banner */}
        {structured.verdict && (
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-4 border border-blue-200/60">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-blue-600" />
              <p className="text-sm font-medium text-foreground">{structured.verdict}</p>
            </div>
          </div>
        )}
        
        {/* Critical Fixes - Top 5, collapsed examples - NO section copy button */}
        <ResultSectionCard
          title="Top 5 Critical Fixes"
          icon={<AlertCircle className="h-5 w-5 text-red-600" />}
          gradientFrom="from-red-50"
          gradientTo="to-rose-50/50"
          borderColor="border-red-200/60"
          badge={5}
        >
          <div className="space-y-4">
            {structured.critical_fixes?.slice(0, 5).map((fix, i) => (
              <FixCard key={i} fix={fix} index={i} />
            ))}
          </div>
        </ResultSectionCard>
        
        {/* Nice-to-have Improvements - Accordion, NO section copy button */}
        {structured.nice_to_have && structured.nice_to_have.length > 0 && (
          <ResultSectionCard
            title="Nice-to-have Improvements"
            icon={<TrendingUp className="h-5 w-5 text-amber-600" />}
            gradientFrom="from-amber-50"
            gradientTo="to-yellow-50/50"
            borderColor="border-amber-200/60"
            badge={structured.nice_to_have.length}
            defaultOpen={false}
          >
            <div className="space-y-3">
              {structured.nice_to_have.map((fix, i) => (
                <div key={i} className="bg-white/80 rounded-lg p-3 border-l-3 border-amber-400">
                  <p className="font-medium text-foreground">{stripMarkdownLine(fix.issue)}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stripMarkdownLine(fix.why)}</p>
                </div>
              ))}
            </div>
          </ResultSectionCard>
        )}
        
        {/* Optional Enhancements - Accordion, NO section copy button */}
        {structured.optional_enhancements && structured.optional_enhancements.length > 0 && (
          <ResultSectionCard
            title="Optional Enhancements"
            icon={<Lightbulb className="h-5 w-5 text-blue-600" />}
            gradientFrom="from-blue-50"
            gradientTo="to-sky-50/50"
            borderColor="border-blue-200/60"
            badge={structured.optional_enhancements.length}
            defaultOpen={false}
          >
            <div className="space-y-3">
              {structured.optional_enhancements.map((fix, i) => (
                <div key={i} className="bg-white/80 rounded-lg p-3 border-l-3 border-blue-300">
                  <p className="font-medium text-foreground">{stripMarkdownLine(fix.issue)}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stripMarkdownLine(fix.why)}</p>
                </div>
              ))}
            </div>
          </ResultSectionCard>
        )}
        
        {/* Quick Wins Rewrite Pack - Side by side, NO section copy button */}
        {structured.quick_wins_rewrite_pack && structured.quick_wins_rewrite_pack.length > 0 && (
          <ResultSectionCard
            title="Quick Wins Rewrite Pack"
            icon={<Zap className="h-5 w-5 text-emerald-600" />}
            gradientFrom="from-emerald-50"
            gradientTo="to-teal-50/50"
            borderColor="border-emerald-200/60"
            badge={structured.quick_wins_rewrite_pack.length}
          >
            <div className="space-y-4">
              {structured.quick_wins_rewrite_pack.map((rewrite, i) => (
                <div key={i} className="bg-white/80 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                  </div>
                  {/* Side-by-side on larger screens */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-slate-50/80 rounded-lg p-3 border-l-3 border-slate-300">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Before</span>
                      <p className="text-sm text-slate-600 mt-1">{stripMarkdownLine(rewrite.before)}</p>
                    </div>
                    <div className="bg-emerald-50/80 rounded-lg p-3 border-l-3 border-emerald-500 relative">
                      <div className="hidden md:block absolute -left-5 top-1/2 -translate-y-1/2">
                        <ArrowRight className="h-4 w-4 text-emerald-500" />
                      </div>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">After</span>
                      <p className="text-sm text-emerald-900 font-medium mt-1">{stripMarkdownLine(rewrite.after)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ResultSectionCard>
        )}
      </div>
    );
  }
  
  // Fallback to legacy rendering for old format
  const parseContent = (raw: string) => {
    const sections: any[] = [];
    const parts = raw.split(/(?=###?\s)/);
    
    parts.forEach(part => {
      const lines = part.trim().split('\n');
      const titleLine = stripMarkdownLine(lines[0]?.replace(/^#+\s*/, '').trim());
      const body = lines.slice(1).join('\n').trim();
      
      if (!titleLine || !body) return;
      
      sections.push({ title: titleLine, content: body });
    });
    
    return sections;
  };
  
  const sections = parseContent(content);
  
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      
      const cleanLine = stripMarkdownLine(trimmed);
      
      if (trimmed.toLowerCase().includes('before:') || trimmed.toLowerCase().includes('after:')) {
        const isAfter = trimmed.toLowerCase().includes('after:');
        const label = isAfter ? 'After' : 'Before';
        const value = cleanLine.replace(/^(before|after):\s*/i, '');
        return (
          <div key={idx} className={`flex items-start gap-3 py-2 px-3 rounded-lg my-1 ${
            isAfter ? 'bg-emerald-50/80 border-l-3 border-emerald-500' : 'bg-slate-50/80 border-l-3 border-slate-300'
          }`}>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              isAfter ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'
            }`}>
              {label}
            </span>
            {isAfter && <ArrowRight className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />}
            <span className={isAfter ? 'text-emerald-900 font-medium' : 'text-slate-600'}>{value}</span>
          </div>
        );
      }
      
      if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
        const bulletText = stripMarkdownLine(trimmed.replace(/^[-•*]\s*/, ''));
        return (
          <div key={idx} className="flex gap-3 py-1.5 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
            <span>{bulletText}</span>
          </div>
        );
      }
      
      return <p key={idx} className="py-1">{cleanLine}</p>;
    });
  };
  
  if (sections.length === 0) {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2 mb-4">
          <CopyButton text={cleanContent} label="Copy All" />
          <DownloadPDFButton content={cleanContent} filename="resume-strength" title="Resume Strength Analysis" />
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-6 shadow-sm border border-blue-200/60">
          <div className="text-sm leading-relaxed">{renderContent(content)}</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <CopyButton text={cleanContent} label="Copy All" />
        <DownloadPDFButton content={cleanContent} filename="resume-strength" title="Resume Strength Analysis" />
      </div>
      
      {sections.map((section, idx) => (
        <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-6 shadow-sm border border-blue-200/60">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            {section.title}
          </h4>
          <div className="leading-relaxed">{renderContent(section.content)}</div>
        </div>
      ))}
    </div>
  );
};
