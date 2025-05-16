import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useResumeVersion } from "./hooks/useResumeVersion";
import ResumeHeader from "./components/ResumeHeader";
import ResumeContent from "./components/ResumeContent";
import UpgradeBanner from "./components/UpgradeBanner";
import { ExportInfo } from "./components/ExportInfo";
import ResumeOptimizedAlert from "./components/ResumeOptimizedAlert";
import ResumeCopyButton from "./components/ResumeCopyButton";
import ResumeDownloadButton from "./components/ResumeDownloadButton";
import { formatResumeContent, extractRoleSummary, extractExperienceBullets, generateRewritePrompt } from "./utils/resumeFormatter";
import { ResumeRewriteProps } from "./types";
import PremiumFeatureModal from "./components/PremiumFeatureModal";

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
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [rewrittenBullets, setRewrittenBullets] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const { currentResume: rawResume } = useResumeVersion({ 
    rewrittenResume, 
    activeVersion: "general" 
  });

  const currentResume = formatResumeContent(rawResume);
  const roleSummary = extractRoleSummary(rawResume);

  const rewriteBullets = async (jobRole?: string) => {
    const bullets = extractExperienceBullets(currentResume);
    setIsProcessing(true);
    try {
      const rewritten = await Promise.all(
        bullets.map(async (bullet) => {
          const prompt = generateRewritePrompt(bullet, jobRole || jobContext || roleSummary || "Professional Role");
          const response = await fetch("https://rodkrpeqxgqizngdypbl.supabase.co/functions/v1/rewrite-resume", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
          });
          const data = await response.json();
          return data?.result || bullet;
        })
      );
      setRewrittenBullets(rewritten);
    } catch (error) {
      toast({ title: "Error rewriting bullets", description: `${error}` });
    }
    setIsProcessing(false);
  };

  useEffect(() => {
    rewriteBullets();
  }, []);

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    rewriteBullets(role);
  };

  return (
    <div>
      <ResumeHeader />
      {rewrittenBullets.length > 0 ? (
        <ResumeContent bullets={rewrittenBullets} jobRole={selectedRole} onRoleChange={handleRoleChange} />
      ) : (
        <p>Generating improved resume content...</p>
      )}
    </div>
  );
};

export default ResumeRewrite;
