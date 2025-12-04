import { 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  RefreshCw, 
  Zap,
  Search 
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
  bgColor: string;
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
      let bgColor = "bg-blue-50";
      
      if (lowerTitle.includes('summary')) {
        icon = <FileText className="h-5 w-5 text-blue-600" />;
        bgColor = "bg-blue-50";
      } else if (lowerTitle.includes('bullet')) {
        icon = <Sparkles className="h-5 w-5 text-green-600" />;
        bgColor = "bg-green-50";
      } else if (lowerTitle.includes('weak') || lowerTitle.includes('filler')) {
        icon = <AlertTriangle className="h-5 w-5 text-yellow-600" />;
        bgColor = "bg-yellow-50";
      } else if (lowerTitle.includes('impact')) {
        icon = <TrendingUp className="h-5 w-5 text-purple-600" />;
        bgColor = "bg-purple-50";
      } else if (lowerTitle.includes('redundancy')) {
        icon = <RefreshCw className="h-5 w-5 text-red-600" />;
        bgColor = "bg-red-50";
      } else if (lowerTitle.includes('action') || lowerTitle.includes('verb')) {
        icon = <Zap className="h-5 w-5 text-teal-600" />;
        bgColor = "bg-teal-50";
      } else if (lowerTitle.includes('gap')) {
        icon = <Search className="h-5 w-5 text-slate-600" />;
        bgColor = "bg-slate-100";
      }
      
      sections.push({ title: titleLine, content: body, icon, bgColor });
    });
    
    return sections;
  };
  
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      
      // Strip markdown from line
      const cleanLine = stripMarkdownLine(trimmed);
      
      // Handle Before/After formatting (clean version)
      if (trimmed.toLowerCase().includes('before:') || trimmed.toLowerCase().includes('after:')) {
        const isAfter = trimmed.toLowerCase().includes('after:');
        const label = isAfter ? 'After:' : 'Before:';
        const value = cleanLine.replace(/^(before|after):\s*/i, '');
        return (
          <p key={idx} className="ml-2 py-0.5">
            <strong className={`font-semibold ${isAfter ? 'text-green-700' : 'text-slate-600'}`}>{label}</strong>{' '}
            <span>{value}</span>
          </p>
        );
      }
      
      // Handle bullet points
      if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
        const bulletText = stripMarkdownLine(trimmed.replace(/^[-•*]\s*/, ''));
        return (
          <div key={idx} className="flex gap-2 ml-2 py-0.5">
            <span className="text-muted-foreground">•</span>
            <span>{bulletText}</span>
          </div>
        );
      }
      
      // Handle numbered items
      if (/^\d+\./.test(trimmed)) {
        const numberedText = stripMarkdownLine(trimmed);
        return <p key={idx} className="ml-2 py-0.5">{numberedText}</p>;
      }
      
      return <p key={idx} className="py-0.5">{cleanLine}</p>;
    });
  };
  
  const sections = parseContent(content);
  const cleanContent = stripMarkdown(content);
  
  if (sections.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2 mb-4">
          <CopyButton text={cleanContent} label="Copy All" />
          <DownloadPDFButton content={cleanContent} filename="resume-improvements" title="Resume Improvements" />
        </div>
        <div className="bg-blue-50 rounded-xl p-5 shadow-sm">
          <div className="text-sm leading-relaxed">{renderContent(content)}</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <CopyButton text={cleanContent} label="Copy All" />
        <DownloadPDFButton content={cleanContent} filename="resume-improvements" title="Resume Improvements" />
      </div>
      
      {sections.map((section, idx) => (
        <ResultSectionCard
          key={idx}
          title={section.title}
          icon={section.icon}
          bgColor={section.bgColor}
          copyText={stripMarkdown(section.content)}
        >
          <div className="leading-relaxed">{renderContent(section.content)}</div>
        </ResultSectionCard>
      ))}
    </div>
  );
};
