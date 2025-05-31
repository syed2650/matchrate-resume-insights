
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
    // Get subscribers who need their next email
    const now = new Date();
    const emailSchedule = [
      { step: 1, type: 'value_tips', hoursDelay: 24 },
      { step: 2, type: 'soft_pitch', hoursDelay: 72 },
      { step: 3, type: 'success_story', hoursDelay: 168 }, // 7 days
      { step: 4, type: 'hard_pitch', hoursDelay: 336 } // 14 days
    ];

    for (const schedule of emailSchedule) {
      const cutoffTime = new Date(now.getTime() - (schedule.hoursDelay * 60 * 60 * 1000));
      
      const { data: subscribers, error } = await supabase
        .from('email_subscribers')
        .select('*')
        .eq('email_sequence_step', schedule.step)
        .eq('is_active', true)
        .lt('signup_date', cutoffTime.toISOString())
        .is('last_email_sent', null);

      if (error) {
        console.error(`Error fetching subscribers for step ${schedule.step}:`, error);
        continue;
      }

      if (!subscribers?.length) continue;

      // Send emails to eligible subscribers
      for (const subscriber of subscribers) {
        try {
          const emailResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/ats-email-automation`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`
            },
            body: JSON.stringify({
              type: schedule.type,
              subscriberId: subscriber.id
            })
          });

          if (!emailResponse.ok) {
            console.error(`Failed to send ${schedule.type} email to ${subscriber.email}`);
          } else {
            console.log(`Successfully sent ${schedule.type} email to ${subscriber.email}`);
          }
        } catch (error) {
          console.error(`Error sending email to ${subscriber.email}:`, error);
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email scheduler completed successfully" 
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in email scheduler:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
