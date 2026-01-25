import { Target, AlertTriangle, Wrench, Key, CheckCircle, TrendingUp } from "lucide-react";
import { ResultSectionCard } from "../ui/ResultSectionCard";
import { ScoreProgressBar } from "../ui/ScoreProgressBar";
import { DownloadPDFButton } from "../ui/DownloadPDFButton";
import { CopyButton } from "../ui/CopyButton";
import { stripMarkdown, stripMarkdownLine } from "../../utils/stripMarkdown";

interface MissingItem {
  type: string;
  item: string;
  why_it_matters: string;
}

interface ResumeFix {
  instruction: string;
  where_to_add: string;
  example_line: string;
}

interface StructuredJDData {
  match_score?: number;
  match_verdict?: string;
  missing?: MissingItem[];
  resume_level_fixes?: ResumeFix[];
  keywords_to_add?: string[];
}

interface JDMatchResultData {
  matchScore: number;
  matchVerdict?: string;
  missing?: MissingItem[];
  resumeLevelFixes?: ResumeFix[];
  keywordsToAdd?: string[];
  missingSkills: string[];
  optimizedBullets: string[];
  rawContent?: string;
  structured?: StructuredJDData | null;
}

interface JDMatchResultProps {
  result: JDMatchResultData;
}

export const JDMatchResult = ({ result }: JDMatchResultProps) => {
  const { 
    matchScore, 
    matchVerdict,
    missing,
    resumeLevelFixes,
    keywordsToAdd,
    missingSkills, 
    rawContent, 
    structured 
  } = result;
  
  const cleanRawContent = rawContent ? stripMarkdown(rawContent) : '';
  const exportContent = cleanRawContent || `Match Score: ${matchScore}/100`;
  
  const displayVerdict = structured?.match_verdict || matchVerdict || '';
  const displayMissing = structured?.missing || missing || [];
  const displayFixes = structured?.resume_level_fixes || resumeLevelFixes || [];
  const displayKeywords = structured?.keywords_to_add || keywordsToAdd || [];
  
  const getVerdictInfo = () => {
    const verdict = displayVerdict.toLowerCase();
    if (verdict.includes('strong')) {
      return { 
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-100',
        borderColor: 'border-emerald-300',
        icon: <CheckCircle className="h-5 w-5 text-emerald-600" />
      };
    }
    if (verdict.includes('weak')) {
      return { 
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-300',
        icon: <AlertTriangle className="h-5 w-5 text-red-600" />
      };
    }
    return { 
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      borderColor: 'border-amber-300',
      icon: <TrendingUp className="h-5 w-5 text-amber-600" />
    };
  };
  
  const verdictInfo = getVerdictInfo();
  
  const getTypeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('hard')) return 'bg-red-100 text-red-800 border-red-200';
    if (t.includes('soft')) return 'bg-pink-100 text-pink-800 border-pink-200';
    if (t.includes('wording')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (t.includes('domain')) return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
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
      
      {/* Premium Score Card with Verdict */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 rounded-2xl p-6 shadow-sm border border-purple-200/60">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-100/40 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-violet-100/40 to-transparent rounded-tr-full" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Job Match Analysis</h3>
                <p className="text-sm text-muted-foreground">How closely your resume aligns with the job</p>
              </div>
            </div>
            {displayVerdict && (
              <div className={`px-4 py-2 rounded-full font-semibold ${verdictInfo.bgColor} ${verdictInfo.color} border ${verdictInfo.borderColor} flex items-center gap-2`}>
                {verdictInfo.icon}
                {displayVerdict}
              </div>
            )}
          </div>
          
          <ScoreProgressBar score={matchScore} label="Match Score" colorClass="text-purple-600" size="lg" />
        </div>
      </div>
      
      {/* What's Missing */}
      {displayMissing.length > 0 && (
        <ResultSectionCard
          title="What's Missing"
          icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
          gradientFrom="from-amber-50"
          gradientTo="to-orange-50/50"
          borderColor="border-amber-200/60"
          copyText={displayMissing.map(m => `${m.type}: ${m.item} - ${m.why_it_matters}`).join('\n')}
          badge={displayMissing.length}
        >
          <div className="space-y-3">
            {displayMissing.map((item, i) => (
              <div key={i} className="bg-white/80 rounded-lg p-4 border-l-4 border-amber-400 shadow-sm">
                <div className="flex items-start gap-3 mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getTypeColor(item.type)}`}>
                    {stripMarkdownLine(item.type)}
                  </span>
                </div>
                <p className="font-semibold text-foreground">{stripMarkdownLine(item.item)}</p>
                <p className="text-sm text-muted-foreground mt-1">{stripMarkdownLine(item.why_it_matters)}</p>
              </div>
            ))}
          </div>
        </ResultSectionCard>
      )}
      
      {/* Legacy: Missing Skills fallback */}
      {displayMissing.length === 0 && missingSkills.length > 0 && (
        <ResultSectionCard
          title="Missing Skills"
          icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
          gradientFrom="from-amber-50"
          gradientTo="to-orange-50/50"
          borderColor="border-amber-200/60"
          copyText={missingSkills.join('\n')}
          badge={missingSkills.length}
        >
          <ul className="space-y-2.5">
            {missingSkills.map((skill, i) => (
              <li key={i} className="flex gap-3 items-start py-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                <span>{stripMarkdownLine(skill)}</span>
              </li>
            ))}
          </ul>
        </ResultSectionCard>
      )}
      
      {/* How to Fix It */}
      {displayFixes.length > 0 && (
        <ResultSectionCard
          title="How to Fix It"
          icon={<Wrench className="h-5 w-5 text-blue-600" />}
          gradientFrom="from-blue-50"
          gradientTo="to-sky-50/50"
          borderColor="border-blue-200/60"
          copyText={displayFixes.map(f => `${f.where_to_add}: ${f.instruction}`).join('\n')}
          badge={displayFixes.length}
        >
          <div className="space-y-3">
            {displayFixes.map((fix, i) => (
              <div key={i} className="bg-white/80 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                <div className="flex items-start gap-3 mb-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                        {stripMarkdownLine(fix.where_to_add)}
                      </span>
                    </div>
                    <p className="font-medium text-foreground">{stripMarkdownLine(fix.instruction)}</p>
                  </div>
                </div>
                {fix.example_line && (
                  <div className="ml-9 mt-2 bg-emerald-50/80 rounded-lg p-3 border-l-3 border-emerald-500">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Example</span>
                    <p className="text-sm text-emerald-900 mt-1 italic">"{stripMarkdownLine(fix.example_line)}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ResultSectionCard>
      )}
      
      {/* Keywords to Add */}
      {displayKeywords.length > 0 && (
        <ResultSectionCard
          title="Keywords to Add"
          icon={<Key className="h-5 w-5 text-violet-600" />}
          gradientFrom="from-violet-50"
          gradientTo="to-purple-50/50"
          borderColor="border-violet-200/60"
          copyText={displayKeywords.join(', ')}
          badge={displayKeywords.length}
        >
          <div className="flex flex-wrap gap-2">
            {displayKeywords.map((keyword, i) => (
              <span 
                key={i} 
                className="px-3 py-1.5 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-800 rounded-full text-sm font-medium border border-violet-200/50 shadow-sm"
              >
                {stripMarkdownLine(keyword)}
              </span>
            ))}
          </div>
        </ResultSectionCard>
      )}
    </div>
  );
};
