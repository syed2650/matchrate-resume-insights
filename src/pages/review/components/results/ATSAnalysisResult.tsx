import { AlertCircle, Key, CheckCircle, LayoutGrid } from "lucide-react";
import { ResultSectionCard } from "../ui/ResultSectionCard";
import { ScoreProgressBar } from "../ui/ScoreProgressBar";
import { DownloadPDFButton } from "../ui/DownloadPDFButton";
import { CopyButton } from "../ui/CopyButton";

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
  
  // Parse raw content for additional sections if available
  const parseSectionMap = (content: string) => {
    const sectionMatch = content.match(/Section Detection Map[\s\S]*?(?=###|$)/i);
    if (sectionMatch) {
      return sectionMatch[0].replace(/^.*Section Detection Map[:\s]*/i, '').trim();
    }
    return null;
  };
  
  const sectionMap = rawContent ? parseSectionMap(rawContent) : null;
  
  const hasData = issues.length > 0 || keywordGaps.length > 0 || fixes.length > 0;
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <CopyButton text={rawContent || JSON.stringify(result, null, 2)} label="Copy All" />
        <DownloadPDFButton 
          content={rawContent || `ATS Score: ${score}/100\n\nFormatting Issues:\n${issues.join('\n')}\n\nMissing Keywords:\n${keywordGaps.join('\n')}\n\nRecommended Fixes:\n${fixes.join('\n')}`} 
          filename="ats-analysis" 
          title="ATS Analysis Report" 
        />
      </div>
      
      {/* Score Bar */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 shadow-sm border border-green-200">
        <ScoreProgressBar score={score} label="ATS Score" colorClass="text-green-600" />
      </div>
      
      {!hasData && rawContent ? (
        <div className="bg-muted/50 rounded-xl p-5 shadow-sm">
          <div className="text-sm leading-relaxed whitespace-pre-wrap">{rawContent}</div>
        </div>
      ) : (
        <>
          {/* Formatting Issues - Red */}
          {issues.length > 0 && (
            <ResultSectionCard
              title={`Formatting Issues (${issues.length})`}
              icon={<AlertCircle className="h-5 w-5 text-red-600" />}
              bgColor="bg-red-50"
              copyText={issues.join('\n')}
            >
              <ul className="space-y-2">
                {issues.map((issue, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-red-500 mt-0.5">⚠️</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </ResultSectionCard>
          )}
          
          {/* Missing Keywords - Yellow */}
          {keywordGaps.length > 0 && (
            <ResultSectionCard
              title={`Missing Keywords (${keywordGaps.length})`}
              icon={<Key className="h-5 w-5 text-yellow-600" />}
              bgColor="bg-yellow-50"
              copyText={keywordGaps.join('\n')}
            >
              <div className="flex flex-wrap gap-2">
                {keywordGaps.map((keyword, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </ResultSectionCard>
          )}
          
          {/* Recommended Fixes - Green */}
          {fixes.length > 0 && (
            <ResultSectionCard
              title={`Recommended Fixes (${fixes.length})`}
              icon={<CheckCircle className="h-5 w-5 text-green-600" />}
              bgColor="bg-green-50"
              copyText={fixes.join('\n')}
            >
              <ul className="space-y-2">
                {fixes.map((fix, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-green-500 mt-0.5">✅</span>
                    <span>{fix}</span>
                  </li>
                ))}
              </ul>
            </ResultSectionCard>
          )}
          
          {/* Section Detection Map - Gray */}
          {sectionMap && (
            <ResultSectionCard
              title="Section Detection Map"
              icon={<LayoutGrid className="h-5 w-5 text-slate-600" />}
              bgColor="bg-slate-100"
              copyText={sectionMap}
            >
              <div className="text-sm whitespace-pre-wrap font-mono bg-white/50 p-3 rounded-lg">
                {sectionMap}
              </div>
            </ResultSectionCard>
          )}
        </>
      )}
      
      {/* Full Analysis Expandable */}
      {rawContent && hasData && (
        <details className="mt-2">
          <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground font-medium">
            View Full Analysis
          </summary>
          <div className="bg-muted/30 p-4 rounded-xl mt-2 text-sm whitespace-pre-wrap max-h-[400px] overflow-y-auto">
            {rawContent}
          </div>
        </details>
      )}
    </div>
  );
};
