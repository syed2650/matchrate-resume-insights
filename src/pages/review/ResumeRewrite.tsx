
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, FileText, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { getATSScoreExplanation, getATSScoreDetail } from "./utils";
import VersionSelector from "./components/VersionSelector";
import SuggestedBullets from "./components/SuggestedBullets";
import { useResumeVersion } from "./hooks/useResumeVersion";
import { generateDocument } from "./utils/docGenerator";

interface ResumeRewriteProps {
  rewrittenResume: any;
  atsScores?: Record<string, number>;
}

const ResumeRewrite: React.FC<ResumeRewriteProps> = ({ rewrittenResume, atsScores = {} }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [activeVersion, setActiveVersion] = useState<string>("startup");

  const { 
    hasMultipleVersions, 
    currentResume, 
    suggestedBulletPoints, 
    generatedTimestamp 
  } = useResumeVersion({ rewrittenResume, activeVersion });

  const currentAtsScore = hasMultipleVersions
    ? atsScores[activeVersion] || 0
    : (typeof atsScores === 'object' && Object.values(atsScores)[0]) || 0;
    
  const roleSummaryMatch = currentResume.match(/This resume is optimized for(?: a)?:? (.*?)(\n|$)/);
  const roleSummary = roleSummaryMatch ? roleSummaryMatch[1].trim() : "";

  const handleCopyToClipboard = () => {
    if (currentResume) {
      navigator.clipboard.writeText(currentResume).then(() => {
        setCopied(true);
        toast({
          title: "Success",
          description: "Resume copied to clipboard",
        });
        
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy resume to clipboard",
          variant: "destructive"
        });
      });
    }
  };

  const handleDownloadDocx = async () => {
    if (!currentResume) return;
    
    try {
      const blob = await generateDocument(
        currentResume,
        roleSummary,
        currentAtsScore,
        generatedTimestamp,
        activeVersion,
        hasMultipleVersions
      );
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const versionLabel = hasMultipleVersions ? `-${activeVersion}` : '';
      link.href = url;
      link.download = `matchrate-optimized-resume${versionLabel}.docx`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Resume downloaded as DOCX",
      });
    } catch (error) {
      console.error("DOCX generation error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate DOCX file. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getAtsScoreBadge = (score: number) => {
    if (score >= 80) {
      return <Badge className="bg-green-600 hover:bg-green-700 ml-2">ATS Score: {score}</Badge>;
    } else if (score >= 60) {
      return <Badge className="bg-amber-600 hover:bg-amber-700 ml-2">ATS Score: {score}</Badge>;
    } else {
      return <Badge className="bg-red-600 hover:bg-red-700 ml-2">ATS Score: {score}</Badge>;
    }
  };

  if (!rewrittenResume) {
    return (
      <div className="py-8 text-center">
        <p className="text-slate-600">No rewritten resume available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 flex items-center">
            {hasMultipleVersions 
              ? "Tailored Resume Versions" 
              : "Resume Analysis"}
            {currentAtsScore > 0 && getAtsScoreBadge(currentAtsScore)}
          </h3>
          
          {roleSummary && (
            <div className="mt-1 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-3 py-1 inline-block">
              {roleSummary}
            </div>
          )}

          {generatedTimestamp && (
            <div className="mt-1 text-xs text-slate-500">
              Generated on {generatedTimestamp}
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={handleCopyToClipboard}>
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleDownloadDocx}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <FileText className="h-4 w-4 mr-2" />
            Download .docx
          </Button>
        </div>
      </div>
      
      {hasMultipleVersions && (
        <VersionSelector 
          activeVersion={activeVersion}
          atsScores={atsScores}
          onVersionChange={setActiveVersion}
        />
      )}
      
      <div className="border rounded-xl p-6 bg-white shadow-md overflow-auto max-h-[600px]">
        <pre className="whitespace-pre-wrap text-slate-700 font-sans text-sm leading-relaxed">
          {currentResume}
        </pre>
      </div>
      
      <SuggestedBullets bullets={suggestedBulletPoints} />
      
      {currentAtsScore > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-2">
            <h4 className="font-semibold text-blue-800">ATS Compatibility: {currentAtsScore}/100</h4>
            <Badge className="ml-2 bg-blue-200 text-blue-800 hover:bg-blue-300">
              🔒 Score locked until resume changes
            </Badge>
          </div>
          <p className="text-blue-700 text-sm">
            {getATSScoreExplanation(currentAtsScore)}
          </p>
          <p className="text-blue-600 text-xs mt-2">
            {getATSScoreDetail(currentAtsScore)}
          </p>
          {generatedTimestamp && (
            <div className="mt-3 text-xs text-blue-500 italic">
              Score generated on {generatedTimestamp}
            </div>
          )}
          <div className="mt-3 p-3 bg-white rounded border border-blue-100 text-xs text-slate-600">
            <p>
              <strong>About ATS Scores:</strong> AI analysis is based on your most recent inputs. ATS compatibility reflects structure, keywords, and formatting. Score won't change unless your resume does.
            </p>
          </div>
        </div>
      )}
      
      {hasMultipleVersions && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
          <h4 className="font-semibold text-slate-800 mb-2">About This Version</h4>
          <p className="text-slate-700 text-sm">
            {activeVersion === 'startup' && 'Optimized for startup environments. Emphasizes versatility, hands-on execution, and cross-functional skills.'}
            {activeVersion === 'enterprise' && 'Tailored for enterprise roles. Highlights process knowledge, scalability expertise, and enterprise-level impact.'}
            {activeVersion === 'consulting' && 'Crafted for consulting positions. Focuses on client management, adaptability, and structured problem-solving.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumeRewrite;
