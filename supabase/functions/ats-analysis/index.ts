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

    console.log('Analyzing resume for ATS compatibility...');

    const prompt = `You are an ATS parsing expert trained on top ATS systems (Greenhouse, Workday, Taleo, Lever).

Analyze the user's resume and output:

1. ATS SCORE (0–100)
2. CORE ISSUES
   - Formatting problems
   - Parsing risks
   - Missing sections
   - Date inconsistencies
3. KEYWORDS MATCH
   - Hard skills missing
   - Soft skills missing
   - Tools & technologies missing
4. CRITICAL FIXES (5–7 items)
   — Explain exactly what the user must change in their resume
5. OPTIMIZED BULLETS (rewrite 3–5 bullets to fit ATS best practice)
6. FINAL VERDICT (1 paragraph)

Resume:
${resumeText}

Provide your response in the following structured format:

ATS SCORE: [0-100]

CORE ISSUES:
- Issue 1
- Issue 2
- etc.

KEYWORDS MATCH:
Hard Skills Missing:
- Skill 1
- Skill 2
Soft Skills Missing:
- Skill 1
- Skill 2
Tools & Technologies Missing:
- Tool 1
- Tool 2

CRITICAL FIXES:
- Fix 1
- Fix 2
- etc.

OPTIMIZED BULLETS:
- Original: [text] → Optimized: [text]
- Original: [text] → Optimized: [text]

FINAL VERDICT:
[One paragraph summary]

Output must be formatted cleanly and easy to copy.`;

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
            content: 'You are an ATS expert who evaluates resumes for compatibility with Applicant Tracking Systems. Provide detailed, actionable feedback.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to analyze resume' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the structured response
    const scoreMatch = content.match(/SCORE:\s*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    const issuesMatch = content.match(/FORMATTING ISSUES?:(.*?)(?=MISSING|$)/is);
    const issues = issuesMatch 
      ? issuesMatch[1].trim().split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-\s*/, '').trim())
      : [];

    const keywordsMatch = content.match(/MISSING KEYWORDS?:(.*?)(?=RECOMMENDED|$)/is);
    const keywordGaps = keywordsMatch
      ? keywordsMatch[1].trim().split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-\s*/, '').trim())
      : [];

    const fixesMatch = content.match(/RECOMMENDED FIXES?:(.*?)$/is);
    const fixes = fixesMatch
      ? fixesMatch[1].trim().split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-\s*/, '').trim())
      : [];

    return new Response(
      JSON.stringify({
        score,
        issues,
        keywordGaps,
        fixes
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
