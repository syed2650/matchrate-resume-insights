
import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from "openai";
import { generatePrompt, generateSystemMessage } from "./prompts";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log("API called: analyze-resume");
    
    // Parse request body
    const requestData = req.body;
    const { resume, jobDescription, selectedRole, generateRewrite = false, jobUrl = null } = requestData;

    // Validate inputs
    if (!resume || !jobDescription) {
      return res.status(400).json({ error: "Resume and job description are required" });
    }

    console.log("Inputs validated, proceeding with OpenAI analysis");
    
    // Initialize OpenAI client
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: "OpenAI API key not configured" });
    }

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    // Generate system message based on role
    const systemMessage = generateSystemMessage(selectedRole);
    
    // Generate the prompt 
    const prompt = generatePrompt(selectedRole, resume, jobDescription);

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
          
          return res.status(500).json({
            error: "Error parsing analysis results",
            details: parseError.message,
          });
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
        return res.status(200).json(response);
      } catch (jsonError) {
        console.error("Error processing OpenAI response:", jsonError);
        return res.status(500).json({
          error: "Error processing analysis results",
          details: jsonError.message,
        });
      }
    } catch (openaiError) {
      console.error("Error calling OpenAI API:", openaiError);
      return res.status(500).json({
        error: "Error calling OpenAI API",
        details: openaiError.message,
      });
    }
  } catch (error) {
    console.error("Unhandled error in analyze-resume function:", error);
    return res.status(500).json({
      error: "Server error during resume analysis",
      details: error.message,
    });
  }
}
