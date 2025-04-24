
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callOpenAIForAnalysis, generateFullResumeRewrite } from "./api.ts";
import { buildAnalysisPrompt } from "./prompts.ts";
import { parseAndValidateAnalysis, calculateATSScore } from "./utils.ts";

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
    const { 
      resume, 
      jobDescription, 
      jobUrl, 
      selectedRole, 
      companyType, 
      generateRewrite, 
      multiVersion,
      skipATSCalculation = false
    } = await req.json();

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

      // Resume rewrite generation (if requested) - SIMPLIFIED TO STAR BULLET POINTS
      let rewrittenResume = null;
      let atsScores = {};
      
      if (multiVersion) {
        // Generate all versions for company types
        try {
          const companyTypes = ["startup", "enterprise", "consulting"];
          rewrittenResume = {};
          atsScores = {};
          
          for (const type of companyTypes) {
            // Modified to focus on STAR bullet point extraction instead of full rewrites
            const extractionPrompt = [
              { role: "system", content: `You are an expert resume writer specializing in ${type} companies. 
                Extract 8 relevant skills and 3 core responsibilities from the job description, 
                and rephrase them as STAR-format resume bullet points for this ${selectedRole || "professional"}. 
                Keep language concise and results-focused. Format with bullet points (*)` },
              { role: "user", content: `Job Description: ${effectiveJobDescription}
                Resume: ${resume}
                
                Please provide 8 strong, STAR-format bullet points that highlight relevant skills and achievements
                for this ${selectedRole || "role"} at a ${type} company. Focus on results and quantifiable impacts.` }
            ];
            
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openAIApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'gpt-4o',
                messages: extractionPrompt,
                temperature: 0.7,
              }),
            });
            
            const data = await response.json();
            if (data.error) {
              throw new Error(`OpenAI API error: ${data.error.message}`);
            }
            
            // Extract the bullet points from the response
            const bulletPoints = data.choices[0].message.content;
            
            // Add header to identify the purpose
            const headerText = `# Resume Upgrade Suggestions for ${selectedRole || "Professional"} (${type} Focus)\n\n`;
            const roleContext = `This resume is optimized for: ${selectedRole || "Professional"} at a ${type} company\n\n`;
            
            rewrittenResume[type] = `${headerText}${roleContext}${bulletPoints}`;
            
            // Only calculate ATS scores if not skipped
            if (!skipATSCalculation) {
              atsScores[type] = calculateATSScore(bulletPoints, effectiveJobDescription);
            }
          }
        } catch (error) {
          console.error("Error generating multi-version rewrites:", error);
          rewrittenResume = {
            error: "Failed to generate bullet point suggestions",
            detail: error.message
          };
        }
      } else if (generateRewrite) {
        // Generate one version with STAR bullet points
        try {
          const extractionPrompt = [
            { role: "system", content: `You are an expert resume writer specializing in ${companyType || "various"} companies. 
              Extract 8 relevant skills and 3 core responsibilities from the job description, 
              and rephrase them as STAR-format resume bullet points for this ${selectedRole || "professional"}. 
              Keep language concise and results-focused. Format with bullet points (*)` },
            { role: "user", content: `Job Description: ${effectiveJobDescription}
              Resume: ${resume}
              
              Please provide 8 strong, STAR-format bullet points that highlight relevant skills and achievements
              for this ${selectedRole || "role"} at a ${companyType || "typical"} company. Focus on results and quantifiable impacts.` }
          ];
          
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openAIApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o',
              messages: extractionPrompt,
              temperature: 0.7,
            }),
          });
          
          const data = await response.json();
          if (data.error) {
            throw new Error(`OpenAI API error: ${data.error.message}`);
          }
          
          // Extract the bullet points from the response
          const bulletPoints = data.choices[0].message.content;
          
          // Add header to identify the purpose
          const headerText = `# Resume Upgrade Suggestions for ${selectedRole || "Professional"}\n\n`;
          const roleContext = `This resume is optimized for: ${selectedRole || "Professional"} at a ${companyType || "typical"} company\n\n`;
          
          rewrittenResume = `${headerText}${roleContext}${bulletPoints}`;
          
          // Only calculate ATS scores if not skipped
          if (!skipATSCalculation) {
            atsScores = { [companyType || "general"]: calculateATSScore(bulletPoints, effectiveJobDescription) };
          }
        } catch (error) {
          console.error("Error generating single rewrite:", error);
          rewrittenResume = "Failed to generate bullet point suggestions: " + error.message;
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
