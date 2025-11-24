import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface RoastData {
  resume: string;
  summary: string;
  feedback: string;
  mode: "roast" | "love";
}

export default function Result() {
  const [data, setData] = useState<RoastData | null>(null);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("roast-data");
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      navigate("/lovable-jobs");
    }
  }, [navigate]);

  const createProfile = async () => {
    if (!data) return;

    setCreating(true);

    try {
      const { data: response, error } = await supabase.functions.invoke(
        "create-profile-url",
        {
          body: data,
        }
      );

      if (error) throw error;

      localStorage.removeItem("roast-data");
      window.location.href = response.url;
    } catch (error) {
      console.error("Error creating profile:", error);
      toast({
        title: "Error",
        description: "Failed to create shareable profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Your AI {data.mode === "love" ? "Love Note ❤️" : "Roast 🔥"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line text-foreground">
              {data.feedback}
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={createProfile}
          disabled={creating}
          className="w-full"
          size="lg"
        >
          {creating ? "Creating..." : "Create Shareable Profile 🌐"}
        </Button>

        <Button
          variant="outline"
          onClick={() => navigate("/lovable-jobs")}
          className="w-full"
        >
          Start Over
        </Button>
      </div>
    </div>
  );
}
