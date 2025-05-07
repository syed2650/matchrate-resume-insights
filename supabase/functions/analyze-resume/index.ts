
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { OpenAI } from "https://esm.sh/openai@4.17.4";
import { PromptTemplate } from "https://esm.sh/langchain@0.1.6";
import { generatePrompt, generateSystemMessage } from "./prompts.ts";

// Set up CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    console.log("Edge function called: analyze-resume");
    
    // Parse request body
    const requestData = await req.json();
    const { resume, jobDescription, selectedRole, generateRewrite = false, jobUrl = null } = requestData;

    // Validate inputs
    if (!resume || !jobDescription) {
      return new Response(
        JSON.stringify({ error: "Resume and job description are required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("Inputs validated, proceeding with OpenAI analysis");
    
    // Initialize OpenAI client
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    // Generate system message based on role
    const systemMessage = generateSystemMessage(selectedRole);
    
    // Generate the prompt template
    const template = generatePrompt(selectedRole);
    const promptTemplate = new PromptTemplate({
      template,
      inputVariables: ["resume", "jobDescription"],
    });

    // Format the prompt with actual resume and job description
    const prompt = await promptTemplate.format({
      resume,
      jobDescription,
    });

    console.log("Calling OpenAI API for analysis");
    
    // Call OpenAI API for resume analysis
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      });

      // Parse the OpenAI response
      try {
        const analysisText = completion.choices[0].message.content || "";
        console.log("OpenAI responded, parsing feedback");
        
        let feedbackData;
        try {
          // Parse the JSON response
          feedbackData = JSON.parse(analysisText);
          
          if (!feedbackData) {
            throw new Error("Empty feedback data received");
          }
        } catch (parseError) {
          console.error("Error parsing feedback JSON:", parseError);
          console.error("Raw response:", analysisText);
          
          return new Response(
            JSON.stringify({
              error: "Error parsing analysis results",
              details: parseError.message,
            }),
            {
              status: 500,
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
              },
            }
          );
        }
        
        // Handle rewrite generation if requested
        let rewrittenResume = null;
        if (generateRewrite && feedbackData.score < 85) {
          // Only generate rewrite for scores below 85
          try {
            console.log("Generating resume rewrite");
            // Call OpenAI again for rewrite
            const rewritePrompt = `
              I need you to rewrite the following resume to better match the job description.
              Use the feedback below to improve the resume. Maintain the same format but make it more relevant,
              include missing keywords, and fix weak bullet points.
              
              RESUME:
              ${resume}
              
              JOB DESCRIPTION:
              ${jobDescription}
              
              FEEDBACK:
              ${JSON.stringify(feedbackData)}
              
              Please provide the complete rewritten resume in a similar format to the original.
            `;
            
            const rewriteCompletion = await openai.chat.completions.create({
              model: "gpt-4o",
              messages: [
                {
                  role: "system",
                  content:
                    "You are a professional resume writer who specializes in optimizing resumes for specific job descriptions.",
                },
                { role: "user", content: rewritePrompt },
              ],
              temperature: 0.3,
            });
            
            rewrittenResume = rewriteCompletion.choices[0].message.content || "";
          } catch (rewriteError) {
            console.error("Error generating resume rewrite:", rewriteError);
            // Continue without the rewrite but don't fail the entire request
            rewrittenResume = "Error generating rewrite: " + rewriteError.message;
          }
        }
        
        // Combine feedback with rewrite
        const response = {
          ...feedbackData,
          rewrittenResume,
        };
        
        console.log("Analysis complete, returning results");
        
        // Return the combined response
        return new Response(JSON.stringify(response), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      } catch (jsonError) {
        console.error("Error processing OpenAI response:", jsonError);
        return new Response(
          JSON.stringify({
            error: "Error processing analysis results",
            details: jsonError.message,
          }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }
    } catch (openaiError) {
      console.error("Error calling OpenAI API:", openaiError);
      return new Response(
        JSON.stringify({
          error: "Error calling OpenAI API",
          details: openaiError.message,
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    console.error("Unhandled error in analyze-resume function:", error);
    return new Response(
      JSON.stringify({
        error: "Server error during resume analysis",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
