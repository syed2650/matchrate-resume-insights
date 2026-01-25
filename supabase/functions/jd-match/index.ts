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

    if (!resumeText || !jobDescription) {
      return new Response(
        JSON.stringify({ error: 'Resume text and job description are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Matching resume to job description...');

    const prompt = `You are Agent 3: JD Match for MatchRate (core agent).

INPUTS:
- resume_text: ${resumeText}
- job_description: ${jobDescription}

GOAL:
Evaluate how well the resume matches the job and explain gaps clearly.

STRICT OUTPUT STRUCTURE:

1) Match Verdict
   - Strong Match / Medium Match / Weak Match

2) What's Missing (3–5 items max)
   For each item include:
   - Type: Hard Skill Gap | Soft Skill Gap | Wording Gap | Domain Gap
   - What's missing
   - Why it matters for THIS role

3) How to Fix It (Resume-level)
   - 3–6 actionable fixes
   - Each fix MUST:
     • Reference a resume section (Summary / Experience / Skills)
     • Be something the user can actually add or rewrite

4) Suggested Keywords to Add
   - 5–12 keywords max
   - Only if present in job_description AND not clearly in resume

RULES:
- No essays.
- No generic advice.
- Do not invent experience.

OUTPUT IN TWO PARTS:

PART 1: JSON (wrapped in \`\`\`json code block)
{
  "match_score": 0,
  "match_verdict": "Strong Match|Medium Match|Weak Match",
  "missing": [{"type":"", "item":"", "why_it_matters":""}],
  "resume_level_fixes": [{"instruction":"", "where_to_add":"", "example_line":""}],
  "keywords_to_add": [""]
}

PART 2: Clean Markdown summary

Now compare the resume with the job description.`;

    const response = await callOpenAIWithRetry({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a Job Description Match Engine that evaluates resume-role alignment and provides recruiter-style fit assessments. Be specific and actionable.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to match resume to job description' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log('Raw JD Match content:', content);

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

    // Fallback score extraction
    let matchScore = parsedData?.match_score || 0;
    if (!matchScore) {
      const scorePatterns = [
        /Score[:\s]*(\d+)\s*\/\s*100/i,
        /(\d+)\s*\/\s*100/,
        /(\d+)%/
      ];
      for (const pattern of scorePatterns) {
        const match = content.match(pattern);
        if (match) {
          matchScore = parseInt(match[1]);
          break;
        }
      }
    }

    // Extract markdown part
    const markdownPart = content.replace(/```json[\s\S]*?```/, '').trim();

    // Extract missing skills for backward compatibility
    const missingSkills = parsedData?.missing?.map((m: any) => `${m.type}: ${m.item}`) || [];
    const keywordsToAdd = parsedData?.keywords_to_add || [];

    return new Response(
      JSON.stringify({
        matchScore,
        matchVerdict: parsedData?.match_verdict || 'Unknown',
        missing: parsedData?.missing || [],
        resumeLevelFixes: parsedData?.resume_level_fixes || [],
        keywordsToAdd,
        missingSkills,
        optimizedBullets: parsedData?.resume_level_fixes?.map((f: any) => f.example_line).filter(Boolean) || [],
        rawContent: content,
        structured: parsedData,
        markdown: markdownPart
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in jd-match function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
