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

    const prompt = `You are the Roast Agent for MatchRate.co.

Your job:
1. Give a short, funny roast (1–2 sentences max)
2. Then give a clean, professional REAL REVIEW (4–6 bullet points)

Rules:
- NO markdown formatting. Use plain text only.
- Roast must never be offensive, rude, or personal.
- No exaggeration that makes user look incompetent.
- Tone: playful but respectful.
- Real review: clear, helpful, and actionable.
- Target clichés, corporate jargon, formatting sins, vague achievements.
- Add 1–2 punchlines they will want to screenshot.

${tonePreference ? `TONE PREFERENCE: ${tonePreference}. Adjust the roast style accordingly.` : ''}

Output format (plain text only):

QUICK_ROAST:
[2-line roast]

REAL_REVIEW:
- Bullet 1
- Bullet 2
- Bullet 3
- Bullet 4
- Bullet 5

SCORES:
Formatting: X/20
Clarity: X/20
Impact: X/20
ATS: X/20
Overall: X/100

Resume:
${resume}

Provide your response in the exact format above. Plain text only, no markdown.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a witty resume critic who provides both entertaining roasts and actionable feedback. Output plain text only, no markdown formatting.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse structured sections
    const roastMatch = content.match(/QUICK_ROAST:\s*(.+?)(?=REAL_REVIEW:|$)/s);
    const reviewMatch = content.match(/REAL_REVIEW:\s*(.+?)(?=SCORES:|$)/s);
    const scoresMatch = content.match(/SCORES:\s*(.+?)$/s);

    // Parse individual scores
    let formatting = 0, clarity = 0, impact = 0, ats = 0, overall = 0;
    if (scoresMatch) {
      const scoresText = scoresMatch[1];
      const formattingMatch = scoresText.match(/Formatting:\s*(\d+)/i);
      const clarityMatch = scoresText.match(/Clarity:\s*(\d+)/i);
      const impactMatch = scoresText.match(/Impact:\s*(\d+)/i);
      const atsMatch = scoresText.match(/ATS:\s*(\d+)/i);
      const overallMatch = scoresText.match(/Overall:\s*(\d+)/i);
      
      if (formattingMatch) formatting = parseInt(formattingMatch[1]);
      if (clarityMatch) clarity = parseInt(clarityMatch[1]);
      if (impactMatch) impact = parseInt(impactMatch[1]);
      if (atsMatch) ats = parseInt(atsMatch[1]);
      if (overallMatch) overall = parseInt(overallMatch[1]);
    }

    return new Response(JSON.stringify({
      roast: roastMatch ? roastMatch[1].trim() : content.split('\n\n')[0],
      realReview: reviewMatch ? reviewMatch[1].trim() : '',
      scores: {
        formatting,
        clarity,
        impact,
        ats,
        overall
      },
      scoreBreakdown: scoresMatch ? scoresMatch[1].trim() : '',
      // Legacy fields for backward compatibility
      formatting: '',
      content: reviewMatch ? reviewMatch[1].trim() : '',
      targeting: '',
      bulletImprovements: '',
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
