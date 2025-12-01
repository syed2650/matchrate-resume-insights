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

    const prompt = `You are a Job Description Match Engine designed to evaluate how well a resume aligns to a specific role.

Your job is to:
- extract skills and responsibilities from the JD
- compare them to the resume
- identify gaps
- suggest optimized bullets
- provide a clear, recruiter-style fit assessment

STRICT RULES:
- Do NOT rewrite the resume fully.
- Do NOT invent missing experience.
- Do NOT fabricate technologies or skills.

OUTPUT FORMAT:

## Match Score
Score + (breakdown: Skills Match %, Tools Match %, Responsibilities Match %, Seniority Match %)

## Missing Skills
Group into:
### Hard Skills
### Tools / Software
### Methodologies
### Soft Skills
### Domain Knowledge

## Optimized Bullets (Role-Aligned)
Provide 3–6 improved bullets tailored to THIS job description only.

## Suggested Additions to Summary
Provide 2–3 concise lines the user could add to strengthen role-fit.

## Keywords to Add
List the highest-impact keywords to sprinkle through the resume.

## Role Fit Assessment
5–8 lines explaining:
- where they match well
- where they fall short
- how they can tailor the resume for this job

Resume:
${resumeText}

Job Description:
${jobDescription}

Provide your analysis in the format specified above. Be specific and actionable.`;

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
            content: 'You are a Job Description Match Engine that evaluates resume-role alignment and provides recruiter-style fit assessments.' 
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

    // Parse the markdown-formatted response
    const scoreMatch = content.match(/##\s*Match Score\s*(\d+)\/100/i);
    const matchScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    // Extract all missing skills sections
    const missingSkillsSection = content.match(/##\s*Missing Skills\s*([\s\S]*?)(?=##\s*Optimized|##\s*Summary|$)/i);
    const missingSkills: string[] = [];
    
    if (missingSkillsSection) {
      const skillsText = missingSkillsSection[1];
      // Extract all bullet points from all subsections
      const bullets = skillsText.split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim())
        .filter(line => line.length > 0);
      missingSkills.push(...bullets);
    }

    const bulletsSection = content.match(/##\s*Optimized Bullets\s*([\s\S]*?)(?=##|$)/i);
    const optimizedBullets = bulletsSection
      ? bulletsSection[1].trim().split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-\s*/, '').trim())
      : [];

    return new Response(
      JSON.stringify({
        matchScore,
        missingSkills,
        optimizedBullets,
        rawContent: content
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
