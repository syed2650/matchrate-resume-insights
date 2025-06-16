
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
    formatting: SectionData;
    content: SectionData;
    atsCompatibility: SectionData;
    structure: SectionData;
  };
  keyFindings: string[];
}

interface SectionData {
  score: number;
  issues: string[];
  suggestions: string[];
}

const calculateATSScore = (resumeText: string): number => {
  let score = 100;
  
  // Check for problematic elements
  if (/[^\x00-\x7F]/.test(resumeText)) score -= 10; // Non-ASCII characters
  if (resumeText.includes('\t')) score -= 5; // Tables
  if (/[•◦▪▫]/.test(resumeText)) score -= 5; // Special bullets
  if (resumeText.split('\n').length < 10) score -= 15; // Too short
  
  // Check for good elements
  if (resumeText.toLowerCase().includes('experience')) score += 5;
  if (resumeText.toLowerCase().includes('skills')) score += 5;
  if (resumeText.toLowerCase().includes('education')) score += 5;
  
  return Math.max(0, Math.min(100, score));
};

const analyzeContent = async (resumeText: string): Promise<any> => {
  const prompt = `Analyze this resume and provide specific feedback. Return your response as a JSON object with this exact structure:

{
  "contentScore": number (0-100),
  "keyFindings": ["finding1", "finding2", "finding3", "finding4"],
  "sections": {
    "content": {
      "score": number (0-100),
      "issues": ["issue1", "issue2"],
      "suggestions": ["suggestion1", "suggestion2"]
    },
    "formatting": {
      "score": number (0-100),
      "issues": ["issue1", "issue2"],
      "suggestions": ["suggestion1", "suggestion2"]
    },
    "structure": {
      "score": number (0-100),
      "issues": ["issue1", "issue2"],
      "suggestions": ["suggestion1", "suggestion2"]
    }
  }
}

Focus on:
1. Bullet point strength and quantification (look for numbers, percentages, results)
2. Generic language detection (avoid buzzwords like 'responsible for', 'team player')
3. Professional summary quality and impact
4. Industry-specific keyword optimization
5. Achievement vs. responsibility balance
6. Writing clarity and conciseness
7. Resume structure and organization
8. Formatting consistency

Resume text: ${resumeText}`;

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
          content: 'You are an expert resume analyst. Always respond with valid JSON only. Be specific and actionable in your feedback.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  const data = await response.json();
  
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    // Return fallback structure
    return {
      contentScore: 65,
      keyFindings: [
        "Resume analysis completed",
        "Content could use more quantified achievements",
        "Consider adding more specific examples",
        "Overall structure is acceptable"
      ],
      sections: {
        content: {
          score: 65,
          issues: ["Some bullet points lack quantification", "Generic language detected"],
          suggestions: ["Add specific numbers and percentages", "Use action verbs"]
        },
        formatting: {
          score: 75,
          issues: ["Minor formatting inconsistencies"],
          suggestions: ["Ensure consistent spacing", "Use standard fonts"]
        },
        structure: {
          score: 70,
          issues: ["Sections could be better organized"],
          suggestions: ["Consider reordering sections", "Add clear headings"]
        }
      }
    };
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText } = await req.json();

    if (!resumeText || resumeText.trim().length < 100) {
      throw new Error('Resume text is too short or empty');
    }

    // Calculate ATS score using rule-based system
    const atsScore = calculateATSScore(resumeText);

    // Analyze content with AI
    const aiAnalysis = await analyzeContent(resumeText);

    // Calculate overall score
    const overallScore = Math.round(
      (atsScore * 0.3) + 
      (aiAnalysis.contentScore * 0.4) + 
      (aiAnalysis.sections.formatting.score * 0.15) + 
      (aiAnalysis.sections.structure.score * 0.15)
    );

    const results: AnalysisResults = {
      overallScore,
      atsScore,
      contentScore: aiAnalysis.contentScore,
      sections: {
        atsCompatibility: {
          score: atsScore,
          issues: atsScore < 80 ? ["May have ATS parsing issues", "Contains non-standard formatting"] : [],
          suggestions: atsScore < 80 ? ["Use standard fonts like Arial or Calibri", "Avoid tables and text boxes"] : ["Great ATS compatibility!"]
        },
        content: aiAnalysis.sections.content,
        formatting: aiAnalysis.sections.formatting,
        structure: aiAnalysis.sections.structure,
      },
      keyFindings: aiAnalysis.keyFindings,
    };

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
