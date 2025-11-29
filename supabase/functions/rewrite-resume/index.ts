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

    const prompt = `You are a world-class resume analyst and improvement coach.

Your job is to strengthen the user's EXISTING resume without changing its structure or inventing new sections.

STRICT RULES:
- Do NOT rewrite the entire resume.
- Do NOT change section order.
- Do NOT add new sections like Certifications or Projects if they do not exist.
- Do NOT hallucinate experience.
- Do NOT produce a new template.

You ONLY provide:
1. Summary improvement
2. Bullet improvements (Before → After)
3. Clarity fixes
4. Impact improvements
5. Quantification suggestions
6. Action verb enhancements
7. Redundancy removal
8. Any text improvements based on the job description

FORMAT:

## Summary Improvement
(3–4 line improved summary)

## Bullet Improvements
List bullets like this:
- **Before:** ...
  **After:** ...

## Impact Suggestions
(List opportunities to add metrics or improve clarity)

## Redundancy Fixes
(List repeated phrasing or unnecessary text)

## Action Verbs to Replace
- Replace "managed" → "led"
- Replace "responsible for" → "oversaw"

Focus on QUALITY, not quantity.

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
            content: 'You are a world-class resume analyst and improvement coach. Provide targeted improvements to strengthen existing resumes without changing their structure.' 
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
