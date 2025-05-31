
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'exit_welcome' | 'exit_value';
  email: string;
  signupId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, signupId }: EmailRequest = await req.json();

    const emailContent = generateExitIntentEmail(type, email);
    
    const emailResponse = await resend.emails.send({
      from: "MatchRate Team <support@matchrate.co>",
      to: [email],
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    // Log email if signupId provided
    if (signupId) {
      await supabase
        .from('exit_intent_signups')
        .update({
          email_sequence_step: type === 'exit_welcome' ? 1 : 2,
          last_email_sent: new Date().toISOString()
        })
        .eq('id', signupId);
    }

    // Schedule next email if this is the welcome email
    if (type === 'exit_welcome') {
      setTimeout(async () => {
        try {
          await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/exit-intent-email-automation`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`
            },
            body: JSON.stringify({
              type: 'exit_value',
              email: email,
              signupId: signupId
            })
          });
        } catch (error) {
          console.error('Failed to send follow-up email:', error);
        }
      }, 3 * 24 * 60 * 60 * 1000); // 3 days
    }

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in exit intent email automation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

function generateExitIntentEmail(type: string, email: string) {
  const templates = {
    exit_welcome: {
      subject: "Here's your free resume analysis (takes 2 minutes)",
      html: generateExitWelcomeEmail(),
      text: "Thanks for your interest in optimizing your resume! Take 2 minutes to complete our interactive ATS checklist..."
    },
    exit_value: {
      subject: "The resume mistake that costs you interviews",
      html: generateExitValueEmail(),
      text: "A few days ago I sent you our free ATS checklist. Whether you've completed it or not, I want to share the #1 mistake..."
    }
  };

  return templates[type as keyof typeof templates] || templates.exit_welcome;
}

function generateExitWelcomeEmail(): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #1e293b;">Hi there!</h1>
      
      <p>Thanks for your interest in optimizing your resume!</p>

      <p>I noticed you were browsing MatchRate.co - you're smart to focus on resume optimization. Most job seekers don't realize that <strong>75% of resumes get rejected by ATS systems</strong> before humans ever see them.</p>

      <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 20px 0;">
        <h3 style="color: #0369a1; margin: 0 0 15px 0;">🎯 HERE'S WHAT I'D RECOMMEND:</h3>
        <p style="margin: 0; color: #0369a1;">Take 2 minutes to complete our interactive ATS checklist. It will show you exactly where your resume might be failing and how to fix it:</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://matchrate.co/free-ats-check" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Complete Your FREE ATS Analysis →</a>
      </div>

      <p>This checklist covers:</p>
      <ul>
        <li>✅ ATS compatibility issues</li>
        <li>✅ Keyword optimization gaps</li>
        <li>✅ Formatting problems that block parsing</li>
        <li>✅ Technical details that matter</li>
      </ul>

      <p>Once you complete it, you'll get a personalized score and specific improvement recommendations.</p>

      <p>Best,<br>The MatchRate Team</p>

      <p><strong>P.S.</strong> This analysis usually costs $50+ elsewhere. We're offering it free because we believe every job seeker deserves a fighting chance against ATS systems.</p>
    </div>
  `;
}

function generateExitValueEmail(): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #1e293b;">Hi again,</h1>
      
      <p>A few days ago I sent you our free ATS checklist. Whether you've completed it or not, I want to share the #1 mistake I see that costs job seekers interviews:</p>

      <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0;">
        <h2 style="color: #dc2626; margin: 0;">Using the same resume for every job application.</h2>
      </div>

      <p>Here's what happens when you do this:</p>
      <ul style="color: #dc2626;">
        <li>❌ Your resume doesn't match job-specific keywords</li>
        <li>❌ ATS systems rank you lower than customized applicants</li>
        <li>❌ Hiring managers see generic, unfocused candidates</li>
        <li>❌ You blend in instead of standing out</li>
      </ul>

      <h3 style="color: #16a34a;">🎯 WHAT SUCCESSFUL JOB SEEKERS DO INSTEAD:</h3>
      <ul style="color: #16a34a;">
        <li>Customize the top 1/3 of their resume for each job</li>
        <li>Mirror the job description language naturally</li>
        <li>Lead with their biggest, most relevant achievement</li>
        <li>Include 3-5 keywords from the job posting</li>
      </ul>

      <p>The problem? This process takes 20+ minutes per application.</p>

      <p><strong>That's exactly why I built MatchRate.co.</strong></p>

      <p>Our AI instantly analyzes your resume against any job description and tells you:</p>
      <ul>
        <li>✅ Exact compatibility score</li>
        <li>✅ Missing keywords you should add</li>
        <li>✅ Which experience to emphasize</li>
        <li>✅ How to reorder content for maximum impact</li>
      </ul>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://matchrate.co/review" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Analyze Your Resume Against Real Jobs →</a>
      </div>

      <p>Best,<br>The MatchRate Team</p>

      <p><strong>P.S.</strong> If you haven't completed our free ATS checklist yet, start there: <a href="https://matchrate.co/free-ats-check">Free ATS Analysis →</a></p>
    </div>
  `;
}

serve(handler);
