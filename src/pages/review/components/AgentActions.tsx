import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, CheckCircle, Target, Flame, ChevronDown, ChevronUp } from "lucide-react";
import { ResumeImprovementsResult } from "./results/ResumeImprovementsResult";
import { ATSAnalysisResult } from "./results/ATSAnalysisResult";
import { JDMatchResult } from "./results/JDMatchResult";
import { RoastCardResult } from "./results/RoastCardResult";

interface AgentActionsProps {
  resumeText: string;
  jobDescription: string;
  onReset: () => void;
  autoStart?: boolean;
}

interface RewriteResult {
  rewritten: string;
  notes: string;
}

interface ATSResult {
  score: number;
  issues: string[];
  keywordGaps: string[];
  fixes: string[];
  rawContent?: string;
}

interface JDMatchResultData {
  matchScore: number;
  missingSkills: string[];
  optimizedBullets: string[];
  rawContent?: string;
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

// Collapsible Section Component
const CollapsibleSection = ({ 
  title, 
  icon, 
  iconColor,
  bgColor,
  score,
  isLoading, 
  children,
  defaultOpen = true
}: {
  title: string;
  icon: React.ReactNode;
  iconColor: string;
  bgColor: string;
  score?: number;
  isLoading: boolean;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className={`${bgColor} rounded-xl shadow-md border border-border/30 overflow-hidden`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-black/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={iconColor}>{icon}</div>
          <span className="text-lg font-semibold text-foreground">{title}</span>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-2" />}
        </div>
        <div className="flex items-center gap-3">
          {score !== undefined && !isLoading && (
            <span className={`text-2xl font-bold ${iconColor}`}>{score}/100</span>
          )}
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </button>
      
      {isOpen && (
        <div className="px-5 pb-5 pt-2">
          {children}
        </div>
      )}
    </div>
  );
};

export const AgentActions = ({ resumeText, jobDescription, onReset, autoStart = true }: AgentActionsProps) => {
  const { toast } = useToast();
  const [loadingAgents, setLoadingAgents] = useState<Record<string, boolean>>({});
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);
  
  const [rewriteResult, setRewriteResult] = useState<RewriteResult | null>(null);
  const [atsResult, setATSResult] = useState<ATSResult | null>(null);
  const [jdMatchResult, setJDMatchResult] = useState<JDMatchResultData | null>(null);
  const [roastResult, setRoastResult] = useState<RoastResult | null>(null);

  const handleRewrite = async () => {
    setLoadingAgents(prev => ({ ...prev, rewrite: true }));
    try {
      const { data, error } = await supabase.functions.invoke('rewrite-resume', {
        body: { resumeText }
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
        body: { resumeText }
      });

      if (error) throw error;
      
      setATSResult(data);
    } catch (error) {
      console.error('ATS error:', error);
      toast({
        title: "ATS Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze resume",
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

  return (
    <div className="space-y-6">
      {!hasAnalyzed && isAnalyzing && (
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-semibold text-foreground">Analyzing your resume...</p>
            <p className="text-sm text-muted-foreground">Running all 4 AI agents in parallel</p>
          </div>
        </Card>
      )}

      {hasAnalyzed && (
        <div className="space-y-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>
            <Button variant="outline" onClick={onReset}>
              Start Over
            </Button>
          </div>

          {/* Resume Improvements Section */}
          <CollapsibleSection
            title="Resume Improvements"
            icon={<Sparkles className="h-5 w-5" />}
            iconColor="text-blue-600"
            bgColor="bg-blue-50/50"
            isLoading={loadingAgents.rewrite}
          >
            {loadingAgents.rewrite ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-3" />
                <p className="text-muted-foreground">Analyzing your resume...</p>
              </div>
            ) : rewriteResult ? (
              <ResumeImprovementsResult content={rewriteResult.rewritten} />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No improvements generated yet
              </div>
            )}
          </CollapsibleSection>

          {/* ATS Analysis Section */}
          <CollapsibleSection
            title="ATS Analysis"
            icon={<CheckCircle className="h-5 w-5" />}
            iconColor="text-green-600"
            bgColor="bg-green-50/50"
            score={atsResult?.score}
            isLoading={loadingAgents.ats}
          >
            {loadingAgents.ats ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-green-500 mb-3" />
                <p className="text-muted-foreground">Analyzing ATS compatibility...</p>
              </div>
            ) : atsResult ? (
              <ATSAnalysisResult result={atsResult} />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No ATS analysis yet
              </div>
            )}
          </CollapsibleSection>

          {/* Job Match Section */}
          <CollapsibleSection
            title="Job Match"
            icon={<Target className="h-5 w-5" />}
            iconColor="text-purple-600"
            bgColor="bg-purple-50/50"
            score={jdMatchResult?.matchScore}
            isLoading={loadingAgents.jdMatch}
          >
            {loadingAgents.jdMatch ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-purple-500 mb-3" />
                <p className="text-muted-foreground">Matching to job description...</p>
              </div>
            ) : jdMatchResult ? (
              <JDMatchResult result={jdMatchResult} />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No job match analysis yet
              </div>
            )}
          </CollapsibleSection>

          {/* Roast Card Section */}
          <CollapsibleSection
            title="🔥 Roast Card"
            icon={<Flame className="h-5 w-5" />}
            iconColor="text-orange-600"
            bgColor="bg-orange-50/50"
            isLoading={loadingAgents.roast}
          >
            {loadingAgents.roast ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-orange-500 mb-3" />
                <p className="text-muted-foreground">Generating roast card...</p>
              </div>
            ) : roastResult ? (
              <RoastCardResult result={roastResult} />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No roast generated yet
              </div>
            )}
          </CollapsibleSection>
        </div>
      )}
    </div>
  );
};
