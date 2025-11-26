import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText } = await req.json();

    if (!resumeText) {
      return new Response(
        JSON.stringify({ error: 'Resume text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Rewriting resume...');

    const prompt = `You are an expert resume writer and career coach. Your task is to completely rewrite this resume to make it more professional, impactful, and ATS-friendly.

Guidelines:
- Remove fluff and vague statements
- Use strong action verbs (Led, Managed, Developed, Achieved, etc.)
- Quantify achievements with numbers and metrics where possible
- Restructure bullet points using the STAR method (Situation, Task, Action, Result)
- Ensure consistent formatting and professional tone
- Optimize for ATS by using industry-standard keywords
- Keep it concise and impactful

Original Resume:
${resumeText}

Return your response as a fully rewritten professional resume. Also provide brief notes on the major changes you made.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert resume writer who creates professional, ATS-optimized resumes. Always return structured output with the rewritten resume and notes on changes.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to rewrite resume' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the response to extract rewritten resume and notes
    // Simple parsing - split on "Notes:" or similar markers
    let rewritten = content;
    let notes = '';

    const notesMatch = content.match(/(?:Notes?|Changes?|Improvements?|Key Changes):\s*(.+)$/is);
    if (notesMatch) {
      notes = notesMatch[1].trim();
      rewritten = content.substring(0, notesMatch.index).trim();
    }

    return new Response(
      JSON.stringify({
        rewritten,
        notes: notes || 'Resume rewritten with improved clarity, action verbs, and quantified achievements.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in rewrite-resume function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
