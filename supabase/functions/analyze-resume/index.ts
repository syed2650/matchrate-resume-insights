
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resume, jobDescription } = await req.json();

    if (!resume || !jobDescription) {
      throw new Error('Both resume and job description are required');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // Prepare the prompt for the AI
    const messages = [
      {
        role: 'system',
        content: `You are an expert resume reviewer and career coach who specializes in helping job seekers optimize their resumes for specific job descriptions. 
        Analyze the resume against the job description and provide structured feedback in the following JSON format:
        {
          "score": <number between 0-100 representing match percentage>,
          "missingKeywords": [<array of important keywords from job description missing in resume>],
          "sectionFeedback": {
            "summary": <feedback about summary/profile section>,
            "experience": <feedback about work experience section>,
            "skills": <feedback about skills section>
          },
          "weakBullets": [<array of objects with format {original: "weak bullet text", improved: "improved bullet text"}>],
          "toneSuggestions": <feedback on tone and clarity>,
          "wouldInterview": <clear verdict on likelihood of interview>
        }
        For the weakBullets section, each item must be an object with 'original' and 'improved' properties.
        Focus on actionable, specific feedback that would meaningfully improve the resume's chances.`
      },
      {
        role: 'user',
        content: `Job Description:\n${jobDescription}\n\nResume:\n${resume}`
      }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.2, // Lower temperature for more focused, deterministic responses
        max_tokens: 1500,
        response_format: { type: "json_object" }, // Ensure output is in JSON format
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to analyze resume');
    }

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-resume function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
