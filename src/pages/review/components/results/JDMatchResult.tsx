import { Target, AlertTriangle, Heart, Sparkles, Link2, UserCheck, TrendingUp } from "lucide-react";
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
  
  const getMatchIcon = () => {
    if (matchScore >= 80) return <Target className="h-6 w-6 text-purple-600" />;
    if (matchScore >= 60) return <TrendingUp className="h-6 w-6 text-purple-600" />;
    return <Target className="h-6 w-6 text-purple-600" />;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <CopyButton text={exportContent} label="Copy All" />
        <DownloadPDFButton 
          content={exportContent} 
          filename="jd-match-analysis" 
          title="Job Match Analysis" 
        />
      </div>
      
      {/* Premium Score Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 rounded-2xl p-6 shadow-sm border border-purple-200/60">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-100/40 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-violet-100/40 to-transparent rounded-tr-full" />
        
        <div className="relative flex items-center gap-4 mb-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            {getMatchIcon()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Job Description Match</h3>
            <p className="text-sm text-muted-foreground">How closely your resume aligns with the job requirements</p>
          </div>
        </div>
        
        <div className="relative">
          <ScoreProgressBar score={matchScore} label="Match Score" colorClass="text-purple-600" size="lg" />
        </div>
      </div>
      
      {!hasData && cleanRawContent ? (
        <div className="bg-gradient-to-br from-slate-50 to-gray-50/50 rounded-2xl p-6 shadow-sm border border-slate-200/60">
          <div className="text-sm leading-relaxed whitespace-pre-wrap">{cleanRawContent}</div>
        </div>
      ) : (
        <>
          {/* Missing Hard Skills */}
          {cleanMissingSkills.length > 0 && (
            <ResultSectionCard
              title="Missing Skills"
              icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
              gradientFrom="from-amber-50"
              gradientTo="to-orange-50/50"
              borderColor="border-amber-200/60"
              copyText={cleanMissingSkills.join('\n')}
              badge={cleanMissingSkills.length}
            >
              <ul className="space-y-2.5">
                {cleanMissingSkills.map((skill, i) => (
                  <li key={i} className="flex gap-3 items-start py-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </ResultSectionCard>
          )}
          
          {/* Missing Soft Skills */}
          {softSkills.length > 0 && (
            <ResultSectionCard
              title="Missing Soft Skills"
              icon={<Heart className="h-5 w-5 text-pink-500" />}
              gradientFrom="from-pink-50"
              gradientTo="to-rose-50/50"
              borderColor="border-pink-200/60"
              copyText={softSkills.join('\n')}
              badge={softSkills.length}
            >
              <div className="flex flex-wrap gap-2">
                {softSkills.map((skill, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1.5 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 rounded-full text-sm font-medium border border-pink-200/50 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </ResultSectionCard>
          )}
          
          {/* Optimized Bullets */}
          {cleanOptimizedBullets.length > 0 && (
            <ResultSectionCard
              title="Optimized Bullets"
              icon={<Sparkles className="h-5 w-5 text-blue-600" />}
              gradientFrom="from-blue-50"
              gradientTo="to-sky-50/50"
              borderColor="border-blue-200/60"
              copyText={cleanOptimizedBullets.join('\n\n')}
              badge={cleanOptimizedBullets.length}
            >
              <div className="space-y-3">
                {cleanOptimizedBullets.map((bullet, i) => (
                  <div 
                    key={i} 
                    className="bg-gradient-to-r from-blue-50/80 to-sky-50/80 p-4 rounded-xl border-l-4 border-blue-500 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{bullet}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ResultSectionCard>
          )}
          
          {/* Keyword Integration */}
          {keywordIntegration && (
            <ResultSectionCard
              title="Keyword Integration Suggestions"
              icon={<Link2 className="h-5 w-5 text-violet-600" />}
              gradientFrom="from-violet-50"
              gradientTo="to-purple-50/50"
              borderColor="border-violet-200/60"
              copyText={keywordIntegration}
              defaultOpen={false}
            >
              <div className="text-sm leading-relaxed">
                {keywordIntegration.split('\n').map((line, i) => {
                  const trimmed = line.trim();
                  if (!trimmed) return null;
                  if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
                    return (
                      <div key={i} className="flex gap-3 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0"></span>
                        <span>{trimmed.replace(/^[-•]\s*/, '')}</span>
                      </div>
                    );
                  }
                  return <p key={i} className="py-0.5">{line}</p>;
                })}
              </div>
            </ResultSectionCard>
          )}
          
          {/* Role Fit Assessment */}
          {roleFit && (
            <ResultSectionCard
              title="Role Fit Assessment"
              icon={<UserCheck className="h-5 w-5 text-slate-600" />}
              gradientFrom="from-slate-100"
              gradientTo="to-gray-50/50"
              borderColor="border-slate-200/60"
              copyText={roleFit}
              defaultOpen={false}
            >
              <div className="text-sm leading-relaxed">
                {roleFit.split('\n').map((line, i) => {
                  const trimmed = line.trim();
                  if (!trimmed) return null;
                  if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
                    return (
                      <div key={i} className="flex gap-3 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2 shrink-0"></span>
                        <span>{trimmed.replace(/^[-•]\s*/, '')}</span>
                      </div>
                    );
                  }
                  return <p key={i} className="py-0.5">{line}</p>;
                })}
              </div>
            </ResultSectionCard>
          )}
        </>
      )}
    </div>
  );
};
