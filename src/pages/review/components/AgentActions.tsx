import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { track } from "@/lib/mixpanel";
import { gtagEvent } from "@/lib/gtag";
import { Loader2 } from "lucide-react";
import { ResumeImprovementsResult } from "./results/ResumeImprovementsResult";
import { ATSAnalysisResult } from "./results/ATSAnalysisResult";
import { JDMatchResult } from "./results/JDMatchResult";
import { RoastCardResult } from "./results/RoastCardResult";
import { ExecutiveSummary } from "./results/ExecutiveSummary";
import { AnalysisTabsNavigation, AnalysisTab } from "./AnalysisTabsNavigation";

interface AgentActionsProps {
  resumeText: string;
  jobDescription: string;
  onReset: () => void;
  autoStart?: boolean;
}

interface RewriteResult {
  rewritten: string;
  notes: string;
  structured?: any;
}

interface ATSResult {
  score: number;
  scoreContext?: string;
  rejectionRisk?: string;
  badge?: string;
  why?: string[];
  riskDrivers?: string[];
  fixFirst?: string;
  issues: string[];
  keywordGaps: string[];
  fixes: string[];
  rawContent?: string;
  structured?: any;
}

interface JDMatchResultData {
  matchScore: number;
  matchVerdict?: string;
  missing?: any[];
  resumeLevelFixes?: any[];
  keywordsToAdd?: string[];
  missingSkills: string[];
  optimizedBullets: string[];
  rawContent?: string;
  structured?: any;
}

interface RoastResult {
  roast: string;
  scores: {
    formatting: number;
    clarity: number;
    impact: number;
    ats: number;
    overall: number;
  };
  shareText: string;
  shareUrl: string;
  rawContent?: string;
}

