
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callOpenAIForAnalysis, generateFullResumeRewrite } from "./api.ts";
import { buildAnalysisPrompt, buildRewritePrompt } from "./prompts.ts";
import { parseAndValidateAnalysis } from "./utils.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to calculate ATS score based on keyword matching
function calculateATSScore(resumeText: string, jobDescriptionText: string): number {
  if (!resumeText || !jobDescriptionText) {
    return 0;
  }
  
  // Extract keywords from job description and resume
  const jobKeywords = extractKeywords(jobDescriptionText);
  const resumeKeywords = new Set(extractKeywords(resumeText));
  
  // Count matches
  let matches = 0;
  jobKeywords.forEach(keyword => {
    if (resumeKeywords.has(keyword)) {
      matches++;
    }
  });
  
  // Calculate score as percentage of matches
  const totalKeywords = jobKeywords.length;
  const score = totalKeywords > 0 ? Math.round((matches / totalKeywords) * 100) : 0;
  
  // Ensure score is within 0-100 range
  return Math.min(100, Math.max(0, score));
}

// Extract keywords from text
function extractKeywords(text: string): string[] {
  // Convert to lowercase and remove special characters
  const cleanedText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  
  // Split into words and remove common stop words
  const words = cleanedText.split(/\s+/);
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 
    'be', 'been', 'being', 'in', 'on', 'at', 'to', 'for', 'with', 
    'by', 'about', 'against', 'between', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'from', 'up', 'down', 'of',
    'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here',
    'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each',
    'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
    'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will',
    'just', 'should', 'now', 'you', 'your', 'we', 'our', 'i', 'my'
  ]);
  
  // Filter out stop words and short words
  const filteredWords = words.filter(word => 
    word.length > 2 && !stopWords.has(word)
  );

  // Count frequency of each word
  const wordFrequency: {[key: string]: number} = {};
  filteredWords.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  // Sort by frequency and get top keywords
  const sortedKeywords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  // Return up to 50 most common words as keywords
  return sortedKeywords.slice(0, 50);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting resume analysis request processing");
    
    const { 
      resume, 
      jobDescription, 
      jobUrl, 
      selectedRole, 
      generateRewrite, 
      skipATSCalculation = false,
      scoreHash = null
    } = await req.json();

    // Log input sizes to help with debugging
    console.log(`Processing request: Resume length: ${resume?.length || 0}, Job description length: ${jobDescription?.length || 0}, URL: ${jobUrl || 'none'}`);
    console.log(`Selected role: ${selectedRole || 'General'}, Generate rewrite: ${generateRewrite}, Skip ATS calculation: ${skipATSCalculation}`);
    
    // Validate required values
    if ((!resume || resume.trim() === '') && (!jobDescription || jobDescription.trim() === '')) {
      console.error("Both resume text and job description are empty");
      throw new Error('Both resume text and job description are empty');
    }
    
    if (!openAIApiKey) {
      console.error("OpenAI API key is not configured");
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
    if (generateRewrite) {
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
            response_format: { type: "json_object" }
          }),
        });
        
        if (!response.ok) {
          const error = await response.json();
          console.error("Error extracting job information:", error);
        } else {
          const data = await response.json();
          
          // Parse the extracted information
          const content = data.choices[0].message.content;
          try {
            const parsed = JSON.parse(content);
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
        }
      } catch (extractionError) {
        console.error("Error extracting job information:", extractionError);
      }
    }

    // Build and send GPT prompt for analysis
    const analysisMessages = buildAnalysisPrompt(selectedRole, effectiveJobDescription, resume);
    console.log("Sending analysis request to OpenAI...");

    try {
      console.log("Calling OpenAI API for resume analysis");
      let retries = 0;
      const maxRetries = 2;
      let analysisData;
      
      // Add retry logic for OpenAI API call
      while (retries <= maxRetries) {
        try {
          analysisData = await callOpenAIForAnalysis(analysisMessages, openAIApiKey);
          console.log("Successfully received OpenAI API response");
          break;
        } catch (apiError) {
          retries++;
          console.error(`OpenAI API call failed (attempt ${retries}/${maxRetries + 1}):`, apiError);
          
          if (retries > maxRetries) {
            throw apiError;
          }
          
          // Wait before retrying (exponential backoff)
          const delay = 1000 * Math.pow(2, retries - 1);
          console.log(`Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      if (!analysisData) {
        throw new Error("Failed to get analysis data from OpenAI after retries");
      }
      
      // Log the raw response before parsing
      console.log("OpenAI raw response structure:", JSON.stringify({
        choices: analysisData.choices ? 
          analysisData.choices.map(c => ({ index: c.index, finish_reason: c.finish_reason })) : 
          'No choices array',
        usage: analysisData.usage || 'No usage data'
      }));
      
      // Try to log a preview of the actual content
      try {
        if (analysisData.choices && analysisData.choices[0] && analysisData.choices[0].message) {
          const contentPreview = analysisData.choices[0].message.content.substring(0, 100) + '...';
          console.log("Response content preview:", contentPreview);
        }
      } catch (previewError) {
        console.error("Error while logging content preview:", previewError);
      }
      
      let analysis = parseAndValidateAnalysis(analysisData);
      
      console.log("Successfully parsed analysis object with keys:", Object.keys(analysis));
      console.log("Analysis score:", analysis.score);
      console.log("Missing keywords count:", Array.isArray(analysis.missingKeywords) ? analysis.missingKeywords.length : 'Not an array');
      console.log("Section feedback keys:", analysis.sectionFeedback ? Object.keys(analysis.sectionFeedback).length : 'No section feedback');

      // Resume rewrite generation (if requested) with enhanced context
      let rewrittenResume = null;
      let atsScores = {};
      
      if (generateRewrite) {
        console.log("Generating resume rewrite...");
        // Generate full professional resume
        try {
          // Pass the analysis to the rewrite function to incorporate feedback
          const rewriteResult = await generateFullResumeRewrite(
            resume, 
            effectiveJobDescription, 
            "general", 
            selectedRole,
            openAIApiKey,
            analysis // Pass the analysis for targeted improvements
          );
          
          // Extract the rewritten resume from the response
          rewrittenResume = rewriteResult.text;
          console.log("Successfully generated resume rewrite");
          
          // Use the calculated ATS score
          if (!skipATSCalculation) {
            atsScores = { "general": rewriteResult.atsScore };
            console.log("Generated ATS score:", rewriteResult.atsScore);
          }
        } catch (error) {
          console.error("Error generating resume rewrite:", error);
          rewrittenResume = "Failed to generate resume rewrite: " + error.message;
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

      console.log("Sending final response with keys:", Object.keys(finalResult));
      
      return new Response(JSON.stringify(finalResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error("Error in analysis process:", error);
      throw new Error(`Analysis failed: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in analyze-resume function:', error);
    // Return a structured error response with default values for all expected fields
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
