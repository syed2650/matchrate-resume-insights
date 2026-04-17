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

const REWRITE_SYSTEM = `You are Claude Opus 4.1 acting as a senior career coach and professional resume writer. Produce a complete, ATS-optimised, single-page resume in clean semantic HTML.

REQUIREMENTS:
- Reverse-chronological format.
- Sections (only include if data exists): HEADER (name, title, contact), PROFESSIONAL SUMMARY (3-4 lines), CORE SKILLS (grid of keywords), EXPERIENCE (company, title, dates, 3-5 bullets each), EDUCATION, CERTIFICATIONS (optional), PROJECTS (optional).
- Every bullet starts with a strong action verb and includes quantified impact where the original suggests it. Do NOT invent metrics that are not implied.
- Naturally weave the missing keywords from the analysis into Skills, Summary, and Experience bullets where they truthfully apply.
- UK English spelling.
- Professional, concise tone. No buzzword soup. No clichés like "team player" or "results-driven".

OUTPUT FORMAT:
Return STRICT JSON only:
{
  "html": "<full HTML body content (no <html>, <head>, or <body> tags) — only inner markup using semantic tags like <header>, <section>, <h1>, <h2>, <h3>, <p>, <ul>, <li>, <div class='row'>, etc.>",
  "summary_of_changes": ["<change 1>", "<change 2>", "<change 3>"]
}

CSS GUIDELINES (do not inline styles — your HTML will be wrapped by a stylesheet):
- Use class names: .resume, .resume-header, .name, .title, .contact, .section, .section-title, .role, .role-header, .company, .role-title, .role-dates, .bullets, .skills-grid, .skill, .education-item.
- Keep it semantic. The frontend handles all visual styling.

Do NOT output markdown fences. Do NOT add commentary. JSON only.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not configured");

    const { session_id } = await req.json();
    if (!session_id) {
      return new Response(JSON.stringify({ error: "session_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: session, error: fetchErr } = await supabase
      .from("analyzer_sessions")
      .select("*")
      .eq("id", session_id)
      .single();

    if (fetchErr || !session) {
      return new Response(JSON.stringify({ error: "Session not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ error: "Payment required before rewrite" }),
        {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // If we already rewrote it, return the cached version
    if (session.rewritten_resume_html) {
      return new Response(
        JSON.stringify({ html: session.rewritten_resume_html, cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log("Calling Claude Opus 4.1 for rewrite...");

    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-1",
        max_tokens: 4000,
        system: REWRITE_SYSTEM,
        messages: [
          {
            role: "user",
            content: `ORIGINAL RESUME:\n${session.resume_text}\n\nTARGET JOB DESCRIPTION:\n${session.job_description}\n\nANALYSIS JSON (use missing_keywords + skill_gaps + quick_wins):\n${JSON.stringify(session.analysis, null, 2)}\n\nReturn the rewritten resume JSON now.`,
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

    let parsed: any = null;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch (e) {
          console.error("Re-parse failed:", e);
        }
      }
    }

    const html = parsed?.html ?? rawText;

    await supabase
      .from("analyzer_sessions")
      .update({ rewritten_resume_html: html })
      .eq("id", session_id);

    return new Response(
      JSON.stringify({
        html,
        summary_of_changes: parsed?.summary_of_changes ?? [],
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("rewrite-with-claude error:", error);
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