export const AgentActions = ({ resumeText, jobDescription, onReset, autoStart = true }: AgentActionsProps) => {
  const { toast } = useToast();
  const [loadingAgents, setLoadingAgents] = useState<Record<string, boolean>>({});
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<AnalysisTab>("summary");
  
  const [rewriteResult, setRewriteResult] = useState<RewriteResult | null>(null);
  const [atsResult, setATSResult] = useState<ATSResult | null>(null);
  const [jdMatchResult, setJDMatchResult] = useState<JDMatchResultData | null>(null);
  const [roastResult, setRoastResult] = useState<RoastResult | null>(null);

  const handleRewrite = async () => {
    setLoadingAgents(prev => ({ ...prev, rewrite: true }));
    try {
      const { data, error } = await supabase.functions.invoke('rewrite-resume', {
        body: { resumeText, jobDescription }
      });

      if (error) throw error;
      
      setRewriteResult(data);
    } catch (error) {
      console.error('Rewrite error:', error);
      toast({
        title: "Rewrite Failed",
        description: error instanceof Error ? error.message : "Failed to rewrite resume",
        variant: "destructive"
      });
    } finally {
      setLoadingAgents(prev => ({ ...prev, rewrite: false }));
    }
  };

  const handleATSAnalysis = async () => {
    setLoadingAgents(prev => ({ ...prev, ats: true }));
    try {
      const { data, error } = await supabase.functions.invoke('ats-analysis', {
        body: { resumeText, jobDescription }
      });

      if (error) throw error;
      
      setATSResult(data);
    } catch (error) {
      console.error('ATS error:', error);
      toast({
        title: "ATS Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyse resume",
        variant: "destructive"
      });
    } finally {
      setLoadingAgents(prev => ({ ...prev, ats: false }));
    }
  };

  const handleJDMatch = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please enter a job description to match against",
        variant: "destructive"
      });
      return;
    }

    setLoadingAgents(prev => ({ ...prev, jdMatch: true }));
    try {
      const { data, error } = await supabase.functions.invoke('jd-match', {
        body: { resumeText, jobDescription }
      });

      if (error) throw error;
      
      setJDMatchResult(data);
    } catch (error) {
      console.error('JD Match error:', error);
      toast({
        title: "JD Match Failed",
        description: error instanceof Error ? error.message : "Failed to match resume to job description",
        variant: "destructive"
      });
    } finally {
      setLoadingAgents(prev => ({ ...prev, jdMatch: false }));
    }
  };

  const handleGenerateRoast = async () => {
    setLoadingAgents(prev => ({ ...prev, roast: true }));
    try {
      const { data, error } = await supabase.functions.invoke('generate-roast-card', {
        body: { resumeText, originalText: resumeText }
      });

      if (error) throw error;
      
      setRoastResult(data);
    } catch (error) {
      console.error('Roast error:', error);
      toast({
        title: "Roast Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate roast card",
        variant: "destructive"
      });
    } finally {
      setLoadingAgents(prev => ({ ...prev, roast: false }));
    }
  };

  const handleAnalyzeAll = async () => {
    setHasAnalyzed(true);
    
    // Run all 4 agents in parallel
    await Promise.all([
      handleRewrite(),
      handleATSAnalysis(),
      handleJDMatch(),
      handleGenerateRoast()
    ]);

    track("Scan Completed");
    gtagEvent("scan_completed");
    toast({ 
      title: "Analysis Complete!",
      description: "All agents have finished processing. Check each section for results."
    });
  };

  // Auto-start analysis when component mounts if autoStart is true
  useEffect(() => {
    if (autoStart && !hasAutoStarted && resumeText && jobDescription) {
      setHasAutoStarted(true);
      handleAnalyzeAll();
    }
  }, [autoStart, hasAutoStarted, resumeText, jobDescription]);

  const isAnalyzing = Object.values(loadingAgents).some(Boolean);

  // Calculate completed and loading tabs
  const completedTabs: AnalysisTab[] = [];
  const loadingTabs: AnalysisTab[] = [];

  if (rewriteResult) completedTabs.push("resume");
  if (atsResult) completedTabs.push("ats");
  if (jdMatchResult) completedTabs.push("jdmatch");
  if (roastResult) completedTabs.push("roast");
  if (rewriteResult && atsResult && jdMatchResult && roastResult) completedTabs.push("summary");

  if (loadingAgents.rewrite) loadingTabs.push("resume");
  if (loadingAgents.ats) loadingTabs.push("ats");
  if (loadingAgents.jdMatch) loadingTabs.push("jdmatch");
  if (loadingAgents.roast) loadingTabs.push("roast");
  if (isAnalyzing) loadingTabs.push("summary");

  // Get top actions from roast or improvements
  const getTopActions = (): string[] => {
    const actions: string[] = [];
    
    if (rewriteResult?.structured?.critical_fixes) {
      rewriteResult.structured.critical_fixes.slice(0, 2).forEach((fix: any) => {
        actions.push(fix.issue);
      });
    }
    
    if (atsResult?.fixFirst) {
      actions.push(atsResult.fixFirst);
    }
    
    if (jdMatchResult?.resumeLevelFixes?.[0]) {
      actions.push(jdMatchResult.resumeLevelFixes[0].instruction);
    }
    
    return actions.slice(0, 3);
  };

  // Calculate resume score from improvements
  const getResumeScore = () => {
    if (!rewriteResult) return 0;
    // Estimate based on critical fixes - fewer fixes = higher score
    const fixes = rewriteResult.structured?.critical_fixes?.length || 5;
    return Math.max(30, 100 - (fixes * 12));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "summary":
        return (
          <ExecutiveSummary
            resumeScore={getResumeScore()}
            atsScore={atsResult?.score}
            atsVerdict={atsResult?.badge}
            jdMatchScore={jdMatchResult?.matchScore}
            jdMatchVerdict={jdMatchResult?.matchVerdict}
            roastPreview={roastResult?.roast?.substring(0, 150)}
            topActions={getTopActions()}
            isLoading={isAnalyzing}
            onNavigate={(tab) => setActiveTab(tab as AnalysisTab)}
          />
        );
      
      case "resume":
        return loadingAgents.rewrite ? (
          <LoadingState message="Analysing your resume for improvements..." color="blue" />
        ) : rewriteResult ? (
          <ResumeImprovementsResult 
            content={rewriteResult.rewritten} 
            structured={rewriteResult.structured}
          />
        ) : (
          <EmptyState message="No improvements generated yet" />
        );
      
      case "ats":
        return loadingAgents.ats ? (
          <LoadingState message="Checking ATS compatibility..." color="emerald" />
        ) : atsResult ? (
          <ATSAnalysisResult result={atsResult} />
        ) : (
          <EmptyState message="No ATS analysis yet" />
        );
      
      case "jdmatch":
        return loadingAgents.jdMatch ? (
          <LoadingState message="Matching to job description..." color="purple" />
        ) : jdMatchResult ? (
          <JDMatchResult result={jdMatchResult} />
        ) : (
          <EmptyState message="No job match analysis yet" />
        );
      
      case "roast":
        return loadingAgents.roast ? (
          <LoadingState message="Generating your roast card..." color="orange" />
        ) : roastResult ? (
          <RoastCardResult result={roastResult} />
        ) : (
          <EmptyState message="No roast generated yet" />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {!hasAnalyzed && isAnalyzing && (
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-semibold text-foreground">Analysing your resume...</p>
            <p className="text-sm text-muted-foreground">Running all 4 AI agents in parallel</p>
          </div>
        </Card>
      )}

      {hasAnalyzed && (
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>
            <Button variant="outline" onClick={onReset}>
              Start Over
            </Button>
          </div>

          {/* Tab Navigation */}
          <AnalysisTabsNavigation 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            completedTabs={completedTabs}
            loadingTabs={loadingTabs}
          />

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {renderTabContent()}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const LoadingState = ({ message, color }: { message: string; color: string }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <Loader2 className={`h-12 w-12 animate-spin text-${color}-500 mb-4`} />
    <p className="text-muted-foreground text-lg">{message}</p>
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center py-16">
    <p className="text-muted-foreground">{message}</p>
  </div>
);
