
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ExitIntentSignupRequest {
  email: string;
  source: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, source }: ExitIntentSignupRequest = await req.json();

    // Store exit intent signup
    const { data: signup, error: signupError } = await supabase
      .from('exit_intent_signups')
      .insert({
        email,
        signup_date: new Date().toISOString()
      })
      .select()
      .single();

    if (signupError) {
      // Check if email already exists
      if (signupError.code === '23505') {
        return new Response(JSON.stringify({ 
          success: true, 
          message: "Email already registered. Check your inbox for previous emails." 
        }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      throw signupError;
    }

    // Trigger exit intent email sequence
    const emailResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/exit-intent-email-automation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`
      },
      body: JSON.stringify({
        type: 'exit_welcome',
        email: email,
        signupId: signup.id
      })
    });

    if (!emailResponse.ok) {
      console.error('Failed to trigger exit intent email automation');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      signupId: signup.id,
      message: "Thank you! Check your email for your free resume analysis guide."
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in exit intent signup:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
