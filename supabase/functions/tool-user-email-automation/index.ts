
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

interface ToolUserEmailRequest {
  type: 'tool_welcome' | 'tool_tips' | 'tool_advanced' | 'tool_success';
  userId: string;
  userEmail?: string;
  userName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, userId, userEmail, userName }: ToolUserEmailRequest = await req.json();

    // Get user profile if not provided
    let email = userEmail;
    let name = userName;

    if (!email || !name) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email, full_name, analysis_count, average_score, biggest_improvement')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      email = email || profile.email;
      name = name || profile.full_name || 'there';
    }

    if (!email) {
      throw new Error('No email found for user');
    }

    const emailContent = await generateToolUserEmail(type, { email, name, userId });
    
    const emailResponse = await resend.emails.send({
      from: "MatchRate Team <support@matchrate.co>",
      to: [email],
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    // Update user profile
    const updateData: any = {
      email_sequence_step: getEmailStep(type),
      last_email_sent: new Date().toISOString()
    };

    await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    // Schedule next email
    if (type !== 'tool_success') {
      const nextEmailType = getNextEmailType(type);
      const delay = getEmailDelay(nextEmailType);

      setTimeout(async () => {
        try {
          await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/tool-user-email-automation`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`
            },
            body: JSON.stringify({
              type: nextEmailType,
              userId: userId
            })
          });
        } catch (error) {
          console.error(`Failed to send ${nextEmailType} email:`, error);
        }
      }, delay);
    }

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in tool user email automation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

function getEmailStep(type: string): number {
  const steps = {
    tool_welcome: 1,
    tool_tips: 2,
    tool_advanced: 3,
    tool_success: 4
  };
  return steps[type as keyof typeof steps] || 1;
}

function getNextEmailType(currentType: string): string {
  const sequence = {
    tool_welcome: 'tool_tips',
    tool_tips: 'tool_advanced',
    tool_advanced: 'tool_success'
  };
  return sequence[currentType as keyof typeof sequence] || '';
}

