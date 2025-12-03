import { ReactNode } from "react";
import { CopyButton } from "./CopyButton";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ResultSectionCardProps {
  title: string;
  icon: ReactNode;
  bgColor: string;
  children: ReactNode;
  copyText?: string;
  onDownloadPDF?: () => void;
}

export const ResultSectionCard = ({
  title,
  icon,
  bgColor,
  children,
  copyText,
  onDownloadPDF
}: ResultSectionCardProps) => {
  return (
    <div className={`${bgColor} rounded-xl p-5 shadow-sm border border-border/50`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon}
          <h4 className="text-base font-semibold text-foreground">{title}</h4>
        </div>
        <div className="flex gap-2">
          {copyText && <CopyButton text={copyText} label="Copy" />}
          {onDownloadPDF && (
            <Button variant="outline" size="sm" onClick={onDownloadPDF} className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              PDF
            </Button>
          )}
        </div>
      </div>
      <div className="text-sm text-foreground/90">{children}</div>
    </div>
  );
};
