import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, CheckCircle, Target, Share2, Copy, Download } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

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
  const [loading, setLoading] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  
  const [rewriteResult, setRewriteResult] = useState<RewriteResult | null>(null);
  const [atsResult, setATSResult] = useState<ATSResult | null>(null);
  const [jdMatchResult, setJDMatchResult] = useState<JDMatchResult | null>(null);
  const [roastResult, setRoastResult] = useState<RoastResult | null>(null);

  const handleRewrite = async () => {
    setLoading('rewrite');
    try {
      const { data, error } = await supabase.functions.invoke('rewrite-resume', {
        body: { resumeText }
      });

      if (error) throw error;
      
      setRewriteResult(data);
      toast({ title: "Resume rewritten successfully!" });
    } catch (error) {
      console.error('Rewrite error:', error);
      toast({
        title: "Error",
        description: "Failed to rewrite resume",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const handleATSAnalysis = async () => {
    setLoading('ats');
    try {
      const { data, error } = await supabase.functions.invoke('ats-analysis', {
        body: { resumeText }
      });

      if (error) throw error;
      
      setATSResult(data);
      toast({ title: "ATS analysis complete!" });
    } catch (error) {
      console.error('ATS error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze resume",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
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

    setLoading('jd-match');
    try {
      const { data, error } = await supabase.functions.invoke('jd-match', {
        body: { resumeText, jobDescription }
      });

      if (error) throw error;
      
      setJDMatchResult(data);
      toast({ title: "Job match analysis complete!" });
    } catch (error) {
      console.error('JD Match error:', error);
      toast({
        title: "Error",
        description: "Failed to match resume to job description",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const handleGenerateRoast = async () => {
    setLoading('roast');
    try {
      const { data, error } = await supabase.functions.invoke('generate-roast-card', {
        body: { resumeText, originalText: resumeText }
      });

      if (error) throw error;
      
      setRoastResult(data);
      toast({ title: "Roast card generated! 🔥" });
    } catch (error) {
      console.error('Roast error:', error);
      toast({
        title: "Error",
        description: "Failed to generate roast card",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">AI Resume Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleRewrite}
            disabled={!resumeText || loading !== null}
            className="h-auto py-4 flex flex-col items-center gap-2"
          >
            {loading === 'rewrite' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
            <span className="font-semibold">Full Rewrite</span>
            <span className="text-xs opacity-80">Get a professional rewrite</span>
          </Button>

          <Button
            onClick={handleATSAnalysis}
            disabled={!resumeText || loading !== null}
            className="h-auto py-4 flex flex-col items-center gap-2"
            variant="secondary"
          >
            {loading === 'ats' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <CheckCircle className="h-5 w-5" />
            )}
            <span className="font-semibold">ATS Review</span>
            <span className="text-xs opacity-80">Check ATS compatibility</span>
          </Button>

          <Button
            onClick={handleJDMatch}
            disabled={!resumeText || !jobDescription || loading !== null}
            className="h-auto py-4 flex flex-col items-center gap-2"
            variant="outline"
          >
            {loading === 'jd-match' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Target className="h-5 w-5" />
            )}
            <span className="font-semibold">JD Match</span>
            <span className="text-xs opacity-80">Match to job description</span>
          </Button>

          <Button
            onClick={handleGenerateRoast}
            disabled={!resumeText || loading !== null}
            className="h-auto py-4 flex flex-col items-center gap-2"
            variant="outline"
          >
            {loading === 'roast' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Share2 className="h-5 w-5" />
            )}
            <span className="font-semibold">Generate Roast Card</span>
            <span className="text-xs opacity-80">Fun shareable roast</span>
          </Button>
        </div>
      </Card>

      {/* Job Description Input for JD Match */}
      <Card className="p-6">
        <label className="block text-sm font-medium mb-2">
          Job Description (for JD Match)
        </label>
        <Textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description you want to match your resume against..."
          className="min-h-[150px]"
        />
      </Card>

      {/* Results Sections */}
      {rewriteResult && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Rewritten Resume
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(rewriteResult.rewritten)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
          <div className="bg-muted p-4 rounded-lg mb-4 whitespace-pre-wrap">
            {rewriteResult.rewritten}
          </div>
          {rewriteResult.notes && (
            <div className="text-sm text-muted-foreground">
              <strong>Changes Made:</strong> {rewriteResult.notes}
            </div>
          )}
        </Card>
      )}

      {atsResult && (
        <Card className="p-6">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5" />
            ATS Analysis
          </h3>
          
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
        </Card>
      )}

      {jdMatchResult && (
        <Card className="p-6">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Target className="h-5 w-5" />
            Job Description Match
          </h3>
          
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
        </Card>
      )}

      {roastResult && (
        <Card className="p-6 border-2 border-primary">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              🔥 Resume Roast
            </h3>
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
        </Card>
      )}
    </div>
  );
};
