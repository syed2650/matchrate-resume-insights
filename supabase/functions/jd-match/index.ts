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
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return new Response(
        JSON.stringify({ error: 'Resume text and job description are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Matching resume to job description...');

    const prompt = `You are a Job Description Match Expert. Compare the resume and job description.

Output:

1. MATCH SCORE (0–100)
2. MISSING SKILLS (group by categories)
   - Hard skills
   - Tools / software
   - Methodologies
   - Domain knowledge
3. RECOMMENDED ADDITIONS
   - Keywords to add to the resume
4. OPTIMIZED BULLETS
   - Rewrite 5 bullets to include missing job description keywords, without lying
5. FINAL SUMMARY
   - What changes will increase match score

Focus entirely on job relevance and ATS keywords.

Resume:
${resumeText}

Job Description:
${jobDescription}

Provide your response in the following structured format:

MATCH SCORE: [0-100]

MISSING SKILLS:
Hard Skills:
- Skill 1
- Skill 2
Tools/Software:
- Tool 1
- Tool 2
Methodologies:
- Method 1
- Method 2
Domain Knowledge:
- Knowledge 1
- Knowledge 2

RECOMMENDED ADDITIONS:
- Keyword 1
- Keyword 2
- etc.

OPTIMIZED BULLETS:
- Original: [text] → Optimized: [text]
- Original: [text] → Optimized: [text]
- Original: [text] → Optimized: [text]
- Original: [text] → Optimized: [text]
- Original: [text] → Optimized: [text]

FINAL SUMMARY:
[Paragraph explaining what changes will increase match score]`;

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
            content: 'You are a career coach who helps optimize resumes to match specific job descriptions. Provide detailed, actionable feedback.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.6,
      }),
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

    // Parse the structured response
    const scoreMatch = content.match(/MATCH SCORE:\s*(\d+)/i);
    const matchScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    const skillsMatch = content.match(/MISSING SKILLS?:(.*?)(?=OPTIMIZED|$)/is);
    const missingSkills = skillsMatch
      ? skillsMatch[1].trim().split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-\s*/, '').trim())
      : [];

    const bulletsMatch = content.match(/OPTIMIZED BULLETS?:(.*?)$/is);
    const optimizedBullets = bulletsMatch
      ? bulletsMatch[1].trim().split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-\s*/, '').trim())
      : [];

    return new Response(
      JSON.stringify({
        matchScore,
        missingSkills,
        optimizedBullets
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
