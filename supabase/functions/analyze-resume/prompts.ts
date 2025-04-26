
// Role-specific prompts for different job types
const rolePrompts: Record<string, string> = {
  "Product Manager": "You are reviewing a resume for a Product Manager at a tech company. Focus on product strategy, metrics, cross-functional leadership, and measurable outcomes.",
  "UX Designer": "You are reviewing a resume for a UX Designer. Emphasize design thinking, user research, prototyping, and impact on user experience.",
  "Data Analyst": "You are reviewing a resume for a Data Analyst. Highlight statistical analysis, data visualization, SQL skills, and business insights.",
  "Software Engineer": "You are reviewing a resume for a Software Engineer. Focus on technical skills, programming languages, system design, and project impact.",
  "Consultant": "You are reviewing a resume for a Business Consultant. Emphasize problem-solving, strategic thinking, client management, and quantifiable results."
};

export function buildAnalysisPrompt(selectedRole: string, effectiveJobDescription: string, resume: string) {
  return [
    {
      role: 'system',
      content: `${rolePrompts[selectedRole] || rolePrompts["Product Manager"]} 
        Provide brutally honest, structured feedback focusing on: relevance score, missing keywords, section-by-section critique, STAR-format bullet improvements, tone suggestions, and a clear interview recommendation. 
        Format your response as JSON with the following fields: 
        - score (number between 0-100)
        - missingKeywords (array of strings)
        - sectionFeedback (object with section names as keys and feedback as string values)
        - weakBullets (array of objects with "original" and "improved" properties)
        - toneSuggestions (string)
        - wouldInterview (string)
        Ensure all fields are properly formatted for JSON parsing.`
    },
    {
      role: 'user',
      content: `Job Description:\n${effectiveJobDescription || 'No specific job description provided'}\n\nResume:\n${resume}`
    }
  ];
}

export function buildRewritePrompt(resume: string, jobDescription: string, companyType: string, selectedRole: string) {
  return [
    {
      role: 'system',
      content: `You are a professional resume writer tasked with creating a complete, ATS-optimized resume tailored for the job description provided. Create a full professional resume with these sections in this exact order:

      1. PROFESSIONAL SUMMARY (3-4 lines that highlight career focus, key achievements and relevant experience)
      
      2. EXPERIENCE (maintain chronology and company names from original resume)
         - Create powerful bullet points using the STAR format INTERNALLY (but do NOT label or mention the STAR format in the output)
         - Every bullet MUST start with a STRONG PAST-TENSE ACTION VERB
         - Every bullet MUST include MEASURABLE RESULTS (%, $, efficiency gains, etc.)
         - Avoid repetition and ensure each bullet shows unique value
      
      3. SKILLS (create a clean, focused technical and soft skills section organized by category)
         - Focus on keywords from the job description
         - Present in a clean, scannable format (comma-separated or organized by category)
      
      4. EDUCATION (clean formatting of highest degrees, relevant coursework if applicable)
      
      5. CERTIFICATIONS (if present in original resume)
      
      FORMAT REQUIREMENTS:
      - Use clean, professional formatting suitable for ATS systems
      - Maintain consistent date formats
      - Bold company names and job titles
      - Use standard section headers
      - Keep the resume concise and focused on one page worth of content
      - Never mention or label the STAR format in the output
      
      RESUME CREATION RULES:
      - Preserve the person's actual work history timeline and employers
      - Enhance bullet points but maintain truthfulness to their background
      - Customize content to highlight skills and experiences most relevant to the target job
      - Use keywords from the job description naturally throughout the resume
      - Focus on impact and achievements, not just responsibilities
      
      FINAL OUTPUT FORMAT:
      - Present the resume in clean, professional markdown format
      - Structure in sections with clear headings
      - Include a one-line statement at the end stating: "This resume is optimized for: [Job Title] focusing on [Key Skill 1], [Key Skill 2], and [Key Skill 3]"
      - Ensure the entire resume is properly formatted for PDF/DOCX export`
    },
    {
      role: 'user',
      content: `Job Description:\n${jobDescription}\n\nResume to Rewrite:\n${resume}\n\nJob Title: ${selectedRole || "Not specified"}`
    }
  ];
}
