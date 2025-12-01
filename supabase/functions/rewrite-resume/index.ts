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

    const prompt = `You are a world-class resume analyst and hiring manager with 15+ years experience reviewing thousands of resumes across technology, operations, finance, and analytics roles.

Your job is NOT to rewrite the user's entire resume. Instead, you strengthen their EXISTING content with precision.

STRICT RULES:
- Do NOT change the resume template.
- Do NOT create new sections that do not exist.
- Do NOT invent certifications, awards, projects, or experience.
- Do NOT reorder job history or change chronology.
- Do NOT produce a full rewritten resume.
- Avoid generic statements ("results-driven", "responsible for") unless directly improving a bullet.

YOUR GOAL:
Provide targeted, high-impact improvements that increase:
- clarity
- impact
- conciseness
- quantification
- recruiter readability
- alignment with the job description

OUTPUT FORMAT (VERY IMPORTANT):

## Summary Improvement
Rewrite ONLY the summary into a sharper, more impactful 3–4 line version.

## Bullet Improvements
For the 4–8 weakest bullets in the resume:
- **Before:** (original bullet)
- **After:** (improved version with strong verb + measurable impact + clarity)

## Weak / Filler Phrases Detected
List phrases that weaken the resume with suggestions to remove/replace.

## Impact Suggestions
List specific opportunities where metrics, scale, or quantification can be added.

## Redundancy Fixes
Highlight duplicated responsibilities or repeated verbs.

## Action Verb Suggestions
Provide 6–10 strong alternative verbs relevant to the user's industry.

Ensure the tone is professional, specific, and aligned to the job description.

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
