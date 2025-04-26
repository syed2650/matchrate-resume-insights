
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import { getATSScoreExplanation, getATSScoreDetail, getATSScoreFromCache } from "./utils";
import { useResumeVersion } from "./hooks/useResumeVersion";
import { generateDocument } from "./utils/docGenerator";
import { ExportInfo } from "./components/ExportInfo";
import ResumeHeader from "./components/ResumeHeader";
import ResumeContent from "./components/ResumeContent";

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
}

const ResumeRewrite: React.FC<ResumeRewriteProps> = ({ 
  rewrittenResume, 
  atsScores = {},
  scoreHash = null,
  jobContext
}) => {
  const { toast } = useToast();
  const [stableAtsScores, setStableAtsScores] = useState<Record<string, number>>(atsScores);
  
  const { 
    currentResume, 
    generatedTimestamp 
  } = useResumeVersion({ rewrittenResume, activeVersion: "general" });
  
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

  const currentAtsScore = (typeof stableAtsScores === 'object' && Object.values(stableAtsScores)[0]) || 0;
    
  const roleSummaryMatch = currentResume.match(/This resume is optimized for(?: a)?:? (.*?)(\n|$)/);
  const roleSummary = roleSummaryMatch ? roleSummaryMatch[1].trim() : "";

  const isInterviewReady = currentAtsScore >= 75;

  const handleCopyToClipboard = () => {
    if (currentResume) {
      navigator.clipboard.writeText(currentResume);
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
        "general",
        false
      );
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `optimized-resume.docx`;
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
      
      doc.save(`optimized-resume.pdf`);
      
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

  if (!rewrittenResume) {
    return (
      <div className="py-8 text-center">
        <p className="text-slate-600">No rewritten resume available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ResumeHeader
        currentAtsScore={currentAtsScore}
        roleSummary={roleSummary}
        generatedTimestamp={generatedTimestamp}
        isInterviewReady={isInterviewReady}
        onCopy={handleCopyToClipboard}
        onDownloadDocx={handleDownloadDocx}
        onDownloadPdf={handleDownloadPdf}
      />
      
      <ResumeContent
        currentResume={currentResume}
        jobContext={jobContext}
      />
      
      <ExportInfo />
      
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
              <strong>About ATS Scores:</strong> AI analysis is based on keyword matching between your resume and the job description. The score reflects how well your resume aligns with the key requirements in the job posting.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeRewrite;
