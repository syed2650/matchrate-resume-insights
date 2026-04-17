import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, useSearchParams } from "react-router-dom";
import mammoth from "mammoth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  FileText,
  Upload,
  Loader2,
  Sparkles,
  X,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Target,
  Shield,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthUser } from "@/hooks/useAuthUser";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import { track } from "@/lib/mixpanel";

type Analysis = {
  match_score: number;
  ats_score: number;
  job_fit_score: number;
  summary_verdict: string;
  missing_keywords: string[];
  skill_gaps: { gap: string; why_it_matters: string }[];
  ats_issues: { issue: string; fix: string }[];
  quick_wins: { action: string; impact: string }[];
  strengths: string[];
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ScoreGauge = ({ score, label }: { score: number; label: string }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const colour =
    score >= 80
      ? "hsl(142 71% 45%)"
      : score >= 60
        ? "hsl(38 92% 50%)"
        : "hsl(0 84% 60%)";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="hsl(var(--muted))"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke={colour}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-foreground">{score}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-foreground">{label}</span>
    </div>
  );
};

const Analyzer = () => {
  const { toast } = useToast();
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLaunchingCheckout, setIsLaunchingCheckout] = useState(false);

  useEffect(() => {
    if (searchParams.get("cancelled") === "1") {
      toast({
        title: "Payment cancelled",
        description: "Your analysis is still here. Try again any time.",
      });
    }
  }, [searchParams, toast]);

  // Restore session from sessionStorage if user signed in and came back
  useEffect(() => {
    const stored = sessionStorage.getItem("matchrate_pending_analysis");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.analysis) setAnalysis(parsed.analysis);
        if (parsed.sessionId) setSessionId(parsed.sessionId);
        if (parsed.resumeText) setResumeText(parsed.resumeText);
        if (parsed.jobDescription) setJobDescription(parsed.jobDescription);
      } catch (e) {
        console.error("Failed to restore session:", e);
      }
    }
  }, []);

  const handleFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB.",
        variant: "destructive",
      });
      return;
    }
    setIsParsing(true);
    setResumeFileName(file.name);
    try {
      let text = "";
      if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (file.type === "text/plain") {
        text = await file.text();
      } else if (file.type === "application/pdf") {
        toast({
          title: "PDF temporarily disabled",
          description: "Please upload DOCX or paste your resume text.",
          variant: "destructive",
        });
        setIsParsing(false);
        setResumeFileName(null);
        return;
      } else {
        toast({
          title: "Unsupported file type",
          description: "Please upload a DOCX or TXT file, or paste your text.",
          variant: "destructive",
        });
        setIsParsing(false);
        setResumeFileName(null);
        return;
      }

      const cleaned = text
        .replace(/\r\n/g, "\n")
        .replace(/[^\S\n]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      if (cleaned.length < 100) {
        toast({
          title: "Not enough text",
          description: "We couldn't extract enough content from that file.",
          variant: "destructive",
        });
        setResumeFileName(null);
      } else {
        setResumeText(cleaned);
        track("Resume Uploaded", { source: "analyzer" });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Could not read file",
        description: "Try a different file or paste your resume text.",
        variant: "destructive",
      });
      setResumeFileName(null);
    } finally {
      setIsParsing(false);
    }
  };

  const onDrop = useCallback(
    (files: File[]) => {
      if (files[0]) handleFile(files[0]);
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
  });

  const handleAnalyse = async () => {
    if (!resumeText.trim() || resumeText.trim().length < 100) {
      toast({
        title: "Resume too short",
        description: "Please upload or paste your full resume.",
        variant: "destructive",
      });
      return;
    }
    if (!jobDescription.trim() || jobDescription.trim().length < 50) {
      toast({
        title: "Job description required",
        description: "Please paste the full job description.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalysing(true);
    setAnalysis(null);
    track("Analyse Clicked", { hasUser: !!user });

    try {
      const { data, error } = await supabase.functions.invoke(
        "analyze-with-claude",
        {
          body: {
            resume_text: resumeText,
            job_description: jobDescription,
            user_id: user?.id ?? null,
          },
        },
      );

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setAnalysis(data.analysis);
      setSessionId(data.session?.id ?? null);
      track("Analysis Complete", {
        match_score: data.analysis?.match_score,
      });

      // Persist for post-login restore
      sessionStorage.setItem(
        "matchrate_pending_analysis",
        JSON.stringify({
          analysis: data.analysis,
          sessionId: data.session?.id,
          resumeText,
          jobDescription,
        }),
      );

      // Smooth scroll to results
      setTimeout(() => {
        document
          .getElementById("results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Analysis failed",
        description:
          err?.message ?? "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleFixResume = async () => {
    if (!sessionId || !analysis) return;
    track("Fix My Resume Clicked", { hasUser: !!user });

    if (!user) {
      // Persist current state and send to /auth
      sessionStorage.setItem(
        "matchrate_pending_analysis",
        JSON.stringify({ analysis, sessionId, resumeText, jobDescription }),
      );
      sessionStorage.setItem("matchrate_post_auth_redirect", "/analyzer#fix");
      toast({
        title: "Quick sign-in",
        description:
          "Create an account to save your resume and complete payment.",
      });
      navigate("/auth");
      return;
    }

    setIsLaunchingCheckout(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-fix-checkout",
        { body: { session_id: sessionId } },
      );
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Could not start checkout",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLaunchingCheckout(false);
    }
  };

  // Auto-trigger checkout if user just signed in and we have pending state
  useEffect(() => {
    if (
      user &&
      sessionId &&
      analysis &&
      sessionStorage.getItem("matchrate_post_auth_redirect") === "/analyzer#fix"
    ) {
      sessionStorage.removeItem("matchrate_post_auth_redirect");
      handleFixResume();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, sessionId, analysis]);

  const clearFile = () => {
    setResumeFileName(null);
    setResumeText("");
  };

  return (
    <>
      <SEOHead
        title="Free Resume Analyzer — ATS Score & Job Match | MatchRate"
        description="Upload your resume and a job description to get an instant AI-powered analysis: match score, ATS check, missing keywords, and quick wins. Free."
        canonicalUrl="https://www.matchrate.co/analyzer"
      />
      <div className="container mx-auto px-4 py-10 md:py-16 max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">
            Analyse your resume in 60 seconds
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Get an instant AI audit of how your resume stacks up against any
            job description. Free, no signup required.
          </p>
        </div>

        <Card className="p-6 md:p-8 mb-8 shadow-lg border-border/60">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Resume input */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-foreground">
                1. Your Resume
              </label>
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-3">
                  <TabsTrigger value="upload">
                    <Upload className="h-4 w-4 mr-2" /> Upload
                  </TabsTrigger>
                  <TabsTrigger value="paste">
                    <FileText className="h-4 w-4 mr-2" /> Paste text
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="upload">
                  {!resumeFileName ? (
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        isDragActive
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-muted/30"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm font-medium mb-1">
                        {isDragActive
                          ? "Drop your DOCX here"
                          : "Drag & drop your DOCX or click to browse"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        DOCX or TXT, max 5MB
                      </p>
                    </div>
                  ) : (
                    <div className="border border-border rounded-lg p-4 flex items-center justify-between bg-muted/30">
                      <div className="flex items-center gap-3 min-w-0">
                        {isParsing ? (
                          <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {resumeFileName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {isParsing
                              ? "Reading…"
                              : `${resumeText.length} characters extracted`}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={clearFile}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="paste">
                  <Textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your full resume text here…"
                    className="min-h-[260px] resize-y"
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Job description input */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-foreground">
                2. Job Description
              </label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description you're targeting…"
                className="min-h-[316px] resize-y"
              />
            </div>
          </div>

          <div className="mt-6">
            <Button
              size="lg"
              onClick={handleAnalyse}
              disabled={isAnalysing}
              className="w-full md:w-auto md:px-12 cta-gradient text-white font-semibold shadow-cta hover:shadow-glow-violet"
            >
              {isAnalysing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analysing with Claude…
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Analyse My Resume
                </>
              )}
            </Button>
            {!analysis && (
              <p className="text-xs text-muted-foreground mt-3">
                Powered by Claude Sonnet 4.5 • Takes about 20 seconds
              </p>
            )}
          </div>
        </Card>

        {analysis && (
          <div id="results" className="space-y-6 animate-fade-in">
            <Card className="p-6 md:p-8 shadow-lg border-border/60">
              <div className="text-center mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                  Analysis Complete
                </p>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Your Resume Audit
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {analysis.summary_verdict}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 py-4 border-y border-border/60">
                <ScoreGauge
                  score={analysis.match_score}
                  label="Overall Match"
                />
                <ScoreGauge
                  score={analysis.ats_score}
                  label="ATS Safety"
                />
                <ScoreGauge
                  score={analysis.job_fit_score}
                  label="Job Fit"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Missing keywords */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Missing Keywords</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missing_keywords.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No critical keywords missing — great job.
                      </p>
                    ) : (
                      analysis.missing_keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900"
                        >
                          {kw}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Strengths */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold">What You're Doing Well</h3>
                  </div>
                  <ul className="space-y-2">
                    {analysis.strengths.map((s, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex gap-2"
                      >
                        <span className="text-green-600">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skill gaps */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <h3 className="font-semibold">
                      Skill & Experience Gaps
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {analysis.skill_gaps.map((g, i) => (
                      <li
                        key={i}
                        className="bg-muted/40 rounded-lg p-3 border border-border/60"
                      >
                        <p className="font-medium text-sm">{g.gap}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {g.why_it_matters}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ATS issues */}
                {analysis.ats_issues.length > 0 && (
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-5 w-5 text-red-500" />
                      <h3 className="font-semibold">ATS Issues</h3>
                    </div>
                    <ul className="space-y-3">
                      {analysis.ats_issues.map((g, i) => (
                        <li
                          key={i}
                          className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3 border border-red-200 dark:border-red-900/50"
                        >
                          <p className="font-medium text-sm text-red-900 dark:text-red-300">
                            {g.issue}
                          </p>
                          <p className="text-xs text-red-700/80 dark:text-red-400/80 mt-1">
                            Fix: {g.fix}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quick wins */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-5 w-5 text-violet-500" />
                    <h3 className="font-semibold">Quick Wins</h3>
                  </div>
                  <ol className="space-y-3">
                    {analysis.quick_wins.map((q, i) => (
                      <li
                        key={i}
                        className="bg-violet-50 dark:bg-violet-950/20 rounded-lg p-4 border border-violet-200 dark:border-violet-900/50 flex gap-3"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500 text-white text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-medium text-sm">{q.action}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {q.impact}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </Card>

            {/* Paid CTA */}
            <Card className="p-6 md:p-8 cta-gradient text-white shadow-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold mb-1">
                    Ready to fix everything?
                  </h3>
                  <p className="text-white/90 text-sm md:text-base">
                    Get an ATS-optimised, recruiter-ready resume in 60 seconds.
                    One-time $4.99. No subscription.
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={handleFixResume}
                  disabled={isLaunchingCheckout}
                  className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg whitespace-nowrap"
                >
                  {isLaunchingCheckout ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Loading…
                    </>
                  ) : (
                    <>
                      Fix My Resume — $4.99
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default Analyzer;
