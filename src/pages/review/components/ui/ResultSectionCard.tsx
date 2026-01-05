import { ReactNode, useState } from "react";
import { CopyButton } from "./CopyButton";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ResultSectionCardProps {
  title: string;
  icon: ReactNode;
  bgColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  borderColor?: string;
  children: ReactNode;
  copyText?: string;
  defaultOpen?: boolean;
  badge?: string | number;
}

export const ResultSectionCard = ({
  title,
  icon,
  bgColor,
  gradientFrom,
  gradientTo,
  borderColor = "border-border/40",
  children,
  copyText,
  defaultOpen = true,
  badge
}: ResultSectionCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const bgClasses = gradientFrom && gradientTo 
    ? `bg-gradient-to-br ${gradientFrom} ${gradientTo}` 
    : bgColor || 'bg-card';

  return (
    <div 
      className={`${bgClasses} rounded-2xl shadow-sm border ${borderColor} overflow-hidden transition-all duration-300 hover:shadow-md`}
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-black/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/80 rounded-xl shadow-sm backdrop-blur-sm">
            {icon}
          </div>
          <h4 className="text-base md:text-lg font-semibold text-foreground">{title}</h4>
          {badge !== undefined && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {copyText && (
            <div onClick={e => e.stopPropagation()}>
              <CopyButton text={copyText} label="Copy" />
            </div>
          )}
          <div className="p-1.5 rounded-lg hover:bg-black/5 transition-colors">
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </button>

      {/* Content */}
      <div 
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 md:px-5 pb-5 pt-0">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-inner">
            <div className="text-sm text-foreground/90 leading-relaxed">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
