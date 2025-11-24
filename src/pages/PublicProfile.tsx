import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Twitter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  slug: string;
  resume_text: string;
  summary: string;
  feedback: string;
  mode: "roast" | "love";
  created_at: string;
}

export default function PublicProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from("public_profiles")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) throw error;

        setProfile(data as Profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Profile not found",
          description: "This profile doesn't exist or has been removed.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [slug, toast]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My AI ${profile?.mode === "love" ? "Love Note" : "Roast"}`,
          url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Share this link with anyone.",
      });
    }
  };

  const shareOnTwitter = () => {
    const text = profile?.mode === "love" 
      ? "Got AI love on Matchrate ❤️" 
      : "Got AI roasted on Matchrate 😂";
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Profile Not Found</h1>
          <Link to="/lovable-jobs">
            <Button>Create Your Own</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-3xl">
              {profile.mode === "love" ? "Love Note ❤️" : "Roast 🔥"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">Share this page:</p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareOnTwitter}
                  className="text-blue-500"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
              </div>
            </div>

            <div className="p-6 border rounded-lg whitespace-pre-line bg-muted/50">
              {profile.feedback}
            </div>

            <div className="text-center">
              <Link to="/lovable-jobs" className="text-primary hover:underline">
                Create your own →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
