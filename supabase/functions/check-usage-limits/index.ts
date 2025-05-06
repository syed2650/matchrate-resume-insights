
// This Edge Function validates usage limits and tracks usage
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
};

// Generate a fingerprint token from request details
const generateFingerprint = (req: Request, data: any): string => {
  // Use a combination of headers that might help identify a browser
  const headers = req.headers;
  const userAgent = headers.get('user-agent') || '';
  const accept = headers.get('accept') || '';
  const language = headers.get('accept-language') || '';
  
  // Combine with any data sent from the client
  const clientData = data.fingerprint || '';
  
  // Create a simple hash of these values
  const combinedData = `${userAgent}|${accept}|${language}|${clientData}`;
  let hash = 0;
  for (let i = 0; i < combinedData.length; i++) {
    const char = combinedData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(36);
};

serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || ''
    );

    // Parse request body
    const requestData = await req.json();
    
    // Get client information
    const anonymousId = requestData.anonymousId || null;
    const fingerprintData = requestData.fingerprint || {};
    const clientFingerprint = generateFingerprint(req, fingerprintData);
    const ipAddress = requestData.ipAddress || req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for') || '';
    const featureName = requestData.feature || 'resume_analysis';
    
    // Extract auth token if present
    const authHeader = req.headers.get('authorization');
    let userId = null;
    
    if (authHeader) {
      // Verify the token and get the user ID
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabaseClient.auth.getUser(token);
      
      if (!error && user) {
        userId = user.id;
      }
    }

    // Check if the user has reached their usage limit using the database function
    const { data: checkResult, error: checkError } = await supabaseClient.rpc(
      'check_resume_analysis_limit',
      {
        p_user_id: userId,
        p_anonymous_id: anonymousId,
        p_client_fingerprint: clientFingerprint,
        p_ip_address: ipAddress
      }
    );

    if (checkError) {
      console.error("Error checking usage limits:", checkError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          canUse: false, 
          error: "Failed to check usage limits"
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const canUse = checkResult;

    // If user can use the feature, record this usage
    if (canUse) {
      const { error: insertError } = await supabaseClient
        .from('usage_tracking')
        .insert({
          user_id: userId,
          anonymous_id: anonymousId,
          client_fingerprint: clientFingerprint,
          ip_address: ipAddress,
          feature_name: featureName,
          action_type: 'use',
          usage_date: new Date().toISOString().split('T')[0]
        });

      if (insertError) {
        console.error("Error tracking usage:", insertError);
        // Continue even if tracking fails
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        canUse,
        clientId: anonymousId || clientFingerprint // Return client ID for tracking
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        canUse: false, 
        error: "An unexpected error occurred"
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
