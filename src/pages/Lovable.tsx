import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, Share2 } from "lucide-react";

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

export default function Lovable() {
  const [resume, setResume] = useState("");
  const [mode, setMode] = useState<Mode>("roast");
  const [tonePreference, setTonePreference] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    roast?: string;
    encouragement?: string;
    review: string;
  } | null>(null);
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
      
      // Auto-scroll to results
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

  const handleCopy = () => {
    const text = mode === "roast" 
      ? `🔥 Roast:\n${result?.roast}\n\n📘 Review:\n${result?.review}`
      : `💖 Encouragement:\n${result?.encouragement}\n\n📘 Review:\n${result?.review}`;
    
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Feedback copied to clipboard.",
    });
  };

  const handleShare = () => {
    const text = mode === "roast" 
      ? "Just got AI roasted on Lovable for Jobs! 🔥"
      : "Just got some AI love on Lovable for Jobs! 💖";
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank");
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
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center justify-between">
                  <span>
                    {mode === "roast" ? "🔥 Roast" : "💖 Encouragement"}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg whitespace-pre-line leading-relaxed">
                  {mode === "roast" ? result.roast : result.encouragement}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">📘 Resume Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none whitespace-pre-line">
                  {result.review}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
