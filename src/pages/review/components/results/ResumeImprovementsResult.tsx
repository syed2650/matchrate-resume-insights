import { 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  RefreshCw, 
  Zap,
  Search,
  ArrowRight 
} from "lucide-react";
import { ResultSectionCard } from "../ui/ResultSectionCard";
import { DownloadPDFButton } from "../ui/DownloadPDFButton";
import { CopyButton } from "../ui/CopyButton";
import { stripMarkdown, stripMarkdownLine } from "../../utils/stripMarkdown";

interface ResumeImprovementsResultProps {
  content: string;
}

interface ParsedSection {
  title: string;
  content: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
}

export const ResumeImprovementsResult = ({ content }: ResumeImprovementsResultProps) => {
  
  const parseContent = (raw: string): ParsedSection[] => {
    const sections: ParsedSection[] = [];
    const parts = raw.split(/(?=###?\s)/);
    
    parts.forEach(part => {
      const lines = part.trim().split('\n');
      const titleLine = stripMarkdownLine(lines[0]?.replace(/^#+\s*/, '').trim());
      const body = lines.slice(1).join('\n').trim();
      
      if (!titleLine || !body) return;
      
      const lowerTitle = titleLine.toLowerCase();
      
      let icon = <FileText className="h-5 w-5 text-blue-600" />;
      let gradientFrom = "from-blue-50";
      let gradientTo = "to-indigo-50/50";
      let borderColor = "border-blue-200/60";
      
      if (lowerTitle.includes('summary')) {
        icon = <FileText className="h-5 w-5 text-blue-600" />;
        gradientFrom = "from-blue-50";
        gradientTo = "to-sky-50/50";
        borderColor = "border-blue-200/60";
      } else if (lowerTitle.includes('bullet')) {
        icon = <Sparkles className="h-5 w-5 text-emerald-600" />;
        gradientFrom = "from-emerald-50";
        gradientTo = "to-teal-50/50";
        borderColor = "border-emerald-200/60";
      } else if (lowerTitle.includes('weak') || lowerTitle.includes('filler')) {
        icon = <AlertTriangle className="h-5 w-5 text-amber-600" />;
        gradientFrom = "from-amber-50";
        gradientTo = "to-yellow-50/50";
        borderColor = "border-amber-200/60";
      } else if (lowerTitle.includes('impact')) {
        icon = <TrendingUp className="h-5 w-5 text-violet-600" />;
        gradientFrom = "from-violet-50";
        gradientTo = "to-purple-50/50";
        borderColor = "border-violet-200/60";
      } else if (lowerTitle.includes('redundancy')) {
        icon = <RefreshCw className="h-5 w-5 text-rose-600" />;
        gradientFrom = "from-rose-50";
        gradientTo = "to-pink-50/50";
        borderColor = "border-rose-200/60";
      } else if (lowerTitle.includes('action') || lowerTitle.includes('verb')) {
        icon = <Zap className="h-5 w-5 text-teal-600" />;
        gradientFrom = "from-teal-50";
        gradientTo = "to-cyan-50/50";
        borderColor = "border-teal-200/60";
      } else if (lowerTitle.includes('gap')) {
        icon = <Search className="h-5 w-5 text-slate-600" />;
        gradientFrom = "from-slate-100";
        gradientTo = "to-gray-50/50";
        borderColor = "border-slate-200/60";
      }
      
      sections.push({ title: titleLine, content: body, icon, gradientFrom, gradientTo, borderColor });
    });
    
    return sections;
  };
  
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      
      const cleanLine = stripMarkdownLine(trimmed);
      
      // Handle Before/After formatting with visual treatment
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
      
      // Handle bullet points
      if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
        const bulletText = stripMarkdownLine(trimmed.replace(/^[-•*]\s*/, ''));
        return (
          <div key={idx} className="flex gap-3 py-1.5 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
            <span>{bulletText}</span>
          </div>
        );
      }
      
      // Handle numbered items
      if (/^\d+\./.test(trimmed)) {
        const numberedText = stripMarkdownLine(trimmed);
        return <p key={idx} className="py-1.5">{numberedText}</p>;
      }
      
      return <p key={idx} className="py-1">{cleanLine}</p>;
    });
  };
  
  const sections = parseContent(content);
  const cleanContent = stripMarkdown(content);
  
  if (sections.length === 0) {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2 mb-4">
          <CopyButton text={cleanContent} label="Copy All" />
          <DownloadPDFButton content={cleanContent} filename="resume-improvements" title="Resume Improvements" />
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
        <DownloadPDFButton content={cleanContent} filename="resume-improvements" title="Resume Improvements" />
      </div>
      
      {sections.map((section, idx) => (
        <ResultSectionCard
          key={idx}
          title={section.title}
          icon={section.icon}
          gradientFrom={section.gradientFrom}
          gradientTo={section.gradientTo}
          borderColor={section.borderColor}
          copyText={stripMarkdown(section.content)}
        >
          <div className="leading-relaxed">{renderContent(section.content)}</div>
        </ResultSectionCard>
      ))}
    </div>
  );
};
