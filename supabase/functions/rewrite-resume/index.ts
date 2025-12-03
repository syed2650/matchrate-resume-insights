import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText } = await req.json();

    if (!resumeText) {
      return new Response(
        JSON.stringify({ error: 'Resume text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Rewriting resume...');

    const prompt = `You are the "Resume Improvement Agent" for MatchRate.co.

Your job:
Rewrite ONLY the following sections of the user's resume:
1. Professional Summary
2. Bullet points (experience section)
3. Skills phrasing (optional)
Do NOT rewrite the entire resume. Do NOT create new sections.

STRICT RULES:
- Do NOT invent new experience, certifications, tools, achievements, or outcomes.
- Do NOT modify job titles, dates, or employment history.
- Keep every role the same — only rewrite bullet wording.
- Follow STAR+Impact methodology: Action → Context → Outcome → Metric.
- All rewrites must be concise, modern, and quantified when possible.
- Maintain ATS-friendly formatting.
- Never invent experience, skills, tools, certifications, or dates.
- Only rewrite or enhance what the user already has.
- Use short, sharp, resume-appropriate phrasing.
- Avoid fluff, clichés, exaggeration, and resume padding.
- Always prioritize clarity, impact, and measurability.
- Follow modern resume standards (2024–2025).

Output Format:
### Summary Improvement
[3–4 line rewritten summary]

### Bullet Improvements
For each bullet:
- **Before:** [original]
- **After:** [rewritten version with clarity + action verbs + quantification]

### Weak / Filler Phrases Detected
[List generic, vague, passive, filler phrases in user's resume]

### Impact Suggestions
[List 4–6 ways the user can add measurable impact to their resume]

### Redundancy Fixes
[Detect repeated responsibilities across roles]

### Action Verb Suggestions
[List 8–12 strong action verbs tailored to their domain]

### Gap Analysis
Identify missing elements compared to top candidates in this field:
- Missing metrics
- Missing scope indicators (team size, dataset size, budget)
- Missing tools
- Missing leadership signals
- Missing achievements

Tone:
Professional, specific, measurable, expert-level wording — no fluff.

Original Resume:
${resumeText}

Provide your improvements in the format specified above.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a world-class resume analyst and hiring manager with 15+ years experience. Strengthen existing resumes with precision improvements.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to rewrite resume' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Return the full markdown content as the "rewritten" text
    // Extract any notes if present
    let notes = 'Resume improvements with targeted suggestions for clarity, impact, and action verbs.';
    
    const keyChangesSection = content.match(/##\s*(?:Key Changes|Summary|Notes)\s*([\s\S]*?)(?:$)/i);
    if (keyChangesSection) {
      notes = keyChangesSection[1].trim().substring(0, 200); // Limit to 200 chars
    }

    return new Response(
      JSON.stringify({
        rewritten: content,
        notes
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in rewrite-resume function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
