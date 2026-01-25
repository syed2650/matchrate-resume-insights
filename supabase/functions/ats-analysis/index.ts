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

    console.log('Resume text preview (first 300 chars):', resumeText.substring(0, 300));
    console.log('Analysing resume for ATS compatibility...');

    const prompt = `You are Agent 2: ATS Analysis for MatchRate.

INPUTS:
- resume_text: ${resumeText}
- job_description: ${jobDescription || 'Not provided'}

GOAL:
Clearly explain whether an ATS is likely to reject this resume for this job.

YOU MUST ANSWER ONLY:
1) Will ATS reject this resume?
   → "No" / "Probably Not" / "Probably" / "Yes"

2) Why? (max 3 bullets)

ALSO INCLUDE:
- ATS Verdict Badge:
  ✅ ATS-safe
  ⚠️ Needs minor fixes
  ❌ High risk
- Risk Drivers (choose up to 3):
  Formatting / Keywords / Structure / Section headings / Dates consistency
- Fix-first Action (1 clear step)
- ATS Score (contextualised, e.g., "85/100 – safe range")

RULES:
- No long explanations.
- No generic ATS advice.
- If score is included, it MUST be contextualised (e.g., "85/100 – safe range").

OUTPUT IN TWO PARTS:

PART 1: JSON (wrapped in \`\`\`json code block)
{
  "ats_score": 0,
  "ats_score_context": "XX/100 – context",
  "ats_rejection_risk": "No|Probably Not|Probably|Yes",
  "badge": "✅ ATS-safe|⚠️ Needs minor fixes|❌ High risk",
  "why": ["", "", ""],
  "risk_drivers": ["", "", ""],
  "fix_first": "string"
}

PART 2: Clean Markdown summary

Now analyse the resume for ATS compatibility.`;

    const response = await callOpenAIWithRetry({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are an ATS scanning engine used by Fortune 500 companies. Evaluate resumes for parsing accuracy through Workday, Taleo, Greenhouse, and iCIMS. Be direct and reduce anxiety with clear verdicts.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.4,
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

    console.log('Raw ATS content:', content);

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

    // Fallback score extraction if JSON parsing failed
    let score = parsedData?.ats_score || 0;
    if (!score) {
      const scorePatterns = [
        /\[(\d+)\/100\]/i,
        /(\d+)\s*\/\s*100/,
        /(\d+)%/
      ];
      for (const pattern of scorePatterns) {
        const match = content.match(pattern);
        if (match) {
          score = parseInt(match[1]);
          break;
        }
      }
    }

    // Extract markdown part
    const markdownPart = content.replace(/```json[\s\S]*?```/, '').trim();

    return new Response(
      JSON.stringify({
        score,
        scoreContext: parsedData?.ats_score_context || `${score}/100`,
        rejectionRisk: parsedData?.ats_rejection_risk || 'Unknown',
        badge: parsedData?.badge || '⚠️ Needs minor fixes',
        why: parsedData?.why || [],
        riskDrivers: parsedData?.risk_drivers || [],
        fixFirst: parsedData?.fix_first || '',
        issues: parsedData?.why || [],
        keywordGaps: [],
        fixes: [parsedData?.fix_first].filter(Boolean),
        rawContent: content,
        structured: parsedData,
        markdown: markdownPart
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ats-analysis function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
