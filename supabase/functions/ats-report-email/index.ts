
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ATSSubmission {
  submissionId: string;
  name: string;
  email: string;
  totalScore: number;
  sectionScores: Record<string, { score: number; maxScore: number }>;
  completedItems: Record<string, string[]>;
  missingItems: Record<string, string[]>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { 
      submissionId, 
      name, 
      email, 
      totalScore, 
      sectionScores, 
      completedItems, 
      missingItems 
    }: ATSSubmission = await req.json()

    // Generate PDF content
    const pdfContent = generatePDFContent({
      name,
      totalScore,
      sectionScores,
      completedItems,
      missingItems
    });

    // Prepare email content
    const subject = `Your ATS Resume Report - ${totalScore}/20 Points`
    const htmlContent = generateEmailHTML({
      name,
      totalScore,
      sectionScores,
      completedItems,
      missingItems
    });

    // Send email using Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not found')
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'support@matchrate.co',
        to: [email],
        subject: subject,
        html: htmlContent,
        // Note: For now sending HTML report, PDF generation would require additional setup
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      throw new Error(`Email send failed: ${errorText}`)
    }

    const emailResult = await emailResponse.json()
    console.log('Email sent successfully:', emailResult)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Report sent successfully',
        emailId: emailResult.id 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in ats-report-email function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500
      }
    )
  }
})

function generateEmailHTML(data: {
  name: string;
  totalScore: number;
  sectionScores: Record<string, { score: number; maxScore: number }>;
  completedItems: Record<string, string[]>;
  missingItems: Record<string, string[]>;
}): string {
  const { name, totalScore, sectionScores, completedItems, missingItems } = data;
  
  const getScoreInterpretation = (score: number) => {
    if (score >= 18) return { label: 'Excellent! ATS Ready', color: '#10b981', recommendation: 'Your resume is in great shape for ATS systems!' };
    if (score >= 15) return { label: 'Good - Minor tweaks needed', color: '#3b82f6', recommendation: 'A few small improvements will make your resume even stronger.' };
    if (score >= 12) return { label: 'Needs Work - Several improvements', color: '#f59e0b', recommendation: 'Focus on the missing items below to improve your ATS compatibility.' };
    if (score >= 8) return { label: 'Requires Major Changes', color: '#f97316', recommendation: 'Your resume needs significant improvements to pass ATS filters.' };
    return { label: 'Critical - Complete Overhaul Needed', color: '#ef4444', recommendation: 'Major revision required. Start with the basics first.' };
  };

  const interpretation = getScoreInterpretation(totalScore);

  const sectionNames: Record<string, string> = {
    format: 'Format & Structure',
    keywords: 'Keywords & Content',
    technical: 'Technical Details'
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your ATS Resume Report</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; }
        .logo { background: rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 8px; font-weight: bold; display: inline-block; margin-bottom: 15px; }
        .score-circle { width: 100px; height: 100px; border-radius: 50%; background: rgba(255,255,255,0.2); margin: 20px auto; display: flex; align-items: center; justify-content: center; }
        .score-number { font-size: 24px; font-weight: bold; }
        .content { padding: 30px; }
        .section { margin-bottom: 30px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
        .section-header { background: #f8fafc; padding: 15px; border-bottom: 1px solid #e5e7eb; }
        .section-title { font-weight: bold; font-size: 16px; margin: 0; }
        .section-score { color: #6b7280; font-size: 14px; }
        .section-content { padding: 15px; }
        .item-list { margin: 0; padding: 0; list-style: none; }
        .item-list li { padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
        .item-list li:last-child { border-bottom: none; }
        .completed { color: #10b981; }
        .missing { color: #ef4444; }
        .cta { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 25px; text-align: center; margin-top: 30px; }
        .cta a { color: #60a5fa; text-decoration: none; font-weight: bold; }
        .interpretation { background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">MatchRate</div>
          <h1>Your ATS Resume Report</h1>
          <div class="score-circle">
            <div class="score-number">${totalScore}/20</div>
          </div>
          <p>Hi ${name}, here's your personalized ATS compatibility analysis!</p>
        </div>

        <div class="content">
          <div class="interpretation">
            <h2 style="color: ${interpretation.color}; margin-top: 0;">${interpretation.label}</h2>
            <p style="margin-bottom: 0;">${interpretation.recommendation}</p>
          </div>

          ${Object.entries(sectionScores).map(([sectionId, scores]) => `
            <div class="section">
              <div class="section-header">
                <div class="section-title">${sectionNames[sectionId] || sectionId}</div>
                <div class="section-score">${scores.score}/${scores.maxScore} completed</div>
              </div>
              <div class="section-content">
                ${completedItems[sectionId]?.length > 0 ? `
                  <h4 style="color: #10b981; margin-top: 0;">✅ Completed Items:</h4>
                  <ul class="item-list">
                    ${completedItems[sectionId].map(item => `<li class="completed">✓ ${item}</li>`).join('')}
                  </ul>
                ` : ''}
                
                ${missingItems[sectionId]?.length > 0 ? `
                  <h4 style="color: #ef4444; margin-top: ${completedItems[sectionId]?.length > 0 ? '20px' : '0'};">❌ Missing Items:</h4>
                  <ul class="item-list">
                    ${missingItems[sectionId].map(item => `<li class="missing">○ ${item}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            </div>
          `).join('')}

          <div class="cta">
            <h3>🚀 Ready for Advanced Analysis?</h3>
            <p>Want to see your exact match score for specific jobs? Get instant AI-powered analysis at:</p>
            <p><a href="https://matchrate.co">www.MatchRate.co</a></p>
            <p style="font-size: 14px; margin-top: 15px;">✓ Instant job-specific scoring ✓ Keyword gap analysis ✓ Industry benchmarking</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generatePDFContent(data: any): string {
  // This would be used for PDF generation in the future
  // For now, we're using the HTML email format
  return "PDF generation placeholder";
}
