import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function LovableJobsIndex() {
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"roast" | "love">("roast");
  const navigate = useNavigate();
  const { toast } = useToast();

  const generate = async () => {
    if (!resume.trim()) {
      toast({
        title: "Resume required",
        description: "Please paste your resume before generating.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("roast-profile", {
        body: { resume, mode },
      });

      if (error) throw error;

      localStorage.setItem(
        "roast-data",
        JSON.stringify({
          resume,
          summary: data.summary,
          feedback: data.feedback,
          mode,
        })
      );

      navigate("/lovable-jobs/result");
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

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Lovable for Jobs</h1>
          <p className="text-muted-foreground">
            Get a roast or a love-note for your resume.
          </p>
        </div>

        <Textarea
          placeholder="Paste your resume here"
          className="min-h-[300px]"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />

        <div className="flex justify-center gap-4">
          <Button
            variant={mode === "roast" ? "default" : "outline"}
            onClick={() => setMode("roast")}
            className={mode === "roast" ? "bg-red-500 hover:bg-red-600" : ""}
          >
            Roast Me 🔥
          </Button>
          <Button
            variant={mode === "love" ? "default" : "outline"}
            onClick={() => setMode("love")}
            className={mode === "love" ? "bg-green-500 hover:bg-green-600" : ""}
          >
            Love Me ❤️
          </Button>
        </div>

        <Button
          onClick={generate}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? "Analyzing..." : "Generate"}
        </Button>
      </div>
    </div>
  );
}
