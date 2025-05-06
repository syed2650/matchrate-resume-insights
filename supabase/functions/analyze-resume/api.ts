
import { calculateATSScore, parseAndValidateAnalysis } from './utils.ts';
import { buildAnalysisPrompt, buildRewritePrompt } from './prompts.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export async function callOpenAIForAnalysis(messages: any[], openAIApiKey: string) {
  try {
    console.log("Making OpenAI API call for analysis");
    
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
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API Error:", error);
      throw new Error(error.error?.message || `OpenAI API returned status ${response.status}`);
    }
    
    console.log("Received successful response from OpenAI API");
    return response.json();
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw new Error(`Failed to analyze resume: ${error.message}`);
  }
}

export async function generateFullResumeRewrite(
  resume: string, 
  jobDescription: string, 
  companyType: string, 
  selectedRole: string,
  openAIApiKey: string,
  analysis: any = null
): Promise<{ text: string; atsScore: number }> {
  console.log("Generating full resume rewrite...");
  
  // Prepare enhanced prompt based on analysis if available
  let enhancedPrompt = buildRewritePrompt(resume, jobDescription, companyType, selectedRole);
  
  // If we have analysis data, enhance the prompt with specific improvement areas
  if (analysis) {
    const missingKeywords = Array.isArray(analysis.missingKeywords) ? analysis.missingKeywords : [];
    const weakBullets = Array.isArray(analysis.weakBullets) ? analysis.weakBullets : [];
    const feedbackAreas = analysis.sectionFeedback || {};
    
    // Add specific guidance based on analysis
    enhancedPrompt[0].content += `\n\n✅ Additional Optimization Instructions:
    
1. Incorporate these missing keywords naturally: ${missingKeywords.join(', ')}

2. Address the following section improvement needs:
${Object.entries(feedbackAreas).map(([section, feedback]) => `- ${section}: ${feedback}`).join('\n')}

3. Create stronger bullet points that show clear achievements and metrics.

4. Ensure the resume achieves a high ATS compatibility score by using industry-standard formatting, relevant keywords, and clear section headers.`;
  }

  try {
    // Implement retry mechanism
    let attempts = 0;
    const maxAttempts = 2;
    let error;
    
    while (attempts <= maxAttempts) {
      try {
        console.log(`Attempt ${attempts + 1} to generate resume rewrite`);
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: enhancedPrompt,
            temperature: 0.3,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to generate resume rewrite');
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // Calculate improved ATS score based on the rewritten resume
        const atsScore = calculateATSScore(content, jobDescription);
        
        console.log("Successfully generated resume rewrite");
        
        // Clean up the rewritten resume - remove asterisks
        const cleanedContent = content
          .replace(/^\* /gm, '') // Remove asterisks at the beginning of lines
          .replace(/^\- /gm, ''); // Remove dashes at the beginning of lines
        
        return {
          text: cleanedContent,
          atsScore
        };
      } catch (err) {
        error = err;
        attempts++;
        
        if (attempts <= maxAttempts) {
          const delay = 1000 * Math.pow(2, attempts - 1); // Exponential backoff
          console.log(`Resume rewrite attempt ${attempts} failed. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw error || new Error("Failed to generate resume rewrite after retries");
  } catch (error) {
    console.error("Error generating resume rewrite:", error);
    throw new Error(`Failed to generate resume rewrite: ${error.message}`);
  }
}
