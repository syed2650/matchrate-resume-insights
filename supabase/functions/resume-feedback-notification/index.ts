
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FeedbackNotificationRequest {
  submissionId: string;
  userId?: string;
  score: number;
  jobTitle?: string;
  recipientEmail?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { submissionId, userId, score, jobTitle, recipientEmail }: FeedbackNotificationRequest = await req.json();

    if (!submissionId) {
      return new Response(
        JSON.stringify({ error: "Missing required field: submissionId" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    let userEmail = recipientEmail;

    // If no email is provided but userId is, fetch the email from profiles
    if (!userEmail && userId) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        console.error("Error fetching user profile:", profileError);
        return new Response(
          JSON.stringify({ error: "Could not find user email" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      userEmail = profile.email;
    }

    if (!userEmail) {
      return new Response(
        JSON.stringify({ error: "No recipient email provided or found" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get the site URL from env or use default
    const siteUrl = "https://www.matchrate.co";
    const reviewUrl = `${siteUrl}/review?submission=${submissionId}`;
    
    // Role-specific message if jobTitle is provided
    const roleSpecificMessage = jobTitle 
      ? `for the ${jobTitle} position` 
      : "for your target position";

    const emailResponse = await resend.emails.send({
      from: "Matchrate.ai <support@matchrate.co>",
      to: [userEmail],
      subject: `Your Resume Analysis ${score ? `(Score: ${score}/100)` : ""} is Ready`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1E293B; margin-bottom: 20px;">Your Resume Analysis is Ready</h1>
          <p>We've completed analyzing your resume ${roleSpecificMessage}.</p>
          ${score ? `<p><strong>Your ATS match score: ${score}/100</strong></p>` : ''}
          <p>Your detailed feedback includes:</p>
          <ul>
            <li>Keyword match analysis</li>
            <li>Section-by-section feedback</li>
            <li>Bullet point improvement suggestions</li>
            <li>Interview readiness assessment</li>
          </ul>
          <a href="${reviewUrl}" style="display: inline-block; background-color: #3B82F6; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; margin-top: 20px;">View Your Analysis</a>
          <p style="margin-top: 30px;">Thank you for using Matchrate.ai to improve your resume.</p>
          <p>The Matchrate.ai Team</p>
          <hr style="margin-top: 30px; border: none; height: 1px; background-color: #e2e8f0;">
          <p style="font-size: 12px; color: #64748b;">This email was sent from <a href="${siteUrl}" style="color: #3B82F6; text-decoration: none;">Matchrate.ai</a>.</p>
        </div>
      `,
      reply_to: "support@matchrate.co",
    });

    console.log("Feedback notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in resume-feedback-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
