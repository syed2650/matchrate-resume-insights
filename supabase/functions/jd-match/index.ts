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

    // Retry logic for rate limits
    const makeRequest = async (retryCount = 0): Promise<Response> => {
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

      if (response.status === 429 && retryCount < 3) {
        const retryAfter = parseInt(response.headers.get('retry-after') || '5');
        console.log(`Rate limited. Retrying in ${retryAfter} seconds... (attempt ${retryCount + 1})`);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        return makeRequest(retryCount + 1);
      }

      return response;
    };

    const prompt = `You are the "Job Match Agent" for MatchRate.co.

Your job:
Compare the user's resume against a job description and generate a deep match report.

RULES:
- NEVER add invented skills.
- Only match keywords and competencies found in the JD.
- Detect missing skills, missing tools, missing experience types.
- Never invent experience, skills, tools, certifications, or dates.
- Only rewrite or enhance what the user already has.
- Use short, sharp, resume-appropriate phrasing.
- Always prioritize clarity, impact, and measurability.

Output Format:
### Match Score
[00/100]

### Missing Skills
List missing HARD skills only — from the JD.
Include:
- Why it matters
- Where to add it

Format:
• Skill  
  — *Why it matters:*  
  — *Where to add:*

### Missing Soft Skills / Competencies
Extract ONLY if present in JD.

### Optimized Bullets
Rewrite 3–6 resume bullets to better match the JD:
- Must be truthful.
- Must reflect actual resume content.
- Must NOT invent achievements.

### JD Keyword Integration Suggestions
Show the user where to naturally place relevant JD keywords.

### Role Fit Assessment
5–8 lines explaining:
- where they match well
- where they fall short
- how they can tailor the resume for this job

Tone:
Professional, targeted, recruiter-quality.

Resume:
${resumeText}

Job Description:
${jobDescription}

Provide your analysis in the format specified above. Be specific and actionable.`;

    const response = await makeRequest();

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

    // Parse the markdown-formatted response - more robust parsing
    console.log('Raw JD Match content:', content);
    
    // Try multiple patterns for score extraction - handle various formats
    let matchScore = 0;
    const scorePatterns = [
      /Score[:\s]*(\d+)\s*\/\s*100/i,
      /##\s*Match Score[:\s]*(\d+)\s*\/\s*100/i,
      /##\s*Match Score[:\s]*(\d+)/i,
      /Match Score[:\s]*(\d+)\s*\/\s*100/i,
      /Match Score[\s\S]*?(\d+)\s*%/i,
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

    // Extract bullet points from any section
    const extractBullets = (text: string): string[] => {
      return text.split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line))
        .map(line => line.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 0);
    };

    // Extract all missing skills sections
    const missingSkillsSection = content.match(/##\s*Missing Skills\s*([\s\S]*?)(?=##\s*Optimized|##\s*Suggested|##\s*Keywords|$)/i);
    const missingSkills = missingSkillsSection ? extractBullets(missingSkillsSection[1]) : [];

    const bulletsSection = content.match(/##\s*Optimized Bullets\s*([\s\S]*?)(?=##|$)/i);
    const optimizedBullets = bulletsSection ? extractBullets(bulletsSection[1]) : [];

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
