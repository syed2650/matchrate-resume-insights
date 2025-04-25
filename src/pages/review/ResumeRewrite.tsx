import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, FileText, Check, FileType } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { jsPDF } from "jspdf";
import { getATSScoreExplanation, getATSScoreDetail, getATSScoreFromCache } from "./utils";
import VersionSelector from "./components/VersionSelector";
import SuggestedBullets from "./components/SuggestedBullets";
import { useResumeVersion } from "./hooks/useResumeVersion";
import { generateDocument } from "./utils/docGenerator";
import { ExportInfo } from "./components/ExportInfo";
import InterviewReadyIndicator from "./components/InterviewReadyIndicator";
import BulletRewriteSuggestions from "./components/BulletRewriteSuggestions";

interface ResumeRewriteProps {
  rewrittenResume: any;
  atsScores?: Record<string, number>;
  scoreHash?: string | null;
  jobContext?: {
    keywords: string[];
    responsibilities: string[];
    industry: string;
    tone: string;
  };
  jobSector?: string;
}

const ResumeRewrite: React.FC<ResumeRewriteProps> = ({ 
  rewrittenResume, 
  atsScores = {},
  scoreHash = null,
  jobContext,
  jobSector = "general"
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [activeVersion, setActiveVersion] = useState<string>(jobSector || "startup");
  const [stableAtsScores, setStableAtsScores] = useState<Record<string, number>>(atsScores);
  const [originalBullets, setOriginalBullets] = useState<string[]>([]);

  const { 
    hasMultipleVersions, 
    currentResume, 
    suggestedBulletPoints, 
    generatedTimestamp 
  } = useResumeVersion({ rewrittenResume, activeVersion });
  
  useEffect(() => {
    if (scoreHash) {
      const cachedScore = getATSScoreFromCache(scoreHash);
      if (cachedScore) {
        setStableAtsScores(cachedScore.scores);
      } else if (Object.keys(atsScores).length > 0) {
        setStableAtsScores(atsScores);
      }
    } else if (Object.keys(atsScores).length > 0) {
      setStableAtsScores(atsScores);
    }
  }, [scoreHash, atsScores]);

  useEffect(() => {
    const extractBullets = (text: string): string[] => {
      const bulletPattern = /^(?:\*|\-)\s+(.+?)$/gm;
      const bullets: string[] = [];
      let match;
      
      while ((match = bulletPattern.exec(text)) !== null) {
        if (match[1]) bullets.push(match[1]);
      }
      
      return bullets.slice(0, 5);
    };
    
    setOriginalBullets(extractBullets(currentResume));
  }, [currentResume]);

  const currentAtsScore = hasMultipleVersions
    ? stableAtsScores[activeVersion] || 0
    : (typeof stableAtsScores === 'object' && Object.values(stableAtsScores)[0]) || 0;
    
  const roleSummaryMatch = currentResume.match(/This resume is optimized for(?: a)?:? (.*?)(\n|$)/);
  const roleSummary = roleSummaryMatch ? roleSummaryMatch[1].trim() : "";

  const isInterviewReady = currentAtsScore >= 75;

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
  
  const handleDownloadPdf = () => {
    if (!currentResume) return;
    
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Optimized Resume", 20, 20);
      
      if (roleSummary) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "italic");
        doc.text(`Optimized for: ${roleSummary}`, 20, 30);
      }
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`ATS Compatibility Score: ${currentAtsScore}/100`, 20, 40);
      
      doc.setFontSize(11);
      const textLines = currentResume
        .replace(/#{1,3}\s+/g, "")
        .split("\n")
        .filter(line => line.trim() !== "");
      
      let yPosition = 55;
      
      textLines.forEach(line => {
        if (line.startsWith("* ") || line.startsWith("- ")) {
          line = "• " + line.substring(2);
        }
        
        const splitLines = doc.splitTextToSize(line, 170);
        doc.text(splitLines, 20, yPosition);
        yPosition += 7 * splitLines.length;
        
        if (line === line.toUpperCase() && line.length < 30) {
          yPosition += 3;
        }
        
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
      });
      
      if (generatedTimestamp) {
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on ${generatedTimestamp}`, 20, 290);
      }
      
      const versionLabel = hasMultipleVersions ? `-${activeVersion}` : '';
      doc.save(`matchrate-optimized-resume${versionLabel}.pdf`);
      
      toast({
        title: "Success",
        description: "Resume downloaded as PDF",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
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

  const renderJobContext = () => {
    if (!jobContext || (!jobContext.keywords?.length && !jobContext.industry)) {
      return null;
    }
    
    return (
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">Job Context Used to Optimize Resume</h4>
        {jobContext.industry && (
          <div className="mb-2">
            <span className="text-xs font-medium text-blue-700">Industry:</span> 
            <span className="text-xs ml-1">{jobContext.industry}</span>
          </div>
        )}
        {jobContext.tone && (
          <div className="mb-2">
            <span className="text-xs font-medium text-blue-700">Tone:</span> 
            <span className="text-xs ml-1">{jobContext.tone}</span>
          </div>
        )}
        {jobContext.keywords?.length > 0 && (
          <div className="mb-2">
            <span className="text-xs font-medium text-blue-700">Key Skills:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {jobContext.keywords.map((keyword, idx) => (
                <Badge key={idx} variant="outline" className="text-xs bg-white">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {jobContext.responsibilities?.length > 0 && (
          <div>
            <span className="text-xs font-medium text-blue-700">Core Responsibilities:</span>
            <ul className="text-xs mt-1 list-disc list-inside">
              {jobContext.responsibilities.map((resp, idx) => (
                <li key={idx}>{resp}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
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
          
          <Button 
            variant="outline" 
            onClick={handleDownloadPdf}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <FileType className="h-4 w-4 mr-2" />
            Download .pdf
          </Button>
        </div>
      </div>
      
      {hasMultipleVersions && (
        <VersionSelector 
          activeVersion={activeVersion}
          atsScores={stableAtsScores}
          onVersionChange={setActiveVersion}
        />
      )}
      
      <InterviewReadyIndicator isReady={isInterviewReady} score={currentAtsScore} />
      
      {renderJobContext()}
      
      <div className="border rounded-xl p-6 bg-white shadow-md overflow-auto max-h-[600px]">
        <pre className="whitespace-pre-wrap text-slate-700 font-sans text-sm leading-relaxed">
          {currentResume}
        </pre>
      </div>
      
      <ExportInfo />
      
      <BulletRewriteSuggestions 
        originalBullets={originalBullets} 
        suggestedBullets={suggestedBulletPoints} 
      />
      
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
            {activeVersion === 'saas' && 'Customized for SaaS companies. Emphasizes product knowledge, user experience, and growth metrics.'}
            {activeVersion === 'public' && 'Formatted for public sector positions. Highlights compliance, policy knowledge, and stakeholder management.'}
            {activeVersion === 'general' && 'Standard professional format suitable for most industries. Balanced emphasis on skills, experience, and achievements.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumeRewrite;
