
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
      skipATSCalculation = false,
      scoreHash = null
    } = await req.json();

    // Log input sizes to help with debugging
    console.log(`Processing request: Resume length: ${resume?.length || 0}, Job description length: ${jobDescription?.length || 0}, URL: ${jobUrl || 'none'}`);
    console.log(`Using score hash: ${scoreHash || 'none'}, Skip ATS calculation: ${skipATSCalculation}`);
    
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

    // First analyze job description to extract key information
    let jobKeywords = [];
    let coreResponsibilities = [];
    let industryContext = "";
    let toneSuggestion = "";
    
    // Only extract this information if we're going to generate a rewrite
    if (generateRewrite || multiVersion) {
      try {
        console.log("Extracting key information from job description...");
        const extractionPrompt = [
          {
            role: "system", 
            content: `You are an expert job description analyst. Extract exactly these elements from the job description:
              1. 5-8 keywords (most important skills or qualifications)
              2. 3 core responsibilities
              3. Industry context (e.g., SaaS, Public Sector, Finance, Healthcare)
              4. Writing tone that would match this job (e.g., innovation-focused, compliance-oriented, analytical)
              
              Respond in JSON format with these keys: keywords, responsibilities, industry, tone`
          },
          {
            role: "user", 
            content: effectiveJobDescription
          }
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
            temperature: 0.4,
          }),
        });
        
        const data = await response.json();
        if (data.error) {
          throw new Error(`OpenAI API error: ${data.error.message}`);
        }
        
        // Parse the extracted information
        const extractedContent = data.choices[0].message.content;
        try {
          const parsed = JSON.parse(extractedContent);
          jobKeywords = parsed.keywords || [];
          coreResponsibilities = parsed.responsibilities || [];
          industryContext = parsed.industry || "";
          toneSuggestion = parsed.tone || "";
          
          console.log("Successfully extracted job information:", {
            keywords: jobKeywords,
            responsibilities: coreResponsibilities,
            industry: industryContext,
            tone: toneSuggestion
          });
        } catch (parseError) {
          console.error("Error parsing extracted job information:", parseError);
        }
      } catch (extractionError) {
        console.error("Error extracting job information:", extractionError);
      }
    }

    // Build and send GPT prompt for analysis
    const analysisMessages = buildAnalysisPrompt(selectedRole, effectiveJobDescription, resume);
    console.log("Sending analysis request to OpenAI...");

    try {
      const analysisData = await callOpenAIForAnalysis(analysisMessages, openAIApiKey);
      let analysis = parseAndValidateAnalysis(analysisData);

      // Resume rewrite generation (if requested) with enhanced context
      let rewrittenResume = null;
      let atsScores = {};
      
      if (multiVersion) {
        // Generate all versions for company types
        try {
          const companyTypes = ["startup", "enterprise", "consulting"];
          rewrittenResume = {};
          atsScores = {};
          
          for (const type of companyTypes) {
            // Enhanced prompt with extracted job information
            const extractionPrompt = [
              { role: "system", content: `You are an expert resume writer specializing in ${type} companies. 
                You will create tailored bullet points for a ${selectedRole || "professional"} in the ${industryContext || type} industry.
                
                KEY JOB INFORMATION:
                - Industry: ${industryContext || "Not specified"}
                - Required tone: ${toneSuggestion || "Professional and results-oriented"}
                - Key skills: ${jobKeywords.join(', ')}
                - Core responsibilities: ${coreResponsibilities.join(', ')}
                
                Create 8 strong STAR-format bullet points that:
                1. Incorporate the key skills and align with the core responsibilities
                2. Match the industry context and writing tone
                3. Follow the STAR format with emphasis on Action and Results
                4. Include metrics and quantifiable achievements
                5. Use language appropriate for ${selectedRole || "professional"} roles in ${type} companies` },
                
              { role: "user", content: `Job Description: ${effectiveJobDescription}
                Resume: ${resume}
                
                Please provide 8 strong, STAR-format bullet points that highlight relevant skills and achievements
                for this ${selectedRole || "role"} at a ${type} company. Use the context and keywords provided.` }
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
            
            // Add header with context information
            const headerText = `# Resume Upgrade Suggestions for ${selectedRole || "Professional"} (${type} Focus)\n\n`;
            const contextInfo = `Industry: ${industryContext || type}\nTone: ${toneSuggestion || "Professional"}\n\n`;
            const roleContext = `This resume is optimized for: ${selectedRole || "Professional"} at a ${type} company focusing on ${jobKeywords.slice(0, 3).join(', ')}\n\n`;
            
            rewrittenResume[type] = `${headerText}${roleContext}${contextInfo}${bulletPoints}`;
            
            // Only calculate ATS scores if not skipped
            if (!skipATSCalculation) {
              // Use the score hash as part of the calculation to ensure deterministic results
              const scoreSeed = scoreHash ? `${bulletPoints}-${scoreHash}-${type}` : bulletPoints;
              atsScores[type] = calculateATSScore(scoreSeed, effectiveJobDescription);
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
        // Generate one version with enhanced context
        try {
          // Enhanced prompt with extracted job information
          const extractionPrompt = [
            { role: "system", content: `You are an expert resume writer specializing in ${companyType || "various"} companies. 
              You will create tailored bullet points for a ${selectedRole || "professional"} in the ${industryContext || companyType || "various"} industry.
              
              KEY JOB INFORMATION:
              - Industry: ${industryContext || "Not specified"}
              - Required tone: ${toneSuggestion || "Professional and results-oriented"}
              - Key skills: ${jobKeywords.join(', ')}
              - Core responsibilities: ${coreResponsibilities.join(', ')}
              
              Create 8 strong STAR-format bullet points that:
              1. Incorporate the key skills and align with the core responsibilities
              2. Match the industry context and writing tone
              3. Follow the STAR format with emphasis on Action and Results
              4. Include metrics and quantifiable achievements
              5. Use language appropriate for ${selectedRole || "professional"} roles` },
              
            { role: "user", content: `Job Description: ${effectiveJobDescription}
              Resume: ${resume}
              
              Please provide 8 strong, STAR-format bullet points that highlight relevant skills and achievements
              for this ${selectedRole || "role"} at a ${companyType || "typical"} company. Use the context and keywords provided.` }
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
          
          // Add header with context information
          const headerText = `# Resume Upgrade Suggestions for ${selectedRole || "Professional"}\n\n`;
          const contextInfo = `Industry: ${industryContext || companyType || "General"}\nTone: ${toneSuggestion || "Professional"}\n\n`;
          const skillsHighlight = `Key skills focus: ${jobKeywords.slice(0, 3).join(', ')}\n\n`;
          const roleContext = `This resume is optimized for: ${selectedRole || "Professional"} at a ${companyType || "typical"} company\n\n`;
          
          rewrittenResume = `${headerText}${roleContext}${contextInfo}${skillsHighlight}${bulletPoints}`;
          
          // Only calculate ATS scores if not skipped
          if (!skipATSCalculation) {
            // Use the score hash as part of the calculation to ensure deterministic results
            const scoreSeed = scoreHash ? `${bulletPoints}-${scoreHash}-${companyType || "general"}` : bulletPoints;
            atsScores = { [companyType || "general"]: calculateATSScore(scoreSeed, effectiveJobDescription) };
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
        atsScores,
        jobContext: {
          keywords: jobKeywords,
          responsibilities: coreResponsibilities,
          industry: industryContext,
          tone: toneSuggestion
        }
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
