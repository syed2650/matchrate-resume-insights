import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowUp } from "lucide-react";
import { getATSScoreFromCache, canUseRewrite, trackRewriteUsage } from "./utils";
import { useResumeVersion } from "./hooks/useResumeVersion";
import { generateDocument } from "./utils/docGenerator";
import { ExportInfo } from "./components/ExportInfo";
import ResumeHeader from "./components/ResumeHeader";
import ResumeContent from "./components/ResumeContent";
import UpgradeBanner from "./components/UpgradeBanner";
import { Progress } from "@/components/ui/progress";
import { parseResumeForPdf } from "./utils/parseResumeForPdf";
import { downloadResumeAsPdf } from "./utils/downloadResumeAsPdf";
import { pdf } from "@react-pdf/renderer";
import ResumePdfTemplate from "@/src/pages/review/components/ResumePdfTemplate";


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
    let formattedContent = content;
    
    formattedContent = formattedContent
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      
      .replace(/^(#+\s*)(.*?)$/gm, (match, hash, title) => {
        return `${hash}${title.toUpperCase()}`;
      })
      
      .replace(/^\s*-\s+/gm, '• ')
      
      .replace(/^---$/gm, '--------------------')
      
      .replace(/^Optimized Resume(\n|$)/g, '')
      .replace(/^This resume is optimized for(?: a)?:? (.*?)(\n|$)/g, '');
      
    if (formattedContent && typeof formattedContent === 'string') {
      return formattedContent;
    } else {
      console.error("Invalid formatted content:", formattedContent);
      return content || "";
    }
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
  
  const { 
    currentResume: rawResume, 
    generatedTimestamp 
  } = useResumeVersion({ rewrittenResume, activeVersion: "general" });
  
  const currentResume = formatResumeContent(rawResume);
  
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
    
    setCanRewrite(canUseRewrite());
  }, [scoreHash, atsScores]);

  useEffect(() => {
    if (rawResume === null || rawResume === undefined) {
      console.warn("No resume content available");
    } else if (rawResume.length < 10) {
      console.warn("Resume content too short:", rawResume);
    }
  }, [rawResume]);

  const currentAtsScore = (typeof stableAtsScores === 'object' && Object.values(stableAtsScores)[0]) || 0;
  const scoreDifference = currentAtsScore - originalATSScore;
  
  const extractRoleSummary = () => {
    if (!rawResume) return "";
    
    const pattern1 = /This resume is optimized for(?: a)?:? (.*?)(\n|$)/;
    const pattern2 = /Optimized for(?: a)?:? (.*?)(\n|$)/;
    const pattern3 = /^(Software Engineer|Product Manager|Data Analyst|UX Designer|Consultant)(\n|$)/;
    
    const match1 = rawResume.match(pattern1);
    if (match1) return match1[1].trim();
    
    const match2 = rawResume.match(pattern2);
    if (match2) return match2[1].trim();
    
    const match3 = rawResume.match(pattern3);
    if (match3) return match3[1].trim();
    
    return "";
  };
  
  const roleSummary = extractRoleSummary();
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
    } else {
      toast({
        title: "Error",
        description: "No resume content available to copy",
        variant: "destructive"
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
    
    if (!currentResume) {
      toast({
        title: "Error",
        description: "No resume content available to download",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      trackRewriteUsage();
      
      const docBlob = await generateDocument(
        currentResume,
        roleSummary,
        currentAtsScore,
        generatedTimestamp || new Date().toLocaleString(),
        "general",
        false
      );
      
      if (!docBlob) {
        throw new Error("Failed to generate DOCX document");
      }
      
      const url = URL.createObjectURL(docBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `interview-ready-resume.docx`;
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
        description: error instanceof Error ? error.message : "Failed to generate DOCX file",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDownloadPdf = async () => {
  if (!canRewrite) {
    toast({
      title: "Premium Feature",
      description: "Resume exporting is available on the paid plan",
      variant: "default"
    });
    return;
  }

  if (!currentResume) {
    toast({
      title: "Error",
      description: "No resume content available to download",
      variant: "destructive"
    });
    return;
  }

  try {
    setIsProcessing(true);
    trackRewriteUsage();

    // Build parsed resumeData dynamically (use same structure)
    const resumeData = parseResumeIntoData(currentResume);

    const blob = await pdf(<ResumePdfTemplate data={resumeData} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `interview-ready-resume.pdf`;
    link.click();
    URL.revokeObjectURL(url);

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
  } finally {
    setIsProcessing(false);
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
      
      {isProcessing && (
        <div className="bg-blue-50 p-4 border border-blue-100 rounded-lg mb-4">
          <h4 className="text-blue-800 font-medium mb-2">Processing Your Resume</h4>
          <Progress value={50} className="h-2 mb-2" />
          <p className="text-blue-700 text-sm">Please wait while we prepare your document...</p>
        </div>
      )}
      
      {(!currentResume || currentResume.length < 10) && (
        <div className="bg-amber-50 p-4 border border-amber-100 rounded-lg mb-4">
          <h4 className="text-amber-800 font-medium">Resume Content Issue</h4>
          <p className="text-amber-700 text-sm mt-1">
            There seems to be an issue with the resume content. Please try refreshing the page or resubmitting your resume for analysis.
          </p>
        </div>
      )}
      
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
