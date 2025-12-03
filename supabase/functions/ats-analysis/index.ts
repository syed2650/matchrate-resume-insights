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

    const prompt = `You are the "ATS Analysis Agent" for MatchRate.co.

Your job:
Perform a deep ATS audit of the user's resume.

RULES:
- Do NOT rewrite their resume.
- Do NOT invent keywords they do not have.
- Extract EXACT data from resume.
- Compare resume to real ATS parsing logic: Workday, Greenhouse, Lever, Taleo.
- Never invent experience, skills, tools, certifications, or dates.
- Use short, sharp, resume-appropriate phrasing.
- Always prioritize clarity, impact, and measurability.

Output Format:
### ATS Score
[00/100]

### Parsing Confidence Score
High / Medium / Low  
(Explain why)

### Formatting Issues
List problems affecting ATS scanning:
- inconsistent dates
- en-dashes vs hyphens
- multi-line bullets
- missing section headers
- irregular spacing
- special characters
- unclear role separations

### Missing Keywords
(List ONLY skills relevant to the user's domain AND visible in the job description if provided)

### Recommended Fixes
Provide 5–10 high-impact fixes:
- formatting
- keyword placement
- section clarity
- ATS-safe structuring

### ATS Safe Summary (Rewrite Only Summary)
Rewrite ONLY the resume summary to be ATS-optimized.

### Section Detection Map
Show how ATS interprets:
- Name
- Contact
- Summary
- Skills
- Experience
- Education
- Awards

Tone:
Clear, technical, ATS-focused. Zero fluff.

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
            content: 'You are an ATS scanning engine used by Fortune 500 companies. Evaluate resumes for parsing accuracy through Workday, Taleo, Greenhouse, and iCIMS.' 
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

    // Parse the markdown-formatted response - more robust parsing
    console.log('Raw ATS content:', content);
    
    // Try multiple patterns for score extraction - handle "Total score: 77" format
    let score = 0;
    const scorePatterns = [
      /Total\s*score[:\s]*(\d+)/i,
      /##\s*ATS Score[:\s]*(\d+)\s*\/\s*100/i,
      /##\s*ATS Score[:\s]*(\d+)/i,
      /ATS Score[:\s]*(\d+)\s*\/\s*100/i,
      /ATS Score[\s\S]*?(\d+)\s*\/\s*100/i,
      /(\d+)\s*\/\s*100/
    ];
    for (const pattern of scorePatterns) {
      const match = content.match(pattern);
      if (match) {
        score = parseInt(match[1]);
        break;
      }
    }

    // Extract bullet points from any section - look for lines starting with - or * or numbered
    const extractBullets = (text: string): string[] => {
      return text.split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line))
        .map(line => line.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 0);
    };

    const issuesSection = content.match(/##\s*Formatting Issues\s*([\s\S]*?)(?=##|$)/i);
    const issues = issuesSection ? extractBullets(issuesSection[1]) : [];

    const parsingSection = content.match(/##\s*Parsing Risks\s*([\s\S]*?)(?=##|$)/i);
    const parsingRisks = parsingSection ? extractBullets(parsingSection[1]) : [];

    const keywordsSection = content.match(/##\s*Missing Keywords\s*([\s\S]*?)(?=##|$)/i);
    const keywordGaps = keywordsSection ? extractBullets(keywordsSection[1]) : [];

    const fixesSection = content.match(/##\s*Recommended Fixes\s*([\s\S]*?)(?=##|$)/i);
    const fixes = fixesSection ? extractBullets(fixesSection[1]) : [];

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
