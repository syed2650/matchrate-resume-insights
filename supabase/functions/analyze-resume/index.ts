
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function fetchJobDescription(url: string): Promise<string> {
  console.log(`Attempting to fetch job description from URL: ${url}`);
  try {
    // This is a simplified approach - in production, you'd want to use a more robust solution
    // like a specialized API or a more sophisticated web scraping approach
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch job description: ${response.statusText}`);
    }
    const html = await response.text();
    
    // Extract text content from HTML (very simplified approach)
    // Strip HTML tags and get plain text
    const textContent = html.replace(/<[^>]*>/g, ' ')
                            .replace(/\s+/g, ' ')
                            .trim();
    
    // Get a reasonable chunk of text that might contain the job description
    // This is a very simplified approach and might need refinement
    const potentialJobDescription = textContent.substring(0, 3000);
    
    console.log(`Successfully extracted potential job description (${potentialJobDescription.length} chars)`);
    return potentialJobDescription;
  } catch (error) {
    console.error(`Error fetching job description: ${error.message}`);
    return `Failed to extract job description from URL: ${url}. Error: ${error.message}`;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resume, jobDescription, jobUrl, selectedRole } = await req.json();

    // Validate basic inputs
    if ((!resume && !jobDescription) && !jobUrl) {
      throw new Error('Either resume text or job URL is required');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // Process job URL if provided but no job description
    let effectiveJobDescription = jobDescription || '';
    if (jobUrl) {
      console.log(`Job URL provided: ${jobUrl}`);
      
      if (!jobDescription || jobDescription.trim() === '') {
        try {
          // Try to fetch and extract job description from URL
          const extractedDescription = await fetchJobDescription(jobUrl);
          effectiveJobDescription = extractedDescription;
          console.log("Successfully extracted job description from URL");
        } catch (error) {
          console.error(`Error extracting job description from URL: ${error.message}`);
          effectiveJobDescription = `Error extracting job description from URL: ${jobUrl}. Please paste the job description manually.`;
        }
      }
    }

    // Role-specific prompt variations
    const rolePrompts: Record<string, string> = {
      "Product Manager": "You are reviewing a resume for a Product Manager at a tech company. Focus on product strategy, metrics, cross-functional leadership, and measurable outcomes.",
      "UX Designer": "You are reviewing a resume for a UX Designer. Emphasize design thinking, user research, prototyping, and impact on user experience.",
      "Data Analyst": "You are reviewing a resume for a Data Analyst. Highlight statistical analysis, data visualization, SQL skills, and business insights.",
      "Software Engineer": "You are reviewing a resume for a Software Engineer. Focus on technical skills, programming languages, system design, and project impact.",
      "Consultant": "You are reviewing a resume for a Business Consultant. Emphasize problem-solving, strategic thinking, client management, and quantifiable results."
    };

    // Prepare the prompt for the AI
    const messages = [
      {
        role: 'system',
        content: `${rolePrompts[selectedRole] || rolePrompts["Product Manager"]} 
          Provide brutally honest, structured feedback focusing on: relevance score, missing keywords, section-by-section critique, STAR-format bullet improvements, tone suggestions, and a clear interview recommendation. 
          
          Format your response as JSON with the following fields: 
          - score (number between 0-100)
          - missingKeywords (array of strings)
          - sectionFeedback (object with section names as keys and feedback as string values)
          - weakBullets (array of objects with "original" and "improved" properties)
          - toneSuggestions (string)
          - wouldInterview (string)
          
          Ensure all fields are properly formatted for JSON parsing.`
      },
      {
        role: 'user',
        content: `Job Description:\n${effectiveJobDescription || 'No specific job description provided'}\n\nResume:\n${resume}`
      }
    ];

    console.log("Sending analysis request to OpenAI...");

    // Call OpenAI API with role-specific prompt
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.2,
        max_tokens: 1500,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to analyze resume');
    }

    const data = await response.json();
    let analysis;
    
    try {
      // First try to parse the content as JSON
      analysis = JSON.parse(data.choices[0].message.content);
      console.log("Successfully parsed AI response as JSON");
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", e);
      
      // If JSON parsing fails, try to use the content directly if it's already an object
      try {
        const content = data.choices[0].message.content;
        if (typeof content === 'object') {
          analysis = content;
          console.log("Using AI response directly as object");
        } else {
          // Last resort: Create a simple object with the raw content
          analysis = {
            error: "Failed to parse AI response as JSON",
            rawContent: content,
            score: 0,
            missingKeywords: ["Unable to parse response"],
            sectionFeedback: { error: "Unable to parse AI response properly" },
            weakBullets: [],
            toneSuggestions: "Error processing response",
            wouldInterview: "Unable to determine due to processing error"
          };
        }
      } catch (innerError) {
        console.error("Failed to process AI response:", innerError);
        analysis = {
          error: "Failed to process AI response",
          score: 0,
          missingKeywords: ["Processing error"],
          sectionFeedback: { error: "Processing error" },
          weakBullets: [],
          toneSuggestions: "Error processing response",
          wouldInterview: "Unable to determine due to processing error"
        };
      }
    }
    
    // Validate and fix the analysis structure
    if (typeof analysis.score !== 'number') {
      try {
        analysis.score = parseInt(analysis.score) || 0;
      } catch (e) {
        analysis.score = 0;
      }
    }
    
    if (!Array.isArray(analysis.missingKeywords)) {
      analysis.missingKeywords = [];
    }
    
    if (typeof analysis.sectionFeedback !== 'object' || analysis.sectionFeedback === null) {
      analysis.sectionFeedback = {};
    }
    
    if (!Array.isArray(analysis.weakBullets)) {
      analysis.weakBullets = [];
    }
    
    if (typeof analysis.toneSuggestions !== 'string') {
      analysis.toneSuggestions = "No tone suggestions available";
    }
    
    if (typeof analysis.wouldInterview !== 'string') {
      analysis.wouldInterview = "No interview recommendation available";
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-resume function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      score: 0,
      missingKeywords: ["Error occurred"],
      sectionFeedback: { error: error.message },
      weakBullets: [],
      toneSuggestions: "Error occurred during analysis",
      wouldInterview: "Unable to provide recommendation due to error"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
