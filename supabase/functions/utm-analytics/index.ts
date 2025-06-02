
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

interface UTMAnalyticsRequest {
  event: string;
  data: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    referrer?: string;
    landing_page?: string;
  };
  timestamp: string;
  user_agent: string;
  page_url: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { event, data, timestamp, user_agent, page_url }: UTMAnalyticsRequest = await req.json();
    
    // Get IP address
    const ip_address = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    // Generate session ID from request headers or create one
    const session_id = req.headers.get('x-session-id') || 
                      crypto.randomUUID();

    // Insert into utm_analytics table
    const { error } = await supabase
      .from('utm_analytics')
      .insert({
        session_id,
        utm_source: data.utm_source,
        utm_medium: data.utm_medium,
        utm_campaign: data.utm_campaign,
        utm_content: data.utm_content,
        utm_term: data.utm_term,
        referrer: data.referrer,
        landing_page: data.landing_page,
        page_url,
        event_type: event,
        user_agent,
        ip_address,
        timestamp: new Date(timestamp).toISOString()
      });

    if (error) {
      console.error('UTM tracking error:', error);
      throw error;
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in UTM analytics:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
