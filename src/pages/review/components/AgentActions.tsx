import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, CheckCircle, Target, Share2, Copy } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AgentActionsProps {
  resumeText: string;
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

export const AgentActions = ({ resumeText }: AgentActionsProps) => {
  const { toast } = useToast();
  const [loadingAgents, setLoadingAgents] = useState<Record<string, boolean>>({});
  const [jobDescription, setJobDescription] = useState("");
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  
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
    if (!jobDescription.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please enter a job description before analyzing",
        variant: "destructive"
      });
      return;
    }

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
      description: "All agents have finished processing. Check each tab for results."
    });
  };

  const isAnalyzing = Object.values(loadingAgents).some(Boolean);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <div className="space-y-6">
      {/* Job Description Input */}
      <Card className="p-6">
        <label className="block text-sm font-medium mb-2">
          Job Description *
        </label>
        <Textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description you want to match your resume against..."
          className="min-h-[150px]"
        />
      </Card>

      {/* Analyze All Button */}
      <Card className="p-6">
        <Button
          onClick={handleAnalyzeAll}
          disabled={!resumeText || !jobDescription.trim() || isAnalyzing}
          className="w-full h-auto py-6 flex flex-col items-center gap-2"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="font-semibold text-lg">Analyzing...</span>
              <span className="text-xs opacity-80">Running all 4 AI agents in parallel</span>
            </>
          ) : (
            <>
              <Sparkles className="h-6 w-6" />
              <span className="font-semibold text-lg">Analyze Resume</span>
              <span className="text-xs opacity-80">Run all 4 AI agents at once</span>
            </>
          )}
        </Button>
      </Card>

      {/* Results Tabs */}
      {hasAnalyzed && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>
          <Tabs defaultValue="rewrite" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="rewrite" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Rewrite
              </TabsTrigger>
              <TabsTrigger value="ats" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                ATS
              </TabsTrigger>
              <TabsTrigger value="jd-match" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                JD Match
              </TabsTrigger>
              <TabsTrigger value="roast" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Roast
              </TabsTrigger>
            </TabsList>

            {/* Rewrite Tab */}
            <TabsContent value="rewrite" className="mt-6">
              {loadingAgents.rewrite ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Rewriting your resume...</p>
                </div>
              ) : rewriteResult ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Rewritten Resume</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(rewriteResult.rewritten)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-muted p-4 rounded-lg mb-4 whitespace-pre-wrap max-h-[600px] overflow-y-auto">
                    {rewriteResult.rewritten}
                  </div>
                  {rewriteResult.notes && (
                    <div className="text-sm text-muted-foreground mt-4">
                      <strong>Changes Made:</strong> {rewriteResult.notes}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No results yet
                </div>
              )}
            </TabsContent>

            {/* ATS Tab */}
            <TabsContent value="ats" className="mt-6">
              {loadingAgents.ats ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Analyzing ATS compatibility...</p>
                </div>
              ) : atsResult ? (

                <div>
                  <h3 className="text-xl font-bold mb-4">ATS Analysis</h3>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-semibold">ATS Score</span>
                      <span className="text-3xl font-bold">{atsResult.score}/100</span>
                    </div>
                    <Progress value={atsResult.score} className="h-2" />
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="issues">
                      <AccordionTrigger>Formatting Issues ({atsResult.issues.length})</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          {atsResult.issues.map((issue, i) => (
                            <li key={i}>{issue}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="keywords">
                      <AccordionTrigger>Missing Keywords ({atsResult.keywordGaps.length})</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          {atsResult.keywordGaps.map((keyword, i) => (
                            <li key={i}>{keyword}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="fixes">
                      <AccordionTrigger>Recommended Fixes ({atsResult.fixes.length})</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          {atsResult.fixes.map((fix, i) => (
                            <li key={i}>{fix}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No results yet
                </div>
              )}
            </TabsContent>

            {/* JD Match Tab */}
            <TabsContent value="jd-match" className="mt-6">
              {loadingAgents.jdMatch ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Matching to job description...</p>
                </div>
              ) : jdMatchResult ? (

                <div>
                  <h3 className="text-xl font-bold mb-4">Job Description Match</h3>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-semibold">Match Score</span>
                      <span className="text-3xl font-bold">{jdMatchResult.matchScore}/100</span>
                    </div>
                    <Progress value={jdMatchResult.matchScore} className="h-2" />
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="skills">
                      <AccordionTrigger>Missing Skills ({jdMatchResult.missingSkills.length})</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          {jdMatchResult.missingSkills.map((skill, i) => (
                            <li key={i}>{skill}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="bullets">
                      <AccordionTrigger>Optimized Bullets ({jdMatchResult.optimizedBullets.length})</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-3">
                          {jdMatchResult.optimizedBullets.map((bullet, i) => (
                            <li key={i} className="bg-muted p-3 rounded">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No results yet
                </div>
              )}
            </TabsContent>

            {/* Roast Tab */}
            <TabsContent value="roast" className="mt-6">
              {loadingAgents.roast ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Generating roast card...</p>
                </div>
              ) : roastResult ? (

                <div className="border-2 border-primary rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">🔥 Resume Roast</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(roastResult.shareText)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(roastResult.shareText + '\n' + roastResult.shareUrl)}`, '_blank')}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Tweet
                      </Button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg mb-6">
                    <p className="text-lg italic">{roastResult.roast}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    {Object.entries(roastResult.scores).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-2xl font-bold">{value}</div>
                        <div className="text-sm text-muted-foreground capitalize">{key}</div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    Share URL: <a href={roastResult.shareUrl} className="text-primary underline" target="_blank" rel="noopener noreferrer">{roastResult.shareUrl}</a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No results yet
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
};
