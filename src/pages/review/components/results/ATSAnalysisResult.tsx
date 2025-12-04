import { AlertCircle, Key, CheckCircle, LayoutGrid } from "lucide-react";
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
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <CopyButton text={exportContent} label="Copy All" />
        <DownloadPDFButton 
          content={exportContent} 
          filename="ats-analysis" 
          title="ATS Analysis Report" 
        />
      </div>
      
      {/* Score Bar */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 shadow-sm border border-green-200">
        <ScoreProgressBar score={score} label="ATS Score" colorClass="text-green-600" />
      </div>
      
      {!hasData && cleanRawContent ? (
        <div className="bg-muted/50 rounded-xl p-5 shadow-sm">
          <div className="text-sm leading-relaxed">{cleanRawContent}</div>
        </div>
      ) : (
        <>
          {/* Formatting Issues - Red */}
          {cleanIssues.length > 0 && (
            <ResultSectionCard
              title={`Formatting Issues (${cleanIssues.length})`}
              icon={<AlertCircle className="h-5 w-5 text-red-600" />}
              bgColor="bg-red-50"
              copyText={cleanIssues.join('\n')}
            >
              <ul className="space-y-2">
                {cleanIssues.map((issue, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </ResultSectionCard>
          )}
          
          {/* Missing Keywords - Yellow */}
          {cleanKeywords.length > 0 && (
            <ResultSectionCard
              title={`Missing Keywords (${cleanKeywords.length})`}
              icon={<Key className="h-5 w-5 text-yellow-600" />}
              bgColor="bg-yellow-50"
              copyText={cleanKeywords.join('\n')}
            >
              <div className="flex flex-wrap gap-2">
                {cleanKeywords.map((keyword, i) => (
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
          {cleanFixes.length > 0 && (
            <ResultSectionCard
              title={`Recommended Fixes (${cleanFixes.length})`}
              icon={<CheckCircle className="h-5 w-5 text-green-600" />}
              bgColor="bg-green-50"
              copyText={cleanFixes.join('\n')}
            >
              <ul className="space-y-2">
                {cleanFixes.map((fix, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
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
              <div className="text-sm bg-white/50 p-3 rounded-lg leading-relaxed">
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
