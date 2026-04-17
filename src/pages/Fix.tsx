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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthUser } from "@/hooks/useAuthUser";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import { track } from "@/lib/mixpanel";

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
  const previewRef = useRef<HTMLDivElement>(null);
  const ranOnce = useRef(false);

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
        // Step 1: verify payment if we just came back from Stripe
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

        // Step 2: trigger rewrite
        setStatus("rewriting");
        const { data: rewriteData, error: rewriteError } =
          await supabase.functions.invoke("rewrite-with-claude", {
            body: { session_id: sessionId },
          });
        if (rewriteError) throw rewriteError;
        if (rewriteData?.error) throw new Error(rewriteData.error);
        if (!rewriteData?.html) throw new Error("No resume returned");

        setResumeHtml(rewriteData.html);
        setSummaryOfChanges(rewriteData.summary_of_changes ?? []);
        setStatus("ready");
        track("Resume Rewritten");

        // Clear sessionStorage now that we have the persistent version
        sessionStorage.removeItem("matchrate_pending_analysis");
      } catch (err: any) {
        console.error(err);
        setStatus("error");
        setErrorMsg(err?.message ?? "Something went wrong.");
      }
    })();
  }, [authLoading, user, sessionId, stripeSessionId, navigate, toast]);

  const handleDownloadPdf = () => {
    if (!previewRef.current) return;
    track("PDF Downloaded");
    // Use browser print to PDF — clean, dependency-free, professional
    const styles = document.getElementById("resume-styles")?.innerHTML ?? "";
    const html = previewRef.current.innerHTML;
    const win = window.open("", "_blank");
    if (!win) {
      toast({
        title: "Popup blocked",
        description: "Please allow popups to download your PDF.",
        variant: "destructive",
      });
      return;
    }
    win.document.write(`<!doctype html><html><head><title>Resume</title><style>${styles}@page{margin:0.5in;size:letter;}body{margin:0;}</style></head><body>${html}<script>window.onload=()=>{window.print();}</script></body></html>`);
    win.document.close();
  };

  const handleDownloadDocx = async () => {
    if (!resumeHtml) return;
    track("DOCX Downloaded");
    // Lightweight HTML→DOCX trick: produce a Word-readable .doc file from HTML
    const styles = document.getElementById("resume-styles")?.innerHTML ?? "";
    const blob = new Blob(
      [
        `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><style>${styles}</style></head><body>${resumeHtml}</body></html>`,
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

  return (
    <>
      <SEOHead
        title="Your Optimised Resume — MatchRate"
        description="Your AI-rewritten, ATS-optimised resume tailored to your target job."
        canonicalUrl="https://www.matchrate.co/fix"
        noindex
      />

      {/* Resume styles — used in both preview and PDF print */}
      <style id="resume-styles">{`
        .resume {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #1a1a1a;
          line-height: 1.5;
          max-width: 8.5in;
          margin: 0 auto;
          padding: 0.6in 0.7in;
          background: white;
          font-size: 10.5pt;
        }
        .resume * { box-sizing: border-box; }
        .resume-header { text-align: center; margin-bottom: 18px; padding-bottom: 14px; border-bottom: 2px solid #1a1a1a; }
        .resume-header .name, .resume .name { font-size: 22pt; font-weight: 800; letter-spacing: -0.5px; margin: 0 0 4px; color: #0f172a; }
        .resume-header .title, .resume .title { font-size: 11pt; color: #475569; font-weight: 500; margin: 0 0 6px; }
        .resume-header .contact, .resume .contact { font-size: 9.5pt; color: #475569; }
        .resume-header .contact span, .resume .contact span { margin: 0 6px; }
        .resume .section { margin-top: 16px; }
        .resume .section-title, .resume h2 { font-size: 11pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; margin: 0 0 10px; }
        .resume .role { margin-bottom: 12px; }
        .resume .role-header, .resume h3 { display: flex; justify-content: space-between; align-items: baseline; margin: 0 0 2px; font-size: 10.5pt; font-weight: 700; color: #0f172a; }
        .resume .company { font-style: italic; color: #475569; font-size: 10pt; margin: 0 0 4px; }
        .resume .role-title { font-weight: 700; }
        .resume .role-dates { font-weight: 500; color: #64748b; font-size: 9.5pt; }
        .resume .bullets, .resume ul { margin: 4px 0 0; padding-left: 18px; }
        .resume .bullets li, .resume ul li { margin-bottom: 3px; font-size: 10pt; }
        .resume .skills-grid { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
        .resume .skill { background: #f1f5f9; padding: 3px 9px; border-radius: 3px; font-size: 9.5pt; color: #334155; }
        .resume p { margin: 0 0 6px; font-size: 10pt; }
        .resume .education-item { margin-bottom: 8px; }
        @media print {
          .resume { padding: 0; max-width: none; }
        }
      `}</style>

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
                : "Claude Opus is rewriting your resume…"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {status === "verifying"
                ? "This takes a few seconds."
                : "Crafting an ATS-optimised, recruiter-ready resume. About 30 seconds."}
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
                    keyword-rich. Download below.
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
            </div>

            <Card className="p-0 overflow-hidden shadow-xl">
              <div className="bg-muted/40 px-4 py-2 border-b border-border flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Live preview — exactly what you'll download
              </div>
              <div
                ref={previewRef}
                className="bg-white"
                dangerouslySetInnerHTML={{
                  __html: `<div class="resume">${resumeHtml}</div>`,
                }}
              />
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default Fix;
