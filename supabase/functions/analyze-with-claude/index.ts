import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const ANALYSIS_PROMPT = `You are an expert resume analyst and recruiter with 15+ years of experience. Analyze the provided resume against the job description and return STRICT JSON only.

Return JSON with this exact shape:
{
  "match_score": <integer 0-100, overall fit for this role>,
  "ats_score": <integer 0-100, how well it parses through ATS>,
  "job_fit_score": <integer 0-100, alignment of skills/experience with JD requirements>,
  "summary_verdict": "<one professional sentence: would a recruiter shortlist this resume?>",
  "missing_keywords": ["keyword1", "keyword2", ...] (8-15 important keywords from the JD that are absent from the resume),
  "skill_gaps": [
    { "gap": "<skill or experience gap>", "why_it_matters": "<one sentence>" }
  ] (3-5 items, prioritised by importance),
  "ats_issues": [
    { "issue": "<formatting/parsing problem>", "fix": "<how to fix it>" }
  ] (2-4 items, empty array if none),
  "quick_wins": [
    { "action": "<specific actionable change>", "impact": "<one sentence on expected impact>" }
  ] (3 items, the highest-leverage changes),
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"] (3 things this resume does well)
}

Rules:
- UK English spelling.
- Be specific. Reference actual content from the resume and JD.
- Do not invent experience the candidate does not have.
- Output JSON only, no markdown fences, no preamble.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    const { resume_text, job_description, session_id, user_id } =
      await req.json();

    if (!resume_text || !job_description) {
      return new Response(
        JSON.stringify({ error: "resume_text and job_description are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log("Calling Claude Sonnet 4.5 for analysis...");

    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 2000,
        system: ANALYSIS_PROMPT,
        messages: [
          {
            role: "user",
            content: `RESUME:\n${resume_text}\n\nJOB DESCRIPTION:\n${job_description}\n\nReturn the analysis JSON now.`,
          },
        ],
      }),
    });

    if (!claudeResponse.ok) {
      const errText = await claudeResponse.text();
      console.error("Claude API error:", claudeResponse.status, errText);
      return new Response(
        JSON.stringify({
          error: `Claude API error (${claudeResponse.status}): ${errText.slice(0, 200)}`,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const claudeData = await claudeResponse.json();
    const rawText: string = claudeData?.content?.[0]?.text ?? "";

    // Extract JSON robustly
    let analysis: any = null;
    try {
      analysis = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          analysis = JSON.parse(match[0]);
        } catch (e) {
          console.error("JSON re-parse failed:", e);
        }
      }
    }

    if (!analysis) {
      return new Response(
        JSON.stringify({
          error: "Failed to parse Claude response as JSON",
          raw: rawText.slice(0, 500),
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Persist to analyzer_sessions (use service role to allow anon insert with all fields)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    let sessionRow: any = null;
    if (session_id) {
      const { data, error } = await supabase
        .from("analyzer_sessions")
        .update({
          analysis,
          match_score: analysis.match_score ?? null,
          ats_score: analysis.ats_score ?? null,
          job_fit_score: analysis.job_fit_score ?? null,
        })
        .eq("id", session_id)
        .select()
        .single();
      if (error) console.error("Update session error:", error);
      sessionRow = data;
    } else {
      const { data, error } = await supabase
        .from("analyzer_sessions")
        .insert({
          user_id: user_id ?? null,
          resume_text,
          job_description,
          analysis,
          match_score: analysis.match_score ?? null,
          ats_score: analysis.ats_score ?? null,
          job_fit_score: analysis.job_fit_score ?? null,
        })
        .select()
        .single();
      if (error) console.error("Insert session error:", error);
      sessionRow = data;
    }

    return new Response(
      JSON.stringify({ analysis, session: sessionRow }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("analyze-with-claude error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
