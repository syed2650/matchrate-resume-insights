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

${tonePreference ? `TONE PREFERENCE: ${tonePreference}. Adjust the roast style accordingly.` : ''}

OUTPUT FORMAT - MUST BE EXACT:
1) 🔥 Roast (3–5 lines)
- Mildly savage but always safe and fun
- No insults about personal attributes (age, gender, race, appearance, location, etc.)
- Target clichés, corporate jargon, formatting sins, vague achievements
- Add 1–2 punchlines they will want to screenshot

2) 📘 Professional Review
Provide detailed feedback in these sections:

FORMATTING: [2-3 specific formatting issues]

CONTENT: [2-3 specific content issues]

TARGETING: [feedback on role fit and targeting]

BULLET_IMPROVEMENTS: [rewrite 2-3 actual bullets from their resume with [BEFORE] and [AFTER] labels]

SCORE_BREAKDOWN:
Formatting: X/20
Clarity: X/20
Bullet Impact: X/20
ATS-fit: X/20
Targeting: X/20
Overall: X/100

Rules:
- Never invent fake job experience.
- Rewrite only what exists.
- Be specific and actionable.
- Roast is short; review is detailed and helpful.

Resume:
${resume}

Format your response EXACTLY as:
ROAST: [your roast here]

FORMATTING: [formatting issues]

CONTENT: [content issues]

TARGETING: [targeting feedback]

BULLET_IMPROVEMENTS: [bullet rewrites]

SCORE_BREAKDOWN: [score breakdown]
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

    // Parse structured sections
    const roastMatch = content.match(/ROAST:\s*(.+?)(?=FORMATTING:|$)/s);
    const formattingMatch = content.match(/FORMATTING:\s*(.+?)(?=CONTENT:|$)/s);
    const contentMatch = content.match(/CONTENT:\s*(.+?)(?=TARGETING:|$)/s);
    const targetingMatch = content.match(/TARGETING:\s*(.+?)(?=BULLET_IMPROVEMENTS:|$)/s);
    const bulletMatch = content.match(/BULLET_IMPROVEMENTS:\s*(.+?)(?=SCORE_BREAKDOWN:|$)/s);
    const scoreMatch = content.match(/SCORE_BREAKDOWN:\s*(.+?)$/s);

    return new Response(JSON.stringify({
      roast: roastMatch ? roastMatch[1].trim() : content.split('\n\n')[0],
      formatting: formattingMatch ? formattingMatch[1].trim() : '',
      content: contentMatch ? contentMatch[1].trim() : '',
      targeting: targetingMatch ? targetingMatch[1].trim() : '',
      bulletImprovements: bulletMatch ? bulletMatch[1].trim() : '',
      scoreBreakdown: scoreMatch ? scoreMatch[1].trim() : '',
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
