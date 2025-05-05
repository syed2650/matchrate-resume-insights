
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client with the Auth context of the function
const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, userId, anonymousId } = await req.json();
    
    if (action === 'track') {
      // Track usage for a user
      if (userId) {
        // Authenticated user tracking
        await supabase.from('usage_tracking').insert({
          user_id: userId,
          action_type: 'feedback',
          timestamp: new Date().toISOString()
        });
      } else if (anonymousId) {
        // Anonymous user tracking
        await supabase.from('usage_tracking').insert({
          anonymous_id: anonymousId,
          action_type: 'feedback',
          timestamp: new Date().toISOString()
        });
      }
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } 
    else if (action === 'check') {
      // Check if the user has reached their usage limit
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();
      
      let usageQuery;
      
      if (userId) {
        // Check usage for authenticated user
        usageQuery = await supabase
          .from('usage_tracking')
          .select('count', { count: 'exact' })
          .eq('user_id', userId)
          .eq('action_type', 'feedback')
          .gte('timestamp', todayStart)
          .lt('timestamp', todayEnd);
      } else if (anonymousId) {
        // Check usage for anonymous user
        usageQuery = await supabase
          .from('usage_tracking')
          .select('count', { count: 'exact' })
          .eq('anonymous_id', anonymousId)
          .eq('action_type', 'feedback')
          .gte('timestamp', todayStart)
          .lt('timestamp', todayEnd);
      } else {
        throw new Error('No user ID or anonymous ID provided');
      }
      
      const count = usageQuery.count || 0;
      const isPremium = userId ? await checkIfUserIsPremium(userId) : false;
      
      // Free users get 1 per day, premium users get 30 per month
      const limit = isPremium ? 30 : 1;
      const canUse = count < limit;
      
      return new Response(JSON.stringify({ 
        canUse,
        count,
        limit,
        isPremium
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    throw new Error('Invalid action');
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

// Helper function to check if a user is premium
async function checkIfUserIsPremium(userId: string): Promise<boolean> {
  // In a real application, this would check a subscriptions table or similar
  // For now, we'll just return false (free tier) for simplicity
  // This would be replaced with actual subscription logic
  return false;
}
