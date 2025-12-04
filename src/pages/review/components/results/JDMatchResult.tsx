import { Target, AlertTriangle, Heart, Sparkles, Link2, UserCheck } from "lucide-react";
import { ResultSectionCard } from "../ui/ResultSectionCard";
import { ScoreProgressBar } from "../ui/ScoreProgressBar";
import { DownloadPDFButton } from "../ui/DownloadPDFButton";
import { CopyButton } from "../ui/CopyButton";
import { stripMarkdown, stripMarkdownLine, parseCleanBullets } from "../../utils/stripMarkdown";

interface JDMatchResultData {
  matchScore: number;
  missingSkills: string[];
  optimizedBullets: string[];
  rawContent?: string;
}

interface JDMatchResultProps {
  result: JDMatchResultData;
}

export const JDMatchResult = ({ result }: JDMatchResultProps) => {
  const { matchScore, missingSkills, optimizedBullets, rawContent } = result;
  
  // Parse additional sections from rawContent
  const parseSoftSkills = (content: string) => {
    const match = content.match(/Missing Soft Skills[^#]*(?=###|$)/i);
    if (match) {
      return parseCleanBullets(match[0]);
    }
    return [];
  };
  
  const parseKeywordIntegration = (content: string) => {
    const match = content.match(/JD Keyword Integration Suggestions?[\s\S]*?(?=###|$)/i);
    if (match) {
      return stripMarkdown(match[0].replace(/^.*JD Keyword Integration Suggestions?[:\s]*/i, '').trim());
    }
    return null;
  };
  
  const parseRoleFit = (content: string) => {
    const match = content.match(/Role Fit Assessment[\s\S]*?(?=###|$)/i);
    if (match) {
      return stripMarkdown(match[0].replace(/^.*Role Fit Assessment[:\s]*/i, '').trim());
    }
    return null;
  };
  
  const softSkills = rawContent ? parseSoftSkills(rawContent) : [];
  const keywordIntegration = rawContent ? parseKeywordIntegration(rawContent) : null;
  const roleFit = rawContent ? parseRoleFit(rawContent) : null;
  
  // Clean arrays
  const cleanMissingSkills = missingSkills.map(s => stripMarkdownLine(s));
  const cleanOptimizedBullets = optimizedBullets.map(b => stripMarkdownLine(b));
  
  const hasData = cleanMissingSkills.length > 0 || cleanOptimizedBullets.length > 0;
  
  // Clean raw content
  const cleanRawContent = rawContent ? stripMarkdown(rawContent) : '';
  const exportContent = cleanRawContent || `Match Score: ${matchScore}/100\n\nMissing Skills:\n${cleanMissingSkills.join('\n')}\n\nOptimized Bullets:\n${cleanOptimizedBullets.join('\n')}`;
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <CopyButton text={exportContent} label="Copy All" />
        <DownloadPDFButton 
          content={exportContent} 
          filename="jd-match-analysis" 
          title="Job Match Analysis" 
        />
      </div>
      
      {/* Score Bar */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-5 shadow-sm border border-purple-200">
        <ScoreProgressBar score={matchScore} label="Match Score" colorClass="text-purple-600" />
      </div>
      
      {!hasData && cleanRawContent ? (
        <div className="bg-muted/50 rounded-xl p-5 shadow-sm">
          <div className="text-sm leading-relaxed">{cleanRawContent}</div>
        </div>
      ) : (
        <>
          {/* Missing Hard Skills - Yellow */}
          {cleanMissingSkills.length > 0 && (
            <ResultSectionCard
              title={`Missing Skills (${cleanMissingSkills.length})`}
              icon={<AlertTriangle className="h-5 w-5 text-yellow-600" />}
              bgColor="bg-yellow-50"
              copyText={cleanMissingSkills.join('\n')}
            >
              <ul className="space-y-2">
                {cleanMissingSkills.map((skill, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="text-yellow-500 mt-0.5">•</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </ResultSectionCard>
          )}
          
          {/* Missing Soft Skills - Yellow */}
          {softSkills.length > 0 && (
            <ResultSectionCard
              title={`Missing Soft Skills (${softSkills.length})`}
              icon={<Heart className="h-5 w-5 text-pink-500" />}
              bgColor="bg-yellow-50"
              copyText={softSkills.join('\n')}
            >
              <div className="flex flex-wrap gap-2">
                {softSkills.map((skill, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </ResultSectionCard>
          )}
          
          {/* Optimized Bullets - Blue */}
          {cleanOptimizedBullets.length > 0 && (
            <ResultSectionCard
              title={`Optimized Bullets (${cleanOptimizedBullets.length})`}
              icon={<Sparkles className="h-5 w-5 text-blue-600" />}
              bgColor="bg-blue-50"
              copyText={cleanOptimizedBullets.join('\n\n')}
            >
              <div className="space-y-3">
                {cleanOptimizedBullets.map((bullet, i) => (
                  <div 
                    key={i} 
                    className="bg-white p-3 rounded-lg border-l-4 border-blue-500 shadow-sm"
                  >
                    {bullet}
                  </div>
                ))}
              </div>
            </ResultSectionCard>
          )}
          
          {/* Keyword Integration - Purple */}
          {keywordIntegration && (
            <ResultSectionCard
              title="Keyword Integration Suggestions"
              icon={<Link2 className="h-5 w-5 text-purple-600" />}
              bgColor="bg-purple-50"
              copyText={keywordIntegration}
            >
              <div className="text-sm leading-relaxed">
                {keywordIntegration.split('\n').map((line, i) => (
                  <p key={i} className="py-0.5">{line}</p>
                ))}
              </div>
            </ResultSectionCard>
          )}
          
          {/* Role Fit Assessment - Gray */}
          {roleFit && (
            <ResultSectionCard
              title="Role Fit Assessment"
              icon={<UserCheck className="h-5 w-5 text-slate-600" />}
              bgColor="bg-slate-100"
              copyText={roleFit}
            >
              <div className="text-sm leading-relaxed">
                {roleFit.split('\n').map((line, i) => (
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
