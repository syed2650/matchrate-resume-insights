import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callOpenAIWithRetry(body: object, maxRetries = 3): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : (attempt + 1) * 3000;
        console.log(`Rate limited, waiting ${waitTime}ms before retry ${attempt + 1}/${maxRetries}`);
        await sleep(waitTime);
        continue;
      }

      return response;
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt + 1} failed:`, error);
      await sleep((attempt + 1) * 2000);
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText) {
      return new Response(
        JSON.stringify({ error: 'Resume text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Resume text preview:', resumeText.substring(0, 200));
    console.log('Analyzing resume for improvements...');

    const prompt = `You are Agent 1: Resume Improvements for MatchRate.

INPUTS:
- resume_text: ${resumeText}
- job_description: ${jobDescription || 'Not provided - give general improvements'}

GOAL:
Improve the resume's clarity, impact, and relevance for the given job.
The user must clearly know what to fix first.

STRICT OUTPUT STRUCTURE:
A) Top 5 Critical Fixes (must-fix)
B) Nice-to-have Improvements
C) Optional Enhancements

RULES:
- Critical Fixes MUST be exactly 5.
- Each bullet must include:
  • Issue (what's wrong)
  • Why it matters (1 short sentence)
  • Fix example (rewrite or sample line)
- No long paragraphs.
- No generic advice.
- Do NOT repeat the same issue across sections.

FINAL SECTION:
"Quick Wins Rewrite Pack"
- Rewrite exactly 3 weak bullets from the resume.
- Use format: BEFORE → AFTER
- Tailor rewrites to the job description.

STYLE:
- Professional, concise, product-like.
- UK English.
- Never say "you should consider".

OUTPUT IN TWO PARTS:

PART 1: JSON (wrapped in \`\`\`json code block)
{
  "verdict": "1-sentence summary of resume strength for this job",
  "critical_fixes": [{"issue":"", "why":"", "fix_example":""}],
  "nice_to_have": [{"issue":"", "why":"", "fix_example":""}],
  "optional_enhancements": [{"issue":"", "why":"", "fix_example":""}],
  "quick_wins_rewrite_pack": [{"before":"", "after":""}]
}

PART 2: Clean Markdown summary

Now analyse the resume against the job description.`;

    const response = await callOpenAIWithRetry({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a world-class resume analyst and hiring manager with 15+ years experience. Provide structured, actionable feedback. Output both JSON and markdown as specified.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.6,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to analyse resume. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse JSON from the response
    let parsedData = null;
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        parsedData = JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
      }
    }

    // Extract markdown part (everything after the JSON block)
    const markdownPart = content.replace(/```json[\s\S]*?```/, '').trim();

    return new Response(
      JSON.stringify({
        rewritten: content,
        notes: parsedData?.verdict || 'Resume improvements with targeted suggestions.',
        structured: parsedData,
        markdown: markdownPart
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
