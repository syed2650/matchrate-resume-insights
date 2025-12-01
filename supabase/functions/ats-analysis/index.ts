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

    const prompt = `You are an ATS scanning engine used by top recruiters.

Your job is to evaluate:
- Formatting issues
- Parsing risks
- Section detection problems
- Date inconsistencies
- Keyword gaps vs the job description
- ATS match scoring

FORMAT:

## ATS Score
X/100

## Formatting Issues
- issue 1
- issue 2

## Parsing Risks
- issue 1
- issue 2

## Missing Keywords
(Hard skills, Soft skills, Tools)

## Recommended Fixes
- fix 1
- fix 2

## Summary of ATS Risks
(2–4 lines)

Resume:
${resumeText}

Provide your analysis in the format specified above. Be thorough and specific.`;

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

    // Parse the markdown-formatted response
    const scoreMatch = content.match(/##\s*ATS Score\s*(\d+)\/100/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    const issuesSection = content.match(/##\s*Formatting Issues\s*([\s\S]*?)(?=##|$)/i);
    const issues = issuesSection 
      ? issuesSection[1].trim().split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-\s*/, '').trim())
      : [];

    const parsingSection = content.match(/##\s*Parsing Risks\s*([\s\S]*?)(?=##|$)/i);
    const parsingRisks = parsingSection
      ? parsingSection[1].trim().split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-\s*/, '').trim())
      : [];

    const keywordsSection = content.match(/##\s*Missing Keywords\s*([\s\S]*?)(?=##|$)/i);
    const keywordGaps = keywordsSection
      ? keywordsSection[1].trim().split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-\s*/, '').trim())
      : [];

    const fixesSection = content.match(/##\s*Recommended Fixes\s*([\s\S]*?)(?=##|$)/i);
    const fixes = fixesSection
      ? fixesSection[1].trim().split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-\s*/, '').trim())
      : [];

    const allIssues = [...issues, ...parsingRisks];

    return new Response(
      JSON.stringify({
        score,
        issues: allIssues,
        keywordGaps,
        fixes,
        rawContent: content
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
