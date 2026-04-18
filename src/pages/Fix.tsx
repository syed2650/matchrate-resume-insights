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

const RESUME_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@400;600;700&display=swap');

.resume-page {
  width: 210mm;
  min-height: 297mm;
  max-height: 297mm;
  overflow: hidden;
  padding: 18mm 16mm 14mm;
  font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 10pt;
  line-height: 1.3;
  color: #1a1a1a;
  background: white;
  box-sizing: border-box;
  margin: 0 auto;
}
.resume-page * { box-sizing: border-box; }

.r-header { margin-bottom: 14px; }
.r-name { font-family: 'Libre Baskerville', Georgia, serif; font-size: 22pt; font-weight: 700; color: #0f172a; margin: 0 0 3px; line-height: 1.1; }
.r-title { font-size: 11pt; color: #2563eb; font-weight: 600; margin: 0 0 5px; }
.r-contact { font-size: 8.5pt; color: #475569; display: flex; gap: 14px; flex-wrap: wrap; }
.r-contact span { display: inline-flex; align-items: center; }
.r-contact span::before { content: "•"; margin-right: 5px; color: #94a3b8; }
.r-contact span:first-child::before { content: ""; margin: 0; }

.r-divider { border: none; border-top: 1.5px solid #0f172a; margin: 10px 0; }

.r-section { margin-bottom: 12px; }
.r-section-title { font-size: 8pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #2563eb; border-bottom: 1px solid #dbeafe; padding-bottom: 2px; margin: 0 0 8px; }

.r-role { margin-bottom: 9px; }
.r-role-top { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
.r-company { font-weight: 700; font-size: 10pt; color: #0f172a; }
.r-dates { font-size: 8.5pt; color: #64748b; font-weight: 600; white-space: nowrap; }
.r-position { font-size: 9.5pt; color: #374151; font-style: italic; margin: 1px 0 3px; }
.r-bullets { margin: 0; padding-left: 14px; }
.r-bullets li { font-size: 9pt; margin-bottom: 2px; line-height: 1.35; }

.r-summary { font-size: 9.5pt; line-height: 1.45; color: #374151; margin: 0; }

.r-skills { display: flex; flex-wrap: wrap; gap: 5px; }
.r-skill { background: #eff6ff; border: 1px solid #bfdbfe; padding: 2px 8px; border-radius: 3px; font-size: 8.5pt; color: #1d4ed8; }

.r-edu-title { font-weight: 700; font-size: 9.5pt; margin: 0; }
.r-edu-sub { font-size: 9pt; color: #475569; margin: 1px 0 0; }

@media print {
  @page { size: A4; margin: 0; }
  html, body { margin: 0; padding: 0; background: white; }
  .resume-page { box-shadow: none; margin: 0; max-height: none; }
}
`;

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
  const [resumeHtml, setResumeHtml] = useState<string | null>(null);
  const [summaryOfChanges, setSummaryOfChanges] = useState<string[]>([]);
  const [autoScale, setAutoScale] = useState<number>(1);
  const previewRef = useRef<HTMLDivElement>(null);
  const ranOnce = useRef(false);

  const runRewrite = async (force = false) => {
    setStatus("rewriting");
    const { data: rewriteData, error: rewriteError } =
      await supabase.functions.invoke("rewrite-with-claude", {
        body: { session_id: sessionId, force },
      });
    if (rewriteError) throw rewriteError;
    if (rewriteData?.error) throw new Error(rewriteData.error);
    if (!rewriteData?.html) throw new Error("No resume returned");

    setResumeHtml(rewriteData.html);
    setSummaryOfChanges(rewriteData.summary_of_changes ?? []);
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
            { body: { session_id: sessionId, stripe_session_id: stripeSessionId } },
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
  }, [resumeHtml]);

  const handleDownloadPdf = () => {
    if (!resumeHtml) return;
    track("PDF Downloaded");
    const win = window.open("", "_blank");
    if (!win) {
      toast({
        title: "Popup blocked",
        description: "Please allow popups to download your PDF.",
        variant: "destructive",
      });
      return;
    }
    win.document.write(`<!doctype html><html><head><title>Resume</title><meta charset="utf-8"><style>${RESUME_STYLES}</style></head><body>${resumeHtml}<script>window.onload=()=>{setTimeout(()=>window.print(),300);}<\/script></body></html>`);
    win.document.close();
  };

  const handleDownloadDocx = async () => {
    if (!resumeHtml) return;
    track("DOCX Downloaded");
    const blob = new Blob(
      [
        `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><style>${RESUME_STYLES}</style></head><body>${resumeHtml}</body></html>`,
      ],
      { type: "application/msword" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "matchrate-optimised-resume.doc";
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

      <style id="resume-styles">{RESUME_STYLES}</style>

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
                : "Claude is rewriting your resume…"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {status === "verifying"
                ? "This takes a few seconds."
                : "Crafting an ATS-optimised, single-page resume. About 30 seconds."}
            </p>
          </Card>
        )}

        {status === "error" && (
          <Card className="p-8 border-destructive/30">
            <h2 className="text-xl font-semibold text-destructive mb-2">
              Something went wrong
            </h2>
            <p className="text-muted-foreground mb-4">{errorMsg}</p>
            <Button onClick={() => navigate("/analyzer")}>
              Start a new analysis
            </Button>
          </Card>
        )}

        {status === "ready" && resumeHtml && (
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
                  {summaryOfChanges.length > 0 && (
                    <details className="mt-3 text-sm text-green-900/90 dark:text-green-300/90">
                      <summary className="cursor-pointer font-medium">
                        What changed?
                      </summary>
                      <ul className="mt-2 ml-4 list-disc space-y-1">
                        {summaryOfChanges.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </details>
                  )}
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

            <Card className="p-0 overflow-hidden shadow-xl bg-slate-100 dark:bg-slate-900">
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
                  <div
                    ref={previewRef}
                    dangerouslySetInnerHTML={{ __html: resumeHtml }}
                  />
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