function getEmailDelay(emailType: string): number {
  const delays = {
    tool_tips: 24 * 60 * 60 * 1000, // 24 hours
    tool_advanced: 3 * 24 * 60 * 60 * 1000, // 3 days
    tool_success: 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  return delays[emailType as keyof typeof delays] || 0;
}

async function generateToolUserEmail(type: string, userData: any) {
  const firstName = userData.name ? userData.name.split(' ')[0] : 'there';

  // Get user stats if available
  const { data: profile } = await supabase
    .from('profiles')
    .select('analysis_count, average_score, biggest_improvement')
    .eq('id', userData.userId)
    .single();

  const templates = {
    tool_welcome: {
      subject: `Welcome to MatchRate! Here's how to get your first analysis`,
      html: generateToolWelcomeEmail(firstName),
      text: `Hi ${firstName}, Welcome to MatchRate.co! You've made a smart decision...`
    },
    tool_tips: {
      subject: `${firstName}, how to interpret your MatchRate score`,
      html: generateToolTipsEmail(firstName),
      text: `Hi ${firstName}, How did your first resume analysis go?...`
    },
    tool_advanced: {
      subject: `${firstName}, unlock these powerful MatchRate features`,
      html: generateToolAdvancedEmail(firstName),
      text: `Hi ${firstName}, Now that you've had a few days with MatchRate...`
    },
    tool_success: {
      subject: `${firstName}, see how others are landing interviews with MatchRate`,
      html: generateToolSuccessEmail(firstName, profile),
      text: `Hi ${firstName}, It's been a week since you joined MatchRate!...`
    }
  };

  return templates[type as keyof typeof templates] || templates.tool_welcome;
}

function generateToolWelcomeEmail(firstName: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #1e293b;">Hi ${firstName},</h1>
      
      <p>Welcome to MatchRate.co! You've made a smart decision - you're now part of the 5% of job seekers who actively optimize their resumes for success.</p>

      <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 20px 0;">
        <h3 style="color: #0369a1; margin: 0 0 15px 0;">🚀 HERE'S HOW TO GET STARTED:</h3>
        <ol style="color: #0369a1; margin: 0;">
          <li><strong>Step 1</strong>: Upload your current resume</li>
          <li><strong>Step 2</strong>: Find a job posting you're interested in</li>
          <li><strong>Step 3</strong>: Paste the job description into our analyzer</li>
          <li><strong>Step 4</strong>: Get your compatibility score + improvement recommendations</li>
        </ol>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://matchrate.co/review" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Your First Analysis →</a>
      </div>

      <h3>📊 WHAT YOU'LL SEE:</h3>
      <ul>
        <li>Compatibility score (0-100%)</li>
        <li>Missing keywords analysis</li>
        <li>ATS compatibility assessment</li>
        <li>Specific improvement recommendations</li>
        <li>Before/after comparison</li>
      </ul>

      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0;">
        <p style="color: #92400e; margin: 0;"><strong>🎯 PRO TIP:</strong> Start with a job you recently applied to. You'll likely discover why you didn't hear back!</p>
      </div>

      <p><strong>Need help getting started?</strong></p>
      <ul>
        <li><a href="https://matchrate.co/review">Start Your First Analysis →</a></li>
        <li>Reply to this email with questions</li>
      </ul>

      <p>Welcome aboard!<br>The MatchRate Team</p>

      <p><strong>P.S.</strong> Your first analysis usually reveals 5-8 improvement opportunities. Most users see a 40% increase in interview rates after implementing our recommendations.</p>
    </div>
  `;
}

function generateToolTipsEmail(firstName: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #1e293b;">Hi ${firstName},</h1>
      
      <p>How did your first resume analysis go? Whether you've run it yet or not, here's how to interpret your MatchRate compatibility scores:</p>

      <div style="background: #f8fafc; border-left: 4px solid #64748b; padding: 20px; margin: 20px 0;">
        <h3 style="color: #334155; margin: 0 0 15px 0;">📊 UNDERSTANDING YOUR SCORES:</h3>
        <ul style="color: #334155; margin: 0;">
          <li><strong>90-100%</strong>: Excellent! Your resume is highly optimized for this role</li>
          <li><strong>80-89%</strong>: Very good, minor tweaks will make it perfect</li>
          <li><strong>70-79%</strong>: Good foundation, several improvements needed</li>
          <li><strong>60-69%</strong>: Significant gaps, focus on top recommendations</li>
          <li><strong>Below 60%</strong>: Major optimization required, but very fixable!</li>
        </ul>
      </div>

      <h3 style="color: #16a34a;">🎯 WHAT TO DO WITH YOUR RESULTS:</h3>
      <ul>
        <li><strong>If you scored 80%+</strong>: Focus on the keyword recommendations and apply with confidence</li>
        <li><strong>If you scored 60-79%</strong>: Implement the top 3 recommendations before applying</li>
        <li><strong>If you scored below 60%</strong>: Don't panic! This means huge opportunity for improvement. Start with formatting and keyword issues first.</li>
      </ul>

      <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 20px 0;">
        <h3 style="color: #0369a1; margin: 0 0 15px 0;">💡 SUCCESS STRATEGY:</h3>
        <ol style="color: #0369a1; margin: 0;">
          <li>Run analysis on your dream job posting</li>
          <li>Implement top 5 recommendations</li>
          <li>Re-run analysis to see improvement</li>
          <li>Apply when you hit 80%+ compatibility</li>
        </ol>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://matchrate.co/review" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Analyze Another Job →</a>
      </div>

      <p><strong>Common First-Time Questions:</strong></p>
      <ul>
        <li>"Should I customize for every job?" → Yes, at least the top 1/3 of your resume</li>
        <li>"How many keywords should I add?" → Focus on the top 5-7 from our recommendations</li>
        <li>"What if I don't have the required experience?" → Emphasize transferable skills and relevant projects</li>
      </ul>

      <p>Questions? Just reply to this email!</p>

      <p>Best,<br>The MatchRate Team</p>
    </div>
  `;
}

function generateToolAdvancedEmail(firstName: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #1e293b;">Hi ${firstName},</h1>
      
      <p>Now that you've had a few days with MatchRate, let me show you some advanced features that power users love:</p>

      <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 20px 0;">
        <h3 style="color: #0369a1; margin: 0 0 15px 0;">🔍 ADVANCED MATCHRATE FEATURES:</h3>
        <ul style="color: #0369a1; margin: 0;">
          <li><strong>Job-Specific Analysis</strong>: Get detailed compatibility reports for any position</li>
          <li><strong>Keyword Optimization</strong>: See exactly which terms to include for each role</li>
          <li><strong>ATS Compatibility Scoring</strong>: Understand how ATS systems will rank your resume</li>
          <li><strong>Industry Benchmarking</strong>: Compare your resume to successful candidates</li>
          <li><strong>Version Tracking</strong>: Save and compare different resume versions</li>
        </ul>
      </div>

      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0;">
        <p style="color: #92400e; margin: 0;"><strong>Power User Tip:</strong> Create 2-3 resume versions optimized for different role types (e.g., "Marketing Manager," "Digital Marketing Specialist," "Growth Marketing"). Then use our analyzer to pick the best version for each specific job.</p>
      </div>

      <h3>📈 THIS WEEK'S CHALLENGE:</h3>
      <p>Try to improve one of your previous analysis scores by 10+ points using our recommendations. Most users find this surprisingly easy once they understand the system!</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://matchrate.co/review" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Improving Your Score →</a>
      </div>

      <p>Best,<br>The MatchRate Team</p>

      <p><strong>P.S.</strong> Our most successful users run 3-5 analyses per resume before applying. Each iteration typically improves their score by 5-15 points.</p>
    </div>
  `;
}

function generateToolSuccessEmail(firstName: string, profile: any): string {
  const analysisCount = profile?.analysis_count || 0;
  const averageScore = profile?.average_score || 0;
  const biggestImprovement = profile?.biggest_improvement || 0;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #1e293b;">Hi ${firstName},</h1>
      
      <p>It's been a week since you joined MatchRate! I wanted to share some success stories from users who started just like you:</p>

      <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 20px; margin: 20px 0;">
        <h3 style="color: #15803d; margin: 0 0 15px 0;">🎉 SUCCESS STORY #1 - David, Software Engineer</h3>
        <p style="color: #15803d; margin: 0;">"I was getting zero responses despite 50+ applications. MatchRate showed me I was missing key technical terms that ATS systems look for. After optimization, I got 6 interviews in 3 weeks and landed a role with 25% salary increase!"</p>
      </div>

      <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 20px; margin: 20px 0;">
        <h3 style="color: #15803d; margin: 0 0 15px 0;">📈 SUCCESS STORY #2 - Sarah, Marketing Manager</h3>
        <p style="color: #15803d; margin: 0;">"MatchRate helped me realize my resume was too generic. The job-specific analysis feature showed me exactly how to customize for each application. Went from 2% response rate to 35%!"</p>
      </div>

      <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 20px; margin: 20px 0;">
        <h3 style="color: #15803d; margin: 0 0 15px 0;">🚀 SUCCESS STORY #3 - Mike, Recent Graduate</h3>
        <p style="color: #15803d; margin: 0;">"As a new grad, I didn't know what employers wanted. MatchRate's recommendations helped me highlight relevant coursework and projects. Got my first job offer within a month!"</p>
      </div>

      ${analysisCount > 0 ? `
        <div style="background: #f8fafc; border-left: 4px solid #64748b; padding: 20px; margin: 20px 0;">
          <h3 style="color: #334155; margin: 0 0 15px 0;">📊 YOUR PROGRESS SO FAR:</h3>
          <ul style="color: #334155; margin: 0;">
            <li>You've run ${analysisCount} analysis${analysisCount !== 1 ? 'es' : ''}</li>
            ${averageScore > 0 ? `<li>Average compatibility score: ${averageScore.toFixed(1)}%</li>` : ''}
            ${biggestImprovement > 0 ? `<li>Most improved resume: +${biggestImprovement} points</li>` : ''}
          </ul>
        </div>
      ` : `
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0;">
          <p style="color: #92400e; margin: 0;"><strong>Ready to run your first analysis?</strong> Start with a job posting you're interested in!</p>
        </div>
      `}

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://matchrate.co/review" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Continue Your Analysis →</a>
      </div>

      <p><strong>Questions about your results or need optimization help?</strong><br>
      Just reply to this email - I personally read and respond to every message.</p>

      <p>Best,<br>The MatchRate Team</p>

      <p><strong>P.S.</strong> The average MatchRate user sees results within 2-3 weeks of implementing our recommendations. You're already ahead of 95% of job seekers just by using optimization tools!</p>
    </div>
  `;
}

serve(handler);
