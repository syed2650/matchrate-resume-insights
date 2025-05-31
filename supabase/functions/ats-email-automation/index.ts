
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
  type: 'welcome' | 'value_tips' | 'soft_pitch' | 'success_story' | 'hard_pitch';
  subscriberId?: string;
  userData?: {
    email: string;
    name: string;
    atsScore: number;
    sectionScores: any;
    completedItems: any;
    missingItems: any;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, subscriberId, userData }: EmailRequest = await req.json();

    let subscriber;
    
    if (type === 'welcome' && userData) {
      // Create new subscriber and send welcome email
      const scoreInterpretation = getScoreInterpretation(userData.atsScore);
      
      const { data: newSubscriber, error: insertError } = await supabase
        .from('email_subscribers')
        .insert({
          email: userData.email,
          name: userData.name,
          ats_score: userData.atsScore,
          section_scores: userData.sectionScores,
          score_interpretation: scoreInterpretation,
          completed_items: userData.completedItems,
          missing_items: userData.missingItems,
          email_sequence_step: 1
        })
        .select()
        .single();

      if (insertError) throw insertError;
      subscriber = newSubscriber;

      // Schedule follow-up emails
      await scheduleFollowUpEmails(subscriber.id);
    } else if (subscriberId) {
      // Get existing subscriber
      const { data, error } = await supabase
        .from('email_subscribers')
        .select('*')
        .eq('id', subscriberId)
        .single();

      if (error) throw error;
      subscriber = data;
    }

    if (!subscriber) {
      throw new Error('No subscriber data found');
    }

    // Generate and send email
    const emailContent = generateEmailContent(type, subscriber);
    
    const emailResponse = await resend.emails.send({
      from: "MatchRate Team <support@matchrate.co>",
      to: [subscriber.email],
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    // Log email sent
    await supabase
      .from('email_automation_log')
      .insert({
        subscriber_id: subscriber.id,
        email_type: type,
        email_step: getEmailStep(type),
        resend_id: emailResponse.data?.id,
        status: 'sent'
      });

    // Update subscriber
    await supabase
      .from('email_subscribers')
      .update({
        email_sequence_step: subscriber.email_sequence_step + 1,
        last_email_sent: new Date().toISOString()
      })
      .eq('id', subscriber.id);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in email automation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

function getScoreInterpretation(score: number): string {
  if (score >= 18) return "Excellent! ATS Ready";
  if (score >= 15) return "Good - Minor tweaks needed";
  if (score >= 12) return "Needs Work - Several improvements";
  if (score >= 8) return "Requires Major Changes";
  return "Critical - Complete Overhaul Needed";
}

function getEmailStep(type: string): number {
  const steps = {
    welcome: 1,
    value_tips: 2,
    soft_pitch: 3,
    success_story: 4,
    hard_pitch: 5
  };
  return steps[type as keyof typeof steps] || 1;
}

function generateEmailContent(type: string, subscriber: any) {
  const firstName = subscriber.name.split(' ')[0];
  const { ats_score, section_scores, missing_items, score_interpretation } = subscriber;

  const templates = {
    welcome: {
      subject: `Your ATS score: ${ats_score}/20 + 3 priority fixes`,
      html: generateWelcomeEmail(firstName, ats_score, section_scores, missing_items, score_interpretation),
      text: `Hi ${firstName}, Your ATS Compatibility Score: ${ats_score}/20 (${score_interpretation})`
    },
    value_tips: {
      subject: `${firstName}, the mistake that kills 67% of applications`,
      html: generateValueTipsEmail(firstName, ats_score, section_scores),
      text: `Hi ${firstName}, Yesterday you scored ${ats_score}/20 on our ATS checklist...`
    },
    soft_pitch: {
      subject: `How to decode any job description in 5 minutes`,
      html: generateSoftPitchEmail(firstName, ats_score),
      text: `Hi ${firstName}, Remember your ATS score of ${ats_score}/20?...`
    },
    success_story: {
      subject: `From ${ats_score}/20 to 3 job offers (true story)`,
      html: generateSuccessStoryEmail(firstName, ats_score, section_scores),
      text: `Hi ${firstName}, I want to share Maria's story...`
    },
    hard_pitch: {
      subject: `${firstName}, ready to boost that ${ats_score}/20 score? (50% off inside)`,
      html: generateHardPitchEmail(firstName, ats_score),
      text: `Hi ${firstName}, Two weeks ago, you scored ${ats_score}/20...`
    }
  };

  return templates[type as keyof typeof templates] || templates.welcome;
}

function generateWelcomeEmail(firstName: string, score: number, sectionScores: any, missingItems: any, interpretation: string): string {
  const formatMissing = missingItems.format && missingItems.format.length > 0 ? missingItems.format[0] : null;
  const keywordsMissing = missingItems.keywords && missingItems.keywords.length > 0 ? missingItems.keywords[0] : null;
  const technicalMissing = missingItems.technical && missingItems.technical.length > 0 ? missingItems.technical[0] : null;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #1e293b;">Hi ${firstName},</h1>
      
      <div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0;">
        <h2 style="color: #1e293b; margin: 0;">Your ATS Compatibility Score: ${score}/20 (${interpretation})</h2>
      </div>

      <p>Based on your checklist results, here are your <strong>TOP 3 PRIORITY FIXES:</strong></p>

      ${formatMissing ? `
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0;">
          <h3 style="color: #92400e; margin: 0 0 10px 0;">🔧 FORMAT ISSUE: ${formatMissing}</h3>
          <p style="margin: 0; color: #92400e;">Quick fix: Place all contact information in the main document body, not in headers or footers.</p>
        </div>
      ` : ''}

      ${keywordsMissing ? `
        <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 15px 0;">
          <h3 style="color: #1e40af; margin: 0 0 10px 0;">🎯 KEYWORD ISSUE: ${keywordsMissing}</h3>
          <p style="margin: 0; color: #1e40af;">Quick fix: Include the exact job title from postings in your professional summary or experience section.</p>
        </div>
      ` : ''}

      ${technicalMissing ? `
        <div style="background: #f3e8ff; border-left: 4px solid #8b5cf6; padding: 15px; margin: 15px 0;">
          <h3 style="color: #6d28d9; margin: 0 0 10px 0;">⚡ TECHNICAL ISSUE: ${technicalMissing}</h3>
          <p style="margin: 0; color: #6d28d9;">Quick fix: Save your resume as "FirstName_LastName_Resume.pdf" instead of generic names.</p>
        </div>
      ` : ''}

      <h3 style="color: #16a34a;">WHAT YOU'RE DOING WELL:</h3>
      <ul style="color: #16a34a;">
        <li>✅ ${sectionScores.format?.score || 0}/5 formatting elements correct</li>
        <li>✅ ${sectionScores.keywords?.score || 0}/8 keyword elements correct</li>
        <li>✅ ${sectionScores.technical?.score || 0}/7 technical elements correct</li>
      </ul>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://matchrate.co/review" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Analyze Against Real Jobs →</a>
      </div>

      <p>Tomorrow I'll share the #1 mistake that gets 67% of resumes rejected.</p>

      <p>Best,<br>The MatchRate Team</p>
    </div>
  `;
}

function generateValueTipsEmail(firstName: string, score: number, sectionScores: any): string {
  const keywordIssue = sectionScores.keywords?.missing?.length > 0;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #1e293b;">Hi ${firstName},</h1>
      
      <p>Yesterday you scored ${score}/20 on our ATS checklist. Today I want to share the #1 mistake I see that kills 67% of applications:</p>

      <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0;">
        <h2 style="color: #dc2626; margin: 0;">Generic, one-size-fits-all resumes.</h2>
      </div>

      ${score < 15 ? `
        <p>Based on your score, I suspect this might be affecting you too. Here's why:</p>
      ` : `
        <p>Your score of ${score}/20 shows you understand the basics, but here's how to get to 18+:</p>
      `}

      <h3 style="color: #dc2626;">❌ WHAT MOST PEOPLE DO WRONG:</h3>
      <ul>
        <li>Use the same resume for every job</li>
        <li>List job duties instead of achievements</li>
        <li>Ignore company-specific keywords</li>
        <li>Focus on what they want vs. what employers need</li>
      </ul>

      <h3 style="color: #16a34a;">✅ WHAT WINNERS DO INSTEAD:</h3>
      <ul>
        <li>Customize the top 1/3 of their resume for each job</li>
        <li>Mirror the job description language naturally</li>
        <li>Lead with their biggest, most relevant achievement</li>
        <li>Include 3-5 keywords from the job posting</li>
      </ul>

      <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 20px 0;">
        <h3 style="color: #0369a1; margin: 0 0 15px 0;">🎯 SPECIFIC ACTION FOR YOU:</h3>
        ${keywordIssue ? `
          <p style="margin: 0; color: #0369a1;">Since you're missing keyword optimization, start by including these in your next application: the exact job title, 2-3 required skills, and 1-2 "nice to have" qualifications from the posting.</p>
        ` : `
          <p style="margin: 0; color: #0369a1;">Since your keyword game is strong, focus on quantifying your achievements. Replace every "responsible for" with a number-driven accomplishment.</p>
        `}
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://matchrate.co/review" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Job-Specific Analysis →</a>
      </div>

      <p>Tomorrow: How to decode job descriptions to find hidden keywords.</p>

      <p>Best,<br>The MatchRate Team</p>
    </div>
  `;
}

function generateSoftPitchEmail(firstName: string, score: number): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #1e293b;">Hi ${firstName},</h1>
      
      <p>Remember your ATS score of ${score}/20? I want to show you how to consistently score 18+ by decoding exactly what employers are looking for.</p>

      <p>Here's a simple 5-minute process to analyze any job description:</p>

      <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 20px 0;">
        <h3 style="color: #0369a1; margin: 0 0 15px 0;">🔍 THE KEYWORD DECODER METHOD:</h3>
        <ol style="color: #0369a1; margin: 0;">
          <li>Copy the job description into a word frequency tool</li>
          <li>Identify words that appear 3+ times</li>
          <li>Look for patterns in requirements vs. preferences</li>
          <li>Find the "power keywords" (usually 5-8 critical terms)</li>
          <li>Naturally integrate these into your resume</li>
        </ol>
      </div>

      ${score < 15 ? `
        <p>This process would help you address the gaps we identified in your checklist, especially around keyword optimization and job-specific targeting.</p>
      ` : ''}

      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0;">
        <p style="color: #92400e; margin: 0;"><strong>🎯 HERE'S THE PROBLEM:</strong> This takes 15-20 minutes per application. When you're applying to multiple positions, it becomes overwhelming.</p>
      </div>

      <p><strong>That's exactly why I built MatchRate.co.</strong></p>

      <p>Our AI does this analysis instantly. You paste in any job posting, upload your resume, and get:</p>
      <ul>
        <li>✅ Instant compatibility score (like your ${score}/20, but job-specific)</li>
        <li>✅ Missing keyword analysis</li>
        <li>✅ Specific improvement recommendations</li>
        <li>✅ Before/after comparison</li>
      </ul>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://matchrate.co/review" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Analyze Your Job Match →</a>
      </div>

      <p>Tomorrow: A success story from someone who went from ${score}/20 to landing 3 job offers.</p>

      <p>Best,<br>The MatchRate Team</p>

      <p style="font-size: 14px; color: #6b7280;"><strong>P.S.</strong> Reply with a job posting you're interested in, and I'll personally run it through our tool for free!</p>
    </div>
  `;
}

function generateSuccessStoryEmail(firstName: string, score: number, sectionScores: any): string {
  const formatIssues = sectionScores.format?.missing?.length > 0;
  const keywordIssues = sectionScores.keywords?.missing?.length > 0;
  const technicalIssues = sectionScores.technical?.missing?.length > 0;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #1e293b;">Hi ${firstName},</h1>
      
      <p>I want to share Maria's story because she started with almost the same ATS score as you (${score}/20).</p>

      <div style="background: #f8fafc; border-left: 4px solid #64748b; padding: 20px; margin: 20px 0;">
        <h3 style="color: #334155; margin: 0 0 15px 0;">📊 MARIA'S STARTING POINT:</h3>
        <ul style="color: #334155; margin: 0;">
          <li>Marketing coordinator with 3 years experience</li>
          <li>ATS checklist score: 15/20 (similar to yours!)</li>
          <li>Applied to 35+ positions over 2 months</li>
          <li>Total responses: 1 phone screening (no follow-up)</li>
        </ul>
      </div>

      <h3 style="color: #dc2626;">THE PROBLEMS WE IDENTIFIED:</h3>
      <ol>
        ${formatIssues ? '<li>Format issues (just like your checklist showed)</li>' : ''}
        ${keywordIssues ? '<li>Missing job-specific keywords (your gap area too)</li>' : ''}
        ${technicalIssues ? '<li>Technical optimization problems (also in your results)</li>' : ''}
      </ol>

      <h3 style="color: #16a34a;">🔧 WHAT WE FIXED:</h3>
      <ul>
        <li>Reformatted her resume to score 19/20 on our ATS checklist</li>
        <li>Added job-specific keywords for each application</li>
        <li>Quantified all her achievements with numbers</li>
        <li>Customized her professional summary for each role</li>
      </ul>

      <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 20px; margin: 20px 0;">
        <h3 style="color: #15803d; margin: 0 0 15px 0;">📈 THE RESULTS:</h3>
        <ul style="color: #15803d; margin: 0;">
          <li>Week 1 after optimization: 3 interview requests</li>
          <li>Week 3: 2 more interviews + 1 second round</li>
          <li>Week 5: 3 job offers (including 30% salary increase!)</li>
        </ul>
      </div>

      <div style="background: #fffbeb; border: 1px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <p style="color: #92400e; margin: 0; font-style: italic;"><strong>Maria's exact words:</strong><br>"I was doing everything wrong and didn't even know it. The ATS checklist showed me the basics, but the job-specific analysis is what actually got me interviews."</p>
      </div>

      <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 20px 0;">
        <h3 style="color: #0369a1; margin: 0 0 15px 0;">🎯 THE KEY INSIGHT:</h3>
        <p style="color: #0369a1; margin: 0;">Maria didn't get new qualifications. She just learned to communicate her existing experience in the language that ATS systems and hiring managers understand.</p>
      </div>

      ${score < 18 ? `
        <p>Since your current score is ${score}/20, you're closer than Maria was when she started. With the right optimization, you could see similar results even faster.</p>
      ` : ''}

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://matchrate.co/review" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Your Job Match Analysis →</a>
      </div>

      <p>Tomorrow: Special offer just for people who completed our ATS checklist.</p>

      <p>Best,<br>The MatchRate Team</p>
    </div>
  `;
}

function generateHardPitchEmail(firstName: string, score: number): string {
  let scoreAssessment = '';
  if (score < 15) {
    scoreAssessment = `Your score of ${score}/20 means your resume needs optimization to consistently pass ATS filters. The good news? You're aware of the issues and can fix them.`;
  } else if (score < 18) {
    scoreAssessment = `Your score of ${score}/20 is good, but you're missing the final tweaks that separate you from the 95% who get rejected. You're so close to optimization success.`;
  } else {
    scoreAssessment = `Your score of ${score}/20 is excellent! You understand ATS basics. Now let's get you job-specific optimization to land interviews faster.`;
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #1e293b;">Hi ${firstName},</h1>
      
      <p>Two weeks ago, you scored ${score}/20 on our ATS compatibility checklist.</p>

      <p>Since then, I've shared:</p>
      <ul>
        <li>✅ Your personalized priority fixes</li>
        <li>✅ The #1 mistake that kills 67% of applications</li>
        <li>✅ The 5-minute job description decoder method</li>
        <li>✅ Maria's success story (similar starting score → 3 offers)</li>
      </ul>

      <p>Now I want to help YOU get similar results.</p>

      <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 20px 0;">
        <h3 style="color: #0369a1; margin: 0 0 15px 0;">🎯 HERE'S WHERE YOU STAND:</h3>
        <p style="color: #0369a1; margin: 0;">${scoreAssessment}</p>
      </div>

      <h3>You have two choices:</h3>

      <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0;">
        <h4 style="color: #dc2626; margin: 0 0 15px 0;">❌ Option 1: Keep manually optimizing</h4>
        <ul style="color: #dc2626; margin: 0;">
          <li>Research keywords for each job (20+ minutes per application)</li>
          <li>Guess which changes will improve your ${score}/20 score</li>
          <li>Hope your resume makes it past ATS filters</li>
          <li>Wait weeks for responses</li>
        </ul>
      </div>

      <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin: 0 0 15px 0;">✅ Option 2: Get the same tools that helped Maria</h4>
        <ul style="color: #15803d; margin: 0;">
          <li>Instant AI analysis against any job description</li>
          <li>See exactly how to improve your score to 18-20/20</li>
          <li>Get specific keyword recommendations in seconds</li>
          <li>Track your optimization progress over time</li>
        </ul>
      </div>

      <div style="background: linear-gradient(135deg, #fbbf24, #f59e0b); color: white; padding: 30px; margin: 30px 0; border-radius: 10px; text-align: center;">
        <h2 style="margin: 0 0 15px 0;">🚀 SPECIAL OFFER - 50% OFF FIRST MONTH</h2>
        <p style="margin: 0 0 20px 0;">Because you completed our ATS checklist, you get exclusive pricing:</p>
        <div style="font-size: 24px; margin: 20px 0;">
          <span style="text-decoration: line-through; opacity: 0.7;">$29/month</span> 
          <span style="font-weight: bold; font-size: 32px; margin-left: 10px;">$14.50</span> 
          <span>for your first month</span>
        </div>
        <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 5px; margin: 20px 0;">
          <div>✅ Unlimited job-specific resume analysis</div>
          <div>✅ Real-time ATS scoring (improve your ${score}/20)</div>
          <div>✅ Keyword optimization recommendations</div>
          <div>✅ Interview prediction analytics</div>
        </div>
        <p style="color: #fef3c7; margin: 20px 0; font-weight: bold;">This offer expires in 48 hours.</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://matchrate.co/auth?offer=50off" style="background: #dc2626; color: white; padding: 20px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; display: inline-block;">Claim 50% Off Now →</a>
      </div>

      <div style="background: #f8fafc; border-left: 4px solid #64748b; padding: 20px; margin: 20px 0;">
        <h3 style="color: #334155; margin: 0 0 15px 0;">📊 WHAT HAPPENS NEXT:</h3>
        <ol style="color: #334155; margin: 0;">
          <li>Upload your current resume</li>
          <li>Paste any job description</li>
          <li>Get instant compatibility score + specific improvements</li>
          <li>Apply with confidence knowing you'll score 18+/20</li>
        </ol>
      </div>

      <p style="text-align: center; font-weight: bold; color: #16a34a;">30-day money-back guarantee. If you don't see improved response rates, full refund.</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://matchrate.co/auth?offer=50off" style="background: #16a34a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Started for $14.50 →</a>
      </div>

      <p>Best,<br>The MatchRate Team<br>Founder, MatchRate.co</p>

      <p style="font-size: 14px; color: #6b7280;"><strong>P.S.</strong> The average job search takes 5-6 months. If MatchRate.co helps you land a job just ONE month faster, you save thousands in lost income. Your ${score}/20 score shows you're motivated to improve - now get the tools to do it efficiently.</p>
    </div>
  `;
}

async function scheduleFollowUpEmails(subscriberId: string) {
  const delays = [
    { type: 'value_tips', delay: 24 * 60 * 60 * 1000 }, // 24 hours
    { type: 'soft_pitch', delay: 72 * 60 * 60 * 1000 }, // 72 hours
    { type: 'success_story', delay: 7 * 24 * 60 * 60 * 1000 }, // 7 days
    { type: 'hard_pitch', delay: 14 * 24 * 60 * 60 * 1000 } // 14 days
  ];

  // Note: In a production environment, you'd want to use a proper job queue
  // For now, we'll create a simple scheduler edge function to handle these
  for (const email of delays) {
    setTimeout(async () => {
      try {
        await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/ats-email-automation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`
          },
          body: JSON.stringify({
            type: email.type,
            subscriberId: subscriberId
          })
        });
      } catch (error) {
        console.error(`Failed to send ${email.type} email:`, error);
      }
    }, email.delay);
  }
}

serve(handler);
