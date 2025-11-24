import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resume, mode } = await req.json();

    const style =
      mode === "love"
        ? "Give warm, positive, hype-man style encouragement. Make it feel wholesome and uplifting."
        : "Give a funny, sarcastic roast. Be honest but not cruel. Keep it playful, in the style of harmless Reddit roasts.";

    const prompt = `
You are an AI specializing in analyzing resumes and generating either:
- a playful roast OR
- a wholesome love-note

Style: ${style}
Mode: ${mode}

Resume:
${resume}

Return two things:
1. A 2–3 sentence professional summary of this candidate.
2. A 3–6 sentence roast or love message depending on mode.

Format your response as:
SUMMARY: [your summary here]

FEEDBACK: [your feedback here]
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful resume analyst.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the response
    const summaryMatch = content.match(/SUMMARY:\s*(.+?)(?=FEEDBACK:|$)/s);
    const feedbackMatch = content.match(/FEEDBACK:\s*(.+?)$/s);

    const summary = summaryMatch ? summaryMatch[1].trim() : content.split('\n')[0];
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : content;

    return new Response(JSON.stringify({
      summary,
      feedback,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in roast-profile function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
