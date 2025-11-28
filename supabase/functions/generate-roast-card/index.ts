import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, originalText } = await req.json();

    if (!resumeText) {
      return new Response(
        JSON.stringify({ error: 'Resume text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating roast card...');

    const prompt = `Create a hilarious but useful roast of the resume. Combine humor with actual suggestions.

Resume:
${resumeText}

Output sections:
1. 🔥 ROAST (funny, punchy, roast like a TikTok career coach - 3-5 lines of mildly savage but fun roast. Target clichés, corporate jargon, formatting sins, vague achievements. No personal insults about age, gender, race, appearance, location. Add 1-2 punchlines that are screenshot-worthy.)
2. 📘 REAL REVIEW (useful 5–7 improvements)
3. ⭐ SHAREABLE LINE (1-sentence roast for X/Twitter)

Provide your response in the following structured format:

ROAST:
[3-5 lines of funny roast]

REAL REVIEW:
- Improvement 1
- Improvement 2
- Improvement 3
- Improvement 4
- Improvement 5
- Improvement 6
- Improvement 7

SCORES:
Formatting: [0-20]
Clarity: [0-20]
Impact: [0-20]
ATS: [0-20]
Overall: [0-100]

SHAREABLE LINE:
[One-sentence roast for social media]`;

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
            content: 'You are a hilarious TikTok-style career coach who roasts resumes while providing genuinely useful feedback. Keep it funny but helpful.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to generate roast card' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the structured response
    const roastMatch = content.match(/ROAST:(.*?)(?=SCORES:|$)/is);
    const roast = roastMatch ? roastMatch[1].trim() : '';

    const scoresMatch = content.match(/SCORES?:(.*?)(?=SHARE TEXT:|$)/is);
    const scoresText = scoresMatch ? scoresMatch[1] : '';
    
    const formattingMatch = scoresText.match(/Formatting:\s*(\d+)/i);
    const clarityMatch = scoresText.match(/Clarity:\s*(\d+)/i);
    const impactMatch = scoresText.match(/Impact:\s*(\d+)/i);
    const atsMatch = scoresText.match(/ATS:\s*(\d+)/i);
    const overallMatch = scoresText.match(/Overall:\s*(\d+)/i);

    const scores = {
      formatting: formattingMatch ? parseInt(formattingMatch[1]) : 0,
      clarity: clarityMatch ? parseInt(clarityMatch[1]) : 0,
      impact: impactMatch ? parseInt(impactMatch[1]) : 0,
      ats: atsMatch ? parseInt(atsMatch[1]) : 0,
      overall: overallMatch ? parseInt(overallMatch[1]) : 0
    };

    const shareTextMatch = content.match(/SHARE TEXT:(.*?)$/is);
    const shareText = shareTextMatch ? shareTextMatch[1].trim() : `My Resume Roast Score: ${scores.overall}/100 🔥`;

    // Generate a unique share URL
    const shareId = crypto.randomUUID().split('-')[0];
    const shareUrl = `https://matchrate.co/roast/${shareId}`;

    // Store in database
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const roastData = {
      roast,
      scores,
      shareText
    };

    await supabase
      .from('resume_reviews')
      .insert({
        original_text: originalText || resumeText,
        roast_card: roastData,
        share_url: shareUrl
      });

    return new Response(
      JSON.stringify({
        roast,
        scores,
        shareText,
        shareUrl
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-roast-card function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
