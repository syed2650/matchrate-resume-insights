import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowUp } from "lucide-react";
import { getATSScoreFromCache, canUseRewrite, trackRewriteUsage } from "./utils";
import { useResumeVersion } from "./hooks/useResumeVersion";
import { Document, Packer, Paragraph, TextRun } from "docx";
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

const formatResumeContent = (content: string): string => {
  if (!content) return "";
  try {
    return content
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^(#+\s*)(.*?)$/gm, (_, hash, title) => `${hash}${title.toUpperCase()}`)
      .replace(/^\s*-\s+/gm, '• ')
      .replace(/^---$/gm, '--------------------')
      .replace(/^Optimized Resume(\n|$)/g, '')
      .replace(/^This resume is optimized for(?: a)?:? (.*?)(\n|$)/g, '');
  } catch (error) {
    console.error("Error formatting resume content:", error);
    return content || "";
  }
};

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
  const [canRewrite, setCanRewrite] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const { currentResume: rawResume, generatedTimestamp } = useResumeVersion({ rewrittenResume, activeVersion: "general" });

  const currentResume = formatResumeContent(rawResume);

  useEffect(() => {
    if (scoreHash) {
      const cachedScore = getATSScoreFromCache(scoreHash);
      if (cachedScore) setStableAtsScores(cachedScore.scores);
      else if (Object.keys(atsScores).length > 0) setStableAtsScores(atsScores);
    } else if (Object.keys(atsScores).length > 0) setStableAtsScores(atsScores);
    setCanRewrite(canUseRewrite());
  }, [scoreHash, atsScores]);

  const currentAtsScore = (typeof stableAtsScores === 'object' && Object.values(stableAtsScores)[0]) || 0;
  const scoreDifference = currentAtsScore - originalATSScore;

  const extractRoleSummary = () => {
    if (!rawResume) return "";
    const match = rawResume.match(/This resume is optimized for(?: a)?:? (.*?)(\n|$)/) ||
                  rawResume.match(/Optimized for(?: a)?:? (.*?)(\n|$)/);
    return match ? match[1].trim() : "";
  };

  const roleSummary = extractRoleSummary();
  const isInterviewReady = currentAtsScore >= 75;

  const handleCopyToClipboard = () => {
    if (!canRewrite || !currentResume) {
      toast({ title: "Error", description: "No resume content available to copy", variant: "destructive" });
      return;
    }
    navigator.clipboard.writeText(currentResume);
    trackRewriteUsage();
    toast({ title: "Success", description: "Resume copied to clipboard" });
  };

  // Simplified DOCX generation that uses exactly what's shown in the UI
  const generateSimpleDocx = async (content: string) => {
    if (!content) return null;
    
    try {
      // Create a simple document with the raw content
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: content,
                  size: 24
                })
              ],
              spacing: { line: 360 }
            })
          ]
        }]
      });
      return await Packer.toBlob(doc);
    } catch (error) {
      console.error("Error generating DOCX:", error);
      return null;
    }
  };

  const handleDownloadDocx = async () => {
    if (!canRewrite || !currentResume) {
      toast({ title: "Error", description: "No resume content available to download", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    
    try {
      const docBlob = await generateSimpleDocx(currentResume);
      if (!docBlob) {
        throw new Error("Failed to generate document");
      }
      
      // Create a download link
      const url = URL.createObjectURL(docBlob);
      const a = document.createElement("a");
      a.href = url;
      
      // Set filename - with date and role if available
      const dateStr = new Date().toISOString().split('T')[0];
      const roleStr = roleSummary ? `-${roleSummary.replace(/\s+/g, '-')}` : '';
      a.download = `optimized-resume${roleStr}-${dateStr}.docx`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      trackRewriteUsage();
      toast({ title: "Success", description: "Resume downloaded successfully" });
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast({ title: "Error", description: "Failed to download resume", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!rewrittenResume) {
    return <div className="py-8 text-center"><p className="text-slate-600">No rewritten resume available.</p></div>;
  }

  return (
    <div className="space-y-6">
      {!canRewrite && <UpgradeBanner feature="resume rewriting" limit="15 rewrites per month" />}
      <div className="bg-green-50 border border-green-100 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-green-100 p-2 rounded-full"><CheckCircle className="h-6 w-6 text-green-600" /></div>
          <h3 className="text-lg font-semibold text-green-800">Resume Successfully Optimized</h3>
        </div>
        <p className="text-green-700 mb-4">Your resume has been rewritten to improve your chances of getting an interview.</p>
      </div>
      <ResumeHeader
        currentAtsScore={currentAtsScore}
        roleSummary={roleSummary}
        generatedTimestamp={generatedTimestamp}
        isInterviewReady={isInterviewReady}
        onCopy={handleCopyToClipboard}
        onDownload={handleDownloadDocx}
        isPremiumLocked={!canRewrite}
      />
      {isProcessing && <div className="bg-blue-50 p-4 border border-blue-100 rounded-lg"><h4 className="text-blue-800 font-medium mb-2">Processing Your Resume</h4><Progress value={50} className="h-2 mb-2" /><p className="text-blue-700 text-sm">Please wait while we prepare your document...</p></div>}
      <ResumeContent currentResume={currentResume} jobContext={jobContext} isPremiumBlurred={!canRewrite} />
      {canRewrite ? <ExportInfo /> : <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg"><h3 className="font-medium text-amber-800">Premium Feature</h3><p className="text-sm text-amber-700 mt-1">Resume rewriting is available on our paid plan with 15 rewrites per month. Upgrade to access this feature.</p></div>}
    </div>
  );
};

export default ResumeRewrite;
