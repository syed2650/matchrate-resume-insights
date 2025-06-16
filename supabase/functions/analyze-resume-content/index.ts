
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisResults {
  overallScore: number;
  atsScore: number;
  contentScore: number;
  sections: {
    formatting: {
      score: number;
      issues: string[];
      suggestions: string[];
    };
    content: {
      score: number;
      issues: string[];
      suggestions: string[];
    };
    atsCompatibility: {
      score: number;
      issues: string[];
      suggestions: string[];
    };
    structure: {
      score: number;
      issues: string[];
      suggestions: string[];
    };
  };
  keyFindings: string[];
}

// Calculate ATS score based on resume text
function calculateATSScore(resumeText: string): number {
  let score = 100;
  
  // Check for ATS-unfriendly elements
  if (resumeText.includes('│') || resumeText.includes('┌') || resumeText.includes('└')) {
    score -= 20; // Tables or graphics
  }
  
  if (resumeText.split('\n').some(line => line.trim().length > 100)) {
    score -= 10; // Very long lines
  }
  
  // Check for standard sections
  const hasContactInfo = /email|phone|linkedin/i.test(resumeText);
  const hasExperience = /experience|employment|work/i.test(resumeText);
  const hasEducation = /education|degree|university|college/i.test(resumeText);
  
  if (!hasContactInfo) score -= 15;
  if (!hasExperience) score -= 15;
  if (!hasEducation) score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

// Calculate content score based on content quality
function calculateContentScore(resumeText: string): number {
  let score = 50; // Base score
  
  // Check for quantified achievements
  const numbers = (resumeText.match(/\d+%|\$\d+|\d+\+|\d+ years?/g) || []).length;
  score += Math.min(30, numbers * 3);
  
  // Check for action verbs
  const actionVerbs = ['achieved', 'improved', 'increased', 'developed', 'managed', 'led', 'created', 'implemented'];
  const verbCount = actionVerbs.filter(verb => resumeText.toLowerCase().includes(verb)).length;
  score += Math.min(20, verbCount * 3);
  
  // Penalize generic terms
  const genericTerms = ['responsible for', 'team player', 'hard worker', 'self-motivated'];
  const genericCount = genericTerms.filter(term => resumeText.toLowerCase().includes(term)).length;
  score -= genericCount * 5;
  
  return Math.max(0, Math.min(100, score));
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText } = await req.json();

    if (!resumeText || typeof resumeText !== 'string') {
      throw new Error('Resume text is required');
    }

    console.log('Analyzing resume content...');

    // Call OpenAI for detailed content analysis
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
            content: `You are a professional resume reviewer. Analyze the resume and provide specific feedback in a structured JSON format. Focus on:
1. Bullet point strength and quantification
2. Generic language detection
3. Professional summary quality
4. Industry-specific keyword optimization
5. Achievement vs. responsibility balance
6. Writing clarity and conciseness

Return a JSON object with these exact fields:
{
  "contentIssues": ["issue1", "issue2"],
  "contentSuggestions": ["suggestion1", "suggestion2"],
  "formattingIssues": ["issue1", "issue2"],
  "formattingSuggestions": ["suggestion1", "suggestion2"],
  "structureIssues": ["issue1", "issue2"],
  "structureSuggestions": ["suggestion1", "suggestion2"],
  "keyFindings": ["finding1", "finding2", "finding3"]
}`
          },
          {
            role: 'user',
            content: `Please analyze this resume:\n\n${resumeText.slice(0, 3000)}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const openAIResult = await response.json();
    let aiAnalysis;
    
    try {
      aiAnalysis = JSON.parse(openAIResult.choices[0].message.content);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      // Fallback analysis
      aiAnalysis = {
        contentIssues: ['Unable to analyze content - please try again'],
        contentSuggestions: ['Ensure your resume has clear, quantified achievements'],
        formattingIssues: ['Review formatting for ATS compatibility'],
        formattingSuggestions: ['Use standard fonts and clear section headers'],
        structureIssues: ['Check overall organization'],
        structureSuggestions: ['Organize sections logically: Contact, Summary, Experience, Education'],
        keyFindings: ['Resume uploaded successfully', 'Basic analysis completed', 'Consider using more specific examples']
      };
    }

    // Calculate scores
    const atsScore = calculateATSScore(resumeText);
    const contentScore = calculateContentScore(resumeText);
    const overallScore = Math.round((atsScore + contentScore) / 2);

    // Build comprehensive results
    const results: AnalysisResults = {
      overallScore,
      atsScore,
      contentScore,
      sections: {
        formatting: {
          score: Math.max(60, atsScore - 10),
          issues: aiAnalysis.formattingIssues || ['No major formatting issues detected'],
          suggestions: aiAnalysis.formattingSuggestions || ['Maintain consistent formatting throughout']
        },
        content: {
          score: contentScore,
          issues: aiAnalysis.contentIssues || ['Some content could be more specific'],
          suggestions: aiAnalysis.contentSuggestions || ['Add more quantified achievements']
        },
        atsCompatibility: {
          score: atsScore,
          issues: atsScore < 80 ? ['Some ATS compatibility issues detected'] : ['Good ATS compatibility'],
          suggestions: ['Use standard section headers', 'Avoid complex formatting', 'Include relevant keywords']
        },
        structure: {
          score: Math.max(70, overallScore - 5),
          issues: aiAnalysis.structureIssues || ['Structure appears acceptable'],
          suggestions: aiAnalysis.structureSuggestions || ['Consider reordering sections for better flow']
        }
      },
      keyFindings: aiAnalysis.keyFindings || [
        'Resume analysis completed successfully',
        'Content could be more specific and quantified',
        'Good overall structure maintained',
        'Consider adding more industry-specific keywords'
      ]
    };

    console.log('Analysis completed successfully');

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-resume-content function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
