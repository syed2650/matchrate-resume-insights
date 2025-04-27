
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowUp } from "lucide-react";
import { getATSScoreExplanation, getATSScoreDetail, getATSScoreFromCache, canUseRewrite, trackRewriteUsage } from "./utils";
import { useResumeVersion } from "./hooks/useResumeVersion";
import { generateDocument } from "./utils/docGenerator";
import { ExportInfo } from "./components/ExportInfo";
import ResumeHeader from "./components/ResumeHeader";
import ResumeContent from "./components/ResumeContent";
import UpgradeBanner from "./components/UpgradeBanner";
import { Progress } from "@/components/ui/progress";

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
  originalResume?: string;
  jobDescription?: string;
  originalATSScore?: number;
}

const ResumeRewrite: React.FC<ResumeRewriteProps> = ({ 
  rewrittenResume, 
  atsScores = {},
  scoreHash = null,
  jobContext,
  originalResume,
  jobDescription,
  originalATSScore = 0
}) => {
  const { toast } = useToast();
  const [stableAtsScores, setStableAtsScores] = useState<Record<string, number>>(atsScores);
  const [canRewrite, setCanRewrite] = useState<boolean>(true); // Setting to true to disable premium restrictions
  
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
    
    // Always allow rewrite for now
    setCanRewrite(true);
  }, [scoreHash, atsScores]);

  const currentAtsScore = (typeof stableAtsScores === 'object' && Object.values(stableAtsScores)[0]) || 0;
  const scoreDifference = currentAtsScore - originalATSScore;
  
  const roleSummaryMatch = currentResume.match(/This resume is optimized for(?: a)?:? (.*?)(\n|$)/);
  const roleSummary = roleSummaryMatch ? roleSummaryMatch[1].trim() : "";

  const isInterviewReady = currentAtsScore >= 75;

  const handleCopyToClipboard = () => {
    if (!canRewrite) {
      toast({
        title: "Premium Feature",
        description: "Resume rewriting is available on the paid plan",
        variant: "default"
      });
      return;
    }
    
    if (currentResume) {
      navigator.clipboard.writeText(currentResume);
      trackRewriteUsage();
      toast({
        title: "Success",
        description: "Resume copied to clipboard",
      });
    }
  };

  const handleDownloadDocx = async () => {
    if (!canRewrite) {
      toast({
        title: "Premium Feature",
        description: "Resume exporting is available on the paid plan",
        variant: "default"
      });
      return;
    }
    
    if (!currentResume) return;
    
    try {
      trackRewriteUsage();
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
    if (!canRewrite) {
      toast({
        title: "Premium Feature",
        description: "Resume exporting is available on the paid plan",
        variant: "default"
      });
      return;
    }
    
    if (!currentResume) return;
    
    try {
      trackRewriteUsage();
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
      {!canRewrite && <UpgradeBanner feature="resume rewriting" limit="15 rewrites per month" />}
      
      <div className="bg-green-50 border border-green-100 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-green-100 p-2 rounded-full">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-800">Resume Successfully Optimized</h3>
        </div>
        
        <p className="text-green-700 mb-4">
          Your resume has been rewritten to improve your chances of getting an interview. The optimized version addresses the feedback
          from the analysis and is formatted to be ATS-friendly.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg border border-green-100">
            <div className="text-sm text-slate-600 mb-1">ATS Compatibility Score</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-slate-800">{currentAtsScore}/100</div>
              {scoreDifference > 0 && (
                <div className="flex items-center text-green-600 text-sm">
                  <ArrowUp className="h-4 w-4" />
                  +{scoreDifference} improvement
                </div>
              )}
            </div>
            <div className="mt-1 mb-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${currentAtsScore}%` }}
              ></div>
            </div>
            <div className="text-xs text-slate-500">
              {isInterviewReady ? 'Your resume is now interview-ready!' : 'Significant improvement from your original resume'}
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-green-100">
            <div className="text-sm text-slate-600 mb-1">Key Improvements</div>
            <ul className="text-xs text-slate-700 space-y-1">
              <li className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Enhanced professional summary
              </li>
              <li className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Added relevant keywords for ATS optimization
              </li>
              <li className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Strengthened bullet points with quantifiable achievements
              </li>
              <li className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Improved formatting for better readability
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <ResumeHeader
        currentAtsScore={currentAtsScore}
        roleSummary={roleSummary}
        generatedTimestamp={generatedTimestamp}
        isInterviewReady={isInterviewReady}
        onCopy={handleCopyToClipboard}
        onDownloadDocx={handleDownloadDocx}
        onDownloadPdf={handleDownloadPdf}
        isPremiumLocked={!canRewrite}
      />
      
      <ResumeContent
        currentResume={currentResume}
        jobContext={jobContext}
        isPremiumBlurred={!canRewrite}
      />
      
      {canRewrite ? <ExportInfo /> : (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <h3 className="font-medium text-amber-800">Premium Feature</h3>
          <p className="text-sm text-amber-700 mt-1">
            Resume rewriting is available on our paid plan with 15 rewrites per month.
            Upgrade to access this feature.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumeRewrite;
