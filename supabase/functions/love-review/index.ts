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

${tonePreference ? `TONE PREFERENCE: ${tonePreference}. Adjust the encouragement style accordingly.` : ''}

OUTPUT FORMAT - MUST BE EXACT:
1) 💖 Encouragement (3–5 lines)
- Highlight strengths
- Make the user feel confident and capable
- Slightly dramatic "best friend hype" tone

2) 📘 Professional Review
Provide detailed feedback in these sections:

FORMATTING: [2-3 specific formatting issues]

CONTENT: [2-3 specific content issues]

TARGETING: [feedback on role fit and targeting]

BULLET_IMPROVEMENTS: [rewrite 2-3 actual bullets from their resume with [BEFORE] and [AFTER] labels]

STRENGTHS: [Top 3 strengths in the resume]

SCORE_BREAKDOWN:
Formatting: X/20
Clarity: X/20
Bullet Impact: X/20
ATS-fit: X/20
Targeting: X/20
Overall: X/100

Rules:
- Be warm and uplifting.
- Still provide honest, specific critique.
- Do not invent new experiences.
- Be specific and actionable.

Resume:
${resume}

Format your response EXACTLY as:
ENCOURAGEMENT: [your encouragement here]

FORMATTING: [formatting issues]

CONTENT: [content issues]

TARGETING: [targeting feedback]

BULLET_IMPROVEMENTS: [bullet rewrites]

STRENGTHS: [top 3 strengths]

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
          { role: 'system', content: 'You are ResumeLoveBot, an expert at providing both emotional support and actionable resume critiques.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse structured sections
    const encouragementMatch = content.match(/ENCOURAGEMENT:\s*(.+?)(?=FORMATTING:|$)/s);
    const formattingMatch = content.match(/FORMATTING:\s*(.+?)(?=CONTENT:|$)/s);
    const contentMatch = content.match(/CONTENT:\s*(.+?)(?=TARGETING:|$)/s);
    const targetingMatch = content.match(/TARGETING:\s*(.+?)(?=BULLET_IMPROVEMENTS:|$)/s);
    const bulletMatch = content.match(/BULLET_IMPROVEMENTS:\s*(.+?)(?=STRENGTHS:|$)/s);
    const strengthsMatch = content.match(/STRENGTHS:\s*(.+?)(?=SCORE_BREAKDOWN:|$)/s);
    const scoreMatch = content.match(/SCORE_BREAKDOWN:\s*(.+?)$/s);

    return new Response(JSON.stringify({
      encouragement: encouragementMatch ? encouragementMatch[1].trim() : content.split('\n\n')[0],
      formatting: formattingMatch ? formattingMatch[1].trim() : '',
      content: contentMatch ? contentMatch[1].trim() : '',
      targeting: targetingMatch ? targetingMatch[1].trim() : '',
      bulletImprovements: bulletMatch ? bulletMatch[1].trim() : '',
      strengths: strengthsMatch ? strengthsMatch[1].trim() : '',
      scoreBreakdown: scoreMatch ? scoreMatch[1].trim() : '',
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
