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
const CLAUDE_MODEL = "claude-sonnet-4-6";

type CandidateInfo = {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  location: string;
  currentTitle: string;
};

const EMPTY_CANDIDATE: CandidateInfo = {
  fullName: "",
  email: "",
  phone: "",
  linkedin: "",
  location: "",
  currentTitle: "",
};

function escapeHtml(s: string) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------- Step 1: Separate Claude call to extract candidate details ----------
async function extractCandidateInfo(resumeText: string): Promise<CandidateInfo> {
  const extractionResponse = await fetch(
    "https://api.anthropic.com/v1/messages",
    {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: `Extract the following fields from this resume text. Return ONLY a valid JSON object. No markdown. No explanation. No backticks.

Fields to extract:
{
  "fullName": "",
  "email": "",
  "phone": "",
  "linkedin": "",
  "location": "",
  "currentTitle": ""
}

If a field is not found, return an empty string "".

Resume text:
${resumeText}`,
          },
        ],
      }),
    },
  );

  if (!extractionResponse.ok) {
    const errText = await extractionResponse.text();
    console.error("Extraction API error:", extractionResponse.status, errText);
    return { ...EMPTY_CANDIDATE };
  }

  const extractData = await extractionResponse.json();
  const rawText: string = extractData?.content?.[0]?.text ?? "{}";

  try {
    const cleaned = rawText.trim().replace(/^```json\s*/i, "").replace(/```$/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return { ...EMPTY_CANDIDATE, ...parsed };
  } catch {
    const match = rawText.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return { ...EMPTY_CANDIDATE, ...JSON.parse(match[0]) };
      } catch (e) {
        console.error("Extraction parse failed", e);
      }
    }
    return { ...EMPTY_CANDIDATE };
  }
}

function buildHeaderHTML(info: CandidateInfo, jobTitle: string) {
  const contactSpans = [info.email, info.phone, info.linkedin, info.location]
    .filter(Boolean)
    .map((v) => `<span>${escapeHtml(v)}</span>`)
    .join("");

  const title = jobTitle?.trim() || info.currentTitle || "";

  return `<div class="r-header">
  <h1 class="r-name">${escapeHtml(info.fullName)}</h1>
  <p class="r-title">${escapeHtml(title)}</p>
  <div class="r-contact">${contactSpans}</div>
</div>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not configured");

    const { session_id, force, retry_compact } = await req.json();
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

    if (session.rewritten_resume_html && !force && !retry_compact) {
      return new Response(
        JSON.stringify({ html: session.rewritten_resume_html, cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ---------- STEP 1: Extract candidate info via separate Claude call ----------
    console.log("Step 1: Extracting candidate info via Claude…");
    const candidateInfo = await extractCandidateInfo(session.resume_text ?? "");
    console.log("Extracted candidateInfo:", candidateInfo);

    const analysis = session.analysis ?? {};
    const missingKeywords: string[] = analysis?.missing_keywords ?? [];
    const jobTitle: string =
      analysis?.target_job_title ||
      analysis?.job_title ||
      candidateInfo.currentTitle ||
      "";

    // ---------- STEP 2: Pre-build header HTML in code ----------
    const headerHTML = buildHeaderHTML(candidateInfo, jobTitle);

    // ---------- STEP 3: Rewrite prompt uses pre-built header verbatim ----------
    const compactInstruction = retry_compact
      ? `\n\nIMPORTANT RETRY INSTRUCTION: The previous output was too long. Reduce bullets to 2 per role and shorten the summary to 2 sentences. Drop the oldest or least relevant role if needed.`
      : "";

    const rewritePrompt = `You are rewriting a resume to optimise it for a specific job.

CANDIDATE DETAILS (already extracted — do not modify):
- Full Name: ${candidateInfo.fullName}
- Email: ${candidateInfo.email}
- Phone: ${candidateInfo.phone}
- LinkedIn: ${candidateInfo.linkedin}
- Location: ${candidateInfo.location}
- Current Title: ${candidateInfo.currentTitle}

TARGET ROLE: ${jobTitle}

JOB DESCRIPTION:
${session.job_description}

ORIGINAL RESUME:
${session.resume_text}

OUTPUT REQUIREMENTS:
- Return ONLY raw HTML starting with <div class="resume-page"> and ending with </div>
- No markdown, no code fences, no explanation
- The FIRST child inside <div class="resume-page"> must be exactly this header block (use it verbatim, do not modify):

${headerHTML}

- After the header, add an <hr class="r-divider"> and then the resume sections in this order:
  1. Professional Summary (max 3 sentences) — wrap in <section class="r-section"><h2 class="r-section-title">Professional Summary</h2><p class="r-summary">…</p></section>
  2. Experience (roles using r-role structure: <div class="r-role"><div class="r-role-top"><span class="r-company">Company</span><span class="r-dates">Dates</span></div><p class="r-position">Title</p><ul class="r-bullets"><li>…</li></ul></div>)
  3. Skills (using <div class="r-skills"><span class="r-skill">…</span></div>)
  4. Education (<p class="r-edu-title">Degree</p><p class="r-edu-sub">Institution · Year</p>)

CONTENT RULES:
- Maximum 3 bullet points per role
- Every bullet starts with a strong action verb. Quantify only where the original suggests it. Do NOT invent metrics.
- Keep all dates, companies, and job titles accurate — do not invent anything
- UK English spelling. Professional, concise tone.
- Naturally incorporate these keywords where truthful: ${missingKeywords.join(", ") || "(none)"}

A4 CONSTRAINT (CRITICAL — one page only):
- If candidate has more than 5 roles, include only the 4 most recent/relevant
- If content still looks long, reduce bullets to 2 per role
- If still too long, shorten summary to 2 sentences
- Drop older or less relevant roles first
- Content must fit within 277mm height${compactInstruction}

Return the raw HTML now.`;

    console.log("Step 2: Calling Claude for rewrite…");
    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 4000,
        messages: [{ role: "user", content: rewritePrompt }],
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

    let html = rawText.trim();
    // Strip any accidental markdown fences
    html = html.replace(/^```html\s*/i, "").replace(/^```\s*/i, "").replace(/```$/g, "").trim();

    // Safety: if the model didn't include the header verbatim, inject it.
    if (!html.includes('class="r-header"') && candidateInfo.fullName) {
      html = html.replace(
        /<div class="resume-page">/,
        `<div class="resume-page">\n${headerHTML}\n<hr class="r-divider">`,
      );
    }

    await supabase
      .from("analyzer_sessions")
      .update({ rewritten_resume_html: html })
      .eq("id", session_id);

    return new Response(
      JSON.stringify({
        html,
        candidateInfo,
        retry_compact: !!retry_compact,
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
