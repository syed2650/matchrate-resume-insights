
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Utility: Fetch and clean job description from a URL using simple HTML-to-text cleaning.
 */
async function fetchJobDescription(url: string): Promise<string> {
  console.log(`Attempting to fetch job description from URL: ${url}`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch job description: ${response.statusText}`);
    }
    const html = await response.text();
    const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const potentialJobDescription = textContent.substring(0, 3000);
    console.log(`Successfully extracted potential job description (${potentialJobDescription.length} chars)`);
    return potentialJobDescription;
  } catch (error) {
    console.error(`Error fetching job description: ${error.message}`);
    return `Failed to extract job description from URL: ${url}. Error: ${error.message}`;
  }
}

/**
 * Utility: Creates prompt for the resume review/analysis, optionally customized by role.
 */
function buildAnalysisPrompt(selectedRole: string, effectiveJobDescription: string, resume: string) {
  const rolePrompts: Record<string, string> = {
    "Product Manager": "You are reviewing a resume for a Product Manager at a tech company. Focus on product strategy, metrics, cross-functional leadership, and measurable outcomes.",
    "UX Designer": "You are reviewing a resume for a UX Designer. Emphasize design thinking, user research, prototyping, and impact on user experience.",
    "Data Analyst": "You are reviewing a resume for a Data Analyst. Highlight statistical analysis, data visualization, SQL skills, and business insights.",
    "Software Engineer": "You are reviewing a resume for a Software Engineer. Focus on technical skills, programming languages, system design, and project impact.",
    "Consultant": "You are reviewing a resume for a Business Consultant. Emphasize problem-solving, strategic thinking, client management, and quantifiable results."
  };

  return [
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
}

/**
 * Utility: Calls OpenAI for resume analysis (structured feedback as JSON).
 */
async function callOpenAIForAnalysis(messages: any[]) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
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
  return response.json();
}

/**
 * Utility: Safely parses and post-processes GPT JSON response.
 */
function parseAndValidateAnalysis(data: any): any {
  let analysis;
  try {
    // Try to parse as JSON
    analysis = JSON.parse(data.choices[0].message.content);
    console.log("Successfully parsed AI response as JSON");
  } catch (e) {
    console.error("Failed to parse AI response as JSON:", e);
    // Try directly using if object or fallback to blank/error object
    const content = data.choices[0].message.content;
    if (typeof content === 'object') {
      analysis = content;
      console.log("Using AI response directly as object");
    } else {
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
  }
  // Validate and post-process
  if (typeof analysis.score !== 'number') {
    try { analysis.score = parseInt(analysis.score) || 0; } catch { analysis.score = 0; }
  }
  if (!Array.isArray(analysis.missingKeywords)) analysis.missingKeywords = [];
  if (typeof analysis.sectionFeedback !== 'object' || analysis.sectionFeedback === null) analysis.sectionFeedback = {};
  if (!Array.isArray(analysis.weakBullets)) analysis.weakBullets = [];
  if (typeof analysis.toneSuggestions !== 'string') analysis.toneSuggestions = "No tone suggestions available";
  if (typeof analysis.wouldInterview !== 'string') analysis.wouldInterview = "No interview recommendation available";
  return analysis;
}

/**
 * Utility: Generate a rewritten resume for a given company type.
 */
async function generateFullResumeRewrite(resume: string, jobDescription: string, companyType: string, selectedRole: string): Promise<string> {
  console.log("Generating full resume rewrite...");

  let companySpecificPrompt = "";
  switch (companyType) {
    case "startup":
      companySpecificPrompt = "This is for a startup, emphasize versatility, entrepreneurial spirit, and rapid execution.";
      break;
    case "enterprise":
      companySpecificPrompt = "This is for an enterprise company, emphasize process knowledge, scalability, and collaboration with large teams.";
      break;
    case "consulting":
      companySpecificPrompt = "This is for a consulting firm, emphasize client management, adaptability, and industry knowledge.";
      break;
    default:
      companySpecificPrompt = "Format for a general company type.";
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert resume rewriter. ${companySpecificPrompt} Create a completely rewritten version of the resume that is tailored specifically to the job description. Maintain the same sections and basic information but optimize all content to highlight relevant experience and skills. Format the resume professionally with clear section headings and bullet points.`
        },
        {
          role: 'user',
          content: `Job Description:\n${jobDescription}\n\nResume to Rewrite:\n${resume}`
        }
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to generate resume rewrite');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Utility: Generate rewrites for all provided company types.
 */
async function generateResumeRewritesForAllCompanyTypes(resume: string, jobDescription: string, selectedRole: string): Promise<Record<string, string>> {
  const companyTypes = ["startup", "enterprise", "consulting"];
  const rewrites: Record<string, string> = {};

  for (const companyType of companyTypes) {
    try {
      rewrites[companyType] = await generateFullResumeRewrite(resume, jobDescription, companyType, selectedRole);
    } catch (error) {
      rewrites[companyType] = `Failed to generate rewrite for ${companyType}: ${error.message}`;
    }
  }
  return rewrites;
}

/**
 * === Main Edge Function Handler ===
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resume, jobDescription, jobUrl, selectedRole, companyType, generateRewrite, multiVersion } = await req.json();

    // Validate required values
    if ((!resume && !jobDescription) && !jobUrl) {
      throw new Error('Either resume text or job URL is required');
    }
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // Use provided job description or fetch from URL
    let effectiveJobDescription = jobDescription || '';
    if (jobUrl && (!jobDescription || jobDescription.trim() === '')) {
      try {
        const extractedDescription = await fetchJobDescription(jobUrl);
        effectiveJobDescription = extractedDescription;
        console.log("Successfully extracted job description from URL");
      } catch (error) {
        console.error(`Error extracting job description from URL: ${error.message}`);
        effectiveJobDescription = `Error extracting job description from URL: ${jobUrl}. Please paste the job description manually.`;
      }
    }

    // Build and send GPT prompt for analysis
    const analysisMessages = buildAnalysisPrompt(selectedRole, effectiveJobDescription, resume);
    console.log("Sending analysis request to OpenAI...");

    const analysisData = await callOpenAIForAnalysis(analysisMessages);
    let analysis = parseAndValidateAnalysis(analysisData);

    // Resume rewrite generation (legacy: single, new: multiVersion)
    let rewrittenResume = null;
    if (multiVersion) {
      // Generate all versions for company types
      try {
        rewrittenResume = await generateResumeRewritesForAllCompanyTypes(
          resume,
          effectiveJobDescription,
          selectedRole || "Product Manager"
        );
      } catch (error) {
        rewrittenResume = {
          error: "Failed to generate multi-version rewrite",
          detail: error.message
        };
      }
    } else if (generateRewrite) {
      // Generate one version per requested company type (maintain legacy compatibility)
      try {
        rewrittenResume = await generateFullResumeRewrite(
          resume,
          effectiveJobDescription,
          companyType || "general",
          selectedRole || "Product Manager"
        );
      } catch (error) {
        rewrittenResume = "Failed to generate resume rewrite: " + error.message;
      }
    }

    // Return combined analysis + rewrite(s)
    const finalResult = {
      ...analysis,
      rewrittenResume
    };

    return new Response(JSON.stringify(finalResult), {
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
      wouldInterview: "Unable to provide recommendation due to error",
      rewrittenResume: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
