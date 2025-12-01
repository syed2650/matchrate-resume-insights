import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, CheckCircle, Target, Share2, Copy } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
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
}

interface JDMatchResult {
  matchScore: number;
  missingSkills: string[];
  optimizedBullets: string[];
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
}

export const AgentActions = ({ resumeText, jobDescription, onReset, autoStart = true }: AgentActionsProps) => {
  const { toast } = useToast();
  const [loadingAgents, setLoadingAgents] = useState<Record<string, boolean>>({});
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);
  
  const [rewriteResult, setRewriteResult] = useState<RewriteResult | null>(null);
  const [atsResult, setATSResult] = useState<ATSResult | null>(null);
  const [jdMatchResult, setJDMatchResult] = useState<JDMatchResult | null>(null);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <div className="space-y-6">
      {!hasAnalyzed && isAnalyzing && (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-semibold">Analyzing your resume...</p>
            <p className="text-sm text-muted-foreground">Running all 4 AI agents in parallel</p>
          </div>
        </Card>
      )}

      {hasAnalyzed && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Analysis Results</h2>
            <Button variant="outline" onClick={onReset}>
              Start Over
            </Button>
          </div>

          <Accordion type="multiple" className="w-full space-y-4">
            {/* Resume Improvements Section */}
            <AccordionItem value="improvements" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <span className="text-lg font-semibold">Resume Improvements</span>
                  {loadingAgents.rewrite && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                {loadingAgents.rewrite ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
                    <p className="text-muted-foreground">Analyzing your resume...</p>
                  </div>
                ) : rewriteResult ? (
                  <div>
                    <div className="flex gap-2 mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(rewriteResult.rewritten)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Section
                      </Button>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                      {rewriteResult.rewritten}
                    </div>
                    {rewriteResult.notes && (
                      <div className="text-sm text-muted-foreground mt-4 p-3 bg-blue-50 rounded">
                        <strong>Key Changes:</strong> {rewriteResult.notes}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Click "Analyze Results" to see improvements
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* ATS Analysis Section */}
            <AccordionItem value="ats" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-lg font-semibold">ATS Analysis</span>
                  {atsResult && <span className="ml-auto text-2xl font-bold">{atsResult.score}/100</span>}
                  {loadingAgents.ats && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                {loadingAgents.ats ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
                    <p className="text-muted-foreground">Analyzing ATS compatibility...</p>
                  </div>
                ) : atsResult ? (
                  <div>
                    <div className="flex gap-2 mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(JSON.stringify(atsResult, null, 2))}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Section
                      </Button>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-semibold">ATS Score</span>
                        <span className="text-3xl font-bold text-green-600">{atsResult.score}/100</span>
                      </div>
                      <Progress value={atsResult.score} className="h-2" />
                    </div>

                    <div className="space-y-4">
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">⚠️ Formatting Issues ({atsResult.issues.length})</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {atsResult.issues.map((issue, i) => (
                            <li key={i}>{issue}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">🔑 Missing Keywords ({atsResult.keywordGaps.length})</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {atsResult.keywordGaps.map((keyword, i) => (
                            <li key={i}>{keyword}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">✅ Recommended Fixes ({atsResult.fixes.length})</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {atsResult.fixes.map((fix, i) => (
                            <li key={i}>{fix}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Click "Analyze Results" to see ATS analysis
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Job Match Section */}
            <AccordionItem value="job-match" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-purple-600" />
                  <span className="text-lg font-semibold">Job Match</span>
                  {jdMatchResult && <span className="ml-auto text-2xl font-bold">{jdMatchResult.matchScore}/100</span>}
                  {loadingAgents.jdMatch && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                {loadingAgents.jdMatch ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
                    <p className="text-muted-foreground">Matching to job description...</p>
                  </div>
                ) : jdMatchResult ? (
                  <div>
                    <div className="flex gap-2 mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(JSON.stringify(jdMatchResult, null, 2))}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Section
                      </Button>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-semibold">Match Score</span>
                        <span className="text-3xl font-bold text-purple-600">{jdMatchResult.matchScore}/100</span>
                      </div>
                      <Progress value={jdMatchResult.matchScore} className="h-2" />
                    </div>

                    <div className="space-y-4">
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">🎯 Missing Skills ({jdMatchResult.missingSkills.length})</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {jdMatchResult.missingSkills.map((skill, i) => (
                            <li key={i}>{skill}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">✨ Optimized Bullets ({jdMatchResult.optimizedBullets.length})</h4>
                        <div className="space-y-2">
                          {jdMatchResult.optimizedBullets.map((bullet, i) => (
                            <div key={i} className="bg-white p-3 rounded border-l-4 border-blue-600 text-sm">
                              {bullet}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Click "Analyze Results" to see job match analysis
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Roast Section */}
            <AccordionItem value="roast" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Share2 className="h-5 w-5 text-orange-600" />
                  <span className="text-lg font-semibold">🔥 Roast Card</span>
                  {loadingAgents.roast && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                {loadingAgents.roast ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
                    <p className="text-muted-foreground">Generating roast card...</p>
                  </div>
                ) : roastResult ? (
                  <div className="border-2 border-orange-500 rounded-lg p-6 bg-gradient-to-br from-orange-50 to-red-50">
                    <div className="flex gap-2 mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(roastResult.shareText)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Section
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(roastResult.shareText + '\n' + roastResult.shareUrl)}`, '_blank')}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share on Twitter
                      </Button>
                    </div>

                    <div className="bg-white/80 p-6 rounded-lg mb-6 border-l-4 border-orange-600">
                      <p className="text-lg font-medium italic text-slate-800">{roastResult.roast}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                      {Object.entries(roastResult.scores).map(([key, value]) => (
                        <div key={key} className="text-center bg-white/60 p-3 rounded">
                          <div className="text-2xl font-bold text-orange-600">{value}</div>
                          <div className="text-xs text-slate-600 capitalize">{key}</div>
                        </div>
                      ))}
                    </div>

                    {roastResult.shareUrl && (
                      <div className="text-center text-sm text-slate-600 mt-4">
                        <span>Share: </span>
                        <a href={roastResult.shareUrl} className="text-orange-600 underline font-medium" target="_blank" rel="noopener noreferrer">
                          {roastResult.shareUrl}
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Click "Analyze Results" to see roast card
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
};
