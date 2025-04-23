
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4">
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onReset} 
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        
        {hasRewrite && (
          <Tabs value={activeTab} className="w-auto">
            <TabsList>
              <TabsTrigger 
                value="analysis" 
                onClick={() => setActiveTab('analysis')}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Analysis
              </TabsTrigger>
              <TabsTrigger 
                value="rewrite" 
                onClick={() => setActiveTab('rewrite')}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Rewrite
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>
      
      <Button 
        variant="outline" 
        onClick={onExportPDF}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Export PDF
      </Button>
    </div>
  );
};

export default AnalysisHeader;
