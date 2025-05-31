
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

interface ATSSubmissionRequest {
  name: string;
  email: string;
  totalScore: number;
  sectionScores: {
    [key: string]: {
      score: number;
      maxScore: number;
      missing: string[];
    };
  };
  completedItems: {
    [key: string]: string[];
  };
  missingItems: {
    [key: string]: string[];
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const submissionData: ATSSubmissionRequest = await req.json();

    // Store in ats_submissions table (existing functionality)
    const { data: atsSubmission, error: atsError } = await supabase
      .from('ats_submissions')
      .insert({
        name: submissionData.name,
        email: submissionData.email,
        total_score: submissionData.totalScore,
        section_scores: submissionData.sectionScores,
        completed_items: submissionData.completedItems,
        missing_items: submissionData.missingItems
      })
      .select()
      .single();

    if (atsError) throw atsError;

    // Trigger email automation
    const emailResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/ats-email-automation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`
      },
      body: JSON.stringify({
        type: 'welcome',
        userData: {
          email: submissionData.email,
          name: submissionData.name,
          atsScore: submissionData.totalScore,
          sectionScores: submissionData.sectionScores,
          completedItems: submissionData.completedItems,
          missingItems: submissionData.missingItems
        }
      })
    });

    if (!emailResponse.ok) {
      console.error('Failed to trigger email automation:', await emailResponse.text());
    }

    return new Response(JSON.stringify({ 
      success: true, 
      submissionId: atsSubmission.id,
      message: "Thank you! Your detailed ATS report will be sent to your email within 5 minutes."
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in ATS checker submission:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
