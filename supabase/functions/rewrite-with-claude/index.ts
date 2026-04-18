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

// ---------- Candidate detail extraction ----------
function extractCandidateDetails(resumeText: string) {
  const text = resumeText.replace(/\r/g, "");
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const email = emailMatch ? emailMatch[0] : "";

  const phoneMatch = text.match(
    /(\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/,
  );
  const phone = phoneMatch ? phoneMatch[0].trim() : "";

  const linkedinMatch = text.match(
    /(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9\-_%]+\/?/i,
  );
  const linkedin = linkedinMatch ? linkedinMatch[0] : "";

  // Name: first non-empty line that isn't email/phone/linkedin and looks like a name
  let name = "";
  for (const line of lines.slice(0, 6)) {
    if (
      !/@|linkedin|http|\d{3}/i.test(line) &&
      line.length < 60 &&
      /^[A-Za-z][A-Za-z .'\-]+$/.test(line) &&
      line.split(/\s+/).length <= 5 &&
      line.split(/\s+/).length >= 2
    ) {
      name = line;
      break;
    }
  }

  // Location: look for "City, ST" or "City, Country" pattern in first ~10 lines
  let location = "";
  for (const line of lines.slice(0, 10)) {
    const m = line.match(
      /([A-Z][a-zA-Z .'-]+,\s*[A-Z][a-zA-Z .'-]+(?:,\s*[A-Z]{2,})?)/,
    );
    if (m && !/@|http|linkedin/i.test(m[0]) && m[0].length < 60) {
      location = m[0];
      break;
    }
  }

  return { name, email, phone, linkedin, location };
}

const REWRITE_SYSTEM = `You are Claude acting as a senior career coach and professional resume writer. Produce a complete, ATS-optimised, SINGLE-PAGE resume in clean semantic HTML.

CRITICAL RULES:
- You MUST use the candidate's actual name, email, phone, location, and LinkedIn URL exactly as provided in the user message. Never invent or use placeholders like "CANDIDATE NAME" or "contact@email.com".
- Keep the resume to ONE A4 page. Maximum 3 bullet points per role. Summary maximum 3 sentences. Maximum 12 skills.
- Reverse-chronological format.
- Every bullet starts with a strong action verb. Quantify impact only where the original suggests it. Do NOT invent metrics.
- Naturally weave the missing keywords into Skills, Summary, and Experience bullets where they truthfully apply.
- UK English spelling. Professional, concise tone. No "team player", "results-driven", or buzzword soup.
- Return ONLY the HTML body content (no <html>, <head>, <body>, no markdown fences, no commentary).

REQUIRED HTML STRUCTURE (use these exact class names):
<div class="resume-page">
  <header class="r-header">
    <h1 class="r-name">[ACTUAL NAME]</h1>
    <p class="r-title">[Target Job Title]</p>
    <div class="r-contact">
      <span>[email]</span>
      <span>[phone]</span>
      <span>[linkedin]</span>
      <span>[location]</span>
    </div>
  </header>
  <hr class="r-divider" />

  <section class="r-section">
    <h2 class="r-section-title">Professional Summary</h2>
    <p class="r-summary">...</p>
  </section>

  <section class="r-section">
    <h2 class="r-section-title">Experience</h2>
    <div class="r-role">
      <div class="r-role-top">
        <span class="r-company">[Company]</span>
        <span class="r-dates">[Dates]</span>
      </div>
      <p class="r-position">[Job Title]</p>
      <ul class="r-bullets">
        <li>...</li>
      </ul>
    </div>
  </section>

  <section class="r-section">
    <h2 class="r-section-title">Skills</h2>
    <div class="r-skills">
      <span class="r-skill">[skill]</span>
    </div>
  </section>

  <section class="r-section">
    <h2 class="r-section-title">Education</h2>
    <div>
      <p class="r-edu-title">[Degree]</p>
      <p class="r-edu-sub">[Institution] · [Year]</p>
    </div>
  </section>
</div>

Return STRICT JSON only:
{
  "html": "<the full <div class='resume-page'>...</div> markup>",
  "summary_of_changes": ["change 1", "change 2", "change 3"]
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not configured");

    const { session_id, force } = await req.json();
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

    if (session.rewritten_resume_html && !force) {
      return new Response(
        JSON.stringify({ html: session.rewritten_resume_html, cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const candidate = extractCandidateDetails(session.resume_text ?? "");
    const missingKeywords: string[] =
      session.analysis?.missing_keywords ?? [];

    console.log("Calling Claude Sonnet 4.5 for rewrite. Candidate:", candidate);

    const userMessage = `CANDIDATE DETAILS (use these EXACTLY in the header — do not invent or use placeholders):
- Name: ${candidate.name || "(not detected — use the name from the resume below)"}
- Email: ${candidate.email || "(not detected — use the email from the resume below)"}
- Phone: ${candidate.phone || "(not detected — omit if missing)"}
- LinkedIn: ${candidate.linkedin || "(not detected — omit if missing)"}
- Location: ${candidate.location || "(not detected — omit if missing)"}

MISSING KEYWORDS to weave in naturally where truthful:
${missingKeywords.join(", ") || "(none)"}

ORIGINAL RESUME:
${session.resume_text}

TARGET JOB DESCRIPTION:
${session.job_description}

ANALYSIS JSON (use skill_gaps + quick_wins):
${JSON.stringify(session.analysis, null, 2)}

Return the rewritten resume JSON now. Remember: ONE PAGE, max 3 bullets per role, summary max 3 sentences, real candidate details only.`;

    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 4000,
        system: REWRITE_SYSTEM,
        messages: [{ role: "user", content: userMessage }],
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

    let html: string = parsed?.html ?? rawText;

    // Safety: strip code fences if any
    html = html.replace(/^```html\s*/i, "").replace(/```$/g, "").trim();

    await supabase
      .from("analyzer_sessions")
      .update({ rewritten_resume_html: html })
      .eq("id", session_id);

    return new Response(
      JSON.stringify({
        html,
        summary_of_changes: parsed?.summary_of_changes ?? [],
        candidate,
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
