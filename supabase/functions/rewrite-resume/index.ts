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

    const prompt = `You are a world-class resume builder trained on the structure of TealHQ, Resume.io, Novorésumé, and FlowCV.

Rewrite the user's resume in a clean, modern, ATS-optimized format. DO NOT use STAR format inside bullets.

Follow this structure exactly:

1. NAME + CONTACT INFO LINE (one line)
2. PROFESSIONAL SUMMARY (3–4 lines, achievement-focused, tailored to the user's target role)
3. CORE SKILLS (15–20 ATS-friendly skills, grouped logically)
4. PROFESSIONAL EXPERIENCE
   For each role, use:
   - Job Title | Company | Dates
   - 4–6 bullets following this formula:
       • Action verb + specific task + measurable result + business impact
       • No fluff, no generic phrases, no STAR storytelling
5. EDUCATION
6. CERTIFICATIONS (if user has them)
7. AWARDS
8. PROJECTS (optional)

General rules:
- Use consistent formatting.
- Use strong action verbs.
- Increase quantifiable impact wherever possible.
- Keep the resume concise and scannable.
- Always optimize for ATS scanning.
- Never invent experience; only refine what exists.
- Always return in clean Markdown so users can copy easily.

Original Resume:
${resumeText}

Return ONLY the rewritten resume. Do not include commentary unless asked.`;

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
            content: 'You are a world-class resume builder. Return clean, professional, ATS-optimized resumes in Markdown format.' 
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

    // Parse the response to extract rewritten resume and notes
    // Simple parsing - split on "Notes:" or similar markers
    let rewritten = content;
    let notes = '';

    const notesMatch = content.match(/(?:Notes?|Changes?|Improvements?|Key Changes):\s*(.+)$/is);
    if (notesMatch) {
      notes = notesMatch[1].trim();
      rewritten = content.substring(0, notesMatch.index).trim();
    }

    return new Response(
      JSON.stringify({
        rewritten,
        notes: notes || 'Resume rewritten with improved clarity, action verbs, and quantified achievements.'
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
