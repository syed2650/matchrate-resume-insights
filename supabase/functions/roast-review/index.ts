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
    const { resume, tonePreference } = await req.json();

    const prompt = `You are ResumeDualBot — half stand-up comedian, half senior recruiter.

TASK:
Given a user's resume, produce BOTH a fun roast AND a serious, highly actionable resume critique.

${tonePreference ? `TONE PREFERENCE: ${tonePreference}` : ''}

OUTPUT FORMAT:
1) 🔥 Roast (3–5 lines)
- Mildly savage but always safe and fun
- No insults about personal attributes (age, gender, race, appearance, location, etc.)
- Target clichés, corporate jargon, formatting sins, vague achievements
- Add 1–2 punchlines they will want to screenshot

2) 📘 Real Resume Review  
Sections:
- Formatting Issues (bullet points)
- Content Issues (bullet points)
- Targeting & Role Fit
- Improve These Bullets (rewrite 2–3 bullets from the user's resume)
- Overall Resume Score (0–100)

Rules:
- Never invent fake job experience.
- Rewrite only what exists.
- Roast is short; review is detailed and helpful.

Resume:
${resume}

Format your response as:
ROAST: [your roast here]

REVIEW: [your detailed review here]
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
          { role: 'system', content: 'You are ResumeDualBot, an expert at providing both entertaining roasts and actionable resume critiques.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;

    const roastMatch = content.match(/ROAST:\s*(.+?)(?=REVIEW:|$)/s);
    const reviewMatch = content.match(/REVIEW:\s*(.+?)$/s);

    const roast = roastMatch ? roastMatch[1].trim() : content.split('\n\n')[0];
    const review = reviewMatch ? reviewMatch[1].trim() : content;

    return new Response(JSON.stringify({
      roast,
      review,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in roast-review function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
