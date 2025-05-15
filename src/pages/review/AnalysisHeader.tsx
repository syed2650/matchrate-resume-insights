
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalysisHeaderProps {
  onReset: () => void;
  onExportPDF: () => void;
  activeTab: 'analysis' | 'rewrite';
  setActiveTab: (tab: 'analysis' | 'rewrite') => void;
  hasRewrite: boolean;
  selectedRole?: string;
}

const AnalysisHeader = ({
  onReset,
  onExportPDF,
  activeTab,
  setActiveTab,
  hasRewrite,
  selectedRole
}: AnalysisHeaderProps) => {
  return (
    <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b">
      <div className="flex items-center justify-start gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 mr-2"
          onClick={onReset}
        >
          <ArrowLeft size={16} />
          <span>New Analysis</span>
        </Button>
        
        {hasRewrite && (
          <Tabs value={activeTab} className="w-full" onValueChange={(v) => setActiveTab(v as 'analysis' | 'rewrite')}>
            <TabsList className="grid w-[300px] grid-cols-2">
              <TabsTrigger value="analysis">Analysis Report</TabsTrigger>
              <TabsTrigger value="rewrite">
                Rewritten Resume
                {selectedRole && <span className="ml-1 text-xs opacity-70">({selectedRole})</span>}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>
      
      {activeTab === 'analysis' && (
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 border-blue-200 text-blue-600 hover:bg-blue-50"
          onClick={onExportPDF}
        >
          <FileText size={16} />
          <span>Download Feedback Report</span>
        </Button>
      )}
    </div>
  );
};

export default AnalysisHeader;
