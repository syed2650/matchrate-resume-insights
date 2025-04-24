
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callOpenAIForAnalysis, generateFullResumeRewrite } from "./api.ts";
import { buildAnalysisPrompt } from "./prompts.ts";
import { parseAndValidateAnalysis } from "./utils.ts";

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
    const { resume, jobDescription, jobUrl, selectedRole, companyType, generateRewrite, multiVersion } = await req.json();

    // Log input sizes to help with debugging
    console.log(`Processing request: Resume length: ${resume?.length || 0}, Job description length: ${jobDescription?.length || 0}, URL: ${jobUrl || 'none'}`);
    
    // Validate required values
    if ((!resume || resume.trim() === '') && (!jobDescription || jobDescription.trim() === '')) {
      throw new Error('Both resume text and job description are empty');
    }
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // Use provided job description or use a placeholder
    const effectiveJobDescription = jobDescription && jobDescription.trim() !== '' 
      ? jobDescription 
      : 'No job description provided. General resume feedback will be given.';

    // Build and send GPT prompt for analysis
    const analysisMessages = buildAnalysisPrompt(selectedRole, effectiveJobDescription, resume);
    console.log("Sending analysis request to OpenAI...");

    try {
      const analysisData = await callOpenAIForAnalysis(analysisMessages, openAIApiKey);
      let analysis = parseAndValidateAnalysis(analysisData);

      // Resume rewrite generation (if requested)
      let rewrittenResume = null;
      let atsScores = {};
      
      if (multiVersion) {
        // Generate all versions for company types
        try {
          const companyTypes = ["startup", "enterprise", "consulting"];
          rewrittenResume = {};
          atsScores = {};
          
          for (const type of companyTypes) {
            const result = await generateFullResumeRewrite(
              resume,
              effectiveJobDescription,
              type,
              selectedRole || "Product Manager",
              openAIApiKey
            );
            rewrittenResume[type] = result.text;
            atsScores[type] = result.atsScore;
          }
        } catch (error) {
          console.error("Error generating multi-version rewrites:", error);
          rewrittenResume = {
            error: "Failed to generate multi-version rewrite",
            detail: error.message
          };
        }
      } else if (generateRewrite) {
        // Generate one version per requested company type
        try {
          const rewriteResult = await generateFullResumeRewrite(
            resume,
            effectiveJobDescription,
            companyType || "general",
            selectedRole || "Product Manager",
            openAIApiKey
          );
          
          rewrittenResume = rewriteResult.text;
          atsScores = { [companyType || "general"]: rewriteResult.atsScore };
        } catch (error) {
          console.error("Error generating single rewrite:", error);
          rewrittenResume = "Failed to generate resume rewrite: " + error.message;
        }
      }

      // Return combined analysis + rewrite(s)
      const finalResult = {
        ...analysis,
        rewrittenResume,
        atsScores
      };

      return new Response(JSON.stringify(finalResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error("Error in analysis process:", error);
      throw new Error(`Analysis failed: ${error.message}`);
    }
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
      rewrittenResume: null,
      atsScores: {}
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
