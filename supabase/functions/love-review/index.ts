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

    const prompt = `You are ResumeLoveBot — half supportive best friend, half expert resume coach.

TASK:
Given a resume, provide emotional encouragement PLUS real, targeted improvements.

${tonePreference ? `TONE PREFERENCE: ${tonePreference}` : ''}

OUTPUT FORMAT:
1) 💖 Encouragement (3–5 lines)
- Highlight strengths
- Make the user feel confident and capable
- Slightly dramatic "best friend hype" tone

2) 📘 Real Resume Review  
Sections:
- Formatting Issues
- Content Issues
- Role Fit & Targeting
- Improve These Bullets (rewrite 2–3)
- Top 3 Strengths in the Resume
- Overall Score (0–100)

Rules:
- Be warm and uplifting.
- Still provide honest, specific critique.
- Do not invent new experiences.

Resume:
${resume}

Format your response as:
ENCOURAGEMENT: [your encouragement here]

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
          { role: 'system', content: 'You are ResumeLoveBot, an expert at providing both emotional support and actionable resume critiques.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;

    const encouragementMatch = content.match(/ENCOURAGEMENT:\s*(.+?)(?=REVIEW:|$)/s);
    const reviewMatch = content.match(/REVIEW:\s*(.+?)$/s);

    const encouragement = encouragementMatch ? encouragementMatch[1].trim() : content.split('\n\n')[0];
    const review = reviewMatch ? reviewMatch[1].trim() : content;

    return new Response(JSON.stringify({
      encouragement,
      review,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in love-review function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
