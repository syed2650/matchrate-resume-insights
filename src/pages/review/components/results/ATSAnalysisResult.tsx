import { AlertCircle, Key, CheckCircle, LayoutGrid, ShieldCheck, AlertOctagon } from "lucide-react";
import { ResultSectionCard } from "../ui/ResultSectionCard";
import { ScoreProgressBar } from "../ui/ScoreProgressBar";
import { DownloadPDFButton } from "../ui/DownloadPDFButton";
import { CopyButton } from "../ui/CopyButton";
import { stripMarkdown, stripMarkdownLine } from "../../utils/stripMarkdown";

interface ATSResult {
  score: number;
  issues: string[];
  keywordGaps: string[];
  fixes: string[];
  rawContent?: string;
}

interface ATSAnalysisResultProps {
  result: ATSResult;
}

export const ATSAnalysisResult = ({ result }: ATSAnalysisResultProps) => {
  const { score, issues, keywordGaps, fixes, rawContent } = result;
  
  // Parse raw content for section map
  const parseSectionMap = (content: string) => {
    const sectionMatch = content.match(/Section Detection Map[\s\S]*?(?=###|$)/i);
    if (sectionMatch) {
      return stripMarkdown(sectionMatch[0].replace(/^.*Section Detection Map[:\s]*/i, '').trim());
    }
    return null;
  };
  
  const sectionMap = rawContent ? parseSectionMap(rawContent) : null;
  
  // Clean arrays - strip markdown from each item
  const cleanIssues = issues.map(i => stripMarkdownLine(i));
  const cleanKeywords = keywordGaps.map(k => stripMarkdownLine(k));
  const cleanFixes = fixes.map(f => stripMarkdownLine(f));
  
  const hasData = cleanIssues.length > 0 || cleanKeywords.length > 0 || cleanFixes.length > 0;
  
  // Clean raw content for copy/download
  const cleanRawContent = rawContent ? stripMarkdown(rawContent) : '';
  const exportContent = cleanRawContent || `ATS Score: ${score}/100\n\nFormatting Issues:\n${cleanIssues.join('\n')}\n\nMissing Keywords:\n${cleanKeywords.join('\n')}\n\nRecommended Fixes:\n${cleanFixes.join('\n')}`;
  
  const getScoreIcon = () => {
    if (score >= 80) return <ShieldCheck className="h-6 w-6 text-emerald-600" />;
    if (score >= 60) return <ShieldCheck className="h-6 w-6 text-amber-600" />;
    return <AlertOctagon className="h-6 w-6 text-red-600" />;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <CopyButton text={exportContent} label="Copy All" />
        <DownloadPDFButton 
          content={exportContent} 
          filename="ats-analysis" 
          title="ATS Analysis Report" 
        />
      </div>
      
      {/* Premium Score Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-6 shadow-sm border border-emerald-200/60">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-100/40 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-100/40 to-transparent rounded-tr-full" />
        
        <div className="relative flex items-center gap-4 mb-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            {getScoreIcon()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">ATS Compatibility Score</h3>
            <p className="text-sm text-muted-foreground">How well your resume parses through ATS systems</p>
          </div>
        </div>
        
        <div className="relative">
          <ScoreProgressBar score={score} label="ATS Score" colorClass="text-emerald-600" size="lg" />
        </div>
      </div>
      
      {!hasData && cleanRawContent ? (
        <div className="bg-gradient-to-br from-slate-50 to-gray-50/50 rounded-2xl p-6 shadow-sm border border-slate-200/60">
          <div className="text-sm leading-relaxed whitespace-pre-wrap">{cleanRawContent}</div>
        </div>
      ) : (
        <>
          {/* Formatting Issues */}
          {cleanIssues.length > 0 && (
            <ResultSectionCard
              title="Formatting Issues"
              icon={<AlertCircle className="h-5 w-5 text-rose-600" />}
              gradientFrom="from-rose-50"
              gradientTo="to-red-50/50"
              borderColor="border-rose-200/60"
              copyText={cleanIssues.join('\n')}
              badge={cleanIssues.length}
            >
              <ul className="space-y-2.5">
                {cleanIssues.map((issue, i) => (
                  <li key={i} className="flex gap-3 items-start py-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </ResultSectionCard>
          )}
          
          {/* Missing Keywords */}
          {cleanKeywords.length > 0 && (
            <ResultSectionCard
              title="Missing Keywords"
              icon={<Key className="h-5 w-5 text-amber-600" />}
              gradientFrom="from-amber-50"
              gradientTo="to-yellow-50/50"
              borderColor="border-amber-200/60"
              copyText={cleanKeywords.join('\n')}
              badge={cleanKeywords.length}
            >
              <div className="flex flex-wrap gap-2">
                {cleanKeywords.map((keyword, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 rounded-full text-sm font-medium border border-amber-200/50 shadow-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </ResultSectionCard>
          )}
          
          {/* Recommended Fixes */}
          {cleanFixes.length > 0 && (
            <ResultSectionCard
              title="Recommended Fixes"
              icon={<CheckCircle className="h-5 w-5 text-emerald-600" />}
              gradientFrom="from-emerald-50"
              gradientTo="to-teal-50/50"
              borderColor="border-emerald-200/60"
              copyText={cleanFixes.join('\n')}
              badge={cleanFixes.length}
            >
              <ul className="space-y-2.5">
                {cleanFixes.map((fix, i) => (
                  <li key={i} className="flex gap-3 items-start py-1.5 px-3 bg-emerald-50/50 rounded-lg border-l-3 border-emerald-400">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{fix}</span>
                  </li>
                ))}
              </ul>
            </ResultSectionCard>
          )}
          
          {/* Section Detection Map */}
          {sectionMap && (
            <ResultSectionCard
              title="Section Detection Map"
              icon={<LayoutGrid className="h-5 w-5 text-slate-600" />}
              gradientFrom="from-slate-100"
              gradientTo="to-gray-50/50"
              borderColor="border-slate-200/60"
              copyText={sectionMap}
              defaultOpen={false}
            >
              <div className="text-sm leading-relaxed font-mono bg-slate-50/50 p-4 rounded-lg">
                {sectionMap.split('\n').map((line, i) => (
                  <p key={i} className="py-0.5">{line}</p>
                ))}
              </div>
            </ResultSectionCard>
          )}
        </>
      )}
    </div>
  );
};
