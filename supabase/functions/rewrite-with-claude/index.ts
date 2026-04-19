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

type Experience = {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
};

type Education = {
  degree: string;
  school: string;
  location: string;
  startYear: string;
  endYear: string;
};

type StructuredResume = {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  location: string;
  summary: string;
  experience: Experience[];
  skills: string[];
  education: Education[];
};

type FinalResume = StructuredResume & { targetTitle: string };

function stripFences(s: string): string {
  return s
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/g, "")
    .trim();
}

function safeParseJson<T>(raw: string): T | null {
  try {
    return JSON.parse(stripFences(raw)) as T;
  } catch {
    const m = raw.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        return JSON.parse(m[0]) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}

async function callClaude(prompt: string, maxTokens: number): Promise<string> {
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Claude API ${resp.status}: ${errText.slice(0, 300)}`);
  }
  const data = await resp.json();
  return data?.content?.[0]?.text ?? "";
}

// ---------- STEP 1: Parse resume into structured JSON ----------
async function parseResume(resumeText: string): Promise<StructuredResume> {
  const prompt = `Parse this resume into structured JSON. Return ONLY valid JSON, no markdown, no explanation, no code fences.

Schema:
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "linkedin": "string",
  "location": "string",
  "summary": "string (professional summary paragraph)",
  "experience": [
    {
      "company": "string",
      "title": "string",
      "location": "string",
      "startDate": "MM/YYYY",
      "endDate": "MM/YYYY or Present",
      "bullets": ["string", "string", "string"]
    }
  ],
  "skills": ["string", "string"],
  "education": [
    {
      "degree": "string",
      "school": "string",
      "location": "string",
      "startYear": "YYYY",
      "endYear": "YYYY"
    }
  ]
}

Rules:
- If a field is missing, use an empty string "" or empty array []
- Extract the name from the top of the resume — it is NEVER a job title
- Phone numbers, emails, and LinkedIn URLs are usually near the top
- Include ALL experience entries, even older ones
- Preserve original bullet text exactly — do not rewrite yet

Resume text:
${resumeText}`;

  const raw = await callClaude(prompt, 2000);
  const parsed = safeParseJson<StructuredResume>(raw);
  if (!parsed) {
    console.error("Parse failed. Raw:", raw.slice(0, 500));
    throw new Error("Could not parse resume into structured JSON");
  }

  // Defensive defaults
  const safe: StructuredResume = {
    fullName: parsed.fullName ?? "",
    email: parsed.email ?? "",
    phone: parsed.phone ?? "",
    linkedin: parsed.linkedin ?? "",
    location: parsed.location ?? "",
    summary: parsed.summary ?? "",
    experience: Array.isArray(parsed.experience) ? parsed.experience : [],
    skills: Array.isArray(parsed.skills) ? parsed.skills : [],
    education: Array.isArray(parsed.education) ? parsed.education : [],
  };

  if (!safe.fullName || safe.fullName.trim().length < 2) {
    throw new Error(
      "Could not read your name from the resume. Please check the uploaded file.",
    );
  }
  return safe;
}

// ---------- STEP 2: Rewrite content for the target job ----------
async function rewriteContent(
  structured: StructuredResume,
  jobTitle: string,
  jobDescription: string,
  missingKeywords: string[],
): Promise<{
  summary: string;
  experience: Experience[];
  skills: string[];
}> {
  const prompt = `You are optimising a resume for a specific job. Rewrite ONLY the content fields. Keep all names, companies, dates, and contact info exactly as provided.

TARGET JOB: ${jobTitle}
JOB DESCRIPTION: ${jobDescription}
MISSING KEYWORDS TO INCORPORATE: ${missingKeywords.join(", ") || "(none)"}

CURRENT RESUME DATA:
${JSON.stringify(structured, null, 2)}

Return ONLY valid JSON in this exact schema. No markdown, no explanation:
{
  "summary": "string (max 3 sentences, optimised for the target role)",
  "experience": [
    {
      "company": "EXACT original company name",
      "title": "EXACT original title",
      "location": "EXACT original location",
      "startDate": "EXACT original",
      "endDate": "EXACT original",
      "bullets": ["rewritten bullet 1", "rewritten bullet 2", "rewritten bullet 3"]
    }
  ],
  "skills": ["skill1", "skill2"]
}

Rules:
- Maximum 3 bullets per role, each 1-2 lines
- If the resume has more than 5 roles, keep only the 4 most recent
- Bullets must start with strong action verbs and include metrics where present in the original
- Naturally incorporate missing keywords — do not stuff them
- Skills list: 12-16 skills, reordered with most job-relevant first
- DO NOT invent experience, metrics, or skills that aren't in the original
- DO NOT change company names, titles, or dates
- Use UK English spelling`;

  const raw = await callClaude(prompt, 2500);
  const parsed = safeParseJson<{
    summary: string;
    experience: Experience[];
    skills: string[];
  }>(raw);

  if (!parsed) {
    console.error("Rewrite parse failed. Raw:", raw.slice(0, 500));
    throw new Error("Could not rewrite resume content");
  }

  return {
    summary: parsed.summary ?? structured.summary,
    experience: Array.isArray(parsed.experience)
      ? parsed.experience
      : structured.experience,
    skills: Array.isArray(parsed.skills) ? parsed.skills : structured.skills,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

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

    // Cached path: rewritten_resume_html column now stores the JSON of finalResume
    if (session.rewritten_resume_html && !force) {
      const cached = safeParseJson<FinalResume>(session.rewritten_resume_html);
      if (cached && cached.fullName) {
        return new Response(
          JSON.stringify({ resume: cached, cached: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      // If old HTML cache exists, ignore and regenerate.
    }

    const analysis = session.analysis ?? {};
    const missingKeywords: string[] = analysis?.missing_keywords ?? [];
    const jobTitle: string =
      analysis?.target_job_title || analysis?.job_title || "";

    console.log("Step 1: Parsing resume into JSON…");
    const structured = await parseResume(session.resume_text ?? "");
    console.log("Parsed candidate:", structured.fullName);

    console.log("Step 2: Rewriting content for target role…");
    const rewritten = await rewriteContent(
      structured,
      jobTitle,
      session.job_description ?? "",
      missingKeywords,
    );

    // Validate we have at least one valid experience entry
    const validExperience = rewritten.experience.filter(
      (e) => e?.company && e?.title,
    );
    if (validExperience.length === 0) {
      throw new Error("No valid work experience entries found in your resume");
    }

    const finalResume: FinalResume = {
      fullName: structured.fullName,
      email: structured.email,
      phone: structured.phone,
      linkedin: structured.linkedin,
      location: structured.location,
      targetTitle: jobTitle,
      summary: rewritten.summary,
      experience: validExperience,
      skills: rewritten.skills,
      education: structured.education,
    };

    await supabase
      .from("analyzer_sessions")
      .update({ rewritten_resume_html: JSON.stringify(finalResume) })
      .eq("id", session_id);

    return new Response(
      JSON.stringify({ resume: finalResume }),
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
