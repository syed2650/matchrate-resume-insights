
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { canUseRewrite, trackRewriteUsage, getATSScoreFromCache } from "./utils";
import { useResumeVersion } from "./hooks/useResumeVersion";
import ResumeHeader from "./components/ResumeHeader";
import ResumeContent from "./components/ResumeContent";
import UpgradeBanner from "./components/UpgradeBanner";
import { ExportInfo } from "./components/ExportInfo";
import ResumeOptimizedAlert from "./components/ResumeOptimizedAlert";
import ResumeCopyButton from "./components/ResumeCopyButton";
import ResumeDownloadButton from "./components/ResumeDownloadButton";
import { formatResumeContent, extractRoleSummary } from "./utils/resumeFormatter";
import { ResumeRewriteProps } from "./types";

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

  const { currentResume: rawResume, generatedTimestamp } = useResumeVersion({ 
    rewrittenResume, 
    activeVersion: "general" 
  });

  const currentResume = formatResumeContent(rawResume);
  const roleSummary = extractRoleSummary(rawResume);
  
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
  const isInterviewReady = currentAtsScore >= 75;

  if (!rewrittenResume) {
    return <div className="py-8 text-center"><p className="text-slate-600">No rewritten resume available.</p></div>;
  }

  return (
    <div className="space-y-6">
      {!canRewrite && <UpgradeBanner feature="resume rewriting" limit="15 rewrites per month" />}
      <ResumeOptimizedAlert />
      
      <ResumeHeader
        currentAtsScore={currentAtsScore}
        roleSummary={roleSummary}
        generatedTimestamp={generatedTimestamp}
        isInterviewReady={isInterviewReady}
        onCopy={() => {}}  // This will be handled by the ResumeCopyButton component
        onDownload={() => {}} // This will be handled by the ResumeDownloadButton component
        isPremiumLocked={!canRewrite}
      />
      
      <div className="flex gap-2 w-full">
        <ResumeCopyButton currentResume={currentResume} disabled={!canRewrite} />
        <ResumeDownloadButton 
          currentResume={currentResume} 
          roleSummary={roleSummary} 
          disabled={!canRewrite} 
        />
      </div>

      <ResumeContent currentResume={currentResume} jobContext={jobContext} isPremiumBlurred={!canRewrite} />
      
      {canRewrite ? <ExportInfo /> : (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <h3 className="font-medium text-amber-800">Premium Feature</h3>
          <p className="text-sm text-amber-700 mt-1">
            Resume rewriting is available on our paid plan with 15 rewrites per month. Upgrade to access this feature.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumeRewrite;
