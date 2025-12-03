import { Target, AlertTriangle, Heart, Sparkles, Link2, UserCheck } from "lucide-react";
import { ResultSectionCard } from "../ui/ResultSectionCard";
import { ScoreProgressBar } from "../ui/ScoreProgressBar";
import { DownloadPDFButton } from "../ui/DownloadPDFButton";
import { CopyButton } from "../ui/CopyButton";

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
      const lines = match[0].split('\n').slice(1).filter(l => l.trim().startsWith('-') || l.trim().startsWith('•'));
      return lines.map(l => l.replace(/^[-•]\s*/, '').trim());
    }
    return [];
  };
  
  const parseKeywordIntegration = (content: string) => {
    const match = content.match(/JD Keyword Integration Suggestions?[\s\S]*?(?=###|$)/i);
    if (match) {
      return match[0].replace(/^.*JD Keyword Integration Suggestions?[:\s]*/i, '').trim();
    }
    return null;
  };
  
  const parseRoleFit = (content: string) => {
    const match = content.match(/Role Fit Assessment[\s\S]*?(?=###|$)/i);
    if (match) {
      return match[0].replace(/^.*Role Fit Assessment[:\s]*/i, '').trim();
    }
    return null;
  };
  
  const softSkills = rawContent ? parseSoftSkills(rawContent) : [];
  const keywordIntegration = rawContent ? parseKeywordIntegration(rawContent) : null;
  const roleFit = rawContent ? parseRoleFit(rawContent) : null;
  
  const hasData = missingSkills.length > 0 || optimizedBullets.length > 0;
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <CopyButton text={rawContent || JSON.stringify(result, null, 2)} label="Copy All" />
        <DownloadPDFButton 
          content={rawContent || `Match Score: ${matchScore}/100\n\nMissing Skills:\n${missingSkills.join('\n')}\n\nOptimized Bullets:\n${optimizedBullets.join('\n')}`} 
          filename="jd-match-analysis" 
          title="Job Match Analysis" 
        />
      </div>
      
      {/* Score Bar */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-5 shadow-sm border border-purple-200">
        <ScoreProgressBar score={matchScore} label="Match Score" colorClass="text-purple-600" />
      </div>
      
      {!hasData && rawContent ? (
        <div className="bg-muted/50 rounded-xl p-5 shadow-sm">
          <div className="text-sm leading-relaxed whitespace-pre-wrap">{rawContent}</div>
        </div>
      ) : (
        <>
          {/* Missing Hard Skills - Yellow */}
          {missingSkills.length > 0 && (
            <ResultSectionCard
              title={`Missing Skills (${missingSkills.length})`}
              icon={<AlertTriangle className="h-5 w-5 text-yellow-600" />}
              bgColor="bg-yellow-50"
              copyText={missingSkills.join('\n')}
            >
              <ul className="space-y-2">
                {missingSkills.map((skill, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="text-yellow-500 mt-0.5">🎯</span>
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
          {optimizedBullets.length > 0 && (
            <ResultSectionCard
              title={`Optimized Bullets (${optimizedBullets.length})`}
              icon={<Sparkles className="h-5 w-5 text-blue-600" />}
              bgColor="bg-blue-50"
              copyText={optimizedBullets.join('\n\n')}
            >
              <div className="space-y-3">
                {optimizedBullets.map((bullet, i) => (
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
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{keywordIntegration}</div>
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
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{roleFit}</div>
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
