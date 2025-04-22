
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Upload, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalysisHeaderProps {
  onReset: () => void;
  onExportPDF: () => void;
  activeTab: 'analysis' | 'rewrite';
  setActiveTab: (tab: 'analysis' | 'rewrite') => void;
  hasRewrite: boolean;
}

const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({ 
  onReset, 
  onExportPDF, 
  activeTab, 
  setActiveTab,
  hasRewrite
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">
          Resume Analysis
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
      
      {hasRewrite && (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'analysis' | 'rewrite')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="rewrite">Resume Rewrite</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
    </div>
  );
};

export default AnalysisHeader;
