
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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { days = 30 } = await req.json();

    // Traffic by source
    const { data: trafficBySource, error: trafficError } = await supabase
      .rpc('get_traffic_by_source', { days_back: days });

    if (trafficError) throw trafficError;

    // Conversion funnel data
    const { data: conversionFunnel, error: conversionError } = await supabase
      .rpc('get_conversion_funnel', { days_back: days });

    if (conversionError) throw conversionError;

    // Daily traffic trends
    const { data: dailyTraffic, error: dailyError } = await supabase
      .rpc('get_daily_traffic', { days_back: days });

    if (dailyError) throw dailyError;

    return new Response(JSON.stringify({
      traffic_by_source: trafficBySource || [],
      conversion_funnel: conversionFunnel || [],
      daily_traffic: dailyTraffic || []
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in UTM analytics dashboard:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
