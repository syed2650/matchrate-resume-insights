import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Download,
  FileText,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthUser } from "@/hooks/useAuthUser";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import { track } from "@/lib/mixpanel";
import {
  ResumeTemplate,
  RESUME_TEMPLATE_CSS,
  type FinalResume,
} from "@/pages/review/components/ResumeTemplate";
import { renderToStaticMarkup } from "react-dom/server";

const Fix = () => {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuthUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get("session_id");
  const stripeSessionId = searchParams.get("stripe_session_id");

  const [status, setStatus] = useState<
    "verifying" | "rewriting" | "ready" | "error"
  >("verifying");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resume, setResume] = useState<FinalResume | null>(null);
  const [autoScale, setAutoScale] = useState<number>(1);
  const previewRef = useRef<HTMLDivElement>(null);
  const ranOnce = useRef(false);

  const runRewrite = async (force = false) => {
    setStatus("rewriting");
    const { data, error } = await supabase.functions.invoke(
      "rewrite-with-claude",
      { body: { session_id: sessionId, force } },
    );
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    if (!data?.resume) throw new Error("No resume returned");

    const r = data.resume as FinalResume;
    if (!r.fullName || r.fullName.trim().length < 2) {
      throw new Error(
        "Could not read your name from the resume. Please re-upload the file.",
      );
    }
    if (!Array.isArray(r.experience) || r.experience.length === 0) {
      throw new Error("No work experience found in your resume.");
    }

    setResume(r);
    setStatus("ready");
    track("Resume Rewritten");
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      toast({
        title: "Please sign in",
        description: "Sign in to view your optimised resume.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    if (!sessionId) {
      setStatus("error");
      setErrorMsg("Missing session ID. Please start a new analysis.");
      return;
    }
    if (ranOnce.current) return;
    ranOnce.current = true;

    (async () => {
      try {
        if (stripeSessionId) {
          setStatus("verifying");
          const { data, error } = await supabase.functions.invoke(
            "verify-fix-payment",
            {
              body: { session_id: sessionId, stripe_session_id: stripeSessionId },
            },
          );
          if (error) throw error;
          if (data?.error) throw new Error(data.error);
          if (!data?.paid) {
            setStatus("error");
            setErrorMsg("Payment not confirmed yet. Please refresh in a moment.");
            return;
          }
          track("Fix Payment Verified");
        }

        await runRewrite(false);
        sessionStorage.removeItem("matchrate_pending_analysis");
      } catch (err: any) {
        console.error(err);
        setStatus("error");
        setErrorMsg(err?.message ?? "Something went wrong.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, sessionId, stripeSessionId]);

  // Auto-scale preview to viewport width (A4 = 210mm ≈ 794px @ 96dpi)
  useEffect(() => {
    const calc = () => {
      const container = previewRef.current?.parentElement;
      if (!container) return;
      const containerWidth = container.clientWidth - 16;
      const A4_PX = 794;
      setAutoScale(Math.min(1, containerWidth / A4_PX));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [resume]);

  const buildResumeHtml = (): string => {
    if (!resume) return "";
    return renderToStaticMarkup(<ResumeTemplate data={resume} />);
  };

  const handleDownloadPdf = () => {
    if (!resume) return;
    track("PDF Downloaded");
    const html = buildResumeHtml();
    const win = window.open("", "_blank");
    if (!win) {
      toast({
        title: "Popup blocked",
        description: "Please allow popups to download your PDF.",
        variant: "destructive",
      });
      return;
    }
    win.document.write(
      `<!doctype html><html><head><title>${resume.fullName} — Resume</title><meta charset="utf-8"><style>${RESUME_TEMPLATE_CSS}</style></head><body>${html}<script>window.onload=()=>{setTimeout(()=>window.print(),300);}<\/script></body></html>`,
    );
    win.document.close();
  };

  const handleDownloadDocx = () => {
    if (!resume) return;
    track("DOCX Downloaded");
    const html = buildResumeHtml();
    const blob = new Blob(
      [
        `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><style>${RESUME_TEMPLATE_CSS}</style></head><body>${html}</body></html>`,
      ],
      { type: "application/msword" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resume.fullName.replace(/\s+/g, "_")}_resume.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRegenerate = async () => {
    try {
      await runRewrite(true);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Regeneration failed",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <SEOHead
        title="Your Optimised Resume — MatchRate"
        description="Your AI-rewritten, ATS-optimised resume tailored to your target job."
        canonicalUrl="https://www.matchrate.co/fix"
        noindex
      />

      <style id="resume-styles">{RESUME_TEMPLATE_CSS}</style>

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/analyzer")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to analyzer
        </Button>

        {(status === "verifying" || status === "rewriting") && (
          <Card className="p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">
              {status === "verifying"
                ? "Confirming your payment…"
                : "Rewriting your resume…"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {status === "verifying"
                ? "This takes a few seconds."
                : "Parsing your resume, then optimising for the target role. About 30–45 seconds."}
            </p>
          </Card>
        )}

        {status === "error" && (
          <Card className="p-8 border-destructive/30">
            <h2 className="text-xl font-semibold text-destructive mb-2">
              Something went wrong
            </h2>
            <p className="text-muted-foreground mb-4">{errorMsg}</p>
            <div className="flex gap-2">
              <Button onClick={handleRegenerate} variant="default">
                <RefreshCw className="h-4 w-4 mr-2" /> Try again
              </Button>
              <Button onClick={() => navigate("/analyzer")} variant="outline">
                Start a new analysis
              </Button>
            </div>
          </Card>
        )}

        {status === "ready" && resume && (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-1">
                    Your optimised resume is ready
                  </h2>
                  <p className="text-sm text-green-800/90 dark:text-green-400/90">
                    Tailored to your target job, ATS-friendly formatting, and
                    keyword-rich. Single A4 page. Download below.
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={handleDownloadPdf}
                className="flex-1 cta-gradient text-white font-semibold shadow-cta"
              >
                <Download className="h-5 w-5 mr-2" />
                Download as PDF
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleDownloadDocx}
                className="flex-1"
              >
                <FileText className="h-5 w-5 mr-2" />
                Download as DOCX
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={handleRegenerate}
                title="Generate a fresh version"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Regenerate
              </Button>
            </div>

            <Card className="p-0 overflow-hidden shadow-xl bg-muted">
              <div className="bg-muted/40 px-4 py-2 border-b border-border flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Live preview — single A4 page, exactly what you'll download
              </div>
              <div className="p-4 flex justify-center overflow-hidden">
                <div
                  style={{
                    transform: `scale(${autoScale})`,
                    transformOrigin: "top center",
                    width: "210mm",
                    height: autoScale < 1 ? `${297 * autoScale}mm` : "297mm",
                  }}
                >
                  <div ref={previewRef}>
                    <ResumeTemplate data={resume} />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default Fix;
