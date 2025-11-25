import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, Share2, Download, Award } from "lucide-react";

type Mode = "roast" | "love";

const roastSuggestions = [
  "Keep it mild",
  "Go fully savage",
  "Corporate toxic roast",
  "Sarcastic roast",
  "Stand-up comedian style",
];

const loveSuggestions = [
  "Soft encouragement",
  "Hype me up",
  "Corporate coaching style",
  "Positive but honest",
  "Best friend pep talk",
];

interface ResultData {
  roast?: string;
  encouragement?: string;
  formatting: string;
  content: string;
  targeting: string;
  bulletImprovements: string;
  strengths?: string;
  scoreBreakdown: string;
}

export default function Lovable() {
  const [resume, setResume] = useState("");
  const [mode, setMode] = useState<Mode>("roast");
  const [tonePreference, setTonePreference] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const { toast } = useToast();

  const suggestions = mode === "roast" ? roastSuggestions : loveSuggestions;

  const handleSuggestionClick = (suggestion: string) => {
    setTonePreference(suggestion);
  };

  const handleGenerate = async () => {
    if (!resume.trim()) {
      toast({
        title: "Resume required",
        description: "Please paste your resume before generating.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const functionName = mode === "roast" ? "roast-review" : "love-review";
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { resume, tonePreference },
      });

      if (error) throw error;

      setResult(data);
      
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ 
          behavior: "smooth",
          block: "start"
        });
      }, 100);
    } catch (error) {
      console.error("Error generating feedback:", error);
      toast({
        title: "Error",
        description: "Failed to generate feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  const handleShareCard = () => {
    if (!result) return;
    
    const scores = result.scoreBreakdown.match(/Overall:\s*(\d+)/);
    const overallScore = scores ? scores[1] : "??";
    
    const shareText = mode === "roast" 
      ? `My Resume Roast Score: ${overallScore}/100 🔥\n\nJust got AI roasted on MatchRate!\n\nTry it: ${window.location.href}`
      : `My Resume Love Score: ${overallScore}/100 💖\n\nJust got some AI love on MatchRate!\n\nTry it: ${window.location.href}`;
    
    if (navigator.share) {
      navigator.share({
        title: "My Resume Feedback",
        text: shareText,
      }).catch(() => {
        navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied!",
          description: "Share text copied to clipboard.",
        });
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied!",
        description: "Share text copied to clipboard.",
      });
    }
  };

  const handleTwitterShare = () => {
    if (!result) return;
    
    const scores = result.scoreBreakdown.match(/Overall:\s*(\d+)/);
    const overallScore = scores ? scores[1] : "??";
    
    const text = mode === "roast" 
      ? `My Resume Roast Score: ${overallScore}/100 🔥\n\nJust got AI roasted on @MatchRate!`
      : `My Resume Love Score: ${overallScore}/100 💖\n\nJust got some AI love on @MatchRate!`;
    
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank");
  };

  const parseScoreBreakdown = (scoreText: string) => {
    const lines = scoreText.split('\n').filter(line => line.trim());
    const scores: { label: string; score: number; max: number }[] = [];
    
    lines.forEach(line => {
      const match = line.match(/(.+?):\s*(\d+)\/(\d+)/);
      if (match) {
        scores.push({
          label: match[1].trim(),
          score: parseInt(match[2]),
          max: parseInt(match[3]),
        });
      }
    });
    
    return scores;
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold text-foreground">Lovable for Jobs</h1>
          <p className="text-xl text-muted-foreground">
            Get a roast or a love-note — plus real, actionable feedback — for your resume.
          </p>
        </div>

        <Card className="border-2">
          <CardContent className="pt-6 space-y-6">
            <Textarea
              placeholder="Paste your resume here..."
              className="min-h-[300px] text-base"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />

            <div className="space-y-4">
              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  variant={mode === "roast" ? "default" : "outline"}
                  onClick={() => setMode("roast")}
                  className={`text-lg px-8 transition-all ${
                    mode === "roast" 
                      ? "bg-red-500 hover:bg-red-600 text-white" 
                      : "hover:border-red-500"
                  }`}
                >
                  Roast Me 🔥
                </Button>
                <Button
                  size="lg"
                  variant={mode === "love" ? "default" : "outline"}
                  onClick={() => setMode("love")}
                  className={`text-lg px-8 transition-all ${
                    mode === "love" 
                      ? "bg-green-500 hover:bg-green-600 text-white" 
                      : "hover:border-green-500"
                  }`}
                >
                  Love Me 💖
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground text-center">
                  Choose a tone preference:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant={tonePreference === suggestion ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="transition-all hover:scale-105"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading}
              size="lg"
              className="w-full text-lg py-6"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing your resume...
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div id="results" className="space-y-6">
            {/* Main Roast/Love Card */}
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center justify-between">
                  <span>
                    {mode === "roast" ? "🔥 Roast" : "💖 Encouragement"}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(
                      mode === "roast" ? result.roast || "" : result.encouragement || "",
                      mode === "roast" ? "Roast" : "Encouragement"
                    )}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg whitespace-pre-line leading-relaxed">
                  {mode === "roast" ? result.roast : result.encouragement}
                </p>
              </CardContent>
            </Card>

            {/* Score Breakdown Card */}
            <Card className="border-2 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Award className="h-6 w-6" />
                  Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {parseScoreBreakdown(result.scoreBreakdown).map((score, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{score.label}</span>
                      <span className="text-lg font-bold">
                        {score.score}/{score.max}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          score.label === "Overall" 
                            ? "bg-gradient-to-r from-primary to-primary/70"
                            : "bg-primary"
                        }`}
                        style={{ width: `${(score.score / score.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Professional Review Accordion */}
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">📘 Professional Review</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="formatting">
                    <AccordionTrigger className="text-lg font-semibold">
                      📄 Formatting Issues
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div className="flex-1 whitespace-pre-line">{result.formatting}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(result.formatting, "Formatting Issues")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="content">
                    <AccordionTrigger className="text-lg font-semibold">
                      📝 Content Issues
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div className="flex-1 whitespace-pre-line">{result.content}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(result.content, "Content Issues")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="targeting">
                    <AccordionTrigger className="text-lg font-semibold">
                      🎯 Targeting & Role Fit
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div className="flex-1 whitespace-pre-line">{result.targeting}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(result.targeting, "Targeting Feedback")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="bullets">
                    <AccordionTrigger className="text-lg font-semibold">
                      ✍️ Bullet Improvements
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div className="flex-1 whitespace-pre-line">{result.bulletImprovements}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(result.bulletImprovements, "Bullet Improvements")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {result.strengths && (
                    <AccordionItem value="strengths">
                      <AccordionTrigger className="text-lg font-semibold">
                        🏆 Your Top Strengths
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div className="flex-1 whitespace-pre-line">{result.strengths}</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(result.strengths || "", "Strengths")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            </Card>

            {/* Share Card */}
            <Card className="border-2 shadow-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold">Share Your Results</h3>
                  <p className="text-muted-foreground">
                    Let the world know you got {mode === "roast" ? "roasted" : "loved"}!
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button
                      variant="outline"
                      onClick={handleShareCard}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Copy Share Text
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleTwitterShare}
                      className="text-blue-500 border-blue-500"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Tweet This
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="border-2 shadow-lg">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-bold">Want More?</h3>
                  <p className="text-muted-foreground">
                    Get a full ATS-optimized resume with our Resume Builder
                  </p>
                  <Button 
                    size="lg"
                    onClick={() => window.location.href = "/review"}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Try MatchRate Resume Builder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
