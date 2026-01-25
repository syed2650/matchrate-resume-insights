import { AlertCircle, CheckCircle, ShieldCheck, AlertTriangle, XCircle, Zap } from "lucide-react";
import { ResultSectionCard } from "../ui/ResultSectionCard";
import { ScoreProgressBar } from "../ui/ScoreProgressBar";
import { DownloadPDFButton } from "../ui/DownloadPDFButton";
import { CopyButton } from "../ui/CopyButton";
import { stripMarkdown, stripMarkdownLine } from "../../utils/stripMarkdown";

interface StructuredATSData {
  ats_score?: number;
  ats_score_context?: string;
  ats_rejection_risk?: string;
  badge?: string;
  why?: string[];
  risk_drivers?: string[];
  fix_first?: string;
}

interface ATSResult {
  score: number;
  scoreContext?: string;
  rejectionRisk?: string;
  badge?: string;
  why?: string[];
  riskDrivers?: string[];
  fixFirst?: string;
  issues: string[];
  keywordGaps: string[];
  fixes: string[];
  rawContent?: string;
  structured?: StructuredATSData | null;
}

interface ATSAnalysisResultProps {
  result: ATSResult;
}

export const ATSAnalysisResult = ({ result }: ATSAnalysisResultProps) => {
  const { 
    score, 
    scoreContext,
    rejectionRisk,
    badge,
    why,
    riskDrivers,
    fixFirst,
    issues, 
    rawContent, 
    structured 
  } = result;
  
  const cleanRawContent = rawContent ? stripMarkdown(rawContent) : '';
  const exportContent = cleanRawContent || `ATS Score: ${score}/100`;
  
  const getBadgeInfo = () => {
    const badgeText = structured?.badge || badge || '';
    if (badgeText.includes('✅') || badgeText.toLowerCase().includes('safe')) {
      return { 
        icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-800',
        borderColor: 'border-emerald-300',
        label: 'ATS-safe'
      };
    }
    if (badgeText.includes('❌') || badgeText.toLowerCase().includes('high risk')) {
      return { 
        icon: <XCircle className="h-6 w-6 text-red-600" />,
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-300',
        label: 'High Risk'
      };
    }
    return { 
      icon: <AlertTriangle className="h-6 w-6 text-amber-600" />,
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-800',
      borderColor: 'border-amber-300',
      label: 'Needs minor fixes'
    };
  };
  
  const badgeInfo = getBadgeInfo();
  const displayWhy = structured?.why || why || issues || [];
  const displayRiskDrivers = structured?.risk_drivers || riskDrivers || [];
  const displayFixFirst = structured?.fix_first || fixFirst || '';
  const displayRejectionRisk = structured?.ats_rejection_risk || rejectionRisk || '';
  const displayScoreContext = structured?.ats_score_context || scoreContext || `${score}/100`;

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
      
      {/* Premium ATS Verdict Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-6 shadow-sm border border-emerald-200/60">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-100/40 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-100/40 to-transparent rounded-tr-full" />
        
        <div className="relative">
          {/* Badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                {badgeInfo.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">ATS Compatibility</h3>
                <p className="text-sm text-muted-foreground">{displayScoreContext}</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full font-semibold ${badgeInfo.bgColor} ${badgeInfo.textColor} border ${badgeInfo.borderColor}`}>
              {badgeInfo.label}
            </div>
          </div>
          
          <ScoreProgressBar score={score} label="ATS Score" colorClass="text-emerald-600" size="lg" />
          
          {/* Rejection Risk */}
          {displayRejectionRisk && (
            <div className="mt-4 p-3 bg-white/60 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold text-foreground">Will ATS reject? </span>
                <span className={`font-bold ${
                  displayRejectionRisk === 'No' ? 'text-emerald-600' :
                  displayRejectionRisk === 'Probably Not' ? 'text-emerald-500' :
                  displayRejectionRisk === 'Probably' ? 'text-amber-600' :
                  'text-red-600'
                }`}>{displayRejectionRisk}</span>
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Why - Rejection Reasons */}
      {displayWhy.length > 0 && (
        <ResultSectionCard
          title="Why?"
          icon={<AlertCircle className="h-5 w-5 text-rose-600" />}
          gradientFrom="from-rose-50"
          gradientTo="to-red-50/50"
          borderColor="border-rose-200/60"
          copyText={displayWhy.join('\n')}
          badge={displayWhy.length}
        >
          <ul className="space-y-2.5">
            {displayWhy.slice(0, 3).map((reason, i) => (
              <li key={i} className="flex gap-3 items-start py-1.5 px-3 bg-rose-50/50 rounded-lg border-l-3 border-rose-400">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{stripMarkdownLine(reason)}</span>
              </li>
            ))}
          </ul>
        </ResultSectionCard>
      )}
      
      {/* Risk Drivers */}
      {displayRiskDrivers.length > 0 && (
        <ResultSectionCard
          title="Risk Drivers"
          icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
          gradientFrom="from-amber-50"
          gradientTo="to-yellow-50/50"
          borderColor="border-amber-200/60"
          copyText={displayRiskDrivers.join(', ')}
          badge={displayRiskDrivers.length}
        >
          <div className="flex flex-wrap gap-2">
            {displayRiskDrivers.map((driver, i) => (
              <span 
                key={i} 
                className="px-3 py-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 rounded-full text-sm font-medium border border-amber-200/50 shadow-sm"
              >
                {stripMarkdownLine(driver)}
              </span>
            ))}
          </div>
        </ResultSectionCard>
      )}
      
      {/* Fix First Action */}
      {displayFixFirst && (
        <ResultSectionCard
          title="Fix First"
          icon={<Zap className="h-5 w-5 text-emerald-600" />}
          gradientFrom="from-emerald-50"
          gradientTo="to-teal-50/50"
          borderColor="border-emerald-200/60"
          copyText={displayFixFirst}
        >
          <div className="flex gap-3 items-start py-2 px-4 bg-emerald-50/80 rounded-xl border-l-4 border-emerald-500">
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="font-medium text-emerald-900">{stripMarkdownLine(displayFixFirst)}</p>
          </div>
        </ResultSectionCard>
      )}
    </div>
  );
};
