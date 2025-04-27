
import { calculateATSScore, parseAndValidateAnalysis } from './utils.ts';
import { buildAnalysisPrompt, buildRewritePrompt } from './prompts.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export async function callOpenAIForAnalysis(messages: any[], openAIApiKey: string) {
  try {
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
        response_format: { type: "json_object" }, // Fixed object syntax
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API Error:", error);
      throw new Error(error.error?.message || `OpenAI API returned status ${response.status}`);
    }
    
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
  openAIApiKey: string
): Promise<{ text: string; atsScore: number }> {
  console.log("Generating full resume rewrite...");

  try {
    const messages = buildRewritePrompt(resume, jobDescription, companyType, selectedRole);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate resume rewrite');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Use deterministic ATS scoring based on input hash
    const atsScore = calculateATSScore(content, jobDescription);
    
    return {
      text: content,
      atsScore
    };
  } catch (error) {
    console.error("Error generating resume rewrite:", error);
    throw new Error(`Failed to generate resume rewrite: ${error.message}`);
  }
}
