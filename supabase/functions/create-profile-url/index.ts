import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { resume, summary, feedback, mode } = await req.json();

    // Create a slug
    const slug = crypto.randomUUID().split("-")[0];

    const { error } = await supabase
      .from("public_profiles")
      .insert({
        slug,
        resume_text: resume,
        summary,
        feedback,
        mode,
      });

    if (error) {
      console.error('Error inserting profile:', error);
      throw error;
    }

    return new Response(JSON.stringify({
      url: `https://matchrate.co/u/${slug}`,
      slug,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error in create-profile-url function:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
