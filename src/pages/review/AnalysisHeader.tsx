
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";

interface AnalysisHeaderProps {
  onReset: () => void;
  onExportPDF: () => void;
}

const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({ onReset, onExportPDF }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold text-slate-900">
        Analysis Results
      </h2>
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onReset}
        >
          <Upload className="mr-2 h-4 w-4" />
          Review Another
        </Button>
        <Button
          variant="outline"
          onClick={onExportPDF}
          className="flex items-center"
        >
          <FileText className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </div>
  );
};

export default AnalysisHeader;
